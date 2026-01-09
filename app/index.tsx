import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notebooks</Text>
      <Text style={styles.subtitle}>Custom Themes</Text>
      <Link href="/(tabs)" style={styles.link}>
        <Text style={styles.linkText}>Get Started →</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    fontSize: 18,
    color: '#007AFF',
  },
});
