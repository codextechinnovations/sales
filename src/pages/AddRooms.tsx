import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { get, post } from '../services/apiClient';
import { Loader2, Plus, Trash2, Save, ArrowLeft, CheckCircle, AlertCircle, Bed } from 'lucide-react';

interface Room {
  roomNumber: string;
  floor: string;
  roomType: string;
  capacity: number;
  rentType: 'monthly' | 'daily' | 'both';
  monthlyRent: number;
  dailyRent: number;
  securityDeposit: number;
}

interface PG {
  _id: string;
  name: string;
  city: string;
  totalRooms: number;
  rentalType?: string;
}

export function AddRooms() {
  const navigate = useNavigate();
  const { pgId } = useParams();
  const [pg, setPg] = useState<PG | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([
    { roomNumber: '', floor: '1', roomType: 'single', capacity: 1, rentType: 'monthly', monthlyRent: 0, dailyRent: 0, securityDeposit: 0 }
  ]);

  useEffect(() => {
    if (pgId) {
      fetchPG();
    }
  }, [pgId]);

  const fetchPG = async () => {
    try {
      const response = await get<any[]>(`/salesperson/my-pgs`);
      const found = response.find((p: any) => p._id === pgId);
      setPg(found || null);
    } catch (error) {
      console.error('Error fetching PG:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRoom = () => {
    setRooms([...rooms, { roomNumber: '', floor: '1', roomType: 'single', capacity: 1, rentType: 'monthly', monthlyRent: 0, dailyRent: 0, securityDeposit: 0 }]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const updateRoom = (index: number, field: string, value: any) => {
    const updated = [...rooms];
    (updated[index] as any)[field] = value;
    setRooms(updated);
  };

  const selectedRentType = (index: number, rentType: string) => {
    updateRoom(index, 'rentType', rentType as 'monthly' | 'daily' | 'both');
  };

  const handleSubmit = async () => {
    const validRooms = rooms.filter(r => r.roomNumber.trim() !== '');
    if (validRooms.length === 0) {
      alert('Add at least one room with room number');
      return;
    }

    setSubmitting(true);
    try {
      const result = await post('/salesperson/rooms', { pgId, rooms: validRooms });
      alert('Rooms added successfully!');
      navigate('/my-pgs');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add rooms');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader2 className="animate-spin" size={32} color="#667eea" />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/my-pgs')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginBottom: '16px', padding: '8px' }}
      >
        <ArrowLeft size={20} />
        Back to My PGs
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>Add Rooms</h1>
        {pg && (
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            {pg.name} - {pg.city}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {rooms.map((room, index) => (
          <div key={index} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600, color: '#374151' }}>Room {index + 1}</span>
              {rooms.length > 1 && (
                <button
                  onClick={() => removeRoom(index)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Room Number *</label>
                <input
                  type="text"
                  value={room.roomNumber}
                  onChange={e => updateRoom(index, 'roomNumber', e.target.value)}
                  placeholder="e.g., 101, A1"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Floor</label>
                <input
                  type="text"
                  value={room.floor}
                  onChange={e => updateRoom(index, 'floor', e.target.value)}
                  placeholder="e.g., 1, 2, Ground"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Room Type</label>
                <select
                  value={room.roomType}
                  onChange={e => updateRoom(index, 'roomType', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="four">Four Sharing</option>
                  <option value="dormitory">Dormitory</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Capacity</label>
                <input
                  type="number"
                  value={room.capacity}
                  onChange={e => updateRoom(index, 'capacity', parseInt(e.target.value) || 1)}
                  min="1"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Stay Type</label>
                <select
                  value={room.rentType}
                  onChange={e => selectedRentType(index, e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                >
                  <option value="monthly">Monthly Stay</option>
                  <option value="daily">Daily Stay</option>
                  <option value="both">Both (Monthly & Daily)</option>
                </select>
              </div>

              {(room.rentType === 'monthly' || room.rentType === 'both') && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={room.monthlyRent}
                    onChange={e => updateRoom(index, 'monthlyRent', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                  />
                </div>
              )}

              {(room.rentType === 'daily' || room.rentType === 'both') && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Daily Rent (₹)</label>
                  <input
                    type="number"
                    value={room.dailyRent}
                    onChange={e => updateRoom(index, 'dailyRent', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Security Deposit (₹)</label>
                <input
                  type="number"
                  value={room.securityDeposit}
                  onChange={e => updateRoom(index, 'securityDeposit', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addRoom}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'white', border: '2px dashed #d1d5db', borderRadius: '12px', color: '#6b7280', cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: '16px' }}
      >
        <Plus size={20} />
        Add Another Room
      </button>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '16px', background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '24px' }}
      >
        {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        {submitting ? 'Saving...' : 'Save All Rooms'}
      </button>
    </div>
  );
}