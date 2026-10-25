import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Property,
  PropertyInquiry,
  UserProfile,
  PropertyType,
  ListingStatus,
  InquiryStatus,
  InquiryType,
  SiteSettings,
  PropertyMedia,
} from '../types';
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  resetDefaultProperties,
  clearAllProperties,
} from '../services/propertyService';
import {
  getInquiries,
  updateInquiryStatus,
  updateInquiryNotes,
  deleteInquiry,
  exportInquiriesCsv,
  resetDefaultInquiries,
} from '../services/inquiryService';
import {
  getUsers,
  updateUserRole,
  createUser,
  deleteUser,
  resetDefaultUsers,
} from '../services/userService';
import { getAnalyticsSummary, AnalyticsSummary } from '../services/analyticsService';
import { getSiteSettings, updateSiteSettings, resetDefaultSettings } from '../services/settingsService';
import { generateSafeSlug } from '../lib/security';
import { processImageFile, isValidImageSource } from '../lib/imageUpload';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  Check,
  X,
  Edit2,
  Trash2,
  ExternalLink,
  Download,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Image as ImageIcon,
  Calendar,
  Phone,
  Mail,
  Filter,
  Sparkles,
  MapPin,
  Clock,
  UserPlus,
  Upload,
  Camera,
  Loader2,
} from 'lucide-react';
import {
  SADIQABAD_LOCALITIES,
  SADIQABAD_AMENITIES,
  formatPKR,
  formatArea,
  sqftToMarla,
  marlaToSqft,
} from '../lib/formatters';

type AdminTab = 'overview' | 'properties' | 'inquiries' | 'users' | 'analytics' | 'settings';

const LUXURY_AMENITY_OPTIONS = SADIQABAD_AMENITIES;

const PRESET_IMAGE_GALLERY = [
  { label: 'Model Town 10 Marla Luxury Double-Story House', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Allama Iqbal Town 5 Marla Modern Elevation', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Spanish Style Corner Villa Frontage', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Satellite Town Double Story House', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Main KLP Road Commercial Plaza Front', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Railway Road Commercial Building Front', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Designer Drawing Room & Marble Flooring', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Executive Kitchen with Ash Wood Cabinets', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Spacious Master Bedroom Interior', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80' },
  { label: '5 Marla Budget Single Story Home', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80' },
];

export const AdminDashboardPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Core Data
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings);

  const [loading, setLoading] = useState(true);

  // Property Filters in Admin
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState<string>('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  const [propertyFeaturedOnly, setPropertyFeaturedOnly] = useState(false);

  // Inquiry Filters in Admin
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState<string>('all');
  const [inquiryFilterType, setInquiryFilterType] = useState<string>('all');

  // User Filter in Admin
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Modals state
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteConfirmProp, setDeleteConfirmProp] = useState<Property | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<PropertyInquiry | null>(null);
  const [inquiryNoteDraft, setInquiryNoteDraft] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [resetConfirmAction, setResetConfirmAction] = useState<string | null>(null);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const reloadData = async () => {
    setLoading(true);
    try {
      const [propsRes, inqsRes, usersRes, anaRes] = await Promise.all([
        getProperties({}),
        getInquiries(),
        getUsers(),
        getAnalyticsSummary(),
      ]);
      setProperties(propsRes.properties);
      setInquiries(inqsRes);
      setUsersList(usersRes);
      setAnalytics(anaRes);
      setSiteSettings(getSiteSettings());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="font-serif text-3xl text-stone-900">Access Restricted</h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          The administrative operations console is strictly reserved for authenticated Aura Estates agency staff.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="bg-stone-900 text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer hover:bg-stone-800"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Quick toggle featured
  const handleToggleFeatured = async (p: Property) => {
    try {
      await updateProperty(p.id, { is_featured: !p.is_featured });
      showNotification('success', `Updated featured status for "${p.title}"`);
      reloadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update featured toggle');
    }
  };

  // Quick toggle listing status
  const handleStatusChange = async (p: Property, newStatus: ListingStatus) => {
    try {
      await updateProperty(p.id, { listing_status: newStatus });
      showNotification('success', `Status updated to "${newStatus.replace('_', ' ')}" for "${p.title}"`);
      reloadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update status');
    }
  };

  // Delete property confirm
  const handleDeleteProperty = async () => {
    if (!deleteConfirmProp) return;
    try {
      await deleteProperty(deleteConfirmProp.id);
      showNotification('success', `Residence "${deleteConfirmProp.title}" was deleted.`);
      setDeleteConfirmProp(null);
      reloadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete property');
    }
  };

  // Inquiry status change
  const handleInquiryStatusChange = async (inqId: string, status: InquiryStatus) => {
    try {
      const updated = await updateInquiryStatus(inqId, status);
      showNotification('success', `Enquiry status changed to ${status.toUpperCase()}`);
      reloadData();
      if (selectedInquiry && selectedInquiry.id === inqId) {
        setSelectedInquiry(updated);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update enquiry status');
    }
  };

  // Save Agency Notes on Inquiry
  const handleSaveInquiryNotes = async () => {
    if (!selectedInquiry) return;
    try {
      const updated = await updateInquiryNotes(selectedInquiry.id, inquiryNoteDraft);
      setSelectedInquiry(updated);
      showNotification('success', 'Agency internal note recorded.');
      reloadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save notes');
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inqId: string) => {
    if (!window.confirm('Delete this client enquiry permanently?')) return;
    try {
      await deleteInquiry(inqId);
      showNotification('success', 'Enquiry record removed from pipeline.');
      if (selectedInquiry?.id === inqId) setSelectedInquiry(null);
      reloadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete enquiry');
    }
  };

  // User role toggle
  const handleUserRoleToggle = async (targetUser: UserProfile) => {
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change ${targetUser.email} to ${nextRole.toUpperCase()}?`)) {
      return;
    }
    try {
      await updateUserRole(targetUser.id, nextRole);
      showNotification('success', `Role for ${targetUser.email} changed to ${nextRole}`);
      reloadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update user role');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Delete account for ${email}? This cannot be undone.`)) return;
    try {
      await deleteUser(userId);
      showNotification('success', `Account ${email} deleted.`);
      reloadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete user');
    }
  };

  // Filtered properties
  const filteredProperties = properties.filter(p => {
    if (propertySearch) {
      const q = propertySearch.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (propertyStatusFilter !== 'all' && p.listing_status !== propertyStatusFilter) return false;
    if (propertyTypeFilter !== 'all' && p.property_type !== propertyTypeFilter) return false;
    if (propertyFeaturedOnly && !p.is_featured) return false;
    return true;
  });

  // Filtered inquiries
  const filteredInquiries = inquiries.filter(i => {
    if (inquiryFilterStatus !== 'all' && i.status !== inquiryFilterStatus) return false;
    if (inquiryFilterType !== 'all' && i.inquiry_type !== inquiryFilterType) return false;
    if (inquirySearch) {
      const q = inquirySearch.toLowerCase();
      const match =
        i.full_name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        (i.phone && i.phone.toLowerCase().includes(q)) ||
        (i.property_title && i.property_title.toLowerCase().includes(q)) ||
        i.message.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered users
  const filteredUsers = usersList.filter(u => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearch) {
      const q = userSearch.toLowerCase();
      const match =
        u.email.toLowerCase().includes(q) ||
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.phone && u.phone.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Demo Data Reset Actions
  const handleExecuteReset = async (action: string) => {
    try {
      if (action === 'restore_demo_properties') {
        await resetDefaultProperties();
        showNotification('success', 'Restored 7 luxury demo properties to catalogue.');
      } else if (action === 'clear_all_properties') {
        await clearAllProperties();
        showNotification('success', 'Catalogue cleared. Ready for your real listings!');
      } else if (action === 'reset_inquiries') {
        await resetDefaultInquiries();
        showNotification('success', 'Default enquiries pipeline restored.');
      } else if (action === 'reset_users') {
        await resetDefaultUsers();
        showNotification('success', 'Default user accounts restored.');
      } else if (action === 'reset_settings') {
        resetDefaultSettings();
        showNotification('success', 'Agency settings reset to defaults.');
      }
      setResetConfirmAction(null);
      reloadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to complete reset action');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border ${
              notification.type === 'success'
                ? 'bg-stone-900 text-emerald-300 border-emerald-500/40 shadow-emerald-950/20'
                : 'bg-stone-900 text-red-300 border-red-500/40 shadow-red-950/20'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bg-stone-900 text-stone-100 p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded font-bold">
              Agency Operations Console
            </span>
            <span className="text-xs text-stone-400">
              Authenticated: <strong className="text-stone-200">{user?.email}</strong>
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-100">
            Aura Estates Management Suite
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Full administrative authority over real-time residences catalogue, buyer dossier enquiries, client accounts, and financial commission projections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/properties')}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 cursor-pointer transition-colors"
            title="Browse live site catalogue"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Site</span>
          </button>

          <button
            type="button"
            onClick={() => setResetConfirmAction('clear_all_properties')}
            className="bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-700/60 font-semibold text-xs px-4 py-2.5 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Purge all demo properties to start fresh with real listings"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Purge Demo Data</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingProperty(null);
              setPropertyModalOpen(true);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Residence Listing</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-2.5 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('properties')}
          className={`flex items-center gap-2 py-2.5 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'properties'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Properties ({properties.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 py-2.5 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Enquiries Pipeline ({inquiries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 py-2.5 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Accounts & Roles ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 py-2.5 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Commission</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 py-2.5 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Agency Settings & Data</span>
        </button>
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && analytics && (
        <div className="space-y-8 animate-fadeIn">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                <span>Active Listings</span>
                <Building2 className="w-4 h-4 text-stone-300" />
              </span>
              <div className="font-serif text-3xl font-bold text-stone-900">{analytics.totalListings}</div>
              <p className="text-[11px] text-stone-500">
                {analytics.activeForSale} for sale • {analytics.activeForRent} private leases
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                <span>Total Enquiries</span>
                <FileText className="w-4 h-4 text-stone-300" />
              </span>
              <div className="font-serif text-3xl font-bold text-stone-900">{analytics.totalInquiries}</div>
              <p className="text-[11px] text-amber-700 font-semibold">
                {analytics.newInquiries} priority requiring response
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                <span>Portfolio Valuation</span>
                <TrendingUp className="w-4 h-4 text-stone-300" />
              </span>
              <div className="font-serif text-2xl font-bold text-stone-900">
                {formatPKR(analytics.estimatedPortfolioValue)}
              </div>
              <p className="text-[11px] text-stone-500">Aggregate Sadiqabad listings value</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                <span>Agency Commission</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </span>
              <div className="font-serif text-2xl font-bold text-emerald-800">
                {formatPKR(analytics.estimatedCommission)}
              </div>
              <p className="text-[11px] text-stone-500">
                Projected at {(siteSettings.commission_rate * 100).toFixed(1)}% local agency fee
              </p>
            </div>
          </div>

          {/* Priority Action Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Priority Enquiries */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-serif text-2xl text-stone-900">Recent Enquiries</h3>
                  <p className="text-xs text-stone-500">Direct dossier and viewing requests from clients</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-bold text-stone-800 hover:text-amber-800 cursor-pointer"
                >
                  View All ({inquiries.length}) →
                </button>
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                {inquiries.slice(0, 5).map(inq => (
                  <div key={inq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-bold text-stone-900 flex items-center gap-2 flex-wrap">
                        <span>{inq.full_name}</span>
                        <span className="text-stone-400 font-normal">({inq.email})</span>
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                          {inq.inquiry_type}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px] line-clamp-1">
                        <strong className="text-stone-800">{inq.property_title || 'General Advisory'}:</strong>{' '}
                        {inq.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inq.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : inq.status === 'qualified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {inq.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setInquiryNoteDraft(inq.admin_notes || '');
                        }}
                        className="px-3 py-1 bg-stone-900 text-white rounded-md text-[11px] font-bold hover:bg-stone-800 cursor-pointer"
                      >
                        Open Dossier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Catalogue Summary */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-5">
              <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-3">
                Quick Shortcuts
              </h3>

              <div className="space-y-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProperty(null);
                    setPropertyModalOpen(true);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold border border-amber-200/70 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Plus className="w-4 h-4 text-amber-700" />
                    <span>Create New Residence Listing</span>
                  </div>
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportInquiriesCsv();
                    showNotification('success', 'Exported pipeline enquiries to CSV.');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold border border-stone-200 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-stone-600" />
                    <span>Export Enquiries to CSV</span>
                  </div>
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserModalOpen(true)}
                  className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold border border-stone-200 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-4 h-4 text-stone-600" />
                    <span>Add New Client / Staff User</span>
                  </div>
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold border border-stone-200 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="w-4 h-4 text-stone-600" />
                    <span>Reset or Clear Demo Data</span>
                  </div>
                  <span>→</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 text-stone-200 text-xs space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-bold">
                  Demo Mode Active
                </span>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  All listings, enquiries, and accounts persist in your browser’s localStorage. Feel free to add real property data, update prices, or clear the demo catalogue at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Properties Catalogue Table */}
      {activeTab === 'properties' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by title, city, address or slug..."
                  value={propertySearch}
                  onChange={e => setPropertySearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={propertyStatusFilter}
                  onChange={e => setPropertyStatusFilter(e.target.value)}
                  className="h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="for_sale">For Sale</option>
                  <option value="for_rent">For Rent</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={propertyTypeFilter}
                  onChange={e => setPropertyTypeFilter(e.target.value)}
                  className="h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800"
                >
                  <option value="all">All Property Types</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="estate">Estate</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                </select>

                <button
                  type="button"
                  onClick={() => setPropertyFeaturedOnly(!propertyFeaturedOnly)}
                  className={`h-10 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    propertyFeaturedOnly
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${propertyFeaturedOnly ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>Featured Only</span>
                </button>

                {properties.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setResetConfirmAction('clear_all_properties')}
                    className="h-10 px-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Purge all demo listings so you can add real properties"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Purge Demo Data</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setEditingProperty(null);
                    setPropertyModalOpen(true);
                  }}
                  className="h-10 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Residence</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-stone-500 flex items-center justify-between pt-1">
              <span>Showing {filteredProperties.length} of {properties.length} residences</span>
              {(propertySearch || propertyStatusFilter !== 'all' || propertyTypeFilter !== 'all' || propertyFeaturedOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setPropertySearch('');
                    setPropertyStatusFilter('all');
                    setPropertyTypeFilter('all');
                    setPropertyFeaturedOnly(false);
                  }}
                  className="text-amber-800 hover:underline font-semibold cursor-pointer"
                >
                  Clear search & filters
                </button>
              )}
            </div>
          </div>

          {/* Properties Table */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Residence</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Specs</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <Building2 className="w-12 h-12 text-stone-300 mx-auto" />
                          <h4 className="font-serif text-xl text-stone-800 font-semibold">
                            {properties.length === 0 ? 'All Demo Listings Purged' : 'No Matching Residences'}
                          </h4>
                          <p className="text-xs text-stone-500 leading-relaxed">
                            {properties.length === 0
                              ? 'The catalogue is completely fresh and ready for your real luxury properties. Click below to publish your first real residence with photos directly from your device.'
                              : 'No residences matched your search keywords or filter criteria.'}
                          </p>
                          <div className="flex items-center justify-center gap-3 pt-2">
                            {properties.length === 0 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProperty(null);
                                    setPropertyModalOpen(true);
                                  }}
                                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.02]"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>+ Add Your First Real Residence</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setResetConfirmAction('restore_demo_properties')}
                                  className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Restore Demo Data</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setPropertySearch('');
                                  setPropertyStatusFilter('all');
                                  setPropertyTypeFilter('all');
                                  setPropertyFeaturedOnly(false);
                                }}
                                className="text-amber-800 font-bold text-xs hover:underline cursor-pointer"
                              >
                                Clear search filters
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map(p => (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.featured_image}
                              alt={p.title}
                              className="w-12 h-10 object-cover rounded-lg border border-stone-200 shadow-2xs shrink-0"
                            />
                            <div>
                              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                <span>{p.title}</span>
                              </div>
                              <span className="text-[10px] text-stone-400 font-mono">/property/{p.slug}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-stone-700">
                          <span className="font-semibold block">{p.location.locality || p.location.address || 'Sadiqabad'}</span>
                          <span className="text-[10px] text-stone-400">{p.location.address || 'Sadiqabad, Punjab'}</span>
                        </td>

                        <td className="py-3.5 px-4 font-serif font-bold text-stone-900 text-sm">
                          {formatPKR(p.price, p.listing_status === 'for_rent')}
                        </td>

                        <td className="py-3.5 px-4 text-stone-600">
                          <span>{p.bedrooms > 0 ? `${p.bedrooms} beds • ${p.bathrooms} baths` : 'Commercial Unit'}</span>
                          <span className="block text-[10px] text-emerald-700 font-bold">{formatArea(p.area_sqft, p.area_marla)}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={p.listing_status}
                            onChange={e => handleStatusChange(p, e.target.value as ListingStatus)}
                            className={`px-2 py-1 rounded-md text-[11px] font-bold capitalize border cursor-pointer ${
                              p.listing_status === 'for_sale'
                                ? 'bg-stone-900 text-white border-stone-900'
                                : p.listing_status === 'for_rent'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : p.listing_status === 'sold'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-stone-200 text-stone-800 border-stone-300'
                            }`}
                          >
                            <option value="for_sale">For Sale</option>
                            <option value="for_rent">For Rent</option>
                            <option value="sold">Sold</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(p)}
                            className="p-1.5 rounded-full hover:bg-stone-100 cursor-pointer"
                            title={p.is_featured ? 'Pinned to Featured' : 'Pin to Featured'}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                p.is_featured ? 'fill-amber-500 text-amber-500' : 'text-stone-300 hover:text-stone-500'
                              }`}
                            />
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onNavigate(`/property/${p.slug}`)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 cursor-pointer"
                              title="View Live Listing"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProperty(p);
                                setPropertyModalOpen(true);
                              }}
                              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 cursor-pointer"
                              title="Edit Residence"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmProp(p)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50 cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Enquiries Pipeline */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Status KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Total Enquiries', count: inquiries.length, st: 'all' },
              { label: 'New / Unopened', count: inquiries.filter(i => i.status === 'new').length, st: 'new' },
              { label: 'Contacted', count: inquiries.filter(i => i.status === 'contacted').length, st: 'contacted' },
              { label: 'Qualified Buyer', count: inquiries.filter(i => i.status === 'qualified').length, st: 'qualified' },
              { label: 'Closed / Acquired', count: inquiries.filter(i => i.status === 'closed').length, st: 'closed' },
            ].map(item => (
              <button
                key={item.st}
                type="button"
                onClick={() => setInquiryFilterStatus(item.st)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  inquiryFilterStatus === item.st
                    ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                    : 'bg-white border-stone-200/90 text-stone-800 hover:border-stone-400'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                  inquiryFilterStatus === item.st ? 'text-stone-400' : 'text-stone-400'
                }`}>
                  {item.label}
                </span>
                <span className="font-serif text-2xl font-bold">{item.count}</span>
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by client name, email, phone, or residence..."
                value={inquirySearch}
                onChange={e => setInquirySearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={inquiryFilterType}
                onChange={e => setInquiryFilterType(e.target.value)}
                className="h-9 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800"
              >
                <option value="all">All Enquiry Types</option>
                <option value="viewing">Private Viewing</option>
                <option value="dossier">Architectural Dossier</option>
                <option value="advisory">Acquisition Advisory</option>
                <option value="financing">Financing</option>
                <option value="general">General Advisory</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  exportInquiriesCsv();
                  showNotification('success', 'Exported full enquiry dossier to CSV.');
                }}
                className="h-9 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Enquiries Table */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Enquiry Type</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Schedule</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-500">
                        No enquiries matching current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4">
                          <strong className="block text-stone-900">{inq.full_name}</strong>
                          <span className="text-[11px] text-stone-500 font-mono">{inq.email}</span>
                          {inq.phone && <span className="block text-[10px] text-stone-400">{inq.phone}</span>}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                            {inq.inquiry_type}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-stone-800 max-w-xs truncate">
                          {inq.property_title || 'General Agency Advisory'}
                        </td>

                        <td className="py-3.5 px-4 text-stone-600">
                          {inq.preferred_date ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Calendar className="w-3 h-3" />
                              {inq.preferred_date} {inq.preferred_time || ''}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">Immediate</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={inq.status}
                            onChange={e => handleInquiryStatusChange(inq.id, e.target.value as InquiryStatus)}
                            className={`px-2 py-1 rounded-md text-[11px] font-bold capitalize border cursor-pointer ${
                              inq.status === 'new'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : inq.status === 'contacted'
                                ? 'bg-blue-100 text-blue-900 border-blue-300'
                                : inq.status === 'qualified'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-stone-200 text-stone-800 border-stone-300'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setInquiryNoteDraft(inq.admin_notes || '');
                              }}
                              className="px-2.5 py-1 bg-stone-900 text-white rounded text-[11px] font-bold hover:bg-stone-800 cursor-pointer"
                            >
                              Open Dossier
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                              title="Delete Enquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Accounts & Roles */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Controls */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search client accounts by name or email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value)}
                className="h-9 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators Only</option>
                <option value="user">Clients Only</option>
              </select>

              <button
                type="button"
                onClick={() => setUserModalOpen(true)}
                className="h-9 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Role Access</th>
                    <th className="py-3 px-4">Enquiries Submissions</th>
                    <th className="py-3 px-4">Member Since</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-800 text-amber-300 font-serif font-bold text-sm flex items-center justify-center shrink-0">
                            {u.full_name ? u.full_name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <strong className="block text-stone-900">{u.full_name || 'Client Account'}</strong>
                            <span className="text-stone-500 font-mono text-[11px]">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                        {u.phone || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {u.role === 'admin' ? 'Agency Staff / Admin' : 'Registered Client'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-stone-700 font-semibold">
                        {u.inquiry_count || 0} enquiries
                      </td>

                      <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleUserRoleToggle(u)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                              u.role === 'admin'
                                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                : 'bg-amber-600 text-white hover:bg-amber-500'
                            }`}
                          >
                            {u.role === 'admin' ? 'Demote to Client' : 'Promote to Admin'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Analytics & Financial */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Total Portfolio Valuation
              </span>
              <div className="font-serif text-4xl font-bold text-stone-900">
                ${(analytics.estimatedPortfolioValue / 1000000).toFixed(2)}M
              </div>
              <p className="text-xs text-stone-500">Across {analytics.totalListings} active residences</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Projected Agency Fees
              </span>
              <div className="font-serif text-4xl font-bold text-emerald-800">
                ${(analytics.estimatedCommission / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k
              </div>
              <p className="text-xs text-stone-500">At standard {(siteSettings.commission_rate * 100).toFixed(1)}% schedule</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Enquiry Conversion Rate
              </span>
              <div className="font-serif text-4xl font-bold text-amber-700">
                {analytics.totalInquiries > 0
                  ? (((analytics.qualifiedInquiries + analytics.closedInquiries) / analytics.totalInquiries) * 100).toFixed(1)
                  : '0.0'}
                %
              </div>
              <p className="text-xs text-stone-500">Qualified buyers / closed dossiers</p>
            </div>
          </div>

          {/* Visual Breakdown Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel: Enquiries Pipeline */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-5">
              <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-3">
                Client Enquiry Pipeline Funnel
              </h3>

              <div className="space-y-4 text-xs">
                {[
                  { label: 'New Inquiries', count: analytics.newInquiries, color: 'bg-amber-500' },
                  { label: 'Under Contact', count: inquiries.filter(i => i.status === 'contacted').length, color: 'bg-blue-500' },
                  { label: 'Qualified Buyer / Investor', count: analytics.qualifiedInquiries, color: 'bg-purple-600' },
                  { label: 'Closed / Acquired', count: analytics.closedInquiries, color: 'bg-emerald-600' },
                ].map(item => {
                  const pct = analytics.totalInquiries > 0 ? (item.count / analytics.totalInquiries) * 100 : 0;
                  return (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-stone-800">
                        <span>{item.label}</span>
                        <span>{item.count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-700`}
                          style={{ width: `${Math.max(pct, item.count > 0 ? 6 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Breakdown by Property Type */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-5">
              <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-3">
                Listings by Residence Type
              </h3>

              <div className="space-y-4 text-xs">
                {Object.entries(analytics.listingsByType).map(([type, count]) => {
                  const pct = analytics.totalListings > 0 ? (count / analytics.totalListings) * 100 : 0;
                  return (
                    <div key={type} className="space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-stone-800 capitalize">
                        <span>{type}s</span>
                        <span>{count} listings ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-stone-900 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(pct, 8)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Settings & Demo Data Control */}
      {activeTab === 'settings' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Agency Details Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif text-2xl text-stone-900">Agency Configuration</h3>
              <p className="text-xs text-stone-500">
                Core identity details referenced across website navigation, concierge desk, footer, and emails.
              </p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                updateSiteSettings(siteSettings);
                showNotification('success', 'Agency configuration saved.');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Agency Name</label>
                <input
                  type="text"
                  required
                  value={siteSettings.agency_name}
                  onChange={e => setSiteSettings({ ...siteSettings, agency_name: e.target.value })}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Flagship Office Address</label>
                <input
                  type="text"
                  required
                  value={siteSettings.address}
                  onChange={e => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Concierge Telephone</label>
                  <input
                    type="text"
                    required
                    value={siteSettings.phone}
                    onChange={e => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Concierge Email</label>
                  <input
                    type="email"
                    required
                    value={siteSettings.email}
                    onChange={e => setSiteSettings({ ...siteSettings, email: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Standard Commission Rate</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.005"
                    max="0.10"
                    required
                    value={siteSettings.commission_rate}
                    onChange={e => setSiteSettings({ ...siteSettings, commission_rate: parseFloat(e.target.value) || 0.025 })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">e.g. 0.025 = 2.5%</span>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={siteSettings.hours || 'Mon–Sat: 09:00 – 20:00 PST'}
                    onChange={e => setSiteSettings({ ...siteSettings, hours: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="bg-stone-900 text-white font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer hover:bg-stone-800"
                >
                  Save Agency Details
                </button>
              </div>
            </form>
          </div>

          {/* Demo Data Management Center */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800 font-bold block">
                Database & Demo Data Operations
              </span>
              <h3 className="font-serif text-2xl text-stone-900">Demo Data Control Center</h3>
              <p className="text-xs text-stone-500">
                You can reload the pristine demo luxury residences at any time, or clear the catalogue when you are ready to input 100% real properties.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-stone-200 space-y-2.5">
                <strong className="block text-stone-900 font-bold">Restore Demo Luxury Residences</strong>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Resets the catalogue to the 7 original luxury residences (Bel-Air, Tribeca, Star Island, Aspen, Malibu, London, and San Francisco).
                </p>
                <button
                  type="button"
                  onClick={() => setResetConfirmAction('restore_demo_properties')}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Restore 7 Demo Residences
                </button>
              </div>

              <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2.5">
                <strong className="block text-red-950 font-bold">Clear All Residences Catalogue</strong>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Removes all demo listings so you can add your agency’s real live properties from an empty catalogue.
                </p>
                <button
                  type="button"
                  onClick={() => setResetConfirmAction('clear_all_properties')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Clear All Residences
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 space-y-2.5">
                <strong className="block text-stone-900 font-bold">Reset Client Enquiries Pipeline</strong>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Restores initial buyer enquiries (Marcus Vance, Elena Rostova, David Sterling).
                </p>
                <button
                  type="button"
                  onClick={() => setResetConfirmAction('reset_inquiries')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg cursor-pointer"
                >
                  Reset Enquiries
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 space-y-2.5">
                <strong className="block text-stone-900 font-bold">Reset User Accounts</strong>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Restores default agency administrator and client accounts.
                </p>
                <button
                  type="button"
                  onClick={() => setResetConfirmAction('reset_users')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg cursor-pointer"
                >
                  Reset Accounts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED PROPERTY FORM MODAL (CREATE / EDIT) */}
      {propertyModalOpen && (
        <AdvancedPropertyModal
          property={editingProperty}
          onClose={() => {
            setPropertyModalOpen(false);
            setEditingProperty(null);
          }}
          onSaved={() => {
            setPropertyModalOpen(false);
            setEditingProperty(null);
            reloadData();
            showNotification('success', 'Residence catalogue listing saved successfully.');
          }}
        />
      )}

      {/* DELETE PROPERTY CONFIRMATION MODAL */}
      {deleteConfirmProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl text-stone-900">Confirm Deletion</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you certain you wish to delete <strong className="text-stone-900">{deleteConfirmProp.title}</strong>?
              This will remove the listing and gallery photos from your catalogue.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProp(null)}
                className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold text-xs rounded-lg hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED ENQUIRY DOSSIER MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800 font-bold">
                  Client Enquiry Dossier
                </span>
                <h3 className="font-serif text-2xl text-stone-900">{selectedInquiry.full_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-700">
              {/* Property details */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Target Residence</span>
                <div className="font-bold text-sm text-stone-900">{selectedInquiry.property_title || 'General Advisory'}</div>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Email</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-amber-800 font-semibold hover:underline flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedInquiry.email}</span>
                  </a>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Telephone</span>
                  {selectedInquiry.phone ? (
                    <a href={`tel:${selectedInquiry.phone}`} className="text-stone-900 font-semibold hover:underline flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                      <span>{selectedInquiry.phone}</span>
                    </a>
                  ) : (
                    <span className="text-stone-400">Not provided</span>
                  )}
                </div>
              </div>

              {/* Scheduled Viewing info if provided */}
              {selectedInquiry.preferred_date && (
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 text-amber-950 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-800 shrink-0" />
                  <div>
                    <strong className="block text-[11px] uppercase tracking-wider font-bold">Scheduled Private Viewing</strong>
                    <span className="text-sm font-semibold">{selectedInquiry.preferred_date} • {selectedInquiry.preferred_time || 'Standard Slot'}</span>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <strong className="block text-stone-500 text-[10px] uppercase tracking-wider mb-1">Client Inscribed Message</strong>
                <p className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 whitespace-pre-line leading-relaxed text-stone-800">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Pipeline Status Selector */}
              <div>
                <strong className="block text-stone-500 text-[10px] uppercase tracking-wider mb-1.5">Update Pipeline Status</strong>
                <div className="grid grid-cols-4 gap-2">
                  {(['new', 'contacted', 'qualified', 'closed'] as InquiryStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleInquiryStatusChange(selectedInquiry.id, st)}
                      className={`py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        selectedInquiry.status === st
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent Internal Notes Field */}
              <div className="pt-2 border-t border-stone-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                    Agency Internal Notes / Follow-up Log
                  </label>
                  <span className="text-[10px] text-stone-400">Private to Agency</span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Record client requirements, viewing feedback, or acquisition notes here..."
                  value={inquiryNoteDraft}
                  onChange={e => setInquiryNoteDraft(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none leading-relaxed"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveInquiryNotes}
                    className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Save Agent Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW USER MODAL */}
      {userModalOpen && (
        <CreateUserModal
          onClose={() => setUserModalOpen(false)}
          onCreated={() => {
            setUserModalOpen(false);
            reloadData();
            showNotification('success', 'New account created successfully.');
          }}
        />
      )}

      {/* CONFIRM RESET ACTION MODAL */}
      {resetConfirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl text-stone-900">
              {resetConfirmAction === 'clear_all_properties'
                ? 'Purge All Demo Listings?'
                : resetConfirmAction === 'restore_demo_properties'
                ? 'Restore Demo Properties?'
                : 'Confirm Reset Operation'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {resetConfirmAction === 'clear_all_properties'
                ? 'This will completely remove all 7 demo properties from the website so you can publish your own genuine listings with photos and real details from your device. Are you sure you want to proceed?'
                : resetConfirmAction === 'restore_demo_properties'
                ? 'This will reload the 7 default showcase luxury residences into your catalogue.'
                : 'Are you sure you want to execute this reset operation? Current local changes for this dataset will be updated.'}
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setResetConfirmAction(null)}
                className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold text-xs rounded-lg hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleExecuteReset(resetConfirmAction)}
                className={`px-4 py-2 font-bold text-xs rounded-lg cursor-pointer ${
                  resetConfirmAction === 'clear_all_properties'
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {resetConfirmAction === 'clear_all_properties' ? 'Purge All Demo Listings' : 'Proceed with Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// ADVANCED PROPERTY MODAL COMPONENT (WITH GALLERY & AMENITY CHIPS)
// -------------------------------------------------------------
interface AdvancedPropertyModalProps {
  property?: Property | null;
  onClose: () => void;
  onSaved: () => void;
}

const AdvancedPropertyModal: React.FC<AdvancedPropertyModalProps> = ({ property, onClose, onSaved }) => {
  const [modalTab, setModalTab] = useState<'basics' | 'specs' | 'location' | 'media' | 'amenities'>('basics');

  // Form State
  const [title, setTitle] = useState(property?.title || '');
  const [slug, setSlug] = useState(property?.slug || '');
  const [description, setDescription] = useState(property?.description || '');
  const [price, setPrice] = useState(property?.price || 4800000);
  const [currency, setCurrency] = useState('PKR');
  const [propertyType, setPropertyType] = useState<PropertyType>(property?.property_type || 'villa');
  const [listingStatus, setListingStatus] = useState<ListingStatus>(property?.listing_status || 'for_sale');
  const [isFeatured, setIsFeatured] = useState(property?.is_featured || false);

  // Specs
  const [bedrooms, setBedrooms] = useState(property?.bedrooms !== undefined ? property.bedrooms : 3);
  const [bathrooms, setBathrooms] = useState(property?.bathrooms !== undefined ? property.bathrooms : 3);
  const [areaSqft, setAreaSqft] = useState(property?.area_sqft || 1125);
  const [areaMarla, setAreaMarla] = useState(property?.area_marla || (property?.area_sqft ? sqftToMarla(property.area_sqft) : 5));
  const [yearBuilt, setYearBuilt] = useState(property?.year_built || 2025);

  // House Specific Construction Features (گھر کی تفصیلی معلومات)
  const [structureType, setStructureType] = useState(property?.features?.structure_type || 'Single Story (RCC Lenter & Awwal Eent)');
  const [registryStatus, setRegistryStatus] = useState(property?.features?.registry_status || '100% Registry & Intiqal Clear (رجسٹری انتقال پاس)');
  const [carPorch, setCarPorch] = useState(property?.features?.car_porch || 'Car Porch for 1 Car & Bikes');
  const [waterSource, setWaterSource] = useState(property?.features?.water_source || 'Sweet Water Bore with 1HP Motor');
  const [gasStatus, setGasStatus] = useState(property?.features?.gas_status || 'Sui Gas Supply Available');
  const [electricity, setElectricity] = useState(property?.features?.electricity || 'WAPDA Meter Installed');
  const [flooring, setFlooring] = useState(property?.features?.flooring || 'Full Marble & Bath Tiles');
  const [streetWidth, setStreetWidth] = useState(property?.features?.street_width || '30ft Wide Paved Street');

  // Location
  const [address, setAddress] = useState(property?.location.address || 'Street 5, Sector B');
  const [locality, setLocality] = useState(property?.location.locality || 'Satellite Town');
  const [city, setCity] = useState('Sadiqabad');
  const [state, setState] = useState(property?.location.state || 'Punjab');
  const [postalCode, setPostalCode] = useState(property?.location.postal_code || '64350');
  const [country, setCountry] = useState('Pakistan');
  const [latitude, setLatitude] = useState(property?.location.latitude || 28.3089);
  const [longitude, setLongitude] = useState(property?.location.longitude || 70.1311);

  // Media
  const [featuredImage, setFeaturedImage] = useState(
    property?.featured_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
  );
  const [galleryUrls, setGalleryUrls] = useState<string[]>(() => {
    if (property?.media && property.media.length > 0) {
      return property.media.map(m => m.url);
    }
    return [
      property?.featured_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    ];
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingPhoto(true);
    setError(null);
    try {
      const processedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await processImageFile(file);
          processedUrls.push(dataUrl);
        }
      }
      if (processedUrls.length > 0) {
        setGalleryUrls(prev => {
          const combined = [...processedUrls, ...prev.filter(u => !processedUrls.includes(u))];
          return combined;
        });
        setFeaturedImage(processedUrls[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process image file from device');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities || [
      'Sweet Water Bore / Supply',
      'Dedicated Car Porch / Garage',
      'Sui Gas Available',
      'Near Jamia Masjid & Park',
    ]
  );
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!property) {
      setSlug(generateSafeSlug(val));
    }
  };

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityInput.trim();
    if (trimmed && !selectedAmenities.includes(trimmed)) {
      setSelectedAmenities([...selectedAmenities, trimmed]);
      setCustomAmenityInput('');
    }
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url) return;
    if (!galleryUrls.includes(url)) {
      setGalleryUrls([...galleryUrls, url]);
    }
    setNewImageUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    const updated = galleryUrls.filter((_, i) => i !== index);
    setGalleryUrls(updated);
    if (updated.length > 0 && !updated.includes(featuredImage)) {
      setFeaturedImage(updated[0]);
    }
  };

  const handleSetPrimaryImage = (url: string) => {
    setFeaturedImage(url);
    // ensure it's in galleryUrls
    if (!galleryUrls.includes(url)) {
      setGalleryUrls([url, ...galleryUrls]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const safeSlug = slug || generateSafeSlug(title);
    const mediaList: PropertyMedia[] = galleryUrls.map((url, idx) => ({
      id: `med-${Date.now()}-${idx}`,
      property_id: property?.id || '',
      url,
      is_featured: url === featuredImage,
      display_order: idx,
    }));

    const payload: Partial<Property> = {
      title,
      slug: safeSlug,
      description,
      price: Number(price),
      currency: 'PKR',
      property_type: propertyType,
      listing_status: listingStatus,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area_sqft: Number(areaSqft),
      area_marla: Number(areaMarla) || sqftToMarla(Number(areaSqft)),
      year_built: Number(yearBuilt),
      is_featured: isFeatured,
      featured_image: featuredImage || galleryUrls[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      location: {
        address: address || 'Main Road',
        locality: locality || 'Satellite Town',
        city: 'Sadiqabad',
        state: state || 'Punjab',
        postal_code: postalCode || '64350',
        country: 'Pakistan',
        latitude: Number(latitude) || 28.3089,
        longitude: Number(longitude) || 70.1311,
      },
      features: {
        structure_type: structureType,
        registry_status: registryStatus,
        car_porch: carPorch,
        water_source: waterSource,
        gas_status: gasStatus,
        electricity: electricity,
        flooring: flooring,
        street_width: streetWidth,
      },
      amenities: selectedAmenities,
      media: mediaList,
    };

    try {
      if (property) {
        await updateProperty(property.id, payload);
      } else {
        await createProperty(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save residence');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800 font-bold">
              Catalogue Management
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900">
              {property ? `Edit "${property.title}"` : 'Add New Luxury Residence'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 cursor-pointer rounded-full hover:bg-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Section Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setModalTab('basics')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
              modalTab === 'basics' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            1. Core Info
          </button>
          <button
            type="button"
            onClick={() => setModalTab('specs')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
              modalTab === 'specs' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            2. Specs
          </button>
          <button
            type="button"
            onClick={() => setModalTab('location')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
              modalTab === 'location' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            3. Location
          </button>
          <button
            type="button"
            onClick={() => setModalTab('media')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
              modalTab === 'media' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            4. Gallery Photos ({galleryUrls.length})
          </button>
          <button
            type="button"
            onClick={() => setModalTab('amenities')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
              modalTab === 'amenities' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            5. Amenities ({selectedAmenities.length})
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* SECTION 1: BASICS */}
          {modalTab === 'basics' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Marla Brand New Double Story House - Model Town, Sadiqabad"
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={e => setSlug(generateSafeSlug(e.target.value))}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">Live link: /property/{slug}</span>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Price in PKR (Pakistani Rupees) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-serif font-bold text-sm"
                  />
                  <span className="text-[11px] text-emerald-800 font-bold mt-1 block">
                    Formatted: {formatPKR(Number(price), listingStatus === 'for_rent')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value as PropertyType)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                  >
                    <option value="villa">Independent House / Villa</option>
                    <option value="townhouse">Townhouse / Double Story</option>
                    <option value="estate">Residential Plot / Land</option>
                    <option value="apartment">Upper Portion / Flat</option>
                    <option value="commercial">Commercial Plaza / Shop</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Listing Purpose</label>
                  <select
                    value={listingStatus}
                    onChange={e => setListingStatus(e.target.value as ListingStatus)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                  >
                    <option value="for_sale">For Sale</option>
                    <option value="for_rent">For Rent (Family Lease)</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending Deal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Property Description & Highlights</label>
                <textarea
                  rows={4}
                  placeholder="Construction quality, bedrooms, kitchen fittings, Sui Gas connection, water bore, car porch details..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="is_featured_chk_modal"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <label htmlFor="is_featured_chk_modal" className="font-semibold text-stone-800 cursor-pointer">
                  Feature prominently on Sadiqabad Homepage (Top Showcase)
                </label>
              </div>
            </div>
          )}

          {/* SECTION 2: SPECS */}
          {modalTab === 'specs' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Quick Marla Sizing Helpers */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Quick Plot Size Selector
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '3 Marla', marla: 3, sqft: 675 },
                    { label: '5 Marla', marla: 5, sqft: 1125 },
                    { label: '7 Marla', marla: 7, sqft: 1575 },
                    { label: '10 Marla', marla: 10, sqft: 2250 },
                    { label: '1 Kanal (20 Marla)', marla: 20, sqft: 4500 },
                  ].map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setAreaMarla(item.marla);
                        setAreaSqft(item.sqft);
                      }}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Area (Marla) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={areaMarla}
                    onChange={e => {
                      const m = Number(e.target.value);
                      setAreaMarla(m);
                      setAreaSqft(marlaToSqft(m));
                    }}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Area (Sq Ft) *</label>
                  <input
                    type="number"
                    min="100"
                    value={areaSqft}
                    onChange={e => {
                      const s = Number(e.target.value);
                      setAreaSqft(s);
                      setAreaMarla(sqftToMarla(s));
                    }}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={bedrooms}
                    onChange={e => setBedrooms(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                  />
                  <span className="text-[10px] text-stone-400">0 for commercial</span>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={bathrooms}
                    onChange={e => setBathrooms(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Year Built / Completed</label>
                <input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 2}
                  value={yearBuilt}
                  onChange={e => setYearBuilt(Number(e.target.value))}
                  className="w-48 h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                />
              </div>

              {/* Sadiqabad House Construction & Legal Specs (گھر کی تفصیلی معلومات) */}
              <div className="pt-4 border-t border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                    House Specifications & Utilities (گھر کی تفصیلی معلومات)
                  </h4>
                  <span className="text-[10px] text-stone-400">Displayed in House Details panel</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Structure & Roof (لنٹر و تعمیر)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Single Story (RCC Lenter & Awwal Eent)"
                      value={structureType}
                      onChange={e => setStructureType(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Registry & Legal Title (رجسٹری و انتقال)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Registry & Intiqal Clear (رجسٹری انتقال پاس)"
                      value={registryStatus}
                      onChange={e => setRegistryStatus(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Car Porch Size (کار پورچ)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Car Porch for Sedan (Corolla/City) & Bikes"
                      value={carPorch}
                      onChange={e => setCarPorch(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Water Boring & Motor (میٹھا پانی بور)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sweet Water Bore with 1HP Electric Motor"
                      value={waterSource}
                      onChange={e => setWaterSource(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Sui Gas Status (سوئی گیس)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sui Gas Meter Installed / Gas Available"
                      value={gasStatus}
                      onChange={e => setGasStatus(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Electricity Meter (واپڈا میٹر)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Independent WAPDA Electric Meter Installed"
                      value={electricity}
                      onChange={e => setElectricity(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Flooring & Marble (فرش)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Full Badal Marble & Ceramic Tiles"
                      value={flooring}
                      onChange={e => setFlooring(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Street Width (گلی کا سائز)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 30ft Wide Carpeted Street"
                      value={streetWidth}
                      onChange={e => setStreetWidth(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: LOCATION */}
          {modalTab === 'location' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                Website is locked strictly to <strong>Sadiqabad City</strong>. All properties belong exclusively to Sadiqabad residential colonies and commercial sectors.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Sadiqabad Colony / Locality *</label>
                  <select
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold cursor-pointer"
                  >
                    {SADIQABAD_LOCALITIES.map(loc => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">City (Fixed) *</label>
                  <input
                    type="text"
                    readOnly
                    value="Sadiqabad"
                    className="w-full h-10 px-3 bg-stone-100 border border-stone-200 rounded-lg text-stone-700 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Street Address / Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Street 4, Sector B, Near Jamia Masjid"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Country</label>
                  <input
                    type="text"
                    readOnly
                    value={country}
                    className="w-full h-10 px-3 bg-stone-100 border border-stone-200 rounded-lg text-stone-700 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={e => setLatitude(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={e => setLongitude(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: GALLERY MEDIA */}
          {modalTab === 'media' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Device Photo Upload Dropzone / Action Card */}
              <div className="p-6 bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl text-center space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  multiple
                  className="hidden"
                  id="device-photo-input"
                />
                <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  {isUploadingPhoto ? (
                    <Loader2 className="w-6 h-6 animate-spin text-amber-700" />
                  ) : (
                    <Camera className="w-6 h-6 text-amber-700" />
                  )}
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-stone-900">
                    Upload Real Property Photos from Device
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 max-w-md mx-auto">
                    Select JPG, PNG, or WEBP photos from your mobile phone or computer. Images are optimized automatically for instant loading across the website.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Optimizing & Adding Photos...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Choose Photos from Device</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Cover Image Preview & Selection */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Active Primary Cover Photo *
                  </span>
                  <span className="text-[10px] text-amber-800 font-semibold">Featured on Cards & Hero</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {featuredImage ? (
                    <div className="relative aspect-[16/9] w-full sm:w-64 rounded-lg overflow-hidden border border-stone-300 shadow-sm shrink-0 bg-stone-900">
                      <img src={featuredImage} alt="Cover preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-stone-900/90 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        ★ Cover Active
                      </span>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full sm:w-64 rounded-lg border border-dashed border-stone-300 flex items-center justify-center text-xs text-stone-400 shrink-0 bg-stone-100">
                      No cover selected
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <label className="block text-[11px] font-semibold text-stone-600">
                      Or paste an external web photo URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={featuredImage.startsWith('data:') ? '' : featuredImage}
                      onChange={e => handleSetPrimaryImage(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs"
                    />
                    <p className="text-[10px] text-stone-400">
                      Tip: You can also click "Set Cover" on any uploaded image thumbnail below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Web Image or Choose from Presets */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Add Web Photo by URL or Presets
                  </span>
                  <select
                    onChange={e => {
                      if (e.target.value) handleAddGalleryImage(e.target.value);
                    }}
                    defaultValue=""
                    className="text-[11px] bg-white border border-stone-300 rounded px-2 py-1 font-semibold text-stone-700 cursor-pointer"
                  >
                    <option value="" disabled>
                      + Choose from Luxury Presets
                    </option>
                    {PRESET_IMAGE_GALLERY.map(img => (
                      <option key={img.url} value={img.url}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (e.g. Unsplash, CDN)..."
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="flex-1 h-10 px-3 bg-white border border-stone-200 rounded-lg text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddGalleryImage(newImageUrl)}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg cursor-pointer shrink-0"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px] block">
                    Current Gallery Photos ({galleryUrls.length})
                  </span>
                  {galleryUrls.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryUrls([]);
                        setFeaturedImage('');
                      }}
                      className="text-[10px] text-red-600 hover:underline font-bold cursor-pointer"
                    >
                      Clear All Photos
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryUrls.map((url, idx) => (
                    <div
                      key={url.slice(0, 40) + idx}
                      className={`relative group rounded-xl overflow-hidden border aspect-[4/3] bg-stone-100 ${
                        url === featuredImage ? 'border-amber-500 ring-2 ring-amber-400' : 'border-stone-200'
                      }`}
                    >
                      <img src={url} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                        {url !== featuredImage && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(url)}
                            className="bg-amber-500 text-stone-950 font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer hover:bg-amber-400 shadow"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="bg-red-600 text-white font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer hover:bg-red-700 shadow"
                        >
                          Remove
                        </button>
                      </div>
                      {url === featuredImage && (
                        <span className="absolute top-1.5 left-1.5 bg-amber-500 text-stone-950 font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: AMENITIES */}
          {modalTab === 'amenities' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px] block mb-2">
                  Select Popular Luxury Amenities
                </span>
                <div className="flex flex-wrap gap-2">
                  {LUXURY_AMENITY_OPTIONS.map(amenity => {
                    const active = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                          active
                            ? 'bg-stone-900 border-stone-900 text-white shadow-2xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {amenity} {active && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amenity Adder */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="block font-bold uppercase tracking-wider text-stone-600 text-[11px]">
                  Add Custom Unique Amenity
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Sub-Zero Catering Kitchen, Private Stables, Golf Simulator..."
                    value={customAmenityInput}
                    onChange={e => setCustomAmenityInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAmenity();
                      }
                    }}
                    className="flex-1 h-10 px-3 bg-white border border-stone-200 rounded-lg text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="px-4 py-2 bg-stone-900 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected List */}
              <div className="text-xs text-stone-500">
                Selected for this residence: <strong className="text-stone-800">{selectedAmenities.join(', ') || 'None'}</strong>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {modalTab !== 'basics' && (
                <button
                  type="button"
                  onClick={() => {
                    if (modalTab === 'amenities') setModalTab('media');
                    else if (modalTab === 'media') setModalTab('location');
                    else if (modalTab === 'location') setModalTab('specs');
                    else if (modalTab === 'specs') setModalTab('basics');
                  }}
                  className="px-3 py-2 text-stone-600 font-semibold hover:text-stone-900 cursor-pointer"
                >
                  ← Previous
                </button>
              )}
              {modalTab !== 'amenities' && (
                <button
                  type="button"
                  onClick={() => {
                    if (modalTab === 'basics') setModalTab('specs');
                    else if (modalTab === 'specs') setModalTab('location');
                    else if (modalTab === 'location') setModalTab('media');
                    else if (modalTab === 'media') setModalTab('amenities');
                  }}
                  className="px-4 py-2 bg-stone-100 text-stone-800 font-semibold rounded-lg hover:bg-stone-200 cursor-pointer"
                >
                  Next Section →
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : property ? 'Update Residence' : 'Publish Residence'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// CREATE USER MODAL COMPONENT
// -------------------------------------------------------------
const CreateUserModal: React.FC<{ onClose: () => void; onCreated: () => void }> = ({ onClose, onCreated }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createUser({
        full_name: fullName,
        email,
        phone,
        role,
      });
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif text-2xl text-stone-900">Add Account</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{error}</div>
        )}

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Victoria Sinclair"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="client@sinclair-family.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+1 (310) 555-0199"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-600 mb-1">Assigned Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as 'user' | 'admin')}
              className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
            >
              <option value="user">Registered Client (Private Portal)</option>
              <option value="admin">Agency Staff (Full Administrator Access)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg hover:bg-stone-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 cursor-pointer"
            >
              {saving ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
