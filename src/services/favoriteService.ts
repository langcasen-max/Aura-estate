const FAVORITES_STORAGE_KEY = 'aura_estates_favorites';

export function getLocalFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalFavorites(ids: string[]): void {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save favorites:', err);
  }
}

export function isPropertyFavorite(propertyId: string): boolean {
  return getLocalFavorites().includes(propertyId);
}

export function toggleFavorite(propertyId: string): { isFavorite: boolean; favorites: string[] } {
  const current = getLocalFavorites();
  const exists = current.includes(propertyId);
  const updated = exists ? current.filter(id => id !== propertyId) : [...current, propertyId];
  saveLocalFavorites(updated);
  return { isFavorite: !exists, favorites: updated };
}

export function clearLocalFavorites(): void {
  try {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  } catch {
    // ignore
  }
}
