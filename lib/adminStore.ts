"use client";

import { useEffect, useState } from 'react';
import { authService } from './auth-service';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | string;
  permissions: Record<string, boolean>;
  status: 'Active' | 'Disabled';
  phone?: string;
  createdAt: number;
  lastLoginAt?: number;
}

class AdminStore {
  private admins: AdminUser[] = [];
  private listeners: (() => void)[] = [];

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((current) => current !== listener);
    };
  }

  getAdmins() {
    return [...this.admins];
  }

  async checkIsAdmin(uid: string): Promise<boolean> {
    const admin = authService.getAdmin();
    return Boolean(admin && String(admin.id) === String(uid));
  }

  async addAdmin(_adminData: Omit<AdminUser, 'createdAt' | 'lastLoginAt'>) {
    throw new Error('Use the Laravel employees API for admin creation.');
  }

  async updateAdmin(_id: string, _updates: Partial<Omit<AdminUser, 'createdAt'>>) {
    throw new Error('Use the Laravel employees API for admin updates.');
  }

  async toggleStatus(_id: string) {
    throw new Error('Use the Laravel employees API for admin status updates.');
  }

  async deleteAdmin(_id: string) {
    throw new Error('Use the Laravel employees API for admin deletion.');
  }
}

export const adminStore = new AdminStore();

export const useAdmins = () => {
  const [admins, setAdmins] = useState<AdminUser[]>(adminStore.getAdmins());

  useEffect(() => {
    const update = () => setAdmins(adminStore.getAdmins());
    update();
    return adminStore.subscribe(update);
  }, []);

  return { admins };
};
