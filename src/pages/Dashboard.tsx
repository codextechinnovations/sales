import { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, Home } from 'lucide-react';
import { get } from '../services/apiClient';

interface Stats {
  totalPGs: number;
  totalRooms: number;
  totalTenants: number;
  activeTenants: number;
  totalOwners: number;
}

const cardStyles = [
  { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', icon: Building2 },
  { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', icon: Home },
  { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', icon: Users },
  { bg: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', icon: TrendingUp },
];

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalPGs: 0, totalRooms: 0, totalTenants: 0, activeTenants: 0, totalOwners: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const response = await get<any>('/salesperson/stats');
      setStats({
        totalPGs: response.totalPGs || 0,
        totalRooms: response.totalRooms || 0,
        totalTenants: response.totalTenants || 0,
        activeTenants: response.activeTenants || 0,
        totalOwners: response.totalOwners || 0
      });
    } catch (error) { console.error('Error fetching stats:', error); }
    finally { setLoading(false); }
  };

  const statLabels = ['Total PGs', 'Total Rooms', 'Total Tenants', 'Active Tenants'];
  const statValues = [stats.totalPGs, stats.totalRooms, stats.totalTenants, stats.activeTenants];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Sales Dashboard</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Welcome to Sales Portal</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {statLabels.map((label, i) => {
          const Icon = cardStyles[i].icon;
          return (
            <div
              key={label}
              style={{
                padding: '24px',
                backgroundColor: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(24px)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{label}</p>
                <p style={{ fontSize: '24px', fontWeight: 600, marginTop: '4px' }}>{loading ? '...' : statValues[i]}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: cardStyles[i].bg }}>
                <Icon style={{ width: '24px', height: '24px', color: cardStyles[i].color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}