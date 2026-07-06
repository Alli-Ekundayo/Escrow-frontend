import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgreement, useSubmitProof } from '../hooks/useAgreements';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { ArrowLeft, Upload, CheckCircle } from '@phosphor-icons/react';
import { useUIStore } from '../stores/uiStore';

export default function SubmitProof() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const { data: agreement, isLoading } = useAgreement(id);
  const submitProofMutation = useSubmitProof(id);
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);

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
          aria-label="Loading deliverable proof form"
          style={{
            width: 28, height: 28,
            border: '2.5px solid #9fe870', borderBottomColor: 'transparent',
            borderRadius: '50%',
          }}
          className="animate-spin"
        />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)' }}>Loading…</p>
      </div>
    );
  }

  if (!agreement) {
    return (
      <Card style={{ textAlign: 'center', padding: '48px 24px', maxWidth: 500, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-secondary)', marginBottom: 16 }}>Not found.</p>
        <Button onClick={() => navigate('/dashboard')} size="sm">Go back</Button>
      </Card>
    );
  }

  const unmetMilestones = agreement.milestones?.filter((m) => !m.is_met) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMilestone) { addToast('Select a milestone.', 'warning'); return; }
    if (!file && !description.trim()) { addToast('Provide a file or description.', 'warning'); return; }
    const formData = new FormData();
    formData.append('milestone_id', selectedMilestone);
    if (file) formData.append('proof_file', file);
    if (description) formData.append('proof_description', description);
    try { await submitProofMutation.mutateAsync(formData); navigate(`/agreements/${id}`); } catch { }
  };

  return (
    <div style={{
      maxWidth: 660, margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Back */}
      <button
        onClick={() => navigate(`/agreements/${id}`)}
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
        <ArrowLeft style={{ width: 14, height: 14 }} weight="bold" /> Back to Agreement
      </button>

      <div>
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 26, fontWeight: 900, letterSpacing: '-0.025em',
          color: 'var(--text-primary)', margin: '0 0 4px',
        }}>
          Submit Deliverable Proof
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          Provide evidence that milestone conditions have been completed.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card>
          <CardHeader><CardTitle>Proof Details</CardTitle></CardHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Milestone selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
              }}>
                Select Milestone
              </label>
              <select
                value={selectedMilestone}
                onChange={(e) => setSelectedMilestone(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10, color: 'var(--text-primary)',
                  fontFamily: "'Inter', sans-serif", fontSize: 14,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <option value="">Choose an unmet milestone</option>
                {unmetMilestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.description.substring(0, 70)}…
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Completion Notes"
              rows={4}
              placeholder="What was done, how to verify, links…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* File drop zone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
              }}>
                Upload File <span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>(Optional)</span>
              </label>
              <div
                style={{
                  position: 'relative',
                  border: `2px dashed ${dragging || focused ? '#9fe870' : 'var(--border-default)'}`,
                  backgroundColor: dragging || focused ? 'rgba(159,232,112,0.06)' : 'var(--bg-surface-alt)',
                  boxShadow: focused ? '0 0 0 3px rgba(159, 232, 112, 0.2)' : 'none',
                  borderRadius: 14,
                  padding: '32px 24px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                }}
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDrop={() => setDragging(false)}
              >
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  accept="image/*,application/pdf"
                />
                {file ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle style={{ width: 20, height: 20, color: '#1a5c2a', flexShrink: 0 }} weight="fill" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a5c2a' }}>
                      {file.name}
                    </span>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      backgroundColor: 'var(--bg-surface)',
                      border: '1.5px solid var(--border-default)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 12,
                    }}>
                      <Upload style={{ width: 20, height: 20, color: 'var(--text-tertiary)' }} weight="bold" />
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px' }}>
                      Drop file here or click to browse
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
                      PNG, JPG, PDF , up to 10 MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button variant="secondary" type="button" onClick={() => navigate(`/agreements/${id}`)}>Cancel</Button>
          <Button type="submit" loading={submitProofMutation.isPending}>
            Submit Evidence
          </Button>
        </div>
      </form>
    </div>
  );
}
