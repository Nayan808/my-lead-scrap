import React, { useState } from 'react';
import { Business } from '../types';
import { Mail, Phone, Globe, MessageCircle, Star } from 'lucide-react';

interface BusinessTableProps {
  businesses: Business[];
  onExtractEmails: () => void;
  isExtractingEmails: boolean;
  onBusinessUpdate: (updatedBusinesses: Business[]) => void;
}

export const BusinessTable: React.FC<BusinessTableProps> = ({ 
  businesses, 
  onExtractEmails, 
  isExtractingEmails,
  onBusinessUpdate 
}) => {
  const [whatsappMessage, setWhatsappMessage] = useState('Hello {business_name}! I found your business and would like to connect with you.');

  const handleWhatsAppClick = (phoneNumber: string, businessName: string) => {
    if (!phoneNumber) return;
    
    const personalizedMessage = whatsappMessage.replace('{business_name}', businessName);
    const encodedMessage = encodeURIComponent(personalizedMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLeadStatusChange = (businessId: string, newStatus: Business['leadStatus']) => {
    const updatedBusinesses = businesses.map(business => 
      business.id === businessId 
        ? { ...business, leadStatus: newStatus }
        : business
    );
    onBusinessUpdate(updatedBusinesses);
  };

  const getRowBackgroundColor = (leadStatus: Business['leadStatus']) => {
    const status = leadStatus || 'not_contacted';
    switch (status) {
      case 'interested':
        return 'bg-green-50';
      case 'not_interested':
        return 'bg-red-50';
      case 'delayed':
        return 'bg-orange-50';
      default:
        return 'bg-white';
    }
  };

  const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
      <Star className="w-4 h-4 text-yellow-400 fill-current" />
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Business Results ({businesses.length})
          </h2>
          <button
            onClick={onExtractEmails}
            disabled={isExtractingEmails || businesses.length === 0}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isExtractingEmails ? 'Extracting Emails...' : 'Extract Emails'}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">WhatsApp Message:</label>
          <input
            type="text"
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            placeholder="Use {business_name} to insert business name. Example: Hello {business_name}! I'm interested in your services..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {businesses.map((business) => (
              <tr key={business.id} className={getRowBackgroundColor(business.leadStatus)}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{business.name}</div>
                    <div className="text-sm text-gray-500">{business.address}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {business.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-1" />
                        {business.cleanPhone || business.phone}
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-1" />
                        {business.email}
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-1" />
                        Website Available
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {business.rating ? <RatingStars rating={business.rating} /> : (
                    <span className="text-sm text-gray-500">No Rating</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={business.leadStatus || 'not_contacted'}
                    onChange={(e) => handleLeadStatusChange(business.id, e.target.value as Business['leadStatus'])}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="not_contacted">Not Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="not_interested">Not Interested</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleWhatsAppClick(business.cleanPhone || '', business.name)}
                    disabled={!business.cleanPhone}
                    className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {businesses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-gray-500">No businesses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
