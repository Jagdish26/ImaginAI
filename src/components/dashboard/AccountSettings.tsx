import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Trash2, 
  Camera, 
  Save, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle,
  Crown,
  CreditCard,
  Download,
  Globe,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ProfileData {
  fullName: string;
  email: string;
  avatar: string;
  bio: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  transformationComplete: boolean;
  weeklyDigest: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  shareAnalytics: boolean;
  dataRetention: '30days' | '90days' | '1year';
  autoDeleteOriginals: boolean;
}

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Form states
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    avatar: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    transformationComplete: true,
    weeklyDigest: true
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'private',
    shareAnalytics: false,
    dataRetention: '30days',
    autoDeleteOriginals: true
  });

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'subscription', name: 'Subscription', icon: Crown },
    { id: 'danger', name: 'Danger Zone', icon: Trash2 }
  ];

  const handleSave = async (section: string) => {
    setSaveStatus('saving');
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveStatus('error');
      return;
    }
    
    await handleSave('security');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordFields(false);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Redirect to landing page
    window.location.href = '/';
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileData.fullName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Profile Picture</h3>
          <p className="text-gray-300 text-sm">Upload a new avatar for your account</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Bio</label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>

      <button
        onClick={() => handleSave('profile')}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {saveStatus === 'saving' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : saveStatus === 'saved' ? (
          <>
            <Check className="w-4 h-4" />
            Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </button>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-400" />
          <div>
            <h4 className="text-blue-400 font-medium">Account Security</h4>
            <p className="text-gray-300 text-sm">Your account is secured with email authentication</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-medium">Password</h3>
            <p className="text-gray-300 text-sm">Change your account password</p>
          </div>
          <button
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            {showPasswordFields ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordFields && (
          <div className="space-y-4 animate-slide-in">
            <div>
              <label className="block text-white font-medium mb-2">Current Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Update Password
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h4 className="text-white font-medium mb-3">Two-Factor Authentication</h4>
        <p className="text-gray-300 text-sm mb-4">Add an extra layer of security to your account</p>
        <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 px-4 rounded-xl transition-all duration-200">
          Enable 2FA
        </button>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-medium mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'transformationComplete', label: 'Transformation Complete', description: 'Get notified when your transformations are ready' },
            { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of your activity' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive updates about new features and promotions' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <h4 className="text-white font-medium">{item.label}</h4>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof NotificationSettings] as boolean}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium mb-4">Push Notifications</h3>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Browser Notifications</h4>
              <p className="text-gray-300 text-sm">Receive push notifications in your browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.pushNotifications}
                onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleSave('notifications')}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save Preferences
      </button>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-400" />
          <div>
            <h4 className="text-green-400 font-medium">Privacy Protected</h4>
            <p className="text-gray-300 text-sm">Your data is automatically protected with our privacy-first approach</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-white font-medium">Profile Visibility</h4>
              <p className="text-gray-300 text-sm">Control who can see your profile</p>
            </div>
          </div>
          <select
            value={privacy.profileVisibility}
            onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value as 'public' | 'private' }))}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-white font-medium">Data Retention</h4>
              <p className="text-gray-300 text-sm">How long to keep your transformation history</p>
            </div>
          </div>
          <select
            value={privacy.dataRetention}
            onChange={(e) => setPrivacy(prev => ({ ...prev, dataRetention: e.target.value as '30days' | '90days' | '1year' }))}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
          >
            <option value="30days">30 Days</option>
            <option value="90days">90 Days</option>
            <option value="1year">1 Year</option>
          </select>
        </div>

        {[
          { key: 'shareAnalytics', label: 'Share Analytics', description: 'Help improve our service by sharing anonymous usage data' },
          { key: 'autoDeleteOriginals', label: 'Auto-Delete Originals', description: 'Automatically delete original images after 30 seconds' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <h4 className="text-white font-medium">{item.label}</h4>
              <p className="text-gray-300 text-sm">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy[item.key as keyof PrivacySettings] as boolean}
                onChange={(e) => setPrivacy(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={() => handleSave('privacy')}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save Privacy Settings
      </button>
    </div>
  );

  const renderSubscriptionSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Current Plan: Free</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-300 text-sm">Transforms per week</p>
            <p className="text-white font-semibold">5</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Used this week</p>
            <p className="text-white font-semibold">3 / 5</p>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '60%' }}></div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Upgrade to Pro</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-white font-medium mb-2">Pro Benefits</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                20 transformations per week
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Priority processing
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                High-resolution exports
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Email support
              </li>
            </ul>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">₹300</div>
            <div className="text-gray-300 text-sm mb-4">per month</div>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto">
              <CreditCard className="w-4 h-4" />
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h4 className="text-white font-medium mb-3">Billing History</h4>
        <p className="text-gray-300 text-sm mb-4">No billing history available</p>
        <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Invoices
        </button>
      </div>
    </div>
  );

  const renderDangerSection = () => (
    <div className="space-y-6">
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <h4 className="text-red-400 font-medium">Danger Zone</h4>
            <p className="text-gray-300 text-sm">These actions cannot be undone</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-medium mb-2">Export Your Data</h3>
        <p className="text-gray-300 text-sm mb-4">Download all your transformation history and account data</p>
        <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 px-4 rounded-xl transition-all duration-200 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      <div className="bg-white/5 border border-red-500/20 rounded-2xl p-6">
        <h3 className="text-red-400 font-medium mb-2">Delete Account</h3>
        <p className="text-gray-300 text-sm mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition-all duration-200 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'security':
        return renderSecuritySection();
      case 'notifications':
        return renderNotificationsSection();
      case 'privacy':
        return renderPrivacySection();
      case 'subscription':
        return renderSubscriptionSection();
      case 'danger':
        return renderDangerSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-200">Manage your account preferences and settings</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sticky top-8">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                      activeSection === section.id
                        ? 'bg-white/20 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md mx-4 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Account</h3>
              <p className="text-gray-200">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Type 'DELETE' to confirm"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;