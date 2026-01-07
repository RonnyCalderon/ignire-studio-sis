import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AccordionItem } from "@/components/ui/accordion";
import { Trophy, Flame } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { levels, type Level } from "@/lib/levels";
import { useUser } from "@/context/user-provider";

interface CompletedChallenge {
    challenge: any;
    completedAt: number;
}

const getCurrentLevel = (completedCount: number) => {
    const sortedLevels = [...levels].sort((a, b) => a.threshold - b.threshold);
    let currentLevel = null;
    let nextLevel = null;

    for (let i = 0; i < sortedLevels.length; i++) {
        if (completedCount >= sortedLevels[i].threshold) {
            currentLevel = sortedLevels[i];
        } else {
            nextLevel = sortedLevels[i];
            break;
        }
    }
    return [currentLevel, nextLevel];
};

export default function HistoryScreen() {
    const { userName, partnerName } = useUser();
    const [history, setHistory] = useState<CompletedChallenge[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = useCallback(async () => {
        try {
            const storedHistory = await AsyncStorage.getItem('challengeHistory');
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory);
                setHistory(parsedHistory.sort((a: any, b: any) => b.completedAt - a.completedAt)); // Newest first
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const completedCount = history.length;
    const [currentLevel, nextLevel] = getCurrentLevel(completedCount);
    
    // @ts-ignore
    const progress = nextLevel && currentLevel 
        // @ts-ignore
        ? ((completedCount - (currentLevel.threshold - 1)) / (nextLevel.threshold - (currentLevel.threshold - 1))) * 100
        : completedCount > 0 ? 100 : 0;

    return (
        <ScrollView 
            style={{ flex: 1, backgroundColor: '#f9f9f9' }} 
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={{ marginBottom: 24, marginTop: 10 }}>
                <Text style={{ fontSize: 32, fontWeight: '800', color: '#1a1a1a' }}>Our Journey</Text>
                <Text style={{ fontSize: 16, color: '#666' }}>{userName} & {partnerName}'s shared adventures.</Text>
            </View>

            {/* Current Level Card */}
            {currentLevel && (
                <Card style={{ marginBottom: 24, borderColor: '#FF5A5F', borderWidth: 1 }}>
                    <CardHeader style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                         {/* @ts-ignore - Icon handling in RN */}
                        <currentLevel.icon size={48} color="#FF5A5F" />
                        <View>
                            <Text style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>Current Rank</Text>
                            {/* @ts-ignore */}
                            <CardTitle style={{ color: '#FF5A5F', fontSize: 24 }}>{currentLevel.title}</CardTitle>
                        </View>
                    </CardHeader>
                    <CardContent>
                        {/* @ts-ignore */}
                        <Text style={{ fontStyle: 'italic', color: '#444', marginBottom: 16 }}>"{currentLevel.description}"</Text>
                        
                        {nextLevel ? (
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    {/* @ts-ignore */}
                                    <Text style={{ fontSize: 12, color: '#666' }}>Next: <Text style={{ fontWeight: 'bold' }}>{nextLevel.title}</Text></Text>
                                    {/* @ts-ignore */}
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{completedCount} / {nextLevel.threshold}</Text>
                                </View>
                                <Progress value={progress} />
                            </View>
                        ) : (
                             <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#FF5A5F' }}>Max Level Reached!</Text>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Completed Log */}
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#1a1a1a' }}>History Log</Text>
            
            {history.length === 0 ? (
                <Card style={{ padding: 32, alignItems: 'center' }}>
                    <Trophy size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#666' }}>No adventures yet</Text>
                    <Text style={{ textAlign: 'center', color: '#999', marginTop: 4 }}>Complete a weekly challenge to start your history.</Text>
                </Card>
            ) : (
                <View>
                    {history.map((item, index) => (
                        <Card key={index} style={{ marginBottom: 12 }}>
                            <CardContent style={{ padding: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <Text style={{ fontSize: 12, color: '#999' }}>
                                        {new Date(item.completedAt).toLocaleDateString()}
                                    </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {Array.from({ length: item.challenge.spicyLevel || 1 }).map((_, i) => (
                                            <Flame key={i} size={14} color="#ef4444" fill="#ef4444" />
                                        ))}
                                    </View>
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                                    "{item.challenge.text}"
                                </Text>
                            </CardContent>
                        </Card>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}