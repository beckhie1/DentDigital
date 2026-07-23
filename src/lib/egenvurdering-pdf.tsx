/**
 * PDF replica of «Egenvurdering av funksjon og arbeidsevne» — mirrors the
 * original paper form layout (teal section headings, answer boxes, checkbox
 * matrices, closing info page). Server-side only.
 */
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import {
  CLOSING,
  FORM_SUBTITLE,
  FORM_TITLE,
  INTRO_BOX,
  PHQ9_SELFHARM_KEY,
  SAFETY_NOTICE,
  getArray,
  getString,
  sections,
  type FormValues,
  type Item,
} from "@/lib/egenvurdering";

// Keep Norwegian words intact — default hyphenation mangles them.
Font.registerHyphenationCallback((word) => [word]);

const TEAL = "#2a7d78";
const TEAL_LIGHT = "#e7f1f0";
const INK = "#1a1a1a";
const GRAY = "#555555";
const LINE = "#bbbbbb";

const s = StyleSheet.create({
  page: {
    paddingTop: 46,
    paddingBottom: 52,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: INK,
  },
  runningHeader: {
    position: "absolute",
    top: 20,
    right: 52,
    fontSize: 7,
    color: "#999999",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 7.5,
    color: "#999999",
  },
  title: { fontSize: 19, fontFamily: "Helvetica-Bold", color: INK },
  subtitle: { fontSize: 9.5, fontFamily: "Helvetica-Oblique", color: GRAY, marginTop: 3 },
  titleRule: { height: 3, backgroundColor: TEAL, marginTop: 8, marginBottom: 14 },
  metaRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 7 },
  metaLabel: { fontFamily: "Helvetica-Bold", fontSize: 9.5, width: 130 },
  metaValue: {
    flex: 1,
    borderBottomWidth: 0.8,
    borderBottomColor: LINE,
    paddingBottom: 2,
    fontSize: 10,
  },
  introBox: { backgroundColor: TEAL_LIGHT, borderRadius: 3, padding: 10, marginTop: 8 },
  introTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5, marginBottom: 4 },
  introText: { fontSize: 8.5, color: "#333333", lineHeight: 1.4, marginBottom: 3 },
  sectionHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12.5,
    color: TEAL,
    borderBottomWidth: 1.4,
    borderBottomColor: TEAL,
    paddingBottom: 3,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionIntro: {
    fontSize: 8,
    fontFamily: "Helvetica-Oblique",
    color: GRAY,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  qBlock: { marginBottom: 9 },
  qLabel: { fontSize: 9, color: INK, lineHeight: 1.35, marginBottom: 3 },
  qNote: { fontSize: 7.5, fontFamily: "Helvetica-Oblique", color: GRAY, lineHeight: 1.35, marginBottom: 3 },
  answerBox: {
    borderWidth: 0.8,
    borderColor: LINE,
    borderRadius: 2,
    minHeight: 26,
    padding: 5,
  },
  answerText: { fontSize: 9.5, lineHeight: 1.4 },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 2 },
  option: { flexDirection: "row", alignItems: "center", marginRight: 14, marginBottom: 4 },
  optionText: { fontSize: 9 },
  followLabel: { fontSize: 8, color: GRAY, marginTop: 4, marginBottom: 3 },
  table: { borderWidth: 0.8, borderColor: LINE, borderRadius: 2, marginBottom: 4 },
  tHeadRow: { flexDirection: "row", backgroundColor: TEAL },
  tHeadLabel: { flex: 1, padding: 5, fontSize: 8, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  tHeadCol: {
    width: 58,
    padding: 4,
    fontSize: 6.8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
  },
  tRow: { flexDirection: "row", borderTopWidth: 0.8, borderTopColor: "#dddddd", alignItems: "center" },
  tRowAlt: { backgroundColor: "#f4f4f0" },
  tRowLabel: { flex: 1, padding: 5, fontSize: 8.5, lineHeight: 1.3 },
  tCell: { width: 58, alignItems: "center", justifyContent: "center", paddingVertical: 5 },
  matrixHeading: { fontFamily: "Helvetica-Bold", fontSize: 10, color: TEAL, marginTop: 6, marginBottom: 4 },
  notice: {
    backgroundColor: "#fdeef0",
    borderRadius: 3,
    padding: 8,
    marginTop: 2,
    marginBottom: 6,
  },
  noticeAlert: { borderWidth: 1.2, borderColor: "#c0392b" },
  noticeText: { fontSize: 8, lineHeight: 1.4, color: "#333333" },
  signRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 14, marginBottom: 6 },
  signValue: {
    flex: 1,
    borderBottomWidth: 0.8,
    borderBottomColor: LINE,
    paddingBottom: 2,
    fontSize: 12,
    fontFamily: "Times-Italic",
  },
  closingIntro: { fontSize: 9, lineHeight: 1.5, color: "#333333", marginBottom: 10 },
  pointRow: { flexDirection: "row", marginBottom: 6 },
  pointDash: { width: 14, fontSize: 9 },
  pointText: { flex: 1, fontSize: 9, lineHeight: 1.45, color: "#333333" },
  quoteBox: {
    backgroundColor: TEAL_LIGHT,
    borderRadius: 3,
    padding: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  quoteText: { fontSize: 9, fontFamily: "Helvetica-Oblique", lineHeight: 1.45, color: "#333333" },
});

