import React, { useEffect, useState } from 'react';
import { Property, PropertyFilters } from '../types';
import { getFeaturedProperties } from '../services/propertyService';
import { isPropertyFavorite, toggleFavorite } from '../services/favoriteService';
import { PropertyCard } from '../components/property/PropertyCard';
import { SearchFilter } from '../components/property/SearchFilter';
import { SADIQABAD_LOCALITIES } from '../lib/formatters';
import { updatePageSeo } from '../lib/seo';
import { ArrowRight, ShieldCheck, MapPin, Building, CheckCircle2, Phone, Home } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: (property?: Property) => void;
  onFavoritesChanged: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenEnquiry,
  onFavoritesChanged,
}) => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updatePageSeo({
      title: 'Sadiqabad Real Estate — Properties & Houses in Sadiqabad',
      description: 'Find verified houses, residential plots, and commercial shops for sale and rent exclusively in Sadiqabad City, Punjab.',
    });

    getFeaturedProperties()
      .then(res => setFeaturedProperties(res))
      .finally(() => setIsLoading(false));
  }, []);

  const handleHeroFilterChange = (filters: PropertyFilters) => {
    const params = new URLSearchParams();
    if (filters.listing_status && filters.listing_status !== 'all') {
      params.set('listing_status', filters.listing_status);
    }
    if (filters.property_type && filters.property_type !== 'all') {
      params.set('type', filters.property_type);
    }
    if (filters.locality && filters.locality !== 'all') {
      params.set('locality', filters.locality);
    }
    if (filters.search) {
      params.set('q', filters.search);
    }
    onNavigate(`/properties?${params.toString()}`);
  };

  const handleToggleFav = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
    onFavoritesChanged();
    setFeaturedProperties(prev => [...prev]);
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-[82vh] flex flex-col justify-between pt-20 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden bg-stone-950 text-white">
        {/* Background photography */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85)',
          }}
        />

        {/* Ambient Gradient Scrims for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/75 pointer-events-none" />

        {/* Hero Narrative Heading */}
        <div className="relative z-10 max-w-4xl mx-auto text-center my-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dedicated Exclusively to Sadiqabad City</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-stone-100 leading-[1.08] mb-5">
            Find Your Dream Home in Sadiqabad
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Verified modern double-story houses, luxury corner villas, residential plots, and prime commercial plazas across Model Town, Allama Iqbal Town, Mazhar Fareed, Satellite Town, and KLP Road.
          </p>

          {/* Quick Locality Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {['Model Town', 'Allama Iqbal Town', 'Mazhar Fareed Colony', 'Satellite Town', 'Main KLP Road Commercial'].map(loc => (
              <button
                key={loc}
                type="button"
                onClick={() => onNavigate(`/properties?locality=${encodeURIComponent(loc)}`)}
                className="px-3 py-1 rounded-full bg-stone-900/80 hover:bg-emerald-900/80 text-stone-300 hover:text-white border border-stone-700 text-xs transition-colors cursor-pointer"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Overlapping Hero Search Card */}
        <div className="relative z-20 mt-10 w-full">
          <SearchFilter
            compact
            filters={{}}
            onChange={handleHeroFilterChange}
            onReset={() => {}}
          />
        </div>
      </section>

      {/* Featured Residences Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-emerald-800 font-bold block mb-1">
              Sadiqabad Prime Listings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900">
              Featured Homes & Properties
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/properties')}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer group"
          >
            <span>View All Sadiqabad Properties</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-stone-200/60 rounded-xl aspect-[4/3] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
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
      </section>

      {/* Sadiqabad Localities Showcase Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-2xl p-8 sm:p-10 border border-stone-200">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono tracking-widest uppercase text-emerald-800 font-bold block mb-1">
              Top Residential & Commercial Sectors
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900">
              Explore Sadiqabad Localities
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Select an area to explore verified properties with Sui Gas, sweet drinking water, and carpeted access roads.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SADIQABAD_LOCALITIES.slice(0, 8).map(loc => (
              <button
                key={loc}
                type="button"
                onClick={() => onNavigate(`/properties?locality=${encodeURIComponent(loc)}`)}
                className="p-4 bg-white hover:bg-emerald-50 rounded-xl border border-stone-200 hover:border-emerald-300 transition-all text-left group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs text-stone-900 group-hover:text-emerald-900">{loc}</span>
                </div>
                <span className="text-[11px] text-stone-500">Sadiqabad, Punjab</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sadiqabad Trust & Services Strip */}
      <section className="bg-stone-900 text-stone-100 py-16 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 block mb-2 font-bold">
              Trusted Sadiqabad Property Network
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-100 mb-3">
              Why Buy & Sell With Us in Sadiqabad
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              We specialize strictly in Sadiqabad properties, providing complete registry verification, fair market pricing, and family inspection coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-stone-950/70 p-6 rounded-xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-900/40 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-white">Registry & Fard Verification</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Legal ownership check and Arazi Record verification for all residential and commercial plots before deal closing.
              </p>
            </div>

            <div className="bg-stone-950/70 p-6 rounded-xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-900/40 text-emerald-400 flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-white">Direct Owner Negotiations</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct buyer-to-owner transparency without inflated intermediary markups, ensuring fair PKR rates.
              </p>
            </div>

            <div className="bg-stone-950/70 p-6 rounded-xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-900/40 text-emerald-400 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-white">Commercial Frontage Expertise</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Specialized in high-footfall commercial plots, shop rentals, and plazas along Main KLP Road and Railway Road.
              </p>
            </div>

            <div className="bg-stone-950/70 p-6 rounded-xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-900/40 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-white">Utilities & Sweet Water</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Detailed confirmation of Sui Gas connection status, 3-phase electricity, and sweet water bore quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-2xl p-10 sm:p-14 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-stone-800 shadow-xl">
          <div className="max-w-xl space-y-2">
            <h3 className="font-serif text-3xl sm:text-4xl text-stone-100">
              Looking to Buy or Sell a House in Sadiqabad?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Contact our local Sadiqabad office on Main KLP Road for immediate property valuation or to schedule a viewing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenEnquiry()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
            >
              Contact Local Office
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/properties')}
              className="bg-transparent hover:bg-white/10 text-stone-200 border border-stone-600 text-xs font-semibold px-6 py-3.5 rounded-full transition-all cursor-pointer"
            >
              Browse All Houses
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
