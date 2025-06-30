import React, { useState } from 'react';
import { X, Copy, Facebook, Twitter, Instagram, Link, CheckCircle, Download } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const shareUrl = window.location.href;
  const shareText = `${title} - Created with ImaginAI's Studio Ghibli transformation`;

  const socialPlatforms = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'from-blue-400 to-blue-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-800',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      url: '#'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleSocialShare = (platform: typeof socialPlatforms[0]) => {
    setSelectedPlatform(platform.id);
    
    if (platform.id === 'instagram') {
      // Instagram doesn't support direct URL sharing, show instructions
      return;
    }
    
    window.open(platform.url, '_blank', 'width=600,height=400');
    
    setTimeout(() => setSelectedPlatform(null), 1000);
  };

  const handleDownloadForSharing = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ghibli-transformation-share.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Share Your Creation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <div className="aspect-square rounded-2xl overflow-hidden mb-4">
            <img
              src={imageUrl}
              alt="Share preview"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-200 text-center text-sm">
            {title}
          </p>
        </div>

        {/* Copy Link */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Share Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                copySuccess 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
            >
              {copySuccess ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          {copySuccess && (
            <p className="text-green-400 text-sm mt-2 animate-slide-in">Link copied to clipboard!</p>
          )}
        </div>

        {/* Social Platforms */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">Share on Social Media</label>
          <div className="grid grid-cols-3 gap-3">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.id}
                  onClick={() => handleSocialShare(platform)}
                  disabled={selectedPlatform === platform.id}
                  className={`relative bg-gradient-to-r ${platform.color} hover:scale-105 disabled:scale-100 text-white p-4 rounded-2xl transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden`}
                >
                  {selectedPlatform === platform.id && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{platform.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Instagram Instructions */}
        <div className="mb-6 bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Instagram className="w-5 h-5 text-pink-400" />
            <span className="text-pink-400 font-medium">Instagram Sharing</span>
          </div>
          <p className="text-gray-200 text-sm mb-3">
            Download the image and share it manually on Instagram with your caption.
          </p>
          <button
            onClick={handleDownloadForSharing}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Download for Instagram
          </button>
        </div>

        {/* Suggested Caption */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <label className="block text-white font-medium mb-2">Suggested Caption</label>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-gray-200 text-sm leading-relaxed">
              "Just transformed my photo into Studio Ghibli magic with @ImaginAI! ✨ The AI perfectly captured that dreamy, hand-drawn aesthetic. #StudioGhibli #AIArt #ImaginAI #PhotoTransformation"
            </p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText("Just transformed my photo into Studio Ghibli magic with @ImaginAI! ✨ The AI perfectly captured that dreamy, hand-drawn aesthetic. #StudioGhibli #AIArt #ImaginAI #PhotoTransformation")}
            className="mt-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            Copy caption
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;