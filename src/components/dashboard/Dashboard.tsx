import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  History, 
  Settings, 
  LogOut, 
  Crown, 
  Zap, 
  Shield,
  Clock,
  Image as ImageIcon,
  TrendingUp,
  Database,
  User,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import UploadPage from '../upload/UploadPage';
import StorageManager from '../storage/StorageManager';
import TransformationHistory from './TransformationHistory';
import AccountSettings from './AccountSettings';
import UsageAnalytics from './UsageAnalytics';

interface DashboardTab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DASHBOARD_TABS: DashboardTab[] = [
  { id: 'overview', name: 'Overview', icon: BarChart3 },
  { id: 'upload', name: 'Transform', icon: Upload },
  { id: 'history', name: 'History', icon: History },
  { id: 'storage', name: 'Storage', icon: Database },
  { id: 'settings', name: 'Settings', icon: Settings }
];

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'upload':
        return <UploadPage />;
      case 'history':
        return <TransformationHistory />;
      case 'storage':
        return <StorageManager />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  if (activeTab === 'upload') {
    return <UploadPage />;
  }

  if (activeTab === 'storage') {
    return <StorageManager />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 font-inter">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className={`w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 flex flex-col transform transition-all duration-700 ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Logo */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ImaginAI</h1>
                <p className="text-xs text-gray-300">Studio Ghibli Magic</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-white font-medium">
                  {user?.user_metadata?.full_name || 'User'}
                </h3>
                <p className="text-gray-300 text-sm">{user?.email}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">Free Plan</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="flex justify-between mb-1">
                  <span>This week:</span>
                  <span>3/5 transforms</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {DASHBOARD_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Sign Out */}
          <div className="p-6 border-t border-white/20">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-200">Welcome back! Here's your transformation activity</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            <UsageAnalytics />
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <QuickStats />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Stats Component
const QuickStats: React.FC = () => {
  const stats = [
    { label: 'Total Transforms', value: '47', icon: Zap, color: 'from-blue-500 to-cyan-500' },
    { label: 'This Week', value: '3', icon: Clock, color: 'from-purple-500 to-pink-500' },
    { label: 'Storage Used', value: '2.4GB', icon: Database, color: 'from-green-500 to-emerald-500' },
    { label: 'Privacy Score', value: '100%', icon: Shield, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity: React.FC = () => {
  const activities = [
    { action: 'Transformed portrait.jpg', time: '2 minutes ago', style: 'Classic Ghibli' },
    { action: 'Downloaded landscape.png', time: '1 hour ago', style: 'Spirited Away' },
    { action: 'Shared family_photo.jpg', time: '3 hours ago', style: 'Totoro' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <div>
              <p className="text-white text-sm">{activity.action}</p>
              <p className="text-gray-400 text-xs">{activity.time}</p>
              <p className="text-purple-400 text-xs">{activity.style}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;