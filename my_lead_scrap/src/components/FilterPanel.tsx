import React from 'react';
import { SearchFilters } from '../types';
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  resultCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  resultCount 
}) => {
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        <span className="text-sm text-gray-600">
          {resultCount} results
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <select
            value={filters.hasWebsite || 'all'}
            onChange={(e) => handleFilterChange('hasWebsite', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="yes">Has Website</option>
            <option value="no">No Website</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <select
            value={filters.hasEmail || 'all'}
            onChange={(e) => handleFilterChange('hasEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="yes">Has Email</option>
            <option value="no">No Email</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <select
            value={filters.hasPhone || 'all'}
            onChange={(e) => handleFilterChange('hasPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="yes">Has Phone</option>
            <option value="no">No Phone</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Rating
          </label>
          <select
            value={filters.minRating || 0}
            onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Any Rating</option>
            <option value={1}>1+ Stars</option>
            <option value={2}>2+ Stars</option>
            <option value={3}>3+ Stars</option>
            <option value={3.5}>3.5+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => onFiltersChange({
          hasWebsite: 'all',
          hasEmail: 'all',
          hasPhone: 'all',
          minRating: 0,
          maxRating: 5
        })}
        className="mt-4 text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};
