import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Hash, Check } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export interface Tag {
  id: string;
  label: string;
  color?: string;
  category?: string;
}

interface TagManagerProps {
  tags: Tag[];
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  suggestions?: Tag[];
  allowCreate?: boolean;
  onCreate?: (label: string) => void;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

const predefinedColors = [
  { name: 'Green', value: 'bg-[#1CE479]/20 text-[#1CE479] border-[#1CE479]' },
  { name: 'Blue', value: 'bg-blue-500/20 text-blue-400 border-blue-500' },
  { name: 'Purple', value: 'bg-purple-500/20 text-purple-400 border-purple-500' },
  { name: 'Pink', value: 'bg-pink-500/20 text-pink-400 border-pink-500' },
  { name: 'Orange', value: 'bg-orange-500/20 text-orange-400 border-orange-500' },
  { name: 'Red', value: 'bg-red-500/20 text-red-400 border-red-500' },
  { name: 'Yellow', value: 'bg-yellow-500/20 text-yellow-400 border-yellow-500' },
  { name: 'Cyan', value: 'bg-cyan-500/20 text-cyan-400 border-cyan-500' },
];

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  selectedTags,
  onTagsChange,
  suggestions = [],
  allowCreate = true,
  onCreate,
  maxTags,
  placeholder = 'Add tags...',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  const filteredSuggestions = [
    ...tags.filter(tag => 
      !selectedTags.includes(tag.id) &&
      tag.label.toLowerCase().includes(inputValue.toLowerCase())
    ),
    ...suggestions.filter(tag =>
      !selectedTags.includes(tag.id) &&
      tag.label.toLowerCase().includes(inputValue.toLowerCase())
    ),
  ].slice(0, 8);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (tag: Tag) => {
    if (maxTags && selectedTags.length >= maxTags) {
      return;
    }

    if (!selectedTags.includes(tag.id)) {
      onTagsChange([...selectedTags, tag.id]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleCreateTag = () => {
    if (inputValue.trim() && allowCreate && onCreate) {
      onCreate(inputValue.trim());
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        handleAddTag(filteredSuggestions[highlightedIndex]);
      } else if (inputValue.trim() && allowCreate) {
        handleCreateTag();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      // Remove last tag when backspace on empty input
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const getColorClass = (tag: Tag) => {
    if (tag.color) {
      const color = predefinedColors.find(c => c.name.toLowerCase() === tag.color?.toLowerCase());
      return color?.value || predefinedColors[0].value;
    }
    return predefinedColors[0].value;
  };

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id));

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Selected Tags + Input */}
      <div
        className={`
          flex flex-wrap items-center gap-2 p-3 
          bg-[#1A1A20] border-2 border-[#2A2A30] rounded-xl
          focus-within:border-[#1CE479] transition-colors
          ${maxTags && selectedTags.length >= maxTags ? 'opacity-50' : ''}
        `}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected Tags */}
        {selectedTagObjects.map(tag => (
          <Badge
            key={tag.id}
            variant="outline"
            className={`
              ${getColorClass(tag)}
              border pl-2 pr-1 py-1 flex items-center gap-1
            `}
          >
            <Hash className="w-3 h-3" />
            <span>{tag.label}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(tag.id);
              }}
              className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        {/* Input */}
        {(!maxTags || selectedTags.length < maxTags) && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedTags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-white placeholder:text-gray-500"
          />
        )}
      </div>

      {/* Max Tags Indicator */}
      {maxTags && (
        <div className="text-xs text-gray-500 mt-1">
          {selectedTags.length} / {maxTags} tags
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (inputValue || filteredSuggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1A20] border-2 border-[#2A2A30] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto">
            {/* Filtered Suggestions */}
            {filteredSuggestions.map((tag, index) => (
              <button
                key={tag.id}
                onClick={() => handleAddTag(tag)}
                className={`
                  w-full px-4 py-2.5 flex items-center gap-3 text-left
                  transition-colors
                  ${highlightedIndex === index
                    ? 'bg-[#2A2A30]'
                    : 'hover:bg-[#2A2A30]'
                  }
                `}
              >
                <Hash className={`w-4 h-4 ${getColorClass(tag).split(' ').find(c => c.startsWith('text-'))}`} />
                <span className="flex-1 text-white">{tag.label}</span>
                {tag.category && (
                  <span className="text-xs text-gray-500">{tag.category}</span>
                )}
                {selectedTags.includes(tag.id) && (
                  <Check className="w-4 h-4 text-[#1CE479]" />
                )}
              </button>
            ))}

            {/* Create New Tag */}
            {allowCreate && inputValue && !tags.some(t => t.label.toLowerCase() === inputValue.toLowerCase()) && (
              <button
                onClick={handleCreateTag}
                className="w-full px-4 py-2.5 flex items-center gap-3 text-left border-t border-[#2A2A30] bg-[#151518] hover:bg-[#2A2A30] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#1CE479]" />
                <span className="text-white">
                  Create "<span className="text-[#1CE479]">{inputValue}</span>"
                </span>
              </button>
            )}

            {/* No Results */}
            {filteredSuggestions.length === 0 && !allowCreate && (
              <div className="px-4 py-8 text-center text-gray-500">
                No tags found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Tag Input (just displays tags, no suggestions)
export const TagInput: React.FC<{
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}> = ({ tags, onChange, placeholder = 'Add tags...', maxTags, className = '' }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!maxTags || tags.length < maxTags) {
        if (!tags.includes(inputValue.trim())) {
          onChange([...tags, inputValue.trim()]);
        }
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleRemove = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#1A1A20] border-2 border-[#2A2A30] rounded-xl focus-within:border-[#1CE479] transition-colors">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-[#1CE479]/20 text-[#1CE479] border-[#1CE479] pl-2 pr-1 py-1 flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        {(!maxTags || tags.length < maxTags) && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-white placeholder:text-gray-500"
          />
        )}
      </div>
      
      {maxTags && (
        <div className="text-xs text-gray-500 mt-1">
          {tags.length} / {maxTags} tags
        </div>
      )}
    </div>
  );
};
