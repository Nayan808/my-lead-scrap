export interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  cleanPhone: string;
  website: string;
  category: string;
  rating: number;
  reviewCount: number;
  hasWebsite: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
  email?: string;
  claimedStatus?: 'claimed' | 'unclaimed' | 'unknown';
  leadStatus: 'not_contacted' | 'interested' | 'not_interested' | 'delayed';
}

export interface SearchFilters {
  hasWebsite?: 'all' | 'yes' | 'no';
  hasEmail?: 'all' | 'yes' | 'no';
  hasPhone?: 'all' | 'yes' | 'no';
  minRating?: number;
  maxRating?: number;
}

export interface SearchParams {
  category: string;
  location: string;
}
