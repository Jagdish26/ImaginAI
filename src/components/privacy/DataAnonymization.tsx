import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Hash, 
  Shuffle, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Zap,
  Database,
  FileX
} from 'lucide-react';

interface AnonymizationProcess {
  step: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

interface DataCategory {
  name: string;
  description: string;
  anonymized: boolean;
  methods: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const DataAnonymization: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeProcess, setActiveProcess] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const anonymizationProcesses: AnonymizationProcess[] = [
    {
      step: 'EXIF Data Removal',
      description: 'Strip all metadata from uploaded images',
      status: 'completed',
      icon: FileX,
      details: [
        'GPS coordinates removed',
        'Camera information stripped',
        'Timestamp data deleted',
        'Device identifiers removed',
        'Software information cleared'
      ]
    },
    {
      step: 'Image Hashing',
      description: 'Generate unique identifiers without storing content',
      status: 'completed',
      icon: Hash,
      details: [
        'Perceptual hash generation',
        'Content-based fingerprinting',
        'Duplicate detection',
        'No reverse engineering possible',
        'Privacy-preserving identification'
      ]
    },
    {
      step: 'Data Pseudonymization',
      description: 'Replace identifiable information with pseudonyms',
      status: 'completed',
      icon: Shuffle,
      details: [
        'User ID pseudonymization',
        'Session token anonymization',
        'IP address masking',
        'Timestamp fuzzing',
        'Reversible only with key'
      ]
    },
    {
      step: 'Aggregation & Generalization',
      description: 'Combine and generalize data for analytics',
      status: 'completed',
      icon: Database,
      details: [
        'Usage pattern aggregation',
        'Geographic generalization',
        'Time-based grouping',
        'Statistical noise addition',
        'K-anonymity compliance'
      ]
    }
  ];

  const dataCategories: DataCategory[] = [
    {
      name: 'Personal Images',
      description: 'Your uploaded photos and transformations',
      anonymized: true,
      methods: ['Automatic deletion', 'EXIF stripping', 'No permanent storage'],
      icon: Eye
    },
    {
      name: 'Usage Analytics',
      description: 'How you interact with our service',
      anonymized: true,
      methods: ['Data aggregation', 'User pseudonymization', 'Statistical noise'],
      icon: Zap
    },
    {
      name: 'Account Information',
      description: 'Your profile and subscription data',
      anonymized: false,
      methods: ['Encryption at rest', 'Access controls', 'Audit logging'],
      icon: Shield
    },
    {
      name: 'Error Logs',
      description: 'Technical logs for debugging',
      anonymized: true,
      methods: ['PII removal', 'Log sanitization', 'Retention limits'],
      icon: AlertTriangle
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Data Anonymization</h2>
              <p className="text-gray-300">How we protect your privacy through advanced anonymization techniques</p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-green-400 font-semibold">Privacy-First Approach</h3>
            </div>
            <p className="text-gray-200 leading-relaxed">
              We employ multiple layers of anonymization to ensure your personal data cannot be traced back to you. 
              Our systems are designed to protect your privacy while still allowing us to improve our service.
            </p>
          </div>
        </div>
      </div>

      {/* Anonymization Process */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Anonymization Process</h3>
        
        <div className="space-y-4">
          {anonymizationProcesses.map((process, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <process.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white mb-1">{process.step}</h4>
                  <p className="text-gray-300">{process.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              </div>

              <button
                onClick={() => setActiveProcess(activeProcess === index ? null : index)}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                {activeProcess === index ? 'Hide Details' : 'Show Details'}
              </button>

              {activeProcess === index && (
                <div className="mt-4 animate-slide-in">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h5 className="text-white font-medium mb-3">Implementation Details:</h5>
                    <ul className="space-y-2">
                      {process.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Categories */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Data Category Protection</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {dataCategories.map((category, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  category.anonymized 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{category.name}</h4>
                  <p className="text-gray-300 text-sm">{category.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  category.anonymized 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {category.anonymized ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Anonymized
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Encrypted
                    </>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-white font-medium mb-2 text-sm">Protection Methods:</h5>
                <ul className="space-y-1">
                  {category.methods.map((method, methodIndex) => (
                    <li key={methodIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{method}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Technical Implementation</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} Technical Details
          </button>
        </div>

        {showDetails && (
          <div className="space-y-6 animate-slide-in">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-purple-400" />
                  Hashing Algorithms
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• SHA-256 for data integrity</li>
                  <li>• Perceptual hashing for images</li>
                  <li>• HMAC for authenticated hashing</li>
                  <li>• Salt-based password hashing</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-blue-400" />
                  Pseudonymization
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Format-preserving encryption</li>
                  <li>• Deterministic pseudonyms</li>
                  <li>• Key rotation policies</li>
                  <li>• Reversible with proper authorization</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-400" />
                  Data Aggregation
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• K-anonymity compliance (k≥5)</li>
                  <li>• L-diversity implementation</li>
                  <li>• Differential privacy techniques</li>
                  <li>• Statistical noise injection</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-400" />
                  Encryption Standards
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• AES-256 for data at rest</li>
                  <li>• TLS 1.3 for data in transit</li>
                  <li>• End-to-end encryption</li>
                  <li>• Hardware security modules</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h4 className="text-blue-400 font-semibold mb-3">Compliance & Standards</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">GDPR</div>
                  <div className="text-xs text-gray-400">EU Data Protection</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">ISO 27001</div>
                  <div className="text-xs text-gray-400">Security Management</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">SOC 2</div>
                  <div className="text-xs text-gray-400">Security Controls</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-6">
        <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Benefits of Our Anonymization
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="text-white font-medium">Complete Privacy Protection</h5>
                <p className="text-gray-300 text-sm">Your personal data cannot be traced back to you</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="text-white font-medium">Regulatory Compliance</h5>
                <p className="text-gray-300 text-sm">Meets GDPR, CCPA, and other privacy regulations</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="text-white font-medium">Service Improvement</h5>
                <p className="text-gray-300 text-sm">Enables analytics while protecting your privacy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="text-white font-medium">Data Minimization</h5>
                <p className="text-gray-300 text-sm">We only process what's absolutely necessary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnonymization;