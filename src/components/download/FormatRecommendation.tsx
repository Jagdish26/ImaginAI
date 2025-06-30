import React from 'react';
import { Star, Zap, Award, Info } from 'lucide-react';
import { DownloadOption } from './DownloadManager';

interface FormatRecommendationProps {
  recommendedFormat: DownloadOption;
  imageAnalysis?: {
    hasTransparency: boolean;
    colorDepth: number;
    complexity: 'low' | 'medium' | 'high';
    artworkType: 'photo' | 'illustration' | 'mixed';
  };
  onSelect: (option: DownloadOption) => void;
}

const FormatRecommendation: React.FC<FormatRecommendationProps> = ({
  recommendedFormat,
  imageAnalysis,
  onSelect
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRecommendationReason = (): string => {
    if (!imageAnalysis) return 'Best overall quality and compatibility';
    
    if (imageAnalysis.hasTransparency) {
      return 'PNG preserves transparency in your artwork';
    }
    
    if (imageAnalysis.artworkType === 'illustration') {
      return 'PNG is ideal for illustrations with sharp edges';
    }
    
    if (imageAnalysis.complexity === 'high') {
      return 'JPEG provides excellent quality with smaller file size';
    }
    
    return 'WebP offers the best compression with modern browser support';
  };

  const getAlternatives = (): string[] => {
    if (!imageAnalysis) return ['JPEG for smaller file size', 'WebP for web use'];
    
    const alternatives: string[] = [];
    
    if (recommendedFormat.format !== 'JPEG') {
      alternatives.push('JPEG for smaller file size');
    }
    
    if (recommendedFormat.format !== 'WebP') {
      alternatives.push('WebP for modern web browsers');
    }
    
    if (recommendedFormat.format !== 'PDF') {
      alternatives.push('PDF for documents and presentations');
    }
    
    return alternatives.slice(0, 2);
  };

  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
      <div className="flex items-start gap-4">
        {/* Recommendation Badge */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center relative">
            <Award className="w-8 h-8 text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-yellow-900" />
            </div>
          </div>
        </div>

        {/* Recommendation Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-white">AI Recommended</h3>
            <div className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded-lg text-xs font-medium">
              Smart Choice
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-white">{recommendedFormat.format}</span>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                {recommendedFormat.quality} Quality
              </span>
              <span className="text-purple-300 font-medium">{recommendedFormat.size}</span>
            </div>
            <p className="text-gray-200 mb-3">{recommendedFormat.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-400">
                <Zap className="w-4 h-4" />
                <span>File Size: {formatFileSize(recommendedFormat.fileSize)}</span>
              </div>
              {recommendedFormat.compressionRatio && (
                <div className="flex items-center gap-1 text-blue-400">
                  <Info className="w-4 h-4" />
                  <span>{recommendedFormat.compressionRatio}% Quality</span>
                </div>
              )}
            </div>
          </div>

          {/* Recommendation Reason */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              Why this format?
            </h4>
            <p className="text-gray-200 text-sm mb-3">{getRecommendationReason()}</p>
            
            {imageAnalysis && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Artwork Type:</span>
                  <span className="text-white capitalize">{imageAnalysis.artworkType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Complexity:</span>
                  <span className="text-white capitalize">{imageAnalysis.complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transparency:</span>
                  <span className="text-white">{imageAnalysis.hasTransparency ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Color Depth:</span>
                  <span className="text-white">{imageAnalysis.colorDepth}-bit</span>
                </div>
              </div>
            )}
          </div>

          {/* Alternatives */}
          <div className="mb-4">
            <p className="text-gray-300 text-sm mb-2">Alternatives to consider:</p>
            <div className="flex flex-wrap gap-2">
              {getAlternatives().map((alternative, index) => (
                <span key={index} className="bg-white/5 text-gray-300 px-3 py-1 rounded-lg text-xs">
                  {alternative}
                </span>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={() => onSelect(recommendedFormat)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <Star className="w-5 h-5" />
            Download Recommended ({recommendedFormat.format})
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormatRecommendation;