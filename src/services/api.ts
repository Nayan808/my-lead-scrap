import axios from 'axios';
import { Business, SearchParams } from '../types';

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY; // Use environment variable

export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = '/api/maps/maps/api/place'; // Use proxy endpoint

  constructor(apiKey: string = GOOGLE_PLACES_API_KEY) {
    this.apiKey = apiKey;
  }

  private cleanPhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 91 and has 10+ digits, remove the 91 to avoid duplication
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    }
    
    // If it's a 10-digit number (Indian), add +91 prefix
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If it's already international format, add + if missing
    if (cleaned.length > 10 && !cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    // Return as is if doesn't match expected patterns
    return phone;
  }

  async searchBusinesses(params: SearchParams): Promise<Business[]> {
    try {
      // Check if API key is available
      if (!this.apiKey || this.apiKey === 'undefined') {
        throw new Error('API key is missing. Please set VITE_GOOGLE_PLACES_API_KEY in your .env file');
      }

      let allPlaceResults: any[] = [];
      let nextPageToken: string | undefined = undefined;

      do {
        // Wait for 2 seconds before requesting the next page (required by Google API)
        if (nextPageToken) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const textSearchUrl = `${this.baseUrl}/textsearch/json`;
        const searchResponse: any = await axios.get(textSearchUrl, {
          params: {
            query: `${params.category} in ${params.location}`,
            key: this.apiKey,
            type: 'establishment',
            pagetoken: nextPageToken
          }
        });

        if (searchResponse.data.status !== 'OK' && searchResponse.data.status !== 'ZERO_RESULTS') {
          const errorMessage = this.getApiErrorMessage(searchResponse.data.status, searchResponse.data.error_message);
          throw new Error(`Google Places API error: ${errorMessage}`);
        }

        if (searchResponse.data.results) {
          allPlaceResults = [...allPlaceResults, ...searchResponse.data.results];
        }

        nextPageToken = searchResponse.data.next_page_token;

      } while (nextPageToken);

      const businesses: Business[] = [];

      // Get detailed information for each place
      for (const place of allPlaceResults) {
        const detailsUrl = `${this.baseUrl}/details/json`;
        try {
          const detailsResponse = await axios.get(detailsUrl, {
            params: {
              place_id: place.place_id,
              key: this.apiKey,
              fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types'
            }
          });

          if (detailsResponse.data.status === 'OK') {
            const details = detailsResponse.data.result;

            const business: Business = {
              id: place.place_id,
              name: details.name || place.name,
              address: details.formatted_address || place.formatted_address,
              phone: details.formatted_phone_number || '',
              cleanPhone: this.cleanPhoneNumber(details.formatted_phone_number || ''),
              website: details.website || '',
              category: this.getMainCategory(details.types || place.types),
              rating: details.rating || place.rating || 0,
              reviewCount: details.user_ratings_total || place.user_ratings_total || 0,
              hasWebsite: !!details.website,
              hasEmail: false, // Will be determined later
              hasPhone: !!details.formatted_phone_number,
              claimedStatus: 'unknown' // Will be determined later
            };

            businesses.push(business);
          }
        } catch (detailError) {
          console.error(`Error fetching details for ${place.place_id}:`, detailError);
          // Continue with next business even if one fails
        }
      }

      return businesses;
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw error;
    }
  }

  private getApiErrorMessage(status: string, errorMessage?: string): string {
    const errorMessages: { [key: string]: string } = {
      'ZERO_RESULTS': 'No businesses found for this search. Try different keywords or location.',
      'OVER_DAILY_LIMIT': 'API daily limit exceeded. Check your Google Cloud Console billing.',
      'OVER_QUOTA_LIMIT': 'API quota exceeded. Try again later or upgrade your plan.',
      'REQUEST_DENIED': 'API request denied. Check if Places API is enabled for your project.',
      'INVALID_REQUEST': 'Invalid request. Check your search parameters.',
      'NOT_FOUND': 'API endpoint not found. Check your API configuration.',
      'UNKNOWN_ERROR': 'Unknown server error. Please try again.'
    };

    return errorMessage || errorMessages[status] || `Unknown error: ${status}`;
  }

  private getMainCategory(types: string[]): string {
    const categoryMap: { [key: string]: string } = {
      'restaurant': 'Restaurant',
      'cafe': 'Cafe',
      'store': 'Retail Store',
      'health': 'Healthcare',
      'beauty_salon': 'Beauty Salon',
      'gym': 'Fitness Center',
      'lawyer': 'Law Firm',
      'accounting': 'Accounting',
      'real_estate_agency': 'Real Estate',
      'insurance_agency': 'Insurance',
      'car_repair': 'Auto Repair',
      'plumber': 'Plumbing',
      'electrician': 'Electrician',
      'roofing_contractor': 'Roofing',
      'painter': 'Painting',
      'moving_company': 'Moving Company',
      'veterinary_care': 'Veterinary',
      'dentist': 'Dental Office',
      'doctor': 'Medical Office',
      'hair_care': 'Hair Salon',
      'spa': 'Spa',
      'lodging': 'Hotel/Accommodation',
      'travel_agency': 'Travel Agency',
      'financial_advisor': 'Financial Services'
    };

    for (const type of types) {
      if (categoryMap[type]) {
        return categoryMap[type];
      }
    }

    return types[0]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Business';
  }
}

// Mock service for development without API key
export class MockBusinessService {
  private cleanPhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 91 and has 10+ digits, remove the 91 to avoid duplication
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    }
    
    // If it's a 10-digit number (Indian), add +91 prefix
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If it's already international format, add + if missing
    if (cleaned.length > 10 && !cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    // Return as is if doesn't match expected patterns
    return phone;
  }

  async searchBusinesses(params: SearchParams): Promise<Business[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
      {
        id: '1',
        name: 'Sample Restaurant',
        address: '123 Main St, ' + params.location,
        phone: '(555) 123-4567',
        cleanPhone: this.cleanPhoneNumber('(555) 123-4567'),
        website: 'https://www.sample-restaurant.com',
        category: params.category,
        rating: 4.2,
        reviewCount: 156,
        hasWebsite: true,
        hasEmail: false,
        hasPhone: true,
        claimedStatus: 'unclaimed'
      },
      {
        id: '2',
        name: 'Unclaimed Cafe',
        address: '456 Oak Ave, ' + params.location,
        phone: '',
        cleanPhone: this.cleanPhoneNumber(''),
        website: '',
        category: params.category,
        rating: 3.8,
        reviewCount: 89,
        hasWebsite: false,
        hasEmail: false,
        hasPhone: false,
        claimedStatus: 'unclaimed'
      },
      {
        id: '3',
        name: 'Professional Services LLC',
        address: '789 Elm St, ' + params.location,
        phone: '(555) 987-6543',
        cleanPhone: this.cleanPhoneNumber('(555) 987-6543'),
        website: 'https://www.professional-services.com',
        category: params.category,
        rating: 4.7,
        reviewCount: 234,
        hasWebsite: true,
        hasEmail: false,
        hasPhone: true,
        claimedStatus: 'claimed'
      }
    ];
  }
}
