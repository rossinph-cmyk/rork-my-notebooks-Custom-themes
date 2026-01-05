import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useNotebooks } from "@/contexts/NotebookContext";
import { THEME_COLORS } from "@/constants/colors";
import { BookX } from "lucide-react-native";

export default function NotFoundScreen() {
  const { darkMode } = useNotebooks();
  const theme = darkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <BookX size={64} color={theme.text} strokeWidth={1.5} />
        <Text style={[styles.title, { color: theme.text }]}>Page not found</Text>
        <Text style={[styles.subtitle, { color: theme.placeholder }]}>
          This notebook or page doesn&apos;t exist
        </Text>
        <Link href="/" style={[styles.link, { backgroundColor: theme.accent }]}>
          <Text style={styles.linkText}>Go to My Notebooks</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  link: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
