import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '../../styles/tokens';

export default function LodgingCard({ lodging }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const { lodgingId, name, region, address, pricePerNight, thumbnailUrl, rating } = lodging;

  return (
    <div
      style={{
        ...s.card,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 32px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.05)',
        borderColor: hovered ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)',
      }}
      onClick={() => navigate(`/lodgings/${lodgingId}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.imgWrap}>
        <img
          src={thumbnailUrl}
          alt={name}
          style={{ ...s.img, transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />
      </div>
      <div style={s.body}>
        <div style={s.topRow}>
          <span style={s.region}>{region}</span>
          <span style={s.rating}>★ {rating}</span>
        </div>
        <p style={s.name}>{name}</p>
        <p style={s.address}>{address}</p>
        <p style={s.price}>
          <strong style={s.priceNum}>{pricePerNight.toLocaleString()}원</strong>
          <span style={s.perNight}> / 1박</span>
        </p>
      </div>
    </div>
  );
}

const s = {
  card: {
    cursor: 'pointer',
    background: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.04)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease',
  },
  imgWrap: {
    overflow: 'hidden',
    borderRadius: '0',
    aspectRatio: '4 / 3',
    background: C.bgGray,
    marginBottom: 0,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
    display: 'block',
  },
  body: { padding: '12px 12px 13px' },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  region: {
    fontSize: '12px',
    fontWeight: '600',
    color: C.textSub,
    letterSpacing: '0.02em',
  },
  rating: {
    fontSize: '12px',
    color: C.text,
    fontWeight: '500',
  },
  name: {
    fontSize: '15px',
    fontWeight: '600',
    color: C.text,
    margin: '0 0 2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.4',
  },
  address: {
    fontSize: '12px',
    color: C.textLight,
    margin: '0 0 6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  price: {
    fontSize: '14px',
    color: C.text,
    margin: 0,
  },
  priceNum: {
    fontWeight: '800',
    fontSize: '15px',
  },
  perNight: {
    fontSize: '12px',
    fontWeight: '400',
    color: C.textSub,
  },
};
