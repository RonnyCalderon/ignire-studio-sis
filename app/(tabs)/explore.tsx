import { IntimacyQuizGame } from '@/components/intimacy-quiz-game';
import { PositionDiceGame } from '@/components/position-dice-game';
import { ScratchCardGame } from '@/components/scratch-card-game';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Playground</Text>
        <Text style={styles.subtitle}>Sparks & Games for the weekend.</Text>
      </View>

      <View style={styles.section}>
        <PositionDiceGame />
      </View>
      
      <View style={styles.section}>
        <IntimacyQuizGame />
      </View>

      <View style={styles.section}>
        <ScratchCardGame />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 40,
  }
});