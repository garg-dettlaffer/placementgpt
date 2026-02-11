import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', closeButton = true }) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`fixed left-1/2 top-1/2 z-50 w-full ${sizeClasses[size]} transform -translate-x-1/2 -translate-y-1/2`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl overflow-hidden">
              {(title || closeButton) && (
                <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
                  {title && <h2 className="text-xl font-bold text-dark-900 dark:text-white">{title}</h2>}
                  {title && <div className="flex-1" />}
                  {closeButton && (
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-dark-100 dark:hover:bg-dark-700 rounded transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ConfirmModal({ isOpen, onClose, title, message, onConfirm, loading = false, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'default' }) {
  const confirmButtonClass = variant === 'danger' 
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'btn-primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-dark-600 dark:text-dark-400 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="btn-secondary"
          disabled={loading}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={confirmButtonClass}
          disabled={loading}
        >
          {loading ? 'Loading...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
