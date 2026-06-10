"use client";

import { useEffect, useState } from 'react';
import { PERMISSIONS_LIST } from './permissions';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: number;
}

export { PERMISSIONS_LIST };

const SUPER_ADMIN_ROLE: Role = {
  id: 'super_admin',
  name: 'super_admin',
  description: 'Built-in Laravel administrator role.',
  permissions: ['*'],
  createdAt: 0,
};

class RoleStore {
  private roles: Role[] = [SUPER_ADMIN_ROLE];
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

  getRoles() {
    return [...this.roles];
  }

  getRole(id: string) {
    return this.roles.find((role) => role.id === id);
  }

  async addRole(_role: Omit<Role, 'id' | 'createdAt'>) {
    throw new Error('Roles are not available in the Laravel backend routes yet. Use super_admin only.');
  }

  async updateRole(_id: string, _updates: Partial<Omit<Role, 'id' | 'createdAt'>>) {
    throw new Error('Roles are not available in the Laravel backend routes yet. Use super_admin only.');
  }

  async deleteRole(_id: string) {
    throw new Error('Roles are not available in the Laravel backend routes yet. Use super_admin only.');
  }
}

export const roleStore = new RoleStore();

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>(roleStore.getRoles());

  useEffect(() => {
    const update = () => setRoles(roleStore.getRoles());
    update();
    return roleStore.subscribe(update);
  }, []);

  return { roles };
};
