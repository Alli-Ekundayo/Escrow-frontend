import { ArrowRight } from '@phosphor-icons/react';

const SAMPLE_ESCROW = {
  amount: 5000,
  currency: 'USD',
  from: { initials: 'YO', label: 'You' },
  to: { initials: 'AL', label: 'Alex' },
  milestones: { complete: 2, total: 4 },
  status: 'Funding in progress',
  timestamp: '2h ago',
};

export function EscrowPreviewCard() {
  const { amount, currency, from, to, milestones, status, timestamp } = SAMPLE_ESCROW;
  const progressPct = (milestones.complete / milestones.total) * 100;

  return (
    <div
      style={{
        backgroundColor: 'var(--l-canvas)',
        borderRadius: 'var(--l-radius-xl)',
        padding: '24px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            backgroundColor: 'var(--l-primary-pale)',
            color: 'var(--l-positive-deep)',
            fontFamily: 'var(--l-font-sans)',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            borderRadius: 'var(--l-radius-pill)',
            padding: '4px 12px',
          }}
        >
          {status}
        </span>
        <span
          style={{
            color: 'var(--l-mute)',
            fontFamily: 'var(--l-font-sans)',
            fontSize: '12px',
            lineHeight: '16px',
          }}
        >
          {timestamp}
        </span>
      </div>

      {/* Amount block */}
      <div style={{ marginTop: '16px' }}>
        <div
          style={{
            fontFamily: 'var(--l-font-sans)',
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: '38.4px',
            letterSpacing: '-0.96px',
            color: 'var(--l-ink)',
          }}
        >
          ${amount.toLocaleString()}
        </div>
        <div
          style={{
            fontFamily: 'var(--l-font-sans)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            color: 'var(--l-mute)',
          }}
        >
          {currency}
        </div>
      </div>

      {/* Party row */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* From avatar */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '9999px',
              backgroundColor: 'var(--l-canvas-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--l-font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--l-ink)',
              flexShrink: 0,
            }}
          >
            {from.initials}
          </div>

          {/* Arrow */}
          <ArrowRight
            weight="bold"
            style={{ width: '16px', height: '16px', color: 'var(--l-mute)', flexShrink: 0 }}
          />

          {/* To avatar */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '9999px',
              backgroundColor: 'var(--l-primary-pale)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--l-font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--l-ink)',
              flexShrink: 0,
            }}
          >
            {to.initials}
          </div>
        </div>
        <div
          style={{
            marginTop: '8px',
            fontFamily: 'var(--l-font-sans)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            color: 'var(--l-ink)',
          }}
        >
          {from.label} → {to.label}
        </div>
      </div>

      {/* Milestone progress */}
      <div style={{ marginTop: '24px' }}>
        <div
          style={{
            fontFamily: 'var(--l-font-sans)',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            color: 'var(--l-ink)',
            marginBottom: '8px',
          }}
        >
          Milestone progress
        </div>
        <div
          role="progressbar"
          aria-valuenow={milestones.complete}
          aria-valuemin={0}
          aria-valuemax={milestones.total}
          aria-label={`${milestones.complete} of ${milestones.total} milestones complete`}
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--l-canvas-soft)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPct}%`,
              height: '100%',
              backgroundColor: 'var(--l-primary)',
              borderRadius: '4px',
            }}
          />
        </div>
        <div
          style={{
            marginTop: '8px',
            fontFamily: 'var(--l-font-sans)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            color: 'var(--l-mute)',
          }}
        >
          {milestones.complete} of {milestones.total} milestones complete
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid var(--l-canvas-soft)',
        }}
      >
        <a
          href="#"
          style={{
            fontFamily: 'var(--l-font-sans)',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            color: 'var(--l-ink)',
            textDecoration: 'none',
            borderBottom: 'none',
          }}
        >
          View agreement →
        </a>
      </div>
    </div>
  );
}
