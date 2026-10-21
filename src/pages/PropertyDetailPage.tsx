import React, { useState, useEffect } from 'react';
import { Property, PropertyMedia } from '../types';
import { getPropertyByIdOrSlug, getRelatedProperties } from '../services/propertyService';
import { isPropertyFavorite, toggleFavorite } from '../services/favoriteService';
import { PropertyCard } from '../components/property/PropertyCard';
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

  const formattedPrice =
    property.listing_status === 'for_rent'
      ? `$${property.price.toLocaleString()} / month`
      : `$${property.price.toLocaleString()}`;

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

            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-medium">
              <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <span>
                {property.location.address}, {property.location.city}, {property.location.state} {property.location.postal_code}
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
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Interior Area</div>
              <div className="text-lg font-bold text-stone-800 flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-stone-400" />
                <span>{property.area_sqft.toLocaleString()} sq ft</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Accommodations</div>
              <div className="text-lg font-bold text-stone-800 flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-stone-400" />
                <span>{property.bedrooms} Beds • {property.bathrooms} Baths</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Year Completed</div>
              <div className="text-lg font-bold text-stone-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>{property.year_built || 'Recent'}</span>
              </div>
            </div>
          </div>

          {/* Editorial Narrative Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-2">
              Architectural Overview & Narrative
            </h3>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Estate Features */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-2">
              Features & Distinctions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.amenities.map((amenity: string) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-800"
                >
                  <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Sticky Concierge & Enquiry Card */}
        <div className="lg:col-span-1 sticky top-28 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800 block mb-1">
                Private Acquisition Representation
              </span>
              <div className="font-serif text-3xl font-bold text-stone-900">{formattedPrice}</div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onOpenEnquiry(property)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-xs py-3.5 px-6 rounded-full shadow-md transition-all cursor-pointer text-center"
              >
                Request Private Viewing
              </button>

              <button
                type="button"
                onClick={() => onOpenEnquiry(property)}
                className="w-full bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 font-semibold text-xs py-3.5 px-6 rounded-full transition-all cursor-pointer text-center"
              >
                Request Architectural Dossier
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-2 text-[11px] text-stone-500 leading-snug">
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>NDA & Discretion Protocol</span>
              </div>
              <p>
                All acquisitions and viewings are conducted under strict non-disclosure. Verified financial credentials
                required prior to on-site access.
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
              Related Notable Residences
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('/properties')}
              className="text-xs font-bold text-stone-800 hover:text-amber-800"
            >
              View Full Portfolio
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
