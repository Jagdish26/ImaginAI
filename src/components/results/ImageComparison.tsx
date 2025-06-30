import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, RotateCcw } from 'lucide-react';

interface ImageComparisonProps {
  originalUrl: string;
  transformedUrl: string;
  onFullscreen: () => void;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalUrl,
  transformedUrl,
  onFullscreen
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState({ original: false, transformed: false });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleImageLoad = (type: 'original' | 'transformed') => {
    setIsLoaded(prev => ({ ...prev, [type]: true }));
  };

  const allImagesLoaded = isLoaded.original && isLoaded.transformed;

  return (
    <div className="relative group">
      <div 
        ref={containerRef}
        className="relative aspect-square rounded-2xl overflow-hidden bg-black/20 cursor-col-resize select-none"
        onMouseDown={() => setIsDragging(true)}
      >
        {/* Loading State */}
        {!allImagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-white">Loading comparison...</p>
            </div>
          </div>
        )}

        {/* Original Image (Right Side) */}
        <img
          src={originalUrl}
          alt="Original"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            allImagesLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => handleImageLoad('original')}
          draggable={false}
        />

        {/* Transformed Image (Left Side) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={transformedUrl}
            alt="Transformed"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              allImagesLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad('transformed')}
            draggable={false}
          />
        </div>

        {/* Slider Line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-20 transition-all duration-100"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize">
            <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5" />
            <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5" />
          </div>
        </div>

        {/* Labels */}
        {allImagesLoaded && (
          <>
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
              Ghibli Style
            </div>
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
              Original
            </div>
          </>
        )}

        {/* Controls */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); setSliderPosition(50); }}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-xl flex items-center justify-center transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onFullscreen(); }}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-xl flex items-center justify-center transition-all duration-200"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        {allImagesLoaded && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Drag to compare • Click for fullscreen
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageComparison;