import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { intimacyQuestions, type IntimacyQuestion } from '@/lib/intimacy-quiz';
import { RefreshCw, Sparkles, ArrowRight, Trophy } from 'lucide-react-native';
import { smartShuffle } from '@/lib/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColor } from '@/hooks/use-theme-color';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const QUESTIONS_PER_LEVEL = 8;
const MAX_LEVEL = 4;

interface QuizState {
  level: number;
  answeredInLevel: number;
}

export function IntimacyQuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState<IntimacyQuestion | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({ level: 1, answeredInLevel: 0 });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const primaryColor = useThemeColor({}, 'primary');
  const primaryForeground = useThemeColor({}, 'primaryForeground');
  const textColor = useThemeColor({}, 'text');
  const mutedForeground = useThemeColor({}, 'mutedForeground');

  useEffect(() => {
    const loadState = async () => {
        try {
            const savedStateJSON = await AsyncStorage.getItem('quizState');
            if (savedStateJSON) {
                const savedState = JSON.parse(savedStateJSON);
                setQuizState(savedState);
                if (savedState.answeredInLevel >= QUESTIONS_PER_LEVEL) {
                    if (savedState.level < MAX_LEVEL) setShowLevelUp(true);
                    else setIsCompleted(true);
                } else {
                    loadNextQuestion(savedState.level);
                }
            } else {
                loadNextQuestion(1);
            }
        } catch(e) { console.error(e); }
    };
    loadState();
  }, []);

  const loadNextQuestion = async (level: number) => {
      const questionsForLevel = intimacyQuestions.filter(q => q.level === level);
      const nextQuestion = await smartShuffle(`intimacyQuestions_level_${level}`, questionsForLevel);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCurrentQuestion(nextQuestion);
  };

  const getNextQuestion = useCallback(async () => {
    if (showLevelUp || isCompleted) return;

    let { level, answeredInLevel } = quizState;
    const newAnsweredCount = answeredInLevel + 1;

    if (newAnsweredCount >= QUESTIONS_PER_LEVEL) {
      if (level < MAX_LEVEL) {
        setShowLevelUp(true);
        const newState = { ...quizState, answeredInLevel: newAnsweredCount };
        setQuizState(newState);
        await AsyncStorage.setItem('quizState', JSON.stringify(newState));
      } else {
        setIsCompleted(true);
        await AsyncStorage.removeItem('quizState'); 
      }
      return;
    }

    const newState = { ...quizState, answeredInLevel: newAnsweredCount };
    setQuizState(newState);
    await AsyncStorage.setItem('quizState', JSON.stringify(newState));
    await loadNextQuestion(level);
  }, [quizState, showLevelUp, isCompleted]);

  const handleLevelUp = async () => {
    const newLevel = quizState.level + 1;
    const newState = { level: newLevel, answeredInLevel: 0 };
    setQuizState(newState);
    await AsyncStorage.setItem('quizState', JSON.stringify(newState));
    setShowLevelUp(false);
    await loadNextQuestion(newLevel);
  };
  
  const handleReset = async () => {
    await AsyncStorage.removeItem('quizState');
    for (let i = 1; i <= MAX_LEVEL; i++) {
        await AsyncStorage.removeItem(`intimacyQuestions_level_${i}`);
    }
    setQuizState({ level: 1, answeredInLevel: 0 });
    setShowLevelUp(false);
    setIsCompleted(false);
    await loadNextQuestion(1);
  };

  const renderContent = () => {
    if (isCompleted) {
      return (
        <View style={{ alignItems: 'center', padding: 24 }}>
            <Trophy size={64} color="#F59E0B" style={{ marginBottom: 16 }} />
            <Text style={[styles.heading, { color: textColor }]}>Journey Complete</Text>
            <Text style={[styles.text, { color: mutedForeground }]}>You've explored the depths of your connection. The journey of discovery never truly ends.</Text>
        </View>
      );
    }
    if (showLevelUp) {
      return (
        <View style={{ alignItems: 'center', padding: 24 }}>
            <Text style={[styles.heading, { color: primaryColor }]}>Level {quizState.level} Complete!</Text>
            <Text style={[styles.text, { color: mutedForeground }]}>You've built a stronger foundation. The next stage of your journey awaits.</Text>
        </View>
      );
    }
    return (
        currentQuestion && (
          <View style={{ padding: 16 }}>
            <Text style={[styles.questionText, { color: textColor }]}>"{currentQuestion.text}"</Text>
          </View>
        )
    );
  };

  const renderFooter = () => {
      if (isCompleted) {
        return (
            <Button onPress={handleReset} style={{ width: '100%' }}>
                <RefreshCw size={16} color={primaryForeground} style={{ marginRight: 8 }} />
                <Text style={{color: primaryForeground}}>Play Again</Text>
            </Button>
        );
      }
      if (showLevelUp) {
        return (
            <Button onPress={handleLevelUp} style={{ width: '100%' }}>
                <Text style={{color: primaryForeground}}>Proceed to Level {quizState.level + 1}</Text>
                <ArrowRight size={16} color={primaryForeground} style={{ marginLeft: 8 }} />
            </Button>
        );
      }
      return (
        <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            <Button onPress={getNextQuestion} style={{ flex: 1 }}>
              <Text style={{color: primaryForeground}}>Draw Next Question</Text>
            </Button>
            <Button onPress={handleReset} variant="outline">
                <RefreshCw size={16} color={primaryColor} />
            </Button>
        </View>
      );
  };

  return (
    <Card style={{ marginBottom: 24 }}>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Sparkles size={24} color={primaryColor} />
            <Text style={[styles.title, {color: textColor}]}>Invitation to Share (Level {quizState.level})</Text>
        </View>
        <Text style={{ textAlign: 'center', color: mutedForeground, marginTop: 4, fontFamily: 'PT-Sans' }}>
            Draw a card, take a breath, and answer openly.
        </Text>
      </View>
      <View style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        {renderContent()}
      </View>
      <View style={{ padding: 20 }}>
        {renderFooter()}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontFamily: 'Playfair-Display',
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Playfair-Display',
        fontWeight: 'bold',
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'PT-Sans',
    },
    questionText: {
        fontSize: 22,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 32,
        fontFamily: 'PT-Sans',
    }
});
