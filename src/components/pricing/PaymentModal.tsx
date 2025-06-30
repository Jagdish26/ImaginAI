import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Shield, 
  Lock, 
  Check, 
  AlertCircle, 
  Loader2,
  Smartphone,
  Building,
  Globe
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  transformsPerWeek: number;
}

interface PaymentModalProps {
  tier: PricingTier;
  billingCycle: 'monthly' | 'yearly';
  onClose: () => void;
  onSuccess: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  popular?: boolean;
}

interface FormData {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  tier,
  billingCycle,
  onClose,
  onSuccess
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'IN'
    }
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      popular: true
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'PhonePe, GPay, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Globe,
      description: 'Paytm, Mobikwik, etc.'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      setError('Please enter a valid card number');
      return false;
    }
    
    if (formData.cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setError('');
    setStep('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate random success/failure for demo
      if (Math.random() > 0.1) { // 90% success rate
        setStep('success');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error: any) {
      setError(error.message);
      setStep('details');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    const basePrice = tier.price;
    const tax = Math.round(basePrice * 0.18); // 18% GST
    return { basePrice, tax, total: basePrice + tax };
  };

  const { basePrice, tax, total } = calculateTotal();

  const renderPaymentMethodSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                selectedPaymentMethod === method.id
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              {method.popular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <method.icon className="w-6 h-6 text-purple-400" />
                <span className="text-white font-medium">{method.name}</span>
              </div>
              <p className="text-gray-300 text-sm">{method.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setStep('details')}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
      >
        Continue with {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
      </button>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Payment Details</h3>
        
        {/* Email */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Card Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">Card Number</label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Expiry Date</label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">CVV</label>
            <input
              type="text"
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">Cardholder Name</label>
          <input
            type="text"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Billing Address</h4>
          
          <input
            type="text"
            value={formData.billingAddress.line1}
            onChange={(e) => handleInputChange('billingAddress.line1', e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Address Line 1"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.billingAddress.city}
              onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="City"
            />
            <input
              type="text"
              value={formData.billingAddress.state}
              onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="State"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.billingAddress.postalCode}
              onChange={(e) => handleInputChange('billingAddress.postalCode', e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="PIN Code"
            />
            <select
              value={formData.billingAddress.country}
              onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
            >
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm animate-slide-in">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setStep('method')}
          className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ₹{total.toLocaleString()}
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Processing Payment</h3>
      <p className="text-gray-200 mb-4">Please don't close this window...</p>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <Shield className="w-4 h-4" />
        <span>Secured by 256-bit SSL encryption</span>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
        <Check className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
      <p className="text-gray-200 mb-6">Welcome to ImaginAI {tier.name}! Your subscription is now active.</p>
      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Plan:</span>
          <span className="text-white font-medium">{tier.name}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-300">Transforms per week:</span>
          <span className="text-white font-medium">{tier.transformsPerWeek}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-300">Next billing:</span>
          <span className="text-white font-medium">
            {new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'method':
        return renderPaymentMethodSelection();
      case 'details':
        return renderPaymentDetails();
      case 'processing':
        return renderProcessing();
      case 'success':
        return renderSuccess();
      default:
        return renderPaymentMethodSelection();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Upgrade to {tier.name}</h2>
            <p className="text-gray-300">Complete your subscription</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-white/20 bg-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">ImaginAI {tier.name} ({billingCycle})</span>
              <span className="text-white">₹{basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">GST (18%)</span>
              <span className="text-white">₹{tax.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Total</span>
                <span className="text-white">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderContent()}
        </div>

        {/* Security Notice */}
        {step !== 'success' && (
          <div className="p-6 border-t border-white/20 bg-white/5">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;