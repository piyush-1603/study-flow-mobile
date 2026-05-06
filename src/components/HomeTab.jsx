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
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg text-white uppercase"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-bold" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{greeting}, {name.split(' ')[0]} 👋</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{dateStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onSearch} className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--btn-glass)' }}>
            <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <div className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="w-10 h-10 rounded-full flex items-center justify-center relative"
              style={{ background: 'var(--btn-glass)' }}>
              <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
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
                <div className="absolute right-0 top-12 z-40 rounded-2xl w-72 overflow-hidden sort-menu-appear"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-focus)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                  }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-medium)' }}>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</p>
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
        <div className="mx-5 mb-4 rounded-2xl p-4 alert-gradient alert-slide-in relative">
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
      <div className="mx-5 mb-4 rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 60%, #a78bfa 100%)' }}>
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.4)' }} />
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-indigo-200">Today's Focus</span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">PRIORITY</span>
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
        <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Your Week at a Glance</p>
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg-surface)' }}>
          <HeatmapStrip assignments={assignments} />
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div className="mx-5 mb-4">
        <div className="flex items-center justify-between mb-3 relative">
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Upcoming Deadlines</p>
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="text-xs font-medium px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
            style={{ background: 'rgba(108,99,255,0.15)', color: '#6C63FF' }}>
            {currentSort.label} {currentSort.icon}
          </button>

          {/* Sort dropdown */}
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-9 z-40 rounded-2xl py-1.5 sort-menu-appear"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-focus)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                  minWidth: 170,
                }}>
                {SORT_MODES.map((mode, i) => (
                  <button
                    key={mode.key}
                    onClick={() => { setSortIdx(i); setShowSortMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all active:scale-[0.98]"
                    style={{
                      background: sortIdx === i ? 'rgba(108,99,255,0.15)' : 'transparent',
                      color: sortIdx === i ? '#6C63FF' : 'var(--text-secondary)',
                    }}>
                    <span className="text-sm">{mode.icon}</span>
                    <span className="text-xs font-semibold">{mode.label}</span>
                    {sortIdx === i && (
                      <span className="ml-auto text-[10px]" style={{ color: '#6C63FF' }}>✓</span>
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
