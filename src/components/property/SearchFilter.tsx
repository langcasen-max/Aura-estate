import React from 'react';
import { PropertyFilters, PropertyType, ListingStatus } from '../../types';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface SearchFilterProps {
  filters: PropertyFilters;
  onChange: (newFilters: PropertyFilters) => void;
  onReset: () => void;
  compact?: boolean;
}

const PROPERTY_TYPES: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'All Residence Types', value: 'all' },
  { label: 'Private Villa', value: 'villa' },
  { label: 'Sky Penthouse', value: 'penthouse' },
  { label: 'Alpine & Country Estate', value: 'estate' },
  { label: 'Luxury Apartment', value: 'apartment' },
  { label: 'Beaux-Arts Townhouse', value: 'townhouse' },
];

const CITIES = ['All Locations', 'Bel-Air', 'New York', 'Miami Beach', 'Aspen', 'Malibu', 'London Mayfair', 'San Francisco'];

const COMMON_AMENITIES = [
  'Infinity Pool',
  'Wine Cellar',
  'Private Spa',
  'Home Cinema',
  'Private Yacht Dock (180ft)',
  'Ski-in / Ski-out Access',
  'Panoramic City Views',
  '24hr White-Glove Concierge',
];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  onChange,
  onReset,
  compact = false,
}) => {
  const handleStatusChange = (status: ListingStatus | 'all') => {
    onChange({ ...filters, listing_status: status, page: 1 });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as PropertyType | 'all';
    onChange({ ...filters, property_type: val, page: 1 });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({ ...filters, city: val === 'All Locations' ? 'all' : val, page: 1 });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a: string) => a !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities: updated, page: 1 });
  };

  if (compact) {
    // Hero search variant (for Home page)
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-stone-200/80 max-w-4xl w-full mx-auto">
        {/* Top Segmented Control (Buy / Rent / All) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
          <div className="inline-flex p-1 bg-stone-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleStatusChange('all')}
              className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                filters.listing_status === 'all' || !filters.listing_status
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Listings
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('for_sale')}
              className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                filters.listing_status === 'for_sale'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              For Acquisition (Buy)
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('for_rent')}
              className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                filters.listing_status === 'for_rent'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Private Lease (Rent)
            </button>
          </div>

          <span className="text-[11px] font-mono tracking-wider uppercase text-stone-600 hidden sm:inline">
            Aura Curated Portfolio
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-500 mb-1">
              Destination
            </label>
            <select
              value={filters.city === 'all' || !filters.city ? 'All Locations' : filters.city}
              onChange={handleCityChange}
              className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-800 cursor-pointer"
            >
              {CITIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Residence Type */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-500 mb-1">
              Property Type
            </label>
            <select
              value={filters.property_type || 'all'}
              onChange={handleTypeChange}
              className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-800 cursor-pointer"
            >
              <option value="all">All Residence Types</option>
              <option value="villa">Waterfront & Ocean Villa</option>
              <option value="penthouse">Sky Penthouse</option>
              <option value="estate">Country & Alpine Estate</option>
              <option value="apartment">Luxury Apartment</option>
              <option value="townhouse">Historic Townhouse</option>
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-500 mb-1">
              Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Bel-Air, Pool, Ocean..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                className="w-full h-11 pl-9 pr-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-800 placeholder-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full sidebar / page filter variant
  return (
    <aside aria-label="Listing filters" className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-800" />
          <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
            Refine Catalogue
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-stone-400 hover:text-stone-700 text-xs flex items-center gap-1 cursor-pointer"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Listing Status Toggle */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Transaction Type
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => handleStatusChange('all')}
            className={`py-1.5 rounded cursor-pointer ${
              filters.listing_status === 'all' || !filters.listing_status
                ? 'bg-stone-900 text-white font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange('for_sale')}
            className={`py-1.5 rounded cursor-pointer ${
              filters.listing_status === 'for_sale'
                ? 'bg-stone-900 text-white font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange('for_rent')}
            className={`py-1.5 rounded cursor-pointer ${
              filters.listing_status === 'for_rent'
                ? 'bg-stone-900 text-white font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rent
          </button>
        </div>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Text Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search address, title, features..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full h-10 pl-9 pr-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* City Location */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Location
        </label>
        <select
          value={filters.city === 'all' || !filters.city ? 'All Locations' : filters.city}
          onChange={handleCityChange}
          className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800 cursor-pointer"
        >
          {CITIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Residence Type
        </label>
        <select
          value={filters.property_type || 'all'}
          onChange={handleTypeChange}
          className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800 cursor-pointer"
        >
          <option value="all">All Residence Types</option>
          <option value="villa">Waterfront & Ocean Villa</option>
          <option value="penthouse">Sky Penthouse</option>
          <option value="estate">Country & Alpine Estate</option>
          <option value="apartment">Luxury Apartment</option>
          <option value="townhouse">Historic Townhouse</option>
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Minimum Bedrooms
        </label>
        <div className="grid grid-cols-5 gap-1 text-xs">
          {['all', 3, 4, 5, 6].map(b => (
            <button
              key={String(b)}
              type="button"
              onClick={() => onChange({ ...filters, bedrooms: b as any, page: 1 })}
              className={`py-2 border rounded-md text-center cursor-pointer transition-colors ${
                (filters.bedrooms === b) || (b === 'all' && !filters.bedrooms)
                  ? 'bg-stone-900 border-stone-900 text-white font-bold'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {b === 'all' ? 'Any' : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Chips */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Amenities & Features
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_AMENITIES.map(amenity => {
            const isSelected = (filters.amenities || []).includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                    : 'border-stone-200 text-stone-600 hover:border-stone-400 bg-stone-50'
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
