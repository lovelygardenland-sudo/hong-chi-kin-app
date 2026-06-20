import React, { useCallback, useRef, useState } from 'react';
import type {
  Booking,
  DeductionConsent,
  MemberProfile,
  Promotion,
  RestNotice,
} from '@shared/data/seed';
import { BOOKING_SLOTS } from '@shared/data/seed';
import { PACKAGES, SHOP } from '@shared/data/shop';
import { TREATMENTS } from '@shared/data/treatments';
import {
  getMember,
  getMembers,
  getBookings,
  getPromotions,
  getRestNotices,
  updateBookingStatus,
  savePromotions,
  addRestNotice,
  toggleRestNotice,
  deleteRestNotice,
  togglePromotion,
  addPromotion,
  addBooking,
  addMember,
  updateMemberBalance,
  addTransaction,
  resetDemoData,
} from './storage';
import logoUrl from './logo.jpeg';

type Tab = 'dashboard' | 'preview' | 'bookings' | 'members' | 'promotions' | 'rest';

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [member, setMember] = useState<MemberProfile>(getMember);
  const [members, setMembers] = useState<MemberProfile[]>(getMembers);
  const [bookings, setBookings] = useState<Booking[]>(getBookings);
  const [promotions, setPromotions] = useState<Promotion[]>(getPromotions);
  const [restNotices, setRestNotices] = useState<RestNotice[]>(getRestNotices);

  const refresh = useCallback(() => {
    setMember(getMember());
    setMembers(getMembers());
    setBookings(getBookings());
    setPromotions(getPromotions());
    setRestNotices(getRestNotices());
  }, []);

  const navItems: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: '📊 概覽' },
    { id: 'preview', label: '📱 App 預覽' },
    { id: 'bookings', label: '📅 預約管理' },
    { id: 'members', label: '👤 會員管理' },
    { id: 'promotions', label: '🎁 優惠管理' },
    { id: 'rest', label: '⚠️ 休息通告' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <AdminBrandLogo />
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${tab === item.id ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </aside>

      <main className="main">
        {tab === 'dashboard' && (
          <Dashboard
            member={member}
            bookings={bookings}
            restNotices={restNotices}
            promotions={promotions}
          />
        )}
        {tab === 'preview' && <AppPreview />}
        {tab === 'bookings' && (
          <BookingsPanel
            bookings={bookings}
            onAddBooking={(booking) => setBookings(addBooking(booking))}
            onUpdateStatus={(id, status) => {
              setBookings(updateBookingStatus(id, status));
            }}
          />
        )}
        {tab === 'members' && (
          <MembersPanel
            members={members}
            onAddMember={(newMember) => setMembers(addMember(newMember))}
            onUpdateBalance={(memberId, balance) =>
              setMembers(updateMemberBalance(memberId, balance))
            }
            onDeduct={(memberId, amt, name, consent) =>
              setMembers(addTransaction(memberId, -amt, name, consent))
            }
          />
        )}
        {tab === 'promotions' && (
          <PromotionsPanel
            promotions={promotions}
            onToggle={(id) => setPromotions(togglePromotion(id))}
            onAdd={(p) => setPromotions(addPromotion(p))}
          />
        )}
        {tab === 'rest' && (
          <RestPanel
            notices={restNotices}
            onToggle={(id) => setRestNotices(toggleRestNotice(id))}
            onDelete={(id) => setRestNotices(deleteRestNotice(id))}
            onAdd={(n) => setRestNotices(addRestNotice(n))}
          />
        )}

        <div style={{ marginTop: 32 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (confirm('確定重置所有示範資料？')) {
                resetDemoData();
                refresh();
              }
            }}
          >
            重置示範資料
          </button>
        </div>
      </main>
    </div>
  );
}

function AdminBrandLogo() {
  return (
    <div className="admin-brand">
      <img src={logoUrl} alt="康姿健 HONG CHI KIN" className="admin-brand-logo" />
      <strong>{SHOP.name}</strong>
      <small>{SHOP.nameEn}</small>
      <span>管理後台</span>
    </div>
  );
}

