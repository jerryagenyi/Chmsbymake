import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Heart, Smile, Meh, Frown } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface RatingProps {
  value?: number;
  onChange: (value: number) => void;
  max?: number;
  variant?: 'stars' | 'thumbs' | 'emoji' | 'hearts';
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  max = 5,
  variant = 'stars',
  size = 'md',
  readonly = false,
  showValue = false,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const iconSize = sizeClasses[size];

  const handleClick = (rating: number) => {
    if (!readonly) {
      onChange(rating);
    }
  };

  const renderStars = () => (
    <div className={`flex gap-1 ${className}`}>
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = ratingValue <= (hoverValue ?? value);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => !readonly && setHoverValue(ratingValue)}
            onMouseLeave={() => !readonly && setHoverValue(null)}
            disabled={readonly}
            className={`
              transition-all duration-200
              ${!readonly && 'hover:scale-110 cursor-pointer'}
              ${readonly && 'cursor-default'}
            `}
          >
            <Star
              className={`
                ${iconSize}
                ${isFilled
                  ? 'fill-[#1CE479] text-[#1CE479]'
                  : 'fill-transparent text-gray-500'
                }
                transition-colors duration-200
              `}
            />
          </button>
        );
      })}
      {showValue && value > 0 && (
        <span className="ml-2 text-sm text-gray-400">
          {value}/{max}
        </span>
      )}
    </div>
  );

  const renderThumbs = () => (
    <div className={`flex gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => handleClick(1)}
        disabled={readonly}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${value === 1
            ? 'bg-[#1CE479]/20 text-[#1CE479]'
            : 'bg-[#2A2A30] text-gray-500 hover:text-[#1CE479]'
          }
          ${!readonly && 'hover:scale-110'}
        `}
      >
        <ThumbsUp className={iconSize} />
      </button>
      <button
        type="button"
        onClick={() => handleClick(-1)}
        disabled={readonly}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${value === -1
            ? 'bg-red-500/20 text-red-500'
            : 'bg-[#2A2A30] text-gray-500 hover:text-red-500'
          }
          ${!readonly && 'hover:scale-110'}
        `}
      >
        <ThumbsDown className={iconSize} />
      </button>
    </div>
  );

  const renderEmojis = () => {
    const emojis = [
      { icon: Frown, value: 1, color: 'text-red-500', label: 'Poor' },
      { icon: Meh, value: 2, color: 'text-orange-500', label: 'Fair' },
      { icon: Smile, value: 3, color: 'text-[#1CE479]', label: 'Good' },
    ];

    return (
      <div className={`flex gap-3 ${className}`}>
        {emojis.map((emoji) => {
          const Icon = emoji.icon;
          const isSelected = value === emoji.value;

          return (
            <button
              key={emoji.value}
              type="button"
              onClick={() => handleClick(emoji.value)}
              disabled={readonly}
              title={emoji.label}
              className={`
                p-3 rounded-lg transition-all duration-200
                ${isSelected
                  ? `bg-opacity-20 ${emoji.color}`
                  : 'bg-[#2A2A30] text-gray-500'
                }
                ${!readonly && 'hover:scale-110'}
              `}
            >
              <Icon
                className={`
                  ${iconSize}
                  ${isSelected ? emoji.color : ''}
                `}
              />
            </button>
          );
        })}
      </div>
    );
  };

  const renderHearts = () => (
    <div className={`flex gap-1 ${className}`}>
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = ratingValue <= (hoverValue ?? value);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => !readonly && setHoverValue(ratingValue)}
            onMouseLeave={() => !readonly && setHoverValue(null)}
            disabled={readonly}
            className={`
              transition-all duration-200
              ${!readonly && 'hover:scale-110 cursor-pointer'}
            `}
          >
            <Heart
              className={`
                ${iconSize}
                ${isFilled
                  ? 'fill-red-500 text-red-500'
                  : 'fill-transparent text-gray-500'
                }
                transition-colors duration-200
              `}
            />
          </button>
        );
      })}
    </div>
  );

  switch (variant) {
    case 'thumbs':
      return renderThumbs();
    case 'emoji':
      return renderEmojis();
    case 'hearts':
      return renderHearts();
    default:
      return renderStars();
  }
};

// Feedback Form Component
interface FeedbackFormProps {
  onSubmit: (data: { rating: number; comment: string; category?: string }) => void | Promise<void>;
  categories?: string[];
  ratingLabel?: string;
  commentLabel?: string;
  submitLabel?: string;
  showCategories?: boolean;
  variant?: 'stars' | 'thumbs' | 'emoji';
  className?: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  categories = ['Service Quality', 'Worship', 'Teaching', 'Fellowship', 'Facilities'],
  ratingLabel = 'How would you rate this?',
  commentLabel = 'Additional comments (optional)',
  submitLabel = 'Submit Feedback',
  showCategories = true,
  variant = 'stars',
  className = '',
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        comment,
        category: showCategories ? category : undefined,
      });
      setSubmitted(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setRating(0);
        setComment('');
        setCategory('');
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`bg-[#1A1A20] border border-[#1CE479] rounded-xl p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-[#1CE479]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-[#1CE479] fill-[#1CE479]" />
        </div>
        <h3 className="text-white mb-2">Thank you for your feedback!</h3>
        <p className="text-gray-400">Your input helps us improve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6 space-y-6 ${className}`}>
      {/* Category Selection */}
      {showCategories && (
        <div>
          <label className="block text-sm text-gray-400 mb-3">
            What would you like to rate?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`
                  px-3 py-2 text-sm rounded-lg border transition-colors
                  ${category === cat
                    ? 'border-[#1CE479] bg-[#1CE479]/10 text-[#1CE479]'
                    : 'border-[#2A2A30] text-gray-400 hover:border-[#1CE479]/50'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm text-gray-400 mb-3">
          {ratingLabel}
        </label>
        <Rating
          value={rating}
          onChange={setRating}
          variant={variant}
          size="lg"
          showValue
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm text-gray-400 mb-3">
          {commentLabel}
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="bg-[#0A0A0F] border-[#2A2A30] text-white min-h-[100px] resize-none focus:border-[#1CE479]"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="w-full bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
      >
        {isSubmitting ? 'Submitting...' : submitLabel}
      </Button>
    </form>
  );
};

// Quick Reaction Buttons
export const QuickReaction: React.FC<{
  reactions: Array<{ emoji: string; label: string; count: number }>;
  onReact: (label: string) => void;
  userReaction?: string;
  className?: string;
}> = ({ reactions, onReact, userReaction, className = '' }) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {reactions.map((reaction) => {
      const isActive = userReaction === reaction.label;
      
      return (
        <button
          key={reaction.label}
          onClick={() => onReact(reaction.label)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
            border transition-all duration-200
            ${isActive
              ? 'border-[#1CE479] bg-[#1CE479]/10 text-[#1CE479] scale-105'
              : 'border-[#2A2A30] text-gray-400 hover:border-[#1CE479]/50 hover:scale-105'
            }
          `}
          title={reaction.label}
        >
          <span className="text-base">{reaction.emoji}</span>
          <span>{reaction.count > 0 && reaction.count}</span>
        </button>
      );
    })}
  </div>
);
