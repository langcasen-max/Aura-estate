import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isValidPhone } from '../lib/security';
import { User, Mail, Phone, Image as ImageIcon, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (phone && !isValidPhone(phone)) {
      setError('Please provide a valid international telephone number (e.g. +1 (310) 555-0190).');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        type="button"
        onClick={() => onNavigate('/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-medium cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-xl space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800 block mb-1">
            Account Management
          </span>
          <h1 className="font-serif text-3xl text-stone-900">Client Profile Details</h1>
          <p className="text-xs text-stone-500 mt-1">
            Ensure your direct contact information is accurate for confidential communications.
          </p>
        </div>

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Preview */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-100 border-2 border-stone-200 flex items-center justify-center text-stone-400 font-serif text-2xl">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                fullName ? fullName[0].toUpperCase() : 'U'
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="w-full sm:w-80 h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Full Legal / Business Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label className="font-bold uppercase tracking-wider text-stone-600">Email Address</label>
              <span className="text-[10px] text-stone-400 font-mono">Primary Login ID</span>
            </div>
            <div className="relative">
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full h-11 pl-10 pr-3.5 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-600 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Direct Telephone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+1 (310) 555-0190"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Role (Read only) */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Account Authorization Level
            </label>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  {user?.role === 'admin' ? 'Agency Staff / Administrator' : 'Client Investor'}
                </span>
              </div>
              <span className="text-[10px] text-stone-400">Database Role Locked</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-full cursor-pointer transition-colors"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
