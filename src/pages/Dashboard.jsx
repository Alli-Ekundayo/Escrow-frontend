import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgreements } from '../hooks/useAgreements';
import { AgreementCard } from '../components/AgreementCard';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';
import { PlusCircle, Wallet, ArrowUpRight, Bank } from '@phosphor-icons/react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { formatCurrency } from '../utils/format';
import { withdraw } from '../api/auth';

function getTrustLabel(score) {
  if (score >= 90) return { label: 'Exceptional', cls: 'badge-active' };
  if (score >= 80) return { label: 'Excellent', cls: 'badge-active' };
  if (score >= 60) return { label: 'Good', cls: 'badge-pending' };
  if (score >= 40) return { label: 'Fair', cls: 'badge-pending' };
  return { label: 'Needs Work', cls: 'badge-disputed' };
}

const statIcon = (bg, text) => ({
  width: 40, height: 40,
  borderRadius: 11,
  backgroundColor: bg,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
  color: text,
});

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuthStore();
  const { data: agreements = [], isLoading } = useAgreements();
  const addToast = useUIStore((s) => s.addToast);

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawBank, setWithdrawBank] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPending, setWithdrawPending] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawBank || !withdrawAccount || !withdrawAmount) return;
    const amountVal = parseFloat(withdrawAmount);
    if (amountVal > (user?.wallet_balance || 0)) {
      addToast('Insufficient balance.', 'warning');
      return;
    }
    setWithdrawPending(true);
    try {
      await withdraw({
        amount: amountVal,
        account_number: withdrawAccount,
        bank_code: withdrawBank,
      });
      addToast('Withdrawal initiated successfully.', 'success');
      setIsWithdrawOpen(false);
      setWithdrawBank('');
      setWithdrawAccount('');
      setWithdrawAmount('');
      fetchProfile();
    } catch (err) {
      addToast(err.response?.data?.detail || 'Withdrawal failed. Please check details.', 'error');
    } finally {
      setWithdrawPending(false);
    }
  };

  const activeAgreements = agreements.filter(
    (a) => a.status === 'active' || a.status === 'pending_proof'
  );
  const totalLocked = activeAgreements.reduce((sum, a) => sum + parseFloat(a.amount || 0), 0);
  const trustScore = user?.trust_score ?? 0;
  const trust = getTrustLabel(trustScore);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Welcome back, {user?.first_name || 'User'}
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: 'var(--text-secondary)',
              margin: '4px 0 0',
            }}>
              Monitor your escrow transactions and milestones.
            </p>
          </div>
          <Button onClick={() => navigate('/create')} size="md" style={{ flexShrink: 0 }}>
            <PlusCircle style={{ width: 16, height: 16 }} weight="bold" />
            Create Agreement
          </Button>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }} id="dashboard-stats">
        {/* Locked funds , wide */}
        <div style={{ gridColumn: 'span 3' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 152 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: 'var(--text-secondary)', margin: 0,
              }}>
                Active Locked Funds
              </p>
              <div style={statIcon('#e2f6d5', '#1a5c2a')}>
                <Wallet style={{ width: 18, height: 18 }} weight="fill" />
              </div>
            </div>
            <div>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 36, fontWeight: 900,
                letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {formatCurrency(totalLocked)}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Across {activeAgreements.length} active agreement{activeAgreements.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        </div>

        {/* Nomba wallet */}
        <div style={{ gridColumn: 'span 2' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 152 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: 'var(--text-secondary)', margin: 0,
                }}>
                  Nomba Wallet Balance
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 900,
                  letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '4px 0 0',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {formatCurrency(user?.wallet_balance || 0)}
                </p>
              </div>
              <div style={statIcon('#E1F3FE', '#1F6C9F')}>
                <Bank style={{ width: 18, height: 18 }} weight="fill" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <p style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
                  margin: 0, fontVariantNumeric: 'tabular-nums',
                }}>
                  Acct: {user?.nomba_account_number || 'Provisioning…'}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                  Nomba MFB ({user?.nomba_bank_code || 'NMB'})
                </p>
              </div>
              {user?.nomba_account_number && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="xs" variant="outline" onClick={() => navigate('/fund')} style={{ padding: '4px 10px', fontSize: 11 }}>
                    Fund
                  </Button>
                  <Button size="xs" onClick={() => setIsWithdrawOpen(true)} style={{ padding: '4px 10px', fontSize: 11 }}>
                    Withdraw
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Active agreements */}
        <div style={{ gridColumn: 'span 2' }}>
          <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: 'var(--text-secondary)', margin: '0 0 4px',
              }}>
                Active Agreements
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 900,
                letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {activeAgreements.length}
              </p>
            </div>
            <div style={statIcon('#e2f6d5', '#1a5c2a')}>
              <ArrowUpRight style={{ width: 18, height: 18 }} weight="fill" />
            </div>
          </Card>
        </div>

        {/* Trust score */}
        <div style={{ gridColumn: 'span 3' }}>
          <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                color: 'var(--text-primary)', margin: '0 0 4px',
              }}>
                Trust Score
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 12,
                color: 'var(--text-secondary)', margin: 0, maxWidth: '28ch',
              }}>
                Based on dispute ratios, milestone completion, and validation metrics.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 16, flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 900,
                  letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: 0,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {trustScore}
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: 'var(--text-tertiary)', margin: 0,
                }}>
                  of 100
                </p>
              </div>
              <span className={`${trust.cls}`} style={{
                padding: '4px 12px', borderRadius: 9999,
                fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700,
                letterSpacing: '0.02em', whiteSpace: 'nowrap',
              }}>
                {trust.label}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Agreements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{
            fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700,
            letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0,
          }}>
            Recent Agreements
          </h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/agreements')}>
            View All
          </Button>
        </div>
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} aria-busy="true" aria-label="Loading agreements">
            <CardSkeleton /><CardSkeleton />
          </div>
        ) : agreements.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '64px 32px' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              backgroundColor: '#e2f6d5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <PlusCircle style={{ width: 22, height: 22, color: '#1a5c2a' }} weight="bold" />
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
              No agreements yet
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 24px', maxWidth: '32ch', marginLeft: 'auto', marginRight: 'auto' }}>
              Create your first escrow agreement to start transacting with confidence.
            </p>
            <Button onClick={() => navigate('/create')} size="sm">Create agreement</Button>
          </Card>
        ) : (
          <div className="stagger-children recent-agreements-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {agreements.slice(0, 4).map((a) => <AgreementCard key={a.id} agreement={a} />)}
          </div>
        )}
      </div>

      <style>{`
        #dashboard-stats > div, .recent-agreements-grid > div {
          min-width: 0;
        }
        @media (max-width: 1023px) {
          #dashboard-stats { grid-template-columns: repeat(2, 1fr) !important; }
          #dashboard-stats > div { grid-column: span 1 !important; }
        }
        @media (max-width: 767px) {
          .recent-agreements-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 639px) {
          #dashboard-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Withdraw Modal */}
      {isWithdrawOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          fontFamily: "'Inter', system-ui, sans-serif",
          padding: 16
        }}>
          <Card style={{ width: '100%', maxWidth: 420, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--border-default)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <CardHeader style={{ padding: 0 }}>
              <CardTitle style={{ margin: 0 }}>Withdraw Funds</CardTitle>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Transfer balance from your virtual wallet to a personal bank account.
              </p>
            </CardHeader>

            <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Destination Bank</label>
                <select
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  style={{
                    width: '100%', backgroundColor: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-default)', borderRadius: 10,
                    color: 'var(--text-primary)', padding: '10px 14px', fontSize: 14, outline: 'none'
                  }}
                  required
                >
                  <option value="">Choose bank</option>
                  <option value="044">Access Bank</option>
                  <option value="023">Citibank Nigeria</option>
                  <option value="050">Ecobank Nigeria</option>
                  <option value="070">Fidelity Bank</option>
                  <option value="011">First Bank of Nigeria</option>
                  <option value="214">First City Monument Bank</option>
                  <option value="058">Guaranty Trust Bank</option>
                  <option value="101">Providus Bank</option>
                  <option value="305">Paycom (Opay)</option>
                  <option value="076">Polaris Bank</option>
                  <option value="039">Stanbic IBTC Bank</option>
                  <option value="232">Sterling Bank</option>
                  <option value="033">United Bank for Africa</option>
                  <option value="035">Wema Bank</option>
                  <option value="057">Zenith Bank</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Account Number</label>
                <input
                  type="text"
                  maxLength={10}
                  pattern="\d{10}"
                  placeholder="10-digit NUBAN"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%', backgroundColor: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-default)', borderRadius: 10,
                    color: 'var(--text-primary)', padding: '10px 14px', fontSize: 14, outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Amount (NGN)</label>
                <input
                  type="number"
                  min="100"
                  step="0.01"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{
                    width: '100%', backgroundColor: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-default)', borderRadius: 10,
                    color: 'var(--text-primary)', padding: '10px 14px', fontSize: 14, outline: 'none'
                  }}
                  required
                />
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                  Max: {formatCurrency(user?.wallet_balance || 0)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <Button variant="secondary" type="button" onClick={() => setIsWithdrawOpen(false)} disabled={withdrawPending}>
                  Cancel
                </Button>
                <Button type="submit" loading={withdrawPending}>
                  Withdraw
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </section>
  );
}

