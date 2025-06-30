import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  Calendar,
  Grid,
  List,
  CheckSquare,
  Square,
  MoreHorizontal,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

interface Transformation {
  id: string;
  originalName: string;
  transformedUrl: string;
  style: string;
  createdAt: string;
  fileSize: number;
  status: 'completed' | 'processing' | 'failed';
  thumbnail: string;
}

interface FilterOptions {
  style: string;
  dateRange: string;
  status: string;
}

const TransformationHistory: React.FC = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    style: 'all',
    dateRange: 'all',
    status: 'all'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 12;

  // Mock data - replace with Supabase integration
  useEffect(() => {
    const loadTransformations = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: Transformation[] = Array.from({ length: 25 }, (_, i) => ({
        id: `transform-${i}`,
        originalName: `image-${i + 1}.jpg`,
        transformedUrl: `https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400`,
        style: ['Classic Ghibli', 'Spirited Away', 'Totoro', 'Howl\'s Castle'][i % 4],
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        fileSize: Math.floor(Math.random() * 5000000) + 1000000,
        status: 'completed',
        thumbnail: `https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=200`
      }));
      
      setTransformations(mockData);
      setIsLoading(false);
    };

    loadTransformations();
  }, []);

  const filteredTransformations = transformations.filter(item => {
    const matchesSearch = item.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = filters.style === 'all' || item.style === filters.style;
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    
    let matchesDate = true;
    if (filters.dateRange !== 'all') {
      const itemDate = new Date(item.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
      }
    }
    
    return matchesSearch && matchesStyle && matchesStatus && matchesDate;
  });

  const paginatedTransformations = filteredTransformations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransformations.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedTransformations.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedTransformations.map(item => item.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = () => {
    setTransformations(prev => prev.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
    setShowDeleteConfirm(false);
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-white/10 rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded-lg w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-white/10 rounded-xl mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Transformation History</h1>
          <p className="text-gray-200">Manage and view all your Studio Ghibli transformations</p>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transformations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                  showFilters 
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">{selectedItems.size} selected</span>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
              
              <div className="flex items-center bg-white/5 border border-white/20 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/20 animate-slide-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Style</label>
                  <select
                    value={filters.style}
                    onChange={(e) => setFilters(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="all">All Styles</option>
                    <option value="Classic Ghibli">Classic Ghibli</option>
                    <option value="Spirited Away">Spirited Away</option>
                    <option value="Totoro">Totoro</option>
                    <option value="Howl's Castle">Howl's Castle</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {paginatedTransformations.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              {selectedItems.size === paginatedTransformations.length ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              {selectedItems.size === paginatedTransformations.length ? 'Deselect All' : 'Select All'}
            </button>
            
            <div className="text-gray-300 text-sm">
              Showing {paginatedTransformations.length} of {filteredTransformations.length} transformations
            </div>
          </div>
        )}

        {/* Content */}
        {filteredTransformations.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No transformations found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filters.style !== 'all' || filters.dateRange !== 'all' || filters.status !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start creating your first Studio Ghibli transformation!'
              }
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
              Create Transformation
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedTransformations.map((item) => (
              <div key={item.id} className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                {/* Selection Checkbox */}
                <button
                  onClick={() => handleSelectItem(item.id)}
                  className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  {selectedItems.has(item.id) ? (
                    <CheckSquare className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Image */}
                <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                  <img
                    src={item.thumbnail}
                    alt={item.originalName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Actions Overlay */}
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-lg flex items-center justify-center transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-lg flex items-center justify-center transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-lg flex items-center justify-center transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-white font-medium mb-1 truncate">{item.originalName}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                    <span>{item.style}</span>
                    <span>{formatFileSize(item.fileSize)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{formatDate(item.createdAt)}</span>
                    <div className={`px-2 py-1 rounded-full ${
                      item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {paginatedTransformations.map((item) => (
              <div key={item.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleSelectItem(item.id)}
                    className="flex-shrink-0"
                  >
                    {selectedItems.has(item.id) ? (
                      <CheckSquare className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <img
                    src={item.thumbnail}
                    alt={item.originalName}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{item.originalName}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span>{item.style}</span>
                      <span>{formatFileSize(item.fileSize)}</span>
                      <span>{formatDate(item.createdAt)}</span>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl transition-colors ${
                  currentPage === page
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md mx-4 animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-200 mb-6">
              Are you sure you want to delete {selectedItems.size} transformation{selectedItems.size > 1 ? 's' : ''}? 
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
                onClick={handleBulkDelete}
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

export default TransformationHistory;