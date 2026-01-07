import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/user-provider";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flame, LogOut, ShieldCheck, Trophy } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

export default function ProfileScreen() {
    const { logout } = useUser();
    const [stats, setStats] = useState({ completed: 0, streak: 0 });
    const [preferences, setPreferences] = useState({
        public: true,
        toys: true,
        intense: true,
    });

    useEffect(() => {
        const loadData = async () => {
            // Load History for Stats
            const storedHistory = await AsyncStorage.getItem('challengeHistory');
            if (storedHistory) {
                const history = JSON.parse(storedHistory);
                setStats({ completed: history.length, streak: history.length }); // Simplified streak
            }
            
            // Load Preferences
            const storedPrefs = await AsyncStorage.getItem('comfortPreferences');
            if (storedPrefs) {
                setPreferences(JSON.parse(storedPrefs));
            }
        };
        loadData();
    }, []);

    const handlePreferenceChange = async (key: string, value: boolean) => {
        const newPrefs = { ...preferences, [key]: value };
        setPreferences(newPrefs);
        await AsyncStorage.setItem('comfortPreferences', JSON.stringify(newPrefs));
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9' }} contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.headerTitle}>Profile & Preferences</Text>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                <Card style={{ flex: 1 }}>
                    <CardContent style={{ padding: 16, alignItems: 'center' }}>
                        <Trophy size={24} color="#F59E0B" style={{ marginBottom: 8 }} />
                        <Text style={styles.statValue}>{stats.completed}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </CardContent>
                </Card>
                <Card style={{ flex: 1 }}>
                    <CardContent style={{ padding: 16, alignItems: 'center' }}>
                        <Flame size={24} color="#ef4444" style={{ marginBottom: 8 }} />
                        <Text style={styles.statValue}>{stats.streak}</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </CardContent>
                </Card>
            </View>

            {/* Preferences */}
            <Card style={{ marginBottom: 24 }}>
                <CardHeader style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={24} color="#333" />
                    <CardTitle>Comfort Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <View style={styles.prefRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.prefTitle}>Public Places</Text>
                            <Text style={styles.prefDesc}>Challenges outside the home.</Text>
                        </View>
                        <Switch 
                            value={preferences.public} 
                            onValueChange={(v) => handlePreferenceChange('public', v)} 
                            trackColor={{ false: "#e5e7eb", true: "#FF5A5F" }}
                        />
                    </View>
                    <View style={styles.divider} />
                    
                    <View style={styles.prefRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.prefTitle}>Use of Toys</Text>
                            <Text style={styles.prefDesc}>Challenges involving toys.</Text>
                        </View>
                        <Switch 
                            value={preferences.toys} 
                            onValueChange={(v) => handlePreferenceChange('toys', v)} 
                            trackColor={{ false: "#e5e7eb", true: "#FF5A5F" }}
                        />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.prefRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.prefTitle}>High Intensity</Text>
                            <Text style={styles.prefDesc}>More adventurous challenges.</Text>
                        </View>
                        <Switch 
                            value={preferences.intense} 
                            onValueChange={(v) => handlePreferenceChange('intense', v)} 
                            trackColor={{ false: "#e5e7eb", true: "#FF5A5F" }}
                        />
                    </View>
                </CardContent>
            </Card>

            <Button onPress={logout} variant="outline" style={{ borderColor: '#ef4444' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LogOut size={16} color="#ef4444" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#ef4444' }}>Log Out</Text>
                </View>
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    headerTitle: { fontSize: 32, fontWeight: '800', color: '#1a1a1a', marginBottom: 24, marginTop: 10 },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
    statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
    prefRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    prefTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    prefDesc: { fontSize: 13, color: '#666' },
    divider: { height: 1, backgroundColor: '#f0f0f0' }
});