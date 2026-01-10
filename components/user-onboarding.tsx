import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/user-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CheckCircle, Flame } from 'lucide-react-native';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const maleCharacter = require('@/assets/images/stickers/Cute-creatures/man-suit-character.png');
const femaleCharacter = require('@/assets/images/stickers/Cute-creatures/dominatrix2.png');

export function UserOnboarding() {
  const { saveUser } = useUser();
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [gender, setGender] = useState<'man' | 'woman' | ''>('');

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const descriptionColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const handleSubmit = () => {
    if (userName.trim() && partnerName.trim() && gender) {
      saveUser(userName.trim(), partnerName.trim(), gender);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
            <Flame size={48} color={primaryColor} />
            <Text style={[styles.title, { color: textColor }]}>Welcome to Ignite</Text>
            <Text style={[styles.description, { color: descriptionColor }]}>
            Let's get to know you and your partner to personalize your journey.
            </Text>
        </View>

        <Card style={styles.card}>
            <View style={styles.stepContainer}>
                <Label style={[styles.label, {color: textColor}]}>What's your name?</Label>
                <Input
                    placeholder="Your Name"
                    value={userName}
                    onChangeText={setUserName}
                />
            </View>

            <View style={styles.stepContainer}>
                <Label style={[styles.label, {color: textColor}]}>What's your partner's name?</Label>
                <Input
                    placeholder="Partner's Name"
                    value={partnerName}
                    onChangeText={setPartnerName}
                />
            </View>

            <View style={styles.stepContainer}>
                <Label style={[styles.label, {color: textColor}]}>I am a...</Label>
                <View style={styles.genderSelection}>
                    <TouchableOpacity 
                        style={[
                            styles.genderOption, 
                            { borderColor: gender === 'woman' ? primaryColor : borderColor },
                            { backgroundColor: gender === 'woman' ? cardColor : 'transparent' }
                        ]} 
                        onPress={() => setGender('woman')}
                    >
                        <Image source={femaleCharacter} style={styles.genderImage} />
                        <Text style={[styles.genderText, { color: textColor }]}>Woman</Text>
                        {gender === 'woman' && <CheckCircle size={20} color={primaryColor} style={styles.checkIcon} />}
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.genderOption, 
                            { borderColor: gender === 'man' ? primaryColor : borderColor },
                            { backgroundColor: gender === 'man' ? cardColor : 'transparent' }
                        ]} 
                        onPress={() => setGender('man')}
                    >
                         <Image source={maleCharacter} style={styles.genderImage} />
                        <Text style={[styles.genderText, { color: textColor }]}>Man</Text>
                        {gender === 'man' && <CheckCircle size={20} color={primaryColor} style={styles.checkIcon} />}
                    </TouchableOpacity>
                </View>
            </View>

            <Button
            onPress={handleSubmit}
            disabled={!userName.trim() || !partnerName.trim() || !gender}
            >
            <Text>Start Our Journey</Text>
            </Button>
        </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Playfair-Display',
    fontWeight: '800',
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'PT-Sans',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  stepContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontFamily: 'PT-Sans',
    fontWeight: '600'
  },
  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  genderOption: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 150,
  },
  genderImage: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  genderText: {
    fontSize: 16,
    fontFamily: 'PT-Sans',
    fontWeight: 'bold',
  },
  checkIcon: {
      position: 'absolute',
      top: 8,
      right: 8,
  }
});
