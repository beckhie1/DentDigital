import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const firstName = String(body.firstName ?? "").trim().slice(0, 100);
  const lastName = String(body.lastName ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const phone = String(body.phone ?? "").trim().slice(0, 30);
  const clinic = String(body.clinic ?? "").trim().slice(0, 200);
  const service = String(body.service ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (!firstName || !lastName || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "DentDigital <post@dentdigital.no>",
      to: ["post@dentdigital.no"],
      replyTo: email,
      subject: `Ny henvendelse fra ${firstName} ${lastName}${clinic ? ` (${clinic})` : ""}`,
      html: `
        <h2>Ny henvendelse via dentdigital.no</h2>
        <p><strong>Navn:</strong> ${esc(firstName)} ${esc(lastName)}</p>
        <p><strong>E-post:</strong> ${esc(email)}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${esc(phone)}</p>` : ""}
        ${clinic ? `<p><strong>Klinikk:</strong> ${esc(clinic)}</p>` : ""}
        ${service ? `<p><strong>Tjeneste:</strong> ${esc(service)}</p>` : ""}
        <p><strong>Melding:</strong></p>
        <p>${esc(message).replace(/\n/g, "<br/>")}</p>
      `,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Send failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
