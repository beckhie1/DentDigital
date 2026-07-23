"use client";

import { useEffect, useRef, useState } from "react";
import {
  CLOSING,
  FORM_SUBTITLE,
  FORM_TITLE,
  INTRO_BOX,
  PHQ9_SELFHARM_KEY,
  SAFETY_NOTICE,
  sections,
  osloDate,
  type FormValues,
  type Item,
} from "@/lib/egenvurdering";
import { submitEgenvurdering } from "@/app/actions/submit-egenvurdering";

const DRAFT_KEY = "egenvurdering-draft";

type Status = "idle" | "sending" | "success" | "error";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-40 focus:border-accent-ink";
const labelCls = "mb-1.5 block text-sm font-medium text-ink";
const chipBase =
  "cursor-pointer select-none rounded-lg border px-3 py-2 text-xs font-medium transition-colors";
const chipOff = "border-line bg-white text-ink-60 hover:border-accent-ink/50";
const chipOn = "border-accent-ink bg-accent-ink text-white";

function str(values: FormValues, key: string): string {
  const v = values[key];
  return typeof v === "string" ? v : "";
}
function arr(values: FormValues, key: string): string[] {
  const v = values[key];
  return Array.isArray(v) ? v : [];
}

export default function EgenvurderingForm() {
  const [values, setValues] = useState<FormValues>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaded = useRef(false);
  const today = osloDate();

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setValues(JSON.parse(raw));
    } catch {
      /* corrupt draft — start fresh */
    }
    loaded.current = true;
  }, []);

  // Autosave draft (debounced)
  useEffect(() => {
    if (!loaded.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
        /* storage full/blocked — ignore */
      }
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [values]);

  function set(key: string, val: string | string[]) {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => (e[key] ? Object.fromEntries(Object.entries(e).filter(([k]) => k !== key)) : e));
  }

  function toggle(key: string, option: string) {
    const cur = arr(values, key);
    set(key, cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!str(values, "navn").trim()) errs.navn = "Skriv inn navnet ditt.";
    if (!/^\d{11}$/.test(str(values, "fnr").replace(/\s/g, ""))) errs.fnr = "Fødselsnummer må være 11 siffer.";
    if (!str(values, "signatur").trim()) errs.signatur = "Signer med fullt navn.";
    if (str(values, "samtykke") !== "Ja") errs.samtykke = "Du må samtykke for å sende inn.";
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setStatus("sending");
    try {
      const res = await submitEgenvurdering(values);
      if (!res.success) throw new Error(res.error);
      localStorage.removeItem(DRAFT_KEY);
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") return <SuccessView />;

  const selfHarmFlag = Number(str(values, PHQ9_SELFHARM_KEY) || "0") > 0;

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto w-full max-w-3xl pb-24">
      {/* Title */}
      <header className="pt-10 sm:pt-14">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{FORM_TITLE}</h1>
        <p className="mt-2 text-sm italic text-ink-60">{FORM_SUBTITLE}</p>
        <div className="mt-4 h-1 w-full rounded bg-accent-ink" />
      </header>

      {/* Meta */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div id="f-navn">
          <label htmlFor="navn" className={labelCls}>
            Navn *
          </label>
          <input
            id="navn"
            className={inputCls}
            maxLength={150}
            autoComplete="name"
            value={str(values, "navn")}
            onChange={(e) => set("navn", e.target.value)}
          />
          {errors.navn && <p className="mt-1 text-xs font-medium text-red-700">{errors.navn}</p>}
        </div>
        <div id="f-fnr">
          <label htmlFor="fnr" className={labelCls}>
            Fødselsnummer (11 siffer) *
          </label>
          <input
            id="fnr"
            className={inputCls}
            inputMode="numeric"
            maxLength={11}
            value={str(values, "fnr")}
            onChange={(e) => set("fnr", e.target.value.replace(/\D/g, ""))}
          />
          {errors.fnr && <p className="mt-1 text-xs font-medium text-red-700">{errors.fnr}</p>}
        </div>
        <div>
          <span className={labelCls}>Dato</span>
          <div className="rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink-60">{today} (fylles ut automatisk)</div>
        </div>
      </div>

      {/* Intro box */}
      <div className="mt-8 rounded-xl border border-accent-ink/20 bg-accent/10 p-5">
        <p className="text-sm font-semibold text-ink">{INTRO_BOX.title}</p>
        {INTRO_BOX.paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="mt-2 text-sm leading-relaxed text-ink-60">
            {p}
          </p>
        ))}
        <p className="mt-2 text-sm leading-relaxed text-ink-60">
          <strong className="text-ink">Personvern:</strong> {INTRO_BOX.privacy.replace(/^Personvern: /, "")}
        </p>
      </div>

      {/* Sections */}
      {sections.map((s) => (
        <section key={s.num} className="mt-12">
          <h2 className="border-b-2 border-accent-ink pb-2 font-display text-xl font-semibold text-accent-ink">
            {s.num}&ensp;{s.title}
          </h2>
          {s.intro && <p className="mt-3 text-sm italic leading-relaxed text-ink-60">{s.intro}</p>}
          <div className="mt-6 space-y-7">
            {s.items.map((item) => (
              <ItemField
                key={item.id}
                item={item}
                values={values}
                set={set}
                toggle={toggle}
                selfHarmFlag={selfHarmFlag}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Signature */}
      <section className="mt-12 rounded-xl border border-line bg-white p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className={labelCls}>Dato</span>
            <div className="rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink-60">{today}</div>
          </div>
          <div id="f-signatur">
            <label htmlFor="signatur" className={labelCls}>
              Signatur (skriv fullt navn) *
            </label>
            <input
              id="signatur"
              className={`${inputCls} italic`}
              maxLength={150}
              value={str(values, "signatur")}
              onChange={(e) => set("signatur", e.target.value)}
            />
            {errors.signatur && <p className="mt-1 text-xs font-medium text-red-700">{errors.signatur}</p>}
          </div>
        </div>

        <label id="f-samtykke" className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-ink-60">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[#007a73]"
            checked={str(values, "samtykke") === "Ja"}
            onChange={(e) => set("samtykke", e.target.checked ? "Ja" : "")}
          />
          <span>
            Jeg bekrefter at opplysningene er riktige, og samtykker til at utfylt skjema sendes til legen min på
            e-post. *
          </span>
        </label>
        {errors.samtykke && <p className="mt-1 text-xs font-medium text-red-700">{errors.samtykke}</p>}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-6 w-full rounded-full bg-accent-ink px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Sender…" : "Send inn skjemaet"}
        </button>

        {status === "error" && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
            Noe gikk galt ved innsending. Prøv igjen – svarene dine er lagret i nettleseren.
          </p>
        )}
        <p className="mt-4 text-xs text-ink-40">
          Utkastet lagres automatisk i nettleseren din mens du fyller ut, og slettes når skjemaet er sendt.
        </p>
      </section>
    </form>
  );
}

/* ---------- field renderers ---------- */

function ItemField({
  item,
  values,
  set,
  toggle,
  selfHarmFlag,
}: {
  item: Item;
  values: FormValues;
  set: (k: string, v: string | string[]) => void;
  toggle: (k: string, o: string) => void;
  selfHarmFlag: boolean;
}) {
  switch (item.kind) {
    case "text":
      return (
        <div id={`f-${item.id}`}>
          <label htmlFor={item.id} className={labelCls}>
            {item.label}
          </label>
          <input
            id={item.id}
            className={inputCls}
            maxLength={500}
            value={str(values, item.id)}
            onChange={(e) => set(item.id, e.target.value)}
          />
        </div>
      );

    case "textarea":
      return (
        <div id={`f-${item.id}`}>
          <label htmlFor={item.id} className={labelCls}>
            {item.label}
          </label>
          <textarea
            id={item.id}
            rows={3}
            maxLength={4000}
            className={inputCls}
            value={str(values, item.id)}
            onChange={(e) => set(item.id, e.target.value)}
          />
        </div>
      );

    case "radio": {
      const selected = str(values, item.id);
      return (
        <div id={`f-${item.id}`} role="radiogroup" aria-label={item.label}>
          <p className={labelCls}>{item.label}</p>
          {item.note && <p className="mb-2 text-xs italic leading-relaxed text-ink-40">{item.note}</p>}
          <div className="flex flex-wrap gap-2">
            {item.options.map((o) => (
              <label key={o} className={`${chipBase} ${selected === o ? chipOn : chipOff}`}>
                <input
                  type="radio"
                  name={item.id}
                  className="sr-only"
                  checked={selected === o}
                  onChange={() => set(item.id, o)}
                />
                {o}
              </label>
            ))}
          </div>
          {item.followUpLabel !== undefined && (
            <div className="mt-3">
              {item.followUpLabel && <label htmlFor={`${item.id}_utdyp`} className="mb-1.5 block text-xs text-ink-60">{item.followUpLabel}</label>}
              <textarea
                id={`${item.id}_utdyp`}
                rows={2}
                maxLength={2000}
                className={inputCls}
                aria-label={item.followUpLabel || "Utdyp"}
                value={str(values, `${item.id}_utdyp`)}
                onChange={(e) => set(`${item.id}_utdyp`, e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    case "checkboxes": {
      const selected = arr(values, item.id);
      return (
        <div id={`f-${item.id}`}>
          <p className={labelCls}>{item.label}</p>
          <div className="flex flex-wrap gap-2">
            {item.options.map((o) => (
              <label key={o} className={`${chipBase} ${selected.includes(o) ? chipOn : chipOff}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selected.includes(o)}
                  onChange={() => toggle(item.id, o)}
                />
                {selected.includes(o) ? "☑ " : "☐ "}
                {o}
              </label>
            ))}
          </div>
          {item.followUpLabel !== undefined && (
            <div className="mt-3">
              <label htmlFor={`${item.id}_utdyp`} className="mb-1.5 block text-xs text-ink-60">
                {item.followUpLabel}
              </label>
              <textarea
                id={`${item.id}_utdyp`}
                rows={2}
                maxLength={2000}
                className={inputCls}
                value={str(values, `${item.id}_utdyp`)}
                onChange={(e) => set(`${item.id}_utdyp`, e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    case "scale": {
      const selected = str(values, item.id);
      return (
        <div id={`f-${item.id}`}>
          <p className={labelCls}>{item.label}</p>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Smertestyrke 0–10">
            {Array.from({ length: item.max + 1 }, (_, i) => String(i)).map((n) => (
              <label
                key={n}
                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                  selected === n ? chipOn : chipOff
                }`}
              >
                <input
                  type="radio"
                  name={item.id}
                  className="sr-only"
                  checked={selected === n}
                  onChange={() => set(item.id, n)}
                />
                {n}
              </label>
            ))}
          </div>
          <input
            className={`${inputCls} mt-3`}
            placeholder="Hvor i kroppen?"
            maxLength={500}
            aria-label="Hvor i kroppen"
            value={str(values, `${item.id}_hvor`)}
            onChange={(e) => set(`${item.id}_hvor`, e.target.value)}
          />
        </div>
      );
    }

    case "matrix": {
      const cols = item.columns.length;
      const grid = { gridTemplateColumns: `minmax(0,1fr) repeat(${cols}, 88px)` };
      return (
        <div id={`f-${item.id}`}>
          {item.heading && <h3 className="mb-3 text-base font-semibold text-accent-ink">{item.heading}</h3>}
          <div className="overflow-hidden rounded-xl border border-line">
            {/* Column headers (desktop) */}
            <div className="hidden bg-accent-ink px-4 py-3 md:grid md:items-center md:gap-2" style={grid}>
              <span className="pr-2 text-xs font-semibold text-white">{item.header}</span>
              {item.columns.map((c) => (
                <span key={c} className="text-center text-[11px] font-medium leading-tight text-white">
                  {c}
                </span>
              ))}
            </div>
            {/* Header (mobile) */}
            <div className="bg-accent-ink px-4 py-3 md:hidden">
              <span className="text-xs font-semibold text-white">{item.header}</span>
            </div>

            {item.rows.map((row, ri) => {
              const key = `${item.id}_${ri + 1}`;
              const selected = str(values, key);
              return (
                <div
                  key={key}
                  role="radiogroup"
                  aria-label={row}
                  className={`border-t border-line px-4 py-3 md:grid md:items-center md:gap-2 ${
                    ri % 2 ? "bg-canvas" : "bg-white"
                  }`}
                  style={grid}
                >
                  <span className="block pr-2 text-sm text-ink">{row}</span>
                  <div className="mt-2 flex flex-wrap gap-1.5 md:hidden">
                    {item.columns.map((c, ci) => (
                      <label
                        key={ci}
                        className={`${chipBase} px-2.5 py-1.5 text-[11px] ${selected === String(ci) ? chipOn : chipOff}`}
                      >
                        <input
                          type="radio"
                          name={key}
                          className="sr-only"
                          checked={selected === String(ci)}
                          onChange={() => set(key, String(ci))}
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                  {item.columns.map((c, ci) => (
                    <label key={`d${ci}`} className="hidden cursor-pointer justify-center md:flex" title={c}>
                      <input
                        type="radio"
                        name={key}
                        className="sr-only peer"
                        checked={selected === String(ci)}
                        onChange={() => set(key, String(ci))}
                      />
                      <span className="h-5 w-5 rounded-full border-2 border-line transition-colors peer-checked:border-accent-ink peer-checked:bg-accent-ink peer-focus-visible:ring-2 peer-focus-visible:ring-accent-ink/40" />
                    </label>
                  ))}
                </div>
              );
            })}
          </div>

          {item.id === "phq" && (
            <div
              className={`mt-4 rounded-xl border p-4 text-sm leading-relaxed ${
                selfHarmFlag ? "border-red-300 bg-red-50 text-red-900" : "border-line bg-rose-50/60 text-ink-60"
              }`}
            >
              <strong className={selfHarmFlag ? "text-red-900" : "text-ink"}>{SAFETY_NOTICE.lead}</strong>{" "}
              {SAFETY_NOTICE.text}
            </div>
          )}
        </div>
      );
    }
  }
}

/* ---------- success ---------- */

function SuccessView() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-24 pt-10 sm:pt-14">
      <div className="rounded-xl border border-accent-ink/30 bg-accent/10 px-5 py-4 text-sm font-medium text-accent-ink" role="status">
        Skjemaet er sendt. Takk!
      </div>

      <h1 className="mt-10 font-display text-3xl font-semibold text-ink">{CLOSING.title}</h1>
      <p className="mt-1 text-sm italic text-ink-60">{CLOSING.subtitle}</p>
      <div className="mt-4 h-1 w-full rounded bg-accent-ink" />

      <p className="mt-6 text-sm leading-relaxed text-ink-60">{CLOSING.intro}</p>
      <p className="mt-5 text-sm font-semibold text-ink">{CLOSING.pointsTitle}</p>
      <ul className="mt-3 space-y-3">
        {CLOSING.points.map((p) => (
          <li key={p.lead} className="flex gap-3 text-sm leading-relaxed text-ink-60">
            <span aria-hidden className="text-ink-40">–</span>
            <span>
              <strong className="text-ink">{p.lead}</strong> {p.text}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-xl border border-accent-ink/20 bg-accent/10 p-5 text-sm italic leading-relaxed text-ink-60">
        {CLOSING.quote}
      </div>
      <p className="mt-6 text-sm text-ink-60">
        {CLOSING.signoff[0]}
        <br />
        <strong className="text-ink">{CLOSING.signoff[1]}</strong>
      </p>
    </div>
  );
}
