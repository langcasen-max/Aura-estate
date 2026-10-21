import { siteConfig } from '../config/site';

interface PageSeoOptions {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  jsonLd?: object;
}

export function updatePageSeo(options: PageSeoOptions = {}): void {
  const fullTitle = options.title
    ? `${options.title} | ${siteConfig.agency_name}`
    : `${siteConfig.agency_name} — Modern Luxury Real Estate`;

  const description =
    options.description ||
    'Editorial-quality property showcase, private viewings, and premier residential acquisitions.';

  // Update document title
  document.title = fullTitle;

  // Helper to set or create meta tags
  const setMeta = (attr: string, value: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${value}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, value);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('name', 'description', description);
  setMeta('property', 'og:title', fullTitle);
  setMeta('property', 'og:description', description);
  if (options.image) {
    setMeta('property', 'og:image', options.image);
  }

  // Update or insert JSON-LD script tag
  const existingJsonLd = document.getElementById('aura-json-ld');
  if (existingJsonLd) {
    existingJsonLd.remove();
  }

  const structuredData = options.jsonLd || {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: siteConfig.agency_name,
    address: siteConfig.address,
    telephone: siteConfig.phone,
    email: siteConfig.email,
  };

  const script = document.createElement('script');
  script.id = 'aura-json-ld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}
