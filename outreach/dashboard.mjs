#!/usr/bin/env node
/**
 * DentDigital local dashboard — sales pipeline + ads + CRM, all fetched live.
 * Serves http://127.0.0.1:4321 (localhost only, no auth).
 *
 * Usage:  node outreach/dashboard.mjs   (or: npm run dash)
 * Launcher: "DentDigital Dashboard.command" on Desktop.
 *
 * Data sources:
 *  - outreach/clinics.csv + call-list.csv          (pipeline statuses)
 *  - ~/.dentdigital/outreach/sent.log              (email\tclinic\tISO\tid)
 *  - ~/.dentdigital/outreach/replies.log           (email\tclinic\tdate\tsubject)
 *  - ~/.dentdigital/outreach/crm-sync.log          (funnel sync runs)
 *  - GDTS-secrets.env                              (META_ACCESS_TOKEN, GOOGLE_SERVICE_ACCOUNT_KEY)
 *  - Meta Graph API v21.0                          (ads insights)
 *  - Google Sheets                                 (clinic CRM tabs)
 */
import { readFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(DIR, "..");
const HOME_DD = resolve(process.env.HOME, ".dentdigital");
const PORT = 4321;

// ---------- client clinics (extend when onboarding a new clinic) ----------
const CLIENTS = [
  {
    slug: "groruddalen-tannlegesenter",
    name: "Groruddalen Tannlegesenter",
    spreadsheetId: "16KgjmLMZ74I_6R0Y09xIcjjt1jJg7Ag45b3K3JmwY2U",
    sheetRange: "US!A:AR",
    cols: { date: 0, name: 2, phone: 4, status: 7, synced: 14 },
    adAccount: "act_1038891708488721",
    leadPrice: 590,
    // custom conversion IDs that count as a "lead" (primary exam_lead only,
    // to avoid double counting the duplicate conversion + appointment_booked)
    leadConversionIds: ["27495697480089485"],
  },
];

// ---------- secrets ----------
function secrets() {
  const txt = readFileSync(resolve(ROOT, "GDTS-secrets.env"), "utf8");
  const metaToken = txt.match(/^META_ACCESS_TOKEN='?"?([^'"\n]+)/m)?.[1];
  const gKey = txt.match(/GOOGLE_SERVICE_ACCOUNT_KEY='?(\{.*?\})'?\s*$/m)?.[1];
  return { metaToken, gKey };
}

// ---------- CSV parser (same dialect as send.mjs) ----------
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); field = ""; if (row.some(f => f.trim())) rows.push(row); row = []; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); if (row.some(f => f.trim())) rows.push(row); }
  return rows;
}

const readIf = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");

// ---------- pipeline (local files) ----------
function pipeline() {
  const sentLog = readIf(resolve(HOME_DD, "outreach", "sent.log")) || readIf(resolve(DIR, "sent.log"));
  const sentRows = sentLog.trim() ? sentLog.trim().split("\n").map(l => l.split("\t")) : [];

  // emails per day, last 14 days
  const perDay = {};
  for (const r of sentRows) {
    const day = (r[2] || "").slice(0, 10);
    if (day) perDay[day] = (perDay[day] || 0) + 1;
  }
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    days.push({ day: d.slice(5), sent: perDay[d] || 0 });
  }

  const repliesLog = readIf(resolve(HOME_DD, "outreach", "replies.log"));
  const replies = repliesLog.trim()
    ? repliesLog.trim().split("\n").map(l => {
        const [email, clinic, date, subject = ""] = l.split("\t");
        return { email, clinic, date, auto: subject.startsWith("[AUTO]") };
      })
    : [];
  const realReplies = replies.filter(r => !r.auto);

  // clinics.csv statuses — LIVE queue first (what the drip sender actually reads)
  const clin = parseCsv(readIf(resolve(HOME_DD, "outreach", "clinics.csv")) || readIf(resolve(DIR, "clinics.csv")));
  const statuses = { total: 0, replied: 0, ready: 0, other: 0 };
  for (const r of clin.slice(1)) {
    statuses.total++;
    const s = (r[6] || "").toLowerCase();
    if (s.includes("replied")) statuses.replied++;
    else if (s.includes("ready")) statuses.ready++;
    else statuses.other++;
  }

  // call list: rows with a "neste" action
  const calls = parseCsv(readIf(resolve(DIR, "call-list.csv")));
  const callsDue = calls.slice(1)
    .filter(r => (r[6] || "").trim())
    .map(r => ({ clinic: r[0], city: r[1], phone: r[2], action: r[6] }));

  // last drip run from cron.log — LIVE log first
  const cron = readIf(resolve(HOME_DD, "outreach", "cron.log")) || readIf(resolve(DIR, "cron.log"));
  const lastRun = cron.match(/=====\s*([^=]+?)\s+run \(limit (\d+), remaining (\S+)\)/g)?.pop() || null;

  return {
    emailsSent: sentRows.length,
    sentPerDay: days,
    replies: realReplies.length,
    autoReplies: replies.length - realReplies.length,
    replyRate: sentRows.length ? Math.round((realReplies.length / sentRows.length) * 1000) / 10 : 0,
    latestReplies: realReplies.slice(-8).reverse(),
    prospects: statuses,
    callsDue,
    lastDripRun: lastRun,
  };
}

