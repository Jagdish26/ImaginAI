import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  Eye, 
  Lock, 
  Trash2, 
  FileX, 
  CheckCircle, 
  ArrowRight,
  Download,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowUp
} from 'lucide-react';

interface TableOfContentsItem {
  id: string;
  title: string;
  subsections?: string[];
}

const PrivacyPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const tableOfContents: TableOfContentsItem[] = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      subsections: ['Our Commitment', 'Key Principles', 'Quick Summary']
    },
    {
      id: 'data-collection',
      title: 'Data Collection',
      subsections: ['What We Collect', 'How We Collect', 'Why We Collect']
    },
    {
      id: 'automatic-deletion',
      title: 'Automatic Image Deletion',
      subsections: ['30-Second Rule', 'Deletion Process', 'Verification']
    },
    {
      id: 'exif-removal',
      title: 'EXIF Metadata Removal',
      subsections: ['What is EXIF', 'Automatic Stripping', 'Privacy Protection']
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Data',
      subsections: ['Processing', 'Analytics', 'Improvements']
    },
    {
      id: 'user-rights',
      title: 'Your Rights & Controls',
      subsections: ['Access Rights', 'Deletion Rights', 'Control Options']
    },
    {
      id: 'third-party',
      title: 'Third-Party Services',
      subsections: ['Payment Processing', 'Analytics', 'Infrastructure']
    },
    {
      id: 'security',
      title: 'Security Measures',
      subsections: ['Encryption', 'Access Controls', 'Monitoring']
    },
    {
      id: 'contact',
      title: 'Contact Information',
      subsections: ['Privacy Officer', 'Support', 'Legal']
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
      
      setShowBackToTop(scrollTop > 500);
      
      // Update active section based on scroll position
      const sections = tableOfContents.map(item => item.id);
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 font-inter">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/20 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ImaginAI</h1>
              <p className="text-sm text-gray-300">Privacy Policy</p>
            </div>
          </div>
          <a
            href="/"
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </a>
        </div>

        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Privacy{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                First
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your privacy is our top priority. We've built ImaginAI with privacy-first principles, 
              ensuring your personal photos are protected and automatically deleted.
            </p>
            
            {/* Key Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">30 Seconds</h3>
                <p className="text-gray-300 text-sm">Automatic image deletion</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileX className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Zero Storage</h3>
                <p className="text-gray-300 text-sm">No permanent image storage</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Full Encryption</h3>
                <p className="text-gray-300 text-sm">End-to-end protection</p>
              </div>
            </div>

            <div className="text-sm text-gray-400">
              Last updated: January 30, 2025 • Effective immediately
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <div key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 ${
                            activeSection === item.id
                              ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-400'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {item.title}
                        </button>
                        {item.subsections && activeSection === item.id && (
                          <div className="ml-4 mt-2 space-y-1 animate-slide-in">
                            {item.subsections.map((subsection, index) => (
                              <div key={index} className="text-sm text-gray-400 py-1">
                                • {subsection}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 space-y-12">
                
                {/* Privacy Overview */}
                <section id="overview">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Privacy Overview</h2>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
                      <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Our Commitment
                      </h3>
                      <p className="text-gray-200 leading-relaxed">
                        ImaginAI is built with privacy-first principles. We believe your personal photos should remain private, 
                        which is why we automatically delete all original images within 30 seconds of processing. We never store, 
                        analyze, or share your personal photos.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4">Key Privacy Principles</h3>
                    <ul className="space-y-3 text-gray-200">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong>Minimal Data Collection:</strong> We only collect data necessary for service operation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong>Automatic Deletion:</strong> Original images deleted within 30 seconds</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong>No Permanent Storage:</strong> We don't keep copies of your personal photos</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong>Transparency:</strong> Clear information about data handling practices</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong>User Control:</strong> You control your data and privacy settings</span>
                      </li>
                    </ul>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mt-6">
                      <h4 className="text-blue-400 font-semibold mb-3">Quick Summary</h4>
                      <p className="text-gray-200 leading-relaxed">
                        When you upload a photo to ImaginAI, we process it to create your Studio Ghibli transformation, 
                        then immediately delete the original. We strip all metadata (EXIF data) for privacy, use encryption 
                        for data in transit, and never share your images with third parties.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Data Collection */}
                <section id="data-collection">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Data Collection</h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-white mb-4">What We Collect</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Account Information
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• Email address</li>
                          <li>• Full name (optional)</li>
                          <li>• Account preferences</li>
                          <li>• Subscription status</li>
                        </ul>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Usage Information
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• Transformation count</li>
                          <li>• Style preferences</li>
                          <li>• Processing times</li>
                          <li>• Error logs (anonymized)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
                      <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        What We DON'T Collect
                      </h4>
                      <ul className="text-gray-200 space-y-2">
                        <li>• Your original photos (deleted within 30 seconds)</li>
                        <li>• EXIF metadata from your images</li>
                        <li>• Location data from photos</li>
                        <li>• Biometric or facial recognition data</li>
                        <li>• Personal conversations or messages</li>
                        <li>• Browsing history outside our service</li>
                      </ul>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4">How We Collect Data</h3>
                    <p className="text-gray-200 leading-relaxed mb-4">
                      We collect information in the following ways:
                    </p>
                    <ul className="space-y-3 text-gray-200">
                      <li><strong>Directly from you:</strong> When you create an account, update preferences, or contact support</li>
                      <li><strong>Automatically:</strong> Usage analytics, performance metrics, and error logs</li>
                      <li><strong>From third parties:</strong> Payment processors for subscription management</li>
                    </ul>
                  </div>
                </section>

                {/* Automatic Deletion */}
                <section id="automatic-deletion">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Automatic Image Deletion</h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6">
                      <h3 className="text-red-300 font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        30-Second Deletion Rule
                      </h3>
                      <p className="text-gray-200 leading-relaxed">
                        Every original image uploaded to ImaginAI is automatically and permanently deleted from our servers 
                        within 30 seconds of processing completion. This is not configurable - it happens automatically 
                        for every single upload to protect your privacy.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4">Deletion Process</h3>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                        <div>
                          <h4 className="text-white font-medium">Upload & Processing</h4>
                          <p className="text-gray-300 text-sm">Your image is uploaded and processed by our AI</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                        <div>
                          <h4 className="text-white font-medium">Transformation Complete</h4>
                          <p className="text-gray-300 text-sm">Studio Ghibli transformation is generated</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                        <div>
                          <h4 className="text-white font-medium">Automatic Deletion</h4>
                          <p className="text-gray-300 text-sm">Original image permanently deleted within 30 seconds</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                        <div>
                          <h4 className="text-white font-medium">Verification</h4>
                          <p className="text-gray-300 text-sm">Deletion confirmed and logged for audit</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                      <h4 className="text-green-400 font-semibold mb-3">Deletion Verification</h4>
                      <p className="text-gray-200 leading-relaxed">
                        We maintain deletion logs (without image content) to verify that our automatic deletion system 
                        is working correctly. These logs contain only timestamps and file identifiers, never image content 
                        or metadata.
                      </p>
                    </div>
                  </div>
                </section>

                {/* EXIF Removal */}
                <section id="exif-removal">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FileX className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">EXIF Metadata Removal</h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-white mb-4">What is EXIF Data?</h3>
                    <p className="text-gray-200 leading-relaxed mb-6">
                      EXIF (Exchangeable Image File Format) data is metadata embedded in photos that can contain sensitive 
                      information including GPS coordinates, camera settings, timestamps, and device information. This data 
                      can compromise your privacy if not properly handled.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                        <h4 className="text-red-400 font-semibold mb-3">EXIF Can Contain:</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• GPS coordinates (exact location)</li>
                          <li>• Date and time taken</li>
                          <li>• Camera make and model</li>
                          <li>• Camera settings</li>
                          <li>• Software used</li>
                          <li>• Copyright information</li>
                        </ul>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                        <h4 className="text-green-400 font-semibold mb-3">We Automatically Remove:</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• All location data</li>
                          <li>• Timestamp information</li>
                          <li>• Device identifiers</li>
                          <li>• Camera information</li>
                          <li>• Software details</li>
                          <li>• Any personal metadata</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4">Automatic Stripping Process</h3>
                    <p className="text-gray-200 leading-relaxed mb-4">
                      Before any processing begins, we automatically strip all EXIF metadata from your uploaded images. 
                      This happens immediately upon upload, ensuring that no sensitive information is processed or stored 
                      on our servers.
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                      <h4 className="text-blue-400 font-semibold mb-3">Privacy Protection</h4>
                      <p className="text-gray-200 leading-relaxed">
                        By removing EXIF data, we ensure that your transformed images contain no traces of when or where 
                        they were taken, what device was used, or any other potentially identifying information. This 
                        protection is automatic and cannot be disabled.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Data Usage */}
                <section id="data-usage">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">How We Use Your Data</h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3">Service Operation</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• Account management</li>
                          <li>• Image processing</li>
                          <li>• Usage tracking</li>
                          <li>• Support services</li>
                        </ul>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3">Analytics</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• Performance monitoring</li>
                          <li>• Usage patterns (anonymized)</li>
                          <li>• Error tracking</li>
                          <li>• Service improvements</li>
                        </ul>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3">Communication</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• Account notifications</li>
                          <li>• Support responses</li>
                          <li>• Service updates</li>
                          <li>• Security alerts</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                      <h4 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        What We Never Do
                      </h4>
                      <ul className="text-gray-200 space-y-2">
                        <li>• Sell your data to third parties</li>
                        <li>• Use your images for training AI models</li>
                        <li>• Share your personal information for marketing</li>
                        <li>• Store your images permanently</li>
                        <li>• Access your images for any purpose other than processing</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* User Rights */}
                <section id="user-rights">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Your Rights & Controls</h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-200 leading-relaxed mb-6">
                      You have complete control over your data and privacy settings. Here are your rights and how to exercise them:
                    </p>

                    <div className="space-y-6">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-400" />
                          Right to Access
                        </h4>
                        <p className="text-gray-300 text-sm mb-3">
                          You can request a copy of all personal data we hold about you.
                        </p>
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                          Request Data Export →
                        </button>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-red-400" />
                          Right to Deletion
                        </h4>
                        <p className="text-gray-300 text-sm mb-3">
                          You can request deletion of your account and all associated data.
                        </p>
                        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                          Delete Account →
                        </button>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-purple-400" />
                          Privacy Controls
                        </h4>
                        <p className="text-gray-300 text-sm mb-3">
                          Manage your privacy settings and data sharing preferences.
                        </p>
                        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                          Privacy Settings →
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Third Party Services */}
                <section id="third-party">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Third-Party Services</h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-200 leading-relaxed mb-6">
                      We work with trusted third-party services to provide our platform. Here's what they do and how 
                      your data is protected:
                    </p>

                    <div className="space-y-6">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3">Payment Processing</h4>
                        <p className="text-gray-300 text-sm mb-3">
                          <strong>Stripe & Razorpay:</strong> Handle subscription payments securely. They receive only 
                          necessary billing information and are PCI DSS compliant.
                        </p>
                        <div className="text-xs text-gray-400">
                          Data shared: Email, billing address, payment method
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3">Infrastructure</h4>
                        <p className="text-gray-300 text-sm mb-3">
                          <strong>Supabase:</strong> Provides secure database and authentication services with 
                          enterprise-grade security and compliance.
                        </p>
                        <div className="text-xs text-gray-400">
                          Data shared: Account information, usage data (no images)
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3">Analytics</h4>
                        <p className="text-gray-300 text-sm mb-3">
                          <strong>Privacy-focused analytics:</strong> We use anonymized analytics to improve our service. 
                          No personal information or images are shared.
                        </p>
                        <div className="text-xs text-gray-400">
                          Data shared: Anonymized usage patterns, performance metrics
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Security */}
                <section id="security">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Security Measures</h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3">Data in Transit</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• TLS 1.3 encryption</li>
                          <li>• HTTPS everywhere</li>
                          <li>• Certificate pinning</li>
                          <li>• Secure API endpoints</li>
                        </ul>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-3">Data at Rest</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• AES-256 encryption</li>
                          <li>• Encrypted databases</li>
                          <li>• Secure key management</li>
                          <li>• Regular security audits</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-6">
                      <h4 className="text-blue-400 font-semibold mb-3">Access Controls</h4>
                      <p className="text-gray-200 leading-relaxed">
                        We implement strict access controls with multi-factor authentication, role-based permissions, 
                        and regular access reviews. Only authorized personnel can access systems, and all access is logged 
                        and monitored.
                      </p>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                      <h4 className="text-green-400 font-semibold mb-3">Monitoring & Response</h4>
                      <p className="text-gray-200 leading-relaxed">
                        We continuously monitor our systems for security threats and have incident response procedures 
                        in place. Any security incidents are immediately investigated and users are notified if their 
                        data may have been affected.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Contact */}
                <section id="contact">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Contact Information</h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-200 leading-relaxed mb-6">
                      If you have any questions about this privacy policy or our data practices, please contact us:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-4">Privacy Officer</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300">privacy@imaginai.com</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300">+91 (555) 123-4567</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-purple-400 mt-0.5" />
                            <span className="text-gray-300">
                              ImaginAI Privacy Team<br />
                              123 Tech Street<br />
                              Bangalore, KA 560001<br />
                              India
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-white font-semibold mb-4">Response Times</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">Privacy inquiries: 24-48 hours</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300">Data requests: 5-7 business days</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-orange-400" />
                            <span className="text-gray-300">Account deletion: 1-2 business days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 mt-6">
                      <h4 className="text-purple-400 font-semibold mb-3">Policy Updates</h4>
                      <p className="text-gray-200 leading-relaxed">
                        We may update this privacy policy from time to time. When we do, we'll notify you via email 
                        and update the "Last updated" date at the top of this page. Continued use of our service 
                        after changes constitutes acceptance of the updated policy.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg z-50 animate-scale-in"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default PrivacyPage;