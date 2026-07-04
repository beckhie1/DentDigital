"use client";

import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";

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
    "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium">
            {t.firstName[lang]} *
          </label>
          <input id="firstName" name="firstName" required maxLength={100} className={input} />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium">
            {t.lastName[lang]} *
          </label>
          <input id="lastName" name="lastName" required maxLength={100} className={input} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            {t.email[lang]} *
          </label>
          <input id="email" name="email" type="email" required maxLength={200} className={input} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            {t.phone[lang]}
          </label>
          <input id="phone" name="phone" type="tel" maxLength={30} className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="clinic" className="mb-1.5 block text-sm font-medium">
          {t.clinic[lang]}
        </label>
        <input id="clinic" name="clinic" maxLength={200} className={input} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          {t.message[lang]} *
        </label>
        <textarea id="message" name="message" required rows={5} maxLength={5000} className={input} />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? t.sending[lang] : t.send[lang]}
      </button>

      {status === "success" && (
        <p className="rounded-lg bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800" role="status">
          {t.success[lang]}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {t.error[lang]}
        </p>
      )}
    </form>
  );
}
