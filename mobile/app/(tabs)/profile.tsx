import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SHOP } from '../../constants';
import { theme } from '../../constants/theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  getMember,
  getBookings,
  isLoggedIn,
  logout,
  formatDisplayDate,
} from '../../services/storage';
import type { Booking, MemberProfile } from '../../constants';

export default function ProfileScreen() {
  const router = useRouter();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [li, m, b] = await Promise.all([
      isLoggedIn(),
      getMember(),
      getBookings(),
    ]);
    setLoggedIn(li);
    setMember(m);
    setBookings(b.filter((bk) => bk.status !== 'cancelled').slice(0, 5));
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

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    router.push('/login');
  };

  const openLink = (url: string) => Linking.openURL(url);

  const statusLabel: Record<Booking['status'], string> = {
    pending: '待確認',
    confirmed: '已確認',
    completed: '已完成',
    cancelled: '已取消',
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(member?.name ?? '客')[0]}
          </Text>
        </View>
        <Text style={styles.name}>{member?.name ?? '訪客'}</Text>
        <Text style={styles.phone}>{member?.phone ?? '未登入'}</Text>
        {!loggedIn && (
          <Button
            title="登入 / 註冊"
            onPress={() => router.push('/login')}
            variant="pink"
            style={styles.loginBtn}
          />
        )}
      </View>

      <Card title="我的預約">
        {bookings.length === 0 ? (
          <Text style={styles.empty}>暫無預約紀錄</Text>
        ) : (
          bookings.map((bk) => (
            <View key={bk.id} style={styles.bookingRow}>
              <View style={styles.bookingLeft}>
                <Text style={styles.bookingName}>{bk.treatmentName}</Text>
                <Text style={styles.bookingDate}>
                  {formatDisplayDate(bk.date)} {bk.time}
                </Text>
                {bk.deductionConsent && (
                  <Text style={styles.signedBadge}>✓ 已簽署扣款確認</Text>
                )}
              </View>
              <View
                style={[
                  styles.statusBadge,
                  bk.status === 'confirmed' && styles.statusConfirmed,
                ]}
              >
                <Text style={styles.statusText}>{statusLabel[bk.status]}</Text>
              </View>
            </View>
          ))
        )}
      </Card>

      <Card title="店鋪資訊" style={styles.mt}>
        <InfoItem icon="location" text={SHOP.address} />
        <InfoItem icon="time" text={`${SHOP.hours.days} ${SHOP.hours.open}–${SHOP.hours.close}`} />
        <InfoItem icon="call" text={SHOP.phoneDisplay} />
        <InfoItem icon="card" text={SHOP.paymentMethods.join(' · ')} />
      </Card>

      <Card title="關注我們" style={styles.mt}>
        <LinkRow
          icon="logo-instagram"
          label="Instagram @hong_chi_kin"
          onPress={() => openLink(SHOP.instagram)}
        />
        <LinkRow
          icon="book"
          label="小紅書"
          onPress={() => openLink(SHOP.xiaohongshu)}
        />
        <LinkRow
          icon="logo-whatsapp"
          label="WhatsApp 9770 9300"
          onPress={() =>
            openLink(`https://wa.me/${SHOP.whatsapp}`)
          }
        />
      </Card>

      {loggedIn && (
        <Button
          title="登出"
          onPress={handleLogout}
          variant="outline"
          style={styles.mt}
        />
      )}
    </ScrollView>
  );
}

function InfoItem({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={theme.colors.pink} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function LinkRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.linkRow} onPress={onPress}>
      <Ionicons name={icon} size={22} color={theme.colors.navy} />
      <Text style={styles.linkLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.gray} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: theme.spacing.md, paddingBottom: 40 },
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.navy,
  },
  phone: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginTop: 4,
  },
  loginBtn: { marginTop: theme.spacing.md, minWidth: 160 },
  mt: { marginTop: theme.spacing.md },
  empty: { textAlign: 'center', color: theme.colors.gray, padding: 16 },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  bookingLeft: { flex: 1 },
  bookingName: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.navy,
  },
  bookingDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    marginTop: 2,
  },
  signedBadge: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.pinkDeep,
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.lightGray,
  },
  statusConfirmed: { backgroundColor: '#dcfce7' },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.navy,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
    lineHeight: 20,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  linkLabel: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
  },
});
