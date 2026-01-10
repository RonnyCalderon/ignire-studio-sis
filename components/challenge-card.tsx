import { View, Text, Image, Alert, Platform, StyleSheet } from "react-native";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { CheckCircle, Clock, Heart, Play, Flame, CalendarPlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { placeholderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { type Challenge } from "@/hooks/use-weekly-challenge";
import { smartShuffle } from "@/lib/utils";
import * as Calendar from 'expo-calendar';
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUser } from "@/context/user-provider";
import { manCallsWomanNames, womanCallsManNames } from "@/lib/data";

interface ChallengeCardProps {
  challenge: Challenge;
  expiry: number | null;
  onStart: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

// Placeholder sticker image
const STICKER_PLACEHOLDER = require('@/assets/images/stickers/sex-shop.png');

async function getCalendarId(primaryColor: string): Promise<string | null> {
  if (Platform.OS === 'ios') {
      const sources = await Calendar.getSourcesAsync();
      const writableSource = sources.find(
          source => source.type === Calendar.SourceType.LOCAL ||
                    source.type === Calendar.SourceType.CALDAV ||
                    source.type === Calendar.SourceType.EXCHANGE
      );

      if (!writableSource) {
          return null;
      }
      
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      let calendar = calendars.find(
          cal => cal.source.id === writableSource.id && cal.allowsModifications
      );

      if (calendar) {
          return calendar.id;
      }

      return await Calendar.createCalendarAsync({
          title: 'Ignite Studio',
          color: primaryColor,
          entityType: Calendar.EntityTypes.EVENT,
          source: {
            id: writableSource.id,
            name: writableSource.name,
          },
          name: 'Ignite Studio',
          ownerAccount: 'personal',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
  } else {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const primaryCalendar = calendars.find(cal => cal.isPrimary);
      if (primaryCalendar) {
          return primaryCalendar.id;
      }
      return calendars.find(cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER)?.id || null;
  }
}

const Countdown = ({ expiry }: { expiry: number }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const textColor = useThemeColor({}, 'text');
    const mutedForeground = useThemeColor({}, 'mutedForeground');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const distance = expiry - now;
            if (distance < 0) {
                clearInterval(timer);
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(timer);
    }, [expiry]);

    return (
        <View style={styles.countdownContainer}>
            {[
              { l: 'Days', v: timeLeft.days }, { l: 'Hrs', v: timeLeft.hours },
              { l: 'Mins', v: timeLeft.minutes }, { l: 'Secs', v: timeLeft.seconds }
            ].map((item, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                 <Text style={[styles.countdownValue, { color: textColor }]}>{String(item.v).padStart(2, '0')}</Text>
                 <Text style={[styles.countdownLabel, { color: mutedForeground }]}>{item.l}</Text>
              </View>
            ))}
        </View>
    );
};

export function ChallengeCard({ challenge, expiry, onStart, onComplete, isCompleted }: ChallengeCardProps) {
  const [challengeImage, setChallengeImage] = useState<ImagePlaceholder | null>(null);
  const [partnerNickname, setPartnerNickname] = useState<string | null>(null);
  const { gender } = useUser();
  
  const textColor = useThemeColor({}, 'text');
  const mutedForeground = useThemeColor({}, 'mutedForeground');
  const cardBackgroundColor = useThemeColor({}, 'card');
  const mutedBackgroundColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');
  const successColor = useThemeColor({}, 'success');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryForeground = useThemeColor({}, 'primaryForeground');
  const destructiveColor = useThemeColor({}, 'destructive');

  const getChallengeImage = async () => {
    const challengeImages = placeholderImages.filter(img => img.imageHint.includes('couple'));
    const img = await smartShuffle('challengeImages', challengeImages);
    setChallengeImage(img);
  }

  const getPartnerNickname = async () => {
    let name = "";
    if (gender === 'woman') {
        // Woman calls Man
        const shuffledName = await smartShuffle('womanCallsManNames', womanCallsManNames);
            name = shuffledName || "Love";

    } else if (gender === 'man') {
            // Man calls Woman
        const shuffledName = await smartShuffle('manCallsWomanNames', manCallsWomanNames);
        name = shuffledName || "Love";
    } else {
        name = "Love";
    }
    setPartnerNickname(name);
  }

  useEffect(() => {
    getChallengeImage();
    getPartnerNickname();
  }, [challenge]);

  const addToCalendar = async () => {
    if (!expiry) {
        Alert.alert('Error', 'Challenge expiry date is not set.');
        return;
    }

    try {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'To add challenges to your calendar, please grant calendar permissions in your device settings.');
            return;
        }

        const calendarId = await getCalendarId(primaryColor);

        if (!calendarId) {
            Alert.alert('Error', 'Could not find a writable calendar on your device.');
            return;
        }

        const cleanNotes = challenge.persuasionScript
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ');

        const startDate = new Date(expiry - 7 * 24 * 60 * 60 * 1000);
        const endDate = new Date(expiry);

        const eventDetails = {
            title: `Weekly Challenge: ${challenge.text}`,
            notes: cleanNotes,
            startDate,
            endDate,
            allDay: true,
            alarms: [
                { relativeOffset: 24 * 60 },
                { relativeOffset: 3 * 24 * 60 },
                { relativeOffset: (7 * 24 * 60) - 60 }
            ],
        };

        await Calendar.createEventAsync(calendarId, eventDetails);

        Alert.alert('Success!', 'Challenge has been added to your calendar.');

    } catch (error) {
        console.error('Failed to add to calendar:', error);
        Alert.alert('Error', 'An unexpected error occurred while adding the event to your calendar.');
    }
  };

  if (!challengeImage) return null;

  const isTimerRunning = expiry !== null;

  const renderScript = (text: string) => {
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\* /g, '• ')
      .replace(/<br\s*\/?>/gi, '\n');
    
    return <Text style={[styles.scriptText, { color: textColor }]}>{cleanText}</Text>;
  };

  return (
    <Card style={{ overflow: 'hidden', marginBottom: 24 }}>
      <View style={styles.imageContainer}>
         <Image source={challengeImage.source} style={styles.image} resizeMode="cover" />
         <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(85, 50, 40, 0.2)' }]} />
         <View style={styles.flameContainer}>
            {Array.from({ length: 3 }).map((_, i) => (
                <Flame key={i} size={16} color={i < challenge.spicyLevel ? destructiveColor : mutedForeground} fill={i < challenge.spicyLevel ? destructiveColor : 'transparent'} />
            ))}
         </View>
      </View>

      <View style={{ padding: 20 }}>
        {/* We use a Text component for the title. If emojis are in challenge.text, they should render. */}
        <Text style={[styles.challengeText, { color: textColor }]}>
          "{challenge.text}"
        </Text>
        
        <View style={[styles.scriptContainer, { backgroundColor: mutedBackgroundColor }]}>
            {/* Emojis in persuasionScript should also render here. */}
            {renderScript((partnerNickname ? `${partnerNickname}, ` : '') + challenge.persuasionScript.charAt(0).toLowerCase() + challenge.persuasionScript.slice(1))}
        </View>

        {isTimerRunning && expiry && (
          <View style={{ alignItems: 'center', marginTop: 16 }}>
             <View style={[styles.separator, { backgroundColor: borderColor }]} />
             <View style={styles.timerContainer}>
                <Clock size={16} color={mutedForeground} />
                <Text style={[styles.timerText, { color: mutedForeground }]}>Time Remaining</Text>
             </View>
             <Countdown expiry={expiry} />
             
             <Button variant="outline" onPress={addToCalendar} style={{ marginTop: 12 }}>
                <CalendarPlus size={16} color={primaryColor} style={{ marginRight: 8 }} />
                <Text style={{ color: primaryColor }}>Add to Calendar</Text>
             </Button>
          </View>
        )}
      </View>

      <View style={[styles.footer, { backgroundColor: cardBackgroundColor }]}>
        {isCompleted ? (
            <View style={styles.completedContainer}>
                <CheckCircle size={24} color={successColor} />
                <Text style={[styles.completedText, { color: successColor }]}>Completed!</Text>
                <View style={[styles.stickerBadge, { borderColor: successColor }]}>
                     <Image source={STICKER_PLACEHOLDER} style={styles.stickerImage} resizeMode="contain" />
                </View>
            </View>
        ) : isTimerRunning ? (
            <Button onPress={onComplete}>
                <Heart size={20} color={primaryForeground} style={{ marginRight: 8 }} />
                <Text style={{ color: primaryForeground, fontWeight: 'bold' }}>We Did It!</Text>
            </Button>
        ) : (
          <Button onPress={onStart}>
              <Play size={20} color={primaryForeground} style={{ marginRight: 8 }} />
              <Text style={{ color: primaryForeground, fontWeight: 'bold' }}>Start Challenge</Text>
          </Button>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
    countdownContainer: { flexDirection: 'row', gap: 16, marginVertical: 8 },
    countdownValue: { fontSize: 20, fontWeight: 'bold', fontFamily: 'PlayfairDisplay-Regular' }, // Fixed font family name
    countdownLabel: { fontSize: 10, fontFamily: 'PTSans-Regular' }, // Fixed font family name
    imageContainer: { height: 200, width: '100%', position: 'relative' },
    image: { width: '100%', height: '100%' },
    flameContainer: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 6, flexDirection: 'row' },
    challengeText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, fontFamily: 'PlayfairDisplay-Regular' }, // Fixed font family name
    scriptContainer: { padding: 12, borderRadius: 8 },
    scriptText: { lineHeight: 22, fontStyle: 'italic', fontFamily: 'PTSans-Regular' }, // Fixed font family name
    separator: { height: 1, width: '100%', marginBottom: 16 },
    timerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    timerText: { marginLeft: 6, fontFamily: 'PTSans-Regular' }, // Fixed font family name
    footer: { justifyContent: 'center', padding: 20 },
    completedContainer: { flexDirection: 'row', alignItems: 'center' },
    completedText: { marginLeft: 8, fontSize: 18, fontWeight: '600', fontFamily: 'PTSans-Regular' }, // Fixed font family name
    stickerBadge: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, backgroundColor: '#fff', marginLeft: 12, justifyContent: 'center', alignItems: 'center' },
    stickerImage: { width: 30, height: 30 },
});
