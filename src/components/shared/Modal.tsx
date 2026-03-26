import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all duration-200 animate-in fade-in zoom-in-95 slide-in-from-bottom-4`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
