import { ShieldCheck } from '@phosphor-icons/react';

export function TrustScoreBadge({ score = 0 }) {
  const getColor = (s) => {
    if (s >= 80) return { text: 'text-accent-green-text', bg: 'bg-accent-green' };
    if (s >= 60) return { text: 'text-accent-yellow-text', bg: 'bg-accent-yellow' };
    return { text: 'text-accent-red-text', bg: 'bg-accent-red' };
  };

  const { text, bg } = getColor(score);

  return (
    <div
      className={`w-14 h-14 flex items-center justify-center rounded-[12px] ${bg} flex-shrink-0`}
      aria-label={`Trust score: ${score} out of 100`}
    >
      <div className="text-center">
        <ShieldCheck className={`w-4 h-4 mx-auto mb-0.5 ${text}`} weight="fill" />
        <span className={`text-sm font-bold font-[var(--font-mono)] tabular-nums ${text}`}>{score}</span>
      </div>
    </div>
  );
}
