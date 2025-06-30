import React, { useState } from 'react';
import { Package, CheckSquare, Square, Download, Zap } from 'lucide-react';
import { DownloadOption } from './DownloadManager';

interface BatchDownloaderProps {
  imageUrl: string;
  imageName: string;
  onBatchDownload: (formats: DownloadOption[]) => void;
}

const BatchDownloader: React.FC<BatchDownloaderProps> = ({
  imageUrl,
  imageName,
  onBatchDownload
}) => {
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  const batchOptions: DownloadOption[] = [
    {
      format: 'PNG',
      quality: 'Ultra',
      size: '4K',
      description: 'Highest quality PNG',
      fileSize: 12.5 * 1024 * 1024
    },
    {
      format: 'JPEG',
      quality: 'High',
      size: '4K',
      description: 'High quality JPEG',
      fileSize: 3.8 * 1024 * 1024
    },
    {
      format: 'WebP',
      quality: 'High',
      size: '2K',
      description: 'Modern WebP format',
      fileSize: 0.8 * 1024 * 1024
    },
    {
      format: 'PDF',
      quality: 'High',
      size: 'Print',
      description: 'Print-ready PDF',
      fileSize: 2.1 * 1024 * 1024
    }
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFormatToggle = (formatKey: string) => {
    setSelectedFormats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(formatKey)) {
        newSet.delete(formatKey);
      } else {
        newSet.add(formatKey);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedFormats.size === batchOptions.length) {
      setSelectedFormats(new Set());
    } else {
      setSelectedFormats(new Set(batchOptions.map((_, i) => i.toString())));
    }
  };

  const handleBatchDownload = () => {
    const selectedOptions = batchOptions.filter((_, index) => 
      selectedFormats.has(index.toString())
    );
    onBatchDownload(selectedOptions);
    setSelectedFormats(new Set());
  };

  const totalSize = batchOptions
    .filter((_, index) => selectedFormats.has(index.toString()))
    .reduce((sum, option) => sum + option.fileSize, 0);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Batch Download</h3>
            <p className="text-gray-300 text-sm">Download multiple formats at once</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-slide-in">
          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {batchOptions.map((option, index) => {
              const formatKey = index.toString();
              const isSelected = selectedFormats.has(formatKey);
              
              return (
                <button
                  key={formatKey}
                  onClick={() => handleFormatToggle(formatKey)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                    isSelected 
                      ? 'bg-purple-500/20 border-purple-400/50' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{option.format}</span>
                      <span className="text-xs text-gray-400">({option.quality})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{option.description}</span>
                      <span className="text-gray-400 text-xs">{formatFileSize(option.fileSize)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Batch Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                {selectedFormats.size === batchOptions.length ? 'Deselect All' : 'Select All'}
              </button>
              
              {selectedFormats.size > 0 && (
                <div className="text-gray-300 text-sm">
                  {selectedFormats.size} format{selectedFormats.size > 1 ? 's' : ''} selected • {formatFileSize(totalSize)} total
                </div>
              )}
            </div>

            <button
              onClick={handleBatchDownload}
              disabled={selectedFormats.size === 0}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Download ZIP ({selectedFormats.size})
            </button>
          </div>

          {/* Quick Presets */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-gray-300 text-sm mb-3">Quick Presets:</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedFormats(new Set(['0', '1']))}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
              >
                <Zap className="w-3 h-3" />
                Essential (PNG + JPEG)
              </button>
              <button
                onClick={() => setSelectedFormats(new Set(['0', '1', '2']))}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-3 h-3" />
                Web Ready (PNG + JPEG + WebP)
              </button>
              <button
                onClick={() => setSelectedFormats(new Set(['0', '3']))}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
              >
                <Package className="w-3 h-3" />
                Print Ready (PNG + PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDownloader;