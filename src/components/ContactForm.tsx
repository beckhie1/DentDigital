"use client";

import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { services } from "@/lib/services";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const { lang } = useLang();
  const t = ui.contact;
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const input =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-40 focus:border-accent-ink";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-60";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={label}>
            {t.firstName[lang]} *
          </label>
          <input id="firstName" name="firstName" required maxLength={100} className={input} autoComplete="given-name" />
        </div>
        <div>
          <label htmlFor="lastName" className={label}>
            {t.lastName[lang]} *
          </label>
          <input id="lastName" name="lastName" required maxLength={100} className={input} autoComplete="family-name" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>
            {t.email[lang]} *
          </label>
          <input id="email" name="email" type="email" required maxLength={200} className={input} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            {t.phone[lang]}
          </label>
          <input id="phone" name="phone" type="tel" maxLength={30} className={input} autoComplete="tel" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="clinic" className={label}>
            {t.clinic[lang]}
          </label>
          <input id="clinic" name="clinic" maxLength={200} className={input} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="service" className={label}>
            {lang === "no" ? "Tjeneste" : "Service"}
          </label>
          <select id="service" name="service" className={input} defaultValue="">
            <option value="">{lang === "no" ? "Velg tjeneste (valgfritt)" : "Select service (optional)"}</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title.no}>
                {s.title[lang]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className={label}>
          {t.message[lang]} *
        </label>
        <textarea id="message" name="message" required rows={5} maxLength={5000} className={input} />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-accent-ink disabled:opacity-60"
      >
        {status === "sending" ? t.sending[lang] : t.send[lang]}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>

      {status === "success" && (
        <p className="rounded-xl border border-accent-ink/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent-ink" role="status">
          {t.success[lang]}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {t.error[lang]}
        </p>
      )}
    </form>
  );
}
