import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { intimacyQuestions, type IntimacyQuestion } from '@/lib/intimacy-quiz';
import { RefreshCw, Sparkles, ArrowRight, Trophy } from 'lucide-react-native';
import { smartShuffle } from '@/lib/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            <Text style={styles.heading}>Journey Complete</Text>
            <Text style={styles.text}>You've explored the depths of your connection. The journey of discovery never truly ends.</Text>
        </View>
      );
    }
    if (showLevelUp) {
      return (
        <View style={{ alignItems: 'center', padding: 24 }}>
            <Text style={[styles.heading, { color: '#FF5A5F' }]}>Level {quizState.level} Complete!</Text>
            <Text style={styles.text}>You've built a stronger foundation. The next stage of your journey awaits.</Text>
        </View>
      );
    }
    return (
        currentQuestion && (
          <View style={{ padding: 16 }}>
            <Text style={styles.questionText}>"{currentQuestion.text}"</Text>
          </View>
        )
    );
  };

  const renderFooter = () => {
      if (isCompleted) {
        return (
            <Button onPress={handleReset} style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RefreshCw size={16} color="white" style={{ marginRight: 8 }} />
                    <Text style={{ color: 'white' }}>Play Again</Text>
                </View>
            </Button>
        );
      }
      if (showLevelUp) {
        return (
            <Button onPress={handleLevelUp} style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>Proceed to Level {quizState.level + 1}</Text>
                    <ArrowRight size={16} color="white" style={{ marginLeft: 8 }} />
                </View>
            </Button>
        );
      }
      return (
        <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            <Button onPress={getNextQuestion} style={{ flex: 1 }}>
              <Text style={{ color: 'white' }}>Draw Next Question</Text>
            </Button>
            <Button onPress={handleReset} variant="outline" size="icon">
                <RefreshCw size={16} color="#000" />
            </Button>
        </View>
      );
  };

  return (
    <Card style={{ marginBottom: 24 }}>
      <CardHeader style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Sparkles size={24} color="#FF5A5F" />
            <CardTitle>Invitation to Share (Level {quizState.level})</CardTitle>
        </View>
        <Text style={{ textAlign: 'center', color: '#666', marginTop: 4 }}>
            Draw a card, take a breath, and answer openly.
        </Text>
      </CardHeader>
      <CardContent style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
        {renderContent()}
      </CardContent>
      <CardFooter>
        {renderFooter()}
      </CardFooter>
    </Card>
  );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#1a1a1a'
    },
    text: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        lineHeight: 24
    },
    questionText: {
        fontSize: 22,
        fontWeight: '500',
        textAlign: 'center',
        color: '#1f2937',
        lineHeight: 32,
    }
});
