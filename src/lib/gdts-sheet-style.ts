// GDTS "US" tab row format A..N, copied from the clinic's own rows (Oct 2026).
// The H/I dropdowns are copied from the row above instead (keeps chip colours).
const MID = { verticalAlignment: "MIDDLE" };
const DARK = { red: 0.09411765, green: 0.09411765, blue: 0.09411765 };
const BLUE = { red: 0.10980392, green: 0.27058825, blue: 0.5294118 };
const dark = (horizontalAlignment: string, fontSize = 11, bold = false) => ({
  ...MID, horizontalAlignment, backgroundColor: DARK,
  textFormat: { foregroundColor: DARK, fontSize, bold },
});

export const GDTS_US_ROW_FORMAT: Record<string, unknown>[] = [
  { ...MID, borders: { left: { style: "SOLID", width: 1 } } }, // A Dato
  MID, // B Tid
  MID, // C Navn
  MID, // D E-post
  { ...MID, horizontalAlignment: "LEFT" }, // E Telefon
  { ...MID, horizontalAlignment: "LEFT" }, // F Ønsket dato
  { ...MID, horizontalAlignment: "CENTER" }, // G Tannbleking
  { ...MID, horizontalAlignment: "CENTER" }, // H Status
  { ...MID, horizontalAlignment: "CENTER" }, // I Antall kontaktpunkt
  { ...MID, horizontalAlignment: "LEFT", textFormat: { foregroundColor: BLUE, fontSize: 12, bold: true } }, // J
  dark("CENTER", 12, true), // K
  dark("RIGHT"), // L Source
  dark("LEFT"), // M Ad Name
  dark("LEFT"), // N Ad ID
];

export const GDTS_US_DROPDOWN_COLS: [number, number] = [7, 9]; // H..I
