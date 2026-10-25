import { SiteSettings } from '../types';
import { siteConfig } from '../config/site';

const SETTINGS_KEY = 'aura_estates_site_settings_v1';

export function getSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(siteConfig));
      return siteConfig;
    }
    const parsed = JSON.parse(raw);
    if (parsed.email === 'langcasen@gmail.com') {
      parsed.email = siteConfig.email;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return siteConfig;
  }
}

export function updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...settings,
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
  return updated;
}

export function resetDefaultSettings(): SiteSettings {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(siteConfig));
  } catch (err) {
    console.error('Failed to reset settings:', err);
  }
  return siteConfig;
}

