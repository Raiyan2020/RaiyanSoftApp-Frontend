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
  private hydrated = false;

  private hydrate() {
    if (this.hydrated || typeof window === 'undefined') return;
    this.hydrated = true;
    try {
      const stored = window.localStorage.getItem('raiyansoft_portfolio_projects');
      this.projects = stored ? (JSON.parse(stored) as Project[]) : [];
    } catch {
      this.projects = [];
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('raiyansoft_portfolio_projects', JSON.stringify(this.projects));
    }
  }

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
    this.hydrate();
    return [...this.projects];
  }

  async addProject(project: Omit<Project, 'id' | 'createdAt'>) {
    this.hydrate();
    this.projects = [...this.projects, { ...project, id: crypto.randomUUID(), createdAt: Date.now() }];
    this.persist();
    this.notify();
  }

  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) {
    this.hydrate();
    this.projects = this.projects.map((project) => project.id === id ? { ...project, ...updates } : project);
    this.persist();
    this.notify();
  }

  async deleteProject(id: string) {
    this.hydrate();
    this.projects = this.projects.filter((project) => project.id !== id);
    this.persist();
    this.notify();
  }

  reset() {
    this.hydrate();
    this.projects = [];
    this.persist();
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
