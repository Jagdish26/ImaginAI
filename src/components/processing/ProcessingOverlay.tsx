import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  Upload, 
  Zap, 
  Check, 
  AlertCircle, 
  Clock,
  Loader2,
  Download,
  Sparkles,
  FileImage,
  Gauge
} from 'lucide-react';

interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  details?: string;
}

interface ProcessingFile {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  uploadProgress: number;
  uploadSpeed?: number;
  queuePosition: number;
  estimatedWaitTime?: number;
  status: 'queued' | 'processing' | 'completed' | 'error';
  steps: ProcessingStep[];
  startTime?: number;
  completedTime?: number;
  errorMessage?: string;
}

interface ProcessingOverlayProps {
  files: File[];
  isVisible: boolean;
  onClose: () => void;
  onComplete: (results: any[]) => void;
  onError: (error: string) => void;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  files,
  isVisible,
  onClose,
  onComplete,
  onError
}) => {
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [magicSparkles, setMagicSparkles] = useState<Array<{ id: number; x: number; y: number; scale: number }>>([]);

  // Initialize processing files
  useEffect(() => {
    if (files.length > 0 && processingFiles.length === 0) {
      const initialFiles: ProcessingFile[] = files.map((file, index) => ({
        id: `file-${index}`,
        file,
        originalSize: file.size,
        uploadProgress: 0,
        queuePosition: index + 1,
        estimatedWaitTime: index * 3000, // 3 seconds per file
        status: index === 0 ? 'processing' : 'queued',
        steps: [
          {
            id: 'compress',
            name: 'Compression',
            description: 'Optimizing image size...',
            icon: Gauge,
            status: index === 0 ? 'processing' : 'pending',
            progress: 0
          },
          {
            id: 'metadata',
            name: 'Privacy Protection',
            description: 'Removing EXIF data for privacy...',
            icon: Shield,
            status: 'pending',
            progress: 0
          },
          {
            id: 'upload',
            name: 'Upload',
            description: 'Uploading to secure server...',
            icon: Upload,
            status: 'pending',
            progress: 0
          },
          {
            id: 'transform',
            name: 'AI Transformation',
            description: 'Creating Studio Ghibli magic...',
            icon: Sparkles,
            status: 'pending',
            progress: 0
          }
        ]
      }));
      
      setProcessingFiles(initialFiles);
      setIsProcessing(true);
    }
  }, [files]);

  // Enhanced particle effects
  useEffect(() => {
    if (isProcessing) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3
      }));
      setParticles(newParticles);

      const sparkleInterval = setInterval(() => {
        const newSparkles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          scale: Math.random() * 0.5 + 0.5
        }));
        setMagicSparkles(prev => [...prev, ...newSparkles]);
        
        setTimeout(() => {
          setMagicSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
        }, 2000);
      }, 1000);

      return () => clearInterval(sparkleInterval);
    }
  }, [isProcessing]);

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Enhanced processing simulation
  useEffect(() => {
    if (!isProcessing || processingFiles.length === 0) return;

    const processFile = async (fileIndex: number) => {
      const file = processingFiles[fileIndex];
      if (!file || file.status === 'completed') return;

      // Start processing
      setProcessingFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, status: 'processing', startTime: Date.now() } : f
      ));

      // Process each step with enhanced animations
      for (let stepIndex = 0; stepIndex < file.steps.length; stepIndex++) {
        const step = file.steps[stepIndex];
        
        // Start step
        setProcessingFiles(prev => prev.map((f, i) => 
          i === fileIndex ? {
            ...f,
            steps: f.steps.map((s, si) => 
              si === stepIndex ? { ...s, status: 'processing' } : s
            )
          } : f
        ));

        // Enhanced progress simulation
        for (let progress = 0; progress <= 100; progress += Math.random() * 15 + 5) {
          progress = Math.min(progress, 100);
          
          await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 120));
          
          setProcessingFiles(prev => prev.map((f, i) => 
            i === fileIndex ? {
              ...f,
              steps: f.steps.map((s, si) => 
                si === stepIndex ? { 
                  ...s, 
                  progress,
                  details: getStepDetails(step.id, progress, f)
                } : s
              )
            } : f
          ));

          // Update upload progress for upload step
          if (step.id === 'upload') {
            setProcessingFiles(prev => prev.map((f, i) => 
              i === fileIndex ? {
                ...f,
                uploadProgress: progress,
                uploadSpeed: progress > 0 ? Math.random() * 8 + 3 : 0 // 3-11 MB/s
              } : f
            ));
          }
        }

        // Complete step with celebration
        setProcessingFiles(prev => prev.map((f, i) => 
          i === fileIndex ? {
            ...f,
            steps: f.steps.map((s, si) => 
              si === stepIndex ? { ...s, status: 'completed', progress: 100 } : s
            )
          } : f
        ));
      }

      // Complete file with magic effect
      setProcessingFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { 
          ...f, 
          status: 'completed',
          completedTime: Date.now()
        } : f
      ));

      // Update queue positions
      setProcessingFiles(prev => prev.map((f, i) => 
        i > fileIndex ? { ...f, queuePosition: f.queuePosition - 1 } : f
      ));
    };

    // Process files sequentially
    const processAllFiles = async () => {
      for (let i = 0; i < processingFiles.length; i++) {
        await processFile(i);
        setCurrentFileIndex(i + 1);
        
        // Update overall progress with smooth animation
        setOverallProgress(((i + 1) / processingFiles.length) * 100);
      }
      
      // All files completed
      setIsProcessing(false);
      setTimeout(() => {
        onComplete(processingFiles.map(f => ({ id: f.id, file: f.file })));
      }, 1500);
    };

    processAllFiles();
  }, [processingFiles.length]);

  const getStepDetails = (stepId: string, progress: number, file: ProcessingFile): string => {
    switch (stepId) {
      case 'compress':
        if (progress === 100) {
          const ratio = Math.floor(Math.random() * 30 + 20); // 20-50% compression
          return `Reduced by ${ratio}% • ${formatFileSize(file.originalSize * (1 - ratio/100))}`;
        }
        return `Analyzing image structure...`;
      
      case 'metadata':
        if (progress === 100) {
          return 'EXIF data stripped • Privacy protected';
        }
        return 'Scanning for metadata...';
      
      case 'upload':
        if (file.uploadSpeed) {
          return `${file.uploadSpeed.toFixed(1)} MB/s • ${progress}% uploaded`;
        }
        return 'Establishing secure connection...';
      
      case 'transform':
        if (progress === 100) {
          return 'Studio Ghibli transformation complete! ✨';
        }
        return 'AI painting your masterpiece...';
      
      default:
        return '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds %  60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (showCancelConfirm) {
      setIsProcessing(false);
      onClose();
    } else {
      setShowCancelConfirm(true);
      setTimeout(() => setShowCancelConfirm(false), 3000);
    }
  };

  if (!isVisible) return null;

  const currentFile = processingFiles[currentFileIndex] || processingFiles[0];
  const completedFiles = processingFiles.filter(f => f.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Enhanced Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl">
        {/* Enhanced Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
        
        {/* Magic sparkles */}
        {magicSparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute animate-sparkle"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              transform: `scale(${sparkle.scale})`,
            }}
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
        ))}
        
        {/* Enhanced Animated Background Gradients */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-levitate"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-drift"></div>
          <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-breathe"></div>
        </div>
      </div>

      {/* Enhanced Processing Card */}
      <div className="relative w-full max-w-4xl mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl animate-scale-in hover-glow">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
                {isProcessing ? (
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                ) : (
                  <Check className="w-10 h-10 text-white animate-bounce" />
                )}
              </div>
              {isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 animate-breathe"></div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white gradient-text mb-2">
                {isProcessing ? 'Creating Magic...' : 'Processing Complete!'}
              </h2>
              <p className="text-gray-200 text-lg">
                {isProcessing 
                  ? `Processing ${completedFiles + 1} of ${processingFiles.length} files`
                  : `All ${processingFiles.length} files processed successfully`
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCancel}
            className={`p-3 rounded-xl transition-all duration-300 ${
              showCancelConfirm 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Overall Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium text-lg">Overall Progress</span>
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
              <span className="text-lg font-semibold text-purple-300">{Math.round(overallProgress)}%</span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 h-4 rounded-full transition-all duration-700 ease-out relative overflow-hidden progress-bar"
              style={{ width: `${overallProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Current File Processing */}
        {currentFile && (
          <div className="mb-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover-glow">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center animate-breathe">
                  <FileImage className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2 gradient-text">{currentFile.file.name}</h3>
                  <p className="text-gray-300 text-lg">
                    {formatFileSize(currentFile.originalSize)} • 
                    {currentFile.status === 'queued' && ` Position ${currentFile.queuePosition} in queue`}
                    {currentFile.status === 'processing' && ' Processing now'}
                    {currentFile.status === 'completed' && ' Completed'}
                  </p>
                </div>
                {currentFile.status === 'queued' && currentFile.estimatedWaitTime && (
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Estimated wait</div>
                    <div className="text-white font-medium text-lg">
                      {Math.ceil(currentFile.estimatedWaitTime / 1000)}s
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Processing Steps */}
              <div className="space-y-6">
                {currentFile.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-6 animate-reveal" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      step.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 animate-celebrate' 
                        : step.status === 'processing'
                        ? 'bg-purple-500/20 text-purple-400 animate-pulse-glow'
                        : step.status === 'error'
                        ? 'bg-red-500/20 text-red-400 animate-shake'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {step.status === 'completed' ? (
                        <Check className="w-6 h-6 animate-bounce" />
                      ) : step.status === 'processing' ? (
                        <step.icon className="w-6 h-6 animate-spin" />
                      ) : step.status === 'error' ? (
                        <AlertCircle className="w-6 h-6 animate-pulse" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium text-lg ${
                          step.status === 'completed' ? 'text-green-400 gradient-text' :
                          step.status === 'processing' ? 'text-white animate-glow' :
                          'text-gray-300'
                        }`}>
                          {step.name}
                        </span>
                        {step.status === 'processing' && (
                          <span className="text-lg text-purple-300 font-semibold">{step.progress}%</span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 mb-3">{step.description}</p>
                      
                      {step.details && (
                        <p className="text-sm text-gray-400 animate-fade-in">{step.details}</p>
                      )}
                      
                      {step.status === 'processing' && (
                        <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300 progress-bar"
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Queue Visualization */}
        {processingFiles.length > 1 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Processing Queue
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-4 stagger-animation">
              {processingFiles.map((file, index) => (
                <div
                  key={file.id}
                  className={`flex-shrink-0 w-36 h-24 rounded-xl border-2 transition-all duration-500 hover-lift ${
                    file.status === 'completed'
                      ? 'border-green-400 bg-green-500/10 animate-celebrate'
                      : file.status === 'processing'
                      ? 'border-purple-400 bg-purple-500/10 animate-pulse-glow'
                      : 'border-white/20 bg-white/5'
                  }`}
                  style={{"--index": index} as React.CSSProperties}
                >
                  <div className="p-4 h-full flex flex-col justify-between">
                    <div className="text-sm text-gray-300 truncate">{file.file.name}</div>
                    <div className="flex items-center justify-between">
                      <div className={`w-3 h-3 rounded-full ${
                        file.status === 'completed' ? 'bg-green-400 animate-pulse' :
                        file.status === 'processing' ? 'bg-purple-400 animate-pulse' :
                        'bg-gray-400'
                      }`} />
                      <div className="text-sm text-gray-400">#{index + 1}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="flex justify-center gap-6">
          {isProcessing ? (
            <button
              onClick={handleCancel}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-500 text-lg ${
                showCancelConfirm
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20 hover-lift hover-glow'
              }`}
            >
              {showCancelConfirm ? 'Confirm Cancel' : 'Cancel Processing'}
            </button>
          ) : (
            <button
              onClick={() => onComplete(processingFiles.map(f => ({ id: f.id, file: f.file })))}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-500 transform hover:scale-105 flex items-center gap-3 hover-glow relative overflow-hidden group"
            >
              <Download className="w-6 h-6 group-hover:animate-bounce" />
              <span>View Results</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;