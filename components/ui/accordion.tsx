
import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

const AccordionContext = React.createContext<{
  value: string | null;
  onValueChange: (value: string | null) => void;
}>({
  value: null,
  onValueChange: () => {},
});

const useAccordion = () => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion');
  }
  return context;
};

const Accordion = ({ value, onValueChange, children, ...props }: { value: string | null, onValueChange: (value: string | null) => void, children: React.ReactNode, style?: any, type?: 'single' | 'multiple' }) => {
  return (
    <AccordionContext.Provider value={{ value, onValueChange }}>
      <View style={[styles.accordion, props.style]} {...props}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
};

const AccordionItemContext = React.createContext<{ value: string | null }>({ value: null });

const useAccordionItem = () => {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error('useAccordionItem must be used within an AccordionItem');
  }
  return context;
}

const AccordionItem = ({ value, children, ...props }: { value: string, children: React.ReactNode, style?: any }) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <View style={[styles.item, props.style]} {...props}>
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
};

const AccordionTrigger = ({ children, ...props }: { children: React.ReactNode, style?: any }) => {
  const { value, onValueChange } = useAccordion();
  const { value: itemValue } = useAccordionItem();
  const isOpen = value === itemValue;

  return (
    <TouchableOpacity
      onPress={() => onValueChange(isOpen ? null : itemValue)}
      style={[styles.trigger, props.style]}
      {...props}
    >
      {children}
      <ChevronDown
        size={20}
        color="#999"
        style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
      />
    </TouchableOpacity>
  );
};

const AccordionContent = ({ children, ...props }: { children: React.ReactNode, style?: any }) => {
  const { value } = useAccordion();
  const { value: itemValue } = useAccordionItem();
  const isOpen = value === itemValue;

  if (!isOpen) {
    return null;
  }

  return (
    <View style={[styles.content, props.style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  accordion: {
    width: '100%',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  content: {
    paddingBottom: 16,
  },
});

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
