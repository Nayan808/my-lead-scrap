const STORAGE_KEY = 'gmb_google_places_api_key';

export function getApiKey(): string {
  return localStorage.getItem(STORAGE_KEY) || import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key.trim());
}

export function clearApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}
