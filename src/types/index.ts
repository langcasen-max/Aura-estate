export type UserRole = 'user' | 'admin' | 'public';

export type PropertyType =
  | 'villa'
  | 'penthouse'
  | 'estate'
  | 'apartment'
  | 'townhouse'
  | 'commercial';

export type ListingStatus = 'for_sale' | 'for_rent' | 'sold' | 'pending';

export type InquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed';

export type InquiryType =
  | 'viewing'
  | 'dossier'
  | 'advisory'
  | 'financing'
  | 'general';

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyMedia {
  id: string;
  property_id: string;
  url: string;
  alt_text?: string;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  property_type: PropertyType;
  listing_status: ListingStatus;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  year_built?: number;
  is_featured: boolean;
  featured_image: string;
  location: PropertyLocation;
  amenities: string[];
  media?: PropertyMedia[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyInquiry {
  id: string;
  property_id?: string | null;
  property_title?: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  phone?: string;
  message: string;
  inquiry_type: InquiryType;
  preferred_date?: string;
  preferred_time?: string;
  status: InquiryStatus;
  admin_notes?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at?: string;
  inquiry_count?: number;
}

export interface PropertyFilters {
  listing_status?: ListingStatus | 'all';
  property_type?: PropertyType | 'all';
  min_price?: number;
  max_price?: number;
  bedrooms?: number | 'all';
  bathrooms?: number | 'all';
  min_area?: number;
  city?: string | 'all';
  amenities?: string[];
  search?: string;
  sort_by?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'area_desc' | 'beds_desc';
  page?: number;
  page_size?: number;
}

export interface SiteSettings {
  agency_name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  commission_rate: number;
  currency_symbol?: string;
  currency_code?: string;
}
