import React, { useState, useEffect } from 'react';
import { Property, InquiryType } from '../../types';
import { submitInquiry } from '../../services/inquiryService';
import { useAuth } from '../../contexts/AuthContext';
import { X, CheckCircle2, Calendar, Clock, ShieldCheck, Loader2 } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  defaultType?: InquiryType;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  property,
  defaultType = 'viewing',
}) => {
  const { user } = useAuth();
  const [inquiryType, setInquiryType] = useState<InquiryType>(defaultType);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('14:00 PST');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMessage(null);
      setInquiryType(defaultType);
      if (user) {
        setFullName(user.full_name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      }
    }
  }, [isOpen, defaultType, user]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await submitInquiry({
        property_id: property ? property.id : null,
        property_title: property ? property.title : 'General Agency Advisory',
        user_id: user ? user.id : null,
        full_name: fullName,
        email,
        phone,
        inquiry_type: inquiryType,
        preferred_date: inquiryType === 'viewing' ? preferredDate : undefined,
        preferred_time: inquiryType === 'viewing' ? preferredTime : undefined,
        message: message || (
          inquiryType === 'viewing'
            ? 'Requesting private appointment and concierge arrangement.'
            : inquiryType === 'dossier'
            ? 'Requesting comprehensive architectural prospectus and floorplans.'
            : 'Requesting confidential advisory consultation.'
        ),
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to submit enquiry. Please check your entries.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn"
    >
      <div className="card-pro animate-fadeInScale bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between sticky top-0 bg-white dark:bg-stone-900 z-10">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-mono text-amber-700 block mb-0.5">
              Private Concierge Service
            </span>
            <h3 id="enquiry-dialog-title" className="font-serif text-2xl text-stone-900 leading-tight">
              {property ? property.title : 'Agency Advisory Consultation'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl text-stone-900">Enquiry Received</h4>
              <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                Thank you, {fullName}. Our Sadiqabad property agent has received your request regarding{' '}
                <strong className="text-stone-900">{property ? property.title : 'Sadiqabad Real Estate'}</strong> and will contact
                you shortly.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow transition-all cursor-pointer"
                >
                  Return to Listings
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* Inquiry Type Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Purpose of Contact
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: 'viewing', label: 'On-Site Inspection' },
                    { id: 'dossier', label: 'Registry / Fard Check' },
                    { id: 'advisory', label: 'Price & Offer' },
                    { id: 'financing', label: 'Bank Financing' },
                    { id: 'general', label: 'General Inquiry' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setInquiryType(t.id as InquiryType)}
                      className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                        inquiryType === t.id
                          ? 'bg-stone-900 text-stone-100 border-stone-900 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Scheduling for Private Viewings */}
              {inquiryType === 'viewing' && (
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                  <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>Preferred Viewing Schedule</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Target Date</label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={e => setPreferredDate(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Preferred Time Window</label>
                      <select
                        value={preferredTime}
                        onChange={e => setPreferredTime(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-stone-800 cursor-pointer"
                      >
                        <option value="Morning (10:00 - 12:00)">Morning (10:00 - 12:00)</option>
                        <option value="Afternoon (14:00 - 16:00)">Afternoon (14:00 - 16:00)</option>
                        <option value="Twilight Sunset (17:00 - 19:00)">Twilight Sunset (17:00 - 19:00)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Client Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Lord / Lady / Mr. / Ms. Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@organization.com"
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

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Specific Requirements or Discretion Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail any security, helicopter transfer, or non-disclosure requirements..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Strict Confidentiality Guaranteed</span>
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pro bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 disabled:opacity-50 text-white dark:text-stone-950 font-bold text-xs px-6 py-3 rounded-full shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <span>Submit Private Enquiry</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
