import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  User, Check, Loader, DollarSign, X, MapPin, Video, Camera,
  ChevronRight, Shield, Star, Zap, Building2, Phone, Mail,
  Lock, Globe, CheckCircle2
} from 'lucide-react';
import { salesPost } from '../services/apiClient';
import { AddressAutocomplete } from '../components/AddressAutocomplete';

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS  — Light Mode, Navy/Blue accent
═══════════════════════════════════════════════════════════════ */
const C = {
  // Page background
  pageBg:      '#f0f4ff',
  // Card / surface
  cardBg:      '#ffffff',
  cardShadow:  '0 2px 20px rgba(30,58,138,0.07), 0 1px 4px rgba(30,58,138,0.05)',
  cardShadowHover: '0 8px 32px rgba(30,58,138,0.12)',
  // Brand
  navy:        '#1a1a4e',
  blue:        '#1e3a8a',
  accent:      '#2563eb',
  accentLight: '#eff4ff',
  accentGlow:  'rgba(37,99,235,0.18)',
  accentBorder:'rgba(37,99,235,0.3)',
  // Text
  text900:     '#0f172a',
  text700:     '#1e293b',
  text500:     '#475569',
  text400:     '#64748b',
  text300:     '#94a3b8',
  // Borders
  border:      '#e2e8f0',
  borderFocus: '#2563eb',
  // Input
  inputBg:     '#f8faff',
  // States
  success:     '#059669',
  successBg:   '#ecfdf5',
  successBorder:'#6ee7b7',
  gold:        '#d97706',
  goldBg:      '#fffbeb',
  goldBorder:  '#fcd34d',
  danger:      '#dc2626',
  white:       '#ffffff',
};

