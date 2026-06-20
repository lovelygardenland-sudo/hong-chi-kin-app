import type {
  Booking,
  DeductionConsent,
  MemberProfile,
  Promotion,
  RestNotice,
} from '@shared/data/seed';
import {
  DEMO_MEMBER,
  DEFAULT_PROMOTIONS,
  DEFAULT_REST_NOTICES,
} from '@shared/data/seed';

const KEYS = {
  member: 'hck_admin_member',
  members: 'hck_admin_members',
  bookings: 'hck_admin_bookings',
  promotions: 'hck_admin_promotions',
  restNotices: 'hck_admin_restNotices',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getMember(): MemberProfile {
  return read(KEYS.member, DEMO_MEMBER);
}

export function saveMember(member: MemberProfile): void {
  write(KEYS.member, member);
}

export function getMembers(): MemberProfile[] {
  const fallbackMember = getMember();
  const members = read<MemberProfile[]>(KEYS.members, [fallbackMember]);
  return members.length > 0 ? members : [fallbackMember];
}

export function saveMembers(members: MemberProfile[]): void {
  write(KEYS.members, members);
  if (members[0]) saveMember(members[0]);
}

export function addMember(member: MemberProfile): MemberProfile[] {
  const members = [member, ...getMembers()];
  saveMembers(members);
  return members;
}

export function updateMember(memberId: string, patch: Partial<MemberProfile>): MemberProfile[] {
  const members = getMembers().map((member) =>
    member.id === memberId ? { ...member, ...patch } : member
  );
  saveMembers(members);
  return members;
}

export function getBookings(): Booking[] {
  return read(KEYS.bookings, []);
}

export function saveBookings(bookings: Booking[]): void {
  write(KEYS.bookings, bookings);
}

export function addBooking(booking: Booking): Booking[] {
  const bookings = [booking, ...getBookings()];
  saveBookings(bookings);
  return bookings;
}

export function updateBookingStatus(
  id: string,
  status: Booking['status']
): Booking[] {
  const bookings = getBookings().map((b) =>
    b.id === id ? { ...b, status } : b
  );
  saveBookings(bookings);
  return bookings;
}

export function getPromotions(): Promotion[] {
  const promotions = read(KEYS.promotions, DEFAULT_PROMOTIONS);
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
    savePromotions(migrated);
  }
  return migrated;
}

export function savePromotions(promotions: Promotion[]): void {
  write(KEYS.promotions, promotions);
}

export function getRestNotices(): RestNotice[] {
  return read(KEYS.restNotices, DEFAULT_REST_NOTICES);
}

export function saveRestNotices(notices: RestNotice[]): void {
  write(KEYS.restNotices, notices);
}

export function addRestNotice(notice: RestNotice): RestNotice[] {
  const notices = [...getRestNotices(), notice];
  saveRestNotices(notices);
  return notices;
}

export function toggleRestNotice(id: string): RestNotice[] {
  const notices = getRestNotices().map((n) =>
    n.id === id ? { ...n, active: !n.active } : n
  );
  saveRestNotices(notices);
  return notices;
}

export function deleteRestNotice(id: string): RestNotice[] {
  const notices = getRestNotices().filter((n) => n.id !== id);
  saveRestNotices(notices);
  return notices;
}

export function addPromotion(promo: Promotion): Promotion[] {
  const promos = [...getPromotions(), promo];
  savePromotions(promos);
  return promos;
}

export function togglePromotion(id: string): Promotion[] {
  const promos = getPromotions().map((p) =>
    p.id === id ? { ...p, active: !p.active } : p
  );
  savePromotions(promos);
  return promos;
}

export function updateMemberBalance(memberId: string, balance: number): MemberProfile[] {
  return updateMember(memberId, { balance });
}

export function addTransaction(
  memberId: string,
  amount: number,
  treatmentName: string,
  consent?: DeductionConsent
): MemberProfile[] {
  const member = getMembers().find((item) => item.id === memberId);
  if (!member) return getMembers();

  const newBalance = Math.max(0, member.balance + amount);
  const tx = {
    id: `tx-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    treatmentName,
    amount,
    balanceAfter: newBalance,
    consent,
  };
  const updated = {
    ...member,
    balance: newBalance,
    transactions: [tx, ...member.transactions],
  };
  return updateMember(memberId, updated);
}

export function resetDemoData(): void {
  localStorage.removeItem(KEYS.member);
  localStorage.removeItem(KEYS.members);
  localStorage.removeItem(KEYS.bookings);
  localStorage.removeItem(KEYS.promotions);
  localStorage.removeItem(KEYS.restNotices);
}
