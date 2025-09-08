import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowLeft } from 'lucide-react';
import { FormInput } from './FormInput';
import slide1Image from 'figma:asset/fc21a2a9f15a3206f75fce1196db1942e09c42bc.png';
import slide2Image from 'figma:asset/38f771f79c10aa575d3e159fe6882d86e1c20a54.png';
import slide3Image from 'figma:asset/db1627d91fea0438521b6c67d99772447672f2a4.png';
import logoImage from 'figma:asset/48d4bdafb1d7cd86d25a47ed9c25472033bf4994.png';

type AuthMode = 'login' | 'signup' | 'forgot';

interface OnboardingSlide {
  id: number;
  image: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    image: slide1Image
  },
  {
    id: 2,
    image: slide2Image
  },
  {
    id: 3,
    image: slide3Image
  }
];

interface AuthPageProps {
  onBack?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Onboarding slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  // Auto-play slider
  useEffect(() => {
    if (!autoPlayEnabled) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlayEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    console.log('Auth attempt:', { authMode, email, password });
  };

  const handleSocialAuth = (provider: string) => {
    console.log('Social auth with:', provider);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlayEnabled(false);
    setTimeout(() => setAutoPlayEnabled(true), 8000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-card hover:bg-accent border border-border text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* Left Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo/Brand */}
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8">
              <img 
                src={logoImage} 
                alt="CoParty Logo" 
                className="mx-auto h-12 w-auto"
              />
            </div>
            
            <h1 className="text-foreground mb-3">
              {authMode === 'signup' ? 'Join CoParty' : authMode === 'login' ? 'Welcome Back' : 'Reset Password'}
            </h1>
            {authMode === 'login' && (
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-foreground hover:underline transition-colors"
                  disabled={isLoading}
                >
                  Join CoParty
                </button>
              </p>
            )}
            {authMode === 'signup' && (
              <p className="text-muted-foreground">
                Have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-foreground hover:underline transition-colors"
                  disabled={isLoading}
                >
                  Login
                </button>
              </p>
            )}
            {authMode === 'forgot' && (
              <p className="text-muted-foreground">Enter your email to reset your password</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <FormInput
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={isLoading}
            />

            {/* Password Input */}
            {authMode !== 'forgot' && (
              <FormInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
            )}

            {/* Confirm Password Input */}
            {authMode === 'signup' && (
              <FormInput
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                disabled={isLoading}
              />
            )}

            {/* Privacy Policy */}
            {authMode === 'signup' && (
              <div className="text-sm text-muted-foreground">
                By registering, you agree to read and understand the{' '}
                <button
                  type="button"
                  className="text-foreground hover:underline transition-colors"
                >
                  Privacy Policy
                </button>
                .
              </div>
            )}

            {/* Forgot Password Link */}
            {authMode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
              className="w-full px-4 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{
                backgroundColor: '#111111',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#316afd';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#111111';
                }
              }}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
              ) : (
                <>
                  {authMode === 'login' && 'Sign In'}
                  {authMode === 'signup' && 'Join Now'}
                  {authMode === 'forgot' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          {/* Social Auth */}
          {authMode !== 'forgot' && (
            <>
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-muted-foreground">OR</span>
                </div>
              </div>

              {/* Google Button */}
              <button
                onClick={() => handleSocialAuth('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 border border-border px-4 py-3 rounded-xl transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: '#111111',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#316afd';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#111111';
                  }
                }}
              >
                <Chrome className="w-5 h-5" />
                Sign in with Google
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Onboarding Slider */}
      <div className="hidden lg:flex lg:flex-1 bg-black relative overflow-hidden">
        <div className="w-full h-full relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center p-12"
            >
              {/* Slide Image */}
              <div className="w-full max-w-lg">
                <img
                  src={onboardingSlides[currentSlide].image}
                  alt={`Slide ${currentSlide + 1}`}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <motion.div
              className="h-full"
              style={{ backgroundColor: '#316afd' }}
              initial={{ width: '0%' }}
              animate={{ width: `${((currentSlide + 1) / onboardingSlides.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;