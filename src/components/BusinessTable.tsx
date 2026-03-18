import React from 'react';
import { Business } from '../types';
import { Star, Globe, Phone, Mail, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface BusinessTableProps {
  businesses: Business[];
  onExtractEmails: () => void;
  isExtractingEmails: boolean;
}

export const BusinessTable: React.FC<BusinessTableProps> = ({ 
  businesses, 
  onExtractEmails, 
  isExtractingEmails 
}) => {
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
        <div className="flex items-center justify-between">
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {businesses.map((business) => (
              <tr key={business.id} className="hover:bg-gray-50">
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
