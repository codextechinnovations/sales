import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '384px',
    height: '384px',
    background: 'linear-gradient(to bottom right, #a5f3fc, #93c5fd)',
    borderRadius: '50%',
    filter: 'blur(64px)',
    opacity: 0.4,
  },
  blob2: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: '384px',
    height: '384px',
    background: 'linear-gradient(to bottom right, #99f6e4, #86efac)',
    borderRadius: '50%',
    filter: 'blur(64px)',
    opacity: 0.4,
  },
  card: {
    position: 'relative' as const,
    zIndex: 10,
    width: '100%',
    maxWidth: '448px',
    padding: '32px',
    backgroundColor: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(24px)',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  },
  logoBox: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(to right, #0891b2, #0d9488)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
  },
  title: {
    background: 'linear-gradient(to right, #0891b2, #0d9488)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  input: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(to right, #0891b2, #0d9488)',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 500,
    boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
    transition: 'all 0.15s ease',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#1e293b',
  },
  error: {
    padding: '12px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '14px',
    marginBottom: '16px',
  },
};

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={styles.logoBox}>
            <User style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h1 style={{ ...styles.title, fontSize: '24px', fontWeight: 600 }}>Sales Portal</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>ManageYourPG Sales Team</p>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Codex Tech Innovations and Consultants LLP</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={styles.label}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#64748b' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sales@example.com"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#64748b' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.input}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? (
              <>
                <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </>
            )}
          </button>
        </form>
      </div>

      <p style={{ position: 'absolute', bottom: '24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
        © 2026 Codex Tech Innovations. All rights reserved.
      </p>
    </div>
  );
}