// ---------- new establishments (BRREG monitor) ----------
function newClinics() {
  const p = resolve(HOME_DD, "outreach", "new-clinics-state.json");
  if (!existsSync(p)) return { lastRun: null, queued: 0, callList: 0, skipped: 0, recent: [] };
  const state = JSON.parse(readFileSync(p, "utf8"));
  const entries = Object.entries(state.seen || {}).map(([orgnr, e]) => ({ orgnr, ...e }));
  const actionable = entries
    .filter(e => e.action === "queued" || e.action === "call-list")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return {
    lastRun: state.lastRun,
    total: entries.length,
    queued: entries.filter(e => e.action === "queued").length,
    callList: entries.filter(e => e.action === "call-list").length,
    skipped: entries.filter(e => /skip|dup|exhausted/.test(e.action || "")).length,
    recent: actionable.slice(0, 15),
  };
}

// ---------- Meta ads ----------
async function metaAds(token) {
  const out = [];
  for (const c of CLIENTS) {
    const base = `https://graph.facebook.com/v21.0/${c.adAccount}`;
    const insightsFields = "spend,impressions,actions";
    const leadTypes = new Set(c.leadConversionIds.map(id => `offsite_conversion.custom.${id}`));
    const leadCount = (actions = []) =>
      actions.filter(a => leadTypes.has(a.action_type)).reduce((s, a) => s + Number(a.value), 0);
    const lpv = (actions = []) =>
      actions.filter(a => a.action_type === "landing_page_view").reduce((s, a) => s + Number(a.value), 0);

    const get = async (url) => {
      const r = await fetch(url);
      const j = await r.json();
      if (j.error) throw new Error(j.error.message);
      return j;
    };

    const [life, week, today, ads] = await Promise.all([
      get(`${base}/insights?fields=${insightsFields}&date_preset=maximum&access_token=${token}`),
      get(`${base}/insights?fields=${insightsFields}&date_preset=last_7d&access_token=${token}`),
      get(`${base}/insights?fields=${insightsFields}&date_preset=today&access_token=${token}`),
      get(`${base}/ads?fields=name,effective_status,adset{name,daily_budget},insights.date_preset(maximum){spend,actions}&limit=50&access_token=${token}`),
    ]);

    const period = (d) => {
      const row = d.data?.[0] || {};
      const leads = leadCount(row.actions);
      const spend = Number(row.spend || 0);
      return {
        spend: Math.round(spend),
        impressions: Number(row.impressions || 0),
        lpv: lpv(row.actions),
        leads,
        cpl: leads ? Math.round(spend / leads) : null,
      };
    };

    const adRows = (ads.data || []).map(a => {
      const ins = a.insights?.data?.[0] || {};
      const leads = leadCount(ins.actions);
      const spend = Number(ins.spend || 0);
      return {
        name: a.name,
        adset: a.adset?.name || "",
        status: a.effective_status,
        spend: Math.round(spend),
        leads,
        cpl: leads ? Math.round(spend / leads) : null,
      };
    }).sort((a, b) => (a.status === "ACTIVE" ? -1 : 1) - (b.status === "ACTIVE" ? -1 : 1) || b.spend - a.spend);

    out.push({ clinic: c.name, lifetime: period(life), last7d: period(week), today: period(today), ads: adRows });
  }
  return out;
}

