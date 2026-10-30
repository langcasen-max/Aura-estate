import React, { useState, useEffect } from 'react';
import { Property, PropertyMedia } from '../types';
import { getPropertyByIdOrSlug, getRelatedProperties } from '../services/propertyService';
import { isPropertyFavorite, toggleFavorite } from '../services/favoriteService';
import { PropertyCard } from '../components/property/PropertyCard';
import { formatPKR, formatArea } from '../lib/formatters';
import { updatePageSeo } from '../lib/seo';
import {
  Bed,
  Bath,
  Maximize2,
  Calendar,
  MapPin,
  Heart,
  Share2,
  Check,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize,
  X,
  Phone,
  MessageCircle,
  Building,
  FileCheck,
  Car,
  Droplets,
  Flame,
  Zap,
  Layers,
  Navigation,
} from 'lucide-react';

interface PropertyDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenEnquiry: (property: Property) => void;
  onFavoritesChanged: () => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenEnquiry,
  onFavoritesChanged,
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getPropertyByIdOrSlug(slug)
      .then((res: Property | null) => {
        if (cancelled) return;
        setProperty(res);
        if (res) {
          updatePageSeo({
            title: res.title,
            description: res.description.slice(0, 160),
            image: res.featured_image,
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'SingleFamilyResidence',
              name: res.title,
              description: res.description,
              image: res.featured_image,
              numberOfRooms: res.bedrooms,
              floorSize: {
                '@type': 'QuantitativeValue',
                value: res.area_sqft,
                unitCode: 'FTK',
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: res.location.address,
                addressLocality: res.location.city,
                addressRegion: res.location.state,
                postalCode: res.location.postal_code,
                addressCountry: res.location.country,
              },
            },
          });

          getRelatedProperties(res, 3).then((related: Property[]) => {
            if (!cancelled) setRelatedProperties(related);
          });
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-stone-200 rounded" />
        <div className="h-96 w-full bg-stone-200 rounded-2xl" />
        <div className="h-10 w-2/3 bg-stone-200 rounded" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="font-serif text-4xl text-stone-900">Residence Unavailable</h2>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          The requested private listing may have concluded acquisition, transitioned off-market, or the URL slug is
          unrecognized.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/properties')}
          className="inline-flex items-center gap-2 bg-stone-900 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Residences Catalogue</span>
        </button>
      </div>
    );
  }

  // Gallery items list
  const galleryImages = [
    property.featured_image,
    ...(property.media?.map((m: PropertyMedia) => m.url).filter((u: string) => u !== property.featured_image) || []),
  ];

  const formattedPrice = formatPKR(property.price, property.listing_status === 'for_rent');

  const isFav = isPropertyFavorite(property.id);

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
    onFavoritesChanged();
    setProperty({ ...property }); // force state sync
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Link & Actions Bar */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <button
          type="button"
          onClick={() => onNavigate('/properties')}
          className="inline-flex items-center gap-1.5 hover:text-stone-900 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Residence'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleFav}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full border transition-colors cursor-pointer ${
              isFav
                ? 'border-amber-300 bg-amber-50 text-amber-900 font-semibold'
                : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-600 text-amber-600' : ''}`} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Gallery Showcase */}
      <div className="space-y-4">
        {/* Main Cover Display */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-stone-900 group shadow-lg">
          <img
            src={galleryImages[activeMediaIndex] || property.featured_image}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Fullscreen Trigger */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 bg-stone-950/70 hover:bg-stone-950 text-white p-2.5 rounded-full backdrop-blur-xs shadow-md transition-all cursor-pointer"
            title="Open Fullscreen Lightbox"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Prev / Next Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveMediaIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1))
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-stone-950/60 hover:bg-stone-950 text-white p-2.5 rounded-full backdrop-blur-xs transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveMediaIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-stone-950/60 hover:bg-stone-950 text-white p-2.5 rounded-full backdrop-blur-xs transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image index counter */}
          <div className="absolute top-4 left-4 bg-stone-950/70 text-white text-[11px] font-mono px-3 py-1 rounded-full backdrop-blur-xs">
            {activeMediaIndex + 1} / {galleryImages.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {galleryImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveMediaIndex(idx)}
                className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                  activeMediaIndex === idx ? 'border-amber-600 scale-102 shadow-md' : 'border-transparent opacity-65 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Residence Details & Sticky Enquiry Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left 2 Cols: Title, Facts, Description, Amenities */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono tracking-widest uppercase bg-stone-100 text-stone-800 px-3 py-1 rounded-full font-bold">
                {property.property_type}
              </span>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                {property.listing_status === 'for_sale' ? 'For Acquisition' : 'Private Lease'}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 leading-tight mb-2">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                {property.location.address}, {property.location.locality ? `${property.location.locality}, ` : ''}Sadiqabad, Punjab 64350
              </span>
            </div>
          </div>

          {/* Key Facts Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-stone-200/90 shadow-xs">
            <div>
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Price</div>
              <div className="font-serif text-2xl font-bold text-stone-900">{formattedPrice}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Plot & Covered Area</div>
              <div className="text-base sm:text-lg font-bold text-stone-800 flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-emerald-600" />
                <span>{formatArea(property.area_sqft, property.area_marla)}</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                {property.property_type === 'estate' ? 'Property Category' : 'Accommodations'}
              </div>
              <div className="text-base sm:text-lg font-bold text-stone-800 flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-stone-400" />
                <span>
                  {property.property_type === 'estate'
                    ? property.features?.plot_dimensions
                      ? `Plot (${property.features.plot_dimensions})`
                      : 'Residential Plot'
                    : property.bedrooms > 0
                    ? `${property.bedrooms} Beds • ${property.bathrooms} Baths`
                    : 'Commercial Unit'}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                {property.property_type === 'estate' ? 'Possession Status' : 'Year Built'}
              </div>
              <div className="text-base sm:text-lg font-bold text-stone-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>
                  {property.property_type === 'estate'
                    ? property.features?.possession_status || 'Immediate Possession'
                    : property.year_built || 'Newly Built'}
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Narrative Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-2">
              Property Details & Overview
            </h3>
            <div className="p-6 bg-stone-50/70 rounded-2xl border border-stone-200/90 space-y-4">
              <p className="text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {property.description}
              </p>
            </div>
          </div>

          {/* DYNAMIC SPECIFICATIONS ACCORDING TO PROPERTY TYPE */}

          {/* 1. PLOT SPECIFICATIONS (پلاٹ کی تفصیلی اور قانونی معلومات) */}
          {property.property_type === 'estate' && property.features && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                <h3 className="font-serif text-2xl text-stone-900">
                  Plot Specifications & Legal Details
                </h3>
                <span className="text-xs font-semibold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                  پلاٹ کی تفصیلی و قانونی معلومات
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {property.features.plot_dimensions && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Maximize2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Plot Dimensions (پلاٹ کی پیمائش)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.plot_dimensions}</div>
                    </div>
                  </div>
                )}

                {property.features.possession_status && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Possession Status (قبضہ کی صورتحال)</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-950 mt-0.5">{property.features.possession_status}</div>
                    </div>
                  </div>
                )}

                {property.features.is_corner && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Corner Plot Status (کارنر پلاٹ)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.is_corner}</div>
                    </div>
                  </div>
                )}

                {property.features.is_park_facing && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Park Facing (پارک فیسنگ)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.is_park_facing}</div>
                    </div>
                  </div>
                )}

                {property.features.boundary_wall && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Building className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Boundary Wall & Gate (چار دیواری)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.boundary_wall}</div>
                    </div>
                  </div>
                )}

                {property.features.street_width && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Street / Road Access (روڈ اور گلی کی چوڑائی)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.street_width}</div>
                    </div>
                  </div>
                )}

                {property.features.registry_status && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Legal Registry & Title (رجسٹری و انتقال)</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-950 mt-0.5">{property.features.registry_status}</div>
                    </div>
                  </div>
                )}

                {property.features.water_source && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Droplets className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Colony Utilities (گیس، پانی، بجلی کی سہولیات)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.water_source}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. COMMERCIAL SPECIFICATIONS (کمرشل تفاصیل) */}
          {property.property_type === 'commercial' && property.features && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                <h3 className="font-serif text-2xl text-stone-900">
                  Commercial Plaza & Shop Details
                </h3>
                <span className="text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
                  کمرشل تفاصیل و کاروباری تفصیلات
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {property.features.commercial_frontage && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Maximize2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Frontage Width (فرنٹ چوڑائی)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.commercial_frontage}</div>
                    </div>
                  </div>
                )}

                {property.features.rental_income && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs flex items-start gap-3">
                    <Zap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Monthly Rental Income (ماہانہ کرایہ)</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-950 mt-0.5">{property.features.rental_income}</div>
                    </div>
                  </div>
                )}

                {property.features.structure_type && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Building className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Structure & Floors (منزلیں اور شٹرز)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.structure_type}</div>
                    </div>
                  </div>
                )}

                {property.features.street_width && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Road & Boulevard (روڈ کا سائز)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.street_width}</div>
                    </div>
                  </div>
                )}

                {property.features.registry_status && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Registry & Approvals (رجسٹری و منظوری)</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-950 mt-0.5">{property.features.registry_status}</div>
                    </div>
                  </div>
                )}

                {property.features.electricity && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Commercial Electricity (بجلی میٹر)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.electricity}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. RESIDENTIAL HOUSE SPECIFICATIONS (گھر کی تفصیلی اور تکنیکی معلومات) */}
          {property.property_type !== 'estate' && property.property_type !== 'commercial' && property.features && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                <h3 className="font-serif text-2xl text-stone-900">
                  House Specifications & Construction Details
                </h3>
                <span className="text-xs font-semibold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                  گھر کی تکنیکی و قانونی تفصیلات
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {property.features.structure_type && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Building className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Structure & Lenter (تعمیر و لنٹر)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.structure_type}</div>
                    </div>
                  </div>
                )}

                {property.features.registry_status && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Legal Registry & Title (رجسٹری و انتقال)</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-950 mt-0.5">{property.features.registry_status}</div>
                    </div>
                  </div>
                )}

                {property.features.car_porch && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Car className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Car Porch & Parking (کار پورچ)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.car_porch}</div>
                    </div>
                  </div>
                )}

                {property.features.water_source && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Droplets className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Water Supply & Boring (میٹھا پانی بور)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.water_source}</div>
                    </div>
                  </div>
                )}

                {property.features.gas_status && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Flame className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Gas Connection (سوئی گیس)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.gas_status}</div>
                    </div>
                  </div>
                )}

                {property.features.electricity && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Electricity (واپڈا میٹر)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.electricity}</div>
                    </div>
                  </div>
                )}

                {property.features.flooring && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Layers className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Flooring & Finishing (فرش و ماربل)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.flooring}</div>
                    </div>
                  </div>
                )}

                {property.features.street_width && (
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Street Access (گلی کا سائز)</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">{property.features.street_width}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amenities & Estate Features */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-2">
              Colony Utilities & Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.amenities.map((amenity: string) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-800"
                >
                  <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Sticky Inquiry Card */}
        <div className="lg:col-span-1 sticky top-28 space-y-6">
          <div className="card-pro bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-5">
            <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-800 dark:text-emerald-400 font-bold block mb-1">
                Sadiqabad Property Desk
              </span>
              <div className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">{formattedPrice}</div>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1 block">
                Location: {property.location.locality || property.location.address}, Sadiqabad
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onOpenEnquiry(property)}
                className="btn-pro w-full bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-stone-100 dark:text-stone-950 font-bold text-xs py-3.5 px-6 rounded-full shadow-md transition-all cursor-pointer text-center"
              >
                Schedule Family Viewing
              </button>

              <a
                href={`https://wa.me/923008671234?text=${encodeURIComponent(`Assalam-o-Alaikum, I am inquiring about "${property.title}" in Sadiqabad.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-pro w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-6 rounded-full shadow-xs transition-all flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact via WhatsApp</span>
              </a>

              <a
                href="tel:+923008671234"
                className="w-full bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 font-semibold text-xs py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 text-center"
              >
                <Phone className="w-3.5 h-3.5 text-stone-600" />
                <span>Call Agency Agent</span>
              </a>
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-2 text-[11px] text-stone-500 leading-snug">
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Verified Sadiqabad Property</span>
              </div>
              <p>
                Registry documents, Fard, and colony layout plan verified before purchase. Direct deal with owner.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Residences */}
      {relatedProperties.length > 0 && (
        <section className="pt-16 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-3xl text-stone-900">
              Similar Sadiqabad Properties
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('/properties')}
              className="text-xs font-bold text-stone-800 hover:text-emerald-800"
            >
              View Full Sadiqabad Catalogue
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProperties.map(rel => (
              <PropertyCard
                key={rel.id}
                property={rel}
                isFavorite={isPropertyFavorite(rel.id)}
                onToggleFavorite={(e: React.MouseEvent, id: string) => {
                  e.stopPropagation();
                  toggleFavorite(id);
                  onFavoritesChanged();
                }}
                onSelectProperty={(s: string) => onNavigate(`/property/${s}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-fadeIn"
        >
          <div className="flex items-center justify-between text-white">
            <span className="text-xs font-mono">
              {activeMediaIndex + 1} of {galleryImages.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={galleryImages[activeMediaIndex]}
              alt={property.title}
              className="max-h-[85vh] max-w-full object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-white pb-4">
            <button
              type="button"
              onClick={() =>
                setActiveMediaIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1))
              }
              className="p-3 bg-stone-900/80 rounded-full hover:bg-stone-800 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveMediaIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1))
              }
              className="p-3 bg-stone-900/80 rounded-full hover:bg-stone-800 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
