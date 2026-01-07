import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '@/context/user-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Flame } from 'lucide-react-native';

export function UserOnboarding() {
  const { saveUser } = useUser();
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  const handleSubmit = () => {
    if (userName.trim() && partnerName.trim()) {
      saveUser(userName.trim(), partnerName.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <CardHeader style={{ alignItems: 'center' }}>
            <Flame size={48} color="#FF5A5F" fill="#FF5A5F" />
            <CardTitle style={{ marginTop: 16, fontSize: 28, color: '#FF5A5F' }}>Welcome to Ignite</CardTitle>
            <Text style={styles.description}>
                Let's personalize your journey. Tell us who you are so we can tailor this experience for you.
            </Text>
        </CardHeader>
        
        <CardContent>
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
        </CardContent>

        <CardFooter>
            <Button 
                onPress={handleSubmit} 
                style={{ width: '100%' }}
                disabled={!userName || !partnerName}
                size="lg"
            >
              Begin Our Adventure
            </Button>
        </CardFooter>
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
    backgroundColor: '#fff',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
  },
  space: {
    marginBottom: 20,
  }
});
