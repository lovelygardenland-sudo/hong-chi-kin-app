import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTreatmentById } from '../../constants';
import type { DeductionConsent } from '../../constants';
import { theme } from '../../constants/theme';
import { Card } from '../../components/Card';
import { InfoRow } from '../../components/InfoRow';
import { Button } from '../../components/Button';
import { SignaturePad } from '../../components/SignaturePad';
import {
  addBooking,
  deductBalance,
  formatDisplayDate,
  generateBookingId,
  getMember,
  isRestDay,
} from '../../services/storage';

export default function ConfirmBookingScreen() {
  const { treatmentId, date, time } = useLocalSearchParams<{
    treatmentId: string;
    date: string;
    time: string;
  }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<Awaited<ReturnType<typeof getMember>> | null>(
    null
  );
  const [agreed, setAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const [signatureEmpty, setSignatureEmpty] = useState(true);

  const treatment = getTreatmentById(treatmentId ?? '');

  useEffect(() => {
    getMember().then(setMember);
  }, []);

  if (!treatment || !date || !time) {
    return (
      <View style={styles.center}>
        <Text>預約資料不完整</Text>
      </View>
    );
  }

  const willDeduct =
    member !== null && member.balance >= treatment.price;
  const canConfirm =
    !willDeduct || (agreed && !signatureEmpty && !!member?.name);

  const handleConfirm = async () => {
    if (await isRestDay(date)) {
      Alert.alert('休息中', '此日期店主休息，請選擇其他日期');
      return;
    }

    if (willDeduct && (!agreed || signatureEmpty)) {
      Alert.alert('請完成簽署', '請勾選同意條款並簽名後才可確認扣款');
      return;
    }

    setLoading(true);
    try {
      const currentMember = await getMember();
      if (currentMember.balance < treatment.price) {
        Alert.alert(
          '餘額不足',
          `此療程需 $${treatment.price}，你的餘額為 $${currentMember.balance}。請聯絡店主充值或選擇現場付款。`,
          [
            { text: '返回', style: 'cancel' },
            { text: '仍要預約', onPress: () => submitBooking(currentMember, null) },
          ]
        );
        return;
      }
      const consent = buildConsent(currentMember);
      await submitBooking(currentMember, consent);
    } finally {
      setLoading(false);
    }
  };

  const buildConsent = (
    m: Awaited<ReturnType<typeof getMember>>
  ): DeductionConsent => ({
    agreedAt: new Date().toISOString(),
    signerName: m.name,
    amount: treatment.price,
    treatmentName: treatment.name,
    signatureData,
    balanceBefore: m.balance,
    balanceAfter: m.balance - treatment.price,
  });

  const submitBooking = async (
    m: Awaited<ReturnType<typeof getMember>>,
    consent: DeductionConsent | null
  ) => {
    const booking = {
      id: generateBookingId(),
      memberId: m.id,
      memberName: m.name,
      memberPhone: m.phone,
      treatmentId: treatment.id,
      treatmentName: treatment.name,
      price: treatment.price,
      durationMinutes: treatment.durationMinutes,
      date,
      time,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
      deductionConsent: consent ?? undefined,
    };

    if (consent && m.balance >= treatment.price) {
      await deductBalance(treatment.price, treatment.name, consent);
    }
    await addBooking(booking);

    Alert.alert(
      '預約成功 ✓',
      `${formatDisplayDate(date)} ${time}\n${treatment.name}${
        consent ? '\n\n已記錄你的扣款簽署確認。' : ''
      }`,
      [{ text: '好的', onPress: () => router.replace('/(tabs)/profile') }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="確認預約">
        <InfoRow label="療程" value={treatment.name} />
        <InfoRow label="類別" value={treatment.categoryLabel} />
        <InfoRow label="日期" value={formatDisplayDate(date)} />
        <InfoRow label="時間" value={time} />
        <InfoRow label="時長" value={`${treatment.durationMinutes} 分鐘`} />
        <InfoRow label="費用" value={`$${treatment.price}`} highlight />
        {member && (
          <InfoRow
            label="扣款後餘額"
            value={
              member.balance >= treatment.price
                ? `$${member.balance - treatment.price}`
                : '餘額不足（現場付款）'
            }
          />
        )}
      </Card>

      {willDeduct && member && (
        <Card title="扣款確認及簽署" style={styles.consentCard}>
          <View style={styles.stepsBox}>
            <Text style={styles.stepsTitle}>簽署步驟</Text>
            <Text style={styles.stepsText}>
              1. 閱讀扣款內容{'\n'}
              2. 勾選「我已閱讀並同意」{'\n'}
              3. 在簽名框內用手指簽名{'\n'}
              4. 按「簽署確認並預約」
            </Text>
          </View>

          <View style={styles.consentBox}>
            <Text style={styles.consentTitle}>套票扣款同意書</Text>
            <Text style={styles.consentText}>
              本人 {member.name} 確認同意從康姿健套票餘額扣除 ${treatment.price}{' '}
              作為「{treatment.name}」療程費用。{'\n\n'}
              扣款前餘額：${member.balance}{'\n'}
              扣款後餘額：${member.balance - treatment.price}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => setAgreed((v) => !v)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={agreed ? 'checkbox' : 'square-outline'}
              size={24}
              color={agreed ? theme.colors.pinkDeep : theme.colors.gray}
            />
            <Text style={styles.checkText}>
              我已閱讀並同意上述扣款條款，確認從套票餘額扣除 ${treatment.price}
            </Text>
          </TouchableOpacity>

          <SignaturePad
            onChange={(data: string, empty: boolean) => {
              setSignatureData(data);
              setSignatureEmpty(empty);
            }}
          />

          {!canConfirm && (
            <Text style={styles.hint}>請勾選同意並完成簽名後才可確認</Text>
          )}
        </Card>
      )}

      <Text style={styles.note}>
        · 如需改期，請提前 24 小時通知{'\n'}
        · 套票扣款需客人簽署確認{'\n'}
        · 如有疑問請 WhatsApp：9770 9300
      </Text>

      <Button
        title={willDeduct ? '簽署確認並預約' : '確認預約'}
        onPress={handleConfirm}
        loading={loading}
        variant="pink"
        disabled={willDeduct ? !canConfirm : false}
        style={styles.btn}
      />
      <Button
        title="返回修改"
        onPress={() => router.back()}
        variant="outline"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: theme.spacing.md, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  consentCard: { marginTop: theme.spacing.md },
  stepsBox: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.lavender,
  },
  stepsTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 6,
  },
  stepsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    lineHeight: 22,
  },
  consentBox: {
    backgroundColor: theme.colors.lavender,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  consentTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 8,
  },
  consentText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
    lineHeight: 22,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: theme.spacing.sm,
  },
  checkText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
    lineHeight: 20,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.pinkDeep,
    textAlign: 'center',
    marginTop: 4,
  },
  note: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    lineHeight: 22,
    marginVertical: theme.spacing.lg,
  },
  btn: { marginBottom: theme.spacing.sm },
});
