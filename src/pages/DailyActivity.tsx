import { useState, useEffect } from 'react';
import { post, get } from '../services/apiClient';
import { Loader2, CheckCircle, TrendingUp, Users, Phone, MapPin, Clock, Calendar } from 'lucide-react';

interface Activity {
  _id: string;
  date: string;
  leadsGenerated: number;
  callsMade: number;
  visitsDone: number;
  meetingsDone: number;
  conversions: number;
  followUps: number;
  notes: string;
  status: string;
}

export function DailyActivity() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<Activity[]>([]);
  const [activity, setActivity] = useState({
    leadsGenerated: 0,
    callsMade: 0,
    visitsDone: 0,
    meetingsDone: 0,
    conversions: 0,
    followUps: 0,
    notes: ''
  });

  useEffect(() => {
    fetchTodayActivity();
    fetchHistory();
  }, []);

  const fetchTodayActivity = async () => {
    try {
      const res = await get<any>('/salesperson/activity/today');
      if (res) {
        setActivity({
          leadsGenerated: res.leadsGenerated || 0,
          callsMade: res.callsMade || 0,
          visitsDone: res.visitsDone || 0,
          meetingsDone: res.meetingsDone || 0,
          conversions: res.conversions || 0,
          followUps: res.followUps || 0,
          notes: res.notes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await get<any[]>('/salesperson/activity/history?days=7');
      setHistory(res as Activity[] || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await post('/salesperson/activity', activity);
      alert('Activity submitted successfully!');
      fetchHistory();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error submitting activity');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: number | string) => {
    setActivity({ ...activity, [field]: value });
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '16px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>Daily Activity</h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>{today}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { key: 'leadsGenerated', label: 'Leads Generated', icon: Users, color: '#3b82f6' },
          { key: 'callsMade', label: 'Calls Made', icon: Phone, color: '#8b5cf6' },
          { key: 'visitsDone', label: 'Visits Done', icon: MapPin, color: '#10b981' },
          { key: 'meetingsDone', label: 'Meetings Done', icon: Clock, color: '#f59e0b' },
          { key: 'conversions', label: 'Conversions', icon: TrendingUp, color: '#22c55e' },
          { key: 'followUps', label: 'Follow Ups', icon: CheckCircle, color: '#06b6d4' },
        ].map(item => (
          <div key={item.key} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', borderRadius: '10px', background: item.color + '20' }}>
              <item.icon size={24} color={item.color} />
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{item.label}</p>
              <input
                type="number"
                min="0"
                value={activity[item.key as keyof typeof activity] as number}
                onChange={e => updateField(item.key, parseInt(e.target.value) || 0)}
                style={{ width: '80px', padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Notes</label>
        <textarea
          value={activity.notes}
          onChange={e => updateField('notes', e.target.value)}
          placeholder="Add any notes about your activities today..."
          rows={4}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', resize: 'vertical' }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '16px',
          background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: submitting ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px'
        }}
      >
        {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
        {submitting ? 'Submitting...' : 'Submit Daily Activity'}
      </button>

      {/* History */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Calendar size={20} color="#6b7280" />
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>Recent Activities</h2>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={32} color="#667eea" />
          </div>
        ) : history.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '40px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ color: '#6b7280' }}>No activities recorded yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.map((item, index) => (
              <div key={item._id || index} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                    {item.notes || 'No notes'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#3b82f6' }}>{item.leadsGenerated} Leads</span>
                  <span style={{ color: '#8b5cf6' }}>{item.callsMade} Calls</span>
                  <span style={{ color: '#10b981' }}>{item.visitsDone} Visits</span>
                  <span style={{ color: '#22c55e' }}>{item.conversions} Conv.</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}