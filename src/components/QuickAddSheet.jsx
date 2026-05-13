import { useState, useEffect } from 'react';
import { appData } from '../data';
import { X, Plus, Calendar, ChevronDown, Trash2 } from 'lucide-react';

const SUBJECTS = appData.user.subjects;

export function QuickAddSheet({ onClose, onAdd, editTask, onSave, onDelete }) {
  const isEditing = !!editTask;

  const [title, setTitle] = useState(isEditing ? editTask.title : '');
  const [selectedSubject, setSelectedSubject] = useState(isEditing ? editTask.subject_id : SUBJECTS[0].id);
  const [deadline, setDeadline] = useState(isEditing ? editTask.deadline.split('T')[0] : '');
  const [deadlineTime, setDeadlineTime] = useState(() => {
    if (isEditing) {
      const timePart = editTask.deadline.split('T')[1];
      return timePart ? timePart.slice(0, 5) : '';
    }
    return '';
  });
  const [difficulty, setDifficulty] = useState(isEditing ? editTask.difficulty : 'Medium');
  const [reminder, setReminder] = useState(isEditing ? (editTask.reminder || '1 Day') : '1 Day');
  const [notes, setNotes] = useState(isEditing ? (editTask.notes || '') : '');
  const [progress, setProgress] = useState(isEditing ? editTask.progress_percent : 0);
  const [warn6h, setWarn6h] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (deadline && deadlineTime) {
      const due = new Date(`${deadline}T${deadlineTime}`);
      const diffH = (due - new Date()) / 3600000;
      setWarn6h(diffH >= 0 && diffH <= 6);
    } else setWarn6h(false);
  }, [deadline, deadlineTime]);

  const handleSubmit = () => {
    if (!title.trim() || !deadline || !deadlineTime) return;

    if (isEditing) {
      onSave?.({
        ...editTask,
        title: title.trim(),
        subject_id: selectedSubject,
        difficulty,
        reminder,
        deadline: `${deadline}T${deadlineTime}:00`,
        notes,
        description: notes,
        progress_percent: progress,
        status: progress > 0 ? 'in_progress' : 'not_started',
      });
    } else {
      const newTask = {
        id: `a${Date.now()}`,
        title: title.trim(),
        subject_id: selectedSubject,
        description: notes,
        difficulty,
        reminder,
        deadline: `${deadline}T${deadlineTime}`,
        added_via: 'WhatsApp',
        status: 'not_started',
        progress_percent: 0,
        submitted: false,
        tags: [],
        notes,
      };
      onAdd?.(newTask);
    }
    onClose?.();
  };

  const handleDelete = () => {
    onDelete?.(editTask.id);
    onClose?.();
  };

  const diffs = ['Easy', 'Medium', 'Hard'];
  const diffColors = { Easy: '#43B89C', Medium: '#F9A825', Hard: '#EF5350' };
  const reminderOpts = ['1 Day', '3 Days', '1 Week'];
  const progressSteps = [0, 25, 50, 75, 100];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 overlay z-40" onClick={onClose} />
      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 w-full z-50 sheet-slide-up max-w-[430px] mx-auto"
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          border: '1px solid var(--border-light)',
          borderBottom: 'none',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-medium)' }} />
        </div>
        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {isEditing ? 'Edit Task' : 'Add Deadline'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--btn-glass)' }}>
            <X size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: '75vh' }}>
          {/* Title */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Task Title *</label>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Machine Learning Assignment"
              className="w-full px-4 py-3 rounded-2xl text-sm placeholder-gray-500 input-focus"
              style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Subject</label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {SUBJECTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubject(s.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all subject-chip"
                  style={{
                    background: selectedSubject === s.id ? s.color : `${s.color}22`,
                    color: selectedSubject === s.id ? '#fff' : s.color,
                    border: `1px solid ${s.color}44`,
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline date + time */}
          <div className="mb-4 flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Date *</label>
              <input
                type="date"
                min={todayStr}
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl text-sm input-focus"
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', colorScheme: 'dark' }}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Time *</label>
              <input
                type="time"
                value={deadlineTime}
                onChange={e => setDeadlineTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl text-sm input-focus"
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* 6h warning */}
          {warn6h && (
            <div className="mb-4 px-3 py-2 rounded-xl text-xs text-amber-400 font-medium flex items-center gap-2"
              style={{ background: 'rgba(249,168,37,0.12)', border: '1px solid rgba(249,168,37,0.25)' }}>
              ⚠️ This is due very soon!
            </div>
          )}

          {/* Difficulty */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Difficulty</label>
            <div className="flex gap-2">
              {diffs.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: difficulty === d ? `${diffColors[d]}33` : 'var(--btn-glass)',
                    color: difficulty === d ? diffColors[d] : 'var(--text-secondary)',
                    border: `1px solid ${difficulty === d ? diffColors[d] + '66' : 'transparent'}`,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder / Notification */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Reminder Notification</label>
            <div className="flex gap-2">
              {reminderOpts.map(r => (
                <button
                  key={r}
                  onClick={() => setReminder(r)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: reminder === r ? 'rgba(108,99,255,0.15)' : 'var(--btn-glass)',
                    color: reminder === r ? '#6C63FF' : 'var(--text-secondary)',
                    border: `1px solid ${reminder === r ? 'rgba(108,99,255,0.4)' : 'transparent'}`,
                  }}
                >
                  {`🔔 ${r} before`}
                </button>
              ))}
            </div>
          </div>

          {/* Progress (only in edit mode) */}
          {isEditing && (
            <div className="mb-4">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Progress — {progress}%
              </label>
              <div className="flex gap-2">
                {progressSteps.map(p => (
                  <button
                    key={p}
                    onClick={() => setProgress(p)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: progress === p ? 'rgba(108,99,255,0.3)' : 'var(--btn-glass)',
                      color: progress === p ? '#6C63FF' : 'var(--text-secondary)',
                      border: `1px solid ${progress === p ? 'rgba(108,99,255,0.5)' : 'transparent'}`,
                    }}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-5">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any extra details..."
              rows={2}
              className="w-full px-4 py-3 rounded-2xl text-sm placeholder-gray-500 input-focus resize-none"
              style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !deadline || !deadlineTime}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)' }}
          >
            {isEditing ? 'Save Changes' : 'Add Task'}
          </button>

          {/* Delete button (edit mode only) */}
          {isEditing && (
            <>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm mt-3 transition-all active:scale-95 flex items-center justify-center gap-2"
                  style={{ border: '1px solid rgba(239,83,80,0.3)', color: '#EF5350', background: 'rgba(239,83,80,0.06)' }}
                >
                  <Trash2 size={14} />
                  Delete Task
                </button>
              ) : (
                <div className="mt-3 rounded-2xl p-4"
                  style={{ background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.3)' }}>
                  <p className="text-xs text-red-400 font-medium mb-3 text-center">
                    Delete "{editTask.title}"?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                      style={{ background: 'var(--btn-glass)', color: 'var(--text-secondary)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                      style={{ background: 'rgba(239,83,80,0.25)', color: '#EF5350' }}
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