function Dashboard({
  member,
  bookings,
  restNotices,
  promotions,
}: {
  member: MemberProfile;
  bookings: Booking[];
  restNotices: RestNotice[];
  promotions: Promotion[];
}) {
  const upcoming = bookings.filter((b) => b.status === 'confirmed').length;
  const activeRest = restNotices.filter((n) => n.active);

  return (
    <>
      <h2 className="page-title">概覽</h2>
      <div className="stats">
        <div className="stat-card">
          <div className="label">待確認預約</div>
          <div className="value">{upcoming}</div>
        </div>
        <div className="stat-card">
          <div className="label">示範會員餘額</div>
          <div className="value">${member.balance}</div>
        </div>
        <div className="stat-card">
          <div className="label">進行中優惠</div>
          <div className="value">{promotions.filter((p) => p.active).length}</div>
        </div>
        <div className="stat-card">
          <div className="label">休息通告</div>
          <div className="value">{activeRest.length}</div>
        </div>
      </div>

      {activeRest.map((n) => (
        <div key={n.id} className="notice-banner">
          <strong>{n.title}</strong>
          <p>{n.message}</p>
          <small>
            {n.startDate} 至 {n.endDate}
          </small>
        </div>
      ))}

      <div className="card">
        <h3>店鋪資訊</h3>
        <p>{SHOP.address}</p>
        <p>
          {SHOP.hours.days} {SHOP.hours.open}–{SHOP.hours.close} · {SHOP.phoneDisplay}
        </p>
      </div>
    </>
  );
}

function AppPreview() {
  const samplePromotions = getPromotions().filter((promo) => promo.active).slice(0, 2);
  const sampleTreatments = TREATMENTS.slice(0, 3);

  return (
    <>
      <h2 className="page-title">App 預覽</h2>
      <p className="preview-intro">
        以下是客人手機 App 的畫面方向，實際手機可用 Expo Go 掃描 QR code 預覽。
      </p>

      <div className="phone-preview-grid">
        <PhoneFrame title="首頁">
          <div className="phone-hero">
            <span>{SHOP.nameEn}</span>
            <strong>{SHOP.name}</strong>
            <small>{SHOP.tagline}</small>
          </div>
          <div className="phone-card center">
            <small>可用餘額</small>
            <b>$2,120</b>
            <span>查看詳情 →</span>
          </div>
          <button className="phone-main-btn">📅 立即預約</button>
          <button className="phone-whatsapp-btn">WhatsApp 查詢</button>
          <h4>本月優惠</h4>
          {samplePromotions.map((promo) => (
            <div key={promo.id} className="phone-promo">
              <strong>{promo.title}</strong>
              <span>{promo.description}</span>
            </div>
          ))}
        </PhoneFrame>

        <PhoneFrame title="預約">
          <h4>① 選擇類別</h4>
          <div className="phone-chips">
            <span className="active">TEGODER</span>
            <span>激光</span>
            <span>皇牌</span>
          </div>
          <h4>② 選擇療程</h4>
          {sampleTreatments.map((treatment) => (
            <div key={treatment.id} className="phone-treatment">
              <small>{treatment.categoryLabel}</small>
              <strong>{treatment.name}</strong>
              <span>${treatment.price} · {treatment.durationMinutes}分鐘</span>
            </div>
          ))}
          <div className="phone-help-box">
            不確定適合哪個療程？
            <button className="phone-whatsapp-btn">WhatsApp 查詢</button>
          </div>
        </PhoneFrame>

        <PhoneFrame title="確認預約">
          <div className="phone-card">
            <strong>確認預約</strong>
            <p>6合1全能美容療程</p>
            <p>2026年6月20日 15:30</p>
            <p>費用：$1,680</p>
          </div>
          <div className="phone-consent">
            <strong>扣款確認及簽署</strong>
            <span>本人確認同意從套票餘額扣除療程費用。</span>
            <div className="phone-sign-box">手指簽名區</div>
          </div>
          <button className="phone-main-btn">簽署確認並預約</button>
        </PhoneFrame>

        <PhoneFrame title="我的">
          <div className="phone-profile">
            <div className="phone-avatar">客</div>
            <strong>示範會員</strong>
            <span>****4567</span>
          </div>
          <div className="phone-card">
            <strong>我的預約</strong>
            <p>6合1全能美容療程</p>
            <span>2026年6月20日 15:30 · 已確認</span>
          </div>
          <div className="phone-card">
            <strong>關注我們</strong>
            <p>Instagram @hong_chi_kin</p>
            <p>小紅書</p>
            <p>WhatsApp 9770 9300</p>
          </div>
        </PhoneFrame>
      </div>
    </>
  );
}

function PhoneFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-topbar">{title}</div>
        <div className="phone-content">{children}</div>
        <div className="phone-tabbar">
          <span>首頁</span>
          <span>預約</span>
          <span>餘額</span>
          <span>優惠</span>
          <span>我的</span>
        </div>
      </div>
    </div>
  );
}

const statusText: Record<Booking['status'], string> = {
  pending: '待確認',
  confirmed: '已確認',
  completed: '已完成',
  cancelled: '已取消',
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

function shiftDate(date: string, days: number): string {
  const parsed = parseDate(date);
  parsed.setDate(parsed.getDate() + days);
  return formatDate(parsed);
}

function getWeekDates(date: string): string[] {
  const selected = parseDate(date);
  const start = new Date(selected);
  const day = start.getDay();
  start.setDate(start.getDate() - day);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return formatDate(current);
  });
}

function getDayLabel(date: string): string {
  const labels = ['日', '一', '二', '三', '四', '五', '六'];
  return `週${labels[parseDate(date).getDay()]}`;
}

function formatShortDate(date: string): string {
  const parsed = parseDate(date);
  return `${parsed.getMonth() + 1}/${parsed.getDate()}`;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return last4 ? `****${last4}` : '****';
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function bookingEndTime(booking: Booking): string {
  return minutesToTime(timeToMinutes(booking.time) + booking.durationMinutes);
}

function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && startB < endA;
}

function getOverlappingBookings(
  bookings: Booking[],
  date: string,
  time: string,
  durationMinutes = 1
): Booking[] {
  const start = timeToMinutes(time);
  const end = start + durationMinutes;

  return bookings.filter((booking) => {
    if (booking.date !== date || booking.status === 'cancelled') return false;

    const bookingStart = timeToMinutes(booking.time);
    const bookingEnd = bookingStart + booking.durationMinutes;
    return rangesOverlap(start, end, bookingStart, bookingEnd);
  });
}

