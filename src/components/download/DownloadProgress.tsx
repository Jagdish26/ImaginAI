import React from 'react';
import { 
  Pause, 
  Play, 
  X, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Download,
  Clock
} from 'lucide-react';
import { DownloadItem } from './DownloadManager';

interface DownloadProgressProps {
  download: DownloadItem;
  onPauseResume: () => void;
  onCancel: () => void;
  onRetry: () => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  download,
  onPauseResume,
  onCancel,
  onRetry
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (download.status) {
      case 'preparing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case 'downloading':
        return <Download className="w-4 h-4 text-purple-400 animate-bounce" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (download.status) {
      case 'preparing':
        return 'from-blue-500 to-cyan-500';
      case 'downloading':
        return 'from-purple-500 to-pink-500';
      case 'paused':
        return 'from-yellow-500 to-orange-500';
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'error':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = () => {
    switch (download.status) {
      case 'preparing':
        return 'Preparing download...';
      case 'downloading':
        return `${download.speed} • ${download.timeRemaining} remaining`;
      case 'paused':
        return 'Download paused';
      case 'completed':
        return 'Download completed';
      case 'error':
        return download.error || 'Download failed';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm truncate">{download.filename}</h4>
          <p className="text-gray-400 text-xs">
            {download.format} • {download.quality} • {formatFileSize(download.fileSize)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {download.status === 'downloading' && (
            <button
              onClick={onPauseResume}
              className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
              title="Pause download"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          {download.status === 'paused' && (
            <button
              onClick={onPauseResume}
              className="p-1 text-gray-400 hover:text-green-400 transition-colors"
              title="Resume download"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {download.status === 'error' && (
            <button
              onClick={onRetry}
              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
              title="Retry download"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {download.status !== 'completed' && (
            <button
              onClick={onCancel}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Cancel download"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {download.status !== 'completed' && download.status !== 'error' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{Math.round(download.progress)}%</span>
            <span>{formatFileSize(download.downloadedSize)} / {formatFileSize(download.fileSize)}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 bg-gradient-to-r ${getStatusColor()} transition-all duration-300 ease-out relative overflow-hidden`}
              style={{ width: `${download.progress}%` }}
            >
              {download.status === 'downloading' && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Text */}
      <div className="text-xs text-gray-300">
        {getStatusText()}
      </div>

      {/* Success Animation */}
      {download.status === 'completed' && (
        <div className="mt-2 flex items-center gap-2 text-green-400 animate-scale-in">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs">Ready for use!</span>
        </div>
      )}

      {/* Error Details */}
      {download.status === 'error' && download.error && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-300 text-xs">{download.error}</p>
        </div>
      )}
    </div>
  );
};

export default DownloadProgress;