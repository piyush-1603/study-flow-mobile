import { Sparkles, Clock, ChevronRight } from 'lucide-react';
import { appData, getSubject } from '../data';

export function AIStudyPlanner({ assignments }) {
  const { subjects } = appData.user;

  // Mock Algorithm: Distribute tasks
  const pending = [...assignments].filter(a => !a.submitted).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  
  const buckets = [
    { id: 'today', label: 'Today', tasks: [] },
    { id: 'tomorrow', label: 'Tomorrow', tasks: [] },
    { id: 'upcoming', label: 'Later', tasks: [] },
  ];

  let pendingIdx = 0;
  for (let i = 0; i < 2; i++) {
    const bucket = buckets[i];
    let hardCount = 0;
    while (bucket.tasks.length < 2 && pendingIdx < pending.length) {
      const task = pending[pendingIdx];
      if (task.difficulty === 'Hard' && hardCount >= 1) {
        break; // Max 1 hard task per day for optimal load
      }
      if (task.difficulty === 'Hard') hardCount++;
      bucket.tasks.push(task);
      pendingIdx++;
    }
  }

  // Put remaining in the 'upcoming' bucket
  while (pendingIdx < pending.length) {
    buckets[2].tasks.push(pending[pendingIdx]);
    pendingIdx++;
  }

  // Filter out empty buckets
  const activeBuckets = buckets.filter(b => b.tasks.length > 0);

  if (activeBuckets.length === 0) return null;

  return (
    <div className="tab-fade-in pb-6">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center border"
          style={{ background: 'rgba(108, 99, 255, 0.12)', color: 'var(--brand-primary)', borderColor: 'var(--border-light)' }}
        >
          <Sparkles size={22} strokeWidth={2} />
        </div>
        <div>
          <h2 className="ui-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Study plan</h2>
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Suggested focus blocks</p>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {activeBuckets.map((bucket) => {
          let estimatedMins = 0;
          bucket.tasks.forEach(t => {
            estimatedMins += t.difficulty === 'Hard' ? 120 : t.difficulty === 'Medium' ? 60 : 30;
          });
          const hrs = Math.floor(estimatedMins / 60);
          const mins = estimatedMins % 60;
          const timeStr = hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;

          return (
            <div
              key={bucket.id}
              className="surface-card w-full p-5 relative overflow-hidden"
            >
              {/* Subtle AI gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #6C63FF 0%, transparent 70%)' }} />
                
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{bucket.label}</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" 
                  style={{ background: 'var(--bg-main)', color: 'var(--text-secondary)' }}>
                  <Clock size={12} />
                  <span>~{timeStr} load</span>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                {bucket.tasks.map(task => {
                  const subject = getSubject(subjects, task.subject_id);
                  return (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                      style={{ background: 'var(--btn-glass)' }}>
                      <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: subject?.color || '#6C63FF' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate mb-0.5" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{subject?.name}</p>
                      </div>
                      {task.difficulty === 'Hard' && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded text-red-400 bg-red-400/10 flex-shrink-0">
                          Hard
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
