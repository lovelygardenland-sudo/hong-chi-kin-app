import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Booking, MemberProfile, Promotion, RestNotice, DeductionConsent } from '../constants';
import {
  DEMO_MEMBER,
  DEFAULT_PROMOTIONS,
  DEFAULT_REST_NOTICES,
} from '../constants';

const KEYS = {
  member: '@hck/member',
  bookings: '@hck/bookings',
  promotions: '@hck/promotions',
  restNotices: '@hck/restNotices',
  loggedIn: '@hck/loggedIn',
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function isLoggedIn(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.loggedIn);
  return val === 'true';
}

export async function login(phone: string, name: string): Promise<MemberProfile> {
  const member = { ...DEMO_MEMBER, phone, name: name || '會員' };
  await writeJson(KEYS.member, member);
  await AsyncStorage.setItem(KEYS.loggedIn, 'true');
  return member;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.loggedIn);
}

export async function getMember(): Promise<MemberProfile> {
  return readJson(KEYS.member, DEMO_MEMBER);
}

export async function getBookings(): Promise<Booking[]> {
  return readJson(KEYS.bookings, []);
}

export async function addBooking(booking: Booking): Promise<void> {
  const bookings = await getBookings();
  bookings.unshift(booking);
  await writeJson(KEYS.bookings, bookings);
}

export async function getPromotions(): Promise<Promotion[]> {
  const promotions = await readJson(KEYS.promotions, DEFAULT_PROMOTIONS);
  const migrated = promotions.map((promo) =>
    promo.id === 'promo-3' ||
    promo.description.includes('Bioskin 精華 1 支') ||
    promo.description.includes('Bioskin 精華 1支')
      ? {
          ...promo,
          title: '套票 B 加送療程精華',
          description: '購買套票 B 即送 Bioskin 精華 3ml，並於療程中使用',
        }
      : promo
  );
  if (JSON.stringify(migrated) !== JSON.stringify(promotions)) {
    await writeJson(KEYS.promotions, migrated);
  }
  return migrated;
}

export async function getRestNotices(): Promise<RestNotice[]> {
  return readJson(KEYS.restNotices, DEFAULT_REST_NOTICES);
}

export async function getActiveRestNotice(
  date = new Date()
): Promise<RestNotice | null> {
  const notices = await getRestNotices();
  const today = formatDate(date);
  return (
    notices.find(
      (n) => n.active && today >= n.startDate && today <= n.endDate
    ) ?? null
  );
}

export async function isRestDay(dateStr: string): Promise<boolean> {
  const notices = await getRestNotices();
  return notices.some(
    (n) => n.active && dateStr >= n.startDate && dateStr <= n.endDate
  );
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T23:59:59');
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getExpiryProgress(
  purchasedAt: string | null,
  expiresAt: string | null,
  packageValue: number,
  balance: number
): number {
  if (!purchasedAt || !expiresAt || packageValue === 0) return 0;
  const used = packageValue - balance;
  return Math.min(100, Math.round((used / packageValue) * 100));
}

export async function deductBalance(
  amount: number,
  treatmentName: string,
  consent?: DeductionConsent
): Promise<MemberProfile> {
  const member = await getMember();
  const newBalance = Math.max(0, member.balance - amount);
  const tx = {
    id: `tx-${Date.now()}`,
    date: formatDate(new Date()),
    treatmentName,
    amount: -amount,
    balanceAfter: newBalance,
    consent,
  };
  const updated: MemberProfile = {
    ...member,
    balance: newBalance,
    transactions: [tx, ...member.transactions],
  };
  await writeJson(KEYS.member, updated);
  return updated;
}

export function generateBookingId(): string {
  return `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getUpcomingDates(count = 14): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(formatDate(d));
  }
  return dates;
}

export function getDayLabel(dateStr: string): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const d = new Date(dateStr + 'T12:00:00');
  return `週${days[d.getDay()]}`;
}
