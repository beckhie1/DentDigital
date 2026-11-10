// GDTS "US" tab row format A..O, copied from the clinic's own rows (Oct 2026).
// The I/J dropdowns are copied from the row above instead (keeps chip colours).
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
  MID, // D Gjelder
  MID, // E E-post
  { ...MID, horizontalAlignment: "LEFT" }, // F Telefon
  { ...MID, horizontalAlignment: "LEFT" }, // G Ønsket dato
  { ...MID, horizontalAlignment: "CENTER" }, // H Tannbleking
  { ...MID, horizontalAlignment: "CENTER" }, // I Status
  { ...MID, horizontalAlignment: "CENTER" }, // J Antall kontaktpunkt
  { ...MID, horizontalAlignment: "LEFT", textFormat: { foregroundColor: BLUE, fontSize: 12, bold: true } }, // K Kommentar
  dark("CENTER", 12, true), // L
  dark("RIGHT"), // M Source
  dark("LEFT"), // N Ad Name
  dark("LEFT"), // O Ad ID
];

export const GDTS_US_DROPDOWN_COLS: [number, number] = [8, 10]; // I..J
