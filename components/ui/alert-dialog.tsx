import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Button } from '@/components/ui/button';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
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
            <View style={styles.content}>
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
  return <Text style={styles.title}>{children}</Text>;
}

export function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

export function AlertDialogFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function AlertDialogCancel({ onPress, children }: { onPress?: () => void, children: React.ReactNode }) {
  return (
    <Button variant="outline" onPress={onPress} style={{ flex: 1, marginRight: 8 }}>
      <Text style={{ color: '#000' }}>{children}</Text>
    </Button>
  );
}

export function AlertDialogAction({ onPress, children }: { onPress?: () => void, children: React.ReactNode }) {
  return (
    <Button onPress={onPress} style={{ flex: 1, marginLeft: 8 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{children}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
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
    color: '#1a1a1a',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  }
});
