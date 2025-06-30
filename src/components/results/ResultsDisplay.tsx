import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Share2, 
  Heart, 
  Star, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  X, 
  Copy, 
  Facebook, 
  Twitter, 
  Instagram,
  ArrowLeft,
  Info,
  Sparkles,
  Clock,
  Palette,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import ImageComparison from './ImageComparison';
import FullscreenLightbox from './FullscreenLightbox';
import ShareModal from './ShareModal';
import RatingSystem from './RatingSystem';
import DownloadManager from '../download/DownloadManager';

interface TransformationResult {
  id: string;
  originalUrl: string;
  transformedUrl: string;
  style: string;
  processingTime: number;
  metadata: {
    originalDimensions: { width: number; height: number };
    transformedDimensions: { width: number; height: number };
    originalSize: number;
    transformedSize: number;
    format: string;
    quality: number;
  };
  createdAt: string;
}

interface ResultsDisplayProps {
  result: TransformationResult;
  onNewTransformation: () => void;
  onBack: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  result, 
  onNewTransformation, 
  onBack 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadManager, setShowDownloadManager] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [showComparison, setShowComparison] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Preload the transformed image
    const img = new Image();
    img.onload = () => setIsImageLoaded(true);
    img.src = result.transformedUrl;
  }, [result.transformedUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatProcessingTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStyleDisplayName = (style: string): string => {
    const styleMap: Record<string, string> = {
      'ghibli': 'Classic Ghibli',
      'spirited_away': 'Spirited Away',
      'totoro': 'My Neighbor Totoro',
      'howls_castle': "Howl's Moving Castle"
    };
    return styleMap[style] || style;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setImageZoom(1);
  };

  // Mock image analysis for download recommendations
  const imageAnalysis = {
    hasTransparency: false,
    colorDepth: 24,
    complexity: 'high' as const,
    artworkType: 'illustration' as const
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 font-inter">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className={`relative z-10 min-h-screen transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Upload
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ImaginAI</span>
            </div>

            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Info className="w-5 h-5" />
              Details
            </button>
          </div>

          {/* Success Banner */}
          <div className="px-6 mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 animate-scale-in">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-celebrate">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">✨ Transformation Complete!</h2>
                    <p className="text-green-200">Your photo has been magically transformed into Studio Ghibli style</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-sm text-green-300">Processing Time</div>
                    <div className="text-xl font-bold text-white">{formatProcessingTime(result.processingTime)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Image Display */}
                <div className="lg:col-span-2">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">Your Ghibli Masterpiece</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowComparison(!showComparison)}
                          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
                        >
                          <ImageIcon className="w-4 h-4" />
                          {showComparison ? 'Hide' : 'Show'} Comparison
                        </button>
                      </div>
                    </div>

                    {showComparison ? (
                      <ImageComparison
                        originalUrl={result.originalUrl}
                        transformedUrl={result.transformedUrl}
                        onFullscreen={() => setShowLightbox(true)}
                      />
                    ) : (
                      <div className="relative group">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-black/20 relative">
                          {!isImageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                  <Sparkles className="w-8 h-8 text-white animate-spin" />
                                </div>
                                <p className="text-white">Loading your masterpiece...</p>
                              </div>
                            </div>
                          )}
                          
                          <img
                            src={result.transformedUrl}
                            alt="Transformed Ghibli Style"
                            className={`w-full h-full object-cover transition-all duration-700 cursor-zoom-in ${
                              isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                            style={{ transform: `scale(${imageZoom})` }}
                            onClick={() => setShowLightbox(true)}
                            onLoad={() => setIsImageLoaded(true)}
                          />
                          
                          {/* Zoom Controls */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                              className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-xl flex items-center justify-center transition-all duration-200"
                            >
                              <ZoomIn className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                              className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-xl flex items-center justify-center transition-all duration-200"
                            >
                              <ZoomOut className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
                              className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-xl flex items-center justify-center transition-all duration-200"
                            >
                              <RotateCcw className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowLightbox(true); }}
                              className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-xl flex items-center justify-center transition-all duration-200"
                            >
                              <Maximize2 className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setShowDownloadManager(true)}
                      className="relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 overflow-hidden"
                    >
                      <Download className="w-5 h-5" />
                      Download Options
                    </button>
                    
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                    
                    <button
                      onClick={onNewTransformation}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <Heart className="w-5 h-5" />
                      Create Another
                    </button>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Style Info */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Style Applied
                    </h3>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-2">
                        {getStyleDisplayName(result.style)}
                      </div>
                      <p className="text-gray-300 text-sm">
                        Your photo has been transformed using our advanced AI model trained specifically on Studio Ghibli artwork.
                      </p>
                    </div>
                  </div>

                  {/* Rating System */}
                  <RatingSystem
                    rating={userRating}
                    onRatingChange={setUserRating}
                    transformationId={result.id}
                  />

                  {/* Quick Stats */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Processing Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Processing Time</span>
                        <span className="text-white font-semibold">{formatProcessingTime(result.processingTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Style Quality</span>
                        <span className="text-green-400 font-semibold">Excellent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Privacy Status</span>
                        <span className="text-purple-400 font-semibold">Protected</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Panel */}
                  {showMetadata && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 animate-slide-in">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Image Details
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Original Size</span>
                          <span className="text-white">{result.metadata.originalDimensions.width} × {result.metadata.originalDimensions.height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Transformed Size</span>
                          <span className="text-white">{result.metadata.transformedDimensions.width} × {result.metadata.transformedDimensions.height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">File Size</span>
                          <span className="text-white">{formatFileSize(result.metadata.transformedSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Format</span>
                          <span className="text-white">{result.metadata.format.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Quality</span>
                          <span className="text-white">{result.metadata.quality}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Created</span>
                          <span className="text-white">{new Date(result.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={handleCopyLink}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center gap-3"
                      >
                        {copySuccess ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setShowLightbox(true)}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center gap-3"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Fullscreen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <FullscreenLightbox
        isOpen={showLightbox}
        imageUrl={result.transformedUrl}
        onClose={() => setShowLightbox(false)}
        title="Ghibli Transformation"
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        imageUrl={result.transformedUrl}
        title="Check out my Studio Ghibli transformation!"
      />

      {/* Download Manager */}
      {showDownloadManager && (
        <DownloadManager
          imageUrl={result.transformedUrl}
          imageName={`ghibli-transformation-${result.id}`}
          imageAnalysis={imageAnalysis}
          onClose={() => setShowDownloadManager(false)}
        />
      )}
    </>
  );
};

export default ResultsDisplay;