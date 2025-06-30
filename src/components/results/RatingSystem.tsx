import React, { useState } from 'react';
import { Star, Heart, ThumbsUp, Send } from 'lucide-react';

interface RatingSystemProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  transformationId: string;
}

const RatingSystem: React.FC<RatingSystemProps> = ({
  rating,
  onRatingChange,
  transformationId
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleRatingClick = (newRating: number) => {
    onRatingChange(newRating);
  };

  const handleSubmitFeedback = async () => {
    if (!rating || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHasSubmitted(true);
    setIsSubmitting(false);
    
    // Reset after showing success
    setTimeout(() => {
      setHasSubmitted(false);
      setFeedback('');
    }, 3000);
  };

  const getRatingText = (stars: number): string => {
    switch (stars) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate this transformation';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5" />
        Rate Your Result
      </h3>

      {hasSubmitted ? (
        <div className="text-center py-6 animate-scale-in">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Thank You!</h4>
          <p className="text-gray-200 text-sm">Your feedback helps us improve our AI models</p>
        </div>
      ) : (
        <>
          {/* Star Rating */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all duration-200 transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 transition-all duration-200 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Rating Text */}
          <div className="text-center mb-4">
            <p className="text-white font-medium">
              {getRatingText(hoveredRating || rating)}
            </p>
            {rating > 0 && (
              <p className="text-gray-300 text-sm mt-1">
                {rating} out of 5 stars
              </p>
            )}
          </div>

          {/* Feedback Input */}
          {rating > 0 && (
            <div className="space-y-4 animate-slide-in">
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Tell us more (optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What did you like about this transformation? Any suggestions for improvement?"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:border-purple-400 transition-colors"
                  rows={3}
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {feedback.length}/500
                </div>
              </div>

              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          )}

          {/* Quick Feedback Buttons */}
          {rating === 0 && (
            <div className="space-y-3">
              <p className="text-gray-300 text-sm text-center">Quick feedback:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleRatingClick(5)}
                  className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 py-2 px-3 rounded-xl transition-all duration-200 text-sm"
                >
                  Love it! ❤️
                </button>
                <button
                  onClick={() => handleRatingClick(4)}
                  className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 px-3 rounded-xl transition-all duration-200 text-sm"
                >
                  Pretty good 👍
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RatingSystem;