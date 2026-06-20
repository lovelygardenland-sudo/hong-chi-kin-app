import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import type { RestNotice } from '../constants';

interface Props {
  notice: RestNotice;
}

export function RestNoticeBanner({ notice }: Props) {
  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.message}>{notice.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  message: {
    fontSize: theme.fontSize.sm,
    color: '#78350f',
    lineHeight: 20,
  },
});
