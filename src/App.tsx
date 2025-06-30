import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Shield, Zap, Sparkles, Upload, Check, Star, ArrowRight, Heart, Users, Clock } from 'lucide-react';
import AuthGuard from './components/auth/AuthGuard';
import AuthPage from './components/auth/AuthPage';
import PasswordReset from './components/auth/PasswordReset';
import Dashboard from './components/dashboard/Dashboard';
import PricingPage from './components/pricing/PricingPage';
import PrivacyPage from './components/privacy/PrivacyPage';
import CookieConsent from './components/privacy/CookieConsent';
import { useAuth } from './hooks/useAuth';

// Landing Page Component
const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 font-inter overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className={`max-w-7xl mx-auto text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-200">Privacy-First AI Magic</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your Photos into{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                Studio Ghibli Magic
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the wonder of AI-powered transformation while keeping your privacy intact. 
              Your original images are automatically deleted from our servers within 30 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/dashboard"
                className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3"
              >
                <Upload className="w-5 h-5 group-hover:animate-bounce" />
                Upload Your Photo
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </a>
              <a
                href="/pricing"
                className="group text-white font-medium py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-2"
              >
                See Pricing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Studio Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ImaginAI?
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Experience the perfect blend of cutting-edge AI technology and uncompromising privacy protection.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Privacy First',
                description: 'Your images are automatically deleted from our servers within 30 seconds. No storage, no tracking, complete privacy.',
                color: 'from-green-400 to-emerald-400'
              },
              {
                icon: Sparkles,
                title: 'Studio Quality',
                description: 'Advanced AI models trained specifically on Studio Ghibli artwork to create authentic, beautiful transformations.',
                color: 'from-purple-400 to-pink-400'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Get your transformed images in seconds, not minutes. Our optimized AI pipeline ensures rapid processing.',
                color: 'from-blue-400 to-cyan-400'
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:transform hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-200 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Simple{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Choose the perfect plan for your creative needs. No hidden fees, cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Free',
                price: '₹0',
                period: 'forever',
                description: 'Perfect for trying out the magic',
                features: [
                  '5 transformations per week',
                  'Standard processing speed',
                  'All Studio Ghibli styles',
                  'Privacy protection',
                  'Mobile & desktop access'
                ],
                cta: 'Get Started Free',
                popular: false
              },
              {
                name: 'Pro',
                price: '₹300',
                period: 'per month',
                description: 'For creators and enthusiasts',
                features: [
                  '20 transformations per week',
                  'Priority processing',
                  'All Studio Ghibli styles',
                  'Privacy protection',
                  'Mobile & desktop access',
                  'High-resolution exports',
                  'Email support'
                ],
                cta: 'Upgrade to Pro',
                popular: true
              }
            ].map((plan, index) => (
              <div key={index} className={`relative group ${plan.popular ? 'md:scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`bg-white/5 backdrop-blur-sm border ${plan.popular ? 'border-purple-500/50' : 'border-white/10'} rounded-3xl p-8 h-full transition-all duration-300 hover:bg-white/10 hover:border-white/20`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-300 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-200">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a
                    href="/pricing"
                    className={`block w-full py-4 px-6 rounded-2xl font-semibold text-lg text-center transition-all duration-300 transform hover:scale-105 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-2xl hover:shadow-purple-500/25' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              See the{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Magic
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Witness the incredible transformations from ordinary photos to Studio Ghibli masterpieces.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:transform hover:scale-105">
                  <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-2 group-hover:animate-spin" />
                      <p className="text-gray-300 text-sm">Sample Transformation {item}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium mb-1">Portrait → Ghibli Art</p>
                    <p className="text-gray-300 text-sm">Magical transformation</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">ImaginAI</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Transform your photos into Studio Ghibli masterpieces with privacy-first AI technology. 
                Your creativity, our magic, your privacy protected.
              </p>
              <div className="flex gap-4">
                {[Heart, Users, Star].map((Icon, index) => (
                  <div key={index} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <Icon className="w-5 h-5 text-gray-300" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Gallery', 'API'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {[
                  { name: 'About', href: '#' },
                  { name: 'Privacy', href: '/privacy' },
                  { name: 'Terms', href: '#' },
                  { name: 'Contact', href: '#' }
                ].map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-gray-300 hover:text-white transition-colors">{item.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 ImaginAI. All rights reserved. Privacy-first AI magic.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Images deleted in 30 seconds</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Loading ImaginAI...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route 
            path="/auth" 
            element={
              <AuthGuard requireAuth={false}>
                <AuthPage />
              </AuthGuard>
            } 
          />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard requireAuth={true}>
                <Dashboard />
              </AuthGuard>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <CookieConsent />
    </>
  );
}

export default App;