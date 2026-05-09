import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, Home, Plus, Check, Loader, DollarSign, Image, X, MapPin } from 'lucide-react';
import { salesPost } from '../services/apiClient';
import { AddressAutocomplete } from '../components/AddressAutocomplete';

const getContainerStyle = (isMobile: boolean): React.CSSProperties => ({
  minHeight: '100vh',
  padding: isMobile ? '20px 12px' : '40px 20px',
  fontFamily: "'Inter', sans-serif",
});

const getCardStyle = (isMobile: boolean): React.CSSProperties => ({
  background: 'white',
  borderRadius: isMobile ? '12px' : '20px',
  padding: isMobile ? '20px' : '30px',
  marginBottom: isMobile ? '16px' : '25px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
  maxWidth: '900px',
  margin: '0 auto 25px auto',
});

const getFormGridStyle = (isMobile: boolean): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
  gap: isMobile ? '12px' : '20px',
});

const amenitiesList = [
  { value: 'wifi', label: 'WiFi', icon: '📶' },
  { value: 'laundry', label: 'Laundry', icon: '👕' },
  { value: 'washing_machine', label: 'Washing Machine', icon: '🧺' },
  { value: 'generator', label: 'Generator', icon: '⚡' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'lift', label: 'Lift', icon: '🛗' },
  { value: 'parking', label: 'Parking', icon: '🅿️' },
  { value: 'ac', label: 'AC', icon: '❄️' },
];

const getCardTitleStyle = (isMobile: boolean): React.CSSProperties => ({
  fontSize: isMobile ? '18px' : '20px',
  fontWeight: 600,
  color: '#333',
  marginBottom: isMobile ? '16px' : '25px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const getLabelStyle = (isMobile: boolean): React.CSSProperties => ({
  display: 'block',
  fontSize: isMobile ? '13px' : '14px',
  fontWeight: 500,
  color: '#555',
  marginBottom: '8px',
});

const getInputStyle = (isMobile: boolean): React.CSSProperties => ({
  width: '100%',
  padding: isMobile ? '12px 14px' : '14px 16px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  fontSize: '16px',
  fontFamily: 'inherit',
  transition: 'all 0.3s ease',
  background: '#fafafa',
});

const getSelectStyle = (isMobile: boolean): React.CSSProperties => ({
  ...getInputStyle(isMobile),
  cursor: 'pointer',
});

const formGridStyle = getFormGridStyle(false);
const cardTitleStyle = getCardTitleStyle(false);
const labelStyle = getLabelStyle(false);

const locationBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  width: '100%',
  padding: '14px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const amenityItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 12px',
  background: '#f8f9ff',
  border: '2px solid #e8ecff',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  userSelect: 'none',
};

const pricingSectionStyle: React.CSSProperties = {
  marginTop: '20px',
  paddingTop: '20px',
  borderTop: '1px solid #e8ecff',
};

const getPricingGridStyle = (isMobile: boolean): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
  gap: '15px',
});

const pricingColumnStyle: React.CSSProperties = {
  background: '#f8f9ff',
  border: '2px solid #e8ecff',
  borderRadius: '12px',
  padding: '15px',
};

const pricingColumnHeaderStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#667eea',
  marginBottom: '12px',
  textAlign: 'center',
};

const submitBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '14px',
  fontSize: '18px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

const getDefaultPg = () => ({
  name: '', type: 'colive', totalRooms: '', address: '', city: '', state: '', pincode: '',
  latitude: '', longitude: '', amenities: [],
  stayType: 'both',
  longTermRent: { single: '', double: '', triple: '' },
  shortTermRent: { single: '', double: '', triple: '' },
  images: [] as string[]
});

