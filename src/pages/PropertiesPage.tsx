import React, { useState, useEffect, useMemo } from 'react';
import { Property, PropertyFilters } from '../types';
import { getProperties, getPropertiesByIds } from '../services/propertyService';
import { isPropertyFavorite, toggleFavorite, getLocalFavorites } from '../services/favoriteService';
import { PropertyCard } from '../components/property/PropertyCard';
import { SearchFilter } from '../components/property/SearchFilter';
import { updatePageSeo } from '../lib/seo';
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw, Heart } from 'lucide-react';

interface PropertiesPageProps {
  initialSearchQuery?: string;
  onNavigate: (path: string) => void;
  onFavoritesChanged: () => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  initialSearchQuery = '',
  onNavigate,
  onFavoritesChanged,
}) => {
  // Parse query string for initial filter state
  const parseFiltersFromUrl = (): PropertyFilters => {
    const params = new URLSearchParams(window.location.search);
    return {
      listing_status: (params.get('listing_status') as any) || 'all',
      property_type: (params.get('type') as any) || 'all',
      city: params.get('city') || 'all',
      search: params.get('q') || '',
      min_price: params.get('min_price') ? Number(params.get('min_price')) : undefined,
      max_price: params.get('max_price') ? Number(params.get('max_price')) : undefined,
      bedrooms: params.get('beds') ? (params.get('beds') as any) : 'all',
      sort_by: (params.get('sort') as any) || 'newest',
      page: 1,
      page_size: params.get('page_size') ? Number(params.get('page_size')) : 12,
    };
  };

  const [filters, setFilters] = useState<PropertyFilters>(parseFiltersFromUrl);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSavedOnly, setShowSavedOnly] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('filter') === 'saved';
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Re-sync filters if navigation passes new search query (e.g. from Navbar Acquire / Lease links)
  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      const params = new URLSearchParams(initialSearchQuery);
      setFilters({
        listing_status: (params.get('listing_status') as any) || 'all',
        property_type: (params.get('type') as any) || 'all',
        city: params.get('city') || 'all',
        search: params.get('q') || '',
        min_price: params.get('min_price') ? Number(params.get('min_price')) : undefined,
        max_price: params.get('max_price') ? Number(params.get('max_price')) : undefined,
        bedrooms: params.get('beds') ? (params.get('beds') as any) : 'all',
        sort_by: (params.get('sort') as any) || 'newest',
        page: 1,
        page_size: params.get('page_size') ? Number(params.get('page_size')) : 12,
      });
      setShowSavedOnly(params.get('filter') === 'saved');
    }
  }, [initialSearchQuery]);

  // Sync state to URL without reloading
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.listing_status && filters.listing_status !== 'all') params.set('listing_status', filters.listing_status);
    if (filters.property_type && filters.property_type !== 'all') params.set('type', filters.property_type);
    if (filters.city && filters.city !== 'all') params.set('city', filters.city);
    if (filters.search) params.set('q', filters.search);
    if (filters.sort_by && filters.sort_by !== 'newest') params.set('sort', filters.sort_by);
    if (filters.page_size && filters.page_size !== 12) params.set('page_size', String(filters.page_size));
    if (showSavedOnly) params.set('filter', 'saved');

    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);

    updatePageSeo({
      title: 'Current Residences Catalogue',
      description: 'Explore premier luxury estates, waterfront villas, and penthouses available for acquisition and lease.',
    });
  }, [filters, showSavedOnly]);

  // Fetch properties
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    if (showSavedOnly) {
      const savedIds = getLocalFavorites();
      getPropertiesByIds(savedIds)
        .then(res => {
          if (!cancelled) setProperties(res);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    } else {
      getProperties(filters)
        .then(res => {
          if (!cancelled) setProperties(res.properties);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [filters, showSavedOnly]);

  const handleToggleFav = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
    onFavoritesChanged();
    if (showSavedOnly) {
      setProperties(prev => prev.filter(p => p.id !== id));
    } else {
      setProperties(prev => [...prev]);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      listing_status: 'all',
      property_type: 'all',
      city: 'all',
      search: '',
      bedrooms: 'all',
      sort_by: 'newest',
      page: 1,
      page_size: 12,
    });
    setShowSavedOnly(false);
  };

  // Pagination calculations
  const pageSize = filters.page_size || 12;
  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(properties.length / pageSize) || 1;
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return properties.slice(start, start + pageSize);
  }, [properties, currentPage, pageSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title & Breadcrumb Header */}
      <div className="mb-8 pb-6 border-b border-stone-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-amber-800 block mb-1">
            Catalogue
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 leading-tight">
            {showSavedOnly ? 'Saved Private Residences' : 'Curated Residential Catalogue'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            {showSavedOnly
              ? 'Your private selection of bookmarked luxury acquisitions and residences.'
              : 'Browse our complete international portfolio of prime villas, penthouses, and historic estates.'}
          </p>
        </div>

        {/* View Toggle (All vs Saved) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSavedOnly(false)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !showSavedOnly ? 'bg-stone-900 text-stone-100 shadow-xs' : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            All Residences ({showSavedOnly ? '...' : properties.length})
          </button>
          <button
            type="button"
            onClick={() => setShowSavedOnly(true)}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showSavedOnly ? 'bg-stone-900 text-stone-100 shadow-xs' : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Saved Portfolio</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28">
            <SearchFilter
              filters={filters}
              onChange={newF => setFilters(newF)}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar: Mobile Filter Button, Result Count, Sort Dropdown */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-stone-100 rounded-lg text-stone-800 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters & Search</span>
            </button>

            {/* Results Count */}
            <div className="text-xs text-stone-600 font-medium">
              Showing <strong className="text-stone-900">{properties.length}</strong> available residences
            </div>

            {/* Sort & Page Size Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sort:</span>
              </div>
              <select
                value={filters.sort_by || 'newest'}
                onChange={e => setFilters({ ...filters, sort_by: e.target.value as any, page: 1 })}
                className="h-9 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-800 cursor-pointer"
              >
                <option value="newest">Latest Additions</option>
                <option value="oldest">Earliest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Size: Largest First</option>
                <option value="beds_desc">Bedrooms: Most First</option>
              </select>

              <select
                value={filters.page_size || 12}
                onChange={e => setFilters({ ...filters, page_size: Number(e.target.value), page: 1 })}
                className="h-9 px-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none cursor-pointer"
                title="Page size"
              >
                <option value={6}>6 / page</option>
                <option value={12}>12 / page</option>
                <option value={24}>24 / page</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(filters.listing_status !== 'all' || filters.property_type !== 'all' || filters.city !== 'all' || filters.search) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-stone-400 uppercase font-mono">Active:</span>
              {filters.listing_status && filters.listing_status !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 text-xs px-2.5 py-1 rounded-full border border-stone-200">
                  <span>{filters.listing_status === 'for_sale' ? 'For Acquisition' : 'Private Lease'}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, listing_status: 'all' })} />
                </span>
              )}
              {filters.property_type && filters.property_type !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 text-xs px-2.5 py-1 rounded-full border border-stone-200">
                  <span className="capitalize">{filters.property_type}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, property_type: 'all' })} />
                </span>
              )}
              {filters.city && filters.city !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 text-xs px-2.5 py-1 rounded-full border border-stone-200">
                  <span>{filters.city}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, city: 'all' })} />
                </span>
              )}
              {filters.search && (
                <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 text-xs px-2.5 py-1 rounded-full border border-stone-200">
                  <span>"{filters.search}"</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, search: '' })} />
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-amber-800 hover:underline font-semibold ml-2 cursor-pointer"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Properties Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl aspect-[4/3] p-4 border border-stone-200 animate-pulse" />
              ))}
            </div>
          ) : paginatedProperties.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-stone-900">No matching residences found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                We could not locate any properties matching your current filter criteria. Try expanding your search
                parameters or resetting the filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-stone-900 text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer hover:bg-stone-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={isPropertyFavorite(property.id)}
                  onToggleFavorite={handleToggleFav}
                  onSelectProperty={slug => onNavigate(`/property/${slug}`)}
                />
              ))}
            </div>
          )}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-stone-200 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setFilters({ ...filters, page: currentPage - 1 })}
                className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-xs font-bold disabled:opacity-40 hover:bg-stone-50 cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  type="button"
                  onClick={() => setFilters({ ...filters, page: i + 1 })}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-stone-900 text-white'
                      : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setFilters({ ...filters, page: currentPage + 1 })}
                className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-xs font-bold disabled:opacity-40 hover:bg-stone-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm uppercase tracking-wider text-stone-900">
                Filter Residences
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SearchFilter
              filters={filters}
              onChange={newF => setFilters(newF)}
              onReset={handleResetFilters}
            />

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-stone-900 text-white py-3 rounded-full text-xs font-bold cursor-pointer"
              >
                Apply Filters & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
