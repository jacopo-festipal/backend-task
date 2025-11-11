import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface PickerItem {
  code: string;
  name: string;
}

interface SelectPickerProps {
  label: string;
  selectedValue: string;
  items: PickerItem[];
  onValueChange: (value: string) => void;
}

export const SelectPicker: React.FC<SelectPickerProps> = ({
  label,
  selectedValue,
  items,
  onValueChange,
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}:</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#333"
      >
        {items.map((item) => (
          <Picker.Item key={item.code} label={item.name} value={item.code} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    marginBottom: 4,
    color: '#666',
  },
  picker: {
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
