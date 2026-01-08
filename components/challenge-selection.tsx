import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Heart, Flame, Map, Quote } from 'lucide-react-native';
import Card from '@/components/ui/card';
import { type ChallengeCategory } from '@/hooks/use-weekly-challenge';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ChallengeSelectionProps {
    onSelectCategory: (category: ChallengeCategory) => void;
    quote?: { text: string; author: string } | null;
}

export function ChallengeSelection({ onSelectCategory, quote }: ChallengeSelectionProps) {
    const textColor = useThemeColor({}, 'text');
    const subTextColor = useThemeColor({light: '#666', dark: '#999'}, 'text');
    const primaryColor = useThemeColor({}, 'primary');
    const quoteBackgroundColor = useThemeColor({light: '#fff1f2', dark: '#2A2525'}, 'background');

    const categories = [
        { id: 'love', label: 'Love & Connection', icon: Heart, color: '#ec4899', description: 'Deepen your emotional bond and intimacy.' },
        { id: 'sexy', label: 'Passion & Heat', icon: Flame, color: '#ef4444', description: 'Ignite the spark and explore physical pleasure.' },
        { id: 'adventurous', label: 'Wild & Adventurous', icon: Map, color: '#f59e0b', description: 'Push boundaries and try something new.' },
    ];

    return (
        <ScrollView style={{ padding: 16 }}>
            {/* Quote Section */}
            {quote && (
                <View style={[styles.quoteContainer, { backgroundColor: quoteBackgroundColor, borderLeftColor: primaryColor }]}>
                    <Quote size={24} color={primaryColor} style={{ marginBottom: 8 }} />
                    <Text style={styles.quoteText}>"{quote.text}"</Text>
                    <Text style={[styles.quoteAuthor, {color: textColor}]}>— {quote.author}</Text>
                </View>
            )}

            <Text style={[styles.heading, {color: textColor}]}>
                Choose Your Path
            </Text>
            <Text style={[styles.subHeading, {color: subTextColor}]}>
                Select a vibe for this week's challenge.
            </Text>

            <View style={{ gap: 16, paddingBottom: 40 }}>
                {categories.map((cat) => (
                    <TouchableOpacity key={cat.id} onPress={() => onSelectCategory(cat.id as ChallengeCategory)}>
                        <Card>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                                <View style={{ backgroundColor: `${cat.color}20`, padding: 12, borderRadius: 50, marginRight: 16 }}>
                                    <cat.icon size={32} color={cat.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: textColor }}>{cat.label}</Text>
                                    <Text style={{ fontSize: 14, color: subTextColor }}>{cat.description}</Text>
                                </View>
                            </View>
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
    fontFamily: 'Playfair-Display',
    fontWeight: 'bold', 
    marginBottom: 8, 
    textAlign: 'center', 
    marginTop: 10
  },
  subHeading: {
    fontSize: 16, 
    fontFamily: 'PT-Sans',
    marginBottom: 24, 
    textAlign: 'center'
  },
  quoteContainer: {
    marginBottom: 24,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  quoteText: {
    fontSize: 16,
    fontFamily: 'PT-Sans',
    fontStyle: 'italic',
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    fontFamily: 'PT-Sans',
    fontWeight: '600',
    textAlign: 'right',
  }
});
