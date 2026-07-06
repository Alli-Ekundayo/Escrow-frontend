import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAgreements } from '../hooks/useAgreements';
import { useDisputes, useDispute, useRaiseDispute, useSubmitEvidence, useResolveDispute } from '../hooks/useDisputes';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Warning as WarningIcon, ArrowRight, Gavel, Scales, PaperPlaneTilt, User } from '@phosphor-icons/react';
import { useUIStore } from '../stores/uiStore';

const pillLabel = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 11, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'var(--text-secondary)', margin: 0, marginBottom: 4,
};

export default function DisputeCenter() {
  const [searchParams] = useSearchParams();
  const addToast = useUIStore((s) => s.addToast);
  const agreementIdParam = searchParams.get('agreement');

  const { data: disputes = [], isLoading: listLoading, refetch: refetchList } = useDisputes();
  const { data: agreements = [] } = useAgreements();
  const [selectedDisputeId, setSelectedDisputeId] = useState(null);
  const { data: activeDispute, isLoading: detailLoading, refetch: refetchDetail } = useDispute(selectedDisputeId);

  const raiseDisputeMutation = useRaiseDispute();
  const submitEvidenceMutation = useSubmitEvidence(selectedDisputeId);
  const resolveDisputeMutation = useResolveDispute(selectedDisputeId);

  const [newAgreementId, setNewAgreementId] = useState(agreementIdParam || '');
  const [initialEvidence, setInitialEvidence] = useState('');
  const [evidenceText, setEvidenceText] = useState('');

  const handleRaise = async (e) => {
    e.preventDefault();
    if (!newAgreementId) { addToast('Enter an Agreement ID.', 'warning'); return; }
    try {
      await raiseDisputeMutation.mutateAsync({
        agreement: parseInt(newAgreementId),
        buyer_evidence: initialEvidence || 'Dispute raised regarding milestones.',
      });
      setNewAgreementId(''); setInitialEvidence(''); refetchList();
    } catch { }
  };

  const handleEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceText.trim()) return;
    try { await submitEvidenceMutation.mutateAsync(evidenceText); setEvidenceText(''); refetchDetail(); } catch { }
  };

  const spinner = (
    <div style={{
      width: 22, height: 22,
      border: '2.5px solid #9fe870', borderBottomColor: 'transparent',
      borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto',
    }} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div>
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 26, fontWeight: 900, letterSpacing: '-0.025em',
          color: 'var(--text-primary)', margin: '0 0 4px',
        }}>
          Dispute Resolution
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          Submit claims and let the arbitration engine evaluate milestone delivery.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="dispute-grid">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="dispute-left">

          {/* Raise dispute */}
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-accent-yellow-text)' }}>
                <WarningIcon style={{ width: 18, height: 18 }} weight="fill" /> Raise Dispute
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleRaise} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Select
                label="Select Agreement"
                value={newAgreementId}
                onChange={(e) => setNewAgreementId(e.target.value)}
              >
                <option value="" disabled>-- Choose an agreement --</option>
                {agreements.map((a) => (
                  <option key={a.id} value={a.id}>
                    #{a.id} - {a.currency} {a.amount} ({a.status})
                  </option>
                ))}
              </Select>
              <Textarea
                label="Claim / Remarks"
                placeholder="Explain the reason…"
                rows={3}
                value={initialEvidence}
                onChange={(e) => setInitialEvidence(e.target.value)}
              />
              <Button type="submit" variant="copper" loading={raiseDisputeMutation.isPending} className="w-full">
                Initiate <ArrowRight style={{ width: 14, height: 14 }} weight="bold" />
              </Button>
            </form>
          </Card>

          {/* Disputes list */}
          <Card>
            <CardHeader><CardTitle>Disputes</CardTitle></CardHeader>
            {listLoading ? (
              <div style={{ padding: '24px 0', display: 'flex', justifyContent: 'center' }}>{spinner}</div>
            ) : disputes.length === 0 ? (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                No disputes found.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {disputes.map((d) => {
                  const active = selectedDisputeId === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDisputeId(d.id)}
                      style={{
                        padding: '12px 14px', borderRadius: 10,
                        border: active ? '1.5px solid #9fe870' : '1.5px solid var(--border-default)',
                        backgroundColor: active ? '#f5fbf0' : 'var(--bg-surface-alt)',
                        cursor: 'pointer', transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{
                          fontFamily: "'Geist Mono', monospace",
                          fontSize: 11, fontWeight: 700,
                          color: active ? '#1a5c2a' : 'var(--text-secondary)',
                        }}>
                          #{d.id}
                        </span>
                        <Badge status={d.status} />
                      </div>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 13,
                        color: 'var(--text-primary)', margin: 0, fontWeight: 500,
                      }}>
                        Agreement #{d.agreement}
                      </p>
                      <p style={{
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: 11, color: 'var(--text-tertiary)',
                        margin: '2px 0 0', fontVariantNumeric: 'tabular-nums',
                      }}>
                        NGN {d.agreement_amount}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right column , detail */}
        <div className="dispute-right">
          {detailLoading ? (
            <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
              {spinner}
            </Card>
          ) : !activeDispute ? (
            <Card style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              minHeight: '40vh', textAlign: 'center', padding: 40,
              border: '1.5px dashed var(--border-default)',
              backgroundColor: 'transparent',
            }}>
              <Scales style={{ width: 40, height: 40, color: 'var(--text-tertiary)', marginBottom: 16 }} weight="bold" />
              <h3 style={{
                fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700,
                color: 'var(--text-secondary)', margin: '0 0 6px',
              }}>
                No dispute selected
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-tertiary)', margin: 0, maxWidth: '28ch' }}>
                Select a dispute from the list or raise a new one.
              </p>
            </Card>
          ) : (
            <Card style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                borderBottom: '1.5px solid var(--border-default)', paddingBottom: 16,
              }}>
                <div>
                  <h3 style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 800,
                    letterSpacing: '-0.02em', color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', gap: 8, margin: 0,
                  }}>
                    <Scales style={{ width: 18, height: 18 }} weight="fill" /> Dispute #{activeDispute.id}
                  </h3>
                  <p style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 11, color: 'var(--text-tertiary)', margin: '4px 0 0',
                  }}>
                    Agreement #{activeDispute.agreement}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge status={activeDispute.status} />
                  <p style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 800,
                    color: 'var(--text-primary)', margin: '6px 0 0',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    NGN {activeDispute.agreement_amount}
                  </p>
                </div>
              </div>

              {/* Evidence grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { role: 'Buyer', evidence: activeDispute.buyer_evidence, color: '#1a5c2a' },
                  { role: 'Seller', evidence: activeDispute.seller_evidence, color: '#956400' },
                ].map(({ role, evidence, color }) => (
                  <div key={role} style={{
                    backgroundColor: 'var(--bg-surface-alt)',
                    border: '1.5px solid var(--border-default)',
                    borderRadius: 10, padding: 14,
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User style={{ width: 12, height: 12, color }} weight="fill" />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                        {role}
                      </span>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-primary)', fontStyle: 'italic', margin: 0, lineHeight: '20px' }}>
                      {evidence || '(No claims submitted)'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Verdict or arbitration */}
              {activeDispute.status === 'resolved' && activeDispute.ai_ruling ? (
                <div style={{
                  backgroundColor: '#e2f6d5',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, padding: 16,
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Gavel style={{ width: 15, height: 15, color: '#1a5c2a' }} weight="fill" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: '#1a5c2a' }}>
                      Verdict
                    </span>
                  </div>
                  <div style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-default)',
                    borderRadius: 8, padding: 12,
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 12, color: 'var(--text-secondary)', lineHeight: '20px',
                  }}>
                    <p style={{ fontWeight: 700, color: '#1a5c2a', margin: '0 0 6px' }}>
                      Outcome: {activeDispute.ai_ruling.ruling?.toUpperCase()}
                    </p>
                    {activeDispute.ai_ruling.split_ratio && (
                      <p style={{ margin: '0 0 6px' }}>Split: {activeDispute.ai_ruling.split_ratio}</p>
                    )}
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{activeDispute.ai_ruling.reasoning}</p>
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#FBF3DB',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, padding: 16,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Scales style={{ width: 15, height: 15, color: 'var(--color-accent-yellow-text)' }} weight="fill" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--color-accent-yellow-text)' }}>
                      Awaiting arbitration
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: '18px' }}>
                    Trigger arbitration once both parties have submitted statements.
                  </p>
                  <Button
                    onClick={async () => { try { await resolveDisputeMutation.mutateAsync(); refetchDetail(); refetchList(); } catch { } }}
                    loading={resolveDisputeMutation.isPending}
                    variant="copper"
                    size="sm"
                  >
                    <Gavel style={{ width: 14, height: 14 }} weight="bold" /> Trigger Arbitration
                  </Button>
                </div>
              )}

              {activeDispute.status !== 'resolved' && (
                <form onSubmit={handleEvidence} style={{
                  borderTop: '1.5px solid var(--border-default)',
                  paddingTop: 16,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  <Textarea
                    label="Submit evidence / Statement"
                    placeholder="Detailed testimony or explanation…"
                    rows={3}
                    value={evidenceText}
                    onChange={(e) => setEvidenceText(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" loading={submitEvidenceMutation.isPending}>
                      <PaperPlaneTilt style={{ width: 13, height: 13 }} weight="fill" /> Submit
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .dispute-grid { grid-template-columns: 280px 1fr !important; }
        }
      `}</style>
    </div>
  );
}
