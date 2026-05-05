import { useState } from 'react';
import { appData, getSubject, formatCountdown, difficultyConfig, addedViaIcon } from '../data';
import {
  X, Clock, Edit3, CheckCircle2, AlarmClock, Trash2,
  FileText, Tag, Paperclip, BarChart3, StickyNote, Bell
} from 'lucide-react';

export function TaskDetailSheet({ assignment, onClose, onSubmit, onSnooze, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { subjects } = appData.user;
  const subject = getSubject(subjects, assignment.subject_id);
  const countdown = formatCountdown(assignment.deadline);
  const diff = difficultyConfig[assignment.difficulty];

  const deadlineDate = new Date(assignment.deadline);
  const dateStr = deadlineDate.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  const timeStr = deadlineDate.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });

  return (
    <>
      <div className="fixed inset-0 overlay z-[60]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 w-full z-[70] sheet-slide-up"
        style={{
          background: 'var(--bg-surface)',
          borderRadius: '24px 24px 0 0',
          border: '1px solid var(--border-focus)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}>

        {/* Drag handle */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-medium)' }} />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-3 pb-2">
          <div className="flex-1 min-w-0 pr-3">
            {/* Subject + Difficulty chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: `${subject?.color}22`, color: subject?.color }}>
                {subject?.name}
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: diff.bg, color: diff.color }}>
                {assignment.difficulty}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'var(--btn-glass)', color: 'var(--text-secondary)' }}>
                {addedViaIcon[assignment.added_via]} {assignment.added_via}
              </span>
              {assignment.submitted && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(67,184,156,0.2)', color: '#43B89C' }}>
                  ✓ SUBMITTED
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{assignment.title}</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            style={{ background: 'var(--btn-glass)' }}>
            <X size={14} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">

          {/* Deadline row */}
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl"
            style={{ background: 'var(--btn-glass)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${countdown.color}18` }}>
              <Clock size={18} style={{ color: countdown.color }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Deadline</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{dateStr} · {timeStr}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: countdown.color }}>
                {countdown.text}
              </p>
            </div>
          </div>

          {/* Reminder */}
          {assignment.reminder && assignment.reminder !== 'None' && (
            <div className="flex items-center gap-3 mb-5 px-3 py-2.5 rounded-xl border border-dashed" style={{ borderColor: 'var(--border-medium)', background: 'var(--btn-glass)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/10">
                <Bell size={14} className="text-violet-500" />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Reminder Set</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{assignment.reminder} before deadline</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Description</p>
            </div>
            <p className="text-sm leading-relaxed pl-[22px]" style={{ color: 'var(--text-primary)' }}>
              {assignment.description || 'No description provided.'}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={14} style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Progress</p>
              <span className="ml-auto text-xs font-bold" style={{ color: subject?.color || '#6C63FF' }}>
                {assignment.progress_percent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full ml-[22px]" style={{
              background: 'var(--border-light)',
              width: 'calc(100% - 22px)',
            }}>
              <div className="h-2 rounded-full transition-all duration-500" style={{
                width: `${assignment.progress_percent}%`,
                background: `linear-gradient(90deg, ${subject?.color || '#6C63FF'}, ${subject?.color || '#6C63FF'}aa)`,
              }} />
            </div>
          </div>

          {/* Notes */}
          {assignment.notes && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote size={14} style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Notes</p>
              </div>
              <div className="ml-[22px] p-3 rounded-xl" style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.15)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{assignment.notes}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {assignment.tags?.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={14} style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Tags</p>
              </div>
              <div className="flex flex-wrap gap-2 ml-[22px]">
                {assignment.tags.map(tag => (
                  <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-lg"
                    style={{ background: 'var(--btn-glass)', color: 'var(--text-secondary)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attached Files placeholder */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Paperclip size={14} style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Attachments</p>
            </div>
            <div className="ml-[22px] flex items-center gap-3 p-3 rounded-xl border border-dashed"
              style={{ borderColor: 'var(--border-medium)', background: 'var(--btn-glass)' }}>
              <Paperclip size={16} style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No files attached</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mb-2">
            {!assignment.submitted && (
              <>
                <button
                  onClick={() => { onSubmit?.(assignment.id); onClose(); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
                  style={{ background: 'rgba(67,184,156,0.15)', color: '#43B89C', border: '1px solid rgba(67,184,156,0.3)' }}>
                  <CheckCircle2 size={16} />
                  Submit
                </button>
                <button
                  onClick={() => { onSnooze?.(assignment.id); onClose(); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
                  style={{ background: 'rgba(249,168,37,0.15)', color: '#F9A825', border: '1px solid rgba(249,168,37,0.3)' }}>
                  <AlarmClock size={16} />
                  Snooze
                </button>
              </>
            )}
            <button
              onClick={() => { onClose(); onEdit?.(assignment); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
              style={{ background: 'rgba(108,99,255,0.15)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.3)' }}>
              <Edit3 size={16} />
              Edit
            </button>
          </div>

          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium transition-all active:scale-[0.97]"
              style={{ color: '#EF5350' }}>
              <Trash2 size={14} />
              Delete Task
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-2xl text-sm font-medium"
                style={{ background: 'var(--btn-glass)', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button
                onClick={() => { onDelete?.(assignment.id); onClose(); }}
                className="flex-1 py-2.5 rounded-2xl text-sm font-bold"
                style={{ background: 'rgba(239,83,80,0.15)', color: '#EF5350', border: '1px solid rgba(239,83,80,0.3)' }}>
                Confirm Delete
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
