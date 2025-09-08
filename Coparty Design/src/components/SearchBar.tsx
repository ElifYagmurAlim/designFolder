'use client';
import React, { useState, useCallback } from 'react';
import { Search, Send, Filter, X, MapPin, Briefcase } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  onFilterChange?: (filters: FilterOptions) => void;
  viewMode?: 'profiles' | 'projects';
}

interface FilterOptions {
  category?: string;
  location?: string;
  skills?: string[];
}

export default function SearchBar({ 
  onSearch, 
  isLoading = false, 
  placeholder = "What are you looking for?",
  onFilterChange,
  viewMode = 'profiles'
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showFilters && !target.closest('.search-bar-container')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  // Reset filters when view mode changes
  React.useEffect(() => {
    setFilters({});
    setShowFilters(false);
    // Don't call onFilterChange here to prevent infinite loop
    // The parent component should handle view mode changes separately
  }, [viewMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = useCallback((key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }, [filters, onFilterChange]);

  const clearFilters = useCallback(() => {
    setFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onFilterChange]);

  const hasActiveFilters = Object.values(filters).some(value => 
    value && (Array.isArray(value) ? value.length > 0 : true)
  );

  // Profile-specific categories
  const profileCategories = [
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'development', label: 'Development', icon: '💻' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'creative', label: 'Creative', icon: '✨' },
    { value: 'content', label: 'Content', icon: '📝' },
    { value: 'analytics', label: 'Analytics', icon: '📊' },
    { value: 'product', label: 'Product', icon: '🚀' }
  ];

  // Project-specific categories
  const projectCategories = [
    { value: 'web-app', label: 'Web Application', icon: '🌐' },
    { value: 'mobile-app', label: 'Mobile Application', icon: '📱' },
    { value: 'design-project', label: 'Design Project', icon: '🎨' },
    { value: 'marketing-campaign', label: 'Marketing Campaign', icon: '📢' },
    { value: 'business-strategy', label: 'Business Strategy', icon: '💼' },
    { value: 'content-creation', label: 'Content Creation', icon: '📝' },
    { value: 'research', label: 'Research', icon: '🔬' },
    { value: 'consulting', label: 'Consulting', icon: '💡' }
  ];

  const currentCategories = viewMode === 'profiles' ? profileCategories : projectCategories;

  return (
    <div className="w-full relative search-bar-container">
      <form onSubmit={handleSubmit} className="relative" noValidate>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-12 pr-20 md:pr-16 py-5 md:py-4 bg-black border border-[#333333] rounded-2xl text-white placeholder-[#666666] focus:outline-none focus:border-[#316afd] focus:ring-2 focus:ring-[#316afd]/20 transition-all duration-200 text-lg md:text-lg text-center"
          />

          {/* Filter Icon */}
          <button
            type="button"
            onClick={handleFilterClick}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 hover:bg-[#222222] z-20 ${
              hasActiveFilters ? 'text-[#316afd]' : 'text-[#666666]'
            } ${showFilters ? 'bg-[#222222]' : ''}`}
          >
            <Filter className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 md:p-2 bg-[#316afd] hover:bg-[#3a76ff] disabled:bg-[#222222] disabled:text-[#666666] text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111111] border border-[#333333] rounded-xl p-4 shadow-xl z-[9999] w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {viewMode === 'profiles' ? 'Profile Filters' : 'Project Filters'}
            </h3>
            <button
              onClick={handleFilterClick}
              className="p-1 rounded-lg hover:bg-[#222222] transition-colors"
            >
              <X className="w-5 h-5 text-[#666666]" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-[#cccccc] mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {viewMode === 'profiles' ? 'Expertise Area' : 'Project Category'}
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="w-full p-3 bg-[#222222] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd]"
              >
                <option value="">All categories</option>
                {currentCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-[#cccccc] mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <input
                type="text"
                placeholder="City or country"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                className="w-full p-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#316afd]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex-1 p-3 bg-[#222222] border border-[#333333] rounded-lg text-[#cccccc] hover:text-white hover:bg-[#333333] transition-all duration-200"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 p-3 bg-[#316afd] hover:bg-[#3a76ff] border border-[#316afd] text-white rounded-lg transition-all duration-200 font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}