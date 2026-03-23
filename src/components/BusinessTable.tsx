import React, { useState } from 'react';
import { Business } from '../types';
import { Star, Globe, Phone, Mail, AlertCircle, CheckCircle, ExternalLink, MessageCircle } from 'lucide-react';

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
  const StatusBadge: React.FC<{ has: boolean; label: string }> = ({ has, label }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      has 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {has ? (
        <CheckCircle className="w-3 h-3 mr-1" />
      ) : (
        <AlertCircle className="w-3 h-3 mr-1" />
      )}
      {has ? 'Has' : 'Missing'} {label}
    </span>
  );

  const ClaimedBadge: React.FC<{ status?: string }> = ({ status }) => {
    if (status === 'claimed') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Claimed
        </span>
      );
    } else if (status === 'unclaimed') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Unclaimed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Unknown
      </span>
    );
  };

  const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
      <Star className="w-4 h-4 text-yellow-400 fill-current" />
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Business Results ({businesses.length})
          </h3>
          <button
            onClick={onExtractEmails}
            disabled={isExtractingEmails || businesses.filter(b => b.hasWebsite && !b.hasEmail).length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isExtractingEmails ? 'Extracting Emails...' : 'Extract Emails'}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">WhatsApp Message:</label>
          <input
            type="text"
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            placeholder="Use {business_name} to insert business name. Example: Hello {business_name}! I'm interested in your services..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clean Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                WhatsApp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {businesses.map((business) => (
              <tr key={business.id} className={`${getRowBackgroundColor(business.leadStatus || 'not_contacted')} hover:opacity-80`}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {business.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {business.category}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {business.address}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {business.phone ? (
                        <span className="text-sm text-gray-900">{business.phone}</span>
                      ) : (
                        <StatusBadge has={false} label="Phone" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {business.website ? (
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          Visit Site
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      ) : (
                        <StatusBadge has={false} label="Website" />
                      )}
                    </div>
                    {business.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{business.email}</span>
                      </div>
                    )}
                    {!business.email && business.hasWebsite && (
                      <StatusBadge has={false} label="Email" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {business.cleanPhone || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <RatingStars rating={business.rating} />
                    <div className="text-xs text-gray-500">
                      {business.reviewCount} reviews
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <ClaimedBadge status={business.claimedStatus} />
                    {business.hasWebsite && (
                      <StatusBadge has={true} label="Website" />
                    )}
                    {business.hasEmail && (
                      <StatusBadge has={true} label="Email" />
                    )}
                    {business.hasPhone && (
                      <StatusBadge has={true} label="Phone" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={business.leadStatus || 'not_contacted'}
                    onChange={(e) => handleLeadStatusChange(business.id, e.target.value as Business['leadStatus'])}
                    className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="not_contacted">Not Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="not_interested">Not Interested</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleWhatsAppClick(business.cleanPhone, business.name)}
                    disabled={!business.cleanPhone}
                    className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
          <p className="text-gray-500">No businesses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
