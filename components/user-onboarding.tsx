import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '@/context/user-provider';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Card from '@/components/ui/card';
import { Flame } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export function UserOnboarding() {
  const { saveUser } = useUser();
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const descriptionColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');

  const handleSubmit = () => {
    if (userName.trim() && partnerName.trim()) {
      saveUser(userName.trim(), partnerName.trim());
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <View style={{ alignItems: 'center', padding: 20 }}>
            <Flame size={48} color={primaryColor} fill={primaryColor} />
            <Text style={[styles.title, { color: primaryColor }]}>Welcome to Ignite</Text>
            <Text style={[styles.description, { color: descriptionColor }]}>
                Let's personalize your journey. Tell us who you are so we can tailor this experience for you.
            </Text>
        </View>
        
        <View style={{ padding: 20 }}>
            <View style={styles.space}>
              <Label>Your Name</Label>
              <Input
                placeholder="Enter your name"
                value={userName}
                onChangeText={setUserName}
              />
            </View>
            <View style={styles.space}>
              <Label>Your Partner's Name</Label>
              <Input
                placeholder="Enter your partner's name"
                value={partnerName}
                onChangeText={setPartnerName}
              />
            </View>
        </View>

        <View style={{ padding: 20 }}>
            <Button 
                onPress={handleSubmit} 
                style={{ width: '100%' }}
                disabled={!userName || !partnerName}
            >
              <Text>Begin Our Adventure</Text>
            </Button>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginTop: 16,
    fontSize: 28,
    fontFamily: 'Playfair-Display',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'PT-Sans',
  },
  space: {
    marginBottom: 20,
  }
});
