import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    emoji: '📚',
    title: 'Add your subjects',
    desc: 'Set up your courses and subjects. DeadlineOS uses them to color-code and organize all your tasks automatically.',
  },
  {
    emoji: '⏰',
    title: 'Log your first deadline',
    desc: 'Tap the + button to quickly add any assignment. Set the subject, deadline, and difficulty in under a minute.',
  },
  {
    emoji: '🔔',
    title: 'Turn on reminders',
    desc: 'Never miss a deadline again. Enable smart notifications and let DeadlineOS keep you on track every day.',
    isFinal: true,
  },
];

export function Onboarding({ onDone }) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else onDone();
  };

  const slide = slides[current];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'var(--bg-main)' }}>
      <div className="w-full max-w-[430px] h-full flex flex-col items-center justify-center px-8">
        {/* Emoji */}
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl mb-8 onboard-slide"
          key={`emoji-${current}`}
          style={{ background: 'rgba(108,99,255,0.15)', border: '2px solid rgba(108,99,255,0.25)' }}
        >
          {slide.emoji}
        </div>

        {/* Content */}
        <div className="text-center onboard-slide" key={`content-${current}`}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{slide.title}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{slide.desc}</p>
        </div>

        {/* Dots */}
        <div className="flex gap-2 my-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current ? '#6C63FF' : 'var(--border-medium)',
              }}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)' }}
        >
          {slide.isFinal ? 'Get Started 🚀' : (
            <><span>Next</span><ChevronRight size={18} /></>
          )}
        </button>

        {/* Skip */}
        {!slide.isFinal && (
          <button onClick={onDone} className="mt-4 text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
