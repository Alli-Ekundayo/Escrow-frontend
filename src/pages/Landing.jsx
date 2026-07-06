import { Link } from 'react-router-dom';
import { NavBar } from '../components/landing/NavBar';
import { HeroBand } from '../components/landing/HeroBand';
import {
  LockSimple,
  CheckCircle,
  Handshake,
  ShieldCheck,
  ArrowRight,
  GithubLogo,
  TwitterLogo,
  LinkedinLogo,
} from '@phosphor-icons/react';

/* ─── How it works steps ─── */
const HOW_STEPS = [
  {
    icon: Handshake,
    title: 'Agree on terms',
    body: 'Buyer and seller agree on the scope, price, and milestones before any money moves.',
  },
  {
    icon: LockSimple,
    title: 'Funds go into escrow',
    body: 'Buyer deposits funds. Money sits safely with Es-crow , untouchable by either party until work is approved.',
  },
  {
    icon: CheckCircle,
    title: 'Work gets delivered',
    body: 'Seller completes work and submits proof. Buyer reviews and approves each milestone.',
  },
  {
    icon: ShieldCheck,
    title: 'Money is released',
    body: 'Once approved, funds transfer instantly. If there\'s a dispute, our AI-assisted team mediates fairly.',
  },
];

/* ─── Feature cards ─── */
const FEATURES = [
  {
    tag: 'Protection',
    headline: 'Zero risk for buyers.',
    body: 'Your money stays locked until you confirm the work is exactly what was agreed. No more paying for nothing.',
    surface: 'sage',
  },
  {
    tag: 'Trust',
    headline: 'Guaranteed pay for sellers.',
    body: 'Funds are already committed before you start. No chasing invoices. No payment delays.',
    surface: 'green',
  },
  {
    tag: 'Disputes',
    headline: 'Fair resolution, every time.',
    body: 'Our AI-assisted dispute engine reviews evidence from both sides and reaches a decision in under 48 hours.',
    surface: 'dark',
  },
];

/* ─── Surface style map ─── */
const SURFACE_STYLE = {
  sage: {
    card: { backgroundColor: 'var(--l-canvas-soft)' },
    tag: { color: 'var(--l-ink)', backgroundColor: 'var(--l-canvas)' },
    headline: { color: 'var(--l-ink)' },
    body: { color: 'var(--l-body)' },
  },
  green: {
    card: { backgroundColor: 'var(--l-primary-pale)' },
    tag: { color: 'var(--l-ink)', backgroundColor: 'var(--l-canvas)' },
    headline: { color: 'var(--l-ink)' },
    body: { color: 'var(--l-body)' },
  },
  dark: {
    card: { backgroundColor: 'var(--l-ink)' },
    tag: { color: 'var(--l-canvas)', backgroundColor: 'rgba(255,255,255,0.12)' },
    headline: { color: 'var(--l-primary)' },
    body: { color: 'rgba(255,255,255,0.65)' },
  },
};

/* ─── Section heading style ─── */
const sectionHeading = {
  fontFamily: 'var(--l-font-sans)',
  fontSize: 'clamp(32px, 4vw, 40px)',
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  color: 'var(--l-ink)',
  margin: 0,
};

const sectionSub = {
  fontFamily: 'var(--l-font-sans)',
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '28px',
  color: 'var(--l-body)',
  maxWidth: '52ch',
  margin: '16px auto 0',
};

