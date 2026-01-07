import { View, Text, ViewStyle, TextStyle } from 'react-native';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[{ backgroundColor: 'white', borderRadius: 12, padding: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, marginVertical: 8 }, style]}>
      {children}
    </View>
  );
}

export function CardHeader({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ padding: 16, paddingBottom: 8 }, style]}>{children}</View>;
}

export function CardTitle({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' }, style]}>{children}</Text>;
}

export function CardContent({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ padding: 16, paddingTop: 8 }, style]}>{children}</View>;
}

export function CardFooter({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0', flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}
