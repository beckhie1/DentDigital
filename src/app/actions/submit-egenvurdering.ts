"use server";

import { Resend } from "resend";
import {
  FORM_TITLE,
  getString,
  osloDate,
  sections,
  type FormValues,
} from "@/lib/egenvurdering";
import { buildEgenvurderingEmailHtml } from "@/lib/egenvurdering-email";
import { renderEgenvurderingPdf } from "@/lib/egenvurdering-pdf";

const DEFAULT_TO = "jamalahmed94@gmail.com";
const MAX_TEXT = 4000;

const cleanStr = (v: unknown, max = MAX_TEXT) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/**
 * Whitelist incoming values against the schema — only known keys, only valid
 * option strings / matrix column indices survive.
 */
function sanitize(input: FormValues): FormValues {
  const out: FormValues = {};
  out.navn = cleanStr(input.navn, 150);
  out.fnr = cleanStr(input.fnr, 20).replace(/\s/g, "");
  out.signatur = cleanStr(input.signatur, 150);
  out.samtykke = cleanStr(input.samtykke, 3);

  for (const sec of sections) {
    for (const item of sec.items) {
      switch (item.kind) {
        case "text":
        case "textarea":
          out[item.id] = cleanStr(input[item.id]);
          break;
        case "radio": {
          const v = cleanStr(input[item.id], 100);
          out[item.id] = item.options.includes(v) ? v : "";
          if (item.followUpLabel !== undefined) out[`${item.id}_utdyp`] = cleanStr(input[`${item.id}_utdyp`]);
          break;
        }
        case "checkboxes": {
          const v = input[item.id];
          out[item.id] = Array.isArray(v) ? item.options.filter((o) => v.includes(o)) : [];
          if (item.followUpLabel !== undefined) out[`${item.id}_utdyp`] = cleanStr(input[`${item.id}_utdyp`]);
          break;
        }
        case "scale": {
          const v = cleanStr(input[item.id], 3);
          const n = Number(v);
          out[item.id] = v !== "" && Number.isInteger(n) && n >= 0 && n <= item.max ? v : "";
          out[`${item.id}_hvor`] = cleanStr(input[`${item.id}_hvor`], 500);
          break;
        }
        case "matrix":
          item.rows.forEach((_, ri) => {
            const key = `${item.id}_${ri + 1}`;
            const v = cleanStr(input[key], 2);
            const n = Number(v);
            out[key] = v !== "" && Number.isInteger(n) && n >= 0 && n < item.columns.length ? v : "";
          });
          break;
      }
    }
  }
  return out;
}

export async function submitEgenvurdering(
  input: FormValues,
): Promise<{ success: boolean; error?: string }> {
  const values = sanitize(input);
  const navn = getString(values, "navn");
  const fnr = getString(values, "fnr");
  const signatur = getString(values, "signatur");

  if (!navn) return { success: false, error: "Mangler navn" };
  if (!/^\d{11}$/.test(fnr)) return { success: false, error: "Ugyldig fødselsnummer" };
  if (!signatur) return { success: false, error: "Mangler signatur" };
  if (values.samtykke !== "Ja") return { success: false, error: "Mangler samtykke" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Serverfeil" };
  }

  const date = osloDate();

  try {
    const pdf = await renderEgenvurderingPdf(values, date);
    const html = buildEgenvurderingEmailHtml(values, date);

    const safeName = navn
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    const isoDate = date.split(".").reverse().join("-");

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "DentDigital Skjema <post@dentdigital.no>",
      to: [process.env.EGENVURDERING_TO || DEFAULT_TO],
      subject: `${FORM_TITLE} – ${navn} (${date})`,
      html,
      attachments: [
        {
          filename: `egenvurdering-${safeName || "pasient"}-${isoDate}.pdf`,
          content: pdf.toString("base64"),
        },
      ],
    });
    if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
    return { success: true };
  } catch (err) {
    console.error("submitEgenvurdering failure:", err);
    return { success: false, error: "Kunne ikke sende skjemaet" };
  }
}
