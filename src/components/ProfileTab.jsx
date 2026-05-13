import { useState } from 'react';
import { appData } from '../data';
import { LogOut, Edit3, Bell, Moon, RefreshCw } from 'lucide-react';

export function ProfileTab({ assignments, theme, setTheme, onSignOut }) {
  const { user } = appData;
  const [notifications, setNotifications] = useState(true);
  const [canvasSync, setCanvasSync] = useState(false);

  const completed = assignments.filter(a => a.submitted).length;

  const Toggle = ({ value, onChange, disabled }) => (
    <button
      onClick={() => !disabled && onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ background: value && !disabled ? 'var(--brand-primary)' : 'var(--border-medium)' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  );

  return (
    <div className="tab-fade-in px-5 pt-5 pb-6">
      <div className="flex flex-col items-center mb-6">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center font-bold text-3xl text-white mb-3 uppercase"
          style={{
            background: 'linear-gradient(145deg, var(--brand-primary), #FF6584)',
            boxShadow: '0 10px 32px rgba(108,99,255,0.35)',
          }}
        >
          {user.name.charAt(0)}
        </div>
        <p className="ui-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{user.grade}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="surface-card p-4 text-center">
          <p className="ui-display text-2xl font-bold" style={{ color: '#43B89C' }}>{completed}</p>
          <p className="text-[11px] mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Submissions</p>
        </div>
        <div className="surface-card p-4 text-center">
          <p className="ui-display text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>{assignments.length}</p>
          <p className="text-[11px] mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Total Tasks</p>
        </div>
      </div>

      {/* Subjects */}
      <div className="surface-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="ui-section-title text-sm">Subjects</p>
          <button type="button" className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--brand-primary)' }}>
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
      <div className="surface-card p-4 mb-6">
        <p className="ui-section-title text-sm mb-4">Preferences</p>

        <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-center gap-3">
            <Bell size={16} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Notifications</span>
          </div>
          <Toggle value={notifications} onChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-center gap-3">
            <Moon size={16} style={{ color: 'var(--text-secondary)' }} />
            <div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark Theme</span>
            </div>
          </div>
          <Toggle value={theme === 'dark'} onChange={(isDark) => setTheme(isDark ? 'dark' : 'light')} />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <RefreshCw size={16} style={{ color: 'var(--text-secondary)' }} />
            <div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Canvas Sync</span>
              <span className="block text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Coming soon</span>
            </div>
          </div>
          <Toggle value={canvasSync} onChange={setCanvasSync} disabled />
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={onSignOut}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
        style={{ border: '1px solid rgba(239,83,80,0.4)', color: '#EF5350', background: 'rgba(239,83,80,0.08)' }}>
        <div className="flex items-center justify-center gap-2">
          <LogOut size={15} />
          Sign Out
        </div>
      </button>
    </div>
  );
}