function CheckBox({ checked, size = 9 }: { checked: boolean; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderWidth: 0.9,
        borderColor: checked ? TEAL : "#777777",
        backgroundColor: checked ? TEAL : "#ffffff",
        borderRadius: 1.5,
        marginRight: 4,
      }}
    />
  );
}

function AnswerBox({ text }: { text: string }) {
  return (
    <View style={s.answerBox}>
      <Text style={s.answerText}>{text || " "}</Text>
    </View>
  );
}

function ItemPdf({ item, values }: { item: Item; values: FormValues }) {
  switch (item.kind) {
    case "text":
    case "textarea":
      return (
        <View style={s.qBlock} wrap={false}>
          <Text style={s.qLabel}>{item.label}</Text>
          <AnswerBox text={getString(values, item.id)} />
        </View>
      );

    case "radio": {
      const selected = getString(values, item.id);
      const utdyp = getString(values, `${item.id}_utdyp`);
      return (
        <View style={s.qBlock} wrap={false}>
          <Text style={s.qLabel}>{item.label}</Text>
          {item.note && <Text style={s.qNote}>{item.note}</Text>}
          <View style={s.optionsRow}>
            {item.options.map((o) => (
              <View key={o} style={s.option}>
                <CheckBox checked={selected === o} />
                <Text style={s.optionText}>{o}</Text>
              </View>
            ))}
          </View>
          {item.followUpLabel !== undefined && (
            <>
              {item.followUpLabel ? <Text style={s.followLabel}>{item.followUpLabel}</Text> : null}
              <AnswerBox text={utdyp} />
            </>
          )}
        </View>
      );
    }

    case "checkboxes": {
      const selected = getArray(values, item.id);
      const utdyp = getString(values, `${item.id}_utdyp`);
      return (
        <View style={s.qBlock} wrap={false}>
          <Text style={s.qLabel}>{item.label}</Text>
          <View style={s.optionsRow}>
            {item.options.map((o) => (
              <View key={o} style={s.option}>
                <CheckBox checked={selected.includes(o)} />
                <Text style={s.optionText}>{o}</Text>
              </View>
            ))}
          </View>
          {item.followUpLabel !== undefined && (
            <>
              <Text style={s.followLabel}>{item.followUpLabel}</Text>
              <AnswerBox text={utdyp} />
            </>
          )}
        </View>
      );
    }

    case "scale": {
      const selected = getString(values, item.id);
      const hvor = getString(values, `${item.id}_hvor`);
      return (
        <View style={s.qBlock} wrap={false}>
          <Text style={s.qLabel}>{item.label}</Text>
          <View style={s.optionsRow}>
            {Array.from({ length: item.max + 1 }, (_, i) => String(i)).map((n) => (
              <View key={n} style={[s.option, { marginRight: 10 }]}>
                <CheckBox checked={selected === n} />
                <Text style={s.optionText}>{n}</Text>
              </View>
            ))}
          </View>
          <AnswerBox text={hvor} />
        </View>
      );
    }

    case "matrix": {
      const selfHarm = item.id === "phq" && Number(getString(values, PHQ9_SELFHARM_KEY) || "0") > 0;
      return (
        <View style={s.qBlock}>
          {item.heading && <Text style={s.matrixHeading}>{item.heading}</Text>}
          <View style={s.table}>
            <View style={s.tHeadRow} wrap={false}>
              <Text style={s.tHeadLabel}>{item.header}</Text>
              {item.columns.map((c) => (
                <Text key={c} style={s.tHeadCol}>
                  {c}
                </Text>
              ))}
            </View>
            {item.rows.map((row, ri) => {
              const selected = getString(values, `${item.id}_${ri + 1}`);
              return (
                <View key={row} style={[s.tRow, ...(ri % 2 ? [s.tRowAlt] : [])]} wrap={false}>
                  <Text style={s.tRowLabel}>{row}</Text>
                  {item.columns.map((c, ci) => (
                    <View key={c} style={s.tCell}>
                      <CheckBox checked={selected === String(ci)} />
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
          {item.id === "phq" && (
            <View style={[s.notice, ...(selfHarm ? [s.noticeAlert] : [])]} wrap={false}>
              <Text style={s.noticeText}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>{SAFETY_NOTICE.lead}</Text> {SAFETY_NOTICE.text}
              </Text>
            </View>
          )}
        </View>
      );
    }
  }
}

export function EgenvurderingPdf({ values, date }: { values: FormValues; date: string }) {
  const navn = getString(values, "navn");
  const fnr = getString(values, "fnr");
  const signatur = getString(values, "signatur");

  return (
    <Document
      title={FORM_TITLE}
      author="DentDigital skjema"
      subject={`${FORM_TITLE} – ${navn}`}
      language="nb-NO"
    >
      <Page size="A4" style={s.page}>
        <Text style={s.runningHeader} fixed>
          {FORM_TITLE}
        </Text>
        <Text
          style={s.footer}
          fixed
          render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`}
        />

        <Text style={s.title}>{FORM_TITLE}</Text>
        <Text style={s.subtitle}>{FORM_SUBTITLE}</Text>
        <View style={s.titleRule} />

        <View style={s.metaRow}>
          <Text style={s.metaLabel}>Navn:</Text>
          <Text style={s.metaValue}>{navn}</Text>
        </View>
        <View style={s.metaRow}>
          <Text style={s.metaLabel}>Fødselsnummer (11 siffer):</Text>
          <Text style={s.metaValue}>{fnr}</Text>
        </View>
        <View style={s.metaRow}>
          <Text style={s.metaLabel}>Dato:</Text>
          <Text style={s.metaValue}>{date}</Text>
        </View>

        <View style={s.introBox}>
          <Text style={s.introTitle}>{INTRO_BOX.title}</Text>
          {INTRO_BOX.paragraphs.map((p) => (
            <Text key={p.slice(0, 24)} style={s.introText}>
              {p}
            </Text>
          ))}
          <Text style={s.introText}>{INTRO_BOX.privacy}</Text>
        </View>

        {sections.map((sec) => (
          <View key={sec.num}>
            <Text style={s.sectionHeading}>
              {sec.num}  {sec.title}
            </Text>
            {sec.intro && <Text style={s.sectionIntro}>{sec.intro}</Text>}
            {sec.items.map((item) => (
              <ItemPdf key={item.id} item={item} values={values} />
            ))}
          </View>
        ))}

        <View wrap={false}>
          <View style={s.signRow}>
            <Text style={s.metaLabel}>Dato:</Text>
            <Text style={[s.signValue, { fontFamily: "Helvetica" }]}>{date}</Text>
          </View>
          <View style={s.signRow}>
            <Text style={s.metaLabel}>Signatur:</Text>
            <Text style={s.signValue}>{signatur}</Text>
          </View>
        </View>
      </Page>

      {/* Closing info page — as on the paper form */}
      <Page size="A4" style={s.page}>
        <Text style={s.runningHeader} fixed>
          {FORM_TITLE}
        </Text>
        <Text
          style={s.footer}
          fixed
          render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`}
        />

        <Text style={s.title}>{CLOSING.title}</Text>
        <Text style={s.subtitle}>{CLOSING.subtitle}</Text>
        <View style={s.titleRule} />

        <Text style={s.closingIntro}>{CLOSING.intro}</Text>
        <Text style={[s.qLabel, { fontFamily: "Helvetica-Bold", marginBottom: 6 }]}>{CLOSING.pointsTitle}</Text>
        {CLOSING.points.map((p) => (
          <View key={p.lead} style={s.pointRow}>
            <Text style={s.pointDash}>–</Text>
            <Text style={s.pointText}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{p.lead}</Text> {p.text}
            </Text>
          </View>
        ))}
        <View style={s.quoteBox}>
          <Text style={s.quoteText}>{CLOSING.quote}</Text>
        </View>
        <Text style={{ fontSize: 9, color: "#333333" }}>{CLOSING.signoff[0]}</Text>
        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginTop: 2 }}>{CLOSING.signoff[1]}</Text>
      </Page>
    </Document>
  );
}

export async function renderEgenvurderingPdf(values: FormValues, date: string): Promise<Buffer> {
  return renderToBuffer(<EgenvurderingPdf values={values} date={date} />);
}
