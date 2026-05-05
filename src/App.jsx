import { useState, useEffect } from 'react';
import { Home, CheckSquare, Calendar, User, Plus, X, Sparkles } from 'lucide-react';
import { appData } from './data';
import { HomeTab } from './components/HomeTab';
import { TasksTab } from './components/TasksTab';
import { CalendarTab } from './components/CalendarTab';
import { ProfileTab } from './components/ProfileTab';
import { QuickAddSheet } from './components/QuickAddSheet';
import { TaskDetailSheet } from './components/TaskDetailSheet';
import { Onboarding } from './components/Onboarding';
import { LoginPage } from './components/LoginPage';
import { SearchOverlay } from './components/SearchOverlay';
import { AIStudyPlanner } from './components/AIStudyPlanner';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'tasks', label: 'Tasks', Icon: CheckSquare },
  { id: 'planner', label: 'Plan', Icon: Sparkles },
  { id: 'calendar', label: 'Calendar', Icon: Calendar },
  { id: 'profile', label: 'Profile', Icon: User },
];

function Snackbar({ message, onUndo, onDismiss }) {
  return (
    <div className="fixed bottom-24 left-5 right-5 z-50 snack-slide-up">
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-focus)', boxShadow: 'var(--shadow-main)' }}>
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
  const [loggedIn, setLoggedIn] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [assignments, setAssignments] = useState(appData.assignments);
  const [showSheet, setShowSheet] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('studyflow_theme') || 'dark');
  const [snackbar, setSnackbar] = useState(null);
  const [snackTimer, setSnackTimer] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studyflow_theme', theme);
  }, [theme]);

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

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSaveTask = (updatedTask) => {
    setAssignments(as => as.map(a => a.id === updatedTask.id ? updatedTask : a));
    setEditingTask(null);
    showSnack('Task updated!', null);
  };

  const handleDeleteTask = (id) => {
    const deleted = assignments.find(a => a.id === id);
    setAssignments(as => as.filter(a => a.id !== id));
    setEditingTask(null);
    showSnack('Task deleted · Undo', () => {
      setAssignments(as => [deleted, ...as]);
      setSnackbar(null);
    });
  };

  const renderContent = () => {
    if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;
    if (!onboarded) return <Onboarding onDone={() => setOnboarded(true)} />;
    
    return (
      <>
        {/* Scrollable content */}
        <div className="scroll-area">
          {activeTab === 'home' && <HomeTab {...tabProps} />}
          {activeTab === 'tasks' && <TasksTab {...tabProps} />}
          {activeTab === 'planner' && <AIStudyPlanner {...tabProps} />}
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
                      style={{ color: active ? '#6C63FF' : 'var(--text-secondary)' }}
                    />
                    {id === 'home' && appData.alerts.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_0_2px_var(--bg-surface)] transition-colors" />
                    )}
                  </div>
                  <span
                    className="text-[10px] font-semibold transition-colors"
                    style={{ color: active ? '#6C63FF' : 'var(--text-tertiary)' }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </>
    );
  };

  const tabProps = {
    assignments,
    onSubmit: handleSubmit,
    onSnooze: handleSnooze,
    onEdit: handleEditTask,
    onViewDetail: setViewingTask,
    onSearch: () => setShowSearch(true),
    theme,
    setTheme
  };

  return (
    <div className="app-shell">
      {renderContent()}

      {/* Quick Add Sheet */}
      {showSheet && (
        <QuickAddSheet onClose={() => setShowSheet(false)} onAdd={handleAddTask} />
      )}

      {/* Edit Task Sheet */}
      {editingTask && (
        <QuickAddSheet
          editTask={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Task Detail Sheet */}
      {viewingTask && (
        <TaskDetailSheet
          assignment={viewingTask}
          onClose={() => setViewingTask(null)}
          onSubmit={handleSubmit}
          onSnooze={handleSnooze}
          onEdit={(task) => {
            setViewingTask(null);
            handleEditTask(task);
          }}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Search Overlay */}
      {showSearch && (
        <SearchOverlay
          assignments={assignments}
          onClose={() => setShowSearch(false)}
          onSubmit={handleSubmit}
          onSnooze={handleSnooze}
          onEdit={handleEditTask}
          onViewDetail={setViewingTask}
        />
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
