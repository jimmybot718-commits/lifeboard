'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let toastListeners: Array<(toast: Toast) => void> = [];

export const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
  const toast: Toast = {
    id: Math.random().toString(36).slice(2),
    message,
    type,
    duration,
  };
  toastListeners.forEach((listener) => listener(toast));
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration || 3000);
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-neon-green/10 border-neon-green/40 text-neon-green';
      case 'error':
        return 'bg-neon-pink/10 border-neon-pink/40 text-neon-pink';
      case 'warning':
        return 'bg-neon-orange/10 border-neon-orange/40 text-neon-orange';
      default:
        return 'bg-white/[0.05] border-white/10 text-white/80';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-xl
            animate-slide-up
            ${getToastStyles(toast.type)}
          `}
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              {toast.type === 'success' && (
                <div className="w-5 h-5 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-5 h-5 rounded-full bg-neon-pink/20 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              {toast.type === 'warning' && (
                <div className="w-5 h-5 rounded-full bg-neon-orange/20 flex items-center justify-center">
                  <span className="text-xs font-bold">!</span>
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold">i</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
