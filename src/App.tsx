import { useState, useEffect } from 'react';
import { SearchForm } from './components/SearchForm';
import { FilterPanel } from './components/FilterPanel';
import { BusinessTable } from './components/BusinessTable';
import { ExportButton } from './components/ExportButton';
import { MyDataTab } from './components/MyDataTab';
import { ConfirmedTab } from './components/ConfirmedTab';
import { GooglePlacesService } from './services/api';
import { EmailExtractor } from './services/emailExtractor';
import { Business, SearchFilters, SearchParams } from './types';
import { FileText, Settings, X, RotateCcw, Database, CheckCircle } from 'lucide-react';

function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtractingEmails, setIsExtractingEmails] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'mydata' | 'confirmed'>('search');
  const [lastSearchParams, setLastSearchParams] = useState<SearchParams | null>(null);
  const [confirmedCategoryFilter, setConfirmedCategoryFilter] = useState<string>('all');
  const [filters, setFilters] = useState<SearchFilters>({
    hasWebsite: 'all',
    hasEmail: 'all',
    hasPhone: 'all',
    minRating: 0,
    maxRating: 5
  });
  const businessService = new GooglePlacesService();

  // Load persisted data on mount
  useEffect(() => {
    const savedBusinesses = localStorage.getItem('gmbBusinesses');
    const savedFilters = localStorage.getItem('gmbFilters');
    const savedHasSearched = localStorage.getItem('gmbHasSearched');
    
    if (savedBusinesses) {
      try {
        const parsedBusinesses = JSON.parse(savedBusinesses);
        setBusinesses(parsedBusinesses);
        setHasSearched(true);
      } catch (error) {
        console.error('Error parsing saved businesses:', error);
      }
    }
    
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
      } catch (error) {
        console.error('Error parsing saved filters:', error);
      }
    }
    
    if (savedHasSearched === 'true') {
      setHasSearched(true);
    }
  }, []);

  // Save businesses to localStorage whenever they change
  useEffect(() => {
    if (businesses.length > 0) {
      localStorage.setItem('gmbBusinesses', JSON.stringify(businesses));
      localStorage.setItem('gmbHasSearched', 'true');
    }
  }, [businesses]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gmbFilters', JSON.stringify(filters));
  }, [filters]);

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
    setLastSearchParams(params);
    try {
      const results = await businessService.searchBusinesses(params);
      setBusinesses(results);
      setHasSearched(true);
      
      // Save search to MyData
      const locationParts = params.location.split(',').map(part => part.trim());
      const country = locationParts[locationParts.length - 1] || '';
      const state = locationParts.length > 1 ? locationParts[locationParts.length - 2] || '' : '';
      const city = locationParts.length > 2 ? locationParts[locationParts.length - 3] || '' : '';
      const area = locationParts.length > 3 ? locationParts.slice(0, locationParts.length - 3).join(', ') : '';
      
      saveCurrentSearch(params.category, country, state, city, area, results, filters);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentSearch = (category: string, country: string, state: string, city: string, area: string, businesses: Business[], currentFilters: SearchFilters) => {
    const newSearch = {
      id: Date.now().toString(),
      category,
      country,
      state,
      city,
      area,
      timestamp: new Date().toISOString(),
      businessCount: businesses.length,
      businesses: businesses,
      filters: {
        hasWebsite: currentFilters.hasWebsite === 'yes',
        hasEmail: currentFilters.hasEmail === 'yes',
        hasPhone: currentFilters.hasPhone === 'yes',
        minRating: currentFilters.minRating || 0,
        maxRating: currentFilters.maxRating || 5
      }
    };

    const saved = localStorage.getItem('gmbSavedSearches');
    const savedSearches = saved ? JSON.parse(saved) : [];
    const updatedSearches = [...savedSearches, newSearch];
    localStorage.setItem('gmbSavedSearches', JSON.stringify(updatedSearches));
  };

  const handleBusinessesLoad = (businesses: Business[]) => {
    setBusinesses(businesses);
    setHasSearched(true);
    setActiveTab('search');
  };

  const getConfirmedBusinesses = () => {
    // Get interested businesses from current session
    const currentInterested = businesses.filter(business => business.leadStatus === 'interested');
    
    // Get interested businesses from saved searches
    const saved = localStorage.getItem('gmbSavedSearches');
    let savedInterested: Business[] = [];
    
    if (saved) {
      try {
        const savedSearches = JSON.parse(saved);
        savedInterested = savedSearches.flatMap((search: any) => 
          search.businesses.filter((business: Business) => business.leadStatus === 'interested')
        );
      } catch (error) {
        console.error('Error loading saved searches:', error);
      }
    }
    
    // Combine and remove duplicates
    const allInterested = [...currentInterested, ...savedInterested];
    const uniqueBusinesses = allInterested.filter((business, index, self) => 
      index === self.findIndex(b => b.id === business.id)
    );
    
    return uniqueBusinesses;
  };

  const getConfirmedCategories = () => {
    const confirmed = getConfirmedBusinesses();
    const categories = [...new Set(confirmed.map(b => b.category))];
    return categories.sort();
  };

  const getFilteredConfirmedBusinesses = () => {
    const confirmed = getConfirmedBusinesses();
    if (confirmedCategoryFilter === 'all') {
      return confirmed;
    }
    return confirmed.filter(b => b.category === confirmedCategoryFilter);
  };

  const handleClear = () => {
    setBusinesses([]);
    setFilteredBusinesses([]);
    setHasSearched(false);
    setFilters({
      hasWebsite: 'all',
      hasEmail: 'all',
      hasPhone: 'all',
      minRating: 0,
      maxRating: 5
    });
    
    // Clear localStorage
    localStorage.removeItem('gmbBusinesses');
    localStorage.removeItem('gmbFilters');
    localStorage.removeItem('gmbHasSearched');
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

  const handleBusinessUpdate = (updatedBusinesses: Business[]) => {
    setBusinesses(updatedBusinesses);
    
    // Also update saved searches with the new business data
    const saved = localStorage.getItem('gmbSavedSearches');
    if (saved) {
      try {
        const savedSearches = JSON.parse(saved);
        const updatedSearches = savedSearches.map((search: any) => {
          return {
            ...search,
            businesses: search.businesses.map((savedBusiness: Business) => {
              const updatedBusiness = updatedBusinesses.find(b => b.id === savedBusiness.id);
              return updatedBusiness || savedBusiness;
            })
          };
        });
        localStorage.setItem('gmbSavedSearches', JSON.stringify(updatedSearches));
      } catch (error) {
        console.error('Error updating saved searches:', error);
      }
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
                GMB Lead Scraper
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setActiveTab('mydata')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'mydata'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Database className="w-4 h-4 mr-1" />
              My Data
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'confirmed'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Confirmed
              {getConfirmedBusinesses().length > 0 && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {getConfirmedBusinesses().length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {activeTab === 'search' ? (
            <>
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />

              {businesses.length > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleClear}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Results
                    </button>
                    <ExportButton businesses={filteredBusinesses} />
                  </div>

                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    resultCount={filteredBusinesses.length}
                  />

                  <BusinessTable
                    businesses={filteredBusinesses}
                    onExtractEmails={handleExtractEmails}
                    isExtractingEmails={isExtractingEmails}
                    onBusinessUpdate={handleBusinessUpdate}
                  />
                </>
              )}

              {businesses.length === 0 && !isLoading && !hasSearched && (
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

              {businesses.length === 0 && !isLoading && hasSearched && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Businesses Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    No businesses found matching your search criteria. Try adjusting your search parameters.
                  </p>
                  <button
                    onClick={handleClear}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mx-auto"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Search
                  </button>
                </div>
              )}
            </>
          ) : activeTab === 'mydata' ? (
            <MyDataTab onBusinessesLoad={handleBusinessesLoad} />
          ) : (
            <ConfirmedTab
              confirmedBusinesses={getFilteredConfirmedBusinesses()}
              categories={getConfirmedCategories()}
              categoryFilter={confirmedCategoryFilter}
              onCategoryFilterChange={setConfirmedCategoryFilter}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
