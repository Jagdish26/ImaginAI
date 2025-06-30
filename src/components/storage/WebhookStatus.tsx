import React from 'react';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface WebhookStatusProps {
  status: 'pending' | 'success' | 'failed' | 'retrying';
  className?: string;
}

const WebhookStatus: React.FC<WebhookStatusProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/30',
          text: 'Webhook Success'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-amber-400',
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/30',
          text: 'Webhook Pending'
        };
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          text: 'Webhook Failed'
        };
      case 'retrying':
        return {
          icon: RefreshCw,
          color: 'text-blue-400',
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          text: 'Retrying...'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-400',
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30',
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border ${config.bg} ${config.border} ${className} font-inter transition-all duration-200`}>
      <Icon className={`w-3 h-3 ${config.color} ${status === 'retrying' ? 'animate-spin' : ''}`} />
      <span className={`text-xs ${config.color}`}>{config.text}</span>
    </div>
  );
};

export default WebhookStatus;