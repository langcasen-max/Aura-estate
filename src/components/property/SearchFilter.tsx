import React from 'react';
import { PropertyFilters, PropertyType, ListingStatus } from '../../types';
import { SADIQABAD_LOCALITIES, SADIQABAD_AMENITIES } from '../../lib/formatters';
import { Search, RotateCcw, SlidersHorizontal, MapPin } from 'lucide-react';

interface SearchFilterProps {
  filters: PropertyFilters;
  onChange: (newFilters: PropertyFilters) => void;
  onReset: () => void;
  compact?: boolean;
}

const PROPERTY_TYPES: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'All Property Types', value: 'all' },
  { label: 'Independent House / Villa', value: 'villa' },
  { label: 'Townhouse / Double Story', value: 'townhouse' },
  { label: 'Residential Plot / Land', value: 'estate' },
  { label: 'Upper Portion / Apartment', value: 'apartment' },
  { label: 'Commercial Plaza / Shop', value: 'commercial' },
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

  const handleLocalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      locality: val === 'all' ? 'all' : val,
      city: 'Sadiqabad',
      page: 1,
    });
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
      <div className="card-pro bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-2xl border border-stone-200/90 dark:border-stone-800 max-w-4xl w-full mx-auto text-left">
        {/* Top Segmented Control (Buy / Rent / All) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleStatusChange('all')}
              className={`btn-pro px-4 py-1.5 rounded-md cursor-pointer ${
                filters.listing_status === 'all' || !filters.listing_status
                  ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              All Listings
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('for_sale')}
              className={`btn-pro px-4 py-1.5 rounded-md cursor-pointer ${
                filters.listing_status === 'for_sale'
                  ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              For Sale
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('for_rent')}
              className={`btn-pro px-4 py-1.5 rounded-md cursor-pointer ${
                filters.listing_status === 'for_rent'
                  ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              For Rent
            </button>
          </div>

          <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-800 dark:text-emerald-400 font-bold hidden sm:inline">
            Sadiqabad City Verified
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Sadiqabad Locality */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 mb-1">
              Sadiqabad Area / Colony
            </label>
            <select
              value={filters.locality === 'all' || !filters.locality ? 'all' : filters.locality}
              onChange={handleLocalityChange}
              className="w-full h-11 px-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-600 transition-all duration-200 cursor-pointer"
            >
              <option value="all">All Sadiqabad Localities</option>
              {SADIQABAD_LOCALITIES.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Residence Type */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 mb-1">
              Property Type
            </label>
            <select
              value={filters.property_type || 'all'}
              onChange={handleTypeChange}
              className="w-full h-11 px-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-600 transition-all duration-200 cursor-pointer"
            >
              {PROPERTY_TYPES.map(pt => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 mb-1">
              Keyword / Colony
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Model Town, 5 Marla, KLP Road..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                className="w-full h-11 pl-9 pr-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-600 placeholder-stone-400 dark:placeholder-stone-500 transition-all duration-200"
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
    <aside aria-label="Listing filters" className="card-pro bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-800" />
          <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
            Filter Sadiqabad
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

      {/* City Scope Note */}
      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] text-emerald-900 flex items-center gap-1.5 font-medium">
        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>Exclusively Sadiqabad City, District Rahim Yar Khan</span>
      </div>

      {/* Listing Status Toggle */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Listing Purpose
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
          Search Sadiqabad
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search colony, street, features..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full h-10 pl-9 pr-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Sadiqabad Locality / Area */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Locality / Colony
        </label>
        <select
          value={filters.locality === 'all' || !filters.locality ? 'all' : filters.locality}
          onChange={handleLocalityChange}
          className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800 cursor-pointer"
        >
          <option value="all">All Sadiqabad Localities</option>
          {SADIQABAD_LOCALITIES.map(loc => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Property Type
        </label>
        <select
          value={filters.property_type || 'all'}
          onChange={handleTypeChange}
          className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800 cursor-pointer"
        >
          {PROPERTY_TYPES.map(pt => (
            <option key={pt.value} value={pt.value}>
              {pt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Plot / Covered Area Quick Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Minimum Size (Marla)
        </label>
        <div className="grid grid-cols-4 gap-1 text-xs">
          {[
            { label: 'Any', value: 0 },
            { label: '3 Marla', value: 675 },
            { label: '5 Marla', value: 1125 },
            { label: '10 Marla', value: 2250 },
          ].map(opt => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange({ ...filters, min_area: opt.value || undefined, page: 1 })}
              className={`py-2 border rounded-md text-center cursor-pointer transition-colors ${
                (filters.min_area === opt.value) || (!filters.min_area && opt.value === 0)
                  ? 'bg-stone-900 border-stone-900 text-white font-bold'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget / Price Range Filter in Lakhs */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Budget / Price Range (بجٹ)
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { label: 'Any Budget', min: undefined, max: undefined },
            { label: 'Under 35 Lakh', min: undefined, max: 3500000 },
            { label: '35 - 50 Lakh', min: 3500000, max: 5000000 },
            { label: '50 - 90 Lakh', min: 5000000, max: 9000000 },
          ].map(b => {
            const isMatch = filters.min_price === b.min && filters.max_price === b.max;
            return (
              <button
                key={b.label}
                type="button"
                onClick={() => onChange({ ...filters, min_price: b.min, max_price: b.max, page: 1 })}
                className={`py-2 px-2 border rounded-md text-center cursor-pointer transition-colors text-[11px] ${
                  isMatch
                    ? 'bg-stone-900 border-stone-900 text-white font-bold'
                    : 'border-stone-200 text-stone-600 hover:border-stone-400 bg-stone-50'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Bedrooms
        </label>
        <div className="grid grid-cols-5 gap-1 text-xs">
          {['all', 2, 3, 4, 5].map(b => (
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

      {/* Sadiqabad Amenities Chips */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Features & Utilities
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SADIQABAD_AMENITIES.slice(0, 8).map(amenity => {
            const isSelected = (filters.amenities || []).includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-900 font-semibold'
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
