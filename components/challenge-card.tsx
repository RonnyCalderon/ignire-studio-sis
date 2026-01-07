import { View, Text, Image, Alert, Platform } from "react-native";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Heart, Play, Flame, CalendarPlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { placeholderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { type Challenge } from "@/hooks/use-weekly-challenge";
import { smartShuffle } from "@/lib/utils";
import * as Calendar from 'expo-calendar';

interface ChallengeCardProps {
  challenge: Challenge;
  expiry: number | null; 
  onStart: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

const Countdown = ({ expiry }: { expiry: number }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
        <View style={{ flexDirection: 'row', gap: 16, marginVertical: 8 }}>
            {[
              { l: 'Days', v: timeLeft.days }, { l: 'Hrs', v: timeLeft.hours },
              { l: 'Mins', v: timeLeft.minutes }, { l: 'Secs', v: timeLeft.seconds }
            ].map((item, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                 <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{String(item.v).padStart(2, '0')}</Text>
                 <Text style={{ fontSize: 10, color: '#666' }}>{item.l}</Text>
              </View>
            ))}
        </View>
    );
};

export function ChallengeCard({ challenge, expiry, onStart, onComplete, isCompleted }: ChallengeCardProps) {
  const [challengeImage, setChallengeImage] = useState<ImagePlaceholder | null>(null);
  
  const getChallengeImage = async () => {
    const challengeImages = placeholderImages.filter(img => img.imageHint.includes('couple'));
    const img = await smartShuffle('challengeImages', challengeImages);
    setChallengeImage(img);
  }

  useEffect(() => {
    getChallengeImage();
  }, [challenge]);

  const addToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need access to your calendar to schedule this challenge.');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = Platform.OS === 'ios'
        ? calendars.find(cal => cal.source.name === 'Default') || calendars[0]
        : calendars.find(cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER) || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Error', 'Could not find a calendar to add this event to.');
        return;
      }

      const startDate = new Date();
      // Default to scheduling for "Tonight" (e.g., 8 PM)
      startDate.setHours(20, 0, 0, 0); 
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour

      await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Ignite Challenge: ${challenge.text}`,
        startDate,
        endDate,
        notes: challenge.persuasionScript,
        timeZone: 'GMT',
      });

      Alert.alert('Success', 'Challenge added to your calendar for tonight at 8 PM!');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to add event to calendar.');
    }
  };

  if (!challengeImage) return null;

  const isTimerRunning = expiry !== null;

  const renderScript = (text: string) => {
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\* /g, '• ')
      .replace(/<br \/>/g, '\n');
    
    return <Text style={{ lineHeight: 22, color: '#4b5563', fontStyle: 'italic' }}>{cleanText}</Text>;
  };

  return (
    <Card style={{ overflow: 'hidden', marginBottom: 24 }}>
      <View style={{ height: 200, width: '100%', position: 'relative' }}>
         <Image source={{ uri: challengeImage.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
         <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 6, flexDirection: 'row' }}>
            {Array.from({ length: 3 }).map((_, i) => (
                <Flame key={i} size={16} color={i < challenge.spicyLevel ? '#ef4444' : '#9ca3af'} fill={i < challenge.spicyLevel ? '#ef4444' : 'transparent'} />
            ))}
         </View>
      </View>

      <CardContent>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#1f2937' }}>
          "{challenge.text}"
        </Text>
        
        <View style={{ backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8 }}>
            {renderScript(challenge.persuasionScript)}
        </View>

        {isTimerRunning && expiry && (
          <View style={{ alignItems: 'center', marginTop: 16 }}>
             <View style={{ height: 1, backgroundColor: '#e5e7eb', width: '100%', marginBottom: 16 }} />
             <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Clock size={16} color="#6b7280" />
                <Text style={{ marginLeft: 6, color: '#6b7280' }}>Time Remaining</Text>
             </View>
             <Countdown expiry={expiry} />
             
             <Button variant="outline" onPress={addToCalendar} style={{ marginTop: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CalendarPlus size={16} color="#000" style={{ marginRight: 8 }} />
                    <Text>Add to Calendar</Text>
                </View>
             </Button>
          </View>
        )}
      </CardContent>

      <CardFooter style={{ justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        {isCompleted ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CheckCircle size={24} color="#16a34a" />
                <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: '600', color: '#16a34a' }}>Completed!</Text>
            </View>
        ) : isTimerRunning ? (
            <Button size="lg" onPress={onComplete}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Heart size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>We Did It!</Text>
                </View>
            </Button>
        ) : (
          <Button size="lg" onPress={onStart}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Play size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Start Challenge</Text>
              </View>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
