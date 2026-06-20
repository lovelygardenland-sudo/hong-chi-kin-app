import type { PackageId } from './shop';

export interface RestNotice {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  message: string;
  active: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  originalPrice?: number;
  promoPrice?: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  imageUrl?: string;
}

export interface Transaction {
  id: string;
  date: string;
  treatmentName: string;
  amount: number;
  balanceAfter: number;
  consent?: DeductionConsent;
}

export interface DeductionConsent {
  agreedAt: string;
  signerName: string;
  amount: number;
  treatmentName: string;
  signatureData: string;
  balanceBefore: number;
  balanceAfter: number;
}

export interface MemberProfile {
  id: string;
  phone: string;
  name: string;
  packageId: PackageId | null;
  balance: number;
  packageValue: number;
  purchasedAt: string | null;
  expiresAt: string | null;
  lastTreatmentId: string | null;
  skinConcern: string | null;
  transactions: Transaction[];
}

export interface Booking {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  treatmentId: string;
  treatmentName: string;
  price: number;
  durationMinutes: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
  deductionConsent?: DeductionConsent;
}

export const DEFAULT_REST_NOTICES: RestNotice[] = [
  {
    id: 'rest-2026-07',
    startDate: '2026-07-01',
    endDate: '2026-07-06',
    title: '店主旅行休息通知',
    message: '7月1日（二）至 7月6日（日）暫停營業，7月7日（一）起恢復正常。如有查詢請 WhatsApp：9770 9300',
    active: true,
  },
];

export const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: '新客首次體驗',
    description: '淨化平衡抗菌護理 原價 $380 → 體驗價 $298',
    originalPrice: 380,
    promoPrice: 298,
    validFrom: '2026-06-01',
    validUntil: '2026-06-30',
    active: true,
  },
  {
    id: 'promo-2',
    title: '皇牌四重奏 本月優惠',
    description: '皇牌四重奏 原價 $1,580 → 會員價 $1,380',
    originalPrice: 1580,
    promoPrice: 1380,
    validFrom: '2026-06-01',
    validUntil: '2026-06-30',
    active: true,
  },
  {
    id: 'promo-3',
    title: '套票 B 加送療程精華',
    description: '購買套票 B 即送 Bioskin 精華 3ml，並於療程中使用',
    validFrom: '2026-06-01',
    validUntil: '2026-06-30',
    active: true,
  },
];

export const DEMO_MEMBER: MemberProfile = {
  id: 'demo-member',
  phone: '91234567',
  name: '示範會員',
  packageId: 'pkg-a',
  balance: 2120,
  packageValue: 3500,
  purchasedAt: '2026-03-15',
  expiresAt: '2026-06-15',
  lastTreatmentId: 'signature-3',
  skinConcern: '抗老',
  transactions: [
    {
      id: 'tx-1',
      date: '2026-06-15',
      treatmentName: '3 way HIFU 提拉緊緻',
      amount: -1380,
      balanceAfter: 2120,
    },
    {
      id: 'tx-2',
      date: '2026-05-20',
      treatmentName: '激光嫩膚美白',
      amount: -680,
      balanceAfter: 3500,
    },
  ],
};

export const BOOKING_SLOTS = [
  '09:00',
  '10:30',
  '12:00',
  '14:00',
  '15:30',
  '17:00',
  '18:30',
  '20:00',
];
