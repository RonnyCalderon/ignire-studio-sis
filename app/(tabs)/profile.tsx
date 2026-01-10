import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { UserOnboarding } from "@/components/user-onboarding";
import { useUser } from "@/context/user-provider";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  disableNotifications,
  scheduleDailyPhraseNotification,
} from "@/lib/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BellRing,
  Flame,
  Heart,
  LogOut,
  ShieldCheck,
  Trophy
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const maleCharacter = require('@/assets/images/stickers/Cute-creatures/man-suit-character.png');
const femaleCharacter = require('@/assets/images/stickers/dominatrix2.png');

export default function ProfileScreen() {
  const { logout, gender, userIsKnown, userName, partnerName } = useUser();
  const [stats, setStats] = useState({ completed: 0, streak: 0 });
  const [preferences, setPreferences] = useState({
    public: true,
    toys: true,
    intense: true,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const primaryColor = useThemeColor({}, "primary");
  const destructiveColor = useThemeColor({}, "destructive");
  const borderColor = useThemeColor({}, "border");
  const mutedColor = useThemeColor({}, "muted");
  const cardColor = useThemeColor({}, 'card');

  useEffect(() => {
    const loadData = async () => {
      const storedHistory = await AsyncStorage.getItem("challengeHistory");
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        setStats({ completed: history.length, streak: history.length });
      }

      const storedPrefs = await AsyncStorage.getItem("comfortPreferences");
      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }
    };
    loadData();
  }, []);

  const handlePreferenceChange = async (key: string, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    await AsyncStorage.setItem("comfortPreferences", JSON.stringify(newPrefs));
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      if (gender) {
        scheduleDailyPhraseNotification(gender as "woman" | "man");
      }
    } else {
      disableNotifications();
    }
  };
  
  const character = gender === 'man' ? maleCharacter : femaleCharacter;

  if (!userIsKnown) {
    return <UserOnboarding />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileHeader}>
            <View style={[styles.avatar, {backgroundColor: cardColor}]}>
                <Image source={character} style={styles.avatarImage} />
            </View>
            <Text style={[styles.headerTitle, { color: textColor }]}>
                {userName}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', opacity: 0.7}}>
                <Heart size={14} color={primaryColor} fill={primaryColor} />
                <Text style={[styles.partnerText, {color: mutedForeground}]}> In a relationship with {partnerName}</Text>
            </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <Card style={{ flex: 1, padding: 16, alignItems: "center" }}>
            <Trophy
              size={24}
              color={primaryColor}
              style={{ marginBottom: 8 }}
            />
            <Text style={[styles.statValue, { color: textColor }]}>
              {stats.completed}
            </Text>
            <Text style={[styles.statLabel, { color: mutedForeground }]}>
              Completed
            </Text>
          </Card>
          <Card style={{ flex: 1, padding: 16, alignItems: "center" }}>
            <Flame
              size={24}
              color={destructiveColor}
              style={{ marginBottom: 8 }}
            />
            <Text style={[styles.statValue, { color: textColor }]}>
              {stats.streak}
            </Text>
            <Text style={[styles.statLabel, { color: mutedForeground }]}>
              Streak
            </Text>
          </Card>
        </View>

        <Card style={{ marginBottom: 24 }}>
          <View style={[styles.cardHeader, { padding: 20 }]}>
            <BellRing size={24} color={textColor} />
            <Text
              style={[styles.cardTitle, { color: textColor, marginLeft: 8 }]}
            >
              Notification Settings
            </Text>
          </View>
          <View style={{ padding: 20 }}>
            <View style={styles.prefRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.prefTitle, { color: textColor }]}>
                  Daily Phrase
                </Text>
                <Text style={[styles.prefDesc, { color: mutedForeground }]}>
                  Receive a daily whisper for your partner.
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: mutedColor, true: primaryColor }}
              />
            </View>
          </View>
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <View style={[styles.cardHeader, { padding: 20 }]}>
            <ShieldCheck size={24} color={textColor} />
            <Text
              style={[styles.cardTitle, { color: textColor, marginLeft: 8 }]}
            >
              Comfort Zone
            </Text>
          </View>
          <View style={{ padding: 20 }}>
            <View style={styles.prefRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.prefTitle, { color: textColor }]}>
                  Public Places
                </Text>
                <Text style={[styles.prefDesc, { color: mutedForeground }]}>
                  Challenges outside the home.
                </Text>
              </View>
              <Switch
                value={preferences.public}
                onValueChange={(v) => handlePreferenceChange("public", v)}
                trackColor={{ false: mutedColor, true: primaryColor }}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            <View style={styles.prefRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.prefTitle, { color: textColor }]}>
                  Use of Toys
                </Text>
                <Text style={[styles.prefDesc, { color: mutedForeground }]}>
                  Challenges involving toys.
                </Text>
              </View>
              <Switch
                value={preferences.toys}
                onValueChange={(v) => handlePreferenceChange("toys", v)}
                trackColor={{ false: mutedColor, true: primaryColor }}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            <View style={styles.prefRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.prefTitle, { color: textColor }]}>
                  High Intensity
                </Text>
                <Text style={[styles.prefDesc, { color: mutedForeground }]}>
                  More adventurous challenges.
                </Text>
              </View>
              <Switch
                value={preferences.intense}
                onValueChange={(v) => handlePreferenceChange("intense", v)}
                trackColor={{ false: mutedColor, true: primaryColor }}
              />
            </View>
          </View>
        </Card>

        <Button onPress={logout} variant="outline">
          <LogOut
            size={16}
            color={destructiveColor}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: destructiveColor }}>Log Out</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 120 },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
  },
  avatarImage: {
      width: '80%',
      height: '80%',
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "Playfair-Display",
    fontWeight: "800",
  },
  partnerText: {
      fontFamily: 'PT-Sans',
      fontSize: 14,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Playfair-Display",
  },
  statLabel: { fontSize: 12, marginTop: 2, fontFamily: "PT-Sans" },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: {
    fontSize: 20,
    fontFamily: "Playfair-Display",
    fontWeight: "bold",
  },
  prefRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  prefTitle: { fontSize: 16, fontWeight: "600", fontFamily: "PT-Sans" },
  prefDesc: { fontSize: 13, fontFamily: "PT-Sans" },
  divider: { height: 1 },
});
