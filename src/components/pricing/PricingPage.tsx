import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Shield, 
  Clock, 
  Users, 
  Mail, 
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Gift,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import PaymentModal from './PaymentModal';
import SubscriptionManager from './SubscriptionManager';
import { Link } from 'react-router-dom';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  popular: boolean;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  transformsPerWeek: number;
  priority: boolean;
  support: string;
  resolution: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [currentUsage, setCurrentUsage] = useState({ used: 3, limit: 5 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for trying out the magic',
      features: [
        '5 transformations per week',
        'All Studio Ghibli styles',
        'Standard processing speed',
        'Privacy protection',
        'Mobile & desktop access',
        'Community support'
      ],
      limitations: [
        'Standard resolution exports',
        'No priority processing',
        'Limited to 5 transforms/week'
      ],
      popular: false,
      color: 'from-gray-600 to-gray-700',
      icon: Gift,
      transformsPerWeek: 5,
      priority: false,
      support: 'Community',
      resolution: 'Standard'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 300 : 3000,
      originalPrice: billingCycle === 'yearly' ? 3600 : undefined,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For creators and enthusiasts',
      features: [
        '20 transformations per week',
        'All Studio Ghibli styles',
        'Priority processing (2x faster)',
        'Privacy protection',
        'Mobile & desktop access',
        'High-resolution exports (4K)',
        'Email support',
        'Batch processing',
        'Advanced download options',
        'No watermarks'
      ],
      popular: true,
      color: 'from-purple-600 to-pink-600',
      icon: Crown,
      transformsPerWeek: 20,
      priority: true,
      support: 'Email',
      resolution: 'High (4K)'
    }
  ];

  const faqs: FAQ[] = [
    {
      question: 'How does the free plan work?',
      answer: 'The free plan gives you 5 transformations per week, which resets every Monday. You get access to all Studio Ghibli styles with standard processing speed and resolution.'
    },
    {
      question: 'What happens to my original images?',
      answer: 'Your original images are automatically deleted from our servers within 30 seconds for privacy protection. We never store your personal photos permanently.'
    },
    {
      question: 'Can I upgrade or downgrade anytime?',
      answer: 'Yes! You can upgrade to Pro anytime and your billing will be prorated. You can also downgrade at the end of your current billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets through our secure payment partners Stripe and Razorpay.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 7-day money-back guarantee for Pro subscriptions. If you\'re not satisfied, contact us for a full refund.'
    },
    {
      question: 'How fast is priority processing?',
      answer: 'Pro users get priority processing which is typically 2x faster than standard processing. Most transformations complete in under 3 seconds.'
    }
  ];

  const handleSelectTier = (tier: PricingTier) => {
    if (tier.id === 'free') {
      // Handle free tier selection (maybe show signup if not logged in)
      return;
    }
    
    setSelectedTier(tier);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowSubscriptionManager(true);
  };

  const calculateSavings = () => {
    const monthlyTotal = 300 * 12; // ₹3600 per year
    const yearlyPrice = 3000;
    return monthlyTotal - yearlyPrice;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 font-inter">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ImaginAI</span>
            </div>
            {user && (
              <button
                onClick={() => setShowSubscriptionManager(true)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Manage Subscription
              </button>
            )}
          </div>

          {/* Back Button */}
          <div className="px-6 mb-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-[-4px] group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Hero Section */}
          <section className="text-center py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                Choose Your{' '}
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Creative Plan
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                Transform your photos into Studio Ghibli masterpieces with our AI-powered magic. 
                Start free, upgrade when you need more power.
              </p>

              {/* Current Usage (if logged in) */}
              {user && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                  <h3 className="text-white font-semibold mb-3">Your Current Usage</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">This week</span>
                    <span className="text-white font-medium">{currentUsage.used}/{currentUsage.limit} transforms</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(currentUsage.used / currentUsage.limit) * 100}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    {currentUsage.limit - currentUsage.used} transforms remaining
                  </p>
                </div>
              )}

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`text-lg ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative w-16 h-8 bg-white/20 rounded-full transition-all duration-300 hover:bg-white/30"
                >
                  <div className={`absolute top-1 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300 ${
                    billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                    Yearly
                  </span>
                  {billingCycle === 'yearly' && (
                    <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      Save ₹{calculateSavings()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="px-4 pb-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {pricingTiers.map((tier, index) => (
                  <div
                    key={tier.id}
                    className={`relative group transition-all duration-500 ${
                      tier.popular ? 'md:scale-105 md:-translate-y-4' : ''
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className={`relative bg-white/10 backdrop-blur-xl border-2 rounded-3xl p-8 h-full transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-2xl ${
                      tier.popular 
                        ? 'border-purple-500/50 hover:border-purple-400/70' 
                        : 'border-white/20 hover:border-white/30'
                    }`}>
                      {/* Tier Header */}
                      <div className="text-center mb-8">
                        <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <tier.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                        <p className="text-gray-300">{tier.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-8">
                        <div className="flex items-baseline justify-center gap-2 mb-2">
                          <span className="text-4xl font-bold text-white">₹{tier.price.toLocaleString()}</span>
                          <span className="text-gray-300">/{tier.period}</span>
                        </div>
                        {tier.originalPrice && (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-gray-400 line-through">₹{tier.originalPrice.toLocaleString()}</span>
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                              {Math.round(((tier.originalPrice - tier.price) / tier.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="mb-8">
                        <h4 className="text-white font-semibold mb-4">What's included:</h4>
                        <ul className="space-y-3">
                          {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Limitations (for free tier) */}
                      {tier.limitations && (
                        <div className="mb-8">
                          <h4 className="text-gray-400 font-semibold mb-3 text-sm">Limitations:</h4>
                          <ul className="space-y-2">
                            {tier.limitations.map((limitation, limitIndex) => (
                              <li key={limitIndex} className="flex items-start gap-3">
                                <div className="w-5 h-5 border border-gray-500 rounded mt-0.5 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA Button */}
                      <button
                        onClick={() => handleSelectTier(tier)}
                        className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                          tier.popular
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-2xl hover:shadow-purple-500/25'
                            : tier.id === 'free'
                            ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        }`}
                      >
                        {tier.id === 'free' ? (
                          <>
                            <Gift className="w-5 h-5" />
                            Get Started Free
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Upgrade to {tier.name}
                          </>
                        )}
                      </button>

                      {/* Additional Info */}
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Processing:</span>
                            <div className="text-white font-medium">
                              {tier.priority ? 'Priority' : 'Standard'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Support:</span>
                            <div className="text-white font-medium">{tier.support}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Feature Comparison */}
          <section className="px-4 py-16 bg-black/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Compare Plans</h2>
                <p className="text-gray-200">See what's included in each plan</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-6 text-white font-semibold">Features</th>
                        <th className="text-center p-6 text-white font-semibold">Free</th>
                        <th className="text-center p-6 text-white font-semibold">Pro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { feature: 'Transformations per week', free: '5', pro: '20' },
                        { feature: 'Processing speed', free: 'Standard', pro: 'Priority (2x faster)' },
                        { feature: 'Export resolution', free: 'Standard', pro: 'High (4K)' },
                        { feature: 'Batch processing', free: '✗', pro: '✓' },
                        { feature: 'Email support', free: '✗', pro: '✓' },
                        { feature: 'No watermarks', free: '✗', pro: '✓' },
                        { feature: 'Advanced downloads', free: '✗', pro: '✓' },
                        { feature: 'Privacy protection', free: '✓', pro: '✓' }
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="p-6 text-gray-200">{row.feature}</td>
                          <td className="p-6 text-center text-gray-300">{row.free}</td>
                          <td className="p-6 text-center text-white font-medium">{row.pro}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-200">Everything you need to know about our pricing</p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-white font-semibold">{faq.question}</h3>
                      {expandedFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-6 pb-6 animate-slide-in">
                        <p className="text-gray-200 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="px-4 py-16 bg-black/20">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
                  <p className="text-gray-200">Your images are deleted within 30 seconds. Complete privacy guaranteed.</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Trusted by Thousands</h3>
                  <p className="text-gray-200">Join over 10,000 creators who trust ImaginAI for their transformations.</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Always Improving</h3>
                  <p className="text-gray-200">Regular updates and new features based on user feedback.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Photos?
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Start with our free plan and upgrade when you need more power.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleSelectTier(pricingTiers[0])}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Gift className="w-5 h-5" />
                  Start Free
                </button>
                <button
                  onClick={() => handleSelectTier(pricingTiers[1])}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Go Pro
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedTier && (
        <PaymentModal
          tier={selectedTier}
          billingCycle={billingCycle}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Subscription Manager */}
      {showSubscriptionManager && (
        <SubscriptionManager
          onClose={() => setShowSubscriptionManager(false)}
        />
      )}
    </>
  );
};

export default PricingPage;