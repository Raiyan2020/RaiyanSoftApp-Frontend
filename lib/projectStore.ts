"use client";

import { useEffect, useState } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  link: string;
  createdAt: number;
}

class ProjectStore {
  private projects: Project[] = [];
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

  getProjects() {
    return [...this.projects];
  }

  async addProject(_project: Omit<Project, 'id' | 'createdAt'>) {
    throw new Error('Portfolio project management is not available in the Laravel backend routes yet.');
  }

  async updateProject(_id: string, _updates: Partial<Omit<Project, 'id' | 'createdAt'>>) {
    throw new Error('Portfolio project management is not available in the Laravel backend routes yet.');
  }

  async deleteProject(_id: string) {
    throw new Error('Portfolio project management is not available in the Laravel backend routes yet.');
  }

  reset() {
    this.projects = [];
    this.notify();
  }
}

export const projectStore = new ProjectStore();

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(projectStore.getProjects());

  useEffect(() => {
    const update = () => setProjects(projectStore.getProjects());
    update();
    return projectStore.subscribe(update);
  }, []);

  return { projects };
};
