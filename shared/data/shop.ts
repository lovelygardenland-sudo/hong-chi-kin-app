export const SHOP = {
  name: '康姿健',
  nameEn: 'HONG CHI KIN',
  tagline: '美容唔應該有壓力，只需要有實效。',
  services: ['手法美容', '皮膚管理', '痛症理療'],
  address: '屯門紅橋菁菱徑9號華利大廈地下12號地舖',
  phone: '97709300',
  phoneDisplay: '9770 9300',
  whatsapp: '85297709300',
  instagram: 'https://www.instagram.com/hong_chi_kin/',
  xiaohongshu:
    'https://www.xiaohongshu.com/user/profile/67d2d82b000000000d009a62',
  googleMaps:
    'https://www.google.com/maps/place/%E5%BA%B7%E5%A7%BF%E5%81%A5+%E5%B1%AF%E9%96%80%E7%BE%8E%E5%AE%B9/@22.4017239,113.9756751,17z/data=!4m15!1m8!3m7!1s0x3403fbc04f7f4291:0x6be10d9ecde35300!2z5bq35ae_5YGlIOWxr-mWgOe-juWuuQ!8m2!3d22.401719!4d113.97825!10e1!16s%2Fg%2F11wxv51k30!3m5!1s0x3403fbc04f7f4291:0x6be10d9ecde35300!8m2!3d22.401719!4d113.97825!16s%2Fg%2F11wxv51k30',
  googleReview:
    'https://www.google.com/search?q=%E5%BA%B7%E5%A7%BF%E5%81%A5+%E5%B1%AF%E9%96%80%E7%BE%8E%E5%AE%B9&ludocid=7773509407528407808#lrd=0x3403fbc04f7f4291:0x6be10d9ecde35300,3,,,,',
  hours: { open: '09:00', close: '21:00', days: '週一至週日' },
  paymentMethods: ['現金', 'PayMe', '轉數快'],
  colors: {
    navy: '#C96B73',
    pink: '#F4A3A5',
    pinkDeep: '#D96F78',
    lightPink: '#FFF4F2',
    lavender: '#FCE7E5',
    white: '#ffffff',
    gray: '#8F7D7D',
    lightGray: '#FFF8F6',
    warning: '#D99A4E',
  },
} as const;

export const PACKAGES = [
  {
    id: 'pkg-a',
    name: '套票 A',
    value: 3500,
    payAmount: 3000,
    discount: 500,
    validityMonths: 3,
    description: '儲值 $3,500，實付 $3,000（慳 $500），有效期 3 個月',
  },
  {
    id: 'pkg-b',
    name: '套票 B',
    value: 6500,
    payAmount: 5000,
    discount: 1500,
    validityMonths: 6,
    description: '儲值 $6,500，實付 $5,000（慳 $1,500），有效期 6 個月',
  },
] as const;

export type PackageId = (typeof PACKAGES)[number]['id'];
