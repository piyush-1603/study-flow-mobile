import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { appData, getSubject, formatCountdown, difficultyConfig } from '../data';
import { TaskCard } from './TaskCard';

export function SearchOverlay({ assignments, onClose, onSubmit, onSnooze, onEdit, onViewDetail }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const { subjects } = appData.user;

  const results = query.trim().length > 0
    ? assignments.filter(a => {
        const q = query.toLowerCase();
        const subj = getSubject(subjects, a.subject_id);
        return a.title.toLowerCase().includes(q) ||
          (a.notes && a.notes.toLowerCase().includes(q)) ||
          (subj && subj.name.toLowerCase().includes(q));
      })
    : [];

  return (
    <div className="fixed inset-0 z-[80] search-fade-in" style={{ background: 'var(--bg-main)' }}>
      <div className="w-full max-w-[430px] mx-auto h-full flex flex-col">

        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            style={{ background: 'var(--btn-glass)' }}>
            <ArrowLeft size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search assignments..."
              className="w-full pl-10 pr-9 py-3 rounded-2xl text-sm placeholder-gray-500 input-focus"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-focus)', color: 'var(--text-primary)' }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {query.trim().length === 0 ? (
            <div className="flex flex-col items-center pt-20">
              <Search size={40} style={{ color: 'var(--text-secondary)' }} className="mb-4" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Search by task name</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Results will appear as you type</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center pt-20">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No results for "{query}"</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Try a different keyword</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              {results.map(a => (
                <TaskCard
                  key={a.id}
                  assignment={a}
                  onSubmit={(id) => { onSubmit?.(id); }}
                  onSnooze={(id) => { onSnooze?.(id); }}
                  onEdit={(task) => { onClose(); onEdit?.(task); }}
                  onViewDetail={(task) => { onClose(); onViewDetail?.(task); }}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
