import { useState, useEffect } from 'react';
import { useAuth } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { ROLES } from '../../constants/roles';
import Badge from '../../components/common/Badge';
import { getMyBookings } from '../../api/booking';
import { getMyInquiries } from '../../api/inquiry';
import { C, MAX_WIDTH, R, S } from '../../styles/tokens';
import { INQUIRY_TYPE_LABELS } from '../../constants/inquiryTypes';

const USER_TABS = [
  { key: 'bookings', label: '내 예약' },
  { key: 'inquiries', label: '내 문의' },
];
const SELLER_TABS = [
  { key: 'lodgings', label: '내 숙소', to: '/seller/lodgings' },
  { key: 'reservations', label: '예약 현황', to: '/seller/reservations' },
  { key: 'inquiries', label: '문의 관리', to: '/seller/inquiries' },
];

function BookingsList({ bookings }) {
  if (!bookings.length) return <p style={{ color: C.textSub, padding: '20px 0' }}>예약 내역이 없습니다.</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {bookings.map(b => (
        <div key={b.bookingId} style={sCard.card}>
          <img src={b.thumbnailUrl} alt={b.lodgingName} style={sCard.img} />
          <div style={sCard.body}>
            <div style={sCard.header}>
              <h3 style={sCard.name}>{b.lodgingName}</h3>
              <Badge status={b.bookingStatus} />
            </div>
            <p style={sCard.meta}>{b.checkIn} ~ {b.checkOut} · {b.guests}명</p>
            <p style={sCard.price}>{b.totalPrice.toLocaleString()}원</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InquiriesList({ inquiries }) {
  if (!inquiries.length) return <p style={{ color: C.textSub, padding: '20px 0' }}>문의 내역이 없습니다.</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {inquiries.map(i => (
        <div key={i.inquiryId} style={sCard.inquiryCard}>
          <div style={sCard.inquiryTop}>
            <span style={sCard.inquiryTitle}>{i.title}</span>
            <Badge status={i.inquiryStatus} />
          </div>
          <p style={sCard.inquiryMeta}>{INQUIRY_TYPE_LABELS[i.inquiryType]} · {i.createdAt}</p>
        </div>
      ))}
    </div>
  );
}

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    if (user?.role === ROLES.USER) {
      getMyBookings(user.userId || 1).then(res => setBookings(res.data)).catch(() => { });
      getMyInquiries(user.userId || 1).then(res => setInquiries(res.data)).catch(() => { });
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };

  const roleLabelMap = { [ROLES.USER]: '일반 사용자', [ROLES.SELLER]: '판매자', [ROLES.ADMIN]: '관리자' };

  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        {/* ── 좌측 사이드바 ── */}
        <aside style={s.sidebar}>
          <div style={s.profile}>
            <div style={s.avatar}>{user.name[0]}</div>
            <div>
              <p style={s.profileName}>{user.name}</p>
              <p style={s.profileEmail}>{user.email}</p>
              <span style={s.roleBadge}>{roleLabelMap[user.role]}</span>
            </div>
          </div>

          <nav style={s.sideNav}>
            {user.role === ROLES.USER && USER_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{ ...s.navItem, background: tab === t.key ? C.bgGray : 'transparent', fontWeight: tab === t.key ? '700' : '400' }}
              >
                {t.label}
              </button>
            ))}

            {user.role === ROLES.USER && (
              <Link to="/inquiry/create" style={{ ...s.navItem, textDecoration: 'none', color: C.text, display: 'block', marginTop: '4px' }}>
                + 문의하기
              </Link>
            )}

            {user.role === ROLES.SELLER && SELLER_TABS.map(t => (
              <Link key={t.key} to={t.to} style={{ ...s.navItem, textDecoration: 'none', color: C.text, display: 'block' }}>
                {t.label}
              </Link>
            ))}

            {user.role === ROLES.ADMIN && (
              <Link to="/admin" style={{ ...s.navItem, textDecoration: 'none', color: C.text, display: 'block' }}>
                관리자 대시보드
              </Link>
            )}
          </nav>

          <button onClick={handleLogout} style={s.logoutBtn}>로그아웃</button>
        </aside>

        {/* ── 우측 콘텐츠 ── */}
        <main style={s.content}>
          {user.role === ROLES.USER && (
            <>
              <h2 style={s.contentTitle}>{tab === 'bookings' ? '내 예약' : '내 문의'}</h2>
              {tab === 'bookings' && <BookingsList bookings={bookings} />}
              {tab === 'inquiries' && <InquiriesList inquiries={inquiries} />}
            </>
          )}
          {user.role === ROLES.SELLER && (
            <>
              <h2 style={s.contentTitle}>판매자 관리</h2>
              <p style={{ color: C.textSub, fontSize: '14px' }}>좌측 메뉴에서 항목을 선택하세요.</p>
            </>
          )}
          {user.role === ROLES.ADMIN && (
            <>
              <h2 style={s.contentTitle}>관리자 페이지</h2>
              <p style={{ color: C.textSub, fontSize: '14px' }}>좌측 메뉴에서 항목을 선택하세요.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const s = {
  wrap: { background: C.bgWarm, minHeight: 'calc(100vh - 160px)', padding: '56px 24px' },
  inner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '28px', alignItems: 'flex-start' },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    background: C.bg,
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: `1px solid ${C.borderLight}`,
    position: 'sticky',
    top: '100px',
  },
  profile: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '28px', paddingBottom: '24px', borderBottom: `1px solid ${C.borderLight}` },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: C.primary,
    color: '#fff',
    fontSize: '24px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(232,72,74,0.3)',
  },
  profileName: { fontSize: '18px', fontWeight: '800', color: C.text, margin: '0 0 4px' },
  profileEmail: { fontSize: '12px', color: C.textSub, margin: '0 0 8px' },
  roleBadge: { fontSize: '11px', fontWeight: '700', background: '#FFF1F1', color: C.primary, padding: '4px 10px', borderRadius: '999px', display: 'inline-block' },
  sideNav: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '28px' },
  navItem: {
    width: '100%',
    textAlign: 'left',
    padding: '12px 14px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    color: C.text,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  logoutBtn: {
    width: '100%',
    padding: '12px',
    background: '#fff',
    border: `1px solid ${C.border}`,
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: C.textSub,
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  },
  content: {
    flex: 1,
    background: C.bg,
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: `1px solid ${C.borderLight}`,
    minHeight: '400px',
  },
  contentTitle: { fontSize: '24px', fontWeight: '800', color: '#1A1A1A', margin: '0 0 32px' },
};

const sCard = {
  card: {
    display: 'flex',
    gap: '24px',
    border: `1px solid #F0EFEF`,
    borderRadius: '20px',
    overflow: 'hidden',
    padding: '24px',
    background: '#fff',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer',
  },
  img: { width: '140px', height: '110px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 },
  body: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  name: { fontSize: '18px', fontWeight: '800', color: C.text, margin: 0 },
  meta: { fontSize: '14px', color: '#6A6A6A', margin: '0 0 12px' },
  price: { fontSize: '18px', fontWeight: '800', color: C.text, margin: 0 },
  inquiryCard: { border: `1px solid #F0EFEF`, borderRadius: '16px', padding: '20px 24px', background: '#fff' },
  inquiryTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  inquiryTitle: { fontSize: '16px', fontWeight: '700', color: C.text },
  inquiryMeta: { fontSize: '14px', color: '#888', margin: 0 },
};