const FONT_DISPLAY = "'Lato', 'Segoe UI', sans-serif";
const FONT_BODY    = "'Lato', 'Segoe UI', sans-serif";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;600;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Inputs ── */
  .pgos-input {
    width: 100%;
    background: ${C.inputBg};
    border: 1.5px solid ${C.border};
    border-radius: 10px;
    color: ${C.text900};
    font-family: ${FONT_BODY};
    font-size: 14.5px;
    font-weight: 400;
    padding: 12px 15px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
    appearance: none;
  }
  .pgos-input::placeholder { color: ${C.text300}; }
  .pgos-input:focus {
    border-color: ${C.borderFocus};
    background: #ffffff;
    box-shadow: 0 0 0 3px ${C.accentGlow};
  }
  .pgos-input option { background: #fff; color: ${C.text900}; }

  .pgos-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 40px;
    cursor: pointer;
  }

  /* ── Field group ── */
  .pgos-field-group { display: flex; flex-direction: column; gap: 6px; }
  .pgos-label {
    font-family: ${FONT_BODY};
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.65px;
    text-transform: uppercase;
    color: ${C.text500};
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* ── Card ── */
  .pgos-card {
    background: ${C.cardBg};
    border: 1px solid ${C.border};
    border-radius: 18px;
    padding: 28px 32px;
    box-shadow: ${C.cardShadow};
    transition: box-shadow 0.2s;
  }
  .pgos-card:hover { box-shadow: ${C.cardShadowHover}; }

  /* ── Section title ── */
  .pgos-section-title {
    font-family: ${FONT_BODY};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.1px;
    text-transform: uppercase;
    color: ${C.accent};
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 22px;
    padding-bottom: 14px;
    border-bottom: 1px solid ${C.border};
  }

  /* ── Grids ── */
  .pgos-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  .pgos-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  @media (max-width: 640px) {
    .pgos-grid-2 { grid-template-columns: 1fr; gap: 14px; }
    .pgos-grid-3 { grid-template-columns: 1fr; gap: 14px; }
    .pgos-card { padding: 20px; }
  }

  /* ── Buttons ── */
  .pgos-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 9px;
    background: linear-gradient(135deg, ${C.accent} 0%, ${C.blue} 100%);
    color: #fff;
    border: none;
    border-radius: 11px;
    font-family: ${FONT_BODY};
    font-size: 14px;
    font-weight: 600;
    padding: 13px 22px;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 16px rgba(37,99,235,0.3);
    letter-spacing: 0.2px;
    white-space: nowrap;
  }
  .pgos-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(37,99,235,0.4);
  }
  .pgos-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .pgos-btn-outline {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: ${C.accentLight};
    color: ${C.accent};
    border: 1.5px solid ${C.accentBorder};
    border-radius: 10px;
    font-family: ${FONT_BODY};
    font-size: 13px;
    font-weight: 600;
    padding: 10px 18px;
    cursor: pointer;
    transition: all 0.18s;
  }
  .pgos-btn-outline:hover { background: #dce9ff; box-shadow: 0 4px 14px ${C.accentGlow}; }

  .pgos-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: transparent;
    color: ${C.text500};
    border: 1.5px solid ${C.border};
    border-radius: 10px;
    font-family: ${FONT_BODY};
    font-size: 13px;
    font-weight: 500;
    padding: 10px 18px;
    cursor: pointer;
    transition: all 0.18s;
  }
  .pgos-btn-ghost:hover { border-color: ${C.accent}; color: ${C.accent}; background: ${C.accentLight}; }

  /* ── Amenity chips ── */
  .pgos-chip {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 14px;
    border-radius: 50px;
    border: 1.5px solid ${C.border};
    background: #f8fafc;
    color: ${C.text500};
    font-family: ${FONT_BODY};
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    user-select: none;
  }
  .pgos-chip:hover { border-color: ${C.accentBorder}; background: ${C.accentLight}; color: ${C.accent}; }
  .pgos-chip.active {
    border-color: ${C.accent};
    background: ${C.accentLight};
    color: ${C.accent};
    font-weight: 600;
  }

  /* ── PG block ── */
  .pgos-pg-block {
    background: #f8faff;
    border: 1px solid #dde8ff;
    border-radius: 16px;
    padding: 26px;
    margin-bottom: 18px;
    transition: box-shadow 0.2s;
  }
  .pgos-pg-block:hover { box-shadow: 0 6px 24px rgba(37,99,235,0.09); }

  /* ── Pricing column ── */
  .pgos-pricing-col {
    background: #fff;
    border: 1px solid ${C.border};
    border-radius: 14px;
    padding: 20px;
  }

  /* ── Upload box ── */
  .pgos-upload-box {
    border: 2px dashed #bfcfee;
    border-radius: 12px;
    background: #f5f8ff;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pgos-upload-box:hover { border-color: ${C.accent}; background: ${C.accentLight}; }

  /* ── Thumbnail ── */
  .pgos-thumb {
    position: relative; border-radius: 10px; overflow: hidden;
    border: 1px solid ${C.border};
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .pgos-thumb:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
  .pgos-thumb-remove {
    position: absolute; top: 5px; right: 5px;
    background: rgba(220,38,38,0.88);
    border: none; border-radius: 50%;
    width: 22px; height: 22px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: transform 0.15s;
  }
  .pgos-thumb-remove:hover { transform: scale(1.15); }

  /* ── Badges ── */
  .pgos-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 100px;
    font-family: ${FONT_BODY}; font-size: 11px; font-weight: 700;
    letter-spacing: 0.7px; text-transform: uppercase;
  }
  .pgos-badge-blue { background: ${C.accentLight}; color: ${C.accent}; border: 1px solid ${C.accentBorder}; }
  .pgos-badge-gold { background: ${C.goldBg}; color: ${C.gold}; border: 1px solid ${C.goldBorder}; }

  /* ── Number pill ── */
  .pgos-num-pill {
    width: 32px; height: 32px; min-width: 32px;
    background: linear-gradient(135deg, ${C.accent}, ${C.blue});
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: ${FONT_BODY}; font-size: 13px; font-weight: 700; color: #fff;
    box-shadow: 0 3px 10px rgba(37,99,235,0.35);
  }

  /* ── Divider ── */
  .pgos-divider { height: 1px; background: ${C.border}; margin: 22px 0; }

  /* ── Checkbox ── */
  .pgos-checkbox {
    width: 22px; height: 22px; min-width: 22px;
    border: 2px solid ${C.border}; border-radius: 6px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; background: #fff; margin-top: 2px;
  }
  .pgos-checkbox.checked { background: ${C.accent}; border-color: ${C.accent}; box-shadow: 0 0 0 3px ${C.accentGlow}; }

  /* ── Modal ── */
  .pgos-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: pgFadeIn 0.2s ease;
  }
  .pgos-modal {
    background: #fff;
    border: 1px solid ${C.border};
    border-radius: 22px;
    padding: 32px;
    max-width: 480px; width: 100%;
    max-height: 88vh; overflow-y: auto;
    box-shadow: 0 24px 80px rgba(15,23,42,0.2);
    animation: pgSlideUp 0.25s ease;
  }
  .pgos-cat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .pgos-cat-btn {
    padding: 16px 12px;
    border: 1.5px solid ${C.border};
    border-radius: 14px;
    background: #f8fafc;
    cursor: pointer; transition: all 0.2s;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    font-family: ${FONT_BODY};
  }
  .pgos-cat-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }

  /* ── Location success banner ── */
  .pgos-loc-success {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
    background: ${C.successBg};
    border: 1px solid ${C.successBorder};
    border-radius: 10px;
    color: ${C.success};
    font-family: ${FONT_BODY}; font-size: 13px; font-weight: 500;
    margin-top: 12px;
  }

  /* ── PG count selector ── */
  .pgos-count-btn {
    width: 50px; height: 50px;
    border-radius: 12px;
    border: 2px solid ${C.border};
    background: #f8fafc;
    color: ${C.text500};
    font-family: ${FONT_BODY}; font-size: 16px; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
  }
  .pgos-count-btn:hover { border-color: ${C.accentBorder}; background: ${C.accentLight}; color: ${C.accent}; }
  .pgos-count-btn.active {
    border-color: ${C.accent}; background: ${C.accent}; color: #fff;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
  }

  /* ── Animations ── */
  @keyframes pgFadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pgSlideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pgSpin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pgPulse   { 0%,100% { box-shadow: 0 4px 16px rgba(37,99,235,0.3); } 50% { box-shadow: 0 4px 28px rgba(37,99,235,0.55); } }
  .pgos-spin { animation: pgSpin 0.9s linear infinite; }
  .pgos-pulse { animation: pgPulse 2.5s infinite; }

  /* ── Header stripe ── */
  .pgos-topbar {
    background: #fff;
    border-bottom: 1px solid ${C.border};
    box-shadow: 0 1px 6px rgba(30,58,138,0.06);
    position: sticky; top: 0; z-index: 100;
  }

  /* ── Hero strip ── */
  .pgos-hero {
    background: linear-gradient(135deg, ${C.navy} 0%, ${C.blue} 60%, #1d4ed8 100%);
    position: relative; overflow: hidden;
  }
  .pgos-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%);
  }
  .pgos-hero-dots {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.4;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════════════ */
const AMENITIES = [
  { value: 'wifi',            label: 'WiFi',             icon: '📶' },
  { value: 'laundry',         label: 'Laundry',          icon: '👕' },
  { value: 'washing_machine', label: 'Washing Machine',  icon: '🧺' },
  { value: 'generator',       label: 'Generator',        icon: '⚡' },
  { value: 'food',            label: 'Meals Included',   icon: '🍽️' },
  { value: 'lift',            label: 'Lift',             icon: '🛗' },
  { value: 'parking',         label: 'Parking',          icon: '🅿️' },
  { value: 'ac',              label: 'AC',               icon: '❄️' },
];

const IMAGE_CATS = [
  { id: 'banner',   label: 'Banner',      emoji: '🖼️', desc: 'Main cover photo',  color: '#2563eb' },
  { id: 'hall',     label: 'Common Area', emoji: '🏠', desc: 'Living space',       color: '#7c3aed' },
  { id: 'room',     label: 'Room',        emoji: '🛏️', desc: 'Bedroom view',       color: '#0891b2' },
  { id: 'kitchen',  label: 'Kitchen',     emoji: '🍳', desc: 'Cooking area',       color: '#d97706' },
  { id: 'washroom', label: 'Washroom',    emoji: '🚿', desc: 'Bathroom',           color: '#059669' },
  { id: 'corridor', label: 'Corridor',    emoji: '🚪', desc: 'Hallway / Passage',  color: '#7c3aed' },
  { id: 'entrance', label: 'Entrance',    emoji: '🚧', desc: 'Gate / Entry',       color: '#dc2626' },
  { id: 'other',    label: 'Other',       emoji: '📷', desc: 'Miscellaneous',      color: '#64748b' },
];

const mkPg = () => ({
  name: '', type: 'colive', totalRooms: '',
  address: '', city: '', state: '', pincode: '', latitude: '', longitude: '',
  amenities: [] as string[],
  stayType: 'both',
  longTermRent:  { single: '', double: '', triple: '' },
  shortTermRent: { single: '', double: '', triple: '' },
  images: [] as { url: string; category: string }[],
  videos: [] as string[],
});

/* ═══════════════════════════════════════════════════════════════
   TINY HELPER COMPONENTS
═══════════════════════════════════════════════════════════════ */
function Field({ label, icon, children, span2 = false }: { label: string; icon?: React.ReactNode; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className="pgos-field-group" style={span2 ? { gridColumn: '1 / -1' } : {}}>
      <label className="pgos-label">{icon}{label}</label>
      {children}
    </div>
  );
}

function RupeeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.text400, fontSize: 14, fontWeight: 600, pointerEvents: 'none' }}>₹</span>
      <input className="pgos-input" style={{ paddingLeft: 26 }} type="number" placeholder="0" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export function PGOwnerSignup() {
  const navigate        = useNavigate();
  const [loading, setLoading]     = useState(false);
  const [ownerLoc, setOwnerLoc]   = useState<{ lat: string; lng: string } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [pgCount, setPgCount]     = useState(1);
  const [isMobile, setIsMobile]   = useState(false);
  const [owner, setOwner]         = useState({ name: '', phone: '', email: '', password: '', address: '', city: '', state: '', pincode: '' });
  const [pgList, setPgList]       = useState([mkPg()]);
  const [selPgIdx, setSelPgIdx]   = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pending, setPending]     = useState<File[] | null>(null);
  const [terms, setTerms]         = useState(false);
  const styleInjected             = useRef(false);

  useEffect(() => {
    if (!styleInjected.current) {
      const s = document.createElement('style');
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
      styleInjected.current = true;
    }
    const chk = () => setIsMobile(window.innerWidth < 640);
    chk();
    window.addEventListener('resize', chk);
    return () => window.removeEventListener('resize', chk);
  }, []);

  /* ── PG helpers ───────────────────────────────────────────── */
  const toggleAmenity = (pi: number, v: string) => {
    const u = [...pgList];
    u[pi].amenities = u[pi].amenities.includes(v)
      ? u[pi].amenities.filter(x => x !== v)
      : [...u[pi].amenities, v];
    setPgList(u);
  };
  const upd = (pi: number, f: string, v: any) => { const u = [...pgList]; (u[pi] as any)[f] = v; setPgList(u); };
  const updRent = (pi: number, t: 'longTermRent' | 'shortTermRent', k: string, v: string) => {
    const u = [...pgList]; u[pi][t] = { ...u[pi][t], [k]: v }; setPgList(u);
  };

  /* ── Image handling ──────────────────────────────────────── */
  const compress = (file: File): Promise<string> => new Promise(res => {
    const r = new FileReader();
    r.onload = e => {
      const img = document.createElement('img');
      img.onload = () => {
        const c = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > 1200) { h = Math.round(h * 1200 / w); w = 1200; }
        c.width = w; c.height = h;
        c.getContext('2d')?.drawImage(img, 0, 0, w, h);
        res(c.toDataURL('image/jpeg', 0.72));
      };
      img.src = e.target?.result as string;
    };
    r.readAsDataURL(file);
  });

  const onPickImages = (pi: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setSelPgIdx(pi); setPending(Array.from(e.target.files)); setShowModal(true);
  };
  const onCatSelect = async (cat: string) => {
    if (selPgIdx === null || !pending) return;
    setShowModal(false);
    const imgs = await Promise.all(pending.map(f => compress(f).then(url => ({ url, category: cat }))));
    const u = [...pgList]; u[selPgIdx].images = [...u[selPgIdx].images, ...imgs]; setPgList(u);
    setSelPgIdx(null); setPending(null);
  };
  const removeImg = (pi: number, ii: number) => { const u = [...pgList]; u[pi].images = u[pi].images.filter((_, i) => i !== ii); setPgList(u); };

  const onPickVideos = (pi: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    (async () => {
      const vids = await Promise.all(Array.from(e.target.files!).map(f => new Promise<string>(res => {
        const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f);
      })));
      const u = [...pgList]; u[pi].videos = [...u[pi].videos, ...vids]; setPgList(u);
    })();
  };
  const removeVid = (pi: number, vi: number) => { const u = [...pgList]; u[pi].videos = u[pi].videos.filter((_, i) => i !== vi); setPgList(u); };

  /* ── Geocode helpers ─────────────────────────────────────── */
  const reverseGeocode = async (lat: number, lng: number): Promise<{ address: string; city: string; state: string; pincode: string }> => {
    const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    const a    = data.address || {};
    return {
      address: [a.road, a.house_number].filter(Boolean).join(' ') || a.suburb || a.neighbourhood || a.village || '',
      city:    a.city || a.town || a.village || a.county || '',
      state:   a.state || '',
      pincode: a.postcode || '',
    };
  };

  /* ── Owner location ──────────────────────────────────────── */
  const getOwnerLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setOwnerLoc({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
        try {
          const geo = await reverseGeocode(lat, lng);
          // ✅ Prefill owner address fields from detected location
          setOwner(prev => ({
            ...prev,
            address: geo.address,
            city:    geo.city,
            state:   geo.state,
            pincode: geo.pincode,
          }));
        } catch {}
        setLocLoading(false);
      },
      err => { alert(err.message); setLocLoading(false); }
    );
  };

  /* ── PG GPS ──────────────────────────────────────────────── */
  const getPGLocation = (pi: number) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        upd(pi, 'latitude', lat.toFixed(6));
        upd(pi, 'longitude', lng.toFixed(6));
        // ✅ Also prefill PG address if empty
        if (!pgList[pi].address) {
          try {
            const geo = await reverseGeocode(lat, lng);
            upd(pi, 'address', geo.address);
            upd(pi, 'city',    geo.city);
            upd(pi, 'state',   geo.state);
            upd(pi, 'pincode', geo.pincode);
          } catch {}
        }
      },
      err => alert(err.message)
    );
  };

  /* ── PG count ────────────────────────────────────────────── */
  const handlePgCount = (n: number) => {
    setPgCount(n);
    setPgList(Array.from({ length: n }, (_, i) => pgList[i] || mkPg()));
  };

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async () => {
    // Owner details
    if (!owner.name || !owner.phone || !owner.email || !owner.password) { alert('Please fill all owner details'); return; }
    // Owner address — all mandatory
    if (!owner.address || !owner.city || !owner.state || !owner.pincode) { alert('Please fill all fields in Your Address'); return; }
    // Terms
    if (!terms) { alert('Please accept the Terms & Conditions'); return; }

    for (let i = 0; i < pgList.length; i++) {
      const p = pgList[i];
      // PG basic fields — all mandatory
      if (!p.name || !p.type || !p.totalRooms || !p.address || !p.city || !p.state || !p.pincode) {
        alert(`Fill all required fields for PG ${i + 1}`); return;
      }
      // Amenities
      if (!Array.isArray(p.amenities) || p.amenities.length === 0) {
        alert(`Select at least one amenity for PG ${i + 1}`); return;
      }
      // Photos
      if (!Array.isArray(p.images) || p.images.length < 2) {
        alert(`Upload at least 2 property photos for PG ${i + 1}`); return;
      }

      // Pricing — all 3 sharing values required for any selected stay type
      const stay = p.stayType || 'both';
      if (stay === 'long_term' || stay === 'both') {
        if (!p.longTermRent?.single || !p.longTermRent?.double || !p.longTermRent?.triple) {
          alert(`Enter Monthly rent for all 3 sharing options for PG ${i + 1}`); return;
        }
      }
      if (stay === 'short_term' || stay === 'both') {
        if (!p.shortTermRent?.single || !p.shortTermRent?.double || !p.shortTermRent?.triple) {
          alert(`Enter Daily rent for all 3 sharing options for PG ${i + 1}`); return;
        }
      }
    }

    setLoading(true);
    try {
      await salesPost('/pg-owner/public-signup', {
        ...owner, latitude: ownerLoc?.lat, longitude: ownerLoc?.lng,
        pgs: pgList, termsAccepted: true, termsAcceptedAt: new Date().toISOString(),
      });
      alert('Registration submitted! Our team will contact you shortly.');
      navigate('/');
    } catch (err: any) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.message || 'Submission error. Please try again.');
    } finally { setLoading(false); }
  };

  const catColor = (id: string) => IMAGE_CATS.find(c => c.id === id)?.color || C.accent;

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: C.pageBg, fontFamily: FONT_BODY }}>

      {/* ── Top bar ───────────────────────────────────────────── */}
      <div className="pgos-topbar">
        <div style={{ maxWidth: 960, margin: '0 auto', padding: isMobile ? '14px 20px' : '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isMobile ? 'auto' : 66 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${C.accentGlow}` }}>
              <Building2 size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: C.navy, lineHeight: 1.1 }}>ManageYourPG</div>
              <div style={{ fontSize: 10, color: C.text400, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Property Management Platform</div>
            </div>
          </div>
          <span className="pgos-badge pgos-badge-gold"><Star size={9} fill="currentColor" /> Verified Partner</span>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="pgos-hero" style={{ padding: isMobile ? '36px 20px 40px' : '52px 40px 56px' }}>
        <div className="pgos-hero-dots" />
        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="pgos-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', marginBottom: 18, display: 'inline-flex' }}>
            <Zap size={9} fill="currentColor" /> Manage Your PG in a Flash
          </span>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: isMobile ? 28 : 42, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 14, letterSpacing: '-0.5px' }}>
           Sign Up as a<br />
            <span style={{ color: '#93c5fd' }}> PG Owner</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', maxWidth: 480, lineHeight: 1.7, marginBottom: 28 }}>
           Complete your registration and start managing bookings, tenants, and payments in one place.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {[ ['Instant Onboarding', <CheckCircle2 size={13} />], ['Free Verified Listings', <Shield size={13} />],['getyourstay.in', <Star size={13} />]].map(([text, icon]) => (
              <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                <span style={{ color: '#93c5fd' }}>{icon as React.ReactNode}</span> {text as string}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form body ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: isMobile ? '28px 16px 60px' : '36px 40px 60px' }}>

        {/* ━━━━ SECTION 1 — Owner Info ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="pgos-num-pill">1</div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: C.navy }}>Owner Information</h2>
        </div>

        <div className="pgos-card" style={{ marginBottom: 18 }}>
          <div className="pgos-section-title"><User size={13} /> Personal Details</div>
          <div className="pgos-grid-2">
            <Field label="Full Name *" icon={<User size={10} />}>
              <input className="pgos-input" placeholder="Your full legal name" value={owner.name} onChange={e => setOwner({ ...owner, name: e.target.value })} />
            </Field>
            <Field label="Phone Number *" icon={<Phone size={10} />}>
              <input className="pgos-input" type="tel" placeholder="10-digit mobile number" value={owner.phone} onChange={e => setOwner({ ...owner, phone: e.target.value })} />
            </Field>
            <Field label="Email Address *" icon={<Mail size={10} />}>
              <input className="pgos-input" type="email" placeholder="owner@example.com" value={owner.email} onChange={e => setOwner({ ...owner, email: e.target.value })} />
            </Field>
            <Field label="Password *" icon={<Lock size={10} />}>
              <input className="pgos-input" type="password" placeholder="Create a secure password" value={owner.password} onChange={e => setOwner({ ...owner, password: e.target.value })} />
            </Field>
          </div>
        </div>

        {/* ━━━━ Owner Address ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="pgos-card" style={{ marginBottom: 32 }}>
          <div className="pgos-section-title"><MapPin size={13} /> Your Address</div>

          {/* Detect location button */}
          <button
            className="pgos-btn-outline"
            style={{ marginBottom: 16, width: '100%' }}
            onClick={getOwnerLocation}
            disabled={locLoading}
          >
            {locLoading ? <Loader size={15} className="pgos-spin" /> : <MapPin size={15} />}
            {locLoading ? 'Detecting location…' : 'Auto-detect My Location & Fill Address'}
          </button>

          {ownerLoc && (
            <div className="pgos-loc-success">
              <CheckCircle2 size={15} />
              Location detected — address fields have been prefilled below
            </div>
          )}

          <div style={{ height: 18 }} />
          <div className="pgos-grid-2">
            <Field label="Street Address" icon={<Globe size={10} />} span2>
              <AddressAutocomplete
                value={owner.address}
                onChange={v => setOwner({ ...owner, address: v })}
                onSelect={d => setOwner(p => ({ ...p, address: d.address, city: d.city, state: d.state, pincode: d.pincode }))}
                placeholder="Type to search or use auto-detect above"
                inputStyle={{ width: '100%', background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text900, fontFamily: FONT_BODY, fontSize: 14.5, padding: '12px 15px', outline: 'none' }}
              />
            </Field>
            <Field label="City *">
              <input className="pgos-input" placeholder="e.g. Bengaluru" value={owner.city} onChange={e => setOwner({ ...owner, city: e.target.value })} />
            </Field>
            <Field label="State *">
              <input className="pgos-input" placeholder="e.g. Karnataka" value={owner.state} onChange={e => setOwner({ ...owner, state: e.target.value })} />
            </Field>
            <Field label="Pincode *">
              <input className="pgos-input" placeholder="560001" value={owner.pincode} onChange={e => setOwner({ ...owner, pincode: e.target.value })} />
            </Field>
          </div>
        </div>

        {/* ━━━━ SECTION 2 — PG Properties ━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="pgos-num-pill">2</div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: C.navy }}>PG Properties</h2>
        </div>

        {/* PG count */}
        <div className="pgos-card" style={{ marginBottom: 18 }}>
          <div className="pgos-section-title"><Building2 size={13} /> How Many PGs Are You Listing?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} className={`pgos-count-btn${pgCount === n ? ' active' : ''}`} onClick={() => handlePgCount(n)}>{n}</button>
            ))}
          </div>
        </div>

        {/* Each PG */}
        {pgList.map((pg, pi) => (
          <div key={pi} className="pgos-pg-block">

            {/* PG header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
              <div className="pgos-num-pill">{pi + 1}</div>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600, color: C.navy }}>
                  {pg.name || `PG Property ${pi + 1}`}
                </div>
                <div style={{ fontSize: 12, color: C.text400, marginTop: 2 }}>
                  {pg.city ? `${pg.city}${pg.state ? ', ' + pg.state : ''}` : 'Enter details below'}
                </div>
              </div>
            </div>

            {/* Basic fields */}
            <div className="pgos-grid-2" style={{ marginBottom: 22 }}>
              <Field label="PG Name *">
                <input className="pgos-input" placeholder="e.g. Sunrise Residency" value={pg.name} onChange={e => upd(pi, 'name', e.target.value)} />
              </Field>
              <Field label="PG Type *">
                <select className="pgos-input pgos-select" value={pg.type} onChange={e => upd(pi, 'type', e.target.value)}>
                  <option value="">Select type</option>
                  <option value="male">Male PG</option>
                  <option value="female">Female PG</option>
                  <option value="colive">Co-Living (Mixed)</option>
                </select>
              </Field>
              <Field label="Total Rooms *">
                <input className="pgos-input" type="number" placeholder="e.g. 20" value={pg.totalRooms} onChange={e => upd(pi, 'totalRooms', e.target.value)} />
              </Field>
            </div>

            {/* PG address */}
            <div className="pgos-grid-2" style={{ marginBottom: 16 }}>
              {/* GPS pin button */}
              <div style={{ gridColumn: '1 / -1' }}>
                <button
                  onClick={() => getPGLocation(pi)}
                  style={pg.latitude ? {
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 18px', background: C.successBg,
                    border: `1px solid ${C.successBorder}`, borderRadius: 10,
                    color: C.success, fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    marginBottom: 16,
                  } : { marginBottom: 16 }}
                  className={pg.latitude ? '' : 'pgos-btn-outline'}
                >
                  {pg.latitude ? <><CheckCircle2 size={14} /> GPS Pinned — {pg.latitude}</> : <><MapPin size={14} /> Pin PG Location (auto-fills address)</>}
                </button>
              </div>

              <Field label="PG Street Address *" span2>
                <AddressAutocomplete
                  value={pg.address}
                  onChange={v => upd(pi, 'address', v)}
                  onSelect={d => { upd(pi,'address',d.address); upd(pi,'city',d.city); upd(pi,'state',d.state); upd(pi,'pincode',d.pincode); upd(pi,'latitude',d.latitude); upd(pi,'longitude',d.longitude); }}
                  placeholder="Type PG address or pin location above"
                  inputStyle={{ width: '100%', background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text900, fontFamily: FONT_BODY, fontSize: 14.5, padding: '12px 15px', outline: 'none' }}
                />
              </Field>
              <Field label="City *">
                <input className="pgos-input" placeholder="City" value={pg.city} onChange={e => upd(pi, 'city', e.target.value)} />
              </Field>
              <Field label="State *">
                <input className="pgos-input" placeholder="State" value={pg.state} onChange={e => upd(pi, 'state', e.target.value)} />
              </Field>
              <Field label="Pincode *">
                <input className="pgos-input" placeholder="Pincode" value={pg.pincode} onChange={e => upd(pi, 'pincode', e.target.value)} />
              </Field>
            </div>

            <div className="pgos-divider" />

            {/* Pricing */}
            <div style={{ marginBottom: 22 }}>
              <div className="pgos-section-title"><DollarSign size={13} /> Pricing &amp; Stay Options</div>
              <div style={{ marginBottom: 18 }}>
                <Field label="Stay Type">
                  <select className="pgos-input pgos-select" value={pg.stayType || 'both'} onChange={e => upd(pi, 'stayType', e.target.value)}>
                    <option value="long_term">Monthly Only (Long-Term)</option>
                    <option value="short_term">Daily Only (Short-Term)</option>
                    <option value="both">Both Monthly &amp; Daily</option>
                  </select>
                </Field>
              </div>
              <div className="pgos-grid-2">
                {(pg.stayType === 'long_term' || pg.stayType === 'both') && (
                  <div className="pgos-pricing-col">
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: C.accent, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, background: C.accent, borderRadius: '50%', display: 'inline-block' }} />
                      Monthly Rent
                    </div>
                    {(['single', 'double', 'triple'] as const).map(k => (
                      <div key={k} style={{ marginBottom: 12 }}>
                        <Field label={`${k.charAt(0).toUpperCase() + k.slice(1)} Sharing`}>
                          <RupeeInput value={pg.longTermRent[k]} onChange={v => updRent(pi, 'longTermRent', k, v)} />
                        </Field>
                      </div>
                    ))}
                  </div>
                )}
                {(pg.stayType === 'short_term' || pg.stayType === 'both') && (
                  <div className="pgos-pricing-col" style={{ borderColor: C.goldBorder, background: C.goldBg }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: C.gold, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, background: C.gold, borderRadius: '50%', display: 'inline-block' }} />
                      Daily Rent
                    </div>
                    {(['single', 'double', 'triple'] as const).map(k => (
                      <div key={k} style={{ marginBottom: 12 }}>
                        <Field label={`${k.charAt(0).toUpperCase() + k.slice(1)} Sharing`}>
                          <RupeeInput value={pg.shortTermRent[k]} onChange={v => updRent(pi, 'shortTermRent', k, v)} />
                        </Field>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pgos-divider" />

            {/* Amenities */}
            <div style={{ marginBottom: 22 }}>
              <div className="pgos-section-title"><Zap size={13} /> Amenities <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11, fontWeight: 500, color: C.text400, marginLeft: 4 }}>(select at least 1)</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AMENITIES.map(a => (
                  <div
                    key={a.value}
                    role="button"
                    tabIndex={0}
                    className={`pgos-chip${pg.amenities.includes(a.value) ? ' active' : ''}`}
                    onClick={() => toggleAmenity(pi, a.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAmenity(pi, a.value); } }}
                  >
                    <span style={{ fontSize: 14 }}>{a.icon}</span>
                    {a.label}
                    {pg.amenities.includes(a.value) && <Check size={11} strokeWidth={3} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="pgos-divider" />

            {/* Photos */}
            <div style={{ marginBottom: 22 }}>
              <div className="pgos-section-title"><Camera size={13} /> Property Photos <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11, fontWeight: 500, color: C.text400, marginLeft: 4 }}>(at least 2 required)</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {pg.images.map((img, ii) => (
                  <div key={ii} className="pgos-thumb" style={{ width: 90, height: 90 }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: catColor(img.category), padding: '3px 6px', fontSize: 9, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'center' }}>
                      {img.category}
                    </div>
                    <button className="pgos-thumb-remove" onClick={() => removeImg(pi, ii)}><X size={11} color="#fff" /></button>
                  </div>
                ))}
                <label className="pgos-upload-box" style={{ width: 90, height: 90, gap: 5 }}>
                  <Camera size={20} color={C.accent} />
                  <span style={{ fontSize: 10, color: C.text400 }}>Add Photo</span>
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => onPickImages(pi, e)} />
                </label>
              </div>
            </div>

            {/* Videos */}
            <div>
              <div className="pgos-section-title">
                <Video size={13} /> Video Tour
                <span style={{ fontSize: 11, color: C.text400, fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 4 }}>(optional)</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {pg.videos.map((vid, vi) => (
                  <div key={vi} className="pgos-thumb" style={{ width: 130, height: 88 }}>
                    <video src={vid} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button className="pgos-thumb-remove" onClick={() => removeVid(pi, vi)}><X size={11} color="#fff" /></button>
                  </div>
                ))}
                <label className="pgos-upload-box" style={{ width: 130, height: 88, gap: 5 }}>
                  <Video size={20} color={C.accent} />
                  <span style={{ fontSize: 10, color: C.text400 }}>Add Video</span>
                  <input type="file" accept="video/*" multiple style={{ display: 'none' }} onChange={e => onPickVideos(pi, e)} />
                </label>
              </div>
            </div>
          </div>
        ))}

        {/* ━━━━ SECTION 3 — Review & Submit ━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="pgos-num-pill">3</div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: C.navy }}>Review &amp; Submit</h2>
        </div>

        <div className="pgos-card">
          {/* Terms */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 28, padding: '18px 20px', background: '#f8faff', border: `1px solid #dde8ff`, borderRadius: 12 }}>
            <div className={`pgos-checkbox${terms ? ' checked' : ''}`} onClick={() => setTerms(!terms)}>
              {terms && <Check size={13} color="#fff" strokeWidth={3} />}
            </div>
            <p style={{ fontSize: 14, color: C.text500, lineHeight: 1.7, cursor: 'pointer' }} onClick={() => setTerms(!terms)}>
              I confirm all information provided is accurate and I agree to the{' '}
              <a href="https://www.manageyourpg.com/terms" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: C.accent, fontWeight: 600, textDecoration: 'none', borderBottom: `1px solid ${C.accentBorder}` }}>
                Terms &amp; Conditions
              </a>{' '}and{' '}
              <a href="https://www.manageyourpg.com/privacy" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: C.accent, fontWeight: 600, textDecoration: 'none', borderBottom: `1px solid ${C.accentBorder}` }}>
                Privacy Policy
              </a>.
            </p>
          </div>

          {/* Submit */}
          <button
            className={`pgos-btn-primary${!loading && terms ? ' pgos-pulse' : ''}`}
            style={{ width: '100%', padding: '16px 24px', fontSize: 16, borderRadius: 13 }}
            onClick={handleSubmit}
            disabled={loading || !terms}
          >
            {loading
              ? <><Loader size={18} className="pgos-spin" /> Processing Registration…</>
              : <><CheckCircle2 size={18} /> Submit Registration <ChevronRight size={16} /></>
            }
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: C.text400, marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Shield size={11} /> Your data is encrypted. Our team will review and contact you within 24 hours.
          </p>
        </div>
      </div>

      {/* ── Category Modal ─────────────────────────────────────── */}
      {showModal && (
        <div className="pgos-modal-overlay">
          <div className="pgos-modal">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, background: C.accentLight, border: `1px solid ${C.accentBorder}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Camera size={24} color={C.accent} />
              </div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Categorize Photos</h3>
              <p style={{ fontSize: 13, color: C.text500 }}>Which area do these {pending?.length} photo(s) show?</p>
            </div>
            <div className="pgos-cat-grid">
              {IMAGE_CATS.map(cat => (
                <button
                  key={cat.id}
                  className="pgos-cat-btn"
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = cat.color; (e.currentTarget as HTMLButtonElement).style.background = '#f0f7ff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'; }}
                  onClick={() => onCatSelect(cat.id)}
                >
                  <span style={{ fontSize: 26 }}>{cat.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text900 }}>{cat.label}</span>
                  <span style={{ fontSize: 11, color: C.text400 }}>{cat.desc}</span>
                </button>
              ))}
            </div>
            <button className="pgos-btn-ghost" style={{ width: '100%', marginTop: 14 }}
              onClick={() => { setShowModal(false); setSelPgIdx(null); setPending(null); }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}