export default function Landing() {
  return (
    <div className="landing-theme" style={{ backgroundColor: 'var(--l-canvas)', minHeight: '100vh' }}>

      {/* ── Nav ─────────────────────────────────── */}
      <NavBar />

      {/* ── Hero ────────────────────────────────── */}
      <HeroBand />

      {/* ── How It Works ────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          backgroundColor: 'var(--l-canvas)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={sectionHeading}>How it works</h2>
            <p style={sectionSub}>
              Four simple steps from agreement to payment , with your money protected the whole way through.
            </p>
          </div>

          {/* Steps grid */}
          <div className="how-steps-grid">
            {HOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="how-step-card">
                  {/* Number + icon row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--l-font-sans)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--l-mute)',
                        minWidth: '20px',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--l-primary-pale)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon weight="bold" style={{ width: '20px', height: '20px', color: 'var(--l-ink)' }} />
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--l-font-sans)',
                      fontSize: '20px',
                      fontWeight: 700,
                      lineHeight: '28px',
                      color: 'var(--l-ink)',
                      margin: '0 0 10px',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--l-font-sans)',
                      fontSize: '15px',
                      fontWeight: 400,
                      lineHeight: '24px',
                      color: 'var(--l-body)',
                      margin: 0,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features / Why Es-crow ───────────────── */}
      <section
        style={{
          backgroundColor: 'var(--l-canvas-soft)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={sectionHeading}>Built for both sides of the deal.</h2>
            <p style={sectionSub}>
              Whether you're paying or getting paid, Es-crow has you covered.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f) => {
              const s = SURFACE_STYLE[f.surface];
              return (
                <div
                  key={f.tag}
                  style={{
                    ...s.card,
                    borderRadius: 'var(--l-radius-xl)',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <span
                    style={{
                      ...s.tag,
                      display: 'inline-block',
                      fontFamily: 'var(--l-font-sans)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      borderRadius: 'var(--l-radius-pill)',
                      padding: '4px 12px',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {f.tag}
                  </span>
                  <h3
                    style={{
                      ...s.headline,
                      fontFamily: 'var(--l-font-sans)',
                      fontSize: 'clamp(24px, 2.5vw, 32px)',
                      fontWeight: 900,
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      margin: 0,
                    }}
                  >
                    {f.headline}
                  </h3>
                  <p
                    style={{
                      ...s.body,
                      fontFamily: 'var(--l-font-sans)',
                      fontSize: '15px',
                      lineHeight: '24px',
                      margin: 0,
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--l-ink)',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--l-font-sans)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--l-primary)',
              margin: '0 0 20px',
            }}
          >
            Ready to transact with confidence?
          </h2>
          <p
            style={{
              fontFamily: 'var(--l-font-sans)',
              fontSize: '18px',
              lineHeight: '28px',
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 40px',
              maxWidth: '44ch',
              marginInline: 'auto',
            }}
          >
            Join 2,000+ freelancers and clients who already trust Es-crow for their deals.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--l-primary)',
                color: 'var(--l-on-primary)',
                fontFamily: 'var(--l-font-sans)',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '24px',
                padding: '14px 28px',
                borderRadius: 'var(--l-radius-xl)',
                textDecoration: 'none',
                borderBottom: 'none',
                border: 'none',
              }}
            >
              Get started free
              <ArrowRight weight="bold" style={{ width: '16px', height: '16px' }} />
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--l-font-sans)',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '24px',
                padding: '14px 28px',
                borderRadius: 'var(--l-radius-xl)',
                textDecoration: 'none',
                borderBottom: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer
        style={{
          backgroundColor: 'var(--l-ink)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '48px 24px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          {/* Top row */}
          <div className="footer-top-row">
            {/* Brand */}
            <div style={{ flex: '1 1 240px' }}>
              <Link
                to="/"
                style={{
                  fontFamily: 'var(--l-font-sans)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#fff',
                  textDecoration: 'none',
                  borderBottom: 'none',
                }}
              >
                Es-crow
              </Link>
              <p
                style={{
                  fontFamily: 'var(--l-font-sans)',
                  fontSize: '14px',
                  lineHeight: '22px',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '12px',
                  maxWidth: '28ch',
                }}
              >
                Secure escrow payments for freelancers and clients worldwide.
              </p>
            </div>

            {/* Links */}
            <div className="footer-links-row">
              {[
                { label: 'Product', links: ['How it works', 'Pricing', 'Security'] },
                { label: 'Company', links: ['About', 'Blog', 'Careers'] },
                { label: 'Support', links: ['Help centre', 'Contact', 'Status'] },
              ].map((col) => (
                <div key={col.label} style={{ minWidth: '120px' }}>
                  <p
                    style={{
                      fontFamily: 'var(--l-font-sans)',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.35)',
                      margin: '0 0 16px',
                    }}
                  >
                    {col.label}
                  </p>
                  {col.links.map((l) => (
                    <a
                      key={l}
                      href="#"
                      style={{
                        display: 'block',
                        fontFamily: 'var(--l-font-sans)',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        borderBottom: 'none',
                        marginBottom: '10px',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.target.style.color = '#fff')}
                      onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.6)')}
                    >
                      {l}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--l-font-sans)',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} Es-crow. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[GithubLogo, TwitterLogo, LinkedinLogo].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    borderBottom: 'none',
                    display: 'flex',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  aria-label={['GitHub', 'Twitter', 'LinkedIn'][i]}
                >
                  <Icon weight="fill" style={{ width: '18px', height: '18px' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Responsive layout styles ─────────────── */}
      <style>{`
        /* How-it-works steps */
        .how-steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 640px) {
          .how-steps-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .how-steps-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .how-step-card {
          background: var(--l-canvas-soft);
          border-radius: var(--l-radius-xl);
          padding: 28px 24px;
        }

        /* Features grid */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .features-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* Footer top row */
        .footer-top-row {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .footer-top-row {
            flex-direction: row;
            align-items: flex-start;
            gap: 48px;
          }
        }

        /* Footer links cluster */
        .footer-links-row {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
          flex: 1;
          justify-content: flex-start;
        }
        @media (min-width: 768px) {
          .footer-links-row { justify-content: flex-end; }
        }

        /* Nav links , hide on mobile */
        .nav-links-desktop {
          display: none !important;
        }
        @media (min-width: 768px) {
          .nav-links-desktop { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
