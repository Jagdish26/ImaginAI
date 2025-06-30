import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileImage, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Star,
  Zap,
  Crown,
  X,
  Pause,
  Play,
  RotateCcw,
  Trash2,
  Eye,
  Share2
} from 'lucide-react';
import DownloadProgress from './DownloadProgress';
import BatchDownloader from './BatchDownloader';
import DownloadHistory from './DownloadHistory';
import FormatRecommendation from './FormatRecommendation';

export interface DownloadOption {
  format: 'PNG' | 'JPEG' | 'WebP' | 'PDF';
  quality: 'Standard' | 'High' | 'Ultra';
  size: string;
  description: string;
  recommended?: boolean;
  fileSize: number;
  compressionRatio?: number;
}

export interface DownloadItem {
  id: string;
  filename: string;
  format: string;
  quality: string;
  progress: number;
  status: 'preparing' | 'downloading' | 'completed' | 'error' | 'paused';
  speed: string;
  timeRemaining: string;
  fileSize: number;
  downloadedSize: number;
  url: string;
  thumbnail: string;
  startTime: number;
  completedTime?: number;
  error?: string;
}

interface DownloadManagerProps {
  imageUrl: string;
  imageName: string;
  imageAnalysis?: {
    hasTransparency: boolean;
    colorDepth: number;
    complexity: 'low' | 'medium' | 'high';
    artworkType: 'photo' | 'illustration' | 'mixed';
  };
  onClose: () => void;
}

