"use client";

export interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  name?: string;
  country_code?: string;
  phone?: string;
  email?: string;
  unread_notifications_count?: number;
}

export interface Admin {
  id: number;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  admin_code?: string;
  is_block?: boolean;
}

type AuthListener = (state: { user: User | null; admin: Admin | null }) => void;

/** Reads a localStorage value, swallowing errors (e.g. private browsing mode). */
function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Writes a localStorage value, swallowing errors (e.g. private browsing mode). */
function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors (e.g. private mode / quota exceeded).
  }
}

/** Removes a localStorage value, swallowing errors (e.g. private browsing mode). */
function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors (e.g. private mode).
  }
}

class AuthService {
  private user: User | null = null;
  private admin: Admin | null = null;
  private listeners: Set<AuthListener> = new Set();

  constructor() {
    try {
      const savedUser = safeGetItem('user_profile');
      if (savedUser) this.user = JSON.parse(savedUser);

      const savedAdmin = safeGetItem('admin_profile');
      if (savedAdmin) this.admin = JSON.parse(savedAdmin);
    } catch (e) {
      console.error('Failed to parse saved auth profile:', e);
    }
  }

  getUser(): User | null {
    return this.user;
  }

  getAdmin(): Admin | null {
    return this.admin;
  }

  getUserToken(): string | null {
    return safeGetItem('user_token');
  }

  getAdminToken(): string | null {
    return safeGetItem('admin_token');
  }

  setUserSession(user: User, token: string) {
    this.user = user;
    safeSetItem('user_token', token);
    safeSetItem('user_profile', JSON.stringify(user));
    if (typeof window !== 'undefined') {
      document.cookie = `user_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    this.notify();
  }

  setUserProfile(user: User) {
    this.user = user;
    safeSetItem('user_profile', JSON.stringify(user));
    this.notify();
  }

  setAdminSession(admin: Admin, token: string) {
    this.admin = admin;
    safeSetItem('admin_token', token);
    safeSetItem('admin_profile', JSON.stringify(admin));
    if (typeof window !== 'undefined') {
      document.cookie = `admin_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    this.notify();
  }

  setAdminProfile(admin: Admin) {
    this.admin = admin;
    safeSetItem('admin_profile', JSON.stringify(admin));
    this.notify();
  }

  clearUserSession() {
    this.user = null;
    safeRemoveItem('user_token');
    safeRemoveItem('user_profile');
    safeRemoveItem('intended_path');
    if (typeof window !== 'undefined') {
      document.cookie = `user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    this.notify();
  }

  clearAdminSession() {
    this.admin = null;
    safeRemoveItem('admin_token');
    safeRemoveItem('admin_profile');
    if (typeof window !== 'undefined') {
      document.cookie = `admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    this.notify();
  }


  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    // Call listener immediately with current state
    listener({ user: this.user, admin: this.admin });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener({ user: this.user, admin: this.admin });
      } catch (e) {
        console.error('Error running auth subscriber:', e);
      }
    });
  }
}

export const authService = new AuthService();
export default authService;
