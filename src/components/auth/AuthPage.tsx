import React from 'react';
<<<<<<< HEAD
import { Sparkles } from 'lucide-react';
=======
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
>>>>>>> 95509cf71d68041fbfd2d0029b8c4e0781b1e89f
import AuthCard from './AuthCard';

interface AuthPageProps {
  onSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
<<<<<<< HEAD
=======
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleAuthSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/dashboard');
    }
  };

>>>>>>> 95509cf71d68041fbfd2d0029b8c4e0781b1e89f
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 font-inter overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-center pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">ImaginAI</h1>
            <p className="text-sm text-gray-300">Privacy-First AI Magic</p>
          </div>
        </div>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
        <AuthCard onSuccess={onSuccess} />
=======
        <AuthCard onSuccess={handleAuthSuccess} onBack={handleBack} />
>>>>>>> 95509cf71d68041fbfd2d0029b8c4e0781b1e89f
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-8">
        <p className="text-gray-400 text-sm">
          Transform your photos into Studio Ghibli masterpieces
        </p>
      </div>
    </div>
  );
};

export default AuthPage;