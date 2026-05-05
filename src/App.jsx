import { useState, useEffect } from 'react';
import { Home, CheckSquare, Calendar, User, Plus, X } from 'lucide-react';
import { appData } from './data';
import { HomeTab } from './components/HomeTab';
import { TasksTab } from './components/TasksTab';
import { CalendarTab } from './components/CalendarTab';
import { ProfileTab } from './components/ProfileTab';
import { QuickAddSheet } from './components/QuickAddSheet';
import { Onboarding } from './components/Onboarding';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'tasks', label: 'Tasks', Icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', Icon: Calendar },
  { id: 'profile', label: 'Profile', Icon: User },
];

function Snackbar({ message, onUndo, onDismiss }) {
  return (
    <div className="fixed bottom-24 left-5 right-5 z-50 snack-slide-up">
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
        style={{ background: '#2D2D4A', border: '1px solid rgba(108,99,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <span className="text-sm text-white font-medium">{message}</span>
        <div className="flex items-center gap-3 ml-4">
          <button onClick={onUndo} className="text-sm font-bold" style={{ color: '#6C63FF' }}>Undo</button>
          <button onClick={onDismiss}><X size={14} className="text-gray-500" /></button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [assignments, setAssignments] = useState(appData.assignments);
  const [showSheet, setShowSheet] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [snackTimer, setSnackTimer] = useState(null);

  const showSnack = (msg, undoFn) => {
    if (snackTimer) clearTimeout(snackTimer);
    setSnackbar({ msg, undoFn });
    const t = setTimeout(() => setSnackbar(null), 4000);
    setSnackTimer(t);
  };

  const handleSubmit = (id) => {
    const prev = assignments.find(a => a.id === id);
    setAssignments(as => as.map(a => a.id === id ? { ...a, submitted: true } : a));
    showSnack('Marked as submitted · Undo', () => {
      setAssignments(as => as.map(a => a.id === id ? { ...a, submitted: false } : a));
      setSnackbar(null);
    });
  };

  const handleSnooze = (id) => {
    const a = assignments.find(x => x.id === id);
    if (!a) return;
    const newDeadline = new Date(new Date(a.deadline).getTime() + 86400000).toISOString().slice(0, 16) + ':00';
    setAssignments(as => as.map(x => x.id === id ? { ...x, deadline: newDeadline } : x));
    showSnack('Snoozed by 1 day', null);
  };

  const handleAddTask = (task) => {
    setAssignments(as => [task, ...as]);
    showSnack('Task added!', null);
  };

  if (!onboarded) return <Onboarding onDone={() => setOnboarded(true)} />;

  const tabProps = { assignments, onSubmit: handleSubmit, onSnooze: handleSnooze };

  return (
    <div className="app-shell">
      {/* Scrollable content */}
      <div className="scroll-area">
        {activeTab === 'home' && <HomeTab {...tabProps} />}
        {activeTab === 'tasks' && <TasksTab {...tabProps} />}
        {activeTab === 'calendar' && <CalendarTab {...tabProps} />}
        {activeTab === 'profile' && <ProfileTab {...tabProps} />}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowSheet(true)}
        className="fixed z-30 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90"
        style={{
          bottom: 84,
          right: 20,
          background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)',
          boxShadow: '0 4px 24px rgba(108,99,255,0.5)',
        }}
      >
        <Plus size={26} className="text-white" strokeWidth={2.5} />
      </button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-20 bottom-nav-glass">
        <div className="flex items-center justify-around px-2 pt-2 pb-safe" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex flex-col items-center gap-1 flex-1 py-1 transition-all"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 1.8}
                    style={{ color: active ? '#6C63FF' : '#4b5563' }}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: active ? '#6C63FF' : '#4b5563' }}
                >
                  {label}
                </span>
                {active && (
                  <div className="w-1 h-1 rounded-full" style={{ background: '#6C63FF' }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Quick Add Sheet */}
      {showSheet && (
        <QuickAddSheet onClose={() => setShowSheet(false)} onAdd={handleAddTask} />
      )}

      {/* Snackbar */}
      {snackbar && (
        <Snackbar
          message={snackbar.msg}
          onUndo={snackbar.undoFn}
          onDismiss={() => { setSnackbar(null); clearTimeout(snackTimer); }}
        />
      )}
    </div>
  );
}
