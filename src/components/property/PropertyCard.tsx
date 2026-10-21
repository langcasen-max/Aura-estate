import React from 'react';
import { Property } from '../../types';
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
  const formattedPrice =
    property.listing_status === 'for_rent'
      ? `$${property.price.toLocaleString()} / mo`
      : `$${property.price.toLocaleString()}`;

  const statusLabel =
    property.listing_status === 'for_sale'
      ? 'For Acquisition'
      : property.listing_status === 'for_rent'
      ? 'Private Lease'
      : property.listing_status === 'sold'
      ? 'Acquired / Sold'
      : 'Contract Pending';

  return (
    <article
      onClick={() => onSelectProperty(property.slug || property.id)}
      className="group bg-white rounded-xl overflow-hidden border border-stone-200/90 hover:border-stone-400/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* 4:3 Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={property.featured_image}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Gradient Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm ${
              property.listing_status === 'for_sale'
                ? 'bg-stone-900 text-stone-100'
                : property.listing_status === 'for_rent'
                ? 'bg-amber-900 text-amber-100'
                : 'bg-stone-600 text-white'
            }`}
          >
            {statusLabel}
          </span>

          {/* Favourite button */}
          <button
            type="button"
            onClick={e => onToggleFavorite(e, property.id)}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
            aria-label={isFavorite ? 'Remove from saved' : 'Save residence'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>
        </div>

        {/* Bottom Property Type Pill */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="text-[10px] font-medium tracking-wider uppercase bg-stone-950/70 text-stone-200 px-2 py-0.5 rounded backdrop-blur-xs">
            {property.property_type}
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="font-serif text-2xl font-normal text-stone-900 tracking-tight mb-1">
            {formattedPrice}
          </div>

          {/* Title */}
          <h3 className="font-sans font-bold text-base text-stone-900 leading-snug group-hover:text-amber-800 transition-colors line-clamp-1 mb-1.5">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span className="truncate">
              {property.location.city}, {property.location.state}
            </span>
          </div>
        </div>

        {/* Key Facts Row: Beds / Baths / Sq Ft */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-1.5" title={`${property.bedrooms} Bedrooms`}>
            <Bed className="w-4 h-4 text-stone-400" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1.5" title={`${property.bathrooms} Bathrooms`}>
            <Bath className="w-4 h-4 text-stone-400" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1.5" title={`${property.area_sqft} Square Feet`}>
            <Maximize2 className="w-4 h-4 text-stone-400" />
            <span>{property.area_sqft.toLocaleString()} sq ft</span>
          </div>
        </div>
      </div>
    </article>
  );
};
