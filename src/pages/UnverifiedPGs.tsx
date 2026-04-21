import { useState, useEffect } from 'react';
import { get } from '../services/apiClient';
import { MapPin, Navigation, Loader2, Building2, Map, X, Filter } from 'lucide-react';

interface PG {
  _id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  area: string;
  state: string;
  latitude: number;
  longitude: number;
  totalRooms: number;
  ownerId: {
    name: string;
    phone: string;
  };
}

export function UnverifiedPGs() {
  const [pgs, setPgs] = useState<PG[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    fetchUnverifiedPGs();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchUnverifiedPGs = async () => {
    try {
      const response = await get<any[]>('/salesperson/unverified-pgs');
      setPgs(response as PG[] || []);
    } catch (error) {
      console.error('Error fetching PGs:', error);
    } finally {
      setLoading(false);
    }
  };

  const areaSet = new Set<string>();
  pgs.forEach(pg => { if (pg.area) areaSet.add(pg.area); });
  const areas = Array.from(areaSet);
  const filteredPGs = selectedArea === 'all' ? pgs : pgs.filter(pg => pg.area === selectedArea);

  const openGoogleMaps = (pg: PG) => {
    if (pg.latitude && pg.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${pg.latitude},${pg.longitude}`;
      window.open(url, '_blank');
    } else {
      const query = encodeURIComponent(`${pg.address}, ${pg.city}, ${pg.state}`);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
      window.open(url, '_blank');
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

  return (
    <div style={{ padding: isMobile ? '12px' : '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '16px' : '0' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 700, color: '#1f2937' }}>Unverified PGs</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>PGs waiting for admin verification</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={18} color="#6b7280" />
          <select
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', minWidth: '150px', background: 'white' }}
          >
            <option value="all">All Areas</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin" size={32} color="#667eea" />
        </div>
      ) : filteredPGs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <Building2 size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            {selectedArea === 'all' ? 'No unverified PGs found' : `No PGs in ${selectedArea}`}
          </p>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>
            {selectedArea === 'all' ? 'All PGs have been verified' : 'Try selecting a different area'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredPGs.map(pg => {
            const typeStyle = getPgTypeColor(pg.type);
            return (
              <div
                key={pg._id}
                style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}
              >
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>{pg.name}</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{pg.address}, {pg.city}</p>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, ...typeStyle }}>
                      {pg.type}
                    </span>
                  </div>

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
                    {pg.ownerId && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>Owner: {pg.ownerId.name}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openGoogleMaps(pg)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      <Navigation size={16} />
                      Get Directions
                    </button>
                    <button
                      onClick={() => setSelectedPG(pg)}
                      style={{
                        padding: '10px 16px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      <MapPin size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Location Modal */}
      {selectedPG && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}
          onClick={() => setSelectedPG(null)}
        >
          <div
            style={{ background: 'white', borderRadius: '12px', padding: '20px', maxWidth: '400px', width: '90%' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{selectedPG.name}</h3>
              <button onClick={() => setSelectedPG(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Address</p>
              <p style={{ fontSize: '14px', color: '#1f2937' }}>{selectedPG.address}, {selectedPG.city}, {selectedPG.state}</p>
            </div>

            {selectedPG.area && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Area</p>
                <p style={{ fontSize: '14px', color: '#1f2937' }}>{selectedPG.area}</p>
              </div>
            )}

            {selectedPG.latitude && selectedPG.longitude && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Coordinates</p>
                <p style={{ fontSize: '14px', color: '#1f2937' }}>{selectedPG.latitude}, {selectedPG.longitude}</p>
              </div>
            )}

            <button
              onClick={() => openGoogleMaps(selectedPG)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <Map size={16} />
              Open in Google Maps
            </button>
          </div>
        </div>
      )}
    </div>
  );
}