import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Trash2, 
  Download, 
  Clock, 
  Lock, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Settings,
  FileX,
  Database,
  Zap
} from 'lucide-react';

interface PrivacySettings {
  autoDeleteOriginals: boolean;
  stripMetadata: boolean;
  shareAnalytics: boolean;
  profileVisibility: 'public' | 'private';
  dataRetention: '30days' | '90days' | '1year';
  emailNotifications: boolean;
  deleteOnAccountClose: boolean;
}

interface DataSummary {
  accountCreated: string;
  totalTransformations: number;
  dataSize: number;
  lastActivity: string;
  retentionPeriod: string;
}

const PrivacyControls: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    autoDeleteOriginals: true,
    stripMetadata: true,
    shareAnalytics: false,
    profileVisibility: 'private',
    dataRetention: '30days',
    emailNotifications: true,
    deleteOnAccountClose: true
  });

  const [dataSummary, setDataSummary] = useState<DataSummary>({
    accountCreated: '2025-01-15',
    totalTransformations: 47,
    dataSize: 2.4 * 1024 * 1024, // 2.4 MB
    lastActivity: '2025-01-30',
    retentionPeriod: '30 days'
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSettingChange = (key: keyof PrivacySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    handleSave();
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create mock export file
    const exportData = {
      account: {
        email: 'user@example.com',
        created: dataSummary.accountCreated,
        lastActivity: dataSummary.lastActivity
      },
      usage: {
        totalTransformations: dataSummary.totalTransformations,
        dataSize: dataSummary.dataSize
      },
      settings: settings
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'imaginai-data-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
    setShowExportModal(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="space-y-8">
        {/* Privacy Overview */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Privacy Dashboard</h2>
              <p className="text-gray-300">Manage your privacy settings and data</p>
            </div>
          </div>

          {/* Privacy Score */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-400 font-semibold">Privacy Score</h3>
              <div className="text-3xl font-bold text-green-400">95%</div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '95%' }} />
            </div>
            <p className="text-gray-200 text-sm">
              Excellent! Your privacy settings provide strong protection for your personal data.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">30s</div>
              <div className="text-xs text-gray-400">Auto-delete time</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileX className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">0</div>
              <div className="text-xs text-gray-400">Stored images</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">{formatFileSize(dataSummary.dataSize)}</div>
              <div className="text-xs text-gray-400">Account data</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">{dataSummary.totalTransformations}</div>
              <div className="text-xs text-gray-400">Transformations</div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Privacy Settings
          </h3>

          <div className="space-y-6">
            {/* Auto-delete originals */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Auto-delete Original Images</h4>
                  <p className="text-gray-300 text-sm">Automatically delete uploaded images within 30 seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400 text-sm font-medium">Required</span>
                <label className="relative inline-flex items-center cursor-not-allowed">
                  <input 
                    type="checkbox" 
                    checked={settings.autoDeleteOriginals}
                    disabled
                    className="sr-only peer" 
                  />
                  <div className="relative w-11 h-6 bg-green-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            {/* Strip metadata */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FileX className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Strip EXIF Metadata</h4>
                  <p className="text-gray-300 text-sm">Remove location and device information from images</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400 text-sm font-medium">Required</span>
                <label className="relative inline-flex items-center cursor-not-allowed">
                  <input 
                    type="checkbox" 
                    checked={settings.stripMetadata}
                    disabled
                    className="sr-only peer" 
                  />
                  <div className="relative w-11 h-6 bg-green-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            {/* Profile visibility */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  {settings.profileVisibility === 'public' ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h4 className="text-white font-medium">Profile Visibility</h4>
                  <p className="text-gray-300 text-sm">Control who can see your profile information</p>
                </div>
              </div>
              <select
                value={settings.profileVisibility}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            {/* Share analytics */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Share Anonymous Analytics</h4>
                  <p className="text-gray-300 text-sm">Help improve our service with anonymized usage data</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.shareAnalytics}
                  onChange={(e) => handleSettingChange('shareAnalytics', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Data retention */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Data Retention Period</h4>
                  <p className="text-gray-300 text-sm">How long to keep your transformation history</p>
                </div>
              </div>
              <select
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="30days">30 Days</option>
                <option value="90days">90 Days</option>
                <option value="1year">1 Year</option>
              </select>
            </div>
          </div>

          {/* Save Status */}
          {saveStatus !== 'idle' && (
            <div className="mt-6 flex items-center justify-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                saveStatus === 'saving' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    Saving settings...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Settings saved
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Data Management */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Data Management</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Data Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4">Account Data Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Account created</span>
                  <span className="text-white">{formatDate(dataSummary.accountCreated)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total transformations</span>
                  <span className="text-white">{dataSummary.totalTransformations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Data size</span>
                  <span className="text-white">{formatFileSize(dataSummary.dataSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last activity</span>
                  <span className="text-white">{formatDate(dataSummary.lastActivity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Retention period</span>
                  <span className="text-white">{dataSummary.retentionPeriod}</span>
                </div>
              </div>
            </div>

            {/* Data Actions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4">Data Actions</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-3 px-4 rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export My Data
                </button>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 py-3 px-4 rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6">
          <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <h5 className="text-white font-medium text-sm">Use Strong Passwords</h5>
                  <p className="text-gray-300 text-xs">Enable two-factor authentication for extra security</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <h5 className="text-white font-medium text-sm">Review Permissions</h5>
                  <p className="text-gray-300 text-xs">Regularly check what data you're sharing</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <h5 className="text-white font-medium text-sm">Monitor Activity</h5>
                  <p className="text-gray-300 text-xs">Keep track of your account activity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <h5 className="text-white font-medium text-sm">Regular Cleanup</h5>
                  <p className="text-gray-300 text-xs">Periodically review and clean your data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Data Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md mx-4 animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-4">Export Your Data</h3>
            <p className="text-gray-200 mb-6">
              We'll create a downloadable file containing all your account data, including transformation history and settings.
            </p>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <h4 className="text-blue-400 font-medium mb-2">Export includes:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Account information</li>
                <li>• Transformation history</li>
                <li>• Privacy settings</li>
                <li>• Usage statistics</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                disabled={isExporting}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md mx-4 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete All Data</h3>
              <p className="text-gray-200">
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <h4 className="text-red-400 font-medium mb-2">This will delete:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Your account and profile</li>
                <li>• All transformation history</li>
                <li>• Usage statistics and preferences</li>
                <li>• Subscription information</li>
              </ul>
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
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyControls;