import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { PACKAGES, SHOP } from '../../constants';
import { theme } from '../../constants/theme';
import { Card } from '../../components/Card';
import { InfoRow } from '../../components/InfoRow';
import { Button } from '../../components/Button';
import {
  getMember,
  daysUntil,
  getExpiryProgress,
  formatDisplayDate,
} from '../../services/storage';
import type { MemberProfile } from '../../constants';

export default function BalanceScreen() {
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setMember(await getMember());
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

  if (!member) return null;

  const pkg = PACKAGES.find((p) => p.id === member.packageId);
  const daysLeft = member.expiresAt ? daysUntil(member.expiresAt) : null;
  const usedPct = getExpiryProgress(
    member.purchasedAt,
    member.expiresAt,
    member.packageValue,
    member.balance
  );

  const contactWhatsApp = () => {
    Linking.openURL(
      `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent('你好，我想查詢套票充值事宜')}`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>💰 可用餘額</Text>
        <Text style={styles.heroAmount}>${member.balance.toLocaleString()}</Text>
        {pkg && (
          <Text style={styles.heroPkg}>
            {pkg.name} · 儲值 ${pkg.value.toLocaleString()}
          </Text>
        )}
      </View>

      {member.expiresAt && (
        <Card>
          <InfoRow
            label="有效期至"
            value={formatDisplayDate(member.expiresAt)}
            warning={daysLeft !== null && daysLeft <= 14}
          />
          {daysLeft !== null && (
            <InfoRow
              label="距離到期"
              value={daysLeft > 0 ? `還有 ${daysLeft} 天` : '已到期'}
              warning={daysLeft <= 14}
            />
          )}
          <View style={styles.progressWrap}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${usedPct}%` }]} />
            </View>
            <Text style={styles.progressText}>已使用 {usedPct}%</Text>
          </View>
        </Card>
      )}

      <Card title="套票方案" style={styles.mt}>
        {PACKAGES.map((p) => (
          <View key={p.id} style={styles.pkgRow}>
            <Text style={styles.pkgName}>{p.name}</Text>
            <Text style={styles.pkgDesc}>{p.description}</Text>
          </View>
        ))}
      </Card>

      <Card title="最近消費" style={styles.mt}>
        {member.transactions.length === 0 ? (
          <Text style={styles.empty}>暫無消費紀錄</Text>
        ) : (
          member.transactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View>
                <Text style={styles.txName}>{tx.treatmentName}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
                {tx.consent && (
                  <Text style={styles.txSigned}>✓ 已簽署 · {tx.consent.signerName}</Text>
                )}
              </View>
              <View style={styles.txRight}>
                <Text style={styles.txAmount}>
                  {tx.amount < 0 ? '' : '+'}${Math.abs(tx.amount)}
                </Text>
                <Text style={styles.txBalance}>餘額 ${tx.balanceAfter}</Text>
              </View>
            </View>
          ))
        )}
      </Card>

      <View style={styles.actions}>
        <Button title="WhatsApp 聯絡充值" onPress={contactWhatsApp} variant="pink" />
      </View>
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
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: theme.fontSize.sm },
  heroAmount: {
    color: theme.colors.pink,
    fontSize: 42,
    fontWeight: '700',
    marginVertical: 8,
  },
  heroPkg: { color: theme.colors.white, fontSize: theme.fontSize.sm },
  mt: { marginTop: theme.spacing.md },
  progressWrap: { marginTop: theme.spacing.sm },
  progressBg: {
    height: 8,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.pink,
    borderRadius: 4,
  },
  progressText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    marginTop: 4,
    textAlign: 'right',
  },
  pkgRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  pkgName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.navy,
  },
  pkgDesc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginTop: 2,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  txName: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.navy,
  },
  txDate: { fontSize: theme.fontSize.xs, color: theme.colors.gray, marginTop: 2 },
  txSigned: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.pinkDeep,
    marginTop: 2,
    fontWeight: '600',
  },
  txRight: { alignItems: 'flex-end' },
  txAmount: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.pink,
  },
  txBalance: { fontSize: theme.fontSize.xs, color: theme.colors.gray },
  empty: { color: theme.colors.gray, textAlign: 'center', padding: 20 },
  actions: { marginTop: theme.spacing.lg, gap: 12 },
});
