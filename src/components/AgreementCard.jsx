import { useNavigate } from 'react-router-dom';
import { CalendarBlank, CaretRight } from '@phosphor-icons/react';
import { Badge } from './ui/Badge';
import { formatCurrency, formatDate } from '../utils/format';

export function AgreementCard({ agreement }) {
  const navigate = useNavigate();

  const completedMilestones = agreement.milestones?.filter((m) => m.is_met).length ?? 0;
  const totalMilestones = agreement.milestones?.length ?? 0;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div
      role="article"
      className="cursor-pointer group"
      onClick={() => navigate(`/agreements/${agreement.id}`)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/agreements/${agreement.id}`)}
      aria-label={`Agreement #${agreement.id}, ${formatCurrency(agreement.amount, agreement.currency)}, status: ${agreement.status}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        boxShadow: 'var(--shadow-xs)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(159,232,112,0.5)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(159,232,112,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-tertiary mb-1 font-[var(--font-mono)]">#{agreement.id}</p>
          <p className="text-primary font-medium truncate text-sm">
            {agreement.buyer_email} → {agreement.seller_email}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <Badge status={agreement.status} />
          <CaretRight
            className="w-4 h-4 text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150"
            weight="bold"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-[var(--font-display)] text-primary tabular-nums tracking-tight">
          {formatCurrency(agreement.amount, agreement.currency)}
        </span>
        <div className="flex items-center gap-1.5 text-secondary text-xs">
          <CalendarBlank className="w-3.5 h-3.5" weight="bold" />
          <span>{formatDate(agreement.deadline)}</span>
        </div>
      </div>

      {totalMilestones > 0 && (
        <div>
          <div className="flex justify-between text-xs text-secondary mb-1.5">
            <span>Milestones</span>
            <span className="font-[var(--font-mono)] tabular-nums">{completedMilestones}/{totalMilestones}</span>
          </div>
          <div
            className="w-full rounded-full h-1.5"
            style={{ backgroundColor: 'var(--bg-surface-alt)', border: '1px solid var(--border-default)' }}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: progress === 100 ? '#9fe870' : 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
