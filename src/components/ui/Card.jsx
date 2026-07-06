export function Card({ children, className = '', ...props }) {
  return (
    <div
      {...props}
      className={`bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)] transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3
      className={`text-[var(--text-primary)] font-semibold tracking-tight ${className}`}
      style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.01em' }}
    >
      {children}
    </h3>
  );
}
