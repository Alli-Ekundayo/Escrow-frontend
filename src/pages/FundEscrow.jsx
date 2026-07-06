import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { ArrowLeft, CreditCard, Bank, CheckCircle } from '@phosphor-icons/react';
import { getAgreement } from '../api/escrow';
import { simulateIncomingTransfer } from '../api/payments';
import { formatCurrency } from '../utils/format';
import { debugWallet } from '../api/auth';

const FUNDED_STATUSES = new Set(['active', 'pending_proof', 'completed', 'disputed']);
const normalizeStatus = (status) => String(status ?? '').toLowerCase();

export default function FundEscrow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, fetchProfile } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const amountParam = searchParams.get('amount') || '';
  const agreementId = searchParams.get('agreementId') || '';
  const [depositAmount, setDepositAmount] = useState(amountParam);
  const [simulating, setSimulating] = useState(false);
  const [success, setSuccess] = useState(false);

  const [agreement, setAgreement] = useState(null);
  const [agreementLoading, setAgreementLoading] = useState(Boolean(agreementId));
  const [agreementError, setAgreementError] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkSuccess, setCheckSuccess] = useState(false);
  const [initialBalance, setInitialBalance] = useState(null);
  const parsedDepositAmount = Number(depositAmount);
  const hasValidDepositAmount = Number.isFinite(parsedDepositAmount) && parsedDepositAmount > 0;

  const [provisioningError, setProvisioningError] = useState(null);
  const [retryingProvision, setRetryingProvision] = useState(false);

  const handleRetryProvisioning = async () => {
    setRetryingProvision(true);
    setProvisioningError(null);
    try {
      const response = await debugWallet();
      if (response.data?.status === 'success') {
        addToast('Virtual account provisioned successfully!', 'success');
        fetchProfile();
      } else {
        setProvisioningError(response.data?.error_message || 'Provisioning failed');
        addToast('Provisioning failed. See details below.', 'error');
      }
    } catch (err) {
      const errMsg = err.response?.data?.error_message || err.response?.data?.detail || err.message;
      setProvisioningError(errMsg);
      addToast('Provisioning failed. See details below.', 'error');
    } finally {
      setRetryingProvision(false);
    }
  };

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  useEffect(() => {
    if (user && initialBalance === null) {
      setInitialBalance(user.wallet_balance || 0);
    }
  }, [user, initialBalance]);

  useEffect(() => {
    let cancelled = false;
    if (!agreementId) {
      setAgreement(null);
      setAgreementLoading(false);
      setAgreementError('');
      return () => {};
    }

    setAgreementLoading(true);
    setAgreementError('');
    getAgreement(agreementId)
      .then((data) => {
        if (cancelled) return;
        setAgreement(data);
        if (!amountParam && data?.amount != null) {
          setDepositAmount(String(data.amount));
        }
        const status = normalizeStatus(data?.status);
        if (FUNDED_STATUSES.has(status)) {
          setCheckSuccess(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setAgreementError('Unable to load this agreement right now. You can still verify manually.');
      })
      .finally(() => {
        if (!cancelled) setAgreementLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [agreementId, amountParam]);

  const verifyPayment = useCallback(async (isAuto = false) => {
    if (checkSuccess) return;
    if (!isAuto) setChecking(true);
    try {
      if (agreementId) {
        const latestAgreement = await getAgreement(agreementId);
        setAgreement(latestAgreement);
        if (FUNDED_STATUSES.has(normalizeStatus(latestAgreement?.status))) {
          setCheckSuccess(true);
          addToast('Payment detected! Escrow is now active.', 'success');
        } else if (!isAuto) {
          addToast('No payment detected yet for this agreement. Please ensure the transfer is complete.', 'info');
        }
      } else {
        const profile = await fetchProfile();
        const currentBalance = profile.wallet_balance || 0;
        if (initialBalance !== null && currentBalance > initialBalance) {
          setCheckSuccess(true);
          addToast(`Payment detected! Wallet credited with NGN ${(currentBalance - initialBalance).toLocaleString()}.`, 'success');
        } else if (!isAuto) {
          addToast('No new deposit detected yet. Please ensure the transfer is complete.', 'info');
        }
      }
    } catch (err) {
      if (!isAuto) {
        addToast(err?.response?.data?.detail || 'Verification failed. Please try again.', 'error');
      }
    } finally {
      if (!isAuto) setChecking(false);
    }
  }, [addToast, agreementId, checkSuccess, fetchProfile, initialBalance]);

  useEffect(() => {
    if (checkSuccess) return;
    const interval = setInterval(() => {
      verifyPayment(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [checkSuccess, verifyPayment]);

  useEffect(() => {
    if (!checkSuccess) return () => {};
    const timeout = setTimeout(() => {
      navigate(agreementId ? `/agreements/${agreementId}` : '/dashboard');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [agreementId, checkSuccess, navigate]);

  const handleSimulate = async () => {
    if (!hasValidDepositAmount) {
      addToast('Enter a valid amount before simulating a deposit.', 'error');
      return;
    }
    setSimulating(true);
    try {
      await simulateIncomingTransfer({
        event: 'collection.credit',
        data: {
          reference: `sim-ref-${Date.now()}`,
          merchantTxRef: agreementId ? `tf-${agreementId}` : `tf-manual-${Date.now()}`,
          amount: parsedDepositAmount,
          accountNumber: user?.nomba_account_number,
          bankCode: user?.nomba_bank_code || 'NMB',
        },
      });
      setSuccess(true);
      addToast('Sandbox transfer simulated. Verifying payment status…', 'success');
      await verifyPayment(true);
    } catch {
      addToast('Simulation failed.', 'error');
    } finally {
      setSimulating(false);
    }
  };

  const backPath = agreementId ? `/agreements/${agreementId}` : '/dashboard';

  if (checkSuccess) {
    return (
      <div style={{
        maxWidth: 500, margin: '80px auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 24, fontFamily: "'Inter', sans-serif", textAlign: 'center',
        padding: '48px 32px', backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid var(--border-default)', borderRadius: 16,
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          backgroundColor: '#e2f6d5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle style={{ width: 44, height: 44, color: '#1a5c2a' }} weight="fill" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Payment Verified!
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {agreementId 
              ? 'Your transfer has been successfully processed and the escrow agreement is now funded and active.'
              : 'Your transfer has been verified and your virtual wallet balance has been updated.'
            }
          </p>
        </div>
        <div style={{
          fontSize: 12, color: 'var(--text-tertiary)',
          backgroundColor: 'var(--bg-surface-alt)',
          padding: '8px 16px', borderRadius: 8,
          border: '1px solid var(--border-default)'
        }}>
          Redirecting you automatically...
        </div>
      </div>
    );
  }

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
          {agreementId ? 'Fund Escrow Agreement' : 'Fund Virtual Account'}
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          {agreementId
            ? 'Complete a bank transfer to activate this escrow.'
            : 'Deposit into your Nomba virtual account to fund escrow.'}
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
              ...(agreementId ? [['Reference', `tf-${agreementId}`]] : []),
              ...(agreement?.amount != null ? [['Expected', formatCurrency(agreement.amount, agreement.currency)]] : []),
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
          {(!user?.nomba_account_number) && (
            <div style={{
              marginTop: 14, padding: 12, borderRadius: 8,
              backgroundColor: 'rgba(235, 94, 40, 0.05)',
              border: '1px solid rgba(235, 94, 40, 0.15)',
              display: 'flex', flexDirection: 'column', gap: 8
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Virtual wallet provisioning takes a moment. If it is stuck at 'Provisioning...', you can manually retry.
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleRetryProvisioning} 
                loading={retryingProvision}
                style={{ width: 'fit-content' }}
              >
                Retry Provisioning
              </Button>
              {provisioningError && (
                <pre style={{
                  margin: 0, padding: 8, borderRadius: 4,
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  color: '#dc2626', fontSize: 11,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                  fontFamily: "'Geist Mono', monospace"
                }}>
                  {provisioningError}
                </pre>
              )}
            </div>
          )}
          {agreementError && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--color-accent-red-text)', margin: '10px 0 0' }}>
              {agreementError}
            </p>
          )}
        </Card>

        {/* Payment Verification status card */}
        <Card style={{
          border: checkSuccess ? '1.5px solid #E2F6D5' : '1.5px solid var(--border-default)',
          backgroundColor: checkSuccess ? 'rgba(226,246,213,0.1)' : 'var(--bg-surface-alt)',
        }}>
          <CardHeader style={{ paddingBottom: 8 }}>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700 }}>
              {checkSuccess ? (
                <CheckCircle style={{ width: 18, height: 18, color: '#1a5c2a' }} weight="fill" />
              ) : (
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent-copper)',
                }} />
              )}
              Payment Verification
            </CardTitle>
          </CardHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              {checkSuccess 
                ? 'Payment detected and verified successfully! Redirecting...' 
                : agreementLoading
                  ? 'Loading agreement status...'
                  : 'Monitoring your account for the transfer. You can click verify to check manually at any time.'
              }
            </p>
            {!checkSuccess && (
              <Button 
                onClick={() => verifyPayment(false)} 
                loading={checking} 
                variant="secondary"
                size="sm"
                style={{ width: 'fit-content' }}
              >
                Verify Payment Now
              </Button>
            )}
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
                <Button onClick={handleSimulate} loading={simulating} disabled={!hasValidDepositAmount} variant="copper" className="w-full">
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
