import { useState } from 'react';
import { appData, getSubject, loadColor } from '../data';
import { Search, Bell, X, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeatmapStrip } from './HeatmapStrip';
import { TaskCard } from './TaskCard';

function buildMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export function CalendarTab({ assignments, onSubmit, onSnooze, onEdit, onViewDetail, onSearch }) {
  const [focusMode] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const now = new Date();
  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  const [viewMonth, setViewMonth] = useState(todayMonth);
  const [viewYear, setViewYear] = useState(todayYear);

  const isCurrentMonth = viewMonth === todayMonth && viewYear === todayYear;

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const cells = buildMonthMatrix(viewYear, viewMonth);
  const { subjects } = appData.user;

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
    setSelectedDay(null);
    setSheetOpen(false);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
    setSelectedDay(null);
    setSheetOpen(false);
  };

  const goToToday = () => {
    setViewMonth(todayMonth);
    setViewYear(todayYear);
    setSelectedDay(null);
    setSheetOpen(false);
  };

  const getTasksForDay = (day) => {
    if (!day) return [];
    return assignments.filter(a => {
      const d = new Date(a.deadline);
      return d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;
    });
  };

  const handleDayTap = (day) => {
    if (!day) return;
    setSelectedDay(day);
    setSheetOpen(true);
  };

  const dayTasks = selectedDay ? getTasksForDay(selectedDay) : [];
  const selectedDateStr = selectedDay
    ? new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : '';

  const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="tab-fade-in">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <p className="ui-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Calendar</p>
        <div className="flex gap-2">
          <button type="button" onClick={onSearch} className="icon-btn !w-9 !h-9 !rounded-xl" aria-label="Search">
            <Search size={16} style={{ color: 'var(--text-secondary)' }} strokeWidth={2} />
          </button>
          <button type="button" className="icon-btn !w-9 !h-9 !rounded-xl" aria-label="Alerts">
            <Bell size={16} style={{ color: 'var(--text-secondary)' }} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Focus Mode pill */}
      {focusMode && (
        <div className="mx-5 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.4)' }}>
            <Zap size={11} style={{ color: '#6C63FF' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#6C63FF' }}>Focus Mode Active</span>
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div className="mx-5 mb-4 surface-card p-4">
        <HeatmapStrip assignments={assignments} />
      </div>

      {/* Month navigation */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'var(--btn-glass)' }}>
            <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <p className="text-sm font-bold min-w-[140px] text-center" style={{ color: 'var(--text-primary)' }}>{monthName}</p>
          <button
            onClick={goToNextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'var(--btn-glass)' }}>
            <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
        {!isCurrentMonth && (
          <button
            onClick={goToToday}
            className="text-[11px] font-semibold px-3 py-1 rounded-full transition-all active:scale-95"
            style={{ background: 'rgba(108,99,255,0.2)', color: '#6C63FF' }}>
            Today
          </button>
        )}
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-5 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 px-5 mb-4">
        {cells.map((day, i) => {
          const tasks = getTasksForDay(day);
          const isToday = isCurrentMonth && day === todayDate;
          const isCritical = tasks.length >= 3;
          const subjectColors = [...new Set(tasks.map(t => {
            const s = getSubject(subjects, t.subject_id);
            return s?.color;
          }))].slice(0, 3);

          return (
            <div
              key={i}
              onClick={() => handleDayTap(day)}
              className={`relative flex flex-col items-center py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 ${isCritical ? 'critical-pulse' : ''}`}
              style={{
                background: isCritical && day
                  ? 'rgba(239,83,80,0.12)'
                  : selectedDay === day
                    ? 'rgba(108,99,255,0.2)'
                    : 'transparent',
                minHeight: 44,
              }}
            >
              {day && (
                <>
                  <span
                    className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full`}
                    style={{
                      background: isToday ? '#6C63FF' : 'transparent',
                      color: isToday ? '#fff' : tasks.length > 0 ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      fontWeight: isToday ? 700 : 500,
                    }}
                  >
                    {day}
                  </span>
                  {/* Colored dots */}
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {subjectColors.map((c, idx) => (
                      <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Day detail sheet */}
      {sheetOpen && (
        <>
          <div className="fixed inset-0 overlay z-40" onClick={() => setSheetOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 w-full z-50 sheet-slide-up"
            style={{ background: 'var(--bg-surface)', borderRadius: '24px 24px 0 0', border: '1px solid var(--border-focus)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-center pt-3"><div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-medium)' }} /></div>
            <div className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{selectedDateStr}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setSheetOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--btn-glass)' }}>
                <X size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {dayTasks.length === 0 ? (
                <div className="flex flex-col items-center py-10">
                  <span className="text-4xl mb-2">🎉</span>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Clear day ahead!</p>
                </div>
              ) : (
                dayTasks.map(a => <TaskCard key={a.id} assignment={a} onSubmit={onSubmit} onSnooze={onSnooze} onEdit={onEdit} onViewDetail={onViewDetail} />)
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

