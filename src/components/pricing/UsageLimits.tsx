import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  AlertTriangle, 
  Crown, 
  TrendingUp, 
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface UsageLimit {
  transformsPerWeek: number;
  used: number;
  resetDate: Date;
  plan: 'free' | 'pro';
  overage: number;
  canUpgrade: boolean;
}

interface UsageLimitsProps {
  onUpgrade?: () => void;
  onOveragePayment?: (amount: number) => void;
}

const UsageLimits: React.FC<UsageLimitsProps> = ({ onUpgrade, onOveragePayment }) => {
  const [usage, setUsage] = useState<UsageLimit>({
    transformsPerWeek: 5,
    used: 4,
    resetDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    plan: 'free',
    overage: 0,
    canUpgrade: true
  });
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = usage.resetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeUntilReset('Resetting...');
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeUntilReset(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeUntilReset(`${hours}h ${minutes}m`);
      } else {
        setTimeUntilReset(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [usage.resetDate]);

  // Check if user should see upgrade prompt
  useEffect(() => {
    const usagePercentage = (usage.used / usage.transformsPerWeek) * 100;
    if (usage.plan === 'free' && usagePercentage >= 80) {
      setShowUpgradePrompt(true);
    }
  }, [usage]);

  const getUsageLevel = (): { level: 'safe' | 'warning' | 'danger' | 'exceeded'; color: string; message: string } => {
    const percentage = (usage.used / usage.transformsPerWeek) * 100;
    
    if (usage.used > usage.transformsPerWeek) {
      return {
        level: 'exceeded',
        color: 'from-red-500 to-pink-500',
        message: 'Limit exceeded'
      };
    } else if (percentage >= 90) {
      return {
        level: 'danger',
        color: 'from-amber-500 to-red-500',
        message: 'Almost at limit'
      };
    } else if (percentage >= 70) {
      return {
        level: 'warning',
        color: 'from-amber-500 to-orange-500',
        message: 'Approaching limit'
      };
    } else {
      return {
        level: 'safe',
        color: 'from-emerald-500 to-green-500',
        message: 'Good usage'
      };
    }
  };

  const usageLevel = getUsageLevel();
  const usagePercentage = Math.min((usage.used / usage.transformsPerWeek) * 100, 100);
  const remaining = Math.max(usage.transformsPerWeek - usage.used, 0);

  const handleTransformAttempt = (): boolean => {
    if (usage.used >= usage.transformsPerWeek) {
      if (usage.plan === 'free') {
        setShowUpgradePrompt(true);
        return false;
      } else {
        // Handle overage for pro users
        setUsage(prev => ({ ...prev, overage: prev.overage + 1 }));
        return true;
      }
    }
    
    // Allow transformation
    setUsage(prev => ({ ...prev, used: prev.used + 1 }));
    return true;
  };

  const resetUsage = () => {
    setUsage(prev => ({
      ...prev,
      used: 0,
      overage: 0,
      resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next week
    }));
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Main Usage Display */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/15">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${usageLevel.color} rounded-xl flex items-center justify-center`}>
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Weekly Usage</h3>
              <p className="text-gray-300">{usageLevel.message}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-white">
              {usage.used} / {usage.transformsPerWeek}
            </div>
            <div className="text-sm text-gray-400">transforms</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Usage Progress</span>
            <span className="text-white font-medium">{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 bg-gradient-to-r ${usageLevel.color} transition-all duration-1000 ease-out relative`}
              style={{ width: `${usagePercentage}%` }}
            >
              {usageLevel.level === 'danger' && (
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-white">{remaining}</div>
            <div className="text-xs sm:text-sm text-gray-400">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-white">{timeUntilReset}</div>
            <div className="text-xs sm:text-sm text-gray-400">Until Reset</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-white capitalize">{usage.plan}</div>
            <div className="text-xs sm:text-sm text-gray-400">Plan</div>
          </div>
        </div>

        {/* Reset Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 border-t border-white/10 pt-4">
          <RefreshCw className="w-4 h-4" />
          <span>Resets every Monday at 12:00 AM IST</span>
        </div>
      </div>

      {/* Overage Warning (Pro users) */}
      {usage.overage > 0 && usage.plan === 'pro' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-amber-500/15">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            <div>
              <h4 className="text-amber-400 font-semibold">Overage Usage</h4>
              <p className="text-gray-300 text-sm">You've used {usage.overage} extra transforms this week</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white font-medium">Additional charges: ₹{usage.overage * 10}</p>
              <p className="text-gray-400 text-sm">₹10 per extra transform</p>
            </div>
            <button
              onClick={() => onOveragePayment?.(usage.overage * 10)}
              className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-xl transition-all duration-200 w-full sm:w-auto"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Prompt */}
      {showUpgradePrompt && usage.plan === 'free' && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4 sm:p-6 animate-scale-in transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500/25 hover:to-pink-500/25">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            <div>
              <h4 className="text-white font-semibold">Upgrade to Pro</h4>
              <p className="text-gray-300 text-sm">Get 4x more transforms and priority processing</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h5 className="text-white font-medium mb-2">Current: Free</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 5 transforms/week</li>
                <li>• Standard processing</li>
                <li>• Community support</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4">
              <h5 className="text-white font-medium mb-2">Upgrade: Pro</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 20 transforms/week</li>
                <li>• Priority processing</li>
                <li>• Email support</li>
                <li>• High-res exports</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowUpgradePrompt(false)}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200"
            >
              Maybe Later
            </button>
            <button
              onClick={() => {
                onUpgrade?.();
                setShowUpgradePrompt(false);
              }}
              className="flex-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgrade Now - ₹300/month
            </button>
          </div>
        </div>
      )}

      {/* Usage History */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/15">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Usage History
        </h3>
        
        <div className="space-y-3">
          {[
            { week: 'This week', used: usage.used, limit: usage.transformsPerWeek, current: true },
            { week: 'Last week', used: usage.transformsPerWeek, limit: usage.transformsPerWeek, current: false },
            { week: '2 weeks ago', used: 3, limit: usage.transformsPerWeek, current: false },
            { week: '3 weeks ago', used: 2, limit: usage.transformsPerWeek, current: false }
          ].map((week, index) => (
            <div key={index} className={`p-4 rounded-xl transition-all duration-300 ${week.current ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${week.current ? 'text-purple-300' : 'text-gray-300'}`}>
                  {week.week}
                </span>
                <span className="text-white font-medium">{week.used} / {week.limit}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    week.current 
                      ? `bg-gradient-to-r ${usageLevel.color}` 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}
                  style={{ width: `${(week.used / week.limit) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Limiting Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-blue-500/15">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          <div>
            <h4 className="text-blue-400 font-semibold">Rate Limiting</h4>
            <p className="text-gray-300 text-sm">Fair usage policy to ensure quality for everyone</p>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-300 text-sm">No daily limits</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-300 text-sm">Weekly reset schedule</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-300 text-sm">Instant processing</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-300 text-sm">No queue waiting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageLimits;