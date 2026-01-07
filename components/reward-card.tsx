import { View, Text } from 'react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react-native';

export function RewardCard({ expiry, onRewardEnd, onNewChallengeClick }: any) {
    const randomReward = "A 20-minute full body massage.";

    return (
        <Card style={{ borderColor: '#FFD700', borderWidth: 1 }}>
            <CardHeader style={{ alignItems: 'center' }}>
                <Gift size={48} color="#FFD700" />
                <CardTitle style={{ marginTop: 16, color: '#b45309' }}>Reward Unlocked!</CardTitle>
            </CardHeader>
            <CardContent style={{ alignItems: 'center', paddingVertical: 24 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
                   "{randomReward}"
                </Text>
                <Text style={{ color: '#666', textAlign: 'center' }}>
                    Enjoy your reward! You can start a new challenge when the timer expires.
                </Text>
            </CardContent>
            <CardFooter style={{ justifyContent: 'center' }}>
                <Button onPress={onNewChallengeClick} variant="outline">
                    <Text style={{ color: '#000' }}>Start Fresh</Text>
                </Button>
            </CardFooter>
        </Card>
    );
}