function BookingsPanel({
  bookings,
  onAddBooking,
  onUpdateStatus,
}: {
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  onUpdateStatus: (id: string, status: Booking['status']) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [draftSlot, setDraftSlot] = useState<{ date: string; time: string } | null>(
    null
  );
  const weekDates = getWeekDates(selectedDate);
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const bookingsBySlot = new Map<string, Booking[]>();

  activeBookings.forEach((booking) => {
    const key = `${booking.date}-${booking.time}`;
    const current = bookingsBySlot.get(key) ?? [];
    bookingsBySlot.set(key, [...current, booking]);
  });

  return (
    <>
      <h2 className="page-title">預約管理</h2>

      <div className="card">
        <div className="calendar-header">
          <div>
            <h3>預約日曆</h3>
            <p>清楚查看每天已預約時段，一人小店建議同一時段只接一位客人。</p>
          </div>
          <div className="calendar-controls">
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedDate(shiftDate(selectedDate, -7))}
            >
              上一週
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedDate(shiftDate(selectedDate, 7))}
            >
              下一週
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setSelectedDate(formatDate(new Date()))}
            >
              今日
            </button>
          </div>
        </div>

        <div className="booking-calendar">
          <div className="calendar-cell calendar-time-head">時間</div>
          {weekDates.map((date) => (
            <div
              key={date}
              className={`calendar-cell calendar-day-head ${
                date === formatDate(new Date()) ? 'today' : ''
              }`}
            >
              <strong>{getDayLabel(date)}</strong>
              <span>{formatShortDate(date)}</span>
            </div>
          ))}

          {BOOKING_SLOTS.map((slot) => (
            <React.Fragment key={slot}>
              <div className="calendar-cell calendar-time">{slot}</div>
              {weekDates.map((date) => {
                const slotBookings = bookingsBySlot.get(`${date}-${slot}`) ?? [];
                const blockingBookings = getOverlappingBookings(
                  activeBookings,
                  date,
                  slot
                ).filter((booking) => booking.time !== slot);
                return (
                  <div
                    key={`${date}-${slot}`}
                    className={`calendar-cell calendar-slot ${
                      slotBookings.length > 0
                        ? 'booked'
                        : blockingBookings.length > 0
                          ? 'blocked'
                          : ''
                    }`}
                  >
                    {slotBookings.length === 0 ? (
                      blockingBookings.length > 0 ? (
                        <div className="merged-slot-continuation">
                          <span>延續至 {bookingEndTime(blockingBookings[0])}</span>
                        </div>
                      ) : (
                        <button
                          className="free-slot-btn"
                          onClick={() => setDraftSlot({ date, time: slot })}
                        >
                          + 新增預約
                        </button>
                      )
                    ) : (
                      slotBookings.map((booking) => (
                        <div key={booking.id} className="booking-pill">
                          <strong>{booking.memberName}</strong>
                          <span>{booking.treatmentName}</span>
                          <small>
                            {maskPhone(booking.memberPhone)} · {booking.time}-{bookingEndTime(booking)} · {booking.durationMinutes}分鐘
                          </small>
                          <em>{statusText[booking.status]}</em>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {draftSlot && (
        <CreateBookingPanel
          slot={draftSlot}
          activeBookings={activeBookings}
          onCancel={() => setDraftSlot(null)}
          onCreate={(booking) => {
            onAddBooking(booking);
            setSelectedDate(booking.date);
            setDraftSlot(null);
          }}
        />
      )}

      <div className="card">
        <h3>預約列表</h3>
        {bookings.length === 0 ? (
          <p className="empty">暫無預約（客人透過 App 預約後會顯示在此）</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>客人</th>
                <th>電話</th>
                <th>療程</th>
                <th>日期</th>
                <th>時間</th>
                <th>費用</th>
                <th>簽署</th>
                <th>狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.memberName}</td>
                  <td>{maskPhone(b.memberPhone)}</td>
                  <td>{b.treatmentName}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>${b.price}</td>
                  <td>
                    {b.deductionConsent ? (
                      <span className="badge active" title={b.deductionConsent.signerName}>
                        ✓ {b.deductionConsent.signerName}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span className={`badge ${b.status}`}>{b.status}</span>
                  </td>
                  <td>
                    {b.status === 'confirmed' && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => onUpdateStatus(b.id, 'completed')}
                      >
                        完成
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => onUpdateStatus(b.id, 'cancelled')}
                      >
                        取消
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function CreateBookingPanel({
  slot,
  activeBookings,
  onCancel,
  onCreate,
}: {
  slot: { date: string; time: string };
  activeBookings: Booking[];
  onCancel: () => void;
  onCreate: (booking: Booking) => void;
}) {
  const firstTreatment = TREATMENTS[0];
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [treatmentId, setTreatmentId] = useState(firstTreatment?.id ?? '');
  const [notes, setNotes] = useState('');
  const treatment =
    TREATMENTS.find((item) => item.id === treatmentId) ?? firstTreatment;
  const conflictingBookings = treatment
    ? getOverlappingBookings(
        activeBookings,
        slot.date,
        slot.time,
        treatment.durationMinutes
      )
    : [];

  const canCreate =
    memberName.trim() &&
    memberPhone.trim() &&
    treatment &&
    conflictingBookings.length === 0;

  return (
    <div className="card create-booking-card">
      <div className="create-booking-head">
        <div>
          <h3>新增預約</h3>
          <p>
            {slot.date} · {getDayLabel(slot.date)} · {slot.time}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onCancel}>
          關閉
        </button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>客人姓名</label>
          <input
            value={memberName}
            onChange={(event) => setMemberName(event.target.value)}
            placeholder="例如：陳小姐"
          />
        </div>
        <div className="form-group">
          <label>電話 / WhatsApp</label>
          <input
            value={memberPhone}
            onChange={(event) => setMemberPhone(event.target.value)}
            placeholder="例如：9123 4567"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>療程</label>
          <select
            value={treatmentId}
            onChange={(event) => setTreatmentId(event.target.value)}
          >
            {TREATMENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.categoryLabel}｜{item.name}｜${item.price}
              </option>
            ))}
          </select>
        </div>
        <div className="booking-summary-box">
          <span>價格</span>
          <strong>${treatment?.price ?? 0}</strong>
          <span>
            {slot.time} -{' '}
            {treatment
              ? minutesToTime(timeToMinutes(slot.time) + treatment.durationMinutes)
              : slot.time}
          </span>
          <span>需時 {treatment?.durationMinutes ?? 0} 分鐘</span>
        </div>
      </div>

      {conflictingBookings.length > 0 && (
        <div className="conflict-warning">
          此療程會與同日預約撞時間：
          {conflictingBookings.map((booking) => (
            <strong key={booking.id}>
              {booking.time}-{bookingEndTime(booking)} {booking.memberName}
            </strong>
          ))}
        </div>
      )}

      <div className="form-group">
        <label>備註（選填）</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="例如：新客、想改善色斑、需要 WhatsApp 再確認"
        />
      </div>

      <button
        className="btn btn-primary"
        disabled={!canCreate}
        onClick={() => {
          if (!canCreate || !treatment) return;
          onCreate({
            id: `admin-bk-${Date.now()}`,
            memberId: `walk-in-${Date.now()}`,
            memberName: memberName.trim(),
            memberPhone: memberPhone.trim(),
            treatmentId: treatment.id,
            treatmentName: treatment.name,
            price: treatment.price,
            durationMinutes: treatment.durationMinutes,
            date: slot.date,
            time: slot.time,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            notes: notes.trim() || undefined,
          });
        }}
      >
        建立預約
      </button>
    </div>
  );
}

function MembersPanel({
  members,
  onAddMember,
  onUpdateBalance,
  onDeduct,
}: {
  members: MemberProfile[];
  onAddMember: (member: MemberProfile) => void;
  onUpdateBalance: (memberId: string, balance: number) => void;
  onDeduct: (
    memberId: string,
    amt: number,
    name: string,
    consent: DeductionConsent
  ) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(members[0]?.id ?? '');
  const [balanceInput, setBalanceInput] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filteredMembers = members.filter((member) => {
    const normalized = `${member.name} ${member.phone}`.toLowerCase();
    return normalized.includes(query.trim().toLowerCase());
  });
  const selectedMember =
    members.find((member) => member.id === selectedId) ?? members[0] ?? null;
  const pkg = selectedMember
    ? PACKAGES.find((p) => p.id === selectedMember.packageId)
    : null;

  const selectMember = (memberId: string) => {
    const nextMember = members.find((member) => member.id === memberId);
    setSelectedId(memberId);
    setBalanceInput(nextMember ? String(nextMember.balance) : '');
  };

  return (
    <>
      <h2 className="page-title">會員管理</h2>

      <div className="members-layout">
        <div className="card members-list-card">
          <div className="members-list-head">
            <h3>全部會員</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowAdd((value) => !value)}
            >
              {showAdd ? '取消' : '新增會員'}
            </button>
          </div>

          <div className="form-group">
            <label>搜尋姓名 / 電話</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="輸入姓名或電話"
            />
          </div>

          {showAdd && (
            <AddMemberForm
              onAdd={(member) => {
                onAddMember(member);
                setSelectedId(member.id);
                setBalanceInput(String(member.balance));
                setShowAdd(false);
              }}
            />
          )}

          <div className="member-list">
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                className={`member-list-item ${
                  selectedMember?.id === member.id ? 'active' : ''
                }`}
                onClick={() => selectMember(member.id)}
              >
                <strong>{member.name}</strong>
                <span>{maskPhone(member.phone)}</span>
                <em>${member.balance}</em>
              </button>
            ))}
            {filteredMembers.length === 0 && (
              <p className="empty">找不到會員</p>
            )}
          </div>
        </div>

        {selectedMember ? (
          <div>
            <div className="card">
              <h3>{selectedMember.name}</h3>
              <p>電話：{maskPhone(selectedMember.phone)}</p>
              {pkg && <p>{pkg.description}</p>}
              <p>有效期至：{selectedMember.expiresAt ?? '—'}</p>

              <div className="form-row" style={{ marginTop: 16 }}>
                <div className="form-group">
                  <label>更新餘額 ($)</label>
                  <input
                    type="number"
                    value={balanceInput || String(selectedMember.balance)}
                    onChange={(e) => setBalanceInput(e.target.value)}
                  />
                </div>
                <div
                  className="form-group"
                  style={{ display: 'flex', alignItems: 'flex-end' }}
                >
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      onUpdateBalance(
                        selectedMember.id,
                        Number(balanceInput || selectedMember.balance)
                      )
                    }
                  >
                    儲存餘額
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>手動扣款</h3>
              <ManualDeduct
                member={selectedMember}
                onDeduct={(amt, name, consent) =>
                  onDeduct(selectedMember.id, amt, name, consent)
                }
              />
            </div>

            <div className="card">
              <h3>消費紀錄</h3>
              {selectedMember.transactions.length === 0 ? (
                <p className="empty">暫無紀錄</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>項目</th>
                      <th>金額</th>
                      <th>餘額</th>
                      <th>簽署</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMember.transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.date}</td>
                        <td>{tx.treatmentName}</td>
                        <td>{tx.amount < 0 ? '' : '+'}${tx.amount}</td>
                        <td>${tx.balanceAfter}</td>
                        <td>{tx.consent ? `✓ ${tx.consent.signerName}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <div className="card">
            <p className="empty">請先新增會員</p>
          </div>
        )}
      </div>
    </>
  );
}

function AddMemberForm({ onAdd }: { onAdd: (member: MemberProfile) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [packageId, setPackageId] = useState<MemberProfile['packageId']>('pkg-a');
  const selectedPackage = PACKAGES.find((pkg) => pkg.id === packageId);

  return (
    <div className="add-member-box">
      <div className="form-group">
        <label>姓名</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>電話</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="form-group">
        <label>套票</label>
        <select
          value={packageId ?? ''}
          onChange={(e) =>
            setPackageId(e.target.value as MemberProfile['packageId'])
          }
        >
          {PACKAGES.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name}｜${pkg.value}
            </option>
          ))}
        </select>
      </div>
      <button
        className="btn btn-primary"
        disabled={!name.trim() || !phone.trim() || !selectedPackage}
        onClick={() => {
          if (!name.trim() || !phone.trim() || !selectedPackage) return;
          const today = new Date();
          const expires = new Date(today);
          expires.setMonth(today.getMonth() + selectedPackage.validityMonths);
          onAdd({
            id: `member-${Date.now()}`,
            name: name.trim(),
            phone: phone.trim(),
            packageId,
            balance: selectedPackage.value,
            packageValue: selectedPackage.value,
            purchasedAt: formatDate(today),
            expiresAt: formatDate(expires),
            lastTreatmentId: null,
            skinConcern: null,
            transactions: [],
          });
          setName('');
          setPhone('');
        }}
      >
        建立會員
      </button>
    </div>
  );
}

function ManualDeduct({
  member,
  onDeduct,
}: {
  member: MemberProfile;
  onDeduct: (amt: number, name: string, consent: DeductionConsent) => void;
}) {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState('');

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label>療程名稱</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>扣款金額 ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      {name && amount && (
        <div className="consent-preview">
          <strong>套票扣款同意書</strong>
          <p>
            本人 {member.name} 確認同意從康姿健套票餘額扣除 ${Number(amount)}{' '}
            作為「{name}」療程費用。
          </p>
          <p>
            扣款前餘額：${member.balance} · 扣款後餘額：$
            {Math.max(0, member.balance - Number(amount))}
          </p>
        </div>
      )}

      <label className="check-line">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        客人已閱讀並同意上述扣款條款
      </label>

      <AdminSignaturePad onChange={setSignatureData} />

      <div className="form-group" style={{ marginTop: 16 }}>
        <button
          className="btn btn-primary"
          disabled={!name || !amount || !agreed || !signatureData}
          onClick={() => {
            if (name && amount && agreed && signatureData) {
              const deductAmount = Number(amount);
              const consent: DeductionConsent = {
                agreedAt: new Date().toISOString(),
                signerName: member.name,
                amount: deductAmount,
                treatmentName: name,
                signatureData,
                balanceBefore: member.balance,
                balanceAfter: Math.max(0, member.balance - deductAmount),
              };
              onDeduct(deductAmount, name, consent);
              setAmount('');
              setName('');
              setAgreed(false);
              setSignatureData('');
            }
          }}
        >
          簽署確認並扣款
        </button>
      </div>
    </div>
  );
}

function AdminSignaturePad({ onChange }: { onChange: (data: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPoint(event);
    ctx.strokeStyle = '#C96B73';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { x, y } = getPoint(event);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
    onChange(canvas.toDataURL('image/png'));
  };

  const stop = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange('');
  };

  return (
    <div className="signature-wrap">
      <label>客人簽名</label>
      <div className="signature-box">
        <canvas
          ref={canvasRef}
          width={720}
          height={180}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={stop}
          onPointerLeave={stop}
        />
        {!hasSignature && <span>請客人在此簽名</span>}
      </div>
      <button type="button" className="btn btn-secondary" onClick={clear}>
        清除簽名
      </button>
    </div>
  );
}

function PromotionsPanel({
  promotions,
  onToggle,
  onAdd,
}: {
  promotions: Promotion[];
  onToggle: (id: string) => void;
  onAdd: (p: Promotion) => void;
}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <>
      <h2 className="page-title">優惠管理</h2>
      {promotions.map((p) => (
        <div key={p.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <small>
                {p.validFrom} 至 {p.validUntil}
              </small>
            </div>
            <div>
              <span className={`badge ${p.active ? 'active' : ''}`}>
                {p.active ? '進行中' : '已停用'}
              </span>
              <button
                className="btn btn-secondary"
                style={{ marginLeft: 8 }}
                onClick={() => onToggle(p.id)}
              >
                {p.active ? '停用' : '啟用'}
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="card">
        <h3>新增優惠</h3>
        <div className="form-group">
          <label>標題</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!title || !desc) return;
            const today = new Date().toISOString().slice(0, 10);
            onAdd({
              id: `promo-${Date.now()}`,
              title,
              description: desc,
              validFrom: today,
              validUntil: today.slice(0, 8) + '31',
              active: true,
            });
            setTitle('');
            setDesc('');
          }}
        >
          新增
        </button>
      </div>
    </>
  );
}

function RestPanel({
  notices,
  onToggle,
  onDelete,
  onAdd,
}: {
  notices: RestNotice[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (n: RestNotice) => void;
}) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [title, setTitle] = useState('店主休息通知');
  const [message, setMessage] = useState('');

  return (
    <>
      <h2 className="page-title">休息通告</h2>
      <p style={{ color: 'var(--gray)', marginBottom: 16 }}>
        設定休息日期後，App 預約日曆會自動封鎖該時段，並在首頁顯示通告。
      </p>

      {notices.map((n) => (
        <div key={n.id} className="notice-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <small>
                {n.startDate} 至 {n.endDate} ·{' '}
                {n.active ? '✅ 啟用中' : '已停用'}
              </small>
            </div>
            <div>
              <button className="btn btn-secondary" onClick={() => onToggle(n.id)}>
                {n.active ? '停用' : '啟用'}
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(n.id)}>
                刪除
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="card">
        <h3>新增休息通告</h3>
        <div className="form-row">
          <div className="form-group">
            <label>開始日期</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="form-group">
            <label>結束日期</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>標題</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>通告內容</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="例如：店主旅行休息，7月7日恢復營業"
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!start || !end || !message) return;
            onAdd({
              id: `rest-${Date.now()}`,
              startDate: start,
              endDate: end,
              title,
              message,
              active: true,
            });
            setStart('');
            setEnd('');
            setMessage('');
          }}
        >
          新增通告
        </button>
      </div>
    </>
  );
}
