import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { theme } from '../constants/theme';
import type { Treatment } from '../constants';

interface Props {
  treatment: Treatment;
  onPress: () => void;
  compact?: boolean;
}

export function TreatmentCard({ treatment, onPress, compact }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compact]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <Text style={styles.category}>{treatment.categoryLabel}</Text>
        <Text style={styles.price}>${treatment.price}</Text>
      </View>
      <Text style={styles.name}>{treatment.name}</Text>
      {!compact && (
        <>
          <Text style={styles.meta}>{treatment.durationMinutes} 分鐘</Text>
          {treatment.description ? (
            <Text style={styles.desc} numberOfLines={2}>
              {treatment.description}
            </Text>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  compact: {
    width: 200,
    marginRight: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  category: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.pink,
    fontWeight: '600',
  },
  price: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.navy,
  },
  name: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.navy,
    marginBottom: 4,
  },
  meta: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginBottom: 4,
  },
  desc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    lineHeight: 18,
  },
});
