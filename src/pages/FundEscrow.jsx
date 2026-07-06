import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { ArrowLeft, CreditCard, Bank, CheckCircle } from '@phosphor-icons/react';
import axios from 'axios';

export default function FundEscrow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, fetchProfile } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const amountParam = searchParams.get('amount') || '5000';
  const agreementId = searchParams.get('agreementId') || '';
  const [depositAmount, setDepositAmount] = useState(amountParam);
  const [simulating, setSimulating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      await axios.post('/api/payments/webhook/', {
        event: 'collection.credit',
        data: {
          reference: `sim-ref-${Date.now()}`,
          merchantTxRef: agreementId ? `tf-${agreementId}` : `tf-manual-${Date.now()}`,
          amount: parseFloat(depositAmount),
          accountNumber: user?.nomba_account_number,
          bankCode: user?.nomba_bank_code || 'NMB',
        },
      });
      setSuccess(true);
      addToast('Sandbox transfer simulated. Wallet credited.', 'success');
      setTimeout(() => navigate(agreementId ? `/agreements/${agreementId}` : '/dashboard'), 2000);
    } catch {
      addToast('Simulation failed.', 'error');
    } finally {
      setSimulating(false);
    }
  };

  const backPath = agreementId ? `/agreements/${agreementId}` : '/dashboard';

  return (
    <div style={{
      maxWidth: 600, margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Back */}
      <button
        onClick={() => navigate(backPath)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
          color: 'var(--text-secondary)', padding: '6px 0',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} weight="bold" /> Back
      </button>

      <div>
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 26, fontWeight: 900, letterSpacing: '-0.025em',
          color: 'var(--text-primary)', margin: '0 0 4px',
        }}>
          Fund Virtual Account
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          Deposit into your Nomba virtual account to fund escrow.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Bank details */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                backgroundColor: '#E1F3FE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bank style={{ width: 15, height: 15, color: '#1F6C9F' }} weight="fill" />
              </div>
              Bank Transfer
            </CardTitle>
          </CardHeader>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 14px' }}>
            Transfer from your banking app to:
          </p>
          <div style={{
            backgroundColor: 'var(--bg-surface-alt)',
            border: '1.5px solid var(--border-default)',
            borderRadius: 10, padding: 16,
            display: 'flex', flexDirection: 'column', gap: 10,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: 13,
          }}>
            {[
              ['Bank', user?.nomba_bank_code === 'NMB' ? 'Nombank MFB' : 'MFB'],
              ['Account', user?.nomba_account_number || 'Provisioning…'],
              ['Name', user ? `${user.first_name} ${user.last_name}` : 'Es-crow User'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{
                  fontWeight: 700, color: 'var(--text-primary)',
                  letterSpacing: label === 'Account' ? '0.05em' : 'normal',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Sandbox simulator */}
        {!import.meta.env.PROD && user?.nomba_test_mode !== false && (
          <Card style={{ border: '1.5px solid #FBF3DB', backgroundColor: 'rgba(251,243,219,0.3)' }}>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-accent-yellow-text)' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  backgroundColor: '#FBF3DB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CreditCard style={{ width: 15, height: 15, color: 'var(--color-accent-yellow-text)' }} weight="fill" />
                </div>
                Sandbox Simulator
              </CardTitle>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                Mock an incoming bank transfer for testing.
              </p>
              <Input
                label="Amount (NGN)"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              {success ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  backgroundColor: '#e2f6d5',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, padding: 14,
                }}>
                  <CheckCircle style={{ width: 18, height: 18, color: '#1a5c2a', flexShrink: 0 }} weight="fill" />
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14, fontWeight: 600, color: '#1a5c2a',
                  }}>
                    Deposit simulated. Redirecting…
                  </span>
                </div>
              ) : (
                <Button onClick={handleSimulate} loading={simulating} variant="copper" className="w-full">
                  Simulate Deposit
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
