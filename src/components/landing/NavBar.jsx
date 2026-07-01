import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <nav
      aria-label="Main navigation"
      style={{
        backgroundColor: 'var(--l-canvas)',
        position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 50,
        borderBottom: '1px solid var(--l-canvas-soft)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: 'var(--l-font-sans)',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--l-ink)',
            textDecoration: 'none',
            borderBottom: 'none',
          }}
        >
          Es-crow
        </Link>

        {/* Nav links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
          className="nav-links-desktop"
        >
          <a
            href="#how-it-works"
            style={{
              fontFamily: 'var(--l-font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--l-ink)',
              textDecoration: 'none',
              borderBottom: 'none',
            }}
          >
            How it works
          </a>
          <a
            href="#pricing"
            style={{
              fontFamily: 'var(--l-font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--l-ink)',
              textDecoration: 'none',
              borderBottom: 'none',
            }}
          >
            Pricing
          </a>
          <a
            href="#about"
            style={{
              fontFamily: 'var(--l-font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--l-ink)',
              textDecoration: 'none',
              borderBottom: 'none',
            }}
          >
            About
          </a>
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--l-canvas)',
              color: 'var(--l-ink)',
              fontFamily: 'var(--l-font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              padding: '8px 16px',
              borderRadius: 'var(--l-radius-xl)',
              textDecoration: 'none',
              borderBottom: 'none',
              border: '1px solid var(--l-ink)',
            }}
          >
            Log in
          </Link>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--l-primary)',
              color: 'var(--l-on-primary)',
              fontFamily: 'var(--l-font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              padding: '8px 16px',
              borderRadius: 'var(--l-radius-xl)',
              textDecoration: 'none',
              borderBottom: 'none',
              border: 'none',
            }}
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
