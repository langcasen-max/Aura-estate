import React, { useEffect, useState } from 'react';
import { Property, PropertyFilters } from '../types';
import { getFeaturedProperties } from '../services/propertyService';
import { isPropertyFavorite, toggleFavorite } from '../services/favoriteService';
import { PropertyCard } from '../components/property/PropertyCard';
import { SearchFilter } from '../components/property/SearchFilter';
import { siteConfig } from '../config/site';
import { updatePageSeo } from '../lib/seo';
import { ArrowRight, Compass, Shield, Award, FileText, ChevronRight } from 'lucide-react';

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
      title: 'Modern Luxury Real Estate',
      description: 'Discover rare architectural estates, waterfront villas, and sky penthouses with Aura Estates.',
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
    if (filters.city && filters.city !== 'all') {
      params.set('city', filters.city);
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
    // re-trigger re-render
    setFeaturedProperties(prev => [...prev]);
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-between pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-stone-950 text-white">
        {/* Full-bleed high-res background photography */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85)',
          }}
        />

        {/* Ambient Gradient Scrims for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/70 pointer-events-none" />

        {/* Hero Narrative Heading */}
        <div className="relative z-10 max-w-4xl mx-auto text-center my-auto pt-8">
          <span className="text-xs sm:text-sm tracking-[0.3em] uppercase font-mono text-amber-300/90 block mb-4">
            Private Portfolios & International Estates
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-stone-100 leading-[1.08] mb-6">
            Exceptional Residences for the Discerning Collector
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Representing the world’s most architecturally significant estates, coastal sanctuaries, and sky penthouses with
            uncompromising privacy.
          </p>
        </div>

        {/* Overlapping Hero Search Card */}
        <div className="relative z-20 mt-12 w-full">
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
            <span className="text-xs font-mono tracking-widest uppercase text-amber-800 block mb-1">
              Curated Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900">
              Featured Global Residences
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/properties')}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-amber-800 transition-colors cursor-pointer group"
          >
            <span>Explore All Properties</span>
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

      {/* Bespoke Advisory Services Strip */}
      <section className="bg-stone-900 text-stone-100 py-20 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-widest uppercase text-amber-400 block mb-2">
              Bespoke Representation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-100 mb-4">
              Discreet Client Services
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Every client engagement is managed directly by an agency principal, offering complete anonymity,
              institutional valuation rigor, and tailored viewing access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-stone-950/60 p-6 rounded-xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-300 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-white">Private Viewings</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Helicopter transfer, secure motorcade coordinates, and after-hours access arranged with total privacy.
              </p>
            </div>

            <div className="bg-stone-950/60 p-6 rounded-xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-300 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-white">Architectural Dossiers</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Comprehensive deed histories, land surveys, structural analyses, and unreleased design schematics.
              </p>
            </div>

            <div className="bg-stone-950/60 p-6 rounded-xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-300 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-white">Acquisition Advisory</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Trust structuring, international cross-border compliance, and contract negotiation for trophy assets.
              </p>
            </div>

            <div className="bg-stone-950/60 p-6 rounded-xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-300 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-white">Bespoke Financing</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Syndicated private banking relationships and portfolio lending tailored to high-net-worth liquidity.
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
              Seek Counsel for Your Next Acquisition
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Connect directly with our senior concierge desk to review off-market opportunities and register specific
              architectural acquisition mandates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenEnquiry()}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs px-6 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
            >
              Request Advisory Call
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="bg-transparent hover:bg-white/10 text-stone-200 border border-stone-600 text-xs font-semibold px-6 py-3.5 rounded-full transition-all cursor-pointer"
            >
              Concierge Directory
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
