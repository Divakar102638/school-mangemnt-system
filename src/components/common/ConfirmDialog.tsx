import React from 'react';
import { AlertTriangle, Trash2, RefreshCw, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const variantIcons = {
    danger: <Trash2 className="w-6 h-6 text-rose-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    info: <RefreshCw className="w-6 h-6 text-teal-600" />
  };

  const variantBadgeBg = {
    danger: 'bg-rose-50',
    warning: 'bg-amber-50',
    info: 'bg-teal-50'
  };

  const confirmBtnStyles = {
    danger: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white shadow-xs',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white shadow-xs',
    info: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 text-white shadow-xs'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 transform transition-all animate-in zoom-in-95 duration-150">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${variantBadgeBg[variant]}`}>
              {variantIcons[variant]}
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 ${confirmBtnStyles[variant]}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
