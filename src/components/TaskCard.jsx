import { useState, useRef } from 'react';
import { appData, getSubject, formatCountdown, difficultyConfig, addedViaIcon } from '../data';
import {
  CheckCircle2, Circle, AlertTriangle, Clock
} from 'lucide-react';

function useSwipe(onSwipeRight, onSwipeLeft) {
  const startX = useRef(null);
  const startY = useRef(null);
  const [swipeDir, setSwipeDir] = useState(null);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setSwipeDir(null);
  };
  const onTouchMove = (e) => {
    if (!startX.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
      setSwipeDir(dx > 0 ? 'right' : 'left');
    }
  };
  const onTouchEnd = (e) => {
    if (!startX.current) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx > 0) onSwipeRight?.();
      else onSwipeLeft?.();
    }
    startX.current = null;
    setSwipeDir(null);
  };
  return { onTouchStart, onTouchMove, onTouchEnd, swipeDir };
}

export function TaskCard({ assignment, onSubmit, onSnooze, onEdit, onViewDetail, showProgressBar = true }) {
  const [done, setDone] = useState(assignment.submitted);
  const [animating, setAnimating] = useState(false);
  const { subjects } = appData.user;
  const subject = getSubject(subjects, assignment.subject_id);
  const countdown = formatCountdown(assignment.deadline);
  const diff = difficultyConfig[assignment.difficulty];

  const handleSubmit = (e) => {
    e?.stopPropagation();
    if (done) return;
    setAnimating(true);
    setTimeout(() => {
      setDone(true);
      setAnimating(false);
      onSubmit?.(assignment.id);
    }, 450);
  };

  const swipe = useSwipe(handleSubmit, () => onSnooze?.(assignment.id));

  return (
    <div
      className={`relative rounded-2xl mb-3 overflow-hidden transition-all duration-300 ${animating ? 'card-fade-out' : ''} ${swipe.swipeDir === 'right' ? 'swipe-right-hint' : swipe.swipeDir === 'left' ? 'swipe-left-hint' : ''}`}
      style={{
        background: 'var(--bg-surface)',
        borderLeft: `4px solid ${subject?.color || '#6C63FF'}`,
        boxShadow: countdown.isOverdue
          ? '0 0 0 1px rgba(239,83,80,0.5), 0 4px 20px rgba(239,83,80,0.1)'
          : 'var(--shadow-main)',
        opacity: done ? 0.5 : 1,
      }}
      onTouchStart={swipe.onTouchStart}
      onTouchMove={swipe.onTouchMove}
      onTouchEnd={swipe.onTouchEnd}
    >
      <div className="p-4" onClick={() => onViewDetail?.(assignment)} style={{ cursor: 'pointer' }}>
        {/* Top row chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {/* Subject chip */}
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${subject?.color}22`, color: subject?.color }}
          >
            {subject?.name}
          </span>
          {/* Difficulty */}
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: diff.bg, color: diff.color }}
          >
            {assignment.difficulty}
          </span>
          {/* Added via */}
          <span className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: 'var(--btn-glass)', color: 'var(--text-secondary)' }}>
            {addedViaIcon[assignment.added_via]} {assignment.added_via}
          </span>
          {/* Overdue badge */}
          {countdown.isOverdue && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-red-400"
              style={{ background: 'rgba(239,83,80,0.2)' }}>
              OVERDUE
            </span>
          )}
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-1.5 flex-1 min-w-0">
            {/* Not started + urgent warning */}
            {assignment.status === 'not_started' && countdown.isUrgent && !countdown.isOverdue && (
              <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
            )}
            {/* Urgent amber pulsing dot */}
            {countdown.isUrgent && !countdown.isOverdue && (
              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 amber-pulse"
                style={{ background: '#F9A825', display: 'inline-block' }} />
            )}
            <h3 className="font-semibold leading-snug" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
              {assignment.title}
            </h3>
          </div>
          {/* Checkbox */}
          <button
            onClick={handleSubmit}
            className="flex-shrink-0 mt-0.5 transition-transform active:scale-90"
          >
            {done ? (
              <CheckCircle2 size={22} className="check-burst" style={{ color: '#43B89C' }} />
            ) : (
              <Circle size={22} style={{ color: 'var(--text-tertiary)' }} />
            )}
          </button>
        </div>

        {/* Progress bar */}
        {showProgressBar && assignment.progress_percent > 0 && (
          <div className="mt-2.5 mb-1">
            <div className="w-full h-1 rounded-full" style={{ background: 'var(--border-light)' }}>
              <div
                className="h-1 rounded-full progress-animate"
                style={{
                  width: `${assignment.progress_percent}%`,
                  background: `linear-gradient(90deg, ${subject?.color || '#6C63FF'}, ${subject?.color || '#6C63FF'}aa)`,
                }}
              />
            </div>
            <span className="text-[10px] mt-0.5 block" style={{ color: 'var(--text-tertiary)' }}>{assignment.progress_percent}% done</span>
          </div>
        )}

        {/* Countdown */}
        <div className="flex items-center gap-1 mt-1.5">
          <Clock size={11} style={{ color: countdown.color }} />
          <span className="text-xs font-medium" style={{ color: countdown.color }}>
            {countdown.text}
          </span>
        </div>
      </div>
    </div>
  );
}
