import React, { useState, useEffect } from 'react';
import { 
  X, 
  Crown, 
  Calendar, 
  CreditCard, 
  Download, 
  AlertCircle, 
  Check, 
  Zap,
  Clock,
  TrendingUp,
  Settings,
  RefreshCw,
  Pause,
  Play,
  Trash2
} from 'lucide-react';

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  transformsPerWeek: number;
  price: number;
  billingCycle: 'monthly' | 'yearly';
}

interface Usage {
  currentWeek: {
    used: number;
    limit: number;
    resetDate: string;
  };
  thisMonth: {
    total: number;
    average: number;
  };
  history: Array<{
    week: string;
    used: number;
    limit: number;
  }>;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

interface SubscriptionManagerProps {
  onClose: () => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'billing' | 'settings'>('overview');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  // Mock data - replace with Supabase integration
  useEffect(() => {
    const loadSubscriptionData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock subscription data
      setSubscription({
        id: 'sub_123',
        plan: 'Pro',
        status: 'active',
        currentPeriodStart: '2025-01-01',
        currentPeriodEnd: '2025-02-01',
        cancelAtPeriodEnd: false,
        transformsPerWeek: 20,
        price: 300,
        billingCycle: 'monthly'
      });

      // Mock usage data
      setUsage({
        currentWeek: {
          used: 12,
          limit: 20,
          resetDate: '2025-02-03'
        },
        thisMonth: {
          total: 45,
          average: 11.25
        },
        history: [
          { week: 'Jan 27 - Feb 2', used: 12, limit: 20 },
          { week: 'Jan 20 - Jan 26', used: 18, limit: 20 },
          { week: 'Jan 13 - Jan 19', used: 15, limit: 20 },
          { week: 'Jan 6 - Jan 12', used: 20, limit: 20 }
        ]
      });

      // Mock invoices
      setInvoices([
        {
          id: 'inv_001',
          date: '2025-01-01',
          amount: 354, // Including tax
          status: 'paid',
          downloadUrl: '#'
        },
        {
          id: 'inv_002',
          date: '2024-12-01',
          amount: 354,
          status: 'paid',
          downloadUrl: '#'
        }
      ]);

      setIsLoading(false);
    };

    loadSubscriptionData();
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'paused':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'expired':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (subscription) {
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true
      });
    }
    
