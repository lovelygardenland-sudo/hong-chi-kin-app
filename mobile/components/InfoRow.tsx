import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  label: string;
  value: string | number;
  highlight?: boolean;
  warning?: boolean;
}

export function InfoRow({ label, value, highlight, warning }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.value,
          highlight && styles.highlight,
          warning && styles.warning,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
  },
  value: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.navy,
  },
  highlight: {
    color: theme.colors.pink,
    fontSize: theme.fontSize.lg,
  },
  warning: {
    color: theme.colors.warning,
  },
});
