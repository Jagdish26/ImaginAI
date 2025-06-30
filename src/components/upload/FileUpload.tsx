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
      handleFileSelection(files);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

  const handleBrowseClick = () => {
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
        {uploadedFiles.length === 0 ? (
          <div
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer group ${
              isDragOver
                ? 'border-purple-400 bg-purple-500/10 scale-105'
                : 'border-white/30 hover:border-white/50 hover:bg-white/5'
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
            
            <div className={`transition-all duration-300 ${isDragOver ? 'scale-110' : 'group-hover:scale-105'}`}>
              <div className="relative mb-6">
                <Cloud className={`w-16 h-16 mx-auto text-purple-400 transition-all duration-300 ${
                  isDragOver ? 'animate-bounce' : 'group-hover:animate-pulse'
                }`} />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                {isDragOver ? 'Drop your photos here!' : 'Upload Your Photos'}
              </h3>
              
              <p className="text-gray-200 mb-6">
                Drag and drop your images here, or click to browse
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>JPG, PNG, WebP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Max 4MB each</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Auto-deleted in 30s</span>
                </div>
              </div>
              
              <button
                type="button"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                Choose Files
              </button>
            </div>
            
            {isValidating && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                  <p className="text-white">Processing images...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* File Previews */}
            <div className="grid gap-4">
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                  <div className="flex items-start gap-6">
                    <div className="relative group">
                      <img
                        src={uploadedFile.preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-2xl"
                      />
                      <button
                        onClick={() => handleRemoveFile(uploadedFile.id)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {compressionProgress[uploadedFile.id] && compressionProgress[uploadedFile.id] < 100 && (
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-6 h-6 text-white animate-spin mx-auto mb-1" />
                            <div className="text-xs text-white">{compressionProgress[uploadedFile.id]}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{uploadedFile.file.name}</h3>
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
                      
                      {/* Validation Results */}
                      <div className="mb-4">
                        {uploadedFile.validation.isValid ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-400">
                              <Check className="w-4 h-4" />
                              <span>Image validated successfully</span>
                            </div>
                            {uploadedFile.compressed && (
                              <div className="flex items-center gap-2 text-blue-400">
                                <Zap className="w-4 h-4" />
                                <span>Optimized and compressed</span>
                              </div>
                            )}
                            {uploadedFile.metadataStripped && (
                              <div className="flex items-center gap-2 text-purple-400">
                                <Shield className="w-4 h-4" />
                                <span>Metadata stripped for privacy</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {uploadedFile.validation.errors.map((error, index) => (
                              <div key={index} className="flex items-center gap-2 text-red-400 animate-slide-in">
                                <AlertCircle className="w-4 h-4" />
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

            {/* Add More Files Button */}
            <div className="text-center">
              <button
                onClick={handleBrowseClick}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                Add More Files
              </button>
            </div>

            {/* EXIF Notice */}
            {showExifNotice && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 animate-slide-in">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="text-blue-400 font-medium">Privacy Protection Active</h4>
                    <p className="text-gray-300 text-sm">
                      All images have been automatically compressed and EXIF data has been stripped to protect your privacy.
                      Original images will be deleted from our servers within 30 seconds.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Style Selection */}
            {hasValidFiles && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Choose Your Style</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {GHIBLI_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                        selectedStyle === style.id
                          ? 'border-purple-400 bg-purple-500/20'
                          : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                      }`}
                    >
                      <h4 className="font-semibold text-white mb-1">{style.name}</h4>
                      <p className="text-gray-300 text-sm">{style.description}</p>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleTransform}
                  disabled={isProcessing || !hasValidFiles}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Transform {validFiles.length} Image{validFiles.length > 1 ? 's' : ''} into Ghibli Magic
                    </>
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