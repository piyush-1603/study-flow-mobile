import { useState, useMemo } from 'react';
import { buildWeeklyHeatmap, loadColor, loadHeight } from '../data';

export function HeatmapStrip({ assignments = [], onDayTap }) {
  const [tooltip, setTooltip] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  const heatmap = useMemo(() => buildWeeklyHeatmap(assignments), [assignments]);

  const handleTap = (item) => {
    setTooltip(tooltip?.date === item.date ? null : item);
    onDayTap?.(item);
  };

  return (
    <div className="relative">
      <div className="flex gap-1.5 justify-between">
        {heatmap.map((item) => {
          const isToday = item.date === today;
          const isCritical = item.load === 'critical';
          return (
            <div key={item.date} className="flex-1 flex flex-col items-center gap-1.5" onClick={() => handleTap(item)}>
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{item.day}</span>
              {/* Bar container */}
              <div className="w-full h-10 rounded-lg flex items-end overflow-hidden cursor-pointer"
                style={{ background: 'var(--btn-glass)' }}>
                <div
                  className={`w-full rounded-lg transition-all duration-700 heat-bar-grow ${isCritical ? 'critical-pulse' : ''}`}
                  style={{
                    height: item.load === 'none' ? '0%' : loadHeight[item.load],
                    background: item.load === 'none' ? 'transparent' : loadColor[item.load],
                    opacity: 0.85,
                  }}
                />
              </div>
              {/* Today indicator */}
              {isToday && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#6C63FF' }} />
              )}
            </div>
          );
        })}
      </div>
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-1 z-10 animate-fade-in">
          <div className="glass rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap border"
            style={{ color: 'var(--text-primary)', borderColor: 'var(--border-light)', background: 'var(--bg-glass)' }}>
            {tooltip.count} task{tooltip.count !== 1 ? 's' : ''} due · {tooltip.load === 'none' ? 'free' : tooltip.load} load
          </div>
        </div>
      )}
    </div>
  );
}