export function PGOwnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: string; lng: string } | null>(null);
  const [pgCount, setPgCount] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [owner, setOwner] = useState({
    name: '', phone: '', email: '', password: '', address: '', city: '', state: '', pincode: ''
  });
  const [pgList, setPgList] = useState<any[]>([getDefaultPg()]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleAmenity = (pgIndex: number, amenity: string) => {
    const updated = [...pgList];
    const amenities = updated[pgIndex].amenities || [];
    if (amenities.includes(amenity)) {
      updated[pgIndex].amenities = amenities.filter((a: string) => a !== amenity);
    } else {
      updated[pgIndex].amenities = [...amenities, amenity];
    }
    setPgList(updated);
  };

  const updatePgField = (index: number, field: string, value: any) => {
    const updated = [...pgList];
    (updated[index] as any)[field] = value;
    setPgList(updated);
  };

  const updateRentField = (index: number, term: 'longTermRent' | 'shortTermRent', sharing: string, value: string) => {
    const updated = [...pgList];
    updated[index][term] = { ...updated[index][term], [sharing]: value };
    setPgList(updated);
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const processFiles = async () => {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push(base64);
      }
      
      const updated = [...pgList];
      updated[index].images = [...(updated[index].images || []), ...newImages];
      setPgList(updated);
    };
    
    processFiles();
  };

  const removeImage = (pgIndex: number, imgIndex: number) => {
    const updated = [...pgList];
    updated[pgIndex].images = updated[pgIndex].images.filter((_: string, i: number) => i !== imgIndex);
    setPgList(updated);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        });
        reverseGeocode(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        alert('Unable to get location: ' + error.message);
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data.address) {
        const addr = data.address;
        setOwner(prev => ({
          ...prev,
          address: addr.road || addr.suburb || '',
          city: addr.city || addr.town || addr.village || '',
          state: addr.state || '',
          pincode: addr.postcode || ''
        }));
      }
    } catch (e) {
      console.error('Reverse geocode error:', e);
    }
  };

  const handlePgCountChange = (count: number) => {
    setPgCount(count);
    const newPgs = Array.from({ length: count }, (_, i) => pgList[i] || getDefaultPg());
    setPgList(newPgs);
  };

  const handlePGLocation = (index: number) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updatePgField(index, 'latitude', position.coords.latitude.toFixed(6));
        updatePgField(index, 'longitude', position.coords.longitude.toFixed(6));
      },
      (error) => alert('Location error: ' + error.message)
    );
  };

  const handleSubmit = async () => {
    if (!owner.name || !owner.phone || !owner.email || !owner.password) {
      alert('Please fill in all owner details');
      return;
    }

    for (let i = 0; i < pgList.length; i++) {
      const pg = pgList[i];
      if (!pg.name || !pg.type || !pg.totalRooms || !pg.address || !pg.city) {
        alert(`Please fill in all details for PG ${i + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      const data = {
        ...owner,
        latitude: location?.lat,
        longitude: location?.lng,
        pgs: pgList
      };

      await salesPost('/salesperson/add-owner', data);
      alert('PG Owner Created Successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error creating owner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={getContainerStyle(isMobile)}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 700, marginBottom: '10px', color: '#333' }}>PG Owner Registration</h1>
        <p style={{ fontSize: isMobile ? '14px' : '18px', color: '#666' }}>Register as a PG owner and manage your properties</p>
      </div>

      {/* Owner Info */}
      <div style={getCardStyle(isMobile)}>
        <div style={getCardTitleStyle(isMobile)}>
          <User size={20} /> Owner Information
        </div>
        <div style={getFormGridStyle(isMobile)}>
          <div>
            <label style={getLabelStyle(isMobile)}>Full Name *</label>
            <input style={getInputStyle(isMobile)} placeholder="Enter your full name" value={owner.name} onChange={(e) => setOwner({ ...owner, name: e.target.value })} />
          </div>
          <div>
            <label style={getLabelStyle(isMobile)}>Phone Number *</label>
            <input style={getInputStyle(isMobile)} placeholder="Enter phone number" value={owner.phone} onChange={(e) => setOwner({ ...owner, phone: e.target.value })} />
          </div>
          <div>
            <label style={getLabelStyle(isMobile)}>Email Address *</label>
            <input style={getInputStyle(isMobile)} type="email" placeholder="Enter email" value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} />
          </div>
          <div>
            <label style={getLabelStyle(isMobile)}>Password *</label>
            <input style={getInputStyle(isMobile)} type="password" placeholder="Create password" value={owner.password} onChange={(e) => setOwner({ ...owner, password: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Location */}
      <div style={getCardStyle(isMobile)}>
        <div style={getCardTitleStyle(isMobile)}>
          <Plus size={20} /> Location Details
        </div>
        <button style={locationBtnStyle} onClick={handleGetLocation}>
          <Check size={18} /> Get Live Location
        </button>
        {location && (
          <div style={{ marginTop: '15px', padding: '10px', background: '#d4edda', borderRadius: '8px', fontSize: '14px' }}>
            ✓ Location captured: {location.lat}, {location.lng}
          </div>
        )}
            <div style={{ ...formGridStyle, marginTop: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={getLabelStyle(isMobile)}>Search Address</label>
                <AddressAutocomplete
                  value={owner.address}
                  onChange={(v) => setOwner({ ...owner, address: v })}
                  onSelect={(data) => setOwner(prev => ({
                    ...prev,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode
                  }))}
                  placeholder="Type to search address..."
                  inputStyle={getInputStyle(isMobile)}
                />
              </div>
              <div>
                <label style={getLabelStyle(isMobile)}>City</label>
                <input style={getInputStyle(isMobile)} placeholder="City" value={owner.city} onChange={(e) => setOwner({ ...owner, city: e.target.value })} />
              </div>
              <div>
                <label style={getLabelStyle(isMobile)}>State</label>
                <input style={getInputStyle(isMobile)} placeholder="State" value={owner.state} onChange={(e) => setOwner({ ...owner, state: e.target.value })} />
              </div>
              <div>
                <label style={getLabelStyle(isMobile)}>Pincode</label>
                <input style={getInputStyle(isMobile)} placeholder="Pincode" value={owner.pincode} onChange={(e) => setOwner({ ...owner, pincode: e.target.value })} />
              </div>
            </div>
      </div>

      {/* PG Properties */}
      <div style={getCardStyle(isMobile)}>
        <div style={getCardTitleStyle(isMobile)}>
          <Home size={20} /> PG Properties
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={getLabelStyle(isMobile)}>Number of PGs</label>
          <select style={getInputStyle(isMobile)} value={pgCount} onChange={(e) => handlePgCountChange(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n} PG{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {pgList.map((pg, index) => (
          <div key={index} style={{ background: '#f8f9ff', border: '2px solid #e8ecff', borderRadius: '16px', padding: '25px', marginBottom: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#667eea', marginBottom: '20px' }}>
              PG Property {index + 1}
            </div>
            
            <div style={getFormGridStyle(isMobile)}>
              <div>
                <label style={getLabelStyle(isMobile)}>PG Name *</label>
                <input style={getInputStyle(isMobile)} placeholder="Enter PG name" value={pg.name} onChange={(e) => updatePgField(index, 'name', e.target.value)} />
              </div>
              <div>
                <label style={getLabelStyle(isMobile)}>PG Type *</label>
                <select style={getInputStyle(isMobile)} value={pg.type} onChange={(e) => updatePgField(index, 'type', e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="male">Male PG</option>
                  <option value="female">Female PG</option>
                  <option value="colive">Co-Live PG</option>
                </select>
              </div>
              <div>
                <label style={getLabelStyle(isMobile)}>Total Rooms *</label>
                <input style={getInputStyle(isMobile)} type="number" placeholder="Number of rooms" value={pg.totalRooms} onChange={(e) => updatePgField(index, 'totalRooms', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={getLabelStyle(isMobile)}>Search Address</label>
                <AddressAutocomplete
                  value={pg.address}
                  onChange={(v) => updatePgField(index, 'address', v)}
                  onSelect={(data) => {
                    updatePgField(index, 'address', data.address);
                    updatePgField(index, 'city', data.city);
                    updatePgField(index, 'state', data.state);
                    updatePgField(index, 'pincode', data.pincode);
                    updatePgField(index, 'latitude', data.latitude);
                    updatePgField(index, 'longitude', data.longitude);
                  }}
                  placeholder="Type to search address..."
                  inputStyle={getInputStyle(isMobile)}
                />
              </div>
              <div>
                <label style={getLabelStyle(isMobile)}>City *</label>
                <input style={getInputStyle(isMobile)} placeholder="City" value={pg.city} onChange={(e) => updatePgField(index, 'city', e.target.value)} />
              </div>
              <div>
                <label style={getLabelStyle(isMobile)}>State</label>
                <input style={getInputStyle(isMobile)} placeholder="State" value={pg.state} onChange={(e) => updatePgField(index, 'state', e.target.value)} />
              </div>
              <div>
                <label style={getLabelStyle(isMobile)}>Pincode</label>
                <input style={getInputStyle(isMobile)} placeholder="Pincode" value={pg.pincode} onChange={(e) => updatePgField(index, 'pincode', e.target.value)} />
              </div>
            </div>

            {/* Pricing Section */}
            <div style={pricingSectionStyle}>
              <div style={{ ...cardTitleStyle, marginBottom: '15px' }}>
                <DollarSign size={20} /> Pricing
              </div>

              {/* Stay Type Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={getLabelStyle(isMobile)}>Stay Type</label>
                <select style={getInputStyle(isMobile)} value={pg.stayType || 'both'} onChange={(e) => updatePgField(index, 'stayType', e.target.value)}>
                  <option value="long_term">Long Stay Only (Monthly)</option>
                  <option value="short_term">Short Stay Only (Daily)</option>
                  <option value="both">Both (Monthly & Daily)</option>
                </select>
              </div>
              
              <div style={getPricingGridStyle(isMobile)}>
                {/* Monthly Rent (Long Term) */}
                {(pg.stayType === 'long_term' || pg.stayType === 'both') && (
                  <div style={pricingColumnStyle}>
                    <div style={pricingColumnHeaderStyle}>Monthly Rent (Long Term)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ ...labelStyle, fontSize: '12px' }}>Single Sharing</label>
                        <input style={getInputStyle(isMobile)} type="number" placeholder="₹0" value={pg.longTermRent?.single || ''} onChange={(e) => updateRentField(index, 'longTermRent', 'single', e.target.value)} />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: '12px' }}>Double Sharing</label>
                        <input style={getInputStyle(isMobile)} type="number" placeholder="₹0" value={pg.longTermRent?.double || ''} onChange={(e) => updateRentField(index, 'longTermRent', 'double', e.target.value)} />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: '12px' }}>Triple Sharing</label>
                        <input style={getInputStyle(isMobile)} type="number" placeholder="₹0" value={pg.longTermRent?.triple || ''} onChange={(e) => updateRentField(index, 'longTermRent', 'triple', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Daily Rent (Short Term) */}
                {(pg.stayType === 'short_term' || pg.stayType === 'both') && (
                  <div style={{ ...pricingColumnStyle, background: '#fff9f0', borderColor: '#ffe4c4' }}>
                  <div style={{ ...pricingColumnHeaderStyle, color: '#f093fb' }}>Daily Rent (Short Term)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Single Sharing</label>
                      <input style={getInputStyle(isMobile)} type="number" placeholder="₹0" value={pg.shortTermRent?.single || ''} onChange={(e) => updateRentField(index, 'shortTermRent', 'single', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Double Sharing</label>
                      <input style={getInputStyle(isMobile)} type="number" placeholder="₹0" value={pg.shortTermRent?.double || ''} onChange={(e) => updateRentField(index, 'shortTermRent', 'double', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Triple Sharing</label>
                      <input style={getInputStyle(isMobile)} type="number" placeholder="₹0" value={pg.shortTermRent?.triple || ''} onChange={(e) => updateRentField(index, 'shortTermRent', 'triple', e.target.value)} />
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Photos */}
            <div style={{ marginTop: '20px' }}>
              <label style={{ ...labelStyle, marginBottom: '15px' }}>PG Photos</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {pg.images?.map((img: string, imgIndex: number) => (
                  <div key={imgIndex} style={{ position: 'relative', width: '80px', height: '80px' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    <button
                      type="button"
                      onClick={() => removeImage(index, imgIndex)}
                      style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label style={{ width: '80px', height: '80px', border: '2px dashed #cbd5e1', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc' }}>
                  <Image size={24} color="#94a3b8" />
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Add Photo</span>
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleImageUpload(index, e)} />
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div style={{ marginTop: '20px' }}>
              <label style={{ ...labelStyle, marginBottom: '15px' }}>Amenities</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {amenitiesList.map(amenity => (
                  <label
                    key={amenity.value}
                    style={{
                      ...amenityItemStyle,
                      background: pg.amenities?.includes(amenity.value) ? '#e8ecff' : '#f8f9ff',
                      borderColor: pg.amenities?.includes(amenity.value) ? '#667eea' : '#e8ecff',
                    }}
                  >
                    <input type="checkbox" style={{ display: 'none' }} checked={pg.amenities?.includes(amenity.value)} onChange={() => toggleAmenity(index, amenity.value)} />
                    <span>{amenity.icon}</span>
                    <span style={{ fontSize: '14px' }}>{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="button" style={{ ...locationBtnStyle, marginTop: '15px', background: pg.latitude ? '#28a745' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} onClick={() => handlePGLocation(index)}>
              <Check size={16} />
              {pg.latitude ? 'Location Captured' : 'Get PG Location'}
            </button>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button style={{ ...submitBtnStyle, opacity: loading ? 0.7 : 1, maxWidth: '900px', margin: '0 auto' }} onClick={handleSubmit} disabled={loading}>
        {loading ? <Loader className="animate-spin" size={20} /> : <Check size={20} />}
        {loading ? 'Creating...' : 'Create PG Owner Account'}
      </button>
    </div>
  );
}