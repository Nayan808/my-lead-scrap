import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Globe, MessageCircle, Trash2, Download, Upload, Eye, X } from 'lucide-react';
import { Business } from '../types';

interface SavedSearch {
  id: string;
  category: string;
  country: string;
  state: string;
  city: string;
  area: string;
  timestamp: string;
  businessCount: number;
  businesses: Business[];
  filters: {
    hasWebsite: boolean;
    hasEmail: boolean;
    hasPhone: boolean;
    minRating: number;
    maxRating: number;
  };
}

interface MyDataTabProps {
  onBusinessesLoad: (businesses: Business[]) => void;
}

export const MyDataTab: React.FC<MyDataTabProps> = ({ onBusinessesLoad }) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [selectedSearch, setSelectedSearch] = useState<SavedSearch | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = () => {
    const saved = localStorage.getItem('gmbSavedSearches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedSearches(parsed);
      } catch (error) {
        console.error('Error loading saved searches:', error);
      }
    }
  };

  const saveCurrentSearch = (category: string, country: string, state: string, city: string, area: string, businesses: Business[], filters: any) => {
    const newSearch: SavedSearch = {
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
        hasWebsite: filters.hasWebsite === 'yes',
        hasEmail: filters.hasEmail === 'yes',
        hasPhone: filters.hasPhone === 'yes',
        minRating: filters.minRating || 0,
        maxRating: filters.maxRating || 5
      }
    };

    const updatedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSearches);
    localStorage.setItem('gmbSavedSearches', JSON.stringify(updatedSearches));
  };

  const updateSavedSearchBusiness = (businessId: string, updatedBusiness: Business) => {
    const updatedSearches = savedSearches.map(search => {
      if (search.businesses.some(b => b.id === businessId)) {
        return {
          ...search,
          businesses: search.businesses.map(b => 
            b.id === businessId ? updatedBusiness : b
          )
        };
      }
      return search;
    });
    
    setSavedSearches(updatedSearches);
    localStorage.setItem('gmbSavedSearches', JSON.stringify(updatedSearches));
  };

  const deleteSearch = (searchId: string) => {
    const updatedSearches = savedSearches.filter(search => search.id !== searchId);
    setSavedSearches(updatedSearches);
    localStorage.setItem('gmbSavedSearches', JSON.stringify(updatedSearches));
    
    if (selectedSearch?.id === searchId) {
      setSelectedSearch(null);
      setShowDetails(false);
    }
  };

  const loadSearchBusinesses = (search: SavedSearch) => {
    onBusinessesLoad(search.businesses);
    // Also save to main businesses storage
    localStorage.setItem('gmbBusinesses', JSON.stringify(search.businesses));
    localStorage.setItem('gmbHasSearched', 'true');
  };

  const exportAllData = () => {
    const allData = {
      savedSearches,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gmb-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (imported.savedSearches) {
          setSavedSearches(imported.savedSearches);
          localStorage.setItem('gmbSavedSearches', JSON.stringify(imported.savedSearches));
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const getContactedCount = (businesses: Business[]) => {
    return businesses.filter(b => b.leadStatus !== 'not_contacted').length;
  };

  const getLeadStatusColor = (status: Business['leadStatus']) => {
    switch (status) {
      case 'interested': return 'text-green-600 bg-green-100';
      case 'not_interested': return 'text-red-600 bg-red-100';
      case 'delayed': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Data</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportAllData}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
          <label className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm cursor-pointer">
            <Upload className="w-4 h-4 mr-1" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {savedSearches.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Searches</h3>
          <p className="text-gray-500">
            Your search history and business data will appear here. Start searching to build your database.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedSearches.map((search) => (
            <div key={search.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{search.category}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(search.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {search.area ? `${search.area}, ` : ''}{search.city}, {search.state}, {search.country}
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {search.businessCount} businesses
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {getContactedCount(search.businesses)} contacted
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                    {search.filters.hasWebsite && (
                      <span className="flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        Website ✓
                      </span>
                    )}
                    {search.filters.hasEmail && (
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        Email ✓
                      </span>
                    )}
                    {search.filters.hasPhone && (
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        Phone ✓
                      </span>
                    )}
                    {(search.filters.minRating > 0 || search.filters.maxRating < 5) && (
                      <span className="flex items-center">
                        Rating: {search.filters.minRating}-{search.filters.maxRating}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => loadSearchBusinesses(search)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Load
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSearch(search);
                        setShowDetails(true);
                      }}
                      className="flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </button>
                    <button
                      onClick={() => deleteSearch(search.id)}
                      className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetails && selectedSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[80vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Search Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Search Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Category:</strong> {selectedSearch.category}</div>
                  <div><strong>Location:</strong> {selectedSearch.area ? `${selectedSearch.area}, ` : ''}{selectedSearch.city}, {selectedSearch.state}, {selectedSearch.country}</div>
                  <div><strong>Date:</strong> {new Date(selectedSearch.timestamp).toLocaleString()}</div>
                  <div><strong>Total Businesses:</strong> {selectedSearch.businessCount}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Businesses ({selectedSearch.businesses.length})</h4>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">Business</th>
                        <th className="px-4 py-2 text-left">Contact</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedSearch.businesses.map((business) => (
                        <tr key={business.id}>
                          <td className="px-4 py-2">
                            <div className="font-medium">{business.name}</div>
                            <div className="text-gray-500 text-xs">{business.address}</div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="space-y-1">
                              {business.phone && (
                                <div className="flex items-center text-xs">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {business.cleanPhone || business.phone}
                                </div>
                              )}
                              {business.email && (
                                <div className="flex items-center text-xs">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {business.email}
                                </div>
                              )}
                              {business.website && (
                                <div className="flex items-center text-xs">
                                  <Globe className="w-3 h-3 mr-1" />
                                  Website
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLeadStatusColor(business.leadStatus || 'not_contacted')}`}>
                              {(business.leadStatus || 'not_contacted').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
