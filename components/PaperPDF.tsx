import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// ⭐ 修正：フォントを確実に読み込ませる（絶対パス明示）
Font.register({
  family: "NotoSerifJP",
  fonts: [
    { src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/NotoSerifJP-Regular.ttf` },
    { src: `${typeof window !== "undefined" ? window.location.origin : ""}/fonts/NotoSerifJP-Bold.ttf`, fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "NotoSerifJP",
  },

  header: {
    fontSize: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },

  abstract: {
    marginBottom: 10,
  },

  twoColumn: {
    flexDirection: "row",
    gap: 10,
  },

  column: {
    width: "50%",
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 5,
  },

  text: {
    textAlign: "justify",
    marginBottom: 4,
    lineHeight: 1.5,
  },

  figure: {
    border: "1px solid #ccc",
    padding: 4,
    marginVertical: 5,
  },
});

export default function PaperPDF({ data, imageUrl }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>

        <View style={styles.header}>
          <Text>Journal of Daily Life Research</Text>
          <Text>DOI: 10.1234/mock</Text>
        </View>

        <Text style={styles.title}>{data.title}</Text>

        <Text style={styles.sectionTitle}>Abstract</Text>
        <Text style={styles.text}>{data.abstract}</Text>

        <View style={styles.twoColumn}>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>{data.introduction}</Text>

            <Text style={styles.sectionTitle}>2. Methods</Text>
            <Text style={styles.text}>{data.methods}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>3. Results</Text>
            <Text style={styles.text}>{data.results}</Text>

            {imageUrl && (
              <View style={styles.figure}>
                <Image src={imageUrl} />
                <Text>Fig.1</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>4. Discussion</Text>
            <Text style={styles.text}>{data.discussion}</Text>

            <Text style={styles.sectionTitle}>5. Conclusion</Text>
            <Text style={styles.text}>{data.conclusion}</Text>

            <Text style={styles.sectionTitle}>References</Text>
            <Text style={styles.text}>{data.references}</Text>
          </View>

        </View>

      </Page>
    </Document>
  );
}