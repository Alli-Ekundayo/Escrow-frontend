import { EscrowPreviewCard } from './EscrowPreviewCard';

export function HeroBand() {
  return (
    <section
      style={{
        backgroundColor: 'var(--l-canvas-soft)',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
        className="hero-band-inner"
      >
        {/* Left column — headline + CTAs */}
        <div style={{ flex: '1 1 60%' }}>
          <h1
            style={{
              fontFamily: 'var(--l-font-sans)',
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 900,
              lineHeight: 0.85,
              color: 'var(--l-ink)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Money that moves only when the work is done.
          </h1>
          <p
            style={{
              fontFamily: 'var(--l-font-sans)',
              fontSize: '20px',
              fontWeight: 400,
              lineHeight: '30px',
              color: 'var(--l-body)',
              maxWidth: '50ch',
              marginTop: '24px',
              marginBottom: 0,
            }}
          >
            Escrow protects both sides. Funds release automatically when milestones are met. No chasing payments, no disputes over delivery.
          </p>

          {/* CTA row */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginTop: '32px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--l-primary)',
                color: 'var(--l-on-primary)',
                fontFamily: 'var(--l-font-sans)',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '24px',
                padding: '12px 24px',
                borderRadius: 'var(--l-radius-xl)',
                textDecoration: 'none',
                borderBottom: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Create an escrow
            </a>
            <a
              href="#how-it-works"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--l-canvas)',
                color: 'var(--l-ink)',
                fontFamily: 'var(--l-font-sans)',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '24px',
                padding: '12px 24px',
                borderRadius: 'var(--l-radius-xl)',
                textDecoration: 'none',
                borderBottom: 'none',
                border: '1px solid var(--l-ink)',
                cursor: 'pointer',
              }}
            >
              How it works
            </a>
          </div>

          {/* Trust micro-line */}
          <p
            style={{
              fontFamily: 'var(--l-font-sans)',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '16px',
              color: 'var(--l-mute)',
              marginTop: '16px',
              marginBottom: 0,
            }}
          >
            Trusted by 2,000+ freelancers and clients
          </p>
        </div>

        {/* Right column — escrow card */}
        <div style={{ flex: '1 1 40%' }}>
          <EscrowPreviewCard />
        </div>
      </div>

      {/* Responsive: side-by-side at desktop */}
      <style>{`
        @media (min-width: 1024px) {
          .hero-band-inner {
            flex-direction: row !important;
            align-items: center !important;
            gap: 48px !important;
          }
        }
        @media (max-width: 767px) {
          .hero-band-inner {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
