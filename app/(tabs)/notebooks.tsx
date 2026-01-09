import { View, Text, StyleSheet } from 'react-native';

export default function NotebooksTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notebooks</Text>
      <Text style={styles.text}>Your notebooks will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});
