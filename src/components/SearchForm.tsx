import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  onSearch: (params: { category: string; location: string }) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category.trim() && location.trim()) {
      onSearch({ category: category.trim(), location: location.trim() });
    }
  };

  const popularCategories = [
    'Restaurants', 'Plumbers', 'Electricians', 'Dentists', 
    'Lawyers', 'Real Estate', 'Hair Salons', 'Auto Repair',
    'Veterinarians', 'Accountants', 'Insurance', 'Contractors'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Restaurants, Plumbers, Dentists..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {popularCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Manewada, Nagpur, Maharashtra, India"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter any location - city, area, state, country or full address
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !category.trim() || !location.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          <Search className="w-5 h-5 mr-2" />
          {isLoading ? 'Searching...' : 'Search Businesses'}
        </button>
      </form>
    </div>
  );
};
