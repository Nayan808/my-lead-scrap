import { useState, useEffect } from 'react';
import { SearchForm } from './components/SearchForm';
import { FilterPanel } from './components/FilterPanel';
import { BusinessTable } from './components/BusinessTable';
import { ExportButton } from './components/ExportButton';
import { GooglePlacesService } from './services/api';
import { EmailExtractor } from './services/emailExtractor';
import { Business, SearchFilters, SearchParams } from './types';
import { FileText, Settings } from 'lucide-react';

function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtractingEmails, setIsExtractingEmails] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    hasWebsite: 'all',
    hasEmail: 'all',
    hasPhone: 'all',
    minRating: 0,
    maxRating: 5
  });
  const businessService = new GooglePlacesService();

  useEffect(() => {
    applyFilters();
  }, [businesses, filters]);

  const applyFilters = () => {
    let filtered = [...businesses];

    if (filters.hasWebsite !== 'all') {
      filtered = filtered.filter(b =>
        filters.hasWebsite === 'yes' ? b.hasWebsite : !b.hasWebsite
      );
    }

    if (filters.hasEmail !== 'all') {
      filtered = filtered.filter(b =>
        filters.hasEmail === 'yes' ? b.hasEmail : !b.hasEmail
      );
    }

    if (filters.hasPhone !== 'all') {
      filtered = filtered.filter(b =>
        filters.hasPhone === 'yes' ? b.hasPhone : !b.hasPhone
      );
    }

    if (filters.minRating !== undefined && filters.minRating > 0) {
      filtered = filtered.filter(b => b.rating >= filters.minRating!);
    }

    if (filters.maxRating !== undefined && filters.maxRating < 5) {
      filtered = filtered.filter(b => b.rating <= filters.maxRating!);
    }

    setFilteredBusinesses(filtered);
  };

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    try {
      const results = await businessService.searchBusinesses(params);
      setBusinesses(results);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractEmails = async () => {
    setIsExtractingEmails(true);
    try {
      const updatedBusinesses = await EmailExtractor.extractEmailsFromMultipleWebsites(businesses);
      setBusinesses(updatedBusinesses);
    } catch (error) {
      console.error('Email extraction failed:', error);
      alert('Email extraction failed for some businesses.');
    } finally {
      setIsExtractingEmails(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                GMB Audit & Lead Scraper
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          {businesses.length > 0 && (
            <>
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredBusinesses.length}
              />

              <div className="flex justify-end">
                <ExportButton businesses={filteredBusinesses} />
              </div>

              <BusinessTable
                businesses={filteredBusinesses}
                onExtractEmails={handleExtractEmails}
                isExtractingEmails={isExtractingEmails}
              />
            </>
          )}

          {businesses.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start Your GMB Audit
              </h3>
              <p className="text-gray-500">
                Search for businesses by category and location to begin auditing their Google My Business profiles.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
