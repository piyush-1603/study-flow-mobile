import { useState } from 'react';
import { formatCountdown } from '../data';
import { TaskCard } from './TaskCard';
import { Search } from 'lucide-react';

const FILTERS = ['ALL', 'ACTIVE', 'OVERDUE', 'COMPLETED'];

const emptyStates = {
  OVERDUE: { emoji: '🙌', msg: 'Nothing overdue. Keep it up!' },
  COMPLETED: { emoji: '✅', msg: 'No completed tasks yet. Start checking things off!' },
  ACTIVE: { emoji: '📭', msg: 'No active tasks right now.' },
  ALL: { emoji: '🎉', msg: 'Nothing due. Enjoy the break!' },
};

export function TasksTab({ assignments, onSubmit, onSnooze, onEdit, onViewDetail, onSearch }) {
  const [filter, setFilter] = useState('ALL');

  const getFiltered = () => {
    switch (filter) {
      case 'ACTIVE': return assignments.filter(a => !a.submitted && !formatCountdown(a.deadline).isOverdue);
      case 'OVERDUE': return assignments.filter(a => !a.submitted && formatCountdown(a.deadline).isOverdue);
      case 'COMPLETED': return assignments.filter(a => a.submitted);
      default: return assignments;
    }
  };

  const filtered = getFiltered();

  // Group by urgency for ALL filter
  const overdue = filtered.filter(a => !a.submitted && formatCountdown(a.deadline).isOverdue);
  const dueToday = filtered.filter(a => {
    if (a.submitted) return false;
    const cd = formatCountdown(a.deadline);
    return !cd.isOverdue && cd.isUrgent;
  });
  const dueToday2 = filtered.filter(a => {
    if (a.submitted) return false;
    const cd = formatCountdown(a.deadline);
    const due = new Date(a.deadline);
    const now = new Date();
    const isToday = due.toDateString() === now.toDateString();
    return !cd.isOverdue && !cd.isUrgent && isToday;
  });
  const allDueToday = [...dueToday, ...dueToday2];
  const thisWeek = filtered.filter(a => {
    if (a.submitted) return false;
    const cd = formatCountdown(a.deadline);
    if (cd.isOverdue || cd.isUrgent) return false;
    const due = new Date(a.deadline);
    const now = new Date();
    const isToday = due.toDateString() === now.toDateString();
    return !isToday;
  });
  const completed = filtered.filter(a => a.submitted);

  const SectionHeader = ({ label, color, count }) => (
    <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
      <span className="text-[11px] font-bold tracking-wider" style={{ color }}>{label}</span>
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
        style={{ background: `${color}22`, color }}>{count}</span>
    </div>
  );

  const empty = emptyStates[filter];

  return (
    <div className="tab-fade-in">
      {/* Filter pills */}
      <div
        className="sticky top-0 z-10 px-5 pt-5 pb-3 border-b"
        style={{ background: 'var(--bg-glass)', backdropFilter: 'saturate(180%) blur(12px)', borderColor: 'var(--border-light)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="ui-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Tasks</p>
          <button type="button" onClick={onSearch} className="icon-btn !w-9 !h-9 !rounded-xl" aria-label="Search">
            <Search size={16} style={{ color: 'var(--text-secondary)' }} strokeWidth={2} />
          </button>
        </div>
        <div
          className="flex p-1 rounded-xl gap-0.5"
          style={{ background: 'var(--bg-surface-muted)', border: '1px solid var(--border-light)' }}
        >
          {FILTERS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-wide transition-all duration-200"
              style={{
                background: filter === f ? 'var(--bg-surface)' : 'transparent',
                color: filter === f ? 'var(--brand-primary)' : 'var(--text-secondary)',
                boxShadow: filter === f ? 'var(--shadow-main)' : 'none',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <span className="text-5xl mb-3">{empty.emoji}</span>
            <p className="text-sm font-semibold text-center" style={{ color: 'var(--text-primary)' }}>{empty.msg}</p>
          </div>
        ) : filter === 'ALL' ? (
          <>
            {overdue.length > 0 && (
              <><SectionHeader label="OVERDUE" color="#EF5350" count={overdue.length} />
                {overdue.map(a => <TaskCard key={a.id} assignment={a} onSubmit={onSubmit} onSnooze={onSnooze} onEdit={onEdit} onViewDetail={onViewDetail} />)}</>
            )}
            {allDueToday.length > 0 && (
              <><SectionHeader label="DUE TODAY" color="#F9A825" count={allDueToday.length} />
                {allDueToday.map(a => <TaskCard key={a.id} assignment={a} onSubmit={onSubmit} onSnooze={onSnooze} onEdit={onEdit} onViewDetail={onViewDetail} />)}</>
            )}
            {thisWeek.length > 0 && (
              <><SectionHeader label="THIS WEEK" color="var(--text-primary)" count={thisWeek.length} />
                {thisWeek.map(a => <TaskCard key={a.id} assignment={a} onSubmit={onSubmit} onSnooze={onSnooze} onEdit={onEdit} onViewDetail={onViewDetail} />)}</>
            )}
            {completed.length > 0 && (
              <><SectionHeader label="COMPLETED" color="#43B89C" count={completed.length} />
                {completed.map(a => <TaskCard key={a.id} assignment={a} onSubmit={onSubmit} onSnooze={onSnooze} onEdit={onEdit} onViewDetail={onViewDetail} />)}</>
            )}
          </>
        ) : (
          filtered.map(a => <TaskCard key={a.id} assignment={a} onSubmit={onSubmit} onSnooze={onSnooze} onEdit={onEdit} onViewDetail={onViewDetail} />)
        )}
      </div>
    </div>
  );
}
