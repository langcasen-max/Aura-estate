export const SADIQABAD_LOCALITIES = [
  'Model Town',
  'Allama Iqbal Town',
  'Mazhar Fareed Colony',
  'Satellite Town',
  'Kausar Colony',
  'Millat Colony',
  'Main KLP Road Commercial',
  'Railway Road Commercial',
  'Bypass Road',
  'Gulshan-e-Iqbal',
  'Jinnah Town',
] as const;

export type SadiqabadLocality = typeof SADIQABAD_LOCALITIES[number];

export const SADIQABAD_AMENITIES = [
  'Sui Gas Available',
  '3-Phase WAPDA Electricity',
  'Sweet Water Bore / Supply',
  '40ft Carpeted Main Road',
  'Gated Society Security & Guard',
  'Solar Net-Metering Installed',
  'Near Jamia Masjid & Park',
  'Commercial Frontage',
  'Dedicated Car Porch / Garage',
  'Imported Tile & Marble Flooring',
  'Solid Wooden Doors',
  'Basement / Storage Space',
  'CCTV Surveillance Installed',
  'Corner Plot Location',
] as const;

/**
 * Format price in Pakistani Rupees (PKR) with Lakh and Crore notations.
 * Examples:
 * - 26,500,000 -> "PKR 2.65 Crore"
 * - 8,500,000  -> "PKR 85 Lakh"
 * - 95,000     -> "PKR 95,000 / mo"
 */
export function formatPKR(amount: number, isRent = false): string {
  if (!amount || isNaN(amount)) return isRent ? 'PKR 0 / mo' : 'PKR 0';

  if (isRent) {
    return `PKR ${amount.toLocaleString('en-PK')} / mo`;
  }

  if (amount >= 10000000) {
    const crore = amount / 10000000;
    const formatted = crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2).replace(/\.?0+$/, '');
    return `PKR ${formatted} Crore`;
  }

  if (amount >= 100000) {
    const lakh = amount / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2).replace(/\.?0+$/, '');
    return `PKR ${formatted} Lakh`;
  }

  return `PKR ${amount.toLocaleString('en-PK')}`;
}

/**
 * Convert square feet to standard Punjab Marlas (1 Marla = 225 sq ft).
 */
export function sqftToMarla(sqft: number): number {
  if (!sqft) return 0;
  return Math.round((sqft / 225) * 10) / 10;
}

/**
 * Convert Marlas to square feet (1 Marla = 225 sq ft).
 */
export function marlaToSqft(marla: number): number {
  if (!marla) return 0;
  return Math.round(marla * 225);
}

/**
 * Format area in dual Marla and Sq Ft representation.
 * Examples:
 * - 2250 sqft -> "10 Marla · 2,250 sq ft"
 * - 4500 sqft -> "1 Kanal (20 Marla) · 4,500 sq ft"
 * - 1125 sqft -> "5 Marla · 1,125 sq ft"
 */
export function formatArea(area_sqft: number, area_marla?: number): string {
  if (!area_sqft && !area_marla) return '0 sq ft';

  const marla = area_marla || sqftToMarla(area_sqft);
  const sqft = area_sqft || marlaToSqft(marla);

  if (marla >= 20) {
    const kanal = Math.round((marla / 20) * 10) / 10;
    return `${kanal} Kanal (${marla} Marla) · ${sqft.toLocaleString()} sq ft`;
  }

  if (marla > 0) {
    return `${marla} Marla · ${sqft.toLocaleString()} sq ft`;
  }

  return `${sqft.toLocaleString()} sq ft`;
}
