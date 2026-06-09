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
  name: string;
  email: string;
}

type AuthListener = (state: { user: User | null; admin: Admin | null }) => void;

class AuthService {
  private user: User | null = null;
  private admin: Admin | null = null;
  private listeners: Set<AuthListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('user_profile');
        if (savedUser) this.user = JSON.parse(savedUser);

        const savedAdmin = localStorage.getItem('admin_profile');
        if (savedAdmin) this.admin = JSON.parse(savedAdmin);
      } catch (e) {
        console.error('Failed to parse saved auth profile:', e);
      }
    }
  }

  getUser(): User | null {
    return this.user;
  }

  getAdmin(): Admin | null {
    return this.admin;
  }

  getUserToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user_token');
  }

  getAdminToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  }

  setUserSession(user: User, token: string) {
    this.user = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_token', token);
      localStorage.setItem('user_profile', JSON.stringify(user));
      document.cookie = `user_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    this.notify();
  }

  setUserProfile(user: User) {
    this.user = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_profile', JSON.stringify(user));
    }
    this.notify();
  }

  setAdminSession(admin: Admin, token: string) {
    this.admin = admin;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_profile', JSON.stringify(admin));
      document.cookie = `admin_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    this.notify();
  }

  clearUserSession() {
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('intended_path');
      document.cookie = `user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    this.notify();
  }

  clearAdminSession() {
    this.admin = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_profile');
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
