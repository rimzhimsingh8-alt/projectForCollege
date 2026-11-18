import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let colorClasses = 'bg-slate-900/95 text-white border-slate-700/50 dark:bg-slate-800/95';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClasses = 'bg-emerald-950/95 text-emerald-100 border-emerald-700/60 shadow-emerald-900/20';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'bg-rose-950/95 text-rose-100 border-rose-700/60 shadow-rose-900/20';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClasses = 'bg-purple-950/95 text-purple-100 border-purple-700/60 shadow-purple-900/20';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${colorClasses}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5 text-current opacity-90" />
            <div className="flex-1 text-sm">
              {toast.title && <div className="font-semibold text-xs uppercase tracking-wider mb-0.5 opacity-90">{toast.title}</div>}
              <div className="font-medium leading-snug">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
