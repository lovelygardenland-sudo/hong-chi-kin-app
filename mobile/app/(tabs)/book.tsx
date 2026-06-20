import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  TREATMENTS,
  CATEGORY_LABELS,
  getTreatmentById,
  BOOKING_SLOTS,
  type TreatmentCategory,
} from '../../constants';
import { theme } from '../../constants/theme';
import { TreatmentCard } from '../../components/TreatmentCard';
import { WhatsAppQueryButton } from '../../components/WhatsAppQueryButton';
import {
  getUpcomingDates,
  getDayLabel,
  isRestDay,
  formatDisplayDate,
} from '../../services/storage';

const CATEGORIES: TreatmentCategory[] = [
  'tegoder',
  'laser',
  'plasma',
  'signature',
  'addon',
];

export default function BookScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<TreatmentCategory>('tegoder');
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());

  const dates = useMemo(() => getUpcomingDates(21), []);

  React.useEffect(() => {
    (async () => {
      const blocked = new Set<string>();
      for (const d of dates) {
        if (await isRestDay(d)) blocked.add(d);
      }
      setBlockedDates(blocked);
    })();
  }, [dates]);

  const filtered = TREATMENTS.filter((t) => t.category === category);
  const selectedTreatment = selectedTreatmentId
    ? getTreatmentById(selectedTreatmentId)
    : null;

  const canProceed =
    selectedTreatment && selectedDate && selectedTime && !blockedDates.has(selectedDate);

  const handleConfirm = () => {
    if (!canProceed) return;
    router.push({
      pathname: '/booking/confirm',
      params: {
        treatmentId: selectedTreatment!.id,
        date: selectedDate!,
        time: selectedTime!,
      },
    });
  };

  const selectDate = (d: string) => {
    if (blockedDates.has(d)) {
      Alert.alert('休息中', '店主休息，此日期暫不接受預約');
      return;
    }
    setSelectedDate(d);
    setSelectedTime(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.step}>① 選擇類別</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, category === cat && styles.catChipActive]}
            onPress={() => {
              setCategory(cat);
              setSelectedTreatmentId(null);
            }}
          >
            <Text
              style={[
                styles.catChipText,
                category === cat && styles.catChipTextActive,
              ]}
            >
              {CATEGORY_LABELS[cat]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.step}>② 選擇療程</Text>
      {filtered.map((t) => (
        <TouchableOpacity
          key={t.id}
          onPress={() => setSelectedTreatmentId(t.id)}
        >
          <View
            style={[
              styles.selectWrap,
              selectedTreatmentId === t.id && styles.selected,
            ]}
          >
            <TreatmentCard
              treatment={t}
              onPress={() => setSelectedTreatmentId(t.id)}
            />
          </View>
        </TouchableOpacity>
      ))}

      {selectedTreatment && (
        <>
          <Text style={styles.step}>③ 選擇日期</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((d) => {
              const isBlocked = blockedDates.has(d);
              const isSelected = selectedDate === d;
              return (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.dateChip,
                    isSelected && styles.dateChipActive,
                    isBlocked && styles.dateChipBlocked,
                  ]}
                  onPress={() => selectDate(d)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      isSelected && styles.dateTextActive,
                      isBlocked && styles.dateTextBlocked,
                    ]}
                  >
                    {getDayLabel(d)}
                  </Text>
                  <Text
                    style={[
                      styles.dateNum,
                      isSelected && styles.dateTextActive,
                      isBlocked && styles.dateTextBlocked,
                    ]}
                  >
                    {d.slice(8)}
                  </Text>
                  {isBlocked && <Text style={styles.restLabel}>休息</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedDate && !blockedDates.has(selectedDate) && (
            <>
              <Text style={styles.step}>④ 選擇時段</Text>
              <View style={styles.timeGrid}>
                {BOOKING_SLOTS.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.timeChip,
                        isSelected && styles.timeChipActive,
                      ]}
                      onPress={() => setSelectedTime(slot)}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          isSelected && styles.timeTextActive,
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </>
      )}

      {canProceed && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>預約摘要</Text>
          <Text style={styles.summaryLine}>{selectedTreatment!.name}</Text>
          <Text style={styles.summaryLine}>
            {formatDisplayDate(selectedDate!)} {selectedTime} · $
            {selectedTreatment!.price}
          </Text>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>確認預約 →</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.whatsappHelp}>
        <Text style={styles.whatsappHelpText}>
          不確定適合哪個療程？可以先 WhatsApp 查詢。
        </Text>
        <WhatsAppQueryButton message="你好，我想查詢我適合做哪個康姿健療程" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: theme.spacing.md, paddingBottom: 40 },
  step: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  catScroll: { marginBottom: theme.spacing.sm },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  catChipActive: {
    backgroundColor: theme.colors.navy,
    borderColor: theme.colors.navy,
  },
  catChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
  },
  catChipTextActive: { color: theme.colors.white },
  selectWrap: { borderRadius: theme.radius.lg },
  selected: {
    borderWidth: 2,
    borderColor: theme.colors.pink,
    borderRadius: theme.radius.lg,
  },
  dateChip: {
    width: 56,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateChipActive: {
    backgroundColor: theme.colors.pink,
    borderColor: theme.colors.pink,
  },
  dateChipBlocked: {
    backgroundColor: '#f3f4f6',
    opacity: 0.7,
  },
  dateDay: { fontSize: 11, color: theme.colors.gray },
  dateNum: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.navy,
  },
  dateTextActive: { color: theme.colors.white },
  dateTextBlocked: { color: '#9ca3af' },
  restLabel: { fontSize: 9, color: theme.colors.warning, marginTop: 2 },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: '22%',
    alignItems: 'center',
  },
  timeChipActive: {
    backgroundColor: theme.colors.navy,
    borderColor: theme.colors.navy,
  },
  timeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
    fontWeight: '600',
  },
  timeTextActive: { color: theme.colors.white },
  summary: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  summaryTitle: {
    color: theme.colors.pink,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryLine: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    marginBottom: 4,
  },
  confirmBtn: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.pink,
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: 'center',
  },
  confirmText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: theme.fontSize.md,
  },
  whatsappHelp: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: 10,
  },
  whatsappHelpText: {
    color: theme.colors.gray,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
  },
});
