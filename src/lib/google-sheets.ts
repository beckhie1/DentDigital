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

/**
 * Write a single row directly below the last filled cell of the range's first
 * column (e.g. `Leads!A:O` → first empty row after column A), always starting
 * in that column. Deliberately NOT values:append: its table detection misplaced
 * leads several columns to the right once stray cells sat below the table.
 * Returns the 1-based row number that was written.
 */
export async function appendRow(
  spreadsheetId: string,
  range: string,
  row: (string | number)[],
): Promise<number> {
  const m = range.match(/^(.+)!([A-Z]+):([A-Z]+)$/);
  if (!m) throw new Error(`appendRow: range must look like "Tab!A:Z", got "${range}"`);
  const [, tab, firstCol, lastCol] = m;
  const accessToken = await getAccessToken();
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/`;
  const auth = { Authorization: `Bearer ${accessToken}` };
  const sheetRef = `'${tab.replace(/'/g, "''")}'`;
  const values = row.map((v) => String(v));

  const res0 = await fetch(base + encodeURIComponent(`${sheetRef}!${firstCol}:${firstCol}`), { headers: auth });
  if (!res0.ok) throw new Error(`Sheets API error: ${res0.status} ${await res0.text()}`);
  let target = (((await res0.json()) as { values?: unknown[][] }).values?.length ?? 0) + 1;

  // Two leads at the same moment pick the same row; the one that got overwritten moves down.
  for (let attempt = 0; attempt < 5; attempt++, target++) {
    const cell = `${sheetRef}!${firstCol}${target}:${lastCol}${target}`;
    const put = await fetch(base + encodeURIComponent(cell) + "?valueInputOption=RAW", {
      method: "PUT",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [values] }),
    });
    if (!put.ok) throw new Error(`Sheets API error: ${put.status} ${await put.text()}`);

    const check = await fetch(base + encodeURIComponent(cell), { headers: auth });
    if (!check.ok) throw new Error(`Sheets API error: ${check.status} ${await check.text()}`);
    const got = ((await check.json()) as { values?: string[][] }).values?.[0] ?? [];
    if (values.slice(0, 5).every((v, i) => (got[i] ?? "") === v)) return target;
  }
  throw new Error(`appendRow: could not claim a free row in ${tab} after 5 attempts`);
}

const sheetIdCache = new Map<string, number>();

async function getSheetId(spreadsheetId: string, title: string, accessToken: string): Promise<number> {
  const key = `${spreadsheetId}/${title}`;
  const cached = sheetIdCache.get(key);
  if (cached !== undefined) return cached;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title)`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) throw new Error(`Sheets API error: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { sheets: { properties: { sheetId: number; title: string } }[] };
  const sheet = data.sheets.find((s) => s.properties.title === title);
  if (!sheet) throw new Error(`Tab "${title}" not found`);
  sheetIdCache.set(key, sheet.properties.sheetId);
  return sheet.properties.sheetId;
}

/**
 * Make one freshly written row look like the rest of the table:
 * - `formats` (from column A) overwrite whatever format the row had, e.g. pasted styles;
 * - dropdowns in `copyValidationCols` are copied from the row above, which keeps
 *   their chip colours (the API cannot read or write those colours);
 * - dropdowns everywhere else in the formatted range are removed.
 * Column ranges are 0-based, end-exclusive.
 */
export async function styleRow(
  spreadsheetId: string,
  title: string,
  rowNumber: number,
  formats: Record<string, unknown>[],
  copyValidationCols: [number, number],
): Promise<void> {
  const accessToken = await getAccessToken();
  const sheetId = await getSheetId(spreadsheetId, title, accessToken);
  const r = rowNumber - 1;
  const rowRange = (start: number, end: number) => ({
    sheetId, startRowIndex: r, endRowIndex: r + 1, startColumnIndex: start, endColumnIndex: end,
  });
  const [vStart, vEnd] = copyValidationCols;
  const requests: Record<string, unknown>[] = [
    {
      updateCells: {
        range: rowRange(0, formats.length),
        rows: [{ values: formats.map((f) => ({ userEnteredFormat: f })) }],
        fields: "userEnteredFormat",
      },
    },
    { setDataValidation: { range: rowRange(0, vStart) } },
    { setDataValidation: { range: rowRange(vEnd, formats.length) } },
  ];
  if (rowNumber > 2) {
    requests.push({
      copyPaste: {
        source: { ...rowRange(vStart, vEnd), startRowIndex: r - 1, endRowIndex: r },
        destination: rowRange(vStart, vEnd),
        pasteType: "PASTE_DATA_VALIDATION",
      },
    });
  }
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ requests }),
  });
  if (!res.ok) throw new Error(`Sheets API error: ${res.status} ${await res.text()}`);
}

/** Oslo-local date + time strings, e.g. ["15/07/2026", "13:45"]. */
export function osloTimestamp(): [string, string] {
  const now = new Date();
  const dato = now.toLocaleDateString("en-GB", { timeZone: "Europe/Oslo" }); // dd/mm/yyyy
  const tid = now.toLocaleTimeString("nb-NO", {
    timeZone: "Europe/Oslo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return [dato, tid];
}
