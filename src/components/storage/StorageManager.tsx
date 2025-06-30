import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Clock, 
  Trash2, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  Zap,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Webhook,
  Database,
  Timer
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import StorageChart from './StorageChart';
import FileCountdown from './FileCountdown';
import WebhookStatus from './WebhookStatus';

interface TempFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  deletesAt: Date;
  status: 'uploading' | 'stored' | 'processing' | 'deleting' | 'deleted';
  thumbnail?: string;
  type: string;
  webhookStatus: 'pending' | 'success' | 'failed' | 'retrying';
  privacyStatus: {
    exifRemoved: boolean;
    originalDeleted: boolean;
    encryptedStorage: boolean;
  };
}

interface StorageQuota {
  used: number;
  total: number;
  tempUsed: number;
  permanentUsed: number;
  dailyUploads: number;
  dailyLimit: number;
}

interface StorageAnalytics {
  dailyUsage: Array<{ date: string; uploads: number; deletions: number; storage: number }>;
  weeklyUsage: Array<{ week: string; totalUploads: number; avgStorage: number }>;
  peakUsageTime: string;
  storageEfficiency: number;
  costBreakdown: {
    storage: number;
    bandwidth: number;
    processing: number;
  };
}

const StorageManager: React.FC = () => {
  const { user } = useAuth();
  const [tempFiles, setTempFiles] = useState<TempFile[]>([]);
  const [storageQuota, setStorageQuota] = useState<StorageQuota>({
    used: 0,
    total: 0,
    tempUsed: 0,
    permanentUsed: 0,
    dailyUploads: 0,
    dailyLimit: 0
  });
  const [analytics, setAnalytics] = useState<StorageAnalytics | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    tempFiles: true,
    analytics: false,
    webhooks: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

  // Mock data - replace with real Supabase integration
  useEffect(() => {
    const loadStorageData = async () => {
      setIsLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock temporary files
      const mockFiles: TempFile[] = [
        {
          id: '1',
          name: 'portrait.jpg',
          size: 2.4 * 1024 * 1024,
          uploadedAt: new Date(Date.now() - 15000),
          deletesAt: new Date(Date.now() + 15000),
          status: 'stored',
          thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=100',
          type: 'image/jpeg',
          webhookStatus: 'success',
          privacyStatus: {
            exifRemoved: true,
            originalDeleted: false,
            encryptedStorage: true
          }
        },
        {
          id: '2',
          name: 'landscape.png',
          size: 3.1 * 1024 * 1024,
          uploadedAt: new Date(Date.now() - 8000),
          deletesAt: new Date(Date.now() + 22000),
          status: 'processing',
          thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=100',
          type: 'image/png',
          webhookStatus: 'pending',
          privacyStatus: {
            exifRemoved: true,
            originalDeleted: false,
            encryptedStorage: true
          }
        }
      ];
      
      // Mock storage quota
      const mockQuota: StorageQuota = {
        used: 45.2 * 1024 * 1024,
        total: 100 * 1024 * 1024,
        tempUsed: 5.5 * 1024 * 1024,
        permanentUsed: 39.7 * 1024 * 1024,
        dailyUploads: 12,
        dailyLimit: 50
      };
      
      // Mock analytics
      const mockAnalytics: StorageAnalytics = {
        dailyUsage: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          uploads: Math.floor(Math.random() * 20) + 5,
          deletions: Math.floor(Math.random() * 18) + 3,
          storage: Math.floor(Math.random() * 30) + 20
        })),
        weeklyUsage: Array.from({ length: 4 }, (_, i) => ({
          week: `Week ${4 - i}`,
          totalUploads: Math.floor(Math.random() * 100) + 50,
          avgStorage: Math.floor(Math.random() * 40) + 30
        })),
        peakUsageTime: '2:00 PM - 4:00 PM',
        storageEfficiency: 87.5,
        costBreakdown: {
          storage: 2.45,
          bandwidth: 1.23,
          processing: 0.87
        }
      };
      
      setTempFiles(mockFiles);
      setStorageQuota(mockQuota);
      setAnalytics(mockAnalytics);
      setIsLoading(false);
    };

    loadStorageData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      setTempFiles(prev => prev.map(file => {
        const timeLeft = file.deletesAt.getTime() - Date.now();
        if (timeLeft <= 0 && file.status !== 'deleted') {
          return { ...file, status: 'deleted' };
        }
        return file;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageLevel = (used: number, total: number): { level: 'safe' | 'warning' | 'danger'; color: string } => {
    const percentage = (used / total) * 100;
    if (percentage < 70) return { level: 'safe', color: 'from-emerald-500 to-green-500' };
    if (percentage < 90) return { level: 'warning', color: 'from-amber-500 to-orange-500' };
    return { level: 'danger', color: 'from-red-500 to-pink-500' };
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const activeFiles = tempFiles.filter(f => f.status !== 'deleted');
    if (selectedFiles.size === activeFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(activeFiles.map(f => f.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    
    setDeletingFiles(new Set(selectedFiles));
    setShowDeleteConfirm(false);
    
    // Simulate deletion
    for (const fileId of selectedFiles) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTempFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'deleted' } : f
      ));
    }
    
    setDeletingFiles(new Set());
    setSelectedFiles(new Set());
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const storageLevel = getStorageLevel(storageQuota.used, storageQuota.total);
  const storagePercentage = (storageQuota.used / storageQuota.total) * 100;
  const activeFiles = tempFiles.filter(f => f.status !== 'deleted');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white font-inter">Loading storage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-4 sm:p-6 font-inter">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Storage Management</h1>
          <p className="text-gray-200">Monitor your temporary files and storage usage with real-time updates</p>
        </div>

        {/* Storage Overview */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Storage Meter */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/15">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 sm:w-6 sm:h-6" />
                Storage Overview
              </h2>
              <button 
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                aria-label="Refresh storage data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Circular Progress */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#storageGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(storagePercentage / 100) * 314} 314`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="storageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">{storagePercentage.toFixed(1)}%</div>
                    <div className="text-xs text-gray-300">Used</div>
                  </div>
                </div>
              </div>

              {/* Storage Details */}
              <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Storage</span>
                  <span className="text-white font-semibold">{formatFileSize(storageQuota.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Used Storage</span>
                  <span className="text-white font-semibold">{formatFileSize(storageQuota.used)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Temporary Files</span>
                  <span className="text-purple-400 font-semibold">{formatFileSize(storageQuota.tempUsed)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Permanent Files</span>
                  <span className="text-blue-400 font-semibold">{formatFileSize(storageQuota.permanentUsed)}</span>
                </div>
                
                {storageLevel.level !== 'safe' && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                    storageLevel.level === 'warning' ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${storageLevel.level === 'warning' ? 'text-amber-400' : 'text-red-400'}`} />
                    <span className={`text-sm ${storageLevel.level === 'warning' ? 'text-amber-200' : 'text-red-200'}`}>
                      {storageLevel.level === 'warning' ? 'Approaching storage limit' : 'Storage limit exceeded'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{activeFiles.length}</div>
                  <div className="text-sm text-gray-300">Active Temp Files</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{storageQuota.dailyUploads}/{storageQuota.dailyLimit}</div>
                  <div className="text-sm text-gray-300">Daily Uploads</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">100%</div>
                  <div className="text-sm text-gray-300">Privacy Protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Temporary Files Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 hover:bg-white/15">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <button
              onClick={() => toggleSection('tempFiles')}
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white hover:text-purple-300 transition-colors duration-200"
            >
              <Timer className="w-5 h-5 sm:w-6 sm:h-6" />
              Temporary Files ({activeFiles.length})
              {expandedSections.tempFiles ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {activeFiles.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  {selectedFiles.size === activeFiles.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedFiles.size > 0 && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected ({selectedFiles.size})
                  </button>
                )}
              </div>
            )}
          </div>

          {expandedSections.tempFiles && (
            <div className="space-y-4">
              {activeFiles.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Database className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No temporary files</h3>
                  <p className="text-gray-400">Upload some photos to see them here</p>
                </div>
              ) : (
                activeFiles.map((file) => (
                  <div key={file.id} className={`bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 ${
                    selectedFiles.has(file.id) ? 'border-purple-400 bg-purple-500/10' : 'hover:bg-white/10'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(file.id)}
                        onChange={() => handleFileSelect(file.id)}
                        className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                        aria-label={`Select ${file.name}`}
                      />

                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={file.thumbnail}
                          alt={file.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl"
                        />
                        {file.status === 'processing' && (
                          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                            <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">{file.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-300 mb-2">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="capitalize">{file.status}</span>
                          <WebhookStatus status={file.webhookStatus} />
                        </div>
                        
                        {/* Privacy Status */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          {file.privacyStatus.exifRemoved && (
                            <div className="flex items-center gap-1 text-emerald-400">
                              <CheckCircle className="w-3 h-3" />
                              <span className="text-xs">EXIF Removed</span>
                            </div>
                          )}
                          {file.privacyStatus.encryptedStorage && (
                            <div className="flex items-center gap-1 text-blue-400">
                              <Shield className="w-3 h-3" />
                              <span className="text-xs">Encrypted</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Countdown Timer */}
                      <div className="flex-shrink-0">
                        <FileCountdown deletesAt={file.deletesAt} />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          className="p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10"
                          aria-label={`View ${file.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200 rounded-lg hover:bg-white/10"
                          disabled={deletingFiles.has(file.id)}
                          aria-label={`Delete ${file.name}`}
                        >
                          {deletingFiles.has(file.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 hover:bg-white/15">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => toggleSection('analytics')}
                className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white hover:text-purple-300 transition-colors duration-200"
              >
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                Storage Analytics
                {expandedSections.analytics ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedSections.analytics && (
              <div className="grid lg:grid-cols-2 gap-6">
                <StorageChart data={analytics.dailyUsage} />
                
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Usage Insights</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Peak Usage Time</span>
                        <span className="text-white font-medium">{analytics.peakUsageTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Storage Efficiency</span>
                        <span className="text-emerald-400 font-medium">{analytics.storageEfficiency}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Cost Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Storage</span>
                        <span className="text-white font-medium">₹{analytics.costBreakdown.storage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Bandwidth</span>
                        <span className="text-white font-medium">₹{analytics.costBreakdown.bandwidth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Processing</span>
                        <span className="text-white font-medium">₹{analytics.costBreakdown.processing}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Webhook Management */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/15">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => toggleSection('webhooks')}
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white hover:text-purple-300 transition-colors duration-200"
            >
              <Webhook className="w-5 h-5 sm:w-6 sm:h-6" />
              Webhook Status
              {expandedSections.webhooks ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.webhooks && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Upload Complete</span>
                </div>
                <p className="text-sm text-gray-300">All upload webhooks operational</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Processing Status</span>
                </div>
                <p className="text-sm text-gray-300">Real-time processing updates</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Deletion Events</span>
                </div>
                <p className="text-sm text-gray-300">Auto-deletion confirmations</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-200 mb-6">
              Are you sure you want to delete {selectedFiles.size} selected file{selectedFiles.size > 1 ? 's' : ''}? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageManager;