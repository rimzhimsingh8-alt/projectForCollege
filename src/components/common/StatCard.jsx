import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'purple',
  className = ''
}) => {
  const colorMap = {
    purple: {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      badge: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50'
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      badge: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      badge: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50'
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      badge: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'
    }
  }[colorScheme] || {
    bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    badge: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50'
  };

  return (
    <div
      className={`relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`p-3 rounded-2xl border ${colorMap.bg} transition-transform duration-300 group-hover:scale-105 shrink-0`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-medium">
          <span className={`px-2 py-0.5 rounded-md font-semibold ${colorMap.badge}`}>
            {trend.value}
          </span>
          <span className="text-slate-500 dark:text-slate-400 truncate">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
