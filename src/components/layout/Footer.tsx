import React from 'react';
import { siteConfig } from '../../config/site';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-amber-300/40 rounded-full flex items-center justify-center font-serif text-lg text-amber-200">
                A
              </div>
              <span className="font-serif text-2xl tracking-widest uppercase text-stone-100">
                {siteConfig.agency_name}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An editorial showcase of world-class private residences, architecturally significant estates, and
              curated penthouses for discerning global collectors.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-400/90 font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Licensed Luxury Real Estate Brokerage</span>
            </div>
          </div>

          {/* Col 2: Portfolio Links (working filtered links) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-stone-100">
              Portfolio
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  All Residences
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?listing_status=for_sale')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Acquisitions (For Sale)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?listing_status=for_rent')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Private Leases (For Rent)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?type=penthouse')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Penthouses & Sky Residences
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?type=villa')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Waterfront & Ocean Villas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?type=estate')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Historic & Alpine Estates
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Agency & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-stone-100">
              Advisory
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  The Agency & Ethos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Private Viewing Requests
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Architectural Dossiers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Acquisition Financing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/dashboard')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Client Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-stone-100">
              Concierge Office
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-stone-200">
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-stone-200">
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.agency_name}. All rights reserved. Equal Housing Opportunity.</p>
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => onNavigate('/about')} className="hover:text-stone-300 cursor-pointer">
              Privacy Policy
            </button>
            <button type="button" onClick={() => onNavigate('/about')} className="hover:text-stone-300 cursor-pointer">
              Terms of Advisory
            </button>
            <button type="button" onClick={() => onNavigate('/contact')} className="hover:text-stone-300 cursor-pointer">
              Fair Housing Pledge
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
