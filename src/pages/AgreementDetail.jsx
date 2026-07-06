import { useParams, useNavigate } from 'react-router-dom';
import { useAgreement, useLockFunds, useReleaseFunds } from '../hooks/useAgreements';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { MilestoneTracker } from '../components/MilestoneTracker';
import {
  ShieldWarning, CreditCard, Sparkle, Prohibit,
  ArrowLeft, ArrowClockwise, Check,
} from '@phosphor-icons/react';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils/format';

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 11, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'var(--text-secondary)', margin: 0,
};

export default function AgreementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: agreement, isLoading, refetch } = useAgreement(id);
  const lockMutation = useLockFunds(id);
  const releaseMutation = useReleaseFunds(id);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '50vh', gap: 12,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <div
          role="status"
          aria-label="Loading agreement"
          style={{
            width: 28, height: 28,
            border: '2.5px solid #9fe870',
            borderBottomColor: 'transparent',
            borderRadius: '50%',
          }}
          className="animate-spin"
        />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)' }}>
          Loading agreement…
        </p>
      </div>
    );
  }

  if (!agreement) {
    return (
      <Card style={{ textAlign: 'center', padding: '48px 24px', maxWidth: 500, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-secondary)', marginBottom: 16 }}>
          Agreement not found.
        </p>
        <Button onClick={() => navigate('/dashboard')} size="sm">Go back</Button>
      </Card>
    );
  }

  const isBuyer = user?.id === agreement.buyer;
  const isSeller = user?.id === agreement.seller;
  const handleLockAndFund = () => {
    lockMutation.mutate(undefined, {
      onSuccess: (data) => {
        const amount = data?.amount ?? agreement.amount;
        navigate(`/fund?agreementId=${agreement.id}&amount=${encodeURIComponent(amount)}`);
      },
    });
  };

  return (
    <div style={{
      maxWidth: 900, margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* Top nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button
          onClick={() => navigate('/agreements')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14, fontWeight: 600,
            color: 'var(--text-secondary)',
            transition: 'color 0.15s ease',
            padding: '6px 0',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} weight="bold" /> Back to Agreements
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <ArrowClockwise style={{ width: 14, height: 14 }} weight="bold" /> Refresh
          </Button>
          <Badge status={agreement.status} />
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="agreement-grid">
        {/* Left: details + milestones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="agreement-main">

          {/* Details card */}
          <Card>
            <CardHeader style={{
              display: 'flex', flexDirection: 'row',
              alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1.5px solid var(--border-default)',
              paddingBottom: 16, marginBottom: 16,
            }}>
              <div>
                <CardTitle style={{ fontSize: 18 }}>Agreement Details</CardTitle>
                <p style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: 11, color: 'var(--text-tertiary)', margin: '4px 0 0',
                }}>
                  #{agreement.id}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 26, fontWeight: 900, letterSpacing: '-0.025em',
                  color: 'var(--text-primary)', margin: 0,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {formatCurrency(agreement.amount, agreement.currency)}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                  Locked amount
                </p>
              </div>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={labelStyle}>Buyer</p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 14,
                    fontWeight: 600, color: 'var(--text-primary)',
                    margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {agreement.buyer_email}
                  </p>
                </div>
                <div>
                  <p style={labelStyle}>Seller</p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 14,
                    fontWeight: 600, color: 'var(--text-primary)',
                    margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {agreement.seller_email}
                  </p>
                </div>
              </div>
              <div>
                <p style={{ ...labelStyle, marginBottom: 8 }}>Conditions</p>
                <p style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: 12, fontStyle: 'italic', lineHeight: '20px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, padding: '14px',
                  margin: 0,
                }}>
                  &ldquo;{agreement.raw_conditions}&rdquo;
                </p>
              </div>
            </div>
          </Card>

          {/* Milestones card */}
          <Card>
            <CardHeader style={{ borderBottom: '1.5px solid var(--border-default)', paddingBottom: 14, marginBottom: 16 }}>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <MilestoneTracker milestones={agreement.milestones} />
          </Card>
        </div>

        {/* Right: actions */}
        <div className="agreement-sidebar">
          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {agreement.status === 'draft' && isBuyer && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    backgroundColor: '#FBF3DB',
                    border: '1.5px solid var(--border-default)',
                    borderRadius: 10, padding: 12,
                  }}>
                    <ShieldWarning style={{ width: 15, height: 15, color: 'var(--color-accent-yellow-text)', flexShrink: 0, marginTop: 2 }} weight="fill" />
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: '18px' }}>
                      Fund this escrow. Money will be held securely in your Nomba vault.
                    </p>
                  </div>
                  <Button onClick={handleLockAndFund} loading={lockMutation.isPending} className="w-full">
                    <CreditCard style={{ width: 15, height: 15 }} weight="bold" /> Lock &amp; Fund Escrow
                  </Button>
                </div>
              )}

              {agreement.status === 'draft' && isSeller && (
                <div style={{
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-surface-alt)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, padding: 16,
                }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                    Waiting for the buyer to fund the escrow.
                  </p>
                </div>
              )}

              {agreement.status === 'awaiting_payment' && isBuyer && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    backgroundColor: '#FBF3DB',
                    border: '1.5px solid var(--border-default)',
                    borderRadius: 10, padding: 12,
                  }}>
                    <ShieldWarning style={{ width: 15, height: 15, color: 'var(--color-accent-yellow-text)', flexShrink: 0, marginTop: 2 }} weight="fill" />
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: '18px' }}>
                      Payment instructions generated. Please transfer funds to activate the escrow.
                    </p>
                  </div>
                  <Button onClick={() => navigate(`/fund?agreementId=${agreement.id}&amount=${encodeURIComponent(agreement.amount)}`)} className="w-full">
                    <CreditCard style={{ width: 15, height: 15 }} weight="bold" /> Continue Funding
                  </Button>
                </div>
              )}

              {agreement.status === 'awaiting_payment' && isSeller && (
                <div style={{
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-surface-alt)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, padding: 16,
                }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                    Waiting for the buyer to complete the bank transfer.
                  </p>
                </div>
              )}

              {agreement.status === 'active' && isSeller && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                    Submit deliverables when ready.
                  </p>
                  <Button onClick={() => navigate(`/agreements/${id}/proof`)} className="w-full">
                    Submit Proof
                  </Button>
                </div>
              )}

              {agreement.status === 'active' && isBuyer && (
                <div style={{
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-surface-alt)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, padding: 16,
                }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                    Waiting for seller to complete milestones.
                  </p>
                </div>
              )}

              {agreement.status === 'pending_proof' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    backgroundColor: '#e2f6d5',
                    border: '1.5px solid var(--border-default)',
                    borderRadius: 10, padding: 12,
                  }}>
                    <Sparkle style={{ width: 15, height: 15, color: '#1a5c2a', flexShrink: 0, marginTop: 2 }} weight="fill" />
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: '18px' }}>
                      Proof submitted. AI evaluating delivery. Buyers can release manually.
                    </p>
                  </div>
                  {isBuyer && (
                    <Button onClick={() => releaseMutation.mutateAsync()} loading={releaseMutation.isPending} className="w-full">
                      <Check style={{ width: 15, height: 15 }} weight="bold" /> Release Funds
                    </Button>
                  )}
                </div>
              )}

              {(agreement.status === 'active' || agreement.status === 'pending_proof') && (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => navigate(`/disputes/raise?agreement=${agreement.id}`)}
                >
                  <Prohibit style={{ width: 15, height: 15 }} weight="bold" /> Raise Dispute
                </Button>
              )}

              {agreement.status === 'completed' && (
                <div style={{
                  textAlign: 'center',
                  backgroundColor: '#e2f6d5',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, padding: 16,
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: '#1a5c2a', margin: 0 }}>
                    Escrow Disbursed
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                    All milestones met. Funds transferred to seller.
                  </p>
                </div>
              )}

              {agreement.status === 'disputed' && (
                <div style={{
                  textAlign: 'center',
                  backgroundColor: '#FDEBEC',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, padding: 16,
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: '#9F2F2D', margin: 0 }}>
                    Under Dispute
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                    AI mediator inspecting evidence.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/disputes')}>
                    Dispute Center
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .agreement-grid { grid-template-columns: 1fr 280px !important; }
          .agreement-sidebar { order: 1; }
          .agreement-main { grid-column: 1; }
        }
      `}</style>
    </div>
  );
}
