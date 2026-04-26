import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, MapPin, LogOut, Menu, X, UserPlus, FileText, CheckSquare, Building2, BookOpen } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/add-owner', label: 'Add PG Owner', icon: UserPlus },
  { path: '/my-pgs', label: 'My PGs', icon: MapPin },
  { path: '/unverified', label: 'Unverified PGs', icon: MapPin },
  { path: '/activity', label: 'Daily Activity', icon: CheckSquare },
  { path: '/manual', label: 'Field Manual', icon: BookOpen },
  { path: '/roles', label: 'Roles & Responsibilities', icon: FileText },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const closeSidebar = () => setSidebarOpen(false);

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '256px',
    backgroundColor: 'white',
    borderRight: '1px solid #e2e8f0',
    zIndex: 40,
    display: 'flex',
    flexDirection: 'column',
    transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
    transition: 'transform 0.3s ease',
  };

  const mainContentStyle: React.CSSProperties = {
    marginLeft: isMobile ? 0 : '256px',
    padding: isMobile ? '16px' : '24px',
    paddingTop: isMobile ? '76px' : '84px',
    paddingBottom: '24px',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Mobile Header */}
      <div style={{
        display: isMobile ? 'flex' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 50,
      }}>
        <span style={{ fontWeight: 600, fontSize: '18px', color: '#0891b2' }}>Sales Portal</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: '8px', border: 'none', background: 'none', cursor: 'pointer' }}>
          {sidebarOpen ? <X size={24} color="#64748b" /> : <Menu size={24} color="#64748b" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 35,
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ height: '60px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #e2e8f0' }}>
          <span style={{ fontWeight: 600, fontSize: '20px', color: '#0891b2' }}>Sales Portal</span>
        </div>

        <nav style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: active ? '#0891b2' : '#64748b',
                  backgroundColor: active ? 'rgba(8, 145, 178, 0.1)' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: '14px' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(8, 145, 178, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#0891b2', fontWeight: 500 }}>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Sales Person</p>
            </div>
          </div>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <Outlet />
      </main>
    </div>
  );
}

const logoutButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  width: '100%',
  borderRadius: '8px',
  border: 'none',
  background: 'none',
  color: '#64748b',
  cursor: 'pointer',
  fontSize: '14px',
};