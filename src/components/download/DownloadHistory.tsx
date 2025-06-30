import React, { useState } from 'react';
import { X, Search, Download, Trash2, Eye, Share2, Calendar, Filter } from 'lucide-react';
import { DownloadItem } from './DownloadManager';

interface DownloadHistoryProps {
  downloads: DownloadItem[];
  onClose: () => void;
}

const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  downloads,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDownloads = downloads
    .filter(download => {
      const matchesSearch = download.filename.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFormat = filterFormat === 'all' || download.format === filterFormat;
      return matchesSearch && matchesFormat;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (b.completedTime || b.startTime) - (a.completedTime || a.startTime);
        case 'size':
          return b.fileSize - a.fileSize;
        case 'name':
          return a.filename.localeCompare(b.filename);
        default:
          return 0;
      }
    });

  const uniqueFormats = Array.from(new Set(downloads.map(d => d.format)));

  const handleRedownload = (download: DownloadItem) => {
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = download.url;
    link.download = download.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all download history?')) {
      // This would typically call a prop function to clear history
      console.log('Clearing download history...');
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Download History</h2>
              <p className="text-gray-300">{downloads.length} completed downloads</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearHistory}
              className="text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              Clear History
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-white/20">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search downloads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>

            {/* Format Filter */}
            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-400 transition-colors"
            >
              <option value="all">All Formats</option>
              {uniqueFormats.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'size' | 'name')}
              className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-400 transition-colors"
            >
              <option value="date">Sort by Date</option>
              <option value="size">Sort by Size</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Downloads List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredDownloads.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No downloads found</h3>
              <p className="text-gray-400">
                {searchTerm || filterFormat !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Your download history will appear here'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDownloads.map((download) => (
                <div key={download.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <img
                      src={download.thumbnail}
                      alt={download.filename}
                      className="w-16 h-16 object-cover rounded-xl"
                    />

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{download.filename}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                        <span className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${
                            download.format === 'PNG' ? 'bg-blue-400' :
                            download.format === 'JPEG' ? 'bg-green-400' :
                            download.format === 'WebP' ? 'bg-purple-400' :
                            'bg-orange-400'
                          }`} />
                          {download.format}
                        </span>
                        <span>{download.quality}</span>
                        <span>{formatFileSize(download.fileSize)}</span>
                        <span>{formatDate(download.completedTime || download.startTime)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRedownload(download)}
                        className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                        title="Download again"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-6 border-t border-white/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {downloads.length}
              </div>
              <div className="text-sm text-gray-400">Total Downloads</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {formatFileSize(downloads.reduce((sum, d) => sum + d.fileSize, 0))}
              </div>
              <div className="text-sm text-gray-400">Total Size</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {uniqueFormats.length}
              </div>
              <div className="text-sm text-gray-400">Formats Used</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadHistory;