import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Property, PropertyInquiry } from '../types';
import { getPropertiesByIds } from '../services/propertyService';
import { getLocalFavorites, toggleFavorite } from '../services/favoriteService';
import { getInquiries } from '../services/inquiryService';
import { PropertyCard } from '../components/property/PropertyCard';
import { Heart, FileText, User, ShieldCheck, ArrowRight, Clock, Calendar } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  onFavoritesChanged: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onFavoritesChanged }) => {
  const { user, isAdmin, isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'saved' | 'inquiries'>('saved');
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedIds = getLocalFavorites();
    getPropertiesByIds(savedIds).then(res => setSavedProperties(res));

    // Get inquiries for this user or all in demo
    const allInquiries = getInquiries();
    if (user?.email) {
      const myInquiries = allInquiries.filter(
        i => (i.email.toLowerCase() === user.email.toLowerCase()) || (user.id && i.user_id === user.id)
      );
      setInquiries(myInquiries.length > 0 ? myInquiries : allInquiries);
    } else {
      setInquiries(allInquiries);
    }

    setLoading(false);
  }, [user]);

  const handleToggleFav = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
    onFavoritesChanged();
    setSavedProperties(prev => prev.filter(p => p.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'contacted':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'qualified':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'closed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Client Greeting Header */}
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800 block mb-1">
            Client Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-tight">
            Welcome back, {user?.full_name || 'Valued Client'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your saved residences, review submitted dossiers, and track viewing itineraries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold px-5 py-2.5 rounded-full shadow flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Console</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('/profile')}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-4 py-2.5 rounded-full cursor-pointer transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-4 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 py-2 px-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span>Saved Residences ({savedProperties.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 py-2 px-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <FileText className="w-4 h-4 text-stone-500" />
          <span>My Enquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* Tab 1: Saved Residences */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {savedProperties.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-2xl text-stone-900">No saved residences yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                Click the heart icon on any residence in our catalogue to curate your personal private portfolio.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/properties')}
                className="bg-stone-900 text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer hover:bg-stone-800"
              >
                Browse Residences
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFav}
                  onSelectProperty={slug => onNavigate(`/property/${slug}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Enquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
              <FileText className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-2xl text-stone-900">No active enquiries</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                When you request a private viewing or architectural dossier, your request status and schedule will be
                tracked here.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/properties')}
                className="bg-stone-900 text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer hover:bg-stone-800"
              >
                Explore Listings
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
              {inquiries.map(inq => (
                <div key={inq.id} className="p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          {inq.property_title || 'General Agency Advisory'}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(inq.status)}`}>
                          {inq.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 capitalize">
                        Type: {inq.inquiry_type}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-400 font-mono">
                      Submitted: {new Date(inq.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100 leading-relaxed">
                    "{inq.message}"
                  </p>

                  {inq.preferred_date && (
                    <div className="flex items-center gap-3 text-xs text-amber-900 font-medium pt-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>Viewing Requested: {inq.preferred_date} ({inq.preferred_time})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
