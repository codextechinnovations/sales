import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { get, post } from '../services/apiClient';
import { Loader2, Building2, MapPin, QrCode, Share2, Copy, Check, Phone, Mail, AlertCircle, Plus, CheckCircle } from 'lucide-react';

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
  longTermRent?: {
    single: number;
    double: number;
    triple: number;
  };
  shortTermRent?: {
    single: number;
    double: number;
    triple: number;
  };
  ownerId?: {
    name: string;
    phone: string;
    email: string;
  };
}

export function MyPGs() {
  const [pgs, setPgs] = useState<PG[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);
  const [copied, setCopied] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyPGs();
  }, []);

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
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareQR = async (pg: PG) => {
    const url = pg.checkin_url || '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pg.name} - Check-in QR`,
          text: `Scan QR or visit: ${url}`,
          url: url
        });
      } catch (err) {
        console.log('Share cancelled');
      }
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

  const getPgTypeColor = (type: string) => {
    switch (type) {
      case 'male': return { bg: '#dbeafe', text: '#1d4ed8' };
      case 'female': return { bg: '#fce7f3', text: '#be185d' };
      case 'colive': return { bg: '#d1fae5', text: '#059669' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const formatPrice = (price?: number) => {
    return price ? `₹${price.toLocaleString()}` : '-';
  };

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
              <div
                key={pg._id}
                style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', opacity: isApproved ? 1 : 0.7 }}
              >
                {/* PG Image or QR Placeholder */}
                <div style={{ height: '160px', background: isApproved ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {isApproved && pg.qrCode ? (
                    <img src={pg.qrCode} alt="QR Code" style={{ width: '120px', height: '120px', background: 'white', padding: '8px', borderRadius: '8px' }} />
                  ) : !isApproved ? (
                    <AlertCircle size={48} color="white" />
                  ) : (
                    <QrCode size={48} color="white" />
                  )}
                  <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, ...typeStyle }}>
                    {pg.type}
                  </span>
                  <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: isApproved ? '#22c55e' : '#f59e0b', color: 'white' }}>
                    {isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>{pg.name}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>{pg.address}, {pg.city}</p>

                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '13px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={14} />
                      <span>{pg.totalRooms} Rooms</span>
                    </div>
                    {pg.area && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} />
                        <span>{pg.area}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div style={{ marginBottom: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Long Term (Monthly)</p>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                      <span>Single: <strong>{formatPrice(pg.longTermRent?.single || 0)}</strong></span>
                      <span>Double: <strong>{formatPrice(pg.longTermRent?.double || 0)}</strong></span>
                    </div>
                  </div>

                  {/* Owner Info */}
                  {pg.ownerId && (
                    <div style={{ marginBottom: '12px', fontSize: '13px', color: '#6b7280' }}>
                      <p style={{ fontWeight: 500, marginBottom: '4px' }}>Owner: {pg.ownerId.name}</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a href={`tel:${pg.ownerId?.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#667eea' }}>
                          <Phone size={12} /> {pg.ownerId?.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => copyLink(pg.checkin_url || '')}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={() => shareQR(pg)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                    >
                      <Share2 size={14} />
                      Share QR
                    </button>
                    {isApproved ? (
                      <Link
                        to={`/add-rooms/${pg._id}`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}
                      >
                        <Plus size={14} />
                        Add Rooms
                      </Link>
                    ) : (
                      <button
                        onClick={() => completeOnboarding(pg._id)}
                        disabled={completingId === pg._id}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: completingId === pg._id ? 'not-allowed' : 'pointer', opacity: completingId === pg._id ? 0.7 : 1 }}
                      >
                        {completingId === pg._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        Complete Onboarding
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedPG(pg)}
                      style={{ padding: '10px 14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                    >
                      <QrCode size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      {selectedPG && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}
          onClick={() => setSelectedPG(null)}
        >
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{selectedPG.name}</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>{selectedPG.address}, {selectedPG.city}</p>
            
            {selectedPG.qrCode ? (
              <img src={selectedPG.qrCode} alt="QR Code" style={{ width: '200px', height: '200px', margin: '0 auto 16px' }} />
            ) : (
              <div style={{ width: '200px', height: '200px', margin: '0 auto 16px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                <QrCode size={48} color="#9ca3af" />
              </div>
            )}
            
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Check-in URL:</p>
            <p style={{ fontSize: '12px', color: '#667eea', wordBreak: 'break-all', marginBottom: '16px' }}>{selectedPG.checkin_url}</p>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => copyLink(selectedPG.checkin_url)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={() => shareQR(selectedPG)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
            
            <button
              onClick={() => setSelectedPG(null)}
              style={{ marginTop: '12px', padding: '10px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
