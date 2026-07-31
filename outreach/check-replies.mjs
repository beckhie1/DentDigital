#!/usr/bin/env node
/**
 * Reply checker — connects to Domeneshop IMAP (post@dentdigital.no),
 * matches inbox senders against outreach sent.log, reports which clinics replied.
 * Marks matched rows in clinics.csv (repo + live) with status "REPLIED <date>"
 * and appends new matches to replies.log.
 *
 * Requires in ~/.dentdigital/.env.local (or repo .env.local):
 *   MAIL_USER="post@dentdigital.no"
 *   MAIL_PASS="<mailbox password>"
 *
 * Usage: node outreach/check-replies.mjs [--since 13-Jul-2026] [--dry]
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tls from "node:tls";

const DIR = dirname(fileURLToPath(import.meta.url));
const HOME_DD = resolve(process.env.HOME, ".dentdigital");
const SENT = [resolve(HOME_DD, "outreach", "sent.log"), resolve(DIR, "sent.log")].find(existsSync);
const CSVS = [resolve(DIR, "clinics.csv"), resolve(HOME_DD, "outreach", "clinics.csv")].filter(existsSync);
const REPLIES_LOG = resolve(HOME_DD, "outreach", "replies.log");

const args = process.argv.slice(2);
const SINCE = args.includes("--since") ? args[args.indexOf("--since") + 1] : "13-Jul-2026";
const DRY = args.includes("--dry");

// ---------- credentials ----------
function envVal(name) {
  for (const f of [resolve(HOME_DD, ".env.local"), resolve(DIR, "..", ".env.local")]) {
    if (!existsSync(f)) continue;
    const m = readFileSync(f, "utf8").match(new RegExp(`^${name}="?([^"\\n]+)"?`, "m"));
    if (m) return m[1];
  }
  return null;
}
const USER = envVal("MAIL_USER"), PASS = envVal("MAIL_PASS");
if (!USER || !PASS) {
  console.error("Missing MAIL_USER / MAIL_PASS in ~/.dentdigital/.env.local — see file header.");
  process.exit(1);
}

// ---------- minimal IMAP client ----------
function imapSession(host = "imap.domeneshop.no", port = 993) {
  const sock = tls.connect({ host, port, servername: host });
  sock.setEncoding("utf8");
  let buf = "", tagN = 0;
  const pending = [];
  sock.on("data", (d) => {
    buf += d;
    // resolve when current tag's completion line arrives
    const cur = pending[0];
    if (!cur) return;
    const m = buf.match(new RegExp(`^${cur.tag} (OK|NO|BAD)([^\\n]*)`, "m"));
    if (m) {
      const out = buf; buf = "";
      pending.shift();
      if (m[1] === "OK") cur.resolve(out);
      else cur.reject(new Error(`${cur.tag} ${m[1]}${m[2]}`.slice(0, 200)));
    }
  });
  const cmd = (c) => new Promise((resolveP, rejectP) => {
    const tag = `A${++tagN}`;
    pending.push({ tag, resolve: resolveP, reject: rejectP });
    sock.write(`${tag} ${c}\r\n`);
  });
  const ready = new Promise((res) => sock.once("data", res)); // server greeting
  return { cmd, ready, end: () => sock.end() };
}

// ---------- data ----------
const sentRows = readFileSync(SENT, "utf8").trim().split("\n").map(l => l.split("\t"));
const sentByEmail = new Map(sentRows.map(([email, clinic]) => [email.toLowerCase(), clinic]));
const sentDomains = new Map(); // domain -> clinic (fallback: reply from different mailbox on same domain)
for (const [email, clinic] of sentByEmail) {
  const d = email.split("@")[1];
  if (!["gmail.com", "outlook.com", "hotmail.com", "hotmail.no", "online.no", "icloud.com"].includes(d)) sentDomains.set(d, clinic);
}
const alreadyLogged = existsSync(REPLIES_LOG)
  ? new Set(readFileSync(REPLIES_LOG, "utf8").split("\n").map(l => l.split("\t")[0]).filter(Boolean))
  : new Set();

// ---------- helpers ----------
function decodeMime(s = "") {
  return s.replace(/=\?([^?]+)\?([BQ])\?([^?]*)\?=/gi, (_, cs, enc, data) => {
    try {
      const bytes = enc.toUpperCase() === "B"
        ? Buffer.from(data, "base64")
        : Buffer.from(data.replace(/_/g, " ").replace(/=([0-9A-F]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))), "latin1");
      const charset = cs.toLowerCase().includes("1252") || cs.toLowerCase().includes("8859") ? "latin1" : "utf8";
      return bytes.toString(charset);
    } catch { return data; }
  }).replace(/\s+/g, " ").trim();
}
const AUTO_RE = /automatic reply|autoreply|autosvar|automatisk svar|out of office|fravær|ferie/i;

// ---------- main ----------
const imap = imapSession();
await imap.ready;
await imap.cmd(`LOGIN "${USER}" "${PASS}"`);
await imap.cmd("SELECT INBOX");
const search = await imap.cmd(`UID SEARCH SINCE ${SINCE}`);
const uids = (search.match(/\* SEARCH ([\d ]+)/)?.[1] ?? "").trim().split(/\s+/).filter(Boolean);
console.log(`${uids.length} inbox messages since ${SINCE}.`);

const replies = [];
// fetch headers in chunks
for (let i = 0; i < uids.length; i += 50) {
  const chunk = uids.slice(i, i + 50).join(",");
  const resp = await imap.cmd(`UID FETCH ${chunk} (BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])`);
  for (const block of resp.split(/\* \d+ FETCH/).slice(1)) {
    const from = block.match(/^From:\s*(.+)$/mi)?.[1]?.trim() ?? "";
    const subject = decodeMime(block.match(/^Subject:\s*(.+(?:\r?\n[ \t].+)*)$/mi)?.[1]?.replace(/\r?\n[ \t]+/g, " ")?.trim() ?? "");
    const date = block.match(/^Date:\s*(.+)$/mi)?.[1]?.trim() ?? "";
    const email = from.match(/[\w.+-]+@[\w.-]+/)?.[0]?.toLowerCase() ?? "";
    if (!email || email.includes("dentdigital.no") || email.includes("resend.")) continue;
    const domain = email.split("@")[1];
    const clinic = sentByEmail.get(email) ?? sentDomains.get(domain);
    if (clinic) replies.push({ email, clinic, subject, date, auto: AUTO_RE.test(subject) });
  }
}
imap.end();

if (!replies.length) { console.log("No replies from contacted clinics yet."); process.exit(0); }

console.log(`\n${replies.length} replies from contacted clinics:`);
for (const r of replies) {
  const isNew = !alreadyLogged.has(r.email);
  console.log(`${isNew ? "NEW " : "    "}${r.auto ? "[AUTO] " : ""}${r.clinic} <${r.email}> — "${r.subject}" (${r.date})`);
  if (!DRY && isNew) appendFileSync(REPLIES_LOG, `${r.email}\t${r.clinic}\t${r.date}\t${r.auto ? "[AUTO] " : ""}${r.subject}\n`);
}

// mark REPLIED in CSVs (real replies only — auto-replies keep their status)
if (!DRY) {
  const real = replies.filter(r => !r.auto);
  const today = new Date().toISOString().slice(0, 10);
  for (const f of CSVS) {
    let txt = readFileSync(f, "utf8");
    const lines = txt.split("\n");
    let changed = 0;
    for (let i = 1; i < lines.length; i++) {
      for (const r of real) {
        if (lines[i].toLowerCase().includes(r.email) && !/,REPLIED/.test(lines[i])) {
          lines[i] = lines[i].replace(/,[^,]*$/, `,REPLIED ${today}`);
          changed++;
        }
      }
    }
    if (changed) writeFileSync(f, lines.join("\n"));
    console.log(`${f}: ${changed} rows marked REPLIED`);
  }
}