const DownloadManager: React.FC<DownloadManagerProps> = ({
  imageUrl,
  imageName,
  imageAnalysis,
  onClose
}) => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<DownloadOption | null>(null);
  const [showBatchDownload, setShowBatchDownload] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalDownloads: 0,
    formatBreakdown: { PNG: 0, JPEG: 0, WebP: 0, PDF: 0 },
    averageFileSize: 0,
    totalDataTransferred: 0
  });

  const downloadOptions: DownloadOption[] = [
    {
      format: 'PNG',
      quality: 'Ultra',
      size: '4K (3840×2160)',
      description: 'Lossless quality, perfect for printing and professional use',
      recommended: true,
      fileSize: 12.5 * 1024 * 1024,
      compressionRatio: 0
    },
    {
      format: 'PNG',
      quality: 'High',
      size: '2K (1920×1080)',
      description: 'High quality with smaller file size',
      fileSize: 6.2 * 1024 * 1024,
      compressionRatio: 0
    },
    {
      format: 'JPEG',
      quality: 'High',
      size: '4K (3840×2160)',
      description: 'Excellent quality with efficient compression',
      fileSize: 3.8 * 1024 * 1024,
      compressionRatio: 85
    },
    {
      format: 'JPEG',
      quality: 'Standard',
      size: '2K (1920×1080)',
      description: 'Good quality, perfect for web sharing',
      fileSize: 1.2 * 1024 * 1024,
      compressionRatio: 75
    },
    {
      format: 'WebP',
      quality: 'High',
      size: '2K (1920×1080)',
      description: 'Modern format with superior compression',
      fileSize: 0.8 * 1024 * 1024,
      compressionRatio: 80
    },
    {
      format: 'PDF',
      quality: 'High',
      size: 'Print Ready',
      description: 'Perfect for documents and presentations',
      fileSize: 2.1 * 1024 * 1024,
      compressionRatio: 0
    }
  ];

  const getRecommendedFormat = (): DownloadOption => {
    if (!imageAnalysis) return downloadOptions[0];
    
    // AI-powered recommendations based on image characteristics
    if (imageAnalysis.hasTransparency) {
      return downloadOptions.find(opt => opt.format === 'PNG' && opt.quality === 'Ultra')!;
    }
    
    if (imageAnalysis.artworkType === 'illustration') {
      return downloadOptions.find(opt => opt.format === 'PNG' && opt.quality === 'High')!;
    }
    
    if (imageAnalysis.complexity === 'high') {
      return downloadOptions.find(opt => opt.format === 'JPEG' && opt.quality === 'High')!;
    }
    
    return downloadOptions.find(opt => opt.format === 'WebP')!;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateDownloadId = (): string => {
    return `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const simulateDownload = async (downloadId: string, option: DownloadOption): Promise<void> => {
    const totalSize = option.fileSize;
    let downloadedSize = 0;
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const speed = downloadedSize / (elapsed / 1000); // bytes per second
      const remaining = (totalSize - downloadedSize) / speed;
      
      setDownloads(prev => prev.map(d => 
        d.id === downloadId ? {
          ...d,
          progress: (downloadedSize / totalSize) * 100,
          downloadedSize,
          speed: speed > 0 ? `${(speed / 1024 / 1024).toFixed(1)} MB/s` : '0 MB/s',
          timeRemaining: remaining > 0 && isFinite(remaining) ? `${Math.ceil(remaining)}s` : 'Calculating...'
        } : d
      ));
    };

    // Simulate download progress
    while (downloadedSize < totalSize) {
      const download = downloads.find(d => d.id === downloadId);
      if (!download || download.status === 'paused') {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      
      if (download.status === 'error') {
        return;
      }
      
      // Simulate variable download speed
      const chunkSize = Math.min(
        totalSize * 0.05, // 5% chunks
        Math.random() * 500000 + 100000 // 100KB - 600KB
      );
      
      downloadedSize = Math.min(downloadedSize + chunkSize, totalSize);
      updateProgress();
      
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    }
    
    // Complete download
    setDownloads(prev => prev.map(d => 
      d.id === downloadId ? {
        ...d,
        status: 'completed',
        progress: 100,
        completedTime: Date.now(),
        timeRemaining: '0s'
      } : d
    ));
    
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      totalDownloads: prev.totalDownloads + 1,
      formatBreakdown: {
        ...prev.formatBreakdown,
        [option.format]: prev.formatBreakdown[option.format] + 1
      },
      totalDataTransferred: prev.totalDataTransferred + totalSize
    }));
  };

  const handleDownload = async (option: DownloadOption) => {
    const downloadId = generateDownloadId();
    const filename = `${imageName.replace(/\.[^/.]+$/, '')}_${option.quality.toLowerCase()}.${option.format.toLowerCase()}`;
    
    const newDownload: DownloadItem = {
      id: downloadId,
      filename,
      format: option.format,
      quality: option.quality,
      progress: 0,
      status: 'preparing',
      speed: '0 MB/s',
      timeRemaining: 'Calculating...',
      fileSize: option.fileSize,
      downloadedSize: 0,
      url: imageUrl,
      thumbnail: imageUrl,
      startTime: Date.now()
    };
    
    setDownloads(prev => [newDownload, ...prev]);
    
    // Start preparation phase
    setTimeout(() => {
      setDownloads(prev => prev.map(d => 
        d.id === downloadId ? { ...d, status: 'downloading' } : d
      ));
      
      // Start actual download simulation
      simulateDownload(downloadId, option);
    }, 1000);
  };

  const handlePauseResume = (downloadId: string) => {
    setDownloads(prev => prev.map(d => 
      d.id === downloadId ? {
        ...d,
        status: d.status === 'paused' ? 'downloading' : 'paused'
      } : d
    ));
  };

  const handleCancel = (downloadId: string) => {
    setDownloads(prev => prev.filter(d => d.id !== downloadId));
  };

  const handleRetry = (downloadId: string) => {
    const download = downloads.find(d => d.id === downloadId);
    if (!download) return;
    
    const option = downloadOptions.find(opt => 
      opt.format === download.format && opt.quality === download.quality
    );
    
    if (option) {
      setDownloads(prev => prev.map(d => 
        d.id === downloadId ? {
          ...d,
          status: 'preparing',
          progress: 0,
          downloadedSize: 0,
          error: undefined,
          startTime: Date.now()
        } : d
      ));
      
      setTimeout(() => {
        setDownloads(prev => prev.map(d => 
          d.id === downloadId ? { ...d, status: 'downloading' } : d
        ));
        simulateDownload(downloadId, option);
      }, 1000);
    }
  };

  const activeDownloads = downloads.filter(d => 
    d.status === 'downloading' || d.status === 'preparing' || d.status === 'paused'
  );
  const completedDownloads = downloads.filter(d => d.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Download Options</h2>
              <p className="text-gray-300">Choose your preferred format and quality</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <div className="text-white font-medium">{analytics.totalDownloads} downloads</div>
              <div className="text-gray-400">{formatFileSize(analytics.totalDataTransferred)} total</div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Format Recommendation */}
            <FormatRecommendation
              recommendedFormat={getRecommendedFormat()}
              imageAnalysis={imageAnalysis}
              onSelect={handleDownload}
            />

            {/* Download Options Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">All Formats</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {downloadOptions.map((option, index) => (
                  <div
                    key={`${option.format}-${option.quality}`}
                    className={`group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                      option.recommended ? 'ring-2 ring-purple-400/50' : ''
                    }`}
                    onClick={() => handleDownload(option)}
                  >
                    {/* Recommended Badge */}
                    {option.recommended && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Recommended
                      </div>
                    )}

                    {/* Format Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      option.format === 'PNG' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      option.format === 'JPEG' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      option.format === 'WebP' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      'bg-gradient-to-r from-orange-500 to-red-500'
                    }`}>
                      <FileImage className="w-6 h-6 text-white" />
                    </div>

                    {/* Format Details */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-white">{option.format}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          option.quality === 'Ultra' ? 'bg-purple-500/20 text-purple-300' :
                          option.quality === 'High' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {option.quality}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{option.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-400 font-medium">{option.size}</span>
                        <span className="text-gray-400">{formatFileSize(option.fileSize)}</span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                      <Download className="w-4 h-4" />
                      Download {option.format}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Download Section */}
            <BatchDownloader
              imageUrl={imageUrl}
              imageName={imageName}
              onBatchDownload={(formats) => {
                formats.forEach(format => handleDownload(format));
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-white/20 p-6 overflow-y-auto">
            {/* Active Downloads */}
            {activeDownloads.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Active Downloads ({activeDownloads.length})
                </h3>
                <div className="space-y-3">
                  {activeDownloads.map((download) => (
                    <DownloadProgress
                      key={download.id}
                      download={download}
                      onPauseResume={() => handlePauseResume(download.id)}
                      onCancel={() => handleCancel(download.id)}
                      onRetry={() => handleRetry(download.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Downloads */}
            {completedDownloads.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Completed ({completedDownloads.length})
                </h3>
                <div className="space-y-3">
                  {completedDownloads.slice(0, 3).map((download) => (
                    <div key={download.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={download.thumbnail}
                          alt={download.filename}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{download.filename}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(download.fileSize)}</p>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {completedDownloads.length > 3 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="w-full text-purple-400 hover:text-purple-300 text-sm mt-3 transition-colors"
                  >
                    View all {completedDownloads.length} downloads
                  </button>
                )}
              </div>
            )}

            {/* Download Analytics */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Download Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Downloads</span>
                  <span className="text-white font-medium">{analytics.totalDownloads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Data Transferred</span>
                  <span className="text-white font-medium">{formatFileSize(analytics.totalDataTransferred)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Most Popular</span>
                  <span className="text-white font-medium">
                    {Object.entries(analytics.formatBreakdown)
                      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download History Modal */}
      {showHistory && (
        <DownloadHistory
          downloads={completedDownloads}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default DownloadManager;