import { CheckCircle, Circle, Clock, File } from '@phosphor-icons/react';
import { formatDate } from '../utils/format';

export function MilestoneTracker({ milestones = [] }) {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-8 text-secondary text-sm">
        No milestones defined yet.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {milestones.map((milestone, idx) => (
        <div key={milestone.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
              milestone.is_met ? 'bg-accent-green' : 'bg-surface-alt border border-[var(--border-default)]'
            }`}>
              {milestone.is_met ? (
                <CheckCircle className="w-4 h-4 text-accent-green-text" weight="fill" />
              ) : (
                <Circle className="w-4 h-4 text-tertiary" weight="bold" />
              )}
            </div>
            {idx < milestones.length - 1 && (
              <div
                className="w-px h-full min-h-[2rem]"
                style={{ background: milestone.is_met ? 'var(--color-accent-green)' : 'var(--border-default)' }}
              />
            )}
          </div>

          <div className="pb-6 flex-1">
            <p className={`font-medium mb-1 text-sm ${milestone.is_met ? 'text-primary' : 'text-secondary'}`}>
              {milestone.description}
            </p>

            {milestone.is_met && milestone.verified_at && (
              <div className="flex items-center gap-1.5 text-xs text-accent-green-text">
                <Clock className="w-3 h-3" weight="bold" />
                <span>Verified {formatDate(milestone.verified_at)}</span>
              </div>
            )}

            {(milestone.proof_description || milestone.proof_url) && (
              <div className="mt-2.5 p-3 bg-surface-alt border border-[var(--border-default)] rounded-[10px] space-y-2">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">Submitted Proof</p>
                {milestone.proof_description && (
                  <p className="text-xs text-primary leading-relaxed whitespace-pre-wrap">{milestone.proof_description}</p>
                )}
                {milestone.proof_url && (
                  <div className="pt-0.5">
                    <a
                      href={milestone.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent-green-text hover:underline"
                    >
                      <File className="w-3.5 h-3.5" weight="bold" />
                      View Attached File
                    </a>
                  </div>
                )}
              </div>
            )}

            {milestone.ai_reason && (
              <p className="text-xs text-secondary mt-2 italic">
                AI: {milestone.ai_reason}
              </p>
            )}

            {milestone.ai_confidence != null && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-surface-alt rounded-full h-1 border border-[var(--border-default)]">
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: `${milestone.ai_confidence}%`,
                      backgroundColor: milestone.ai_confidence >= 80 ? 'var(--text-primary)' : 'var(--color-accent-yellow-text)',
                    }}
                  />
                </div>
                <span className="text-xs text-secondary tabular-nums font-[var(--font-mono)]">{milestone.ai_confidence}%</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
