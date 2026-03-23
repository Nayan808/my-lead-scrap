import React from 'react';
import { Business } from '../types';
import { CheckCircle, Phone, Mail, Globe, MessageCircle, Filter } from 'lucide-react';
import { ExportButton } from './ExportButton';

interface ConfirmedTabProps {
  confirmedBusinesses: Business[];
  categories: string[];
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
}

export const ConfirmedTab: React.FC<ConfirmedTabProps> = ({
  confirmedBusinesses,
  categories,
  categoryFilter,
  onCategoryFilterChange
}) => {
  const getContactInfo = (business: Business) => {
    const info = [];
    if (business.phone) info.push({ icon: Phone, text: business.cleanPhone || business.phone });
    if (business.email) info.push({ icon: Mail, text: business.email });
    if (business.website) info.push({ icon: Globe, text: business.website, website: business.website });
    return info;
  };

  const handleWhatsAppClick = (phoneNumber: string, businessName: string) => {
    if (!phoneNumber) return;
    
    const message = `Hello ${businessName}! I'm interested in your services and would like to connect with you.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Confirmed Leads</h2>
            <p className="text-gray-600">Businesses marked as interested</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">{confirmedBusinesses.length}</span> confirmed leads
          </div>
          <ExportButton businesses={confirmedBusinesses} />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories ({confirmedBusinesses.length})</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category} ({confirmedBusinesses.filter(b => b.category === category).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {confirmedBusinesses.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Confirmed Leads Yet</h3>
          <p className="text-gray-500">
            Businesses marked as "interested" will appear here. Start searching and marking businesses as interested to build your confirmed leads list.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {confirmedBusinesses.map((business) => (
            <div key={business.id} className="border border-green-200 bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">{business.name}</h3>
                    <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                      Interested
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <div className="mb-1">{business.address}</div>
                    <div className="flex items-center space-x-4">
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                        {business.category}
                      </span>
                      {business.rating && (
                        <span className="flex items-center">
                          ⭐ {business.rating}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {getContactInfo(business).map((info, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <info.icon className="w-4 h-4 mr-1" />
                        {info.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {business.cleanPhone && (
                    <button
                      onClick={() => handleWhatsAppClick(business.cleanPhone!, business.name)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
