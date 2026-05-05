import { useState, useEffect } from 'react';
import { appData } from '../data';
import { X, Plus, Calendar, ChevronDown } from 'lucide-react';

const SUBJECTS = appData.user.subjects;

export function QuickAddSheet({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].id);
  const [deadline, setDeadline] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [warn6h, setWarn6h] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (deadline && deadlineTime) {
      const due = new Date(`${deadline}T${deadlineTime}`);
      const diffH = (due - new Date()) / 3600000;
      setWarn6h(diffH >= 0 && diffH <= 6);
    } else setWarn6h(false);
  }, [deadline, deadlineTime]);

  const handleAdd = () => {
    if (!title.trim() || !deadline || !deadlineTime) return;
    const newTask = {
      id: `a${Date.now()}`,
      title: title.trim(),
      subject_id: selectedSubject,
      description: notes,
      difficulty,
      deadline: `${deadline}T${deadlineTime}`,
      added_via: 'WhatsApp',
      status: 'not_started',
      progress_percent: 0,
      submitted: false,
      tags: [],
      notes,
    };
    onAdd?.(newTask);
    onClose?.();
  };

  const diffs = ['Easy', 'Medium', 'Hard'];
  const diffColors = { Easy: '#43B89C', Medium: '#F9A825', Hard: '#EF5350' };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 overlay z-40" onClick={onClose} />
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-50 sheet-slide-up"
        style={{ background: '#1A1A2E', borderRadius: '24px 24px 0 0', border: '1px solid rgba(108,99,255,0.2)' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>
        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-lg font-bold text-white">Add Deadline</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <X size={16} className="text-gray-300" />
          </button>
        </div>

        <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: '75vh' }}>
          {/* Title */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">Task Title *</label>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Machine Learning Assignment"
              className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-gray-500 input-focus"
              style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">Subject</label>
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
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">Date *</label>
              <input
                type="date"
                min={todayStr}
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl text-sm text-white input-focus"
                style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">Time *</label>
              <input
                type="time"
                value={deadlineTime}
                onChange={e => setDeadlineTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl text-sm text-white input-focus"
                style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }}
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
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">Difficulty</label>
            <div className="flex gap-2">
              {diffs.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: difficulty === d ? `${diffColors[d]}33` : 'rgba(255,255,255,0.05)',
                    color: difficulty === d ? diffColors[d] : '#6b7280',
                    border: `1px solid ${difficulty === d ? diffColors[d] + '66' : 'transparent'}`,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any extra details..."
              rows={2}
              className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-gray-500 input-focus resize-none"
              style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleAdd}
            disabled={!title.trim() || !deadline || !deadlineTime}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)' }}
          >
            Add Task
          </button>
        </div>
      </div>
    </>
  );
}
