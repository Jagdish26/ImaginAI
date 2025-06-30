import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Shield, Zap, Sparkles, Upload, Check, Star, ArrowRight, Heart, Users, Clock } from 'lucide-react';
import AuthGuard from './components/auth/AuthGuard';
import AuthPage from './components/auth/AuthPage';
import PasswordReset from './components/auth/PasswordReset';
import Dashboard from './components/dashboard/Dashboard';
import PricingPage from './components/pricing/PricingPage';
import PrivacyPage from './components/privacy/PrivacyPage';
import CookieConsent from './components/privacy/CookieConsent';
import { useAuth } from './hooks/useAuth';

// Enhanced Navbar Component with better animations
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 py-3 shadow-2xl shadow-purple-500/10' 
        : 'py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 hover-glow">
              <Sparkles className="w-6 h-6 text-white animate-sparkle" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            </div>
            <span className="text-xl font-bold text-white gradient-text">ImaginAI</span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {['features', 'pricing', 'gallery'].map((item, index) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)}
                className="relative text-gray-200 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 hover-lift group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="capitalize">{item}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></div>
              </button>
            ))}
            
            <Link 
              to="/dashboard" 
              className="relative bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 hover-lift hover-glow overflow-hidden group"
            >
              <span className="relative z-10">Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-all duration-500 hover:scale-125 hover:rotate-12 hover-glow"
            >
              <img 
                src="/white_circle_360x360.png" 
                alt="Bolt.new" 
                className="w-8 h-8 object-contain"
              />
            </a>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-3 rounded-lg hover:bg-white/10 transition-all duration-300 hover-lift"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-500 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-500 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-500 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col gap-4 py-6 animate-slide-down">
            {['features', 'pricing', 'gallery'].map((item, index) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-gray-200 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/10 text-left hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="capitalize">{item}</span>
              </button>
            ))}
            
            <Link 
              to="/dashboard" 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 text-center hover-lift hover-glow"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <span className="text-gray-300">Made with</span>
              <a 
                href="https://bolt.new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover-lift"
              >
                <img 
                  src="/white_circle_360x360.png" 
                  alt="Bolt.new" 
                  className="w-6 h-6 object-contain"
                />
                <span className="text-white">bolt.new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Landing Page Component
