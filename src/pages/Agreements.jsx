import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgreements } from '../hooks/useAgreements';
import { AgreementCard } from '../components/AgreementCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import { FileText, PlusCircle, FunnelSimple } from '@phosphor-icons/react';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'pending_proof', label: 'Pending Proof' },
  { value: 'completed', label: 'Completed' },
  { value: 'disputed', label: 'Disputed' },
  { value: 'refunded', label: 'Refunded' },
];

export default function Agreements() {
  const navigate = useNavigate();
  const { data: agreements = [], isLoading } = useAgreements();
  const [filter, setFilter] = useState('all');

  const filtered = agreements.filter((a) => filter === 'all' || a.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 26, fontWeight: 900, letterSpacing: '-0.025em',
            color: 'var(--text-primary)', margin: '0 0 4px',
          }}>
            All Agreements
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            Manage your buyer and seller escrow contracts.
          </p>
        </div>
        <Button onClick={() => navigate('/create')}>
          <PlusCircle style={{ width: 16, height: 16 }} weight="bold" /> Create Agreement
        </Button>
      </div>

      {/* Filter pills */}
      <div
        role="tablist"
        aria-label="Filter agreements"
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          overflowX: 'auto', paddingBottom: 4,
          scrollbarWidth: 'none',
        }}
      >
        <FunnelSimple style={{ width: 15, height: 15, color: 'var(--text-secondary)', flexShrink: 0, marginRight: 4 }} weight="bold" />
        {filterOptions.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            aria-selected={filter === value}
            onClick={() => setFilter(value)}
            style={{
              padding: '6px 16px',
              borderRadius: 9999,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13, fontWeight: filter === value ? 700 : 500,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              border: filter === value ? '1.5px solid #9fe870' : '1.5px solid var(--border-default)',
              backgroundColor: filter === value ? '#9fe870' : 'var(--bg-surface)',
              color: filter === value ? '#0e0f0c' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '56px 24px' }}>
          <FileText style={{ width: 40, height: 40, color: 'var(--text-tertiary)', margin: '0 auto 16px' }} weight="bold" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 4px' }}>
            {filter === 'all' ? 'No agreements yet.' : 'No agreements match this filter.'}
          </p>
          {filter === 'all' && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-tertiary)', margin: '0 0 20px' }}>
              Create your first escrow agreement to get started.
            </p>
          )}
          {filter === 'all' && <Button onClick={() => navigate('/create')} size="sm">Create agreement</Button>}
        </Card>
      ) : (
        <div
          className="stagger-children"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}
        >
          {filtered.map((a) => <AgreementCard key={a.id} agreement={a} />)}
        </div>
      )}
    </div>
  );
}
