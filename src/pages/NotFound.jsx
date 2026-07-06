import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowLeft, SquaresFour, FileText, PlusCircle, ShieldSlash } from '@phosphor-icons/react';

const quickLinks = [
  { icon: SquaresFour, label: 'Dashboard', sub: 'Overview and stats', path: '/dashboard' },
  { icon: FileText, label: 'Agreements', sub: 'All escrow contracts', path: '/agreements' },
  { icon: PlusCircle, label: 'New agreement', sub: 'Start a new deal', path: '/create' },
];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', padding: '24px', fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }} className="animate-in">

        {/* Big icon */}
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          backgroundColor: '#e2f6d5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <ShieldSlash weight="fill" style={{ width: 40, height: 40, color: '#1a5c2a' }} />
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 72, fontWeight: 900, letterSpacing: '-0.04em',
          color: 'var(--text-primary)', margin: '0 0 4px',
          lineHeight: 1,
        }}>
          404
        </p>
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
          color: 'var(--text-primary)', margin: '0 0 10px',
        }}>
          Page not found
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14, color: 'var(--text-secondary)',
          lineHeight: '22px', margin: '0 auto 32px',
          maxWidth: '36ch',
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Quick links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {quickLinks.map(({ icon: Icon, label, sub, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                borderRadius: 14,
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-default)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s ease',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#9fe870';
                e.currentTarget.style.backgroundColor = '#f5fbf0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                backgroundColor: '#e2f6d5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon style={{ width: 17, height: 17, color: '#1a5c2a' }} weight="bold" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{sub}</p>
              </div>
              <ArrowLeft
                style={{
                  width: 14, height: 14, color: 'var(--text-tertiary)',
                  marginLeft: 'auto', transform: 'rotate(180deg)',
                }}
                weight="bold"
              />
            </button>
          ))}
        </div>

        <Button variant="ghost" onClick={() => navigate(-1)} style={{ margin: '0 auto', display: 'inline-flex' }}>
          <ArrowLeft style={{ width: 14, height: 14 }} weight="bold" /> Go back
        </Button>
      </div>
    </div>
  );
}
