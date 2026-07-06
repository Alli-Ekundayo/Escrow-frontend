import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  SquaresFour,
  FileText,
  PlusCircle,
  Warning,
  ClockCounterClockwise,
  SignOut,
  X,
  Moon,
  Sun,
  CaretLeft,
  CaretRight,
  CaretUp,
} from '@phosphor-icons/react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { TrustScoreBadge } from './TrustScoreBadge';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: SquaresFour },
  { to: '/agreements', label: 'Agreements', icon: FileText },
  { to: '/create', label: 'New Agreement', icon: PlusCircle },
  { to: '/disputes', label: 'Disputes', icon: Warning },
  { to: '/transactions', label: 'History', icon: ClockCounterClockwise },
];

export function Sidebar({ mobileOpen, onClose, isCollapsed, toggleCollapse }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-label="Main navigation"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        className={`sidebar-nav ${mobileOpen ? 'sidebar-open' : ''}`}
      >
        {/* Sidebar background using CSS vars */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'var(--bg-surface)',
            borderRight: '1.5px solid var(--border-default)',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Toggle Collapse Button */}
          <button
            className="desktop-collapse-btn"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              position: 'absolute', top: 26, right: -12,
              width: 24, height: 24, borderRadius: '50%',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-default)',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 50,
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {isCollapsed ? <CaretRight weight="bold" /> : <CaretLeft weight="bold" />}
          </button>

          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '20px 0 18px' : '20px 20px 18px',
            borderBottom: '1.5px solid var(--border-default)',
            overflow: 'hidden',
          }}>
            <Link
              to="/dashboard"
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', borderBottom: 'none' }}
              title="Dashboard"
            >
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                backgroundColor: '#9fe870',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <ShieldCheck weight="fill" style={{ width: 18, height: 18, color: '#0e0f0c' }} />
              </div>
              {!isCollapsed && (
                <span style={{
                  color: 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: '-0.02em',
                }}>
                  Es-crow
                </span>
              )}
            </Link>
            {!isCollapsed && (
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary)', padding: 4, borderRadius: 6,
                }}
                className="sidebar-close-btn"
                aria-label="Close navigation"
              >
                <X style={{ width: 18, height: 18 }} weight="bold" />
              </button>
            )}
          </div>

          {/* Nav */}
          <nav aria-label="App navigation" style={{ flex: 1, padding: isCollapsed ? '12px 10px' : '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(to + '/');
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  title={isCollapsed ? label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: isCollapsed ? '12px' : '9px 12px',
                    borderRadius: 10,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    textDecoration: 'none',
                    borderBottom: 'none',
                    transition: 'all 0.15s ease',
                    backgroundColor: active ? '#9fe870' : 'transparent',
                    color: active ? '#0e0f0c' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon
                    style={{ width: isCollapsed ? 20 : 17, height: isCollapsed ? 20 : 17, flexShrink: 0 }}
                    weight={active ? 'fill' : 'bold'}
                  />
                  {!isCollapsed && label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          {user && (
            <div
              ref={profileRef}
              style={{
                padding: isCollapsed ? '14px 10px' : '14px',
                borderTop: '1.5px solid var(--border-default)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start',
                  width: '100%', gap: 10, background: 'none', border: 'none', cursor: 'pointer',
                  padding: isCollapsed ? '8px' : '8px 12px', borderRadius: 10,
                  transition: 'background-color 0.15s ease',
                  backgroundColor: profileMenuOpen ? 'var(--bg-surface-alt)' : 'transparent',
                }}
                onMouseEnter={(e) => { if (!profileMenuOpen) e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)' }}
                onMouseLeave={(e) => { if (!profileMenuOpen) e.currentTarget.style.backgroundColor = 'transparent' }}
                aria-label="User profile menu"
              >
                <TrustScoreBadge score={user.trust_score ?? 0} />
                {!isCollapsed && (
                  <>
                    <div style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                      <p style={{
                        fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                        fontFamily: "'Inter', sans-serif",
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        margin: 0,
                      }}>
                        {user.first_name || user.email}
                      </p>
                      <p style={{
                        fontSize: 11, color: 'var(--text-tertiary)',
                        fontFamily: "'Inter', sans-serif",
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        margin: 0,
                      }}>
                        {user.email}
                      </p>
                    </div>
                    <CaretUp
                      style={{
                        width: 14, height: 14, color: 'var(--text-tertiary)',
                        transform: profileMenuOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s', flexShrink: 0
                      }}
                      weight="bold"
                    />
                  </>
                )}
              </button>

              {/* Profile Menu Popup */}
              {profileMenuOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 4px)',
                  left: isCollapsed ? 10 : 14,
                  width: isCollapsed ? 200 : 'calc(100% - 28px)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 12,
                  boxShadow: 'var(--shadow-md)',
                  padding: 8,
                  zIndex: 50,
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  {isCollapsed && (
                    <div style={{ padding: '8px 8px 12px', borderBottom: '1px solid var(--border-default)', marginBottom: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                        {user.first_name || user.email}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: "'Inter', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                        {user.email}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => { toggle(); setProfileMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '8px 10px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif", fontSize: 13,
                      color: 'var(--text-secondary)', borderRadius: 8,
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >
                    {isDark ? <Sun style={{ width: 16, height: 16 }} weight="bold" /> : <Moon style={{ width: 16, height: 16 }} weight="bold" />}
                    {isDark ? 'Light mode' : 'Dark mode'}
                  </button>
                  <button
                    onClick={() => { handleLogout(); setProfileMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '8px 10px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif", fontSize: 13,
                      color: 'var(--color-accent-red-text)', borderRadius: 8,
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-accent-red)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <SignOut style={{ width: 16, height: 16 }} weight="bold" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
