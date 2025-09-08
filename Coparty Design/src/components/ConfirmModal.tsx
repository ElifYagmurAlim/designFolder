import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Trash2, CheckCircle, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  requireTyping?: boolean;
  requiredText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  requireTyping = false,
  requiredText = 'DELETE'
}) => {
  const [typedText, setTypedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setTimeout(() => {
        setTypedText('');
      }, 300);
    }
  };

  const handleConfirm = async () => {
    if (requireTyping && typedText !== requiredText) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onConfirm();
    setIsLoading(false);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          iconBg: 'bg-red-500/10 border-red-500/20'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          iconBg: 'bg-yellow-500/10 border-yellow-500/20'
        };
      case 'info':
        return {
          icon: <Info className="w-12 h-12 text-blue-500" />,
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          iconBg: 'bg-blue-500/10 border-blue-500/20'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          confirmButton: 'bg-green-600 hover:bg-green-700 text-white',
          iconBg: 'bg-green-500/10 border-green-500/20'
        };
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          iconBg: 'bg-red-500/10 border-red-500/20'
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isConfirmDisabled = requireTyping ? typedText !== requiredText : false;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-[#111111] border border-[#333333] rounded-2xl shadow-2xl w-full max-w-md p-8 relative mx-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icon */}
            <div className={`w-20 h-20 rounded-full border-2 ${variantStyles.iconBg} flex items-center justify-center mx-auto mb-6`}>
              {variantStyles.icon}
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                {title}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Type to confirm */}
            {requireTyping && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">
                  Type <span className="font-mono text-white bg-[#222222] px-2 py-1 rounded">{requiredText}</span> to confirm:
                </p>
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  className="w-full bg-[#222222] border border-[#444444] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors font-mono"
                  placeholder={requiredText}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 bg-[#222222] hover:bg-[#333333] border border-[#444444] text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading || isConfirmDisabled}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${variantStyles.confirmButton}`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  confirmText
                )}
              </button>
            </div>

            {/* Additional Info */}
            {variant === 'danger' && (
              <div className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-400 text-center">
                  ⚠️ This action cannot be undone
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;