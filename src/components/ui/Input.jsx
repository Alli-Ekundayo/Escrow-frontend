export function Input({ label, error, id: externalId, required, className = '', ...props }) {
  // Generate a stable id if not provided
  const inputId = externalId || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}
        >
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-accent-red-text)', marginLeft: 3 }}>*</span>
          )}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error && errorId ? errorId : undefined}
        className={`w-full px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-default)] focus:border-[#9fe870] focus:ring-2 focus:ring-[rgba(159,232,112,0.2)] focus:outline-none transition-all placeholder:text-[var(--text-tertiary)] font-[var(--font-sans)] text-sm ${error ? 'border-[var(--color-accent-red-text)]' : ''} ${className}`}
      />
      {error && (
        <p id={errorId} className="text-xs" style={{ color: 'var(--color-accent-red-text)', fontFamily: 'var(--font-sans)' }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Textarea({ label, error, id: externalId, required, className = '', ...props }) {
  const inputId = externalId || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}
        >
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-accent-red-text)', marginLeft: 3 }}>*</span>
          )}
        </label>
      )}
      <textarea
        {...props}
        id={inputId}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error && errorId ? errorId : undefined}
        className={`w-full px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-default)] focus:border-[#9fe870] focus:ring-2 focus:ring-[rgba(159,232,112,0.2)] focus:outline-none transition-all placeholder:text-[var(--text-tertiary)] font-[var(--font-sans)] text-sm resize-none ${error ? 'border-[var(--color-accent-red-text)]' : ''} ${className}`}
      />
      {error && (
        <p id={errorId} className="text-xs" style={{ color: 'var(--color-accent-red-text)', fontFamily: 'var(--font-sans)' }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({ label, error, id: externalId, required, className = '', children, ...props }) {
  const selectId = externalId || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = selectId ? `${selectId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}
        >
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-accent-red-text)', marginLeft: 3 }}>*</span>
          )}
        </label>
      )}
      <div className="relative">
        <select
          {...props}
          id={selectId}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error && errorId ? errorId : undefined}
          className={`w-full px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-default)] focus:border-[#9fe870] focus:ring-2 focus:ring-[rgba(159,232,112,0.2)] focus:outline-none transition-all font-[var(--font-sans)] text-sm appearance-none ${error ? 'border-[var(--color-accent-red-text)]' : ''} ${className}`}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4" style={{ color: 'var(--text-secondary)' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && (
        <p id={errorId} className="text-xs" style={{ color: 'var(--color-accent-red-text)', fontFamily: 'var(--font-sans)' }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
