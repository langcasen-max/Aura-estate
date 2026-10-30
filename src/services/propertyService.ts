import { Property, PropertyFilters, PropertyMedia } from '../types';
import { supabase, isSupabaseConfigured, isUuid } from '../lib/supabase';
import { INITIAL_PROPERTIES } from './mockData';
import { generateSafeSlug, escapeFilterValue } from '../lib/security';

const STORAGE_KEY = 'sadiqabad_properties_v4';

function getLocalProperties(): Property[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
      return INITIAL_PROPERTIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROPERTIES;
  }
}

function saveLocalProperties(props: Property[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(props));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

function filterAndSortProperties(rawList: Property[], filters: PropertyFilters = {}): { properties: Property[]; total: number } {
  let list = [...rawList];

  if (filters.listing_status && filters.listing_status !== 'all') {
    list = list.filter(p => p.listing_status === filters.listing_status);
  }
  if (filters.property_type && filters.property_type !== 'all') {
    list = list.filter(p => p.property_type === filters.property_type);
  }
  if (filters.locality && filters.locality !== 'all') {
    const loc = filters.locality.toLowerCase();
    list = list.filter(
      p =>
        p.location.locality?.toLowerCase() === loc ||
        p.location.address.toLowerCase().includes(loc) ||
        p.title.toLowerCase().includes(loc)
    );
  }
  if (filters.city && filters.city !== 'all') {
    list = list.filter(p => p.location.city.toLowerCase() === filters.city?.toLowerCase());
  }
  if (filters.min_price) {
    list = list.filter(p => p.price >= filters.min_price!);
  }
  if (filters.max_price) {
    list = list.filter(p => p.price <= filters.max_price!);
  }
  if (filters.bedrooms && filters.bedrooms !== 'all') {
    list = list.filter(p => p.bedrooms >= Number(filters.bedrooms));
  }
  if (filters.bathrooms && filters.bathrooms !== 'all') {
    list = list.filter(p => p.bathrooms >= Number(filters.bathrooms));
  }
  if (filters.min_area) {
    list = list.filter(p => p.area_sqft >= filters.min_area!);
  }
  if (filters.amenities && filters.amenities.length > 0) {
    list = list.filter(p => filters.amenities!.every((a: string) => p.amenities.includes(a)));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q)
    );
  }

  // Sorting
  switch (filters.sort_by) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'area_desc':
      list.sort((a, b) => b.area_sqft - a.area_sqft);
      break;
    case 'beds_desc':
      list.sort((a, b) => b.bedrooms - a.bedrooms);
      break;
    case 'oldest':
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      break;
    case 'newest':
    default:
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  return { properties: list, total: list.length };
}

export async function getProperties(filters: PropertyFilters = {}): Promise<{ properties: Property[]; total: number }> {
  // If Supabase is configured, try querying remote database
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('properties').select('*, media:property_media(*)', { count: 'exact' });

      if (filters.listing_status && filters.listing_status !== 'all') {
        query = query.eq('listing_status', filters.listing_status);
      }
      if (filters.property_type && filters.property_type !== 'all') {
        query = query.eq('property_type', filters.property_type);
      }
      if (filters.city && filters.city !== 'all') {
        query = query.eq('city', filters.city);
      }
      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }
      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }
      if (filters.bedrooms && filters.bedrooms !== 'all') {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters.bathrooms && filters.bathrooms !== 'all') {
        query = query.gte('bathrooms', filters.bathrooms);
      }
      if (filters.min_area) {
        query = query.gte('area_sqft', filters.min_area);
      }
      if (filters.search) {
        const esc = escapeFilterValue(filters.search);
        query = query.or(`title.ilike.%${esc}%,description.ilike.%${esc}%,city.ilike.%${esc}%`);
      }

      if (filters.sort_by === 'price_asc') query = query.order('price', { ascending: true });
      else if (filters.sort_by === 'price_desc') query = query.order('price', { ascending: false });
      else if (filters.sort_by === 'area_desc') query = query.order('area_sqft', { ascending: false });
      else if (filters.sort_by === 'oldest') query = query.order('created_at', { ascending: true });
      else query = query.order('created_at', { ascending: false });

      const { data, count, error } = await query;
      if (!error && data && data.length > 0) {
        return { properties: data, total: count || data.length };
      }
    } catch {
      // Gracefully fall back to local properties store
    }
  }

  // Local / Demo Mode filtering with local storage and INITIAL_PROPERTIES
  return filterAndSortProperties(getLocalProperties(), filters);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const { properties } = await getProperties({ sort_by: 'newest' });
  const featured = properties.filter(p => p.is_featured);
  return featured.slice(0, 6);
}

