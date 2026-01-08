import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Button from '@/components/ui/button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BORDER_RADIUS } from '@/constants/theme';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  const cardBackgroundColor = useThemeColor({}, 'card');

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, { backgroundColor: cardBackgroundColor }]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export function AlertDialogContent({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}

export function AlertDialogHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  const textColor = useThemeColor({}, 'text');
  return <Text style={[styles.title, { color: textColor }]}>{children}</Text>;
}

export function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  const mutedForeground = useThemeColor({}, 'mutedForeground');
  return <Text style={[styles.description, { color: mutedForeground }]}>{children}</Text>;
}

export function AlertDialogFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function AlertDialogCancel({ onPress, children }: { onPress?: () => void, children: React.ReactNode }) {
  const textColor = useThemeColor({}, 'text');
  return (
    <Button variant="outline" onPress={onPress}>
      <Text style={{ color: textColor }}>{children}</Text>
    </Button>
  );
}

export function AlertDialogAction({ onPress, children }: { onPress?: () => void, children: React.ReactNode }) {
  const primaryForeground = useThemeColor({}, 'primaryForeground');
  return (
    <Button onPress={onPress}>
      <Text style={{ color: primaryForeground, fontWeight: 'bold' }}>{children}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    borderRadius: BORDER_RADIUS,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair-Display',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'PT-Sans',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 12,
  }
});
