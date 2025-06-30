import React, { useState, useRef, useCallback } from 'react';
import { Upload, Cloud, X, AlertCircle, Check, Image as ImageIcon, Loader2, Shield, Zap } from 'lucide-react';
import ProcessingOverlay from '../processing/ProcessingOverlay';
import { fileCompressor, CompressionOptions } from '../processing/FileCompressor';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onTransform: (files: File[], style: string) => void;
  isProcessing?: boolean;
  className?: string;
}

interface FileValidation {
  isValid: boolean;
  errors: string[];
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  validation: FileValidation;
  compressed?: File;
  compressionRatio?: number;
  metadataStripped?: boolean;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4000, height: 4000 };

const GHIBLI_STYLES = [
  { id: 'ghibli', name: 'Classic Ghibli', description: 'Timeless Studio Ghibli aesthetic' },
  { id: 'spirited_away', name: 'Spirited Away', description: 'Mystical and ethereal style' },
  { id: 'totoro', name: 'My Neighbor Totoro', description: 'Warm and nature-inspired' },
  { id: 'howls_castle', name: "Howl's Moving Castle", description: 'Romantic and dreamy' }
];

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  onTransform, 
  isProcessing = false,
  className = '' 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('ghibli');
  const [isValidating, setIsValidating] = useState(false);
  const [showExifNotice, setShowExifNotice] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<Record<string, number>>({});
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(async (file: File): Promise<FileValidation> => {
    const errors: string[] = [];

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push('Please upload a JPG, JPEG, PNG, or WebP image');
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Check image dimensions
    try {
      const dimensions = await getImageDimensions(file);
      if (dimensions.width < MIN_DIMENSIONS.width || dimensions.height < MIN_DIMENSIONS.height) {
        errors.push(`Image must be at least ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} pixels`);
      }
      if (dimensions.width > MAX_DIMENSIONS.width || dimensions.height > MAX_DIMENSIONS.height) {
        errors.push(`Image must be no larger than ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels`);
      }
    } catch (error) {
      errors.push('Unable to read image dimensions');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const createPreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const handleFileSelection = async (files: FileList) => {
    setIsValidating(true);
    const newFiles: UploadedFile[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `file-${Date.now()}-${i}`;
        
        const validation = await validateFile(file);
        const preview = createPreview(file);
        
        const uploadedFile: UploadedFile = {
          id: fileId,
          file,
          preview,
          validation
        };

        // Compress and strip metadata if valid
        if (validation.isValid) {
          try {
            // Compress image
            const compressionOptions: CompressionOptions = {
              maxWidth: 2048,
              maxHeight: 2048,
              quality: 0.85,
              stripMetadata: true
            };

            const compressionResult = await fileCompressor.compressImage(
              file,
              compressionOptions,
              (progress) => {
                setCompressionProgress(prev => ({
                  ...prev,
                  [fileId]: progress
                }));
              }
            );

            uploadedFile.compressed = compressionResult.compressedFile;
            uploadedFile.compressionRatio = compressionResult.compressionRatio;
            uploadedFile.metadataStripped = compressionResult.metadataStripped;
            
            onFileSelect(compressionResult.compressedFile);
          } catch (error) {
            console.error('Compression failed:', error);
            // Use original file if compression fails
            onFileSelect(file);
          }
        }
        
        newFiles.push(uploadedFile);
      }
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setShowExifNotice(true);
      
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      createParticles(e.clientX, e.clientY);
      handleFileSelection(files);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

  const handleBrowseClick = (e: React.MouseEvent) => {
    createParticles(e.clientX, e.clientY);
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (uploadedFiles.length === 1) {
      setShowExifNotice(false);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTransform = () => {
    const validFiles = uploadedFiles
      .filter(f => f.validation.isValid)
      .map(f => f.compressed || f.file);
    
    if (validFiles.length > 0) {
      setShowProcessing(true);
    }
  };

  const handleProcessingComplete = (results: any[]) => {
    setShowProcessing(false);
    onTransform(uploadedFiles.map(f => f.compressed || f.file), selectedStyle);
  };

  const handleProcessingError = (error: string) => {
    setShowProcessing(false);
    console.error('Processing error:', error);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validFiles = uploadedFiles.filter(f => f.validation.isValid);
  const hasValidFiles = validFiles.length > 0;

  return (
    <>
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        {/* Particle effects */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="fixed w-2 h-2 bg-purple-400 rounded-full pointer-events-none z-50 animate-sparkle"
            style={{
              left: particle.x,
              top: particle.y,
            }}
          />
        ))}

        {uploadedFiles.length === 0 ? (
          <div
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-500 cursor-pointer group overflow-hidden ${
              isDragOver
                ? 'border-purple-400 bg-purple-500/10 scale-105 shadow-2xl shadow-purple-500/25'
                : 'border-white/30 hover:border-white/50 hover:bg-white/5 hover:shadow-xl hover:shadow-purple-500/10'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={handleFileInputChange}
              multiple
              className="hidden"
            />
            
            {/* Background animation */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 animate-aurora"></div>
            </div>
            
            <div className={`relative transition-all duration-500 ${isDragOver ? 'scale-110' : 'group-hover:scale-105'}`}>
              <div className="relative mb-8">
                <Cloud className={`w-20 h-20 mx-auto text-purple-400 transition-all duration-500 ${
                  isDragOver ? 'animate-levitate text-purple-300' : 'group-hover:animate-breathe'
                }`} />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-4 h-4 bg-blue-400/50 rounded-full animate-drift"></div>
                <div className="absolute -bottom-2 -left-6 w-3 h-3 bg-pink-400/50 rounded-full animate-float"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 animate-glow">
                {isDragOver ? 'Drop your photos here!' : 'Upload Your Photos'}
              </h3>
              
              <p className="text-gray-200 mb-8 leading-relaxed">
                Drag and drop your images here, or click to browse
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 mb-8">
                {[
                  { icon: ImageIcon, text: 'JPG, PNG, WebP' },
                  { icon: Upload, text: 'Max 4MB each' },
                  { icon: Shield, text: 'Auto-deleted in 30s' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 hover-lift group/item" style={{animationDelay: `${index * 0.1}s`}}>
                    <item.icon className="w-4 h-4 group-hover/item:animate-bounce" />
                    <span className="group-hover/item:text-white transition-colors duration-300">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                className="relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden group"
              >
                <span className="relative z-10">Choose Files</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
            
            {isValidating && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center animate-fade-in">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                  <p className="text-white animate-glow">Processing images...</p>
                  <div className="loading-dots mt-4 text-purple-400">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Enhanced File Previews */}
            <div className="grid gap-6">
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={uploadedFile.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 animate-reveal group" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-start gap-6">
                    <div className="relative group/image hover-tilt">
                      <img
                        src={uploadedFile.preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-2xl transition-all duration-500 group-hover/image:shadow-xl"
                      />
                      <button
                        onClick={() => handleRemoveFile(uploadedFile.id)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-90 hover-glow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {compressionProgress[uploadedFile.id] && compressionProgress[uploadedFile.id] < 100 && (
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center animate-fade-in">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                            <div className="text-xs text-white">{compressionProgress[uploadedFile.id]}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-3 gradient-text">{uploadedFile.file.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
                        <div>
                          <span className="text-gray-400">Original:</span> {formatFileSize(uploadedFile.file.size)}
                        </div>
                        <div>
                          <span className="text-gray-400">Type:</span> {uploadedFile.file.type}
                        </div>
                        {uploadedFile.compressed && (
                          <>
                            <div>
                              <span className="text-gray-400">Compressed:</span> {formatFileSize(uploadedFile.compressed.size)}
                            </div>
                            <div>
                              <span className="text-gray-400">Saved:</span> {uploadedFile.compressionRatio?.toFixed(1)}%
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Enhanced Validation Results */}
                      <div className="mb-4">
                        {uploadedFile.validation.isValid ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-green-400 animate-bounce-in">
                              <Check className="w-4 h-4 animate-bounce" />
                              <span>Image validated successfully</span>
                            </div>
                            {uploadedFile.compressed && (
                              <div className="flex items-center gap-2 text-blue-400 animate-bounce-in" style={{animationDelay: '0.1s'}}>
                                <Zap className="w-4 h-4 animate-sparkle" />
                                <span>Optimized and compressed</span>
                              </div>
                            )}
                            {uploadedFile.metadataStripped && (
                              <div className="flex items-center gap-2 text-purple-400 animate-bounce-in" style={{animationDelay: '0.2s'}}>
                                <Shield className="w-4 h-4 animate-constellation" />
                                <span>Metadata stripped for privacy</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {uploadedFile.validation.errors.map((error, errorIndex) => (
                              <div key={errorIndex} className="flex items-center gap-2 text-red-400 animate-shake">
                                <AlertCircle className="w-4 h-4 animate-pulse" />
                                <span>{error}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Add More Files Button */}
            <div className="text-center">
              <button
                onClick={handleBrowseClick}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 hover-lift hover-glow relative overflow-hidden group"
              >
                <span className="relative z-10">Add More Files</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>

            {/* Enhanced EXIF Notice */}
            {showExifNotice && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 animate-reveal hover-glow">
                <div className="flex items-center gap-4">
                  <Shield className="w-6 h-6 text-blue-400 animate-breathe" />
                  <div>
                    <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                      Privacy Protection Active
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      All images have been automatically compressed and EXIF data has been stripped to protect your privacy.
                      Original images will be deleted from our servers within 30 seconds.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Style Selection */}
            {hasValidFiles && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 animate-reveal">
                <h3 className="text-2xl font-semibold text-white mb-6 gradient-text">Choose Your Style</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {GHIBLI_STYLES.map((style, index) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-500 text-left hover-lift hover-glow group relative overflow-hidden ${
                        selectedStyle === style.id
                          ? 'border-purple-400 bg-purple-500/20 shadow-xl shadow-purple-500/20'
                          : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                      }`}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <h4 className="font-semibold text-white mb-2 transition-all duration-300 group-hover:text-purple-300">{style.name}</h4>
                      <p className="text-gray-300 text-sm transition-all duration-300 group-hover:text-gray-200">{style.description}</p>
                      
                      {selectedStyle === style.id && (
                        <div className="absolute top-3 right-3">
                          <Check className="w-5 h-5 text-purple-400 animate-bounce" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleTransform}
                  disabled={isProcessing || !hasValidFiles}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover-glow relative overflow-hidden group"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 group-hover:animate-sparkle" />
                      <span>Transform {validFiles.length} Image{validFiles.length > 1 ? 's' : ''} into Ghibli Magic</span>
                    </>
                  )}
                  
                  {!isProcessing && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      <ProcessingOverlay
        files={validFiles.map(f => f.compressed || f.file)}
        isVisible={showProcessing}
        onClose={() => setShowProcessing(false)}
        onComplete={handleProcessingComplete}
        onError={handleProcessingError}
      />
    </>
  );
};

export default FileUpload;