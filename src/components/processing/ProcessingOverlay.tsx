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

  // Generate floating particles
  useEffect(() => {
    if (isProcessing) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
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

  // Simulate processing steps
  useEffect(() => {
    if (!isProcessing || processingFiles.length === 0) return;

    const processFile = async (fileIndex: number) => {
      const file = processingFiles[fileIndex];
      if (!file || file.status === 'completed') return;

      // Start processing
      setProcessingFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, status: 'processing', startTime: Date.now() } : f
      ));

      // Process each step
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

        // Simulate step progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          
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
                uploadSpeed: progress > 0 ? Math.random() * 5 + 2 : 0 // 2-7 MB/s
              } : f
            ));
          }
        }

        // Complete step
        setProcessingFiles(prev => prev.map((f, i) => 
          i === fileIndex ? {
            ...f,
            steps: f.steps.map((s, si) => 
              si === stepIndex ? { ...s, status: 'completed', progress: 100 } : s
            )
          } : f
        ));
      }

      // Complete file
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
        
        // Update overall progress
        setOverallProgress(((i + 1) / processingFiles.length) * 100);
      }
      
      // All files completed
      setIsProcessing(false);
      setTimeout(() => {
        onComplete(processingFiles.map(f => ({ id: f.id, file: f.file })));
      }, 1000);
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
          return 'Studio Ghibli transformation complete!';
        }
        return 'AI processing your image...';
      
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
    const secs = seconds % 60;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl">
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>
      </div>

      {/* Processing Card */}
      <div className="relative w-full max-w-4xl mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Check className="w-8 h-8 text-white" />
                )}
              </div>
              {isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isProcessing ? 'Creating Magic...' : 'Processing Complete!'}
              </h2>
              <p className="text-gray-200">
                {isProcessing 
                  ? `Processing ${completedFiles + 1} of ${processingFiles.length} files`
                  : `All ${processingFiles.length} files processed successfully`
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCancel}
            className={`p-2 rounded-xl transition-all duration-200 ${
              showCancelConfirm 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">Overall Progress</span>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
              <span>{Math.round(overallProgress)}%</span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${overallProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Current File Processing */}
        {currentFile && (
          <div className="mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileImage className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{currentFile.file.name}</h3>
                  <p className="text-gray-300 text-sm">
                    {formatFileSize(currentFile.originalSize)} • 
                    {currentFile.status === 'queued' && ` Position ${currentFile.queuePosition} in queue`}
                    {currentFile.status === 'processing' && ' Processing now'}
                    {currentFile.status === 'completed' && ' Completed'}
                  </p>
                </div>
                {currentFile.status === 'queued' && currentFile.estimatedWaitTime && (
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Estimated wait</div>
                    <div className="text-white font-medium">
                      {Math.ceil(currentFile.estimatedWaitTime / 1000)}s
                    </div>
                  </div>
                )}
              </div>

              {/* Processing Steps */}
              <div className="space-y-4">
                {currentFile.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      step.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : step.status === 'processing'
                        ? 'bg-purple-500/20 text-purple-400'
                        : step.status === 'error'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {step.status === 'completed' ? (
                        <Check className="w-5 h-5" />
                      ) : step.status === 'processing' ? (
                        <step.icon className="w-5 h-5 animate-pulse" />
                      ) : step.status === 'error' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${
                          step.status === 'completed' ? 'text-green-400' :
                          step.status === 'processing' ? 'text-white' :
                          'text-gray-300'
                        }`}>
                          {step.name}
                        </span>
                        {step.status === 'processing' && (
                          <span className="text-sm text-gray-400">{step.progress}%</span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">{step.description}</p>
                      
                      {step.details && (
                        <p className="text-xs text-gray-500">{step.details}</p>
                      )}
                      
                      {step.status === 'processing' && (
                        <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all duration-300"
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

        {/* Queue Visualization */}
        {processingFiles.length > 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Processing Queue</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {processingFiles.map((file, index) => (
                <div
                  key={file.id}
                  className={`flex-shrink-0 w-32 h-20 rounded-xl border-2 transition-all duration-300 ${
                    file.status === 'completed'
                      ? 'border-green-400 bg-green-500/10'
                      : file.status === 'processing'
                      ? 'border-purple-400 bg-purple-500/10'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <div className="p-3 h-full flex flex-col justify-between">
                    <div className="text-xs text-gray-300 truncate">{file.file.name}</div>
                    <div className="flex items-center justify-between">
                      <div className={`w-2 h-2 rounded-full ${
                        file.status === 'completed' ? 'bg-green-400' :
                        file.status === 'processing' ? 'bg-purple-400 animate-pulse' :
                        'bg-gray-400'
                      }`} />
                      <div className="text-xs text-gray-400">#{index + 1}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {isProcessing ? (
            <button
              onClick={handleCancel}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                showCancelConfirm
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20'
              }`}
            >
              {showCancelConfirm ? 'Confirm Cancel' : 'Cancel Processing'}
            </button>
          ) : (
            <button
              onClick={() => onComplete(processingFiles.map(f => ({ id: f.id, file: f.file })))}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              View Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;