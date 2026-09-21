"use client";

function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors (e.g. private mode / quota exceeded).
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors (e.g. private mode).
  }
}

export const guestStore = {
  get isGuest() {
    return safeGetItem('rs_is_guest') === 'true';
  },

  setGuest(val: boolean) {
    if (val) safeSetItem('rs_is_guest', 'true');
    else safeRemoveItem('rs_is_guest');
  },

  get intendedPath() {
    return safeGetItem('rs_intended_path');
  },

  setIntendedPath(val: string | null) {
    if (val) safeSetItem('rs_intended_path', val);
    else safeRemoveItem('rs_intended_path');
  }
};
