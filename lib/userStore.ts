"use client";

import { useEffect, useState } from 'react';

export type UserRole = 'Customer' | 'Admin';
export type UserStatus = 'Active' | 'Disabled';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: number;
  lastLoginAt: number;
  projectsCount: number;
}

class UserStore {
  private users: User[] = [];
  private listeners: (() => void)[] = [];
  private error: string | null = null;

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((current) => current !== listener);
    };
  }

  getUsers() {
    return [...this.users];
  }

  getError() {
    return this.error;
  }

  async toggleStatus(_id: string) {
    throw new Error('Use the Laravel admin users API for user status updates.');
  }

  async deleteUser(_id: string) {
    throw new Error('User deletion is not available in the Laravel backend routes yet.');
  }
}

export const userStore = new UserStore();

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(userStore.getUsers());
  const [error, setError] = useState<string | null>(userStore.getError());

  useEffect(() => {
    const update = () => {
      setUsers(userStore.getUsers());
      setError(userStore.getError());
    };
    update();
    return userStore.subscribe(update);
  }, []);

  return { users, error };
};
