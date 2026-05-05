import { useState } from 'react';
import { appData, getSubject, formatCountdown } from '../data';
import { Bell, X, ChevronRight } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { HeatmapStrip } from './HeatmapStrip';

export function HomeTab({ assignments, onSubmit, onSnooze }) {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const highAlerts = appData.alerts.filter(a => a.severity === 'high' && !alertDismissed);
  const { subjects } = appData.user;
  const { today_focus } = appData;

  const todayDate = new Date();
  const hour = todayDate.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const focusAssignments = today_focus.recommended.map(id =>
    assignments.find(a => a.id === id)
  ).filter(Boolean);

  const sorted = [...assignments]
    .filter(a => !a.submitted)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div className="tab-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg text-white"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>
            A
          </div>
          <div>
            <p className="font-bold text-white" style={{ fontSize: '18px' }}>{greeting}, Arjun 👋</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>{dateStr}</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center relative"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <Bell size={18} className="text-gray-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500" />
        </button>
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
        <p className="text-sm font-bold text-white mb-3">Your Week at a Glance</p>
        <div className="rounded-2xl p-4" style={{ background: '#1E1E32' }}>
          <HeatmapStrip />
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div className="mx-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-white">Upcoming Deadlines</p>
          <button className="text-xs font-medium px-3 py-1 rounded-xl"
            style={{ background: 'rgba(108,99,255,0.15)', color: '#6C63FF' }}>
            Sort by time ↓
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <span className="text-5xl mb-3">🎉</span>
            <p className="text-base font-semibold text-white mb-1">Nothing due today. Enjoy the break!</p>
            <p className="text-xs text-gray-500">Add a task using the + button below</p>
          </div>
        ) : (
          sorted.map(a => (
            <TaskCard key={a.id} assignment={a} onSubmit={onSubmit} onSnooze={onSnooze} />
          ))
        )}
      </div>
    </div>
  );
}