const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 font-inter overflow-x-hidden">
      {/* Navbar */}
      <Navbar />
      
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-aurora"></div>
        
        {/* Floating orbs with enhanced animations */}
        <div 
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-levitate"
          style={{
            top: `${20 + mousePosition.y * 0.1}%`,
            left: `${20 + mousePosition.x * 0.05}%`
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-drift"
          style={{
            bottom: `${20 + mousePosition.y * 0.08}%`,
            right: `${20 + mousePosition.x * 0.06}%`
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-breathe"
          style={{
            top: `${60 + mousePosition.y * 0.07}%`,
            left: `${40 + mousePosition.x * 0.04}%`
          }}
        ></div>
        
        {/* Constellation effect */}
        <div className="absolute inset-0 animate-constellation opacity-30">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className={`max-w-7xl mx-auto text-center transform transition-all duration-1500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8">
            {/* Enhanced badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 hover-lift hover-glow group">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-sparkle" />
              <span className="text-gray-200 font-medium">Privacy-First AI Magic</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Enhanced main heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="inline-block animate-reveal" style={{animationDelay: '0.2s'}}>Transform Your Photos into</span>{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x animate-glow inline-block animate-reveal" style={{animationDelay: '0.5s'}}>
                Studio Ghibli Magic
              </span>
            </h1>
            
            {/* Enhanced description */}
            <p className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-4xl mx-auto leading-relaxed animate-reveal" style={{animationDelay: '0.8s'}}>
              Experience the wonder of AI-powered transformation while keeping your privacy intact. 
              Your original images are automatically deleted from our servers within 30 seconds.
            </p>
            
            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-bounce-in" style={{animationDelay: '1.1s'}}>
              <a
                href="/dashboard"
                className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-5 px-10 rounded-2xl text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3 hover-glow overflow-hidden"
              >
                <Upload className="w-6 h-6 group-hover:animate-bounce transition-transform duration-300" />
                Upload Your Photo
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </a>
              
              <a
                href="/pricing"
                className="group text-white font-medium py-5 px-10 rounded-2xl text-lg transition-all duration-500 hover:bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-3 hover-lift hover-glow"
              >
                See Pricing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </div>
          </div>
          
          {/* Enhanced feature badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-300 text-sm animate-reveal" style={{animationDelay: '1.4s'}}>
            {[
              { icon: Shield, text: 'Privacy Protected', color: 'text-green-400' },
              { icon: Zap, text: 'Lightning Fast', color: 'text-yellow-400' },
              { icon: Sparkles, text: 'Studio Quality', color: 'text-purple-400' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 hover-lift group" style={{animationDelay: `${1.6 + index * 0.1}s`}}>
                <item.icon className={`w-5 h-5 ${item.color} group-hover:animate-bounce`} />
                <span className="group-hover:text-white transition-colors duration-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 animate-reveal">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow">
                ImaginAI?
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-reveal" style={{animationDelay: '0.3s'}}>
              Experience the perfect blend of cutting-edge AI technology and uncompromising privacy protection.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Privacy First',
                description: 'Your images are automatically deleted from our servers within 30 seconds. No storage, no tracking, complete privacy.',
                color: 'from-green-400 to-emerald-400',
                delay: '0s'
              },
              {
                icon: Sparkles,
                title: 'Studio Quality',
                description: 'Advanced AI models trained specifically on Studio Ghibli artwork to create authentic, beautiful transformations.',
                color: 'from-purple-400 to-pink-400',
                delay: '0.2s'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Get your transformed images in seconds, not minutes. Our optimized AI pipeline ensures rapid processing.',
                color: 'from-blue-400 to-cyan-400',
                delay: '0.4s'
              }
            ].map((feature, index) => (
              <div key={index} className="group animate-reveal" style={{animationDelay: feature.delay}}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 hover-glow">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:animate-levitate transition-all duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">{feature.title}</h3>
                  <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors duration-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 animate-reveal">
              Simple{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-glow">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-reveal" style={{animationDelay: '0.3s'}}>
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
                popular: false,
                delay: '0s'
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
                popular: true,
                delay: '0.2s'
              }
            ].map((plan, index) => (
              <div key={index} className={`relative group animate-reveal ${plan.popular ? 'md:scale-105 md:-translate-y-4' : ''}`} style={{animationDelay: plan.delay}}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 animate-bounce-in" style={{animationDelay: '0.5s'}}>
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium animate-glow">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className={`bg-white/5 backdrop-blur-sm border ${plan.popular ? 'border-purple-500/50' : 'border-white/10'} rounded-3xl p-8 h-full transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/20 hover-lift hover-glow`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white animate-glow">{plan.price}</span>
                      <span className="text-gray-300 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-300">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 animate-reveal" style={{animationDelay: `${0.6 + featureIndex * 0.1}s`}}>
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0 animate-bounce" />
                        <span className="text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a
                    href="/pricing"
                    className={`block w-full py-4 px-6 rounded-2xl font-semibold text-lg text-center transition-all duration-500 transform hover:scale-105 hover-glow overflow-hidden group relative ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-2xl hover:shadow-purple-500/25' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    <span className="relative z-10">{plan.cta}</span>
                    {plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    )}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section id="gallery" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 animate-reveal">
              See the{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent animate-glow">
                Magic
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-reveal" style={{animationDelay: '0.3s'}}>
              Witness the incredible transformations from ordinary photos to Studio Ghibli masterpieces.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group cursor-pointer animate-reveal" style={{animationDelay: `${item * 0.1}s`}}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 hover-lift hover-glow">
                  <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:animate-liquid">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-2 group-hover:animate-constellation transition-all duration-500" />
                      <p className="text-gray-300 text-sm">Sample Transformation {item}</p>
                    </div>
                    
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium mb-1 group-hover:text-purple-300 transition-colors duration-300">Portrait → Ghibli Art</p>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Magical transformation</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 animate-reveal">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center hover-glow">
                  <Sparkles className="w-6 h-6 text-white animate-sparkle" />
                </div>
                <span className="text-2xl font-bold text-white gradient-text">ImaginAI</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Transform your photos into Studio Ghibli masterpieces with privacy-first AI technology. 
                Your creativity, our magic, your privacy protected.
              </p>
              <div className="flex gap-4">
                {[Heart, Users, Star].map((Icon, index) => (
                  <div key={index} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer hover-lift group">
                    <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-reveal" style={{animationDelay: '0.2s'}}>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Gallery', 'API'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="animate-reveal" style={{animationDelay: '0.4s'}}>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {[
                  { name: 'About', href: '#' },
                  { name: 'Privacy', href: '/privacy' },
                  { name: 'Terms', href: '#' },
                  { name: 'Contact', href: '#' }
                ].map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">{item.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 animate-reveal" style={{animationDelay: '0.6s'}}>
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 ImaginAI. All rights reserved. Privacy-first AI magic.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm hover-lift group">
              <Clock className="w-4 h-4 group-hover:animate-spin transition-all duration-300" />
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
          <div className="relative">
            <Sparkles className="w-12 h-12 text-white animate-constellation mx-auto mb-4" />
            <div className="absolute inset-0 animate-pulse-glow"></div>
          </div>
          <p className="text-white animate-glow">Loading ImaginAI...</p>
          <div className="loading-dots mt-4 text-purple-400">
            <span></span>
            <span></span>
            <span></span>
          </div>
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