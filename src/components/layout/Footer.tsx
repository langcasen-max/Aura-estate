import React from 'react';
import { siteConfig } from '../../config/site';
import { Logo } from '../common/Logo';
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
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-left cursor-pointer focus:outline-none"
              aria-label="Sadiqabad Estates Home"
            >
              <Logo variant="horizontal" size="md" theme="dark" showTagline={true} />
            </button>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Sadiqabad’s trusted real estate marketplace. Verified houses, residential plots, and commercial properties across Model Town, Allama Iqbal Town, Mazhar Fareed Colony, Satellite Town, and KLP Road.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Sadiqabad Property Network</span>
            </div>
          </div>

          {/* Col 2: Portfolio Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-stone-100">
              Sadiqabad Properties
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  All Properties in Sadiqabad
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?listing_status=for_sale')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Houses For Sale (Buy)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?listing_status=for_rent')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Family Residences (For Rent)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?locality=Model%20Town')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Model Town Sadiqabad
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?locality=Allama%20Iqbal%20Town')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Allama Iqbal Town
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/properties?type=commercial')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Commercial Plazas & Shops
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Local Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-stone-100">
              Local Assistance
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  About Our Sadiqabad Office
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Schedule On-Site Inspection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Arazi Record & Registry Verification
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Direct Owner Deal Structuring
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/login?next=/admin')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-stone-100">
              Sadiqabad Office
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-stone-200">
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-stone-200">
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.agency_name}. Exclusively Sadiqabad City, District Rahim Yar Khan, Punjab.</p>
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => onNavigate('/about')} className="hover:text-stone-300 cursor-pointer">
              Privacy Policy
            </button>
            <button type="button" onClick={() => onNavigate('/about')} className="hover:text-stone-300 cursor-pointer">
              Terms of Service
            </button>
            <button type="button" onClick={() => onNavigate('/contact')} className="hover:text-stone-300 cursor-pointer">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
