import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTreatmentById } from '../../constants';
import { theme } from '../../constants/theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export default function TreatmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const treatment = getTreatmentById(id ?? '');

  if (!treatment) {
    return (
      <View style={styles.center}>
        <Text>找不到此療程</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.priceTag}>
        <Text style={styles.category}>{treatment.categoryLabel}</Text>
        <Text style={styles.price}>${treatment.price}</Text>
      </View>

      <Text style={styles.name}>{treatment.name}</Text>
      <Text style={styles.meta}>{treatment.durationMinutes} 分鐘</Text>

      {treatment.description && (
        <Card style={styles.mt}>
          <Text style={styles.sectionTitle}>療程簡介</Text>
          <Text style={styles.desc}>{treatment.description}</Text>
        </Card>
      )}

      <Card style={styles.mt}>
        <Text style={styles.sectionTitle}>療程流程</Text>
        <Text style={styles.desc}>{treatment.process}</Text>
      </Card>

      {treatment.recommendFor && treatment.recommendFor.length > 0 && (
        <Card style={styles.mt}>
          <Text style={styles.sectionTitle}>適合</Text>
          <View style={styles.tags}>
            {treatment.recommendFor.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      <Button
        title="立即預約此療程"
        onPress={() => router.push('/(tabs)/book')}
        variant="pink"
        style={styles.btn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: theme.spacing.md, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  priceTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.pink,
    fontWeight: '600',
  },
  price: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.navy,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 4,
  },
  meta: { fontSize: theme.fontSize.sm, color: theme.colors.gray },
  mt: { marginTop: theme.spacing.md },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 8,
  },
  desc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    lineHeight: 22,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: theme.colors.lightPink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  tagText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.pink,
    fontWeight: '600',
  },
  btn: { marginTop: theme.spacing.lg },
});
