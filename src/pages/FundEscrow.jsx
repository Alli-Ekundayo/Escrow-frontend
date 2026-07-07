import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { ArrowLeft, CreditCard, Bank, CheckCircle, X } from '@phosphor-icons/react';
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
  const [verificationPopupOpen, setVerificationPopupOpen] = useState(true);
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
        const wallet = response.data?.wallet;
        if (!wallet?.bankAccountNumber) {
          setProvisioningError(
            `Nomba API succeeded but returned NO 'bankAccountNumber'.\nKeys: ${Object.keys(wallet || {}).join(', ')}\nResponse: ${JSON.stringify(wallet, null, 2)}`
          );
          addToast('Warning: Account number missing from response.', 'warning');
        } else {
          addToast('Virtual account provisioned successfully!', 'success');
        }
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
          setVerificationPopupOpen(true);
          addToast('Payment detected! Escrow is now active.', 'success');
        } else if (!isAuto) {
          addToast('No payment detected yet for this agreement. Please ensure the transfer is complete.', 'info');
        }
      } else {
        const profile = await fetchProfile();
        const currentBalance = profile.wallet_balance || 0;
        if (initialBalance !== null && currentBalance > initialBalance) {
          setCheckSuccess(true);
          setVerificationPopupOpen(true);
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
      setVerificationPopupOpen(false);
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
      // Use the agreement's stored nomba_transaction_ref so the webhook handler
      // can match by reference. Fall back to the old tf-{id} pattern if not loaded.
      const txRef = agreement?.nomba_transaction_ref
        || (agreementId ? `tf-${agreementId}` : `tf-manual-${Date.now()}`);

      // The webhook handler divides the amount by 100 (treats incoming value as kobo).
      // Send kobo here so the amount-matching against the agreement's NGN amount works correctly.
      const amountInKobo = Math.round(parsedDepositAmount * 100);

      await simulateIncomingTransfer({
        event: 'collection.credit',
        data: {
          reference: `sim-ref-${Date.now()}`,
          merchantTxRef: txRef,
          amount: amountInKobo,
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

  return (
    <>
      {verificationPopupOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(6px)',
            animation: 'fadeInOverlay 0.3s ease',
            padding: '16px',
          }}
        >
          <style>{`
            @keyframes fadeInOverlay {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleInModal {
              from { opacity: 0; transform: scale(0.85) translateY(20px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes pulse-ring {
              0% { transform: scale(1); opacity: 0.8; }
              100% { transform: scale(1.5); opacity: 0; }
            }
          `}</style>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid rgba(26, 92, 42, 0.25)',
              borderRadius: 24,
              boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
              padding: '48px 40px 40px',
              maxWidth: 420,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              animation: 'scaleInModal 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
            }}
          >
            {!checkSuccess && (
              <button
                type="button"
                aria-label="Close payment verification popup"
                onClick={() => setVerificationPopupOpen(false)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  padding: 4,
                }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            )}

            <div style={{ position: 'relative', width: 96, height: 96 }}>
              {checkSuccess && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  backgroundColor: 'rgba(26, 92, 42, 0.12)',
                  animation: 'pulse-ring 1.5s ease-out infinite',
                }} />
              )}
              <div style={{
                position: 'relative', zIndex: 1,
                width: 96, height: 96, borderRadius: '50%',
                background: checkSuccess
                  ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                  : 'linear-gradient(135deg, #f8f4e9 0%, #f3ead7 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: checkSuccess
                  ? '0 8px 24px rgba(26, 92, 42, 0.2)'
                  : '0 8px 24px rgba(86, 64, 23, 0.14)',
              }}>
                {checkSuccess ? (
                  <CheckCircle style={{ width: 52, height: 52, color: '#1a5c2a' }} weight="fill" />
                ) : (
                  <svg width="42" height="42" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite', color: '#7f5d29' }}>
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="24" strokeDashoffset="8" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h2 style={{
                fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em',
                color: 'var(--text-primary)', margin: 0,
              }}>
                {checkSuccess ? 'Payment Verified!' : 'Verifying Payment'}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {checkSuccess
                  ? (agreementId
                    ? 'Your transfer has been processed and the escrow agreement is now funded and active.'
                    : 'Your transfer has been verified and your wallet balance has been updated.')
                  : (agreementLoading
                    ? 'Loading agreement status and monitoring your transfer.'
                    : 'We are monitoring your account for the transfer. You can also run a manual check now.')}
              </p>
            </div>

            {checkSuccess ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-default)',
                borderRadius: 999, padding: '8px 16px',
                fontSize: 12, color: 'var(--text-tertiary)',
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="16" strokeDashoffset="8" strokeLinecap="round" />
                </svg>
                Redirecting you automatically…
              </div>
            ) : (
              <Button
                onClick={() => verifyPayment(false)}
                loading={checking}
                variant="secondary"
                size="sm"
                style={{ width: '100%' }}
              >
                Verify Payment Now
              </Button>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: 600, margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: 24,
          fontFamily: "'Inter', system-ui, sans-serif",
          filter: verificationPopupOpen ? 'blur(2px)' : 'none',
          transition: 'filter 0.3s ease',
          pointerEvents: verificationPopupOpen ? 'none' : 'auto',
        }}
      >
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
        {!checkSuccess && !verificationPopupOpen && (
          <Button
            onClick={() => setVerificationPopupOpen(true)}
            variant="outline"
            size="sm"
            style={{ marginTop: 12 }}
          >
            Open Verification Screen
          </Button>
        )}
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
    </>
  );
}
