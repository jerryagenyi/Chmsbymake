import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Mic, Clock, TrendingUp, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
  category?: string;
}

interface EnhancedSearchProps {
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  onSearch: (query: string, filters?: Record<string, any>) => void;
  onVoiceSearch?: () => void;
  showFilters?: boolean;
  filters?: React.ReactNode;
  className?: string;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = 'Search members, donations, events...',
  suggestions = [],
  recentSearches = [],
  onSearch,
  onVoiceSearch,
  showFilters = false,
  filters,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const combinedSuggestions: SearchSuggestion[] = [
    ...recentSearches.map((text, idx) => ({
      id: `recent-${idx}`,
      text,
      type: 'recent' as const,
    })),
    ...suggestions,
  ];

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div
        className={`
          relative flex items-center gap-2 bg-[#1A1A20] border-2 rounded-xl
          transition-all duration-300
          ${isFocused ? 'border-[#1CE479] shadow-lg shadow-[#1CE479]/20' : 'border-[#2A2A30]'}
        `}
      >
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-12 pr-24 h-14 bg-transparent border-0 focus:ring-0 text-white placeholder:text-gray-500"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-[#2A2A30]"
            >
              <X className="w-4 h-4 text-gray-400" />
            </Button>
          )}

          {onVoiceSearch && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onVoiceSearch}
              className="h-8 w-8 p-0 hover:bg-[#2A2A30] group"
              title="Voice Search"
            >
              <Mic className="w-4 h-4 text-gray-400 group-hover:text-[#1CE479]" />
            </Button>
          )}

          {showFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`h-8 w-8 p-0 hover:bg-[#2A2A30] ${showFilterPanel ? 'bg-[#2A2A30]' : ''}`}
              title="Filters"
            >
              <Filter className={`w-4 h-4 ${showFilterPanel ? 'text-[#1CE479]' : 'text-gray-400'}`} />
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (isFocused || query) && combinedSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1A20] border-2 border-[#2A2A30] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-96 overflow-y-auto">
            {combinedSuggestions.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#2A2A30] transition-colors text-left group"
              >
                {suggestion.type === 'recent' && (
                  <Clock className="w-4 h-4 text-gray-500 group-hover:text-[#1CE479]" />
                )}
                {suggestion.type === 'trending' && (
                  <TrendingUp className="w-4 h-4 text-gray-500 group-hover:text-[#1CE479]" />
                )}
                {suggestion.type === 'suggestion' && (
                  <Search className="w-4 h-4 text-gray-500 group-hover:text-[#1CE479]" />
                )}
                
                <div className="flex-1">
                  <div className="text-white group-hover:text-[#1CE479] transition-colors">
                    {suggestion.text}
                  </div>
                  {suggestion.category && (
                    <div className="text-xs text-gray-500 mt-0.5">{suggestion.category}</div>
                  )}
                </div>

                {suggestion.type === 'recent' && (
                  <X className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>

          {query && (
            <div className="border-t border-[#2A2A30] p-3 bg-[#151518]">
              <button
                onClick={() => handleSearch(query)}
                className="w-full px-4 py-2 bg-[#1CE479] text-[#0A0A0F] rounded-lg hover:bg-[#1CE479]/90 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search for "{query}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && filters && (
        <div className="absolute z-40 w-full mt-2 bg-[#1A1A20] border-2 border-[#2A2A30] rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {filters}
        </div>
      )}
    </div>
  );
};
