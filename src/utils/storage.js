/**
 * Safe LocalStorage utilities for StudyFlow
 */

const STORAGE_PREFIX = 'studyflow_';

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[StudyFlow Storage] Error reading key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StudyFlow Storage] Error writing key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error(`[StudyFlow Storage] Error removing key "${key}":`, error);
      return false;
    }
  },

  clearAll: () => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (error) {
      console.error('[StudyFlow Storage] Error clearing all data:', error);
      return false;
    }
  }
};
