const statusMap = {
  draft:            'badge-draft',
  awaiting_payment: 'badge-pending',
  active:           'badge-active',
  pending_proof:    'badge-pending',
  completed:        'badge-completed',
  disputed:         'badge-disputed',
  refunded:         'badge-refunded',
  open:             'badge-open',
  resolved:         'badge-resolved',
};

const labelMap = {
  draft:            'Draft',
  awaiting_payment: 'Awaiting Payment',
  active:           'Active',
  pending_proof:    'Pending Proof',
  completed:        'Completed',
  disputed:         'Disputed',
  refunded:         'Refunded',
  open:             'Open',
  resolved:         'Resolved',
};

export function Badge({ status, children, className = '' }) {
  const cls = statusMap[status] || 'badge-draft';
  const label = children || labelMap[status] || status;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${cls} ${className}`}
    >
      {label}
    </span>
  );
}
