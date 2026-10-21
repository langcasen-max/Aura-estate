import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/site';
import { updatePageSeo } from '../lib/seo';
import { submitInquiry } from '../services/inquiryService';
import { InquiryType } from '../types';
import { MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<InquiryType>('general');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    updatePageSeo({
      title: 'Concierge Desk & Contact',
      description: 'Connect with the Aura Estates private client concierge for private viewings and acquisition advisory.',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitInquiry({
        full_name: fullName,
        email,
        phone,
        inquiry_type: inquiryType,
        message,
      });

      setSuccess(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please check your entries.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-mono tracking-widest uppercase text-amber-800 block">
          Private Client Services
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-stone-900 leading-tight">
          Concierge Directory
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Our global client desk coordinates confidential private viewings, bespoke dossiers, and discreet acquisition
          advice for private investors and family offices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Col: Contact Information */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-stone-200/90 shadow-xs space-y-6">
            <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-3">
              Flagship Salon
            </h3>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 text-sm">Beverly Hills Salon</strong>
                  <span>{siteConfig.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-800 flex-shrink-0" />
                <div>
                  <strong className="block text-stone-900">Direct Concierge Telephone</strong>
                  <a href={`tel:${siteConfig.phone}`} className="hover:text-amber-800 font-mono">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-800 flex-shrink-0" />
                <div>
                  <strong className="block text-stone-900">Confidential Correspondence</strong>
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-amber-800 font-mono">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Salon Hours</strong>
                  <span>{siteConfig.hours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Registered Brokerage License #CA-02941049</span>
            </div>
          </div>
        </div>

        {/* Right Col: Direct Inquiry Form */}
        <div className="bg-white p-8 rounded-2xl border border-stone-200/90 shadow-xl space-y-6">
          <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-3">
            Direct Transmission
          </h3>

          {success ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-2xl text-stone-900">Message Delivered</h4>
              <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                Your enquiry has been transmitted directly to our managing director. We will be in touch with complete
                discretion.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-xs text-stone-900 font-bold hover:underline"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Advisory Category
                </label>
                <select
                  value={inquiryType}
                  onChange={e => setInquiryType(e.target.value as InquiryType)}
                  className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-800 cursor-pointer"
                >
                  <option value="general">General Client Advisory</option>
                  <option value="viewing">Private Residence Viewing</option>
                  <option value="dossier">Architectural Dossier Request</option>
                  <option value="advisory">Acquisition Structuring</option>
                  <option value="financing">Private Mortgage / Financing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Principal or Representative Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Direct Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (310) 555-0190"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Enquiry Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please state your specific mandate, timeframe, or inquiries..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <span>Send Direct Enquiry</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