export async function getPropertyByIdOrSlug(identifier: string): Promise<Property | null> {
  if (!identifier) return null;
  const list = getLocalProperties();

  if (isUuid(identifier)) {
    const found = list.find(p => p.id === identifier);
    if (found) return found;
  }

  const foundBySlug = list.find(p => p.slug === identifier || p.id === identifier);
  return foundBySlug || null;
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  if (!ids || ids.length === 0) return [];
  const list = getLocalProperties();
  return list.filter(p => ids.includes(p.id));
}

export async function getRelatedProperties(current: Property, limit = 3): Promise<Property[]> {
  const list = getLocalProperties().filter(p => p.id !== current.id);
  // Match same property type first
  const sameType = list.filter(p => p.property_type === current.property_type);
  if (sameType.length >= limit) return sameType.slice(0, limit);

  // Then same city
  const sameCity = list.filter(p => p.location.city === current.location.city && !sameType.includes(p));
  const combined = [...sameType, ...sameCity];
  if (combined.length >= limit) return combined.slice(0, limit);

  // Remaining latest
  const remaining = list.filter(p => !combined.includes(p));
  return [...combined, ...remaining].slice(0, limit);
}

export async function createProperty(data: Partial<Property>): Promise<Property> {
  const properties = getLocalProperties();

  // Validate or generate slug
  let slug = data.slug ? generateSafeSlug(data.slug) : generateSafeSlug(data.title || 'residence');
  if (properties.some(p => p.slug === slug)) {
    slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const newProperty: Property = {
    id: crypto.randomUUID ? crypto.randomUUID() : `prop-${Date.now()}`,
    title: data.title || 'Untitled Residence',
    slug,
    description: data.description || '',
    price: data.price || 0,
    currency: data.currency || 'PKR',
    property_type: data.property_type || 'villa',
    listing_status: data.listing_status || 'for_sale',
    bedrooms: data.bedrooms || 0,
    bathrooms: data.bathrooms || 0,
    area_sqft: data.area_sqft || 0,
    area_marla: data.area_marla || (data.area_sqft ? Math.round((data.area_sqft / 225) * 10) / 10 : 0),
    year_built: data.year_built || new Date().getFullYear(),
    is_featured: Boolean(data.is_featured),
    featured_image: data.featured_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    location: data.location || {
      address: '',
      locality: 'Model Town',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
    },
    amenities: data.amenities || [],
    media: data.media || [
      {
        id: `med-${Date.now()}`,
        property_id: '',
        url: data.featured_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        is_featured: true,
        display_order: 0,
      },
    ],
    features: data.features || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  properties.unshift(newProperty);
  saveLocalProperties(properties);
  return newProperty;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  const properties = getLocalProperties();
  const index = properties.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Property not found');
  }

  const existing = properties[index];
  const updated: Property = {
    ...existing,
    ...updates,
    location: updates.location ? { ...existing.location, ...updates.location } : existing.location,
    features: updates.features ? { ...(existing.features || {}), ...updates.features } : existing.features,
    updated_at: new Date().toISOString(),
  };

  properties[index] = updated;
  saveLocalProperties(properties);
  return updated;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const properties = getLocalProperties();
  const filtered = properties.filter(p => p.id !== id);
  if (filtered.length === properties.length) {
    throw new Error('Property not found');
  }
  saveLocalProperties(filtered);
  return true;
}

export async function resetDefaultProperties(): Promise<Property[]> {
  saveLocalProperties(INITIAL_PROPERTIES);
  return INITIAL_PROPERTIES;
}

export async function clearAllProperties(): Promise<void> {
  saveLocalProperties([]);
}

