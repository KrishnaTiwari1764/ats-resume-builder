import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";

// Styled to mirror a classic LaTeX-style resume template: centered header,
// dark-blue ruled section headings, two-column subheading rows (title/date,
// subtitle/location). Still single-column plain text under the hood, so it
// stays machine-parseable by ATS software (no tables, images, or icons).
const DARK_BLUE = "#142850";

const styles = StyleSheet.create({
  page: {
    padding: "25 32",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1A1A1A",
    lineHeight: 1.35,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 19,
    textAlign: "center",
    marginBottom: 4,
  },
  headline: {
    fontSize: 10.5,
    color: DARK_BLUE,
    textAlign: "center",
    marginBottom: 4,
  },
  contactLine: {
    fontSize: 9,
    color: "#333",
    textAlign: "center",
    marginBottom: 1,
  },
  link: { color: DARK_BLUE, textDecoration: "none" },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: DARK_BLUE,
    marginTop: 10,
    marginBottom: 1,
    paddingBottom: 2,
    borderBottom: `1 solid ${DARK_BLUE}`,
  },
  summary: { fontSize: 9.6, lineHeight: 1.4, marginTop: 4 },
  entry: { marginTop: 5 },
  subheadingRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
  },
  subheadingRow2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  boldText: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  dateText: { fontSize: 9.3, fontFamily: "Helvetica" },
  italicText: { fontFamily: "Helvetica-Oblique", fontSize: 9.6 },
  italicRight: { fontFamily: "Helvetica-Oblique", fontSize: 9.3 },
  bullet: { flexDirection: "row", marginTop: 1.5 },
  bulletDot: { width: 9, fontSize: 9.6 },
  bulletText: { flex: 1, fontSize: 9.6, lineHeight: 1.35 },
  skillItem: { flexDirection: "row", marginTop: 2 },
  skillLabel: { fontFamily: "Helvetica-Bold", fontSize: 9.6, marginRight: 3 },
  skillValue: { fontSize: 9.6, flex: 1 },
  languagesLine: { fontSize: 9.6, marginTop: 4 },
});

function Section({ title, children }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SubheadingEntry({ boldLeft, dateRight, italicLeft, italicRight, children }) {
  return (
    <View style={styles.entry} wrap={false}>
      <View style={styles.subheadingRow1}>
        <Text style={styles.boldText}>{boldLeft}</Text>
        {dateRight ? <Text style={styles.dateText}>{dateRight}</Text> : null}
      </View>
      {(italicLeft || italicRight) && (
        <View style={styles.subheadingRow2}>
          <Text style={styles.italicText}>{italicLeft}</Text>
          {italicRight ? <Text style={styles.italicRight}>{italicRight}</Text> : null}
        </View>
      )}
      {children}
    </View>
  );
}

function Bullets({ items }) {
  if (!items?.length) return null;
  return (
    <View>
      {items.map((b, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ResumeDocument({ resume }) {
  const c = resume.contact || {};

  const row1 = [c.phone, c.email, c.linkedin].filter(Boolean);
  const row2 = [c.github, c.location, !c.github ? c.website : null].filter(Boolean);

  const contactRow = (parts) => {
    const isLink = (p) => /@|linkedin\.com|github\.com|https?:\/\//i.test(p || "");
    const href = (p) => (p.includes("@") ? `mailto:${p}` : p.startsWith("http") ? p : `https://${p}`);
    return (
      <Text>
        {parts.map((p, i) => (
          <Text key={i}>
            {isLink(p) ? (
              <Link src={href(p)} style={styles.link}>
                {p}
              </Link>
            ) : (
              p
            )}
            {i < parts.length - 1 ? "   |   " : ""}
          </Text>
        ))}
      </Text>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{c.name || "Your Name"}</Text>
        {resume.title && <Text style={styles.headline}>{resume.title}</Text>}
        {row1.length > 0 && <Text style={styles.contactLine}>{contactRow(row1)}</Text>}
        {row2.length > 0 && <Text style={styles.contactLine}>{contactRow(row2)}</Text>}

        {resume.summary && (
          <Section title="Professional Summary">
            <Text style={styles.summary}>{resume.summary}</Text>
          </Section>
        )}

        {resume.education?.length > 0 && (
          <Section title="Education">
            {resume.education.map((ed, i) => (
              <SubheadingEntry
                key={i}
                boldLeft={ed.school}
                dateRight={[ed.startDate, ed.endDate].filter(Boolean).join(" -- ")}
                italicLeft={[ed.degree, ed.field ? `, ${ed.field}` : ""].join("")}
                italicRight={ed.location}
              />
            ))}
          </Section>
        )}

        {(resume.skillCategories?.length > 0 || resume.skills?.length > 0) && (
          <Section title="Technical Skills">
            {resume.skillCategories?.length > 0
              ? resume.skillCategories.map((cat, i) => (
                  <View key={i} style={styles.skillItem}>
                    <Text style={styles.skillLabel}>{cat.category}:</Text>
                    <Text style={styles.skillValue}>{cat.items.join(", ")}</Text>
                  </View>
                ))
              : (
                  <View style={styles.skillItem}>
                    <Text style={styles.skillValue}>{resume.skills.join(", ")}</Text>
                  </View>
                )}
          </Section>
        )}

        {resume.experience?.length > 0 && (
          <Section title="Professional Experience">
            {resume.experience.map((job, i) => (
              <SubheadingEntry
                key={i}
                boldLeft={[job.title, job.company].filter(Boolean).join(" -- ")}
                dateRight={[job.startDate, job.endDate].filter(Boolean).join(" -- ")}
                italicLeft={job.location}
              >
                <Bullets items={job.bullets} />
              </SubheadingEntry>
            ))}
          </Section>
        )}

        {resume.projects?.length > 0 && (
          <Section title="Projects">
            {resume.projects.map((proj, i) => (
              <SubheadingEntry
                key={i}
                boldLeft={proj.name}
                dateRight={proj.date}
                italicLeft={proj.technologies}
              >
                {proj.description && (
                  <Text style={[styles.bulletText, { marginTop: 1, marginBottom: 1 }]}>
                    {proj.description}
                  </Text>
                )}
                <Bullets items={proj.bullets} />
              </SubheadingEntry>
            ))}
          </Section>
        )}

        {resume.certifications?.length > 0 && (
          <Section title="Certifications">
            <Text style={styles.summary}>{resume.certifications.join("  ·  ")}</Text>
          </Section>
        )}

        {resume.languages?.length > 0 && (
          <Section title="Languages">
            <Text style={styles.languagesLine}>
              {resume.languages.map((l) => `${l.name}${l.level ? `: ${l.level}` : ""}`).join("   |   ")}
            </Text>
          </Section>
        )}
      </Page>
    </Document>
  );
}
