import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Eye, EyeOff, Github, Chrome } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form after a delay to prevent flicker during close animation
      setTimeout(() => {
        setAuthMode('login');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    console.log('Auth attempt:', { authMode, email, password });
    handleClose();
  };

  const handleSocialAuth = (provider: string) => {
    console.log('Social auth with:', provider);
  };

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

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {authMode === 'login' && 'Welcome Back'}
                {authMode === 'signup' && 'Create Account'}
                {authMode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-gray-400">
                {authMode === 'login' && 'Sign in to your account to continue'}
                {authMode === 'signup' && 'Join our community of developers'}
                {authMode === 'forgot' && 'Enter your email to reset your password'}
              </p>
            </div>

            {/* Social Auth Buttons */}
            {authMode !== 'forgot' && (
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialAuth('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-[#222222] hover:bg-[#333333] border border-[#444444] text-white px-4 py-3 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </button>
                <button
                  onClick={() => handleSocialAuth('github')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-[#222222] hover:bg-[#333333] border border-[#444444] text-white px-4 py-3 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  <Github className="w-5 h-5" />
                  Continue with GitHub
                </button>
              </div>
            )}

            {/* Divider */}
            {authMode !== 'forgot' && (
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#333333]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[#111111] px-4 text-gray-400">or</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#222222] border border-[#444444] rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#316afd] transition-colors"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              {authMode !== 'forgot' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#222222] border border-[#444444] rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#316afd] transition-colors"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password Input */}
              {authMode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#222222] border border-[#444444] rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#316afd] transition-colors"
                      placeholder="Confirm your password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Forgot Password Link */}
              {authMode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-sm text-[#316afd] hover:text-blue-400 transition-colors"
                    disabled={isLoading}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#316afd] hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {authMode === 'login' && 'Sign In'}
                    {authMode === 'signup' && 'Create Account'}
                    {authMode === 'forgot' && 'Send Reset Link'}
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              {authMode === 'login' && (
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-[#316afd] hover:text-blue-400 transition-colors font-medium"
                    disabled={isLoading}
                  >
                    Sign up
                  </button>
                </p>
              )}
              {authMode === 'signup' && (
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-[#316afd] hover:text-blue-400 transition-colors font-medium"
                    disabled={isLoading}
                  >
                    Sign in
                  </button>
                </p>
              )}
              {authMode === 'forgot' && (
                <p className="text-gray-400">
                  Remember your password?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-[#316afd] hover:text-blue-400 transition-colors font-medium"
                    disabled={isLoading}
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;