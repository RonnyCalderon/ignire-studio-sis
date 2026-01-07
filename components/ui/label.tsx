import { Text, TextProps, StyleSheet } from 'react-native';

export function Label({ style, children, ...props }: TextProps) {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
});
