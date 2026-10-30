import React from 'react';
import { Property } from '../../types';
import { formatPKR, formatArea } from '../../lib/formatters';
import { Bed, Bath, Maximize2, MapPin, Heart } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelectProperty: (slug: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
}) => {
  const formattedPrice = formatPKR(property.price, property.listing_status === 'for_rent');

  const statusLabel =
    property.listing_status === 'for_sale'
      ? 'For Sale'
      : property.listing_status === 'for_rent'
      ? 'For Rent'
      : property.listing_status === 'sold'
      ? 'Sold'
      : 'Contract Pending';

  const typeLabelMap: Record<string, string> = {
    villa: 'Independent House / Villa',
    townhouse: 'Townhouse / Double Story',
    estate: 'Plot / Land',
    apartment: 'Upper Portion / Flat',
    commercial: 'Commercial Plaza / Shop',
    penthouse: 'Luxury House',
  };

  const localityText = property.location.locality || property.location.address || 'Sadiqabad';

  return (
    <article
      onClick={() => onSelectProperty(property.slug || property.id)}
      className="group card-pro bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/50 dark:hover:border-amber-400/40 shadow-xs flex flex-col cursor-pointer"
    >
      {/* 4:3 Image Container with smooth cinematic zoom */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={property.featured_image}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Ambient Gradient Scrim for contrast & depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-80" />

        {/* Top Badges with micro-motion */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-xs transition-transform duration-300 group-hover:scale-102 ${
              property.listing_status === 'for_sale'
                ? 'bg-stone-950/85 text-emerald-300 border border-emerald-500/30'
                : property.listing_status === 'for_rent'
                ? 'bg-emerald-950/85 text-emerald-200 border border-emerald-500/30'
                : 'bg-stone-800/85 text-stone-200'
            }`}
          >
            {property.listing_status === 'for_sale' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-gentlePulse" />
            )}
            <span>{statusLabel}</span>
          </span>

          {/* Favourite button with tactile spring animation */}
          <button
            type="button"
            onClick={e => onToggleFavorite(e, property.id)}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-115 active:scale-90 pointer-events-auto cursor-pointer"
            aria-label={isFavorite ? 'Remove from saved' : 'Save residence'}
          >
            <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>
        </div>

        {/* Bottom Property Type Badge */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="text-[10px] font-medium tracking-wider uppercase bg-stone-950/80 text-stone-200 px-2.5 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
            {typeLabelMap[property.property_type] || property.property_type}
          </span>
        </div>
      </div>

      {/* Card Details with elevated typography */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Price with smooth color transition */}
          <div className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-1 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
            {formattedPrice}
          </div>

          {/* Title */}
          <h3 className="font-sans font-bold text-base text-stone-900 dark:text-stone-100 leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors line-clamp-1 mb-2">
            {property.title}
          </h3>

          {/* Locality with Pin icon */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-4">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <span className="truncate">
              {localityText}, Sadiqabad
            </span>
          </div>
        </div>

        {/* Key Facts Row: Beds / Baths / Marla & Sq Ft */}
        <div className="pt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-medium">
          {property.bedrooms > 0 ? (
            <>
              <div className="flex items-center gap-1.5" title={`${property.bedrooms} Bedrooms`}>
                <Bed className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <div className="flex items-center gap-1.5" title={`${property.bathrooms} Bathrooms`}>
                <Bath className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <span className="text-stone-300 dark:text-stone-700">•</span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                {property.property_type === 'estate'
                  ? property.features?.plot_dimensions
                    ? `Plot: ${property.features.plot_dimensions}`
                    : 'Residential Plot'
                  : property.features?.commercial_frontage
                  ? `Comm: ${property.features.commercial_frontage}`
                  : 'Commercial Unit'}
              </span>
              <span className="text-stone-300 dark:text-stone-700">•</span>
            </>
          )}

          <div className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-200" title="Plot & Covered Area">
            <Maximize2 className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
            <span>{formatArea(property.area_sqft, property.area_marla)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
