import { IntimacyQuizGame } from '@/components/games/intimacy-quiz-game';
import { PositionDiceGame } from '@/components/games/position-dice-game';
import { ScratchCardGame } from '@/components/games/scratch-card-game';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Dices, Heart, Sparkles, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedForeground = useThemeColor({}, 'mutedForeground');
  const cardColor = useThemeColor({}, 'card');

  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'dice',
      title: 'Love Dice',
      description: 'Roll to decide your next move...',
      icon: Dices,
      component: PositionDiceGame,
      image: require('@/assets/images/challenges/photo-1544154141-5b021fdf83cc.webp'),
      color: '#FF6B6B',
    },
    {
      id: 'quiz',
      title: 'Intimacy Quiz',
      description: 'Deepen your connection with questions.',
      icon: Heart,
      component: IntimacyQuizGame,
      image: require('@/assets/images/challenges/photo-1593526659358-5f1489f8efa2.webp'),
      color: '#4ECDC4',
    },
    {
      id: 'scratch',
      title: 'Secret Scratch',
      description: 'Reveal a hidden challenge.',
      icon: Sparkles,
      component: ScratchCardGame,
      image: require('@/assets/images/challenges/photo-1504194569341-48a2e831a3a7.webp'),
      color: '#FFE66D',
    },
  ];

  const renderGameModal = () => {
    const game = games.find((g) => g.id === selectedGame);
    if (!game) return null;

    const GameComponent = game.component;

    return (
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={!!selectedGame}
        onRequestClose={() => setSelectedGame(null)}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor }]} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setSelectedGame(null)}
              style={styles.closeButton}>
              <X size={24} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {game.title}
            </Text>
            <View style={{ width: 24 }} /> 
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <GameComponent />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Playground</Text>
          <Text style={[styles.subtitle, { color: mutedForeground }]}>
            Sparks & Games for the weekend.
          </Text>
        </View>

        <View style={styles.grid}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, { backgroundColor: cardColor }]}
              onPress={() => setSelectedGame(game.id)}
              activeOpacity={0.9}>
              <View style={styles.imageContainer}>
                <Image source={game.image} style={styles.gameImage} />
                <View style={[styles.iconBadge, { backgroundColor: cardColor }]}>
                  <game.icon size={24} color={textColor} />
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.gameTitle, { color: textColor }]}>
                  {game.title}
                </Text>
                <Text
                  style={[styles.gameDescription, { color: mutedForeground }]}>
                  {game.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {renderGameModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 10,
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
  grid: {
    gap: 16,
  },
  gameCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  imageContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
  },
  gameImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -20,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
    paddingTop: 24,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Playfair-Display',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 14,
    fontFamily: 'PT-Sans',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Playfair-Display',
  },
  modalContent: {
    padding: 16,
  },
});
