import { useUIStore } from '../stores/uiStore';
import { CheckCircle, XCircle, Warning as WarningIcon, Info, X } from '@phosphor-icons/react';

const icons = {
  success: <CheckCircle className="w-4 h-4 text-accent-green-text flex-shrink-0" weight="fill" />,
  error:   <XCircle className="w-4 h-4 text-accent-red-text flex-shrink-0" weight="fill" />,
  warning: <WarningIcon className="w-4 h-4 text-accent-yellow-text flex-shrink-0" weight="fill" />,
  info:    <Info className="w-4 h-4 text-accent-blue-text flex-shrink-0" weight="fill" />,
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-[12px] border border-[var(--border-default)] bg-surface animate-in"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          {icons[toast.type] || icons.info}
          <p className="text-sm text-primary flex-1 leading-snug">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-tertiary hover:text-primary transition-colors flex-shrink-0 -mr-1 -mt-0.5 p-0.5"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" weight="bold" />
          </button>
        </div>
      ))}
    </div>
  );
}
