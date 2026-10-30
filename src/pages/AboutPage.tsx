import React, { useEffect } from 'react';
import { siteConfig } from '../config/site';
import { updatePageSeo } from '../lib/seo';
import { ShieldCheck, Compass, Award, Building2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenEnquiry }) => {
  useEffect(() => {
    updatePageSeo({
      title: 'About The Agency & Ethos',
      description: 'Aura Estates is a boutique luxury real estate advisory representing landmark residences across global capital markets.',
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono tracking-widest uppercase text-amber-800 block">
          The Agency & Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-stone-900 leading-[1.1]">
          A Gallery, Not a Marketplace.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed">
          Founded on the principle of discreet architectural stewardship, {siteConfig.agency_name} was conceived as a
          private salon for the world’s most distinctive residential real estate.
        </p>
      </div>

      {/* Hero Image Showcase */}
      <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-xl bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Modern Architectural Interior"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-pro group bg-white dark:bg-stone-900 p-7 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">Uncompromising Discretion</h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-light">
            We operate with the confidentiality protocols of a private family office. Every prospective buyer is vetted,
            and sensitive estate documentation is safeguarded under strict NDAs.
          </p>
        </div>

        <div className="card-pro group bg-white dark:bg-stone-900 p-7 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">Architectural Integrity</h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-light">
            We represent homes that possess structural and artistic significance. From solid lenter construction to bespoke
            modern elevations, our listings are selected for lasting quality.
          </p>
        </div>

        <div className="card-pro group bg-white dark:bg-stone-900 p-7 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">Principal-Led Advisory</h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-light">
            Clients never deal with junior associates. Every transaction, negotiation, and private showing is guided
            directly by a senior partner with verified Sadiqabad property experience.
          </p>
        </div>
      </div>

      {/* Executive Presence Box */}
      <div className="card-pro bg-stone-900 text-stone-100 rounded-3xl p-10 sm:p-14 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400 font-bold">Sadiqabad Main Office</span>
          <h3 className="font-serif text-3xl sm:text-4xl text-stone-100">
            Visit Our Sadiqabad Office
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
            Located conveniently on Main KLP Road near Railway Station Chowk, Sadiqabad. Available for in-person property consultations, family inspection tours, and direct ownership registry verification.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenEnquiry}
          className="btn-pro bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-8 py-4 rounded-full shadow-lg transition-all cursor-pointer flex-shrink-0"
        >
          Book Property Visit
        </button>
      </div>
    </div>
  );
};
