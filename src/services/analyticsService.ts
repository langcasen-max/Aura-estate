import { getProperties } from './propertyService';
import { getInquiries } from './inquiryService';
import { getSiteSettings } from './settingsService';

export interface AnalyticsSummary {
  totalListings: number;
  activeForSale: number;
  activeForRent: number;
  totalInquiries: number;
  newInquiries: number;
  qualifiedInquiries: number;
  closedInquiries: number;
  inquiriesByType: Record<string, number>;
  listingsByType: Record<string, number>;
  listingsByStatus: Record<string, number>;
  estimatedPortfolioValue: number;
  estimatedCommission: number;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { properties } = await getProperties({});
  const inquiries = getInquiries();
  const settings = getSiteSettings();

  const totalListings = properties.length;
  const activeForSale = properties.filter(p => p.listing_status === 'for_sale').length;
  const activeForRent = properties.filter(p => p.listing_status === 'for_rent').length;

  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const qualifiedInquiries = inquiries.filter(i => i.status === 'qualified').length;
  const closedInquiries = inquiries.filter(i => i.status === 'closed').length;

  const inquiriesByType: Record<string, number> = {
    viewing: 0,
    dossier: 0,
    advisory: 0,
    financing: 0,
    general: 0,
  };
  inquiries.forEach(i => {
    inquiriesByType[i.inquiry_type] = (inquiriesByType[i.inquiry_type] || 0) + 1;
  });

  const listingsByType: Record<string, number> = {};
  const listingsByStatus: Record<string, number> = {};
  let estimatedPortfolioValue = 0;

  properties.forEach(p => {
    listingsByType[p.property_type] = (listingsByType[p.property_type] || 0) + 1;
    listingsByStatus[p.listing_status] = (listingsByStatus[p.listing_status] || 0) + 1;
    estimatedPortfolioValue += p.price;
  });

  // Calculate estimated commission on closed/sold properties or active portfolio
  const soldOrActiveVolume = properties
    .filter(p => p.listing_status === 'for_sale' || p.listing_status === 'sold')
    .reduce((sum, p) => sum + p.price, 0);

  const estimatedCommission = soldOrActiveVolume * settings.commission_rate;

  return {
    totalListings,
    activeForSale,
    activeForRent,
    totalInquiries,
    newInquiries,
    qualifiedInquiries,
    closedInquiries,
    inquiriesByType,
    listingsByType,
    listingsByStatus,
    estimatedPortfolioValue,
    estimatedCommission,
  };
}
