import { GoogleAuth } from "google-auth-library";

/**
 * Minimal Google Sheets v4 client using a service account.
 * Requires env GOOGLE_SERVICE_ACCOUNT_KEY = the full JSON key as a string.
 */

async function getAccessToken(): Promise<string> {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set");
  }
  const auth = new GoogleAuth({
    credentials: JSON.parse(keyJson),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) throw new Error("Could not obtain Google access token");
  return token.token;
}

/** Append a single row to a tab (e.g. `Leads!A:K`) of the given spreadsheet. */
export async function appendRow(
  spreadsheetId: string,
  range: string,
  row: (string | number)[],
): Promise<void> {
  const accessToken = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    range,
  )}:append?valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) {
    throw new Error(`Sheets API error: ${res.status} ${await res.text()}`);
  }
}

/** Oslo-local date + time strings, e.g. ["14.07.2026", "13:45"]. */
export function osloTimestamp(): [string, string] {
  const now = new Date();
  const dato = now.toLocaleDateString("nb-NO", { timeZone: "Europe/Oslo" });
  const tid = now.toLocaleTimeString("nb-NO", {
    timeZone: "Europe/Oslo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return [dato, tid];
}
