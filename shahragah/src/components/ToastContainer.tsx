import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[1500] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none" dir="rtl">
      {toasts.map((toast) => {
        let borderClass = 'border-borderMuted';
        let icon = <Info className="w-5 h-5 text-forest shrink-0 mt-0.5" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500 shadow-md';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-terracotta shadow-md';
          icon = <AlertTriangle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500';
          icon = <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl bg-ivory-surface border ${borderClass} shadow-lg flex items-start gap-3 transition-all animate-in slide-in-from-bottom duration-300 text-darkText`}
          >
            {icon}
            <div className="flex-1 space-y-1">
              <div className="font-semibold text-xs sm:text-sm text-darkText">{toast.title}</div>
              {toast.description && (
                <div className="text-xs text-slateGreen leading-relaxed font-normal">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slateGreen hover:text-darkText p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
