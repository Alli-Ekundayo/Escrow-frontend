import { CircleNotch } from '@phosphor-icons/react';

const variants = {
  primary:
    'bg-[#9fe870] hover:bg-[#8fd660] active:bg-[#cdffad] text-[#0e0f0c] font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-[#9fe870] focus-visible:ring-offset-2',
  secondary:
    'bg-[var(--bg-surface-alt)] hover:bg-[var(--border-default)] text-[var(--text-primary)] border border-[var(--border-default)] focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-1',
  danger:
    'bg-[var(--color-accent-red)] text-[var(--color-accent-red-text)] hover:bg-[#fcd8d9] border border-[var(--border-default)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-red-text)] focus-visible:ring-offset-1',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] focus-visible:ring-2 focus-visible:ring-[var(--border-default)]',
  copper:
    'bg-[var(--color-accent-yellow)] text-[var(--color-accent-yellow-text)] hover:bg-[#f7e9bb] border border-[var(--border-default)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-yellow-text)] focus-visible:ring-offset-1',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-sm rounded-[10px]',
  md: 'px-5 py-2.5 text-sm rounded-[12px]',
  lg: 'px-7 py-3.5 text-base rounded-[14px]',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-200 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
    >
      {loading && <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />}
      {children}
    </button>
  );
}
