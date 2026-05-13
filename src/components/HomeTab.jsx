import { useState } from 'react';
import { appData, getSubject, formatCountdown } from '../data';
import { Bell, X, ChevronRight, Search } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { HeatmapStrip } from './HeatmapStrip';

const SORT_MODES = [
  { key: 'time-asc', label: 'Earliest first', icon: '↑' },
  { key: 'time-desc', label: 'Latest first', icon: '↓' },
  { key: 'difficulty', label: 'Difficulty', icon: '◆' },
];

const DIFF_RANK = { Hard: 0, Medium: 1, Easy: 2 };

export function HomeTab({ assignments, onSubmit, onSnooze, onEdit, onViewDetail, onSearch }) {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [sortIdx, setSortIdx] = useState(0);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const highAlerts = appData.alerts.filter(a => a.severity === 'high' && !alertDismissed);
  const allAlerts = appData.alerts;
  const { subjects, name } = appData.user;
  const { today_focus } = appData;

  const todayDate = new Date();
  const hour = todayDate.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const focusAssignments = today_focus.recommended.map(id =>
    assignments.find(a => a.id === id)
  ).filter(Boolean);

  const currentSort = SORT_MODES[sortIdx];

  const sorted = [...assignments]
    .filter(a => !a.submitted)
    .sort((a, b) => {
      if (currentSort.key === 'time-asc') return new Date(a.deadline) - new Date(b.deadline);
      if (currentSort.key === 'time-desc') return new Date(b.deadline) - new Date(a.deadline);
      return (DIFF_RANK[a.difficulty] ?? 3) - (DIFF_RANK[b.difficulty] ?? 3);
    });

  return (
    <div className="tab-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white uppercase flex-shrink-0 shadow-md"
            style={{ background: 'linear-gradient(145deg, var(--brand-primary), #FF6584)', boxShadow: '0 6px 20px rgba(108,99,255,0.35)' }}
          >
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="ui-display font-bold truncate" style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>{greeting}, {name.split(' ')[0]}</p>
            <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-secondary)' }}>{dateStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button type="button" onClick={onSearch} className="icon-btn" aria-label="Search">
            <Search size={18} style={{ color: 'var(--text-secondary)' }} strokeWidth={2} />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifs(!showNotifs)}
              className="icon-btn relative"
              aria-label="Notifications"
            >
              <Bell size={18} style={{ color: 'var(--text-secondary)' }} strokeWidth={2} />
              {allAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                  style={{ background: '#EF5350', padding: '0 4px' }}>
                  {allAlerts.length}
                </span>
              )}
            </button>

            {showNotifs && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifs(false)} />
                <div className="absolute right-0 top-12 z-40 rounded-2xl w-72 overflow-hidden sort-menu-appear glass"
                  style={{ boxShadow: 'var(--shadow-elevated)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    <p className="ui-section-title text-sm">Notifications</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {allAlerts.length > 0 ? (
                      allAlerts.map((alert, i) => (
                        <div key={i} className="px-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--border-light)' }}>
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-base">{alert.severity === 'high' ? '🚨' : '🔔'}</div>
                            <div>
                              <p className="text-xs font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                {alert.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No new notifications!</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Alert banner */}
      {highAlerts.length > 0 && (
        <div className="mx-5 mb-4 rounded-2xl p-4 alert-gradient alert-slide-in relative" style={{ boxShadow: 'var(--shadow-card)' }}>
          <button className="absolute top-3 right-3" onClick={() => setAlertDismissed(true)}>
            <X size={14} className="text-amber-300" />
          </button>
          <div className="flex items-start gap-2 pr-6">
            <span className="text-lg">⚠️</span>
            <p className="text-xs font-medium" style={{ color: '#F9A825' }}>{highAlerts[0].message}</p>
          </div>
        </div>
      )}

      {/* Today's Focus Card */}
      <div
        className="mx-5 mb-4 rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #5B52F0 0%, #7C3AED 55%, #A78BFA 100%)',
          boxShadow: '0 12px 40px rgba(91, 82, 240, 0.35)',
        }}
      >
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)' }} />
        <div className="flex items-center gap-2 mb-2 relative">
          <span className="ui-overline text-white/80" style={{ letterSpacing: '0.1em' }}>Today</span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/15">Focus</span>
        </div>
        <p className="text-sm text-white/90 font-medium mb-3">{today_focus.message}</p>
        {focusAssignments.map(a => (
          <div key={a.id} className="flex items-center gap-2 mb-1.5">
            <ChevronRight size={13} className="text-indigo-200 flex-shrink-0" />
            <span className="text-sm text-white font-medium">{a.title}</span>
          </div>
        ))}
        <p className="text-xs text-white/60 mt-3">You've got this 💪</p>
      </div>

      {/* Heatmap strip */}
      <div className="mx-5 mb-4">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <p className="ui-section-title">Week load</p>
          <span className="ui-overline">7 days</span>
        </div>
        <div className="surface-card p-4">
          <HeatmapStrip assignments={assignments} />
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div className="mx-5 mb-4">
        <div className="flex items-center justify-between mb-3 relative">
          <p className="ui-section-title">Upcoming</p>
          <button
            type="button"
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="text-xs font-semibold px-3 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 border"
            style={{ background: 'var(--btn-glass)', color: 'var(--brand-primary)', borderColor: 'var(--border-light)' }}>
            {currentSort.label} {currentSort.icon}
          </button>

          {/* Sort dropdown */}
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-11 z-40 rounded-2xl py-1.5 sort-menu-appear glass"
                style={{ boxShadow: 'var(--shadow-elevated)', minWidth: 176 }}>
                {SORT_MODES.map((mode, i) => (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={() => { setSortIdx(i); setShowSortMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all active:scale-[0.98]"
                    style={{
                      background: sortIdx === i ? 'rgba(108,99,255,0.12)' : 'transparent',
                      color: sortIdx === i ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    }}>
                    <span className="text-sm">{mode.icon}</span>
                    <span className="text-xs font-semibold">{mode.label}</span>
                    {sortIdx === i && (
                      <span className="ml-auto text-[10px] font-bold" style={{ color: 'var(--brand-primary)' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <span className="text-5xl mb-3">🎉</span>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Nothing due today. Enjoy the break!</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Add a task using the + button below</p>
          </div>
        ) : (
          sorted.map(a => (
            <TaskCard key={a.id} assignment={a} onSubmit={onSubmit} onSnooze={onSnooze} onEdit={onEdit} onViewDetail={onViewDetail} />
          ))
        )}
      </div>
    </div>
  );
}
