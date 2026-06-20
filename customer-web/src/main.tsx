import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BOOKING_SLOTS, DEFAULT_PROMOTIONS, DEFAULT_REST_NOTICES } from '@shared/data/seed';
import { SHOP } from '@shared/data/shop';
import { CATEGORY_LABELS, TREATMENTS, type TreatmentCategory } from '@shared/data/treatments';
import { createCustomerBooking } from './bookingService';
import { firebaseEnabled } from './firebase';
import './styles.css';

const categories: TreatmentCategory[] = ['tegoder', 'laser', 'plasma', 'signature', 'addon'];

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function upcomingDates(count = 21) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return formatDate(date);
  });
}

function isRestDate(date: string) {
  return DEFAULT_REST_NOTICES.some(
    (notice) => notice.active && date >= notice.startDate && date <= notice.endDate
  );
}

function whatsappUrl(message: string) {
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;
}

function App() {
  const [category, setCategory] = useState<TreatmentCategory>('tegoder');
  const [treatmentId, setTreatmentId] = useState(TREATMENTS[0].id);
  const [date, setDate] = useState(upcomingDates()[0]);
  const [time, setTime] = useState(BOOKING_SLOTS[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const dates = useMemo(() => upcomingDates(), []);
  const treatments = TREATMENTS.filter((item) => item.category === category);
  const treatment = TREATMENTS.find((item) => item.id === treatmentId) ?? TREATMENTS[0];
  const promotions = DEFAULT_PROMOTIONS.filter((promo) => promo.active);
  const activeRest = DEFAULT_REST_NOTICES.find((notice) => notice.active);
  const canSubmit = name.trim() && phone.trim() && treatment && date && time && !isRestDate(date);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await createCustomerBooking({
        memberName: name.trim(),
        memberPhone: phone.trim(),
        treatmentId: treatment.id,
        treatmentName: treatment.name,
        price: treatment.price,
        durationMinutes: treatment.durationMinutes,
        date,
        time,
        notes: notes.trim() || undefined,
      });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <header className="hero">
        <nav>
          <strong>{SHOP.name}</strong>
          <a href={whatsappUrl('你好，我想查詢康姿健療程及預約')} target="_blank">
            WhatsApp 查詢
          </a>
        </nav>
        <div className="hero-content">
          <span>{SHOP.nameEn}</span>
          <h1>網上預約</h1>
          <p>{SHOP.tagline}</p>
          <div className="hero-actions">
            <a href="#booking" className="primary">立即預約</a>
            <a href={SHOP.googleMaps} target="_blank" className="secondary">Google Map 導航</a>
          </div>
        </div>
      </header>

      <main>
        {activeRest && (
          <section className="notice">
            <strong>{activeRest.title}</strong>
            <p>{activeRest.message}</p>
          </section>
        )}

        <section className="quick-links">
          <a href={whatsappUrl('你好，我想查詢我適合做哪個康姿健療程')} target="_blank">
            WhatsApp 查詢療程
          </a>
          <a href={SHOP.googleMaps} target="_blank">查看 Google Map</a>
          <a href={SHOP.googleReview} target="_blank">到 Google 留好評</a>
        </section>

        <section>
          <div className="section-head">
            <h2>本月優惠</h2>
            <span>{firebaseEnabled ? '已連接雲端' : '預覽模式'}</span>
          </div>
          <div className="promo-grid">
            {promotions.map((promo) => (
              <article key={promo.id} className="card promo-card">
                <strong>{promo.title}</strong>
                <p>{promo.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="booking" className="booking-card">
          <div className="section-head">
            <h2>預約療程</h2>
            <span>提交後店主會再確認</span>
          </div>

          {done ? (
            <div className="success">
              <h3>已收到你的預約</h3>
              <p>
                {date} {time} · {treatment.name}
              </p>
              <p>我們會盡快 WhatsApp 確認。</p>
              <a
                href={whatsappUrl(`你好，我剛提交了 ${date} ${time} ${treatment.name} 預約，想確認一下。`)}
                target="_blank"
              >
                WhatsApp 跟進
              </a>
            </div>
          ) : (
            <div className="booking-form">
              <label>
                療程類別
                <div className="chips">
                  {categories.map((item) => (
                    <button
                      key={item}
                      className={category === item ? 'active' : ''}
                      onClick={() => {
                        setCategory(item);
                        const next = TREATMENTS.find((t) => t.category === item);
                        if (next) setTreatmentId(next.id);
                      }}
                      type="button"
                    >
                      {CATEGORY_LABELS[item]}
                    </button>
                  ))}
                </div>
              </label>

              <label>
                療程
                <select value={treatmentId} onChange={(e) => setTreatmentId(e.target.value)}>
                  {treatments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}｜${item.price}｜{item.durationMinutes}分鐘
                    </option>
                  ))}
                </select>
              </label>

              <div className="selected-treatment">
                <strong>{treatment.name}</strong>
                <span>${treatment.price} · {treatment.durationMinutes}分鐘</span>
                <p>{treatment.description}</p>
              </div>

              <label>
                日期
                <select value={date} onChange={(e) => setDate(e.target.value)}>
                  {dates.map((item) => (
                    <option key={item} value={item} disabled={isRestDate(item)}>
                      {item}{isRestDate(item) ? '（休息）' : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                時間
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  {BOOKING_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </label>

              <label>
                姓名
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：陳小姐" />
              </label>

              <label>
                WhatsApp 電話
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="例如：9123 4567" />
              </label>

              <label>
                備註
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="例如：第一次來、想改善色斑" />
              </label>

              <button className="submit" disabled={!canSubmit || submitting} onClick={submit}>
                {submitting ? '提交中...' : '提交預約'}
              </button>
            </div>
          )}
        </section>

        <section className="location-card">
          <h2>店鋪位置</h2>
          <p>{SHOP.address}</p>
          <p>{SHOP.hours.days} {SHOP.hours.open} - {SHOP.hours.close}</p>
          <div className="hero-actions">
            <a href={SHOP.googleMaps} target="_blank" className="primary">Google Map 導航</a>
            <a href={SHOP.googleReview} target="_blank" className="secondary">到 Google 留好評</a>
          </div>
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
