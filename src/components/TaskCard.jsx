import { useState, useRef } from 'react';
import { appData, getSubject, formatCountdown, difficultyConfig, addedViaIcon } from '../data';
import {
  CheckCircle2, Circle, AlertTriangle, Clock, AlarmClock
} from 'lucide-react';

const SWIPE_THRESHOLD = 80;   // px to trigger action
const SWIPE_MAX      = 120;   // max drag before rubber-band

export function TaskCard({ assignment, onSubmit, onSnooze, onEdit, onViewDetail, showProgressBar = true, a11y }) {
  const [done, setDone]           = useState(assignment.submitted);
  const [animating, setAnimating] = useState(false);   // card-fade-out on submit
  const [offsetX, setOffsetX]     = useState(0);       // live drag offset
  const [released, setReleased]   = useState(false);   // snapping back after drag
  const [swipeDir, setSwipeDir]   = useState(null);    // 'right' | 'left' | null (live)

  const startX    = useRef(null);
  const startY    = useRef(null);
  const locked    = useRef(null);   // 'h' | 'v' once determined
  const isDragging = useRef(false);

  const { subjects } = appData.user;
  const subject  = getSubject(subjects, assignment.subject_id);
  const countdown = formatCountdown(assignment.deadline);
  const diff     = difficultyConfig[assignment.difficulty];

  /* ── Submit handler ── */
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

  /* ── TTS read aloud ── */
  const handleReadAloud = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = [
      `Task: ${assignment.title}.`,
      `Subject: ${subject?.name || 'Unknown'}.`,
      `Difficulty: ${assignment.difficulty}.`,
      `Due: ${new Date(assignment.deadline).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}.`,
      countdown.isOverdue ? 'This task is overdue.' : '',
      assignment.description ? `Description: ${assignment.description}` : '',
    ].filter(Boolean).join(' ');
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  /* ══════════════════════════════════
     SWIPE — Touch handlers
  ══════════════════════════════════ */
  const onTouchStart = (e) => {
    startX.current   = e.touches[0].clientX;
    startY.current   = e.touches[0].clientY;
    locked.current   = null;
    isDragging.current = false;
    setReleased(false);
  };

  const onTouchMove = (e) => {
    if (!startX.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // Determine axis lock on first move beyond 8px
    if (!locked.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      locked.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    }
    if (locked.current === 'v') return;

    e.preventDefault(); // stop scroll while swiping horizontally
    isDragging.current = true;

    // Rubber-band: slow down after SWIPE_MAX
    const clamped = Math.sign(dx) * Math.min(Math.abs(dx), SWIPE_MAX + (Math.abs(dx) - SWIPE_MAX) * 0.15);
    setOffsetX(clamped);
    setSwipeDir(dx > 0 ? 'right' : dx < 0 ? 'left' : null);
  };

  const onTouchEnd = (e) => {
    if (!startX.current) return;
    const dx = e.changedTouches[0].clientX - startX.current;

    if (isDragging.current && locked.current === 'h' && Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (dx > 0 && !done) {
        // ── Swipe RIGHT → Submit ──
        // Fly card off-screen to the right, then collapse
        setOffsetX(420);
        setReleased(true);
        setTimeout(() => {
          setAnimating(true);
          setOffsetX(0);
          setTimeout(() => {
            setDone(true);
            setAnimating(false);
            onSubmit?.(assignment.id);
          }, 350);
        }, 220);
      } else if (dx < 0) {
        // ── Swipe LEFT → Snooze ──
        setOffsetX(-420);
        setReleased(true);
        setTimeout(() => {
          setOffsetX(0);
          setSwipeDir(null);
          onSnooze?.(assignment.id);
        }, 220);
      } else {
        snapBack();
      }
    } else {
      snapBack();
    }

    startX.current   = null;
    isDragging.current = false;
  };

  const snapBack = () => {
    setReleased(true);
    setOffsetX(0);
    setTimeout(() => { setSwipeDir(null); setReleased(false); }, 300);
  };

  /* ── Derived values for rendering ── */
  const absOffset      = Math.abs(offsetX);
  const actionProgress = Math.min(absOffset / SWIPE_THRESHOLD, 1); // 0→1
  const isSwipingRight = swipeDir === 'right' && offsetX > 8;
  const isSwipingLeft  = swipeDir === 'left'  && offsetX < -8;

  return (
    <div
      className={`relative rounded-2xl mb-3 overflow-hidden ${animating ? 'card-fade-out' : ''}`}
      style={{ touchAction: 'pan-y' }}  /* allow vertical scroll; we block horizontal in handler */
    >
      {/* ══ ACTION LAYER (behind the card) ══ */}
      {/* RIGHT → green submit */}
      <div
        className="absolute inset-0 rounded-2xl flex items-center px-6"
        style={{
          background: `rgba(67,184,156,${0.15 + actionProgress * 0.55})`,
          opacity: isSwipingRight ? 1 : 0,
          transition: released ? 'opacity 0.2s' : 'none',
          justifyContent: 'flex-start',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(67,184,156,0.9)',
              transform: `scale(${0.6 + actionProgress * 0.4})`,
              transition: released ? 'transform 0.2s' : 'transform 0.05s',
              boxShadow: '0 0 16px rgba(67,184,156,0.6)',
            }}
          >
            <CheckCircle2 size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ opacity: actionProgress > 0.6 ? (actionProgress - 0.6) / 0.4 : 0, transition: 'opacity 0.1s' }}>
            <p className="text-xs font-bold" style={{ color: '#43B89C' }}>Submit!</p>
            <p className="text-[10px]" style={{ color: 'rgba(67,184,156,0.7)' }}>Swipe to confirm</p>
          </div>
        </div>
      </div>

      {/* LEFT → amber snooze */}
      <div
        className="absolute inset-0 rounded-2xl flex items-center px-6"
        style={{
          background: `rgba(249,168,37,${0.15 + actionProgress * 0.55})`,
          opacity: isSwipingLeft ? 1 : 0,
          transition: released ? 'opacity 0.2s' : 'none',
          justifyContent: 'flex-end',
        }}
      >
        <div className="flex items-center gap-2.5 flex-row-reverse">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(249,168,37,0.9)',
              transform: `scale(${0.6 + actionProgress * 0.4})`,
              transition: released ? 'transform 0.2s' : 'transform 0.05s',
              boxShadow: '0 0 16px rgba(249,168,37,0.5)',
            }}
          >
            <AlarmClock size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ opacity: actionProgress > 0.6 ? (actionProgress - 0.6) / 0.4 : 0, transition: 'opacity 0.1s', textAlign: 'right' }}>
            <p className="text-xs font-bold" style={{ color: '#F9A825' }}>Snooze!</p>
            <p className="text-[10px]" style={{ color: 'rgba(249,168,37,0.7)' }}>+1 day</p>
          </div>
        </div>
      </div>

      {/* ══ CARD CONTENT (slides on top) ══ */}
      <div
        role="article"
        aria-label={`Task: ${assignment.title}. ${subject?.name || ''}. Due: ${new Date(assignment.deadline).toLocaleDateString()}. ${done ? 'Submitted.' : ''}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          background: 'var(--bg-surface)',
          borderLeft: `4px solid ${subject?.color || '#6C63FF'}`,
          boxShadow: isSwipingRight
            ? `0 0 0 1.5px rgba(67,184,156,${actionProgress * 0.8}), 0 8px 32px rgba(67,184,156,${actionProgress * 0.25})`
            : isSwipingLeft
              ? `0 0 0 1.5px rgba(249,168,37,${actionProgress * 0.8}), 0 8px 32px rgba(249,168,37,${actionProgress * 0.2})`
              : countdown.isOverdue
                ? '0 0 0 1px rgba(239,83,80,0.5), 0 4px 20px rgba(239,83,80,0.1)'
                : 'var(--shadow-main)',
          opacity: done ? 0.5 : 1,
          transform: `translateX(${offsetX}px)`,
          transition: released ? 'transform 0.28s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.2s' : 'box-shadow 0.1s',
          borderRadius: '16px',
          willChange: 'transform',
          position: 'relative',
          zIndex: 1,
          cursor: 'grab',
        }}
      >
        <div className="p-4" onClick={() => !isDragging.current && onViewDetail?.(assignment)} style={{ cursor: 'pointer' }}>

          {/* Top row chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${subject?.color}22`, color: subject?.color }}>
              {subject?.name}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: diff.bg, color: diff.color }}>
              {assignment.difficulty}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: 'var(--btn-glass)', color: 'var(--text-secondary)' }}>
              {addedViaIcon[assignment.added_via]} {assignment.added_via}
            </span>
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
              {assignment.status === 'not_started' && countdown.isUrgent && !countdown.isOverdue && (
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
              )}
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
              aria-label={done ? `${assignment.title} — marked as submitted` : `Mark ${assignment.title} as submitted`}
              aria-pressed={done}
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
              <span className="text-[10px] mt-0.5 block" style={{ color: 'var(--text-tertiary)' }}>
                {assignment.progress_percent}% done
              </span>
            </div>
          )}

          {/* Countdown + TTS */}
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1">
              <Clock size={11} style={{ color: countdown.color }} />
              <span className="text-xs font-medium" style={{ color: countdown.color }}>
                {countdown.text}
              </span>
            </div>
            {a11y?.tts && (
              <button
                onClick={handleReadAloud}
                aria-label={`Read aloud: ${assignment.title}`}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all active:scale-90"
                style={{ background: 'rgba(108,99,255,0.12)', color: '#6C63FF' }}
              >
                🔊 Read
              </button>
            )}
          </div>

          {/* Swipe hint bar — shows while dragging */}
          {(isSwipingRight || isSwipingLeft) && (
            <div className="mt-2 h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--border-light)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${actionProgress * 100}%`,
                  background: isSwipingRight
                    ? 'linear-gradient(90deg, #43B89C, #43B89Caa)'
                    : 'linear-gradient(90deg, #F9A825aa, #F9A825)',
                  marginLeft: isSwipingLeft ? 'auto' : 0,
                  transition: 'width 0.05s',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
