import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, signUp, signIn } from '../../lib/supabase';

interface AuthCardProps {
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  confirmPassword?: string;
  general?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsVisible(true);
    
    // Create initial particles
    const initialParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(initialParticles);
    
    // Particle animation interval
    const interval = setInterval(() => {
      setParticles(prev => {
        // Remove some particles
        const remaining = prev.filter(() => Math.random() > 0.2);
        
        // Add new particles
        const newParticles = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100
        }));
        
        return [...remaining, ...newParticles].slice(0, 20);
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return undefined;
  };

  const validateFullName = (name: string): string | undefined => {
    if (!name) return 'Full name is required';
    if (name.length < 2) return 'Full name must be at least 2 characters';
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return undefined;
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' }
    ];

    return { score, ...levels[Math.min(score, 4)] };
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error: string | undefined;
    switch (field) {
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'fullName':
        if (!isLogin) error = validateFullName(formData.fullName);
        break;
      case 'confirmPassword':
        if (!isLogin) error = validateConfirmPassword(formData.password, formData.confirmPassword);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    
    if (!isLogin) {
      newErrors.fullName = validateFullName(formData.fullName);
      newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) throw error;
      }
      
      // Create success particles
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          createParticles(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        }, i * 100);
      }
      
      onSuccess?.();
    } catch (error: any) {
      setErrors({ general: error.message || 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github', e: React.MouseEvent) => {
    createParticles(e.clientX, e.clientY);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setErrors({ general: error.message || 'OAuth sign in failed' });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      setResetSent(true);
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to send reset email' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (e: React.MouseEvent) => {
    createParticles(e.clientX, e.clientY);
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
      rememberMe: false
    });
    setErrors({});
    setTouched({});
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <div className={`w-full max-w-md mx-auto transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover-glow">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 gradient-text">Reset Password</h2>
            <p className="text-gray-200">Enter your email to receive a reset link</p>
          </div>

          {resetSent ? (
            <div className="text-center animate-scale-in">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-celebrate">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 gradient-text">Check Your Email</h3>
              <p className="text-gray-200 mb-6">We've sent a password reset link to {resetEmail}</p>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-purple-400 hover:text-purple-300 transition-all duration-300 hover:scale-105 inline-block"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:border-white/30"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {errors.general && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-shake bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !resetEmail}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover-glow relative overflow-hidden group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Send Reset Link</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 inline-block"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className={`w-full max-w-md mx-auto transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      {/* Particle effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed w-2 h-2 bg-purple-400 rounded-full pointer-events-none z-50 animate-sparkle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}
      
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover-glow relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-pink-600/5 animate-aurora -z-10"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 gradient-text animate-glow">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-200">
            {isLogin ? 'Sign in to transform your photos' : 'Join ImaginAI and start creating magic'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative animate-reveal" style={{animationDelay: '0.1s'}}>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={`w-full bg-white/5 border ${errors.fullName && touched.fullName ? 'border-red-400' : 'border-white/20'} rounded-2xl px-4 py-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:border-white/30`}
                placeholder="Full Name"
                required
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              {errors.fullName && touched.fullName && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>
          )}

          <div className="relative animate-reveal" style={{animationDelay: '0.2s'}}>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full bg-white/5 border ${errors.email && touched.email ? 'border-red-400' : 'border-white/20'} rounded-2xl px-4 py-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:border-white/30`}
              placeholder="Email Address"
              required
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {errors.email && touched.email && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className="relative animate-reveal" style={{animationDelay: '0.3s'}}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={`w-full bg-white/5 border ${errors.password && touched.password ? 'border-red-400' : 'border-white/20'} rounded-2xl px-4 py-4 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:border-white/30`}
              placeholder="Password"
              required
            />
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && touched.password && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}
            {!isLogin && formData.password && (
              <div className="mt-3 animate-fade-in">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-300">Password Strength</span>
                  <span className={`font-medium ${passwordStrength.score >= 3 ? 'text-green-400' : passwordStrength.score >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="relative animate-reveal" style={{animationDelay: '0.4s'}}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full bg-white/5 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-400' : 'border-white/20'} rounded-2xl px-4 py-4 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:border-white/30`}
                placeholder="Confirm Password"
                required
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between animate-reveal" style={{animationDelay: '0.4s'}}>
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-300 group-hover:border-purple-400"
                />
                <span className="text-sm group-hover:text-white transition-colors duration-300">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-all duration-300 hover:scale-105 inline-block"
              >
                Forgot password?
              </button>
            </div>
          )}

          {errors.general && (
            <div className="flex items-center gap-2 text-red-400 text-sm animate-shake bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover-glow relative overflow-hidden group animate-reveal"
            style={{animationDelay: '0.5s'}}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </>
            )}
          </button>

          <div className="relative animate-reveal" style={{animationDelay: '0.6s'}}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-300">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 animate-reveal" style={{animationDelay: '0.7s'}}>
            <button
              type="button"
              onClick={(e) => handleOAuthSignIn('google', e)}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white py-3 px-4 rounded-2xl transition-all duration-500 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed hover-glow group"
            >
              <Chrome className="w-5 h-5 group-hover:animate-spin transition-all duration-500" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleOAuthSignIn('github', e)}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white py-3 px-4 rounded-2xl transition-all duration-500 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed hover-glow group"
            >
              <Github className="w-5 h-5 group-hover:animate-spin transition-all duration-500" />
              <span>GitHub</span>
            </button>
          </div>
        </form>

        <div className="mt-8 text-center animate-reveal" style={{animationDelay: '0.8s'}}>
          <p className="text-gray-300">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={toggleMode}
              className="ml-2 text-purple-400 hover:text-purple-300 font-medium transition-all duration-300 hover:scale-105 inline-block"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {!isLogin && (
          <div className="mt-6 text-center text-xs text-gray-400 animate-reveal" style={{animationDelay: '0.9s'}}>
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              Privacy Policy
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;