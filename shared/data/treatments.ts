export type TreatmentCategory =
  | 'tegoder'
  | 'laser'
  | 'plasma'
  | 'signature'
  | 'addon';

export interface Treatment {
  id: string;
  category: TreatmentCategory;
  categoryLabel: string;
  name: string;
  price: number;
  durationMinutes: number;
  process: string;
  description?: string;
  recommendFor?: string[];
  recommendAfter?: string[];
}

export const CATEGORY_LABELS: Record<TreatmentCategory, string> = {
  tegoder: 'TEGODER 人手護理',
  laser: '激光護理',
  plasma: '等離子護理',
  signature: '皇牌療程',
  addon: '加購項目',
};

export const TREATMENTS: Treatment[] = [
  {
    id: 'tegoder-1',
    category: 'tegoder',
    categoryLabel: 'TEGODER 人手護理',
    name: '淨化平衡抗菌護理',
    price: 380,
    durationMinutes: 60,
    process: '小氣泡清潔、面部按摩、泥膜',
    description: '清潔淨化肌膚，減少發炎',
    recommendFor: ['暗瘡', '油性皮膚', '新客'],
    recommendAfter: ['tegoder-2', 'plasma-1'],
  },
  {
    id: 'tegoder-2',
    category: 'tegoder',
    categoryLabel: 'TEGODER 人手護理',
    name: '深海膠原保濕護理',
    price: 420,
    durationMinutes: 60,
    process: '小氣泡清潔、面部按摩、撕拉式面膜',
    description: '提升肌膚彈性，恢復活力',
    recommendFor: ['保濕', '乾燥', '新客'],
  },
  {
    id: 'tegoder-3',
    category: 'tegoder',
    categoryLabel: 'TEGODER 人手護理',
    name: '抗衰老紅外線童顏機護理',
    price: 520,
    durationMinutes: 90,
    process: '小氣泡清潔、面部按摩、撕拉式面膜、童顏機',
    description: '促進細胞再生，延緩衰老',
    recommendFor: ['抗老'],
  },
  {
    id: 'tegoder-4',
    category: 'tegoder',
    categoryLabel: 'TEGODER 人手護理',
    name: '淨白抗齡果酸煥膚',
    price: 520,
    durationMinutes: 90,
    process: '小氣泡清潔、面部按摩、果酸、撕拉式面膜',
    description: '淨白、淡化疤痕、抑制黑色素',
    recommendFor: ['美白', '色斑'],
  },
  {
    id: 'tegoder-5',
    category: 'tegoder',
    categoryLabel: 'TEGODER 人手護理',
    name: '真皮更生複合酸煥膚',
    price: 560,
    durationMinutes: 90,
    process: '小氣泡清潔、面部按摩、複合酸、撕拉式面膜',
    description: '加速細胞更新，改善暗瘡',
    recommendFor: ['暗瘡', '毛孔'],
  },
  {
    id: 'laser-1',
    category: 'laser',
    categoryLabel: '激光護理',
    name: '激光嫩膚美白',
    price: 680,
    durationMinutes: 90,
    process: '小氣泡清潔、面部按摩、激光嫩膚、撕拉式面膜',
    description: '去除黑眼圈、美白嫩膚、淡化黑色素',
    recommendFor: ['美白', '新客'],
    recommendAfter: ['signature-1', 'plasma-4'],
  },
  {
    id: 'laser-2',
    category: 'laser',
    categoryLabel: '激光護理',
    name: '激光碳粉淨肌',
    price: 780,
    durationMinutes: 105,
    process: '小氣泡清潔、面部按摩、激光嫩膚、激光碳粉、撕拉式面膜',
    description: '控油抗菌、改善暗瘡疤痕及毛孔',
    recommendFor: ['暗瘡', '毛孔'],
  },
  {
    id: 'laser-3',
    category: 'laser',
    categoryLabel: '激光護理',
    name: '激光祛深淺層斑',
    price: 980,
    durationMinutes: 120,
    process: '小氣泡清潔、面部按摩、激光嫩膚、激光祛斑、面膜',
    description: '淡化荷爾蒙斑、雀斑、曬斑，減少皺紋',
    recommendFor: ['色斑'],
  },
  {
    id: 'plasma-1',
    category: 'plasma',
    categoryLabel: '等離子護理',
    name: '煥膚導入療程',
    price: 680,
    durationMinutes: 120,
    process: '小氣泡清潔、面部按摩、等離子、面膜',
    description: '高濃度補濕／亮白／暗瘡鎮靜三選一',
    recommendFor: ['保濕', '美白', '暗瘡'],
  },
  {
    id: 'plasma-2',
    category: 'plasma',
    categoryLabel: '等離子護理',
    name: '嫩滑牛奶肌美白術',
    price: 880,
    durationMinutes: 120,
    process: '小氣泡清潔、面部按摩、等離子、美白精華、面膜',
    description: '革命性美白技術，打造純白透亮肌',
    recommendFor: ['美白'],
  },
  {
    id: 'plasma-3',
    category: 'plasma',
    categoryLabel: '等離子護理',
    name: '眼部重塑輪廓去皺術',
    price: 880,
    durationMinutes: 120,
    process: '小氣泡清潔、面部按摩、等離子、眼部精華、面膜',
    description: '多重草本修復，還原明亮雙眼',
    recommendFor: ['抗老', '眼部'],
  },
  {
    id: 'plasma-4',
    category: 'plasma',
    categoryLabel: '等離子護理',
    name: '微針射頻修復術',
    price: 880,
    durationMinutes: 120,
    process: '小氣泡清潔、面部按摩、微針射頻、面膜',
    description: '緊緻提拉、逆齡，刺激膠原蛋白',
    recommendFor: ['抗老', '修復'],
  },
  {
    id: 'plasma-5',
    category: 'plasma',
    categoryLabel: '等離子護理',
    name: '結焦式祛表皮斑',
    price: 1080,
    durationMinutes: 120,
    process: '小氣泡清潔、面部按摩、等離子祛斑、面膜',
    description: '加速黑色素代謝，祛除色斑',
    recommendFor: ['色斑'],
  },
  {
    id: 'signature-1',
    category: 'signature',
    categoryLabel: '皇牌療程',
    name: '3 way 細胞機導入',
    price: 880,
    durationMinutes: 120,
    process: '抗炎去角質、面部按摩、細胞機、建模面膜',
    description: '4段超聲波修復細胞，打造水光肌',
    recommendFor: ['保濕', '修復'],
    recommendAfter: ['signature-2', 'signature-3'],
  },
  {
    id: 'signature-2',
    category: 'signature',
    categoryLabel: '皇牌療程',
    name: '黃金射頻再生膠原護理',
    price: 1080,
    durationMinutes: 120,
    process: '抗炎去角質、面部按摩、黃金射頻膠原、面膜',
    description: '刺激眼面膠原蛋白，緊緻提拉',
    recommendFor: ['抗老'],
    recommendAfter: ['signature-3'],
  },
  {
    id: 'signature-3',
    category: 'signature',
    categoryLabel: '皇牌療程',
    name: '3 way HIFU 提拉緊緻',
    price: 1380,
    durationMinutes: 120,
    process: '抗炎去角質、面部按摩、3層HIFU、面膜',
    description: '超聲波定位SMAS層，緊緻提拉',
    recommendFor: ['抗老', '緊緻'],
    recommendAfter: ['signature-2'],
  },
  {
    id: 'signature-4',
    category: 'signature',
    categoryLabel: '皇牌療程',
    name: '皇牌四重奏',
    price: 1580,
    durationMinutes: 120,
    process: '抗炎去角質、面部按摩、細胞機、射頻膠原、HIFU、面膜',
    description: '細胞機+HIFU+射頻膠原綜合護理',
    recommendFor: ['抗老', '全面護理'],
  },
  {
    id: 'signature-5',
    category: 'signature',
    categoryLabel: '皇牌療程',
    name: '6合1全能美容療程',
    price: 1680,
    durationMinutes: 135,
    process: '抗炎去角質、面部按摩、細胞機、射頻膠原、HIFU、冷熱療法、面膜',
    description: '最全面綜合美容療程',
    recommendFor: ['全面護理'],
  },
  {
    id: 'addon-1',
    category: 'addon',
    categoryLabel: '加購項目',
    name: '祛除油脂粒（限5粒）',
    price: 300,
    durationMinutes: 30,
    process: '等離子技術',
    description: '使用等離子技術祛除油脂粒',
  },
  {
    id: 'addon-2',
    category: 'addon',
    categoryLabel: '加購項目',
    name: '脫疣（限10粒）',
    price: 500,
    durationMinutes: 30,
    process: '等離子技術',
    description: '脫疣護理，限10粒',
  },
  {
    id: 'addon-3',
    category: 'addon',
    categoryLabel: '加購項目',
    name: 'Bioskin 精華（任選2支）',
    price: 300,
    durationMinutes: 15,
    process: '精華導入',
    description: '膠原煥活、抗皺、修復、抗菌、維他命激活、美白、亮白任選2支',
  },
];

export function getTreatmentById(id: string): Treatment | undefined {
  return TREATMENTS.find((t) => t.id === id);
}

export function getTreatmentsByCategory(category: TreatmentCategory): Treatment[] {
  return TREATMENTS.filter((t) => t.category === category);
}

export function getRecommendations(
  concern?: string,
  lastTreatmentId?: string
): Treatment[] {
  if (lastTreatmentId) {
    const last = getTreatmentById(lastTreatmentId);
    if (last?.recommendAfter) {
      return last.recommendAfter
        .map(getTreatmentById)
        .filter((t): t is Treatment => !!t)
        .slice(0, 3);
    }
  }

  if (concern) {
    return TREATMENTS.filter(
      (t) =>
        t.recommendFor?.some((r) => r.includes(concern) || concern.includes(r))
    ).slice(0, 3);
  }

  return TREATMENTS.filter((t) => t.category === 'signature').slice(0, 3);
}
