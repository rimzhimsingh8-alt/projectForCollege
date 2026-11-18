import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  height = 'h-2',
  color = 'bg-purple-600',
  trackColor = 'bg-slate-100 dark:bg-slate-800',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / (max || 1)) * 100)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          <span>{value} / {max}</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{percentage}%</span>
        </div>
      )}
      <div className={`w-full ${height} ${trackColor} rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