// ---------- CRM (Google Sheets) ----------
async function crm(gKey) {
  const require = createRequire(resolve(ROOT, "package.json"));
  const { GoogleAuth } = require("google-auth-library");
  const auth = new GoogleAuth({
    credentials: JSON.parse(gKey),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const token = (await (await auth.getClient()).getAccessToken()).token;

  const out = [];
  for (const c of CLIENTS) {
    const r = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${c.spreadsheetId}/values/${encodeURIComponent(c.sheetRange)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const { values = [] } = await r.json();
    const rows = values.slice(1).filter(v => (v[c.cols.date] || "").trim());

    const statusDist = {};
    const perDay = {};
    const followUps = [];
    let booked = 0, synced = 0;
    for (const v of rows) {
      const status = (v[c.cols.status] || "Ukjent").trim();
      statusDist[status] = (statusDist[status] || 0) + 1;
      const st = status.toLowerCase();
      if (st === "booket til time" || st.startsWith("møtte")) booked++;
      if (/✓/.test(v[c.cols.synced] || "")) synced++;
      if (st === "følg opp" || st === "ikke fått kontakt")
        followUps.push({ date: v[c.cols.date], name: v[c.cols.name], phone: v[c.cols.phone], status });
      // dd/mm/yyyy → iso day
      const m = (v[c.cols.date] || "").match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (m) {
        const iso = `${m[3]}-${m[2]}-${m[1]}`;
        perDay[iso] = (perDay[iso] || 0) + 1;
      }
    }
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      days.push({ day: d.slice(5), leads: perDay[d] || 0 });
    }

    out.push({
      clinic: c.name,
      totalLeads: rows.length,
      booked,
      bookingRate: rows.length ? Math.round((booked / rows.length) * 100) : 0,
      syncedToMeta: synced,
      statusDist: Object.entries(statusDist).sort((a, b) => b[1] - a[1]),
      leadsPerDay: days,
      followUps: followUps.slice(-10).reverse(),
    });
  }
  return out;
}

// ---------- ops ----------
function ops() {
  const syncLog = readIf(resolve(HOME_DD, "outreach", "crm-sync.log")).trim().split("\n").filter(Boolean);
  const last = syncLog.at(-1) || null;
  const ageH = (p) => (existsSync(p) ? Math.round((Date.now() - +new Date(readFileSync(p, "utf8").trim().split("\n").at(-1)?.split("\t")[2] || 0)) / 36e5) : null);
  return {
    lastCrmSync: last,
    crmSyncRuns24h: syncLog.filter(l => l.startsWith(new Date().toISOString().slice(0, 10)) || l.startsWith(new Date(Date.now() - 864e5).toISOString().slice(0, 10))).length,
    sentLogAgeHours: ageH(resolve(HOME_DD, "outreach", "sent.log")),
  };
}

// ---------- aggregate ----------
async function collect() {
  const { metaToken, gKey } = secrets();
  const wrap = async (fn) => {
    try { return { ok: true, data: await fn() }; }
    catch (e) { return { ok: false, error: String(e.message || e) }; }
  };
  const [pipe, adsRes, crmRes, opsRes, newRes] = await Promise.all([
    wrap(async () => pipeline()),
    wrap(() => metaAds(metaToken)),
    wrap(() => crm(gKey)),
    wrap(async () => ops()),
    wrap(async () => newClinics()),
  ]);
  return { generatedAt: new Date().toISOString(), pipeline: pipe, ads: adsRes, crm: crmRes, ops: opsRes, newClinics: newRes };
}

// ---------- HTML ----------
const HTML = `<!doctype html>
<html lang="no"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DentDigital Dashboard</title>
<style>
  :root{--bg:#0a0e13;--card:#11161d;--card2:#151c25;--line:#212b37;--txt:#e8eef4;--dim:#8b98a5;--acc:#4da3ff;--acc2:#2f7fd6;--ok:#3fb950;--warn:#d29922;--bad:#f85149}
  *{box-sizing:border-box;margin:0}
  html{scrollbar-color:var(--line) transparent}
  body{background:var(--bg);color:var(--txt);font:14px/1.5 -apple-system,system-ui,sans-serif;margin:0 auto;max-width:1280px;padding:0 24px 48px}
  body{background-image:radial-gradient(1200px 400px at 50% -100px,#12253d55,transparent)}
  header{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:14px;padding:14px 0;margin-bottom:18px;
    background:linear-gradient(#0a0e13f2,#0a0e13e6);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
  .logo{width:10px;height:10px;border-radius:3px;background:linear-gradient(135deg,var(--acc),#7bd88f);box-shadow:0 0 12px #4da3ff88}
  h1{font-size:17px;font-weight:650;letter-spacing:-.01em}
  h1 span{color:var(--dim);font-weight:400}
  button{background:linear-gradient(180deg,var(--acc),var(--acc2));border:0;color:#04121f;font-weight:650;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:13px}
  button:hover{filter:brightness(1.1)}
  button:disabled{opacity:.5}
  #refresh{margin-left:auto}
  .tabs{display:flex;gap:3px;background:var(--card2);border:1px solid var(--line);border-radius:10px;padding:3px;margin-left:10px}
  .tab{background:none;color:var(--dim);font-weight:600;padding:5px 16px;border-radius:8px;font-size:13px}
  .tab:hover{filter:none;color:var(--txt)}
  .tab.active{background:linear-gradient(180deg,var(--acc),var(--acc2));color:#04121f}
  .stamp{color:var(--dim);font-size:12px;font-variant-numeric:tabular-nums}
  /* hero KPI strip */
  #hero{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:16px}
  .tile{background:linear-gradient(180deg,var(--card2),var(--card));border:1px solid var(--line);border-radius:12px;padding:14px 16px}
  .tile .v{font-size:26px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
  .tile .v small{font-size:14px;font-weight:500;color:var(--dim)}
  .tile .l{font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.07em;margin-top:2px}
  .tile .s{font-size:11px;margin-top:4px;color:var(--dim)}
  /* card grid */
  .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;grid-column:span 6;min-width:0}
  .card.wide{grid-column:1/-1}
  @media(max-width:900px){.card{grid-column:1/-1}}
  h2{font-size:12px;text-transform:uppercase;letter-spacing:.09em;color:var(--dim);margin-bottom:14px;display:flex;align-items:center;gap:8px}
  h2::after{content:"";flex:1;height:1px;background:var(--line)}
  .kpis{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
  .kpi{background:var(--card2);border:1px solid var(--line);border-radius:10px;padding:8px 14px;flex:1;min-width:110px}
  .kpi .v{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
  .kpi .l{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
  /* tables */
  .scroll{max-height:300px;overflow-y:auto;margin:0 -6px;padding:0 6px}
  .scroll::-webkit-scrollbar{width:8px}
  .scroll::-webkit-scrollbar-thumb{background:var(--line);border-radius:4px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;color:var(--dim);font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.05em;
    padding:6px 10px 6px 0;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--card);z-index:1}
  td{padding:7px 10px 7px 0;border-bottom:1px solid #1a232e;vertical-align:middle}
  tr:last-child td{border-bottom:0}
  tbody tr:hover td{background:#ffffff06}
  td.num{font-variant-numeric:tabular-nums;white-space:nowrap}
  td.dt{color:var(--dim);white-space:nowrap;font-variant-numeric:tabular-nums;font-size:12px}
  .sub{color:var(--dim);font-size:12px}
  /* charts */
  .bars{display:flex;align-items:flex-end;gap:4px;height:70px;margin:14px 0 2px}
  .bars div{flex:1;background:linear-gradient(180deg,var(--acc),var(--acc2));border-radius:3px 3px 0 0;min-height:2px;position:relative;opacity:.9}
  .bars div:hover{opacity:1}
  .bars div span{position:absolute;top:-17px;left:50%;transform:translateX(-50%);font-size:10px;color:var(--dim);font-variant-numeric:tabular-nums}
  .axis{display:flex;gap:4px;font-size:9px;color:var(--dim);margin-bottom:4px}
  .axis div{flex:1;text-align:center;overflow:hidden;white-space:nowrap}
  .ok{color:var(--ok)}.warn{color:var(--warn)}.bad{color:var(--bad)}.dim{color:var(--dim)}
  .err{color:var(--bad);font-size:13px}
  .pill{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:550;border:1px solid var(--line);color:var(--dim);white-space:nowrap}
  .pill::before{content:"";width:6px;height:6px;border-radius:99px;background:currentColor}
  .pill.g{color:var(--ok);border-color:#3fb95044;background:#3fb95011}
  .pill.y{color:var(--warn);border-color:#d2992244;background:#d2992211}
  .pill.r{color:var(--bad);border-color:#f8514944;background:#f8514911}
  .statgrid{display:grid;grid-template-columns:1fr 1fr;gap:0 24px}
  @media(max-width:700px){.statgrid{grid-template-columns:1fr}}
  .rowbar{display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid #1a232e;font-size:13px}
  .rowbar:last-child{border-bottom:0}
  .rowbar .n{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .rowbar .b{height:6px;border-radius:3px;background:linear-gradient(90deg,var(--acc),var(--acc2));min-width:2px}
  .rowbar .c{font-variant-numeric:tabular-nums;color:var(--dim);width:28px;text-align:right}
</style></head><body>
<header>
  <div class="logo"></div>
  <h1>DentDigital <span>· dashbord</span></h1>
  <div class="tabs">
    <button class="tab" data-v="sales" onclick="setView('sales')">Salg</button>
    <button class="tab" data-v="ads" onclick="setView('ads')">Annonser</button>
  </div>
  <button id="refresh" onclick="load()">↻ Oppdater</button>
  <span class="stamp" id="stamp"></span>
</header>
<div id="hero"></div>
<div class="grid" id="grid"><div class="card wide">Laster…</div></div>
<script>
const nok = n => n==null ? "–" : new Intl.NumberFormat("no").format(n)+" kr";
const esc = s => String(s??"").replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
// "2026-07-20" | "20/07/2026" | RFC dates → "20.07"
function dt(s){
  if(!s) return "–";
  let m = String(s).match(/(\\d{4})-(\\d{2})-(\\d{2})/); if(m) return m[3]+"."+m[2];
  m = String(s).match(/(\\d{2})\\/(\\d{2})\\/(\\d{4})/); if(m) return m[1]+"."+m[2];
  const d = new Date(s); return isNaN(d) ? esc(String(s).slice(0,10)) : String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0");
}
function bars(data, key){
  const max = Math.max(...data.map(d=>d[key]), 1);
  return '<div class="bars">'+data.map(d=>
    '<div title="'+d.day+': '+d[key]+'" style="height:'+Math.round(d[key]/max*100)+'%">'+(d[key]?'<span>'+d[key]+'</span>':'')+'</div>').join('')+
    '</div><div class="axis">'+data.map(d=>'<div>'+d.day.slice(3)+'</div>').join('')+'</div>';
}
function kpi(v,l){ return '<div class="kpi"><div class="v">'+v+'</div><div class="l">'+l+'</div></div>'; }
function tile(v,l,s){ return '<div class="tile"><div class="v">'+v+'</div><div class="l">'+l+'</div>'+(s?'<div class="s">'+s+'</div>':'')+'</div>'; }
function panel(title, ok, inner, err, wide){
  return '<div class="card'+(wide?' wide':'')+'"><h2>'+title+'</h2>'+
    (ok ? inner : '<div class="err">Feil: '+esc(err)+'</div>')+'</div>';
}

let DATA = null;
let view = localStorage.getItem("ddview") || "sales";

function setView(v){
  view = v; localStorage.setItem("ddview", v);
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active", b.dataset.v===v));
  if(DATA) render(DATA);
}

function render(d){
  const p = d.pipeline?.data||{}, n = d.newClinics?.data||{}, o = d.ops?.data||{};
  const a0 = d.ads?.data?.[0], c0 = d.crm?.data?.[0];

  let hero = "";
  let h = "";

  if(view === "ads"){
    // ---- hero: annonser ----
    if(a0) hero += tile(nok(a0.last7d.spend),"Forbruk 7 d","i dag: "+nok(a0.today.spend))
                 + tile(a0.last7d.leads,"Leads 7 d","i dag: "+a0.today.leads)
                 + tile(a0.last7d.cpl?nok(a0.last7d.cpl):"–","CPL 7 d","totalt: "+(a0.lifetime.cpl?nok(a0.lifetime.cpl):"–"))
                 + tile(nok(a0.lifetime.spend),"Forbruk totalt",a0.lifetime.leads+" leads totalt");
    if(c0) hero += tile(c0.bookingRate+"<small>%</small>","Bookingrate",c0.booked+" av "+c0.totalLeads+" leads");

    // ads (wide)
    for(const a of (d.ads?.data||[])){
      h += panel("Annonser · "+esc(a.clinic), true,
        '<div class="kpis">'+
          kpi(nok(a.today.spend),"i dag")+kpi(a.today.leads,"leads i dag")+
          kpi(nok(a.last7d.spend),"7 dager")+kpi(a.last7d.leads,"leads 7 d")+
          kpi(nok(a.lifetime.spend),"totalt")+kpi(a.lifetime.leads,"leads totalt")+
        '</div>'+
        '<div class="scroll"><table><thead><tr><th>Annonse</th><th>Status</th><th style="text-align:right">Forbruk</th><th style="text-align:right">Leads</th><th style="text-align:right">CPL</th></tr></thead><tbody>'+
        a.ads.map(ad=>'<tr><td>'+esc(ad.name)+'<div class="sub">'+esc(ad.adset)+'</div></td>'+
          '<td><span class="pill '+(ad.status==="ACTIVE"?"g":"")+'">'+(ad.status==="ACTIVE"?"aktiv":"pauset")+'</span></td>'+
          '<td class="num" style="text-align:right">'+nok(ad.spend)+'</td><td class="num" style="text-align:right">'+ad.leads+'</td>'+
          '<td class="num" style="text-align:right">'+(ad.cpl?nok(ad.cpl):"–")+'</td></tr>').join('')+'</tbody></table></div>', null, true);
    }
    if(d.ads && !d.ads.ok) h += panel("Annonser", false, "", d.ads.error, true);

    // crm (wide)
    for(const c of (d.crm?.data||[])){
      const maxS = Math.max(...c.statusDist.map(s=>s[1]),1);
      h += panel("CRM · "+esc(c.clinic), true,
        '<div class="kpis">'+
          kpi(c.totalLeads,"leads totalt")+kpi(c.booked,"booket")+
          kpi(c.bookingRate+" %","bookingrate")+kpi(c.syncedToMeta,"synket til Meta")+
        '</div>'+bars(c.leadsPerDay||[], "leads")+
        '<div class="statgrid" style="margin-top:14px">'+
        '<div><h2 style="margin-bottom:8px">Status</h2>'+
          c.statusDist.map(s=>'<div class="rowbar"><span class="n">'+esc(s[0])+'</span><span class="b" style="width:'+Math.round(s[1]/maxS*90)+'px"></span><span class="c">'+s[1]+'</span></div>').join('')+'</div>'+
        '<div><h2 style="margin-bottom:8px">Åpne oppfølginger</h2><div class="scroll" style="max-height:220px"><table><tbody>'+
          (c.followUps.length ? c.followUps.map(f=>'<tr><td>'+esc(f.name)+'</td><td class="num">'+esc(f.phone||"–")+'</td><td class="dt">'+dt(f.date)+'</td>'+
            '<td><span class="pill '+(f.status.toLowerCase()==="følg opp"?"y":"r")+'">'+esc(f.status)+'</span></td></tr>').join('') : '<tr><td class="dim">Ingen åpne 🎉</td></tr>')+
        '</tbody></table></div></div></div>', null, true);
    }
    if(d.crm && !d.crm.ok) h += panel("CRM", false, "", d.crm.error, true);

  } else {
    // ---- hero: salg ----
    hero += tile(p.emailsSent??0,"E-post sendt",(p.prospects?.ready??0)+" i kø")
          + tile(p.replies??0,"Svar",(p.replyRate??0)+" % svarrate")
          + tile(p.callsDue?.length??0,"Ringeliste","planlagte ringinger")
          + tile(n.queued??0,"Nye klinikker","i e-postkø");

    // pipeline
    h += panel("E-postkampanje", d.pipeline?.ok,
      '<div class="kpis">'+kpi(p.emailsSent??0,"sendt")+kpi(p.replies??0,"svar")+kpi((p.replyRate??0)+" %","svarrate")+kpi(p.prospects?.ready??0,"i kø")+'</div>'+
      bars(p.sentPerDay||[], "sent")+
      '<h2 style="margin:14px 0 8px">Siste svar</h2>'+
      (p.latestReplies?.length ? '<div class="scroll" style="max-height:180px"><table><tbody>'+
        p.latestReplies.map(r=>'<tr><td>'+esc(r.clinic)+'<div class="sub">'+esc(r.email)+'</div></td><td class="dt">'+dt(r.date)+'</td></tr>').join('')+'</tbody></table></div>'
        : '<p class="dim">Ingen svar ennå.</p>'),
      d.pipeline?.error);

    // call list
    h += panel("Ringeliste", d.pipeline?.ok,
      (p.callsDue?.length ? '<div class="scroll"><table><thead><tr><th>Klinikk</th><th>Telefon</th><th>Neste steg</th></tr></thead><tbody>'+
        p.callsDue.map(c=>'<tr><td>'+esc(c.clinic)+'<div class="sub">'+esc(c.city)+'</div></td><td class="num">'+esc(c.phone||"–")+'</td><td class="sub">'+esc(c.action)+'</td></tr>').join('')+'</tbody></table></div>'
        : '<p class="dim">Ingen planlagte ringinger.</p>'),
      d.pipeline?.error);

    // new establishments
    h += panel("Nye klinikker · BRREG", d.newClinics?.ok,
      '<div class="kpis">'+kpi(n.queued??0,"i e-postkø")+kpi(n.callList??0,"på ringeliste")+kpi(n.skipped??0,"filtrert bort")+'</div>'+
      (n.recent?.length ? '<div class="scroll" style="max-height:250px"><table><thead><tr><th>Klinikk</th><th>Reg.</th><th>Status</th></tr></thead><tbody>'+
        n.recent.map(e=>'<tr><td>'+esc(e.name)+(e.email||e.city?'<div class="sub">'+esc(e.email||e.city)+'</div>':'')+'</td>'+
          '<td class="dt">'+dt(e.date)+'</td>'+
          '<td><span class="pill '+(e.action==="queued"?"g":"y")+'">'+(e.action==="queued"?"e-postkø":"ring")+'</span></td></tr>').join('')+'</tbody></table></div>' : '<p class="dim">Ingen nye funn.</p>')+
      '<p class="sub" style="margin-top:10px">Sist sjekket: '+dt(n.lastRun)+'</p>',
      d.newClinics?.error);

    // ops
    const syncOk = (o.lastCrmSync||"").includes('"ok":true');
    h += panel("Drift", d.ops?.ok,
      '<table><tbody>'+
      '<tr><td>CRM-synk</td><td><span class="pill '+(syncOk?"g":"r")+'">'+(syncOk?"OK":"feil")+'</span></td><td class="dt">'+esc((o.lastCrmSync||"aldri").slice(0,16))+'</td></tr>'+
      '<tr><td>Synk-kjøringer 48 t</td><td class="num">'+(o.crmSyncRuns24h??0)+'</td><td></td></tr>'+
      '<tr><td>Siste e-post sendt</td><td colspan="2">'+(o.sentLogAgeHours!=null ? '<span class="'+(o.sentLogAgeHours<48?"ok":"warn")+'">'+o.sentLogAgeHours+' t siden</span>' : '<span class="dim">ukjent</span>')+'</td></tr>'+
      '</tbody></table>', d.ops?.error);
  }

  document.getElementById("hero").innerHTML = hero;
  document.getElementById("grid").innerHTML = h;
}

async function load(){
  const btn = document.getElementById("refresh");
  btn.disabled = true; btn.textContent = "Henter…";
  try{
    const d = await (await fetch("/data",{cache:"no-store"})).json();
    DATA = d;
    document.getElementById("stamp").textContent = "Oppdatert "+new Date(d.generatedAt).toLocaleTimeString("no");
    render(d);
  } catch(e){
    document.getElementById("grid").innerHTML = '<div class="card wide err">Kunne ikke hente data: '+esc(e.message)+'</div>';
  } finally {
    btn.disabled = false; btn.textContent = "↻ Oppdater";
  }
}
setView(view);
load();
setInterval(load, 5*60*1000);
</script></body></html>`;

// ---------- server ----------
const server = createServer(async (req, res) => {
  if (req.url === "/data") {
    try {
      const data = await collect();
      res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      res.end(JSON.stringify(data));
    } catch (e) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: String(e.message || e) }));
    }
    return;
  }
  if (req.url === "/" || req.url === "/index.html") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(HTML);
    return;
  }
  res.writeHead(404); res.end("not found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`DentDigital dashboard → http://127.0.0.1:${PORT}`);
});
