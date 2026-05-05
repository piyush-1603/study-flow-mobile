import { useState } from 'react';
import { appData } from '../data';
import { LogOut, Edit3, Bell, Moon, RefreshCw } from 'lucide-react';

export function ProfileTab({ assignments }) {
  const { user } = appData;
  const [notifications, setNotifications] = useState(true);
  const [canvasSync, setCanvasSync] = useState(false);

  const completed = assignments.filter(a => a.submitted).length;
  const streak = 7; // static for MVP

  const Toggle = ({ value, onChange, disabled }) => (
    <button
      onClick={() => !disabled && onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ background: value && !disabled ? '#6C63FF' : 'rgba(255,255,255,0.12)' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  );

  return (
    <div className="tab-fade-in px-5 pt-5 pb-6">
      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl text-white mb-3"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>
          A
        </div>
        <p className="text-xl font-bold text-white">{user.name}</p>
        <p className="text-sm text-gray-400 mt-0.5">{user.grade}</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 rounded-2xl p-4 text-center" style={{ background: '#1E1E32' }}>
          <p className="text-2xl font-bold text-orange-400">🔥 {streak}</p>
          <p className="text-[11px] text-gray-400 mt-1">Day Streak</p>
        </div>
        <div className="flex-1 rounded-2xl p-4 text-center" style={{ background: '#1E1E32' }}>
          <p className="text-2xl font-bold" style={{ color: '#43B89C' }}>{completed}</p>
          <p className="text-[11px] text-gray-400 mt-1">Submissions</p>
        </div>
        <div className="flex-1 rounded-2xl p-4 text-center" style={{ background: '#1E1E32' }}>
          <p className="text-2xl font-bold" style={{ color: '#6C63FF' }}>{assignments.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">Total Tasks</p>
        </div>
      </div>

      {/* Subjects */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: '#1E1E32' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-white">Active Subjects</p>
          <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#6C63FF' }}>
            <Edit3 size={12} /> Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.subjects.map(s => (
            <span
              key={s.id}
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}33` }}
            >
              {s.name}
            </span>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl p-4 mb-6" style={{ background: '#1E1E32' }}>
        <p className="text-sm font-bold text-white mb-4">Preferences</p>

        <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <Bell size={16} className="text-gray-400" />
            <span className="text-sm text-gray-200">Notifications</span>
          </div>
          <Toggle value={notifications} onChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <Moon size={16} className="text-gray-400" />
            <div>
              <span className="text-sm text-gray-200">Appearance</span>
              <span className="block text-[10px] text-gray-500">Dark — locked for MVP</span>
            </div>
          </div>
          <Toggle value={true} onChange={() => {}} disabled />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <RefreshCw size={16} className="text-gray-400" />
            <div>
              <span className="text-sm text-gray-200">Canvas Sync</span>
              <span className="block text-[10px] text-gray-500">Coming soon</span>
            </div>
          </div>
          <Toggle value={canvasSync} onChange={setCanvasSync} disabled />
        </div>
      </div>

      {/* Sign out */}
      <button className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
        style={{ border: '1px solid rgba(239,83,80,0.4)', color: '#EF5350', background: 'rgba(239,83,80,0.08)' }}>
        <div className="flex items-center justify-center gap-2">
          <LogOut size={15} />
          Sign Out
        </div>
      </button>
    </div>
  );
}
