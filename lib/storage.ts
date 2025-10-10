/**
 * Safe localStorage utilities that handle SSR (Server-Side Rendering)
 * These functions check if window is defined before accessing localStorage
 */

export const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get localStorage item '${key}':`, error);
      return null;
    }
  }
  return null;
};

export const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set localStorage item '${key}':`, error);
    }
  }
};

export const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage item '${key}':`, error);
    }
  }
};

export const clearLocalStorage = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
};

// Auth-specific storage helpers
export const getAuthToken = (): string | null => getLocalStorageItem('access_token');
export const getRefreshToken = (): string | null => getLocalStorageItem('refresh_token');
export const setAuthToken = (token: string): void => setLocalStorageItem('access_token', token);
export const setRefreshToken = (token: string): void => setLocalStorageItem('refresh_token', token);
export const clearAuthTokens = (): void => {
  removeLocalStorageItem('access_token');
  removeLocalStorageItem('refresh_token');
};

