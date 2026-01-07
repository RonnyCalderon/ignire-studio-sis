import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Heart, Flame, Map, Quote } from 'lucide-react-native';
import { Card, CardContent } from '@/components/ui/card';
import { type ChallengeCategory } from '@/hooks/use-weekly-challenge';

interface ChallengeSelectionProps {
    onSelectCategory: (category: ChallengeCategory) => void;
    quote?: { text: string; author: string } | null;
}

export function ChallengeSelection({ onSelectCategory, quote }: ChallengeSelectionProps) {
    const categories = [
        { id: 'love', label: 'Love & Connection', icon: Heart, color: '#ec4899', description: 'Deepen your emotional bond and intimacy.' },
        { id: 'sexy', label: 'Passion & Heat', icon: Flame, color: '#ef4444', description: 'Ignite the spark and explore physical pleasure.' },
        { id: 'adventurous', label: 'Wild & Adventurous', icon: Map, color: '#f59e0b', description: 'Push boundaries and try something new.' },
    ];

    return (
        <ScrollView style={{ padding: 16 }}>
            {/* Quote Section */}
            {quote && (
                <View style={styles.quoteContainer}>
                    <Quote size={24} color="#FF5A5F" style={{ marginBottom: 8 }} />
                    <Text style={styles.quoteText}>"{quote.text}"</Text>
                    <Text style={styles.quoteAuthor}>— {quote.author}</Text>
                </View>
            )}

            <Text style={styles.heading}>
                Choose Your Path
            </Text>
            <Text style={styles.subHeading}>
                Select a vibe for this week's challenge.
            </Text>

            <View style={{ gap: 16, paddingBottom: 40 }}>
                {categories.map((cat) => (
                    <TouchableOpacity key={cat.id} onPress={() => onSelectCategory(cat.id as ChallengeCategory)}>
                        <Card>
                            <CardContent style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                                <View style={{ backgroundColor: `${cat.color}20`, padding: 12, borderRadius: 50, marginRight: 16 }}>
                                    <cat.icon size={32} color={cat.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>{cat.label}</Text>
                                    <Text style={{ fontSize: 14, color: '#666' }}>{cat.description}</Text>
                                </View>
                            </CardContent>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1a1a1a', 
    marginBottom: 8, 
    textAlign: 'center', 
    marginTop: 10
  },
  subHeading: {
    fontSize: 16, 
    color: '#666', 
    marginBottom: 24, 
    textAlign: 'center'
  },
  quoteContainer: {
    marginBottom: 24,
    marginTop: 10,
    padding: 16,
    backgroundColor: '#fff1f2',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5A5F',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'right',
  }
});
