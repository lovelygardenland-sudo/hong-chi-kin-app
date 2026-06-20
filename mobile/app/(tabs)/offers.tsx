import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { theme } from '../../constants/theme';
import { Card } from '../../components/Card';
import { getPromotions } from '../../services/storage';
import type { Promotion } from '../../constants';

export default function OffersScreen() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const all = await getPromotions();
    setPromotions(all.filter((p) => p.active));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>🎁 本月優惠</Text>
      <Text style={styles.sub}>
        優惠內容由店主定期更新，預約時可向店員確認
      </Text>

      {promotions.length === 0 ? (
        <Card>
          <Text style={styles.empty}>暫無進行中的優惠</Text>
        </Card>
      ) : (
        promotions.map((p) => (
          <View key={p.id} style={styles.promoCard}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>優惠</Text>
            </View>
            <Text style={styles.promoTitle}>{p.title}</Text>
            <Text style={styles.promoDesc}>{p.description}</Text>
            {p.originalPrice && p.promoPrice && (
              <View style={styles.priceRow}>
                <Text style={styles.original}>${p.originalPrice}</Text>
                <Text style={styles.promoPrice}>${p.promoPrice}</Text>
              </View>
            )}
            <Text style={styles.valid}>
              有效期：{p.validFrom} 至 {p.validUntil}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: theme.spacing.md, paddingBottom: 40 },
  header: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 4,
  },
  sub: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginBottom: theme.spacing.lg,
  },
  promoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#fce7f3',
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.pink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    marginBottom: 8,
  },
  promoBadgeText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
  },
  promoTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 6,
  },
  promoDesc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  original: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    textDecorationLine: 'line-through',
  },
  promoPrice: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.pink,
  },
  valid: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    marginTop: 10,
  },
  empty: { textAlign: 'center', color: theme.colors.gray, padding: 20 },
});
