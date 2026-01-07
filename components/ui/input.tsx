import { TextInput, TextInputProps, StyleSheet } from 'react-native';

export function Input({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#6b7280"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
});
