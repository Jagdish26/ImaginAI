import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface FileCountdownProps {
  deletesAt: Date;
  onExpired?: () => void;
}

const FileCountdown: React.FC<FileCountdownProps> = ({ deletesAt, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const deleteTime = deletesAt.getTime();
      const difference = deleteTime - now;

      if (difference <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        onExpired?.();
      } else {
        setTimeLeft(difference);
        setIsExpired(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [deletesAt, onExpired]);

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  const getUrgencyLevel = (ms: number): { level: 'safe' | 'warning' | 'danger'; color: string } => {
    const seconds = ms / 1000;
    if (seconds > 20) return { level: 'safe', color: 'text-emerald-400' };
    if (seconds > 10) return { level: 'warning', color: 'text-amber-400' };
    return { level: 'danger', color: 'text-red-400' };
  };

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-inter">Deleted</span>
      </div>
    );
  }

  const urgency = getUrgencyLevel(timeLeft);

  return (
    <div className={`flex items-center gap-2 ${urgency.color} transition-colors duration-300 font-inter`}>
      {urgency.level === 'danger' ? (
        <AlertTriangle className={`w-4 h-4 ${urgency.level === 'danger' ? 'animate-pulse' : ''}`} />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <div className="text-center">
        <div className={`text-sm font-mono ${urgency.level === 'danger' ? 'animate-pulse' : ''}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="text-xs opacity-75">until deletion</div>
      </div>
    </div>
  );
};

export default FileCountdown;