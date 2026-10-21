import { PropertyInquiry, InquiryStatus, InquiryType } from '../types';
import { INITIAL_INQUIRIES } from './mockData';
import { isValidEmail, isValidPhone, sanitizeText, exportToCsvSafe } from '../lib/security';

const INQUIRIES_KEY = 'aura_estates_inquiries_v1';

export function getInquiries(): PropertyInquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    if (!raw) {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INQUIRIES;
  }
}

function saveInquiries(inquiries: PropertyInquiry[]): void {
  try {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  } catch (err) {
    console.error('Failed to save inquiries:', err);
  }
}

export interface SubmitInquiryParams {
  property_id?: string | null;
  property_title?: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  phone?: string;
  message: string;
  inquiry_type: InquiryType;
  preferred_date?: string;
  preferred_time?: string;
}

export async function submitInquiry(params: SubmitInquiryParams): Promise<PropertyInquiry> {
  const name = sanitizeText(params.full_name, 120);
  if (!name) throw new Error('Please provide your full name.');

  if (!isValidEmail(params.email)) {
    throw new Error('Please enter a valid email address.');
  }

  if (params.phone && !isValidPhone(params.phone)) {
    throw new Error('Please enter a valid phone number (e.g. +1 (310) 555-0190).');
  }

  const message = sanitizeText(params.message, 6000);
  if (!message) throw new Error('Please enter an enquiry message or question.');

  const newInquiry: PropertyInquiry = {
    id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    property_id: params.property_id || null,
    property_title: params.property_title || 'General Agency Advisory',
    user_id: params.user_id || null,
    full_name: name,
    email: params.email.trim().toLowerCase(),
    phone: params.phone?.trim(),
    message,
    inquiry_type: params.inquiry_type,
    preferred_date: params.preferred_date,
    preferred_time: params.preferred_time,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const current = getInquiries();
  current.unshift(newInquiry);
  saveInquiries(current);

  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<PropertyInquiry> {
  const current = getInquiries();
  const index = current.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Enquiry not found');

  current[index].status = status;
  saveInquiries(current);
  return current[index];
}

export async function updateInquiryNotes(id: string, admin_notes: string): Promise<PropertyInquiry> {
  const current = getInquiries();
  const index = current.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Enquiry not found');

  current[index].admin_notes = admin_notes;
  saveInquiries(current);
  return current[index];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const current = getInquiries();
  const filtered = current.filter(i => i.id !== id);
  if (filtered.length === current.length) throw new Error('Enquiry not found');
  saveInquiries(filtered);
  return true;
}

export async function resetDefaultInquiries(): Promise<PropertyInquiry[]> {
  saveInquiries(INITIAL_INQUIRIES);
  return INITIAL_INQUIRIES;
}

export function exportInquiriesCsv(): void {
  const list = getInquiries();
  const headers = ['ID', 'Date', 'Status', 'Type', 'Client Name', 'Email', 'Phone', 'Property', 'Message', 'Preferred Schedule', 'Agency Notes'];
  const rows = list.map(i => [
    i.id,
    new Date(i.created_at).toLocaleDateString(),
    i.status,
    i.inquiry_type,
    i.full_name,
    i.email,
    i.phone || '',
    i.property_title || '',
    i.message,
    i.preferred_date ? `${i.preferred_date} ${i.preferred_time || ''}` : '',
    i.admin_notes || '',
  ]);

  exportToCsvSafe(`aura-estates-enquiries-${new Date().toISOString().slice(0, 10)}`, headers, rows);
}

