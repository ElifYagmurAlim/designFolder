import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProUpgradeModal({ isOpen, onClose }: ProUpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Simulate upgrade process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Upgrading to Pro:', selectedPlan);
      // In real implementation, handle payment flow here
      onClose();
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (typeof window === 'undefined') return null;

  const features = [
    "Pro badge",
    "Priority visibility", 
    "Unlimited project listing",
    "See who viewed your profile",
    "Unlimited messaging & video calls"
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10050] flex items-center justify-center p-2 sm:p-4"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Enhanced Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[480px] sm:max-w-[520px] max-h-[90vh] sm:max-h-[85vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header with centered title */}
            <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-700/50 bg-gradient-to-r from-[#316afd]/20 via-[#316afd]/15 to-[#316afd]/20 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#316afd]/10 via-[#316afd]/5 to-[#316afd]/10" />
              <div className="relative flex items-center justify-center">
                <h2 className="text-white text-lg sm:text-xl font-bold">
                  PRO
                </h2>
                <button 
                  onClick={onClose} 
                  className="absolute right-0 p-1.5 sm:p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Pricing Section */}
                <div className="flex gap-4">
                  {/* Monthly Plan */}
                  <div 
                    className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedPlan === 'monthly' 
                        ? 'border-[#316afd] bg-[#316afd]/10' 
                        : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedPlan('monthly')}
                  >
                    <div className="text-center">
                      <div className="text-gray-300 text-sm mb-1">Monthly</div>
                      <div className="text-white text-2xl font-bold">$9</div>
                    </div>
                  </div>

                  {/* Yearly Plan */}
                  <div 
                    className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedPlan === 'yearly' 
                        ? 'border-[#316afd] bg-[#316afd]/10' 
                        : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedPlan('yearly')}
                  >
                    <div className="text-center">
                      <div className="text-gray-300 text-sm mb-1">Annually</div>
                      <div className="text-white text-2xl font-bold">$49</div>
                    </div>
                  </div>
                </div>

                {/* Features List - Simplified */}
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 p-4 sm:p-6 pt-2">
              <motion.div 
                className="flex gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm font-bold bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200"
                  onClick={onClose}
                  disabled={loading}
                >
                  Maybe Later
                </button>
                <button
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm font-bold bg-[#316afd] hover:bg-[#316afd]/90 text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleUpgrade}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Upgrade Now'
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}