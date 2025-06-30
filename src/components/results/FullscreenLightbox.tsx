import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Share2 } from 'lucide-react';

interface FullscreenLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  title?: string;
}

const FullscreenLightbox: React.FC<FullscreenLightboxProps> = ({
  isOpen,
  imageUrl,
  onClose,
  title = 'Image'
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setIsLoaded(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom(prev => Math.max(0.5, Math.min(5, prev + delta)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2">
              <button
                onClick={handleZoomOut}
                className="text-white hover:text-purple-300 transition-colors p-1"
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-white text-sm font-mono min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="text-white hover:text-purple-300 transition-colors p-1"
                disabled={zoom >= 5}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="text-white hover:text-purple-300 transition-colors p-1 ml-2"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="text-white hover:text-red-300 transition-colors p-2 bg-black/30 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {!isLoaded && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-white">Loading high-resolution image...</p>
          </div>
        )}
        
        <img
          src={imageUrl}
          alt={title}
          className={`max-w-none transition-all duration-300 select-none ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${zoom > 1 ? 'cursor-move' : 'cursor-zoom-in'}`}
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            maxHeight: zoom === 1 ? '90vh' : 'none',
            maxWidth: zoom === 1 ? '90vw' : 'none'
          }}
          onLoad={() => setIsLoaded(true)}
          onDoubleClick={zoom === 1 ? handleZoomIn : handleResetZoom}
          draggable={false}
        />
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-6">
        <div className="flex items-center justify-center gap-4">
          <button className="bg-black/30 hover:bg-black/50 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="bg-black/30 hover:bg-black/50 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-gray-300 text-sm">
            Use mouse wheel to zoom • Drag to pan • Double-click to zoom • Press ESC to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullscreenLightbox;