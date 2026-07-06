import { useMemo } from 'react';
import { useAgreements } from '../hooks/useAgreements';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';
import {
  ArrowUpRight, ArrowDownLeft, CalendarBlank,
  CheckCircle, ClockCounterClockwise,
} from '@phosphor-icons/react';
import { formatCurrency, formatDateWithTime } from '../utils/format';

const typeConfig = {
  credit:     { bg: '#e2f6d5', color: '#1a5c2a', icon: ArrowDownLeft, prefix: '+' },
  debit:      { bg: '#FDEBEC', color: '#9F2F2D', icon: ArrowUpRight, prefix: '-' },
  hold:       { bg: 'var(--bg-surface-alt)', color: 'var(--text-secondary)', icon: ArrowUpRight, prefix: '' },
  disbursed:  { bg: 'var(--bg-surface-alt)', color: 'var(--text-secondary)', icon: ArrowUpRight, prefix: '' },
  refunded:   { bg: '#e2f6d5', color: '#1a5c2a', icon: ArrowDownLeft, prefix: '+' },
};

export default function TransactionHistory() {
  const { user } = useAuthStore();
  const { data: agreements = [], isLoading } = useAgreements();

  const transactions = useMemo(() => {
    return agreements.flatMap((a) => {
      const items = [];
      const isBuyer = a.buyer === user?.id;
      const isSeller = a.seller === user?.id;
      if (a.status !== 'draft')
        items.push({
          id: `lock-${a.id}`, date: a.created_at,
          amount: parseFloat(a.amount),
          type: isBuyer ? 'debit' : 'hold',
          description: isBuyer
            ? `Locked funds for Agreement #${a.id}`
            : `Funds held for Agreement #${a.id}`,
        });
      if (a.status === 'completed')
        items.push({
          id: `disburse-${a.id}`, date: a.updated_at,
          amount: parseFloat(a.amount),
          type: isSeller ? 'credit' : 'disbursed',
          description: isSeller
            ? `Received payout for Agreement #${a.id}`
            : `Released payout for Agreement #${a.id}`,
        });
      if (a.status === 'refunded')
        items.push({
          id: `refund-${a.id}`, date: a.updated_at,
          amount: parseFloat(a.amount),
          type: isBuyer ? 'credit' : 'refunded',
          description: isBuyer
            ? `Refund for Agreement #${a.id}`
            : `Refunded for Agreement #${a.id}`,
        });
      return items;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [agreements, user?.id]);

  const skeletonRow = (
    <div style={{
      padding: '16px 0', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--bg-surface-alt)' }} className="animate-pulse" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ width: 180, height: 12, borderRadius: 4, backgroundColor: 'var(--bg-surface-alt)' }} className="animate-pulse" />
          <div style={{ width: 120, height: 10, borderRadius: 4, backgroundColor: 'var(--bg-surface-alt)' }} className="animate-pulse" />
        </div>
      </div>
      <div style={{ width: 80, height: 16, borderRadius: 4, backgroundColor: 'var(--bg-surface-alt)' }} className="animate-pulse" />
    </div>
  );

  return (
    <div style={{
      maxWidth: 800, margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div>
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 26, fontWeight: 900, letterSpacing: '-0.025em',
          color: 'var(--text-primary)', margin: '0 0 4px',
        }}>
          Transaction History
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          Ledger for all contract locks, payouts, and refunds.
        </p>
      </div>

      <Card>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1.5px solid var(--border-default)',
          paddingBottom: 16, marginBottom: 4,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            backgroundColor: '#e2f6d5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ClockCounterClockwise style={{ width: 17, height: 17, color: '#1a5c2a' }} weight="fill" />
          </div>
          <h3 style={{
            fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700,
            color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em',
          }}>
            Ledger
          </h3>
        </div>

        {isLoading ? (
          <div style={{ borderTop: '1.5px solid var(--border-default)' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border-default)' }}>
                {skeletonRow}
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 24px' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 4px' }}>
              No ledger events recorded.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
              Transactions appear as you fund and complete agreements.
            </p>
          </div>
        ) : (
          <div>
            {transactions.map((tx, idx) => {
              const cfg = typeConfig[tx.type] || typeConfig.hold;
              const Icon = cfg.icon;
              return (
                <div
                  key={tx.id}
                  style={{
                    padding: '16px 0',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 16,
                    borderTop: idx > 0 ? '1px solid var(--border-default)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      backgroundColor: cfg.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon style={{ width: 18, height: 18, color: cfg.color }} weight="fill" />
                    </div>
                    <div>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
                        color: 'var(--text-primary)', margin: 0,
                      }}>
                        {tx.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <CalendarBlank style={{ width: 12, height: 12, color: 'var(--text-tertiary)' }} weight="bold" />
                        <span style={{
                          fontFamily: "'Inter', sans-serif", fontSize: 12,
                          color: 'var(--text-secondary)',
                        }}>
                          {formatDateWithTime(tx.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 16, fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: cfg.color,
                      margin: 0, fontVariantNumeric: 'tabular-nums',
                    }}>
                      {cfg.prefix}{formatCurrency(tx.amount)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
                      <CheckCircle style={{ width: 11, height: 11, color: '#1a5c2a' }} weight="fill" />
                      <span style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 10,
                        fontWeight: 600, textTransform: 'uppercase',
                        letterSpacing: '0.06em', color: 'var(--text-tertiary)',
                      }}>
                        Settled
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
