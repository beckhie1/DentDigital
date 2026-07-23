/**
 * HTML email rendering of a filled «Egenvurdering av funksjon og arbeidsevne».
 * Mirrors the paper form layout (teal headings, answer boxes, checkbox rows,
 * matrix tables). Inline styles only — email client compatibility.
 */
import {
  FORM_SUBTITLE,
  FORM_TITLE,
  PHQ9_SELFHARM_KEY,
  SAFETY_NOTICE,
  getArray,
  getString,
  sections,
  type FormValues,
  type Item,
} from "@/lib/egenvurdering";

const TEAL = "#2a7d78";
const TEAL_LIGHT = "#e7f1f0";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const box = (checked: boolean) => (checked ? "☒" : "☐");

function answerBox(text: string): string {
  return `<div style="border:1px solid #c9c9c3;border-radius:4px;padding:8px 10px;min-height:18px;font-size:14px;line-height:1.5;white-space:pre-wrap;">${
    esc(text) || "&nbsp;"
  }</div>`;
}

function qLabel(text: string): string {
  return `<p style="margin:14px 0 4px;font-size:13px;font-weight:600;color:#1a1a1a;line-height:1.4;">${esc(text)}</p>`;
}

function optionsRow(options: string[], isChecked: (o: string) => boolean): string {
  return `<p style="margin:4px 0;font-size:13px;line-height:1.9;">${options
    .map((o) => `<span style="white-space:nowrap;margin-right:14px;">${box(isChecked(o))} ${esc(o)}</span>`)
    .join(" ")}</p>`;
}

function itemHtml(item: Item, values: FormValues): string {
  switch (item.kind) {
    case "text":
    case "textarea":
      return qLabel(item.label) + answerBox(getString(values, item.id));

    case "radio": {
      const selected = getString(values, item.id);
      let html = qLabel(item.label);
      if (item.note) html += `<p style="margin:2px 0 4px;font-size:11px;color:#777;font-style:italic;">${esc(item.note)}</p>`;
      html += optionsRow(item.options, (o) => o === selected);
      if (item.followUpLabel !== undefined) {
        if (item.followUpLabel) html += `<p style="margin:6px 0 4px;font-size:12px;color:#555;">${esc(item.followUpLabel)}</p>`;
        html += answerBox(getString(values, `${item.id}_utdyp`));
      }
      return html;
    }

    case "checkboxes": {
      const selected = getArray(values, item.id);
      let html = qLabel(item.label);
      html += optionsRow(item.options, (o) => selected.includes(o));
      if (item.followUpLabel !== undefined) {
        html += `<p style="margin:6px 0 4px;font-size:12px;color:#555;">${esc(item.followUpLabel ?? "")}</p>`;
        html += answerBox(getString(values, `${item.id}_utdyp`));
      }
      return html;
    }

    case "scale": {
      const selected = getString(values, item.id);
      const nums = Array.from({ length: item.max + 1 }, (_, i) => String(i));
      let html = qLabel(item.label);
      html += optionsRow(nums, (n) => n === selected);
      html += answerBox(getString(values, `${item.id}_hvor`));
      return html;
    }

    case "matrix": {
      const selfHarm = item.id === "phq" && Number(getString(values, PHQ9_SELFHARM_KEY) || "0") > 0;
      let html = "";
      if (item.heading) html += `<p style="margin:16px 0 6px;font-size:14px;font-weight:700;color:${TEAL};">${esc(item.heading)}</p>`;
      html += `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin:6px 0;border:1px solid #c9c9c3;">`;
      html += `<tr><th style="background:${TEAL};color:#fff;font-size:11px;text-align:left;padding:8px;">${esc(item.header)}</th>`;
      for (const c of item.columns) {
        html += `<th style="background:${TEAL};color:#fff;font-size:10px;padding:6px 4px;text-align:center;">${esc(c)}</th>`;
      }
      html += `</tr>`;
      item.rows.forEach((row, ri) => {
        const selected = getString(values, `${item.id}_${ri + 1}`);
        const bg = ri % 2 ? "#f4f4f0" : "#ffffff";
        html += `<tr><td style="background:${bg};font-size:12px;padding:7px 8px;border-top:1px solid #e0e0da;line-height:1.4;">${esc(row)}</td>`;
        item.columns.forEach((_, ci) => {
          const on = selected === String(ci);
          html += `<td style="background:${bg};text-align:center;border-top:1px solid #e0e0da;font-size:14px;${
            on ? `color:${TEAL};font-weight:700;` : "color:#c0c0ba;"
          }">${box(on)}</td>`;
        });
        html += `</tr>`;
      });
      html += `</table>`;
      if (item.id === "phq") {
        html += `<div style="background:#fdeef0;${selfHarm ? "border:2px solid #c0392b;" : ""}border-radius:4px;padding:10px;margin:8px 0;font-size:12px;line-height:1.5;color:#333;"><strong>${esc(
          SAFETY_NOTICE.lead,
        )}</strong> ${esc(SAFETY_NOTICE.text)}</div>`;
      }
      return html;
    }
  }
}

export function buildEgenvurderingEmailHtml(values: FormValues, date: string): string {
  const navn = getString(values, "navn");
  const fnr = getString(values, "fnr");
  const signatur = getString(values, "signatur");

  const metaRow = (label: string, value: string) =>
    `<tr><td style="font-size:13px;font-weight:700;padding:4px 12px 4px 0;white-space:nowrap;">${esc(label)}</td><td style="font-size:14px;border-bottom:1px solid #c9c9c3;padding:4px 0;width:100%;">${esc(value)}</td></tr>`;

  let body = "";
  for (const sec of sections) {
    body += `<h2 style="margin:28px 0 6px;font-size:17px;color:${TEAL};border-bottom:2px solid ${TEAL};padding-bottom:4px;">${sec.num}&ensp;${esc(sec.title)}</h2>`;
    if (sec.intro) body += `<p style="margin:4px 0 8px;font-size:11px;color:#777;font-style:italic;line-height:1.5;">${esc(sec.intro)}</p>`;
    for (const item of sec.items) body += itemHtml(item, values);
  }

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#1a1a1a;">
    <h1 style="margin:0;font-size:22px;">${esc(FORM_TITLE)}</h1>
    <p style="margin:4px 0 0;font-size:13px;color:#666;font-style:italic;">${esc(FORM_SUBTITLE)}</p>
    <div style="height:4px;background:${TEAL};margin:12px 0 18px;border-radius:2px;"></div>

    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:14px;">
      ${metaRow("Navn:", navn)}
      ${metaRow("Fødselsnummer:", fnr)}
      ${metaRow("Dato:", date)}
    </table>

    ${body}

    <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:22px;">
      ${metaRow("Dato:", date)}
      ${metaRow("Signatur:", signatur)}
    </table>

    <div style="margin-top:26px;padding:12px;background:${TEAL_LIGHT};border-radius:6px;font-size:11px;color:#555;line-height:1.5;">
      Sendt digitalt via dentdigital.no. Pasienten bekreftet at opplysningene er riktige og samtykket til
      oversendelse per e-post. Fullstendig utgave ligger vedlagt som PDF.
    </div>
  </div>`;
}
