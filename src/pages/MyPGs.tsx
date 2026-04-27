import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { get, post } from '../services/apiClient';
import {
  Loader2, Building2, MapPin, QrCode, Share2, Copy, Check, Phone,
  AlertCircle, Plus, CheckCircle, Download, MessageCircle, X
} from 'lucide-react';

interface PG {
  _id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  area?: string;
  totalRooms: number;
  qrCode?: string;
  checkin_url?: string;
  isVerified?: boolean;
  longTermRent?: { single: number; double: number; triple: number };
  shortTermRent?: { single: number; double: number; triple: number };
  ownerId?: { name: string; phone: string; email: string };
}

// ─── Brand colours (exact from poster) ───────────────────────────────────────
const NAVY   = '#1e3054';   // dark navy header / footer
const ORANGE = '#f06520';   // orange accent – pill, badge, circles, footer bar
const BODY   = '#eef2f7';   // light blue-white body background
const STEP_BG = '#e8eef6';  // step row fill

// ─── Helpers ─────────────────────────────────────────────────────────────────
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number, fill: string, stroke?: string, strokeW = 1
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = strokeW; ctx.stroke(); }
}

// ─── Banner Generator ─────────────────────────────────────────────────────────
async function generateBannerCanvas(pg: PG): Promise<HTMLCanvasElement> {
  // ── Canvas setup (A4 @ 2× for crispness) ──
  const W = 595, H = 842;
  const canvas = document.createElement('canvas');
  canvas.width  = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2);

  // ════════════════════════════════════════════
  // ZONE 1 – NAVY HEADER  (0 → 240)
  // ════════════════════════════════════════════
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, 240);

  // Decorative navy circles (darker, semi-transparent)
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#142240';
  ctx.beginPath(); ctx.arc(W - 30, 30, 80, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(30, 195, 65, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Orange pill – PG Name (bold, large)
  const pgName = pg.name || 'Your PG Name';
  ctx.font = 'bold 22px Helvetica, Arial';
  const pillTextW = ctx.measureText(pgName).width;
  const pillW = pillTextW + 56, pillH = 38, pillX = (W - pillW) / 2, pillY = 22;
  roundRect(ctx, pillX, pillY, pillW, pillH, 19, ORANGE);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 22px Helvetica, Arial';   // bold + larger
  ctx.fillText(pgName, W / 2, pillY + 26);

  // GetYourStay wordmark
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px Helvetica, Arial';
  ctx.fillText('GetYourStay', W / 2, 104);

  // Tagline
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '13px Helvetica, Arial';
  ctx.fillText('Smart PG Management Platform', W / 2, 122);

  // Orange underline below tagline
  const ulW = 120;
  ctx.fillStyle = ORANGE;
  ctx.fillRect((W - ulW) / 2, 130, ulW, 3);

  // Welcome heading
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Helvetica, Arial';
  ctx.fillText('Welcome, Tenant!', W / 2, 175);

  // Subtitle
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '14px Helvetica, Arial';
  ctx.fillText('Complete your check-in by scanning the QR code below', W / 2, 198);

  // ════════════════════════════════════════════
  // ZONE 2 – LIGHT BODY  (240 → 748)
  // ════════════════════════════════════════════
  ctx.fillStyle = BODY;
  ctx.fillRect(0, 240, W, 748 - 240);

  // ── "SCAN TO CHECK IN" orange badge ──
  const badgeW = 178, badgeH = 32;
  const badgeX = (W - badgeW) / 2, badgeY = 225; // straddles header/body border
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 16, ORANGE);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px Helvetica, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN TO CHECK IN', W / 2, badgeY + 21);

  // ── QR white card ──
  const cardW = 260, cardX = (W - cardW) / 2, cardY = 268;
  const qrSize = 200;
  const cardPad = 20;
  const cardH = cardPad + qrSize + cardPad + 20 + cardPad; // top + qr + gap + caption + bottom

  roundRect(ctx, cardX, cardY, cardW, cardH, 14, '#ffffff', '#e0e7f0', 1);

  // QR code image
  const qrX = (W - qrSize) / 2;
  const qrY = cardY + cardPad;

  if (pg.qrCode) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload  = () => { ctx.drawImage(img, qrX, qrY, qrSize, qrSize); resolve(); };
      img.onerror = () => {
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        ctx.fillStyle = '#9ca3af'; ctx.font = '13px Helvetica, Arial';
        ctx.fillText('QR Code unavailable', W / 2, qrY + qrSize / 2);
        resolve();
      };
      img.src = pg.qrCode!;
    });
  } else {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    ctx.fillStyle = '#9ca3af'; ctx.font = '13px Helvetica, Arial';
    ctx.fillText('QR Code unavailable', W / 2, qrY + qrSize / 2);
  }

  // Caption below QR (inside card) – show check-in URL
  const captionY = qrY + qrSize + 14;
  const url = pg.checkin_url || 'www.getyourstay.in';
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px Helvetica, Arial';

  // ── Step rows ──
  const steps = [
    'Open your camera or any QR scanner app',
    'Point it at the QR code above',
    'Tap the check-in link that appears',
    'Fill in your details & complete check-in \u2713',
  ];
  const stepStartY = cardY + cardH + 20;
  const stepH = 37, stepGap = 10;
  const stepPad = 28;

  steps.forEach((text, i) => {
    const sy = stepStartY + i * (stepH + stepGap);
    roundRect(ctx, stepPad, sy, W - stepPad * 2, stepH, 10, STEP_BG, '#d5dff0', 0.8);

    // Orange circle number
    const cx = stepPad + 20, cy = sy + stepH / 2;
    ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2);
    ctx.fillStyle = ORANGE; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px Helvetica, Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), cx, cy + 4);

    // Step text
    ctx.fillStyle = '#374151'; ctx.font = '13px Helvetica, Arial';
    ctx.textAlign = 'left';
    ctx.fillText(text, stepPad + 42, sy + stepH / 2 + 5);
  });

  // ════════════════════════════════════════════
  // ZONE 3 – NAVY FOOTER  (748 → 842)
  // ════════════════════════════════════════════
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 748, W, H - 748);

  // Orange top bar on footer
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 748, W, 4);

  // Help text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Helvetica, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Need help?  Visit  www.getyourstay.in', W / 2, 778);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '11px Helvetica, Arial';
  ctx.fillText('Powered by GetYourStay', W / 2, 800);

  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.font = '10px Helvetica, Arial';
  ctx.fillText('A product of Codex Tech Innovations & Consultants LLP', W / 2, 818);

  return canvas;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MyPGs() {
  const [pgs, setPgs] = useState<PG[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);
  const [copied, setCopied] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [bannerDataUrl, setBannerDataUrl] = useState<string | null>(null);
  const [generatingBanner, setGeneratingBanner] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  useEffect(() => { fetchMyPGs(); }, []);

  const fetchMyPGs = async () => {
    try {
      const response = await get<any[]>('/salesperson/my-pgs');
      setPgs(response || []);
    } catch (error) {
      console.error('Error fetching PGs:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async (url: string | undefined) => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Failed to copy:', err); }
  };

  const shareQR = async (pg: PG) => {
    const url = pg.checkin_url || '';
    if (navigator.share) {
      try {
        await navigator.share({ title: `${pg.name} - Check-in QR`, text: `Scan QR or visit: ${url}`, url });
      } catch { /* cancelled */ }
    } else {
      copyLink(url);
    }
  };

  const completeOnboarding = async (pgId: string) => {
    if (!confirm('Complete onboarding? This will verify the PG and send login credentials to the owner.')) return;
    setCompletingId(pgId);
    try {
      await post('/salesperson/complete-onboarding', { pgId });
      alert('Onboarding completed! Credentials sent to owner.');
      fetchMyPGs();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setCompletingId(null);
    }
  };

  // ── Open banner modal, generate canvas ──
  const openBanner = async (pg: PG) => {
    setSelectedPG(pg);
    setShowBannerModal(true);
    setBannerDataUrl(null);
    setGeneratingBanner(true);
    try {
      const canvas = await generateBannerCanvas(pg);
      setBannerDataUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Banner generation failed:', err);
    } finally {
      setGeneratingBanner(false);
    }
  };

  // ── Download banner as PDF (via print dialog) ──
  const downloadAsPDF = () => {
    if (!bannerDataUrl || !selectedPG) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedPG.name} – Check-in Banner</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; height: auto; display: block; }
            @page { size: A4; margin: 0; }
            @media print { body { margin: 0; } img { width: 100%; height: 100vh; object-fit: contain; } }
          </style>
        </head>
        <body>
          <img src="${bannerDataUrl}" />
          <script>window.onload = () => { window.print(); }<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ── Download banner as PNG ──
  const downloadAsPNG = () => {
    if (!bannerDataUrl || !selectedPG) return;
    const a = document.createElement('a');
    a.href = bannerDataUrl;
    a.download = `${selectedPG.name.replace(/\s+/g, '_')}_checkin_banner.png`;
    a.click();
  };

  // ── Share to WhatsApp ──
  const shareWhatsApp = async () => {
    if (!selectedPG) return;
    const text = `🏠 *${selectedPG.name}* – Check-in\n\nScan the QR code or click below to complete your check-in:\n${selectedPG.checkin_url || ''}\n\n_Powered by GetYourStay_`;
    const encoded = encodeURIComponent(text);

    // Try sharing the banner image via Web Share API first
    if (bannerDataUrl && navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(bannerDataUrl)).blob();
        const file = new File([blob], `${selectedPG.name}_banner.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `${selectedPG.name} – Check-in`, text });
          return;
        }
      } catch { /* fall through */ }
    }

    // Fallback: open WhatsApp with text + URL
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const getPgTypeColor = (type: string) => {
    switch (type) {
      case 'male': return { bg: '#dbeafe', text: '#1d4ed8' };
      case 'female': return { bg: '#fce7f3', text: '#be185d' };
      case 'colive': return { bg: '#d1fae5', text: '#059669' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const formatPrice = (price?: number) => price ? `₹${price.toLocaleString()}` : '-';

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>My Added PGs</h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>Approved PGs with QR codes</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin" size={32} color="#667eea" />
        </div>
      ) : pgs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <Building2 size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '18px', color: '#6b7280' }}>No PGs added yet</p>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>Add PG owners to see their PGs here</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {pgs.map(pg => {
            const typeStyle = getPgTypeColor(pg.type);
            const isApproved = pg.isVerified;
            return (
              <div key={pg._id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', opacity: isApproved ? 1 : 0.7 }}>
                {/* Header */}
                <div style={{ height: '160px', background: isApproved ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {isApproved && pg.qrCode ? (
                    <img src={pg.qrCode} alt="QR Code" style={{ width: '120px', height: '120px', background: 'white', padding: '8px', borderRadius: '8px' }} />
                  ) : !isApproved ? (
                    <AlertCircle size={48} color="white" />
                  ) : (
                    <QrCode size={48} color="white" />
                  )}
                  <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, ...typeStyle }}>{pg.type}</span>
                  <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: isApproved ? '#22c55e' : '#f59e0b', color: 'white' }}>{isApproved ? 'Approved' : 'Pending'}</span>
                </div>

                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>{pg.name}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>{pg.address}, {pg.city}</p>

                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '13px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building2 size={14} /><span>{pg.totalRooms} Rooms</span></div>
                    {pg.area && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /><span>{pg.area}</span></div>}
                  </div>

                  <div style={{ marginBottom: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Long Term (Monthly)</p>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                      <span>Single: <strong>{formatPrice(pg.longTermRent?.single || 0)}</strong></span>
                      <span>Double: <strong>{formatPrice(pg.longTermRent?.double || 0)}</strong></span>
                    </div>
                  </div>

                  {pg.ownerId && (
                    <div style={{ marginBottom: '12px', fontSize: '13px', color: '#6b7280' }}>
                      <p style={{ fontWeight: 500, marginBottom: '4px' }}>Owner: {pg.ownerId.name}</p>
                      <a href={`tel:${pg.ownerId.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#667eea' }}>
                        <Phone size={12} /> {pg.ownerId.phone}
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => copyLink(pg.checkin_url || '')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button onClick={() => shareQR(pg)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                      <Share2 size={14} /> Share QR
                    </button>
                    {isApproved ? (
                      <Link to={`/add-rooms/${pg._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
                        <Plus size={14} /> Add Rooms
                      </Link>
                    ) : (
                      <button onClick={() => completeOnboarding(pg._id)} disabled={completingId === pg._id} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: completingId === pg._id ? 'not-allowed' : 'pointer', opacity: completingId === pg._id ? 0.7 : 1 }}>
                        {completingId === pg._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        Complete Onboarding
                      </button>
                    )}
                    {/* Banner button */}
                    <button onClick={() => openBanner(pg)} title="Generate Check-in Banner" style={{ padding: '10px 14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                      <QrCode size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Banner Modal ────────────────────────────────── */}
      {showBannerModal && selectedPG && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}
          onClick={() => setShowBannerModal(false)}
        >
          <div
            style={{ background: 'white', borderRadius: '16px', maxWidth: '420px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>Check-in Banner</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{selectedPG.name}</p>
              </div>
              <button onClick={() => setShowBannerModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Banner Preview */}
            <div style={{ padding: '16px', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '320px' }}>
              {generatingBanner ? (
                <div style={{ textAlign: 'center' }}>
                  <Loader2 className="animate-spin" size={32} color="#667eea" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Generating banner…</p>
                </div>
              ) : bannerDataUrl ? (
                <img
                  src={bannerDataUrl}
                  alt="Check-in Banner Preview"
                  style={{ width: '100%', maxWidth: '280px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                />
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>Failed to generate banner</p>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Row 1 – Download options */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={downloadAsPNG}
                  disabled={!bannerDataUrl}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', background: !bannerDataUrl ? '#e5e7eb' : '#f3f4f6', color: !bannerDataUrl ? '#9ca3af' : '#374151', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: bannerDataUrl ? 'pointer' : 'not-allowed' }}
                >
                  <Download size={15} />
                  Download PNG
                </button>
                <button
                  onClick={downloadAsPDF}
                  disabled={!bannerDataUrl}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', background: !bannerDataUrl ? '#e5e7eb' : '#1f2937', color: !bannerDataUrl ? '#9ca3af' : 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: bannerDataUrl ? 'pointer' : 'not-allowed' }}
                >
                  <Download size={15} />
                  Save as PDF
                </button>
              </div>

              {/* Row 2 – WhatsApp share */}
              <button
                onClick={shareWhatsApp}
                disabled={!bannerDataUrl}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: !bannerDataUrl ? '#e5e7eb' : '#25D366', color: !bannerDataUrl ? '#9ca3af' : 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: bannerDataUrl ? 'pointer' : 'not-allowed' }}
              >
                <MessageCircle size={18} />
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}