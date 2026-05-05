import { useState } from 'react';
import { appData, loadColor, loadHeight } from '../data';

export function HeatmapStrip({ onDayTap }) {
  const [tooltip, setTooltip] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  const handleTap = (item) => {
    setTooltip(tooltip?.date === item.date ? null : item);
    onDayTap?.(item);
  };

  return (
    <div className="relative">
      <div className="flex gap-1.5 justify-between">
        {appData.weekly_heatmap.map((item) => {
          const isToday = item.date === today;
          const isCritical = item.load === 'critical';
          return (
            <div key={item.date} className="flex-1 flex flex-col items-center gap-1.5" onClick={() => handleTap(item)}>
              <span className="text-[10px] text-gray-400 font-medium">{item.day}</span>
              {/* Bar container */}
              <div className="w-full h-10 rounded-lg flex items-end overflow-hidden cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className={`w-full rounded-lg transition-all duration-700 heat-bar-grow ${isCritical ? 'critical-pulse' : ''}`}
                  style={{
                    height: loadHeight[item.load],
                    background: loadColor[item.load],
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
          <div className="glass rounded-xl px-3 py-1.5 text-xs text-white font-medium whitespace-nowrap border border-white/10">
            {tooltip.count} task{tooltip.count !== 1 ? 's' : ''} due · {tooltip.load} load
          </div>
        </div>
      )}
    </div>
  );
}
