import { IntimacyQuizGame } from '@/components/intimacy-quiz-game';
import { PositionDiceGame } from '@/components/position-dice-game';
import { ScratchCardGame } from '@/components/scratch-card-game';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedForeground = useThemeColor({}, 'mutedForeground');

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Playground</Text>
        <Text style={[styles.subtitle, { color: mutedForeground }]}>Sparks & Games for the weekend.</Text>
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
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Playfair-Display',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'PT-Sans',
  },
  section: {
    marginBottom: 40,
  }
});