    setShowCancelConfirm(false);
    setIsLoading(false);
  };

  const handlePauseSubscription = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (subscription) {
      setSubscription({
        ...subscription,
        status: subscription.status === 'paused' ? 'active' : 'paused'
      });
    }
    
    setShowPauseConfirm(false);
    setIsLoading(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{subscription?.plan} Plan</h3>
              <p className="text-gray-300">Active subscription</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(subscription?.status || 'active')}`}>
            {subscription?.status?.charAt(0).toUpperCase() + subscription?.status?.slice(1)}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-gray-400 text-sm">Transforms per week</p>
            <p className="text-white font-semibold text-lg">{subscription?.transformsPerWeek}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Billing cycle</p>
            <p className="text-white font-semibold text-lg capitalize">{subscription?.billingCycle}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Next billing</p>
            <p className="text-white font-semibold text-lg">
              {subscription ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
            </p>
          </div>
        </div>

        {subscription?.cancelAtPeriodEnd && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <h4 className="text-yellow-400 font-medium">Subscription Cancelled</h4>
                <p className="text-gray-300 text-sm">
                  Your subscription will end on {subscription ? formatDate(subscription.currentPeriodEnd) : 'N/A'}. 
                  You'll still have access until then.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-300 text-sm mb-4">
            ₹{subscription?.price}/month • Renews {subscription ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Current Usage */}
      {usage && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            This Week's Usage
          </h3>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Transforms used</span>
              <span className="text-white font-medium">
                {usage.currentWeek.used} / {usage.currentWeek.limit}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(usage.currentWeek.used / usage.currentWeek.limit) * 100}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Resets on {formatDate(usage.currentWeek.resetDate)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{usage.currentWeek.limit - usage.currentWeek.used}</p>
              <p className="text-gray-400 text-sm">Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{usage.thisMonth.average}</p>
              <p className="text-gray-400 text-sm">Weekly Average</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Upgrade Plan
          </button>
          <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Invoices
          </button>
        </div>
      </div>
    </div>
  );

  const renderUsage = () => (
    <div className="space-y-6">
      {/* Usage Chart */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Usage History</h3>
        
        {usage?.history.map((week, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">{week.week}</span>
              <span className="text-white font-medium">{week.used} / {week.limit}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(week.used / week.limit) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Usage Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{usage?.thisMonth.total}</div>
          <div className="text-gray-400 text-sm">Total This Month</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{usage?.thisMonth.average}</div>
          <div className="text-gray-400 text-sm">Weekly Average</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {usage ? Math.round((usage.currentWeek.used / usage.currentWeek.limit) * 100) : 0}%
          </div>
          <div className="text-gray-400 text-sm">Usage Rate</div>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      {/* Payment Method */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
          <div>
            <p className="text-white font-medium">•••• •••• •••• 4242</p>
            <p className="text-gray-400 text-sm">Expires 12/26</p>
          </div>
        </div>
        <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
          Update Payment Method
        </button>
      </div>

      {/* Billing History */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Billing History</h3>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <p className="text-white font-medium">{formatDate(invoice.date)}</p>
                <p className="text-gray-400 text-sm">Invoice #{invoice.id}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">₹{invoice.amount}</p>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Subscription Controls */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Subscription Controls
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <h4 className="text-white font-medium">Pause Subscription</h4>
              <p className="text-gray-400 text-sm">Temporarily pause your subscription</p>
            </div>
            <button
              onClick={() => setShowPauseConfirm(true)}
              className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300 py-2 px-4 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              {subscription?.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {subscription?.status === 'paused' ? 'Resume' : 'Pause'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <h4 className="text-white font-medium">Cancel Subscription</h4>
              <p className="text-gray-400 text-sm">Cancel at the end of current billing period</p>
            </div>
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={subscription?.cancelAtPeriodEnd}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 py-2 px-4 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              {subscription?.cancelAtPeriodEnd ? 'Cancelled' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Billing Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Payment Reminders</h4>
              <p className="text-gray-400 text-sm">Get notified before payments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Usage Alerts</h4>
              <p className="text-gray-400 text-sm">Get notified when approaching limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
            <p className="text-white">Loading subscription data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div>
              <h2 className="text-2xl font-bold text-white">Subscription Management</h2>
              <p className="text-gray-300">Manage your ImaginAI subscription</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/20">
            {[
              { id: 'overview', name: 'Overview', icon: Crown },
              { id: 'usage', name: 'Usage', icon: Zap },
              { id: 'billing', name: 'Billing', icon: CreditCard },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-purple-400 bg-white/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'usage' && renderUsage()}
            {activeTab === 'billing' && renderBilling()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md mx-4 animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-4">Cancel Subscription</h3>
            <p className="text-gray-200 mb-6">
              Are you sure you want to cancel your subscription? You'll still have access until {subscription ? formatDate(subscription.currentPeriodEnd) : 'N/A'}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl transition-all duration-200"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Confirmation */}
      {showPauseConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md mx-4 animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-4">
              {subscription?.status === 'paused' ? 'Resume' : 'Pause'} Subscription
            </h3>
            <p className="text-gray-200 mb-6">
              {subscription?.status === 'paused' 
                ? 'Resume your subscription to continue using ImaginAI Pro features.'
                : 'Pause your subscription temporarily. You can resume anytime.'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseConfirm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePauseSubscription}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-xl transition-all duration-200"
              >
                {subscription?.status === 'paused' ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionManager;