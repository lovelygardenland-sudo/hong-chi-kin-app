import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SHOP, getRecommendations, getTreatmentById } from '../../constants';
import { theme } from '../../constants/theme';
import { RestNoticeBanner } from '../../components/RestNoticeBanner';
import { TreatmentCard } from '../../components/TreatmentCard';
import { Card } from '../../components/Card';
import { WhatsAppQueryButton } from '../../components/WhatsAppQueryButton';
import { BrandLogo } from '../../components/BrandLogo';
import {
  getMember,
  getActiveRestNotice,
  getRestNotices,
  getPromotions,
} from '../../services/storage';
import type { MemberProfile, Promotion, RestNotice } from '../../constants';

export default function HomeScreen() {
  const router = useRouter();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [activeRest, setActiveRest] = useState<RestNotice | null>(null);
  const [upcomingRest, setUpcomingRest] = useState<RestNotice | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [m, active, notices, promos] = await Promise.all([
      getMember(),
      getActiveRestNotice(),
      getRestNotices(),
      getPromotions(),
    ]);
    setMember(m);
    setActiveRest(active);
    setPromotions(promos.filter((p) => p.active).slice(0, 2));

    const today = new Date().toISOString().slice(0, 10);
    const upcoming = notices.find(
      (n) => n.active && !active && n.startDate > today
    );
    setUpcomingRest(upcoming ?? null);
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

  const recommendations = getRecommendations(
    member?.skinConcern ?? undefined,
    member?.lastTreatmentId ?? undefined
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.hero}>
        <BrandLogo />
        <Text style={styles.tagline}>{SHOP.tagline}</Text>
      </View>

      {activeRest && <RestNoticeBanner notice={activeRest} />}
      {!activeRest && upcomingRest && (
        <RestNoticeBanner notice={upcomingRest} />
      )}

      {member && (
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>可用餘額</Text>
          <Text style={styles.balanceAmount}>${member.balance.toLocaleString()}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/balance')}>
            <Text style={styles.link}>查看詳情 →</Text>
          </TouchableOpacity>
        </Card>
      )}

      <TouchableOpacity
        style={styles.quickBook}
        onPress={() => router.push('/(tabs)/book')}
        activeOpacity={0.9}
      >
        <Text style={styles.quickBookText}>📅 立即預約</Text>
      </TouchableOpacity>

      <WhatsAppQueryButton style={styles.whatsappButton} />

      {promotions.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>本月優惠</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/offers')}>
              <Text style={styles.link}>全部 →</Text>
            </TouchableOpacity>
          </View>
          {promotions.map((p) => (
            <View key={p.id} style={styles.promoBanner}>
              <Text style={styles.promoTitle}>{p.title}</Text>
              <Text style={styles.promoDesc}>{p.description}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>為你推介</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendations.map((t) => (
            <TreatmentCard
              key={t.id}
              treatment={t}
              compact
              onPress={() => router.push(`/treatment/${t.id}`)}
            />
          ))}
        </ScrollView>
      </View>

      {member?.lastTreatmentId && (
        <Card title="上次療程">
          <Text style={styles.lastTreatment}>
            {getTreatmentById(member.lastTreatmentId)?.name ?? '—'}
          </Text>
          <Text style={styles.lastHint}>根據上次療程為你推介以上項目</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: theme.spacing.md, paddingBottom: 40 },
  hero: {
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  heroEn: {
    color: theme.colors.pink,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    letterSpacing: 2,
  },
  heroZh: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    marginTop: 4,
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: theme.fontSize.sm,
    marginTop: 8,
  },
  balanceCard: {
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.pink,
    marginVertical: 4,
  },
  link: {
    color: theme.colors.pink,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  quickBook: {
    backgroundColor: theme.colors.pink,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  whatsappButton: { marginBottom: theme.spacing.lg },
  quickBookText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  section: { marginBottom: theme.spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: theme.spacing.sm,
  },
  promoBanner: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.pink,
  },
  promoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.navy,
  },
  promoDesc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginTop: 4,
  },
  lastTreatment: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.navy,
  },
  lastHint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    marginTop: 4,
  },
});
