import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Download, Share2, Heart } from 'lucide-react';
import FileUpload from './FileUpload';
import ResultsDisplay from '../results/ResultsDisplay';
import { useAuth } from '../../hooks/useAuth';

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

const UploadPage: React.FC = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TransformationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleTransform = async (files: File[], style: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate API call - replace with actual transformation logic
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const file = files[0]; // Use first file for demo
      
      // Mock result - replace with actual API response
      const mockResult: TransformationResult = {
        id: Date.now().toString(),
        originalUrl: URL.createObjectURL(file),
        transformedUrl: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800', // Mock transformed image
        style,
        processingTime: 2847,
        metadata: {
          originalDimensions: { width: 1920, height: 1080 },
          transformedDimensions: { width: 1920, height: 1080 },
          originalSize: file.size,
          transformedSize: file.size * 0.85, // Simulated compression
          format: 'jpeg',
          quality: 95
        },
        createdAt: new Date().toISOString()
      };
      
      setResult(mockResult);
    } catch (error) {
      console.error('Transformation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewTransformation = () => {
    setResult(null);
    setSelectedFile(null);
  };

  const handleBackToUpload = () => {
    setResult(null);
    setSelectedFile(null);
  };

  if (result) {
    return (
      <ResultsDisplay
        result={result}
        onNewTransformation={handleNewTransformation}
        onBack={handleBackToUpload}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 font-inter">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ImaginAI</span>
          </div>
          {user && (
            <div className="text-gray-300">
              Welcome, {user.user_metadata?.full_name || user.email}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                Transform Your Photos into{' '}
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Studio Ghibli Magic
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                Upload your photo and watch as our AI transforms it into a beautiful Studio Ghibli-style illustration. 
                Your privacy is protected - original images are deleted within 30 seconds.
              </p>
            </div>

            <FileUpload
              onFileSelect={handleFileSelect}
              onTransform={handleTransform}
              isProcessing={isProcessing}
            />

            {isProcessing && (
              <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Creating Magic...</h3>
                  <p className="text-gray-200">Our AI is transforming your photo into Studio Ghibli style</p>
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                
                <p className="text-sm text-gray-300">This usually takes 2-5 seconds...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;