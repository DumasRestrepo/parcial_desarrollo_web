import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import '../components/layout/alert.css';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface AlertContextType {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (options: ConfirmOptions) => void;
}

const AlertContext = createContext<AlertContextType>({} as AlertContextType);

export const useAlert = () => useContext(AlertContext);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmOptions | null>(
    null,
  );

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    setConfirmConfig(options);
  }, []);

  const handleConfirm = () => {
    if (confirmConfig) {
      confirmConfig.onConfirm();
      setConfirmConfig(null);
    }
  };

  const handleCancel = () => {
    if (confirmConfig) {
      if (confirmConfig.onCancel) confirmConfig.onCancel();
      setConfirmConfig(null);
    }
  };

  return (
    <AlertContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <span className="toast__icon">
              {toast.type === 'success'
                ? '✅'
                : toast.type === 'error'
                  ? '❌'
                  : 'ℹ️'}
            </span>
            <span className="toast__msg">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmConfig && (
        <div className="confirm-overlay" onClick={handleCancel}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm__title">{confirmConfig.title}</h3>
            <p className="confirm__msg">{confirmConfig.message}</p>
            <div className="confirm__actions">
              <button className="btn btn--ghost" onClick={handleCancel}>
                {confirmConfig.cancelText || 'Cancelar'}
              </button>
              <button className="btn btn--danger" onClick={handleConfirm}>
                {confirmConfig.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
