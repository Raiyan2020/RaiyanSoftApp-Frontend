"use client";

import { useEffect, useState } from "react";

export type ProjectStatus =
  | "pricing"
  | "design"
  | "development"
  | "publishing"
  | "support"
  | "completed"
  | "cancelled";

export type ProjectStageStatus = "planned" | "active" | "completed" | "blocked";

export interface ProjectStage {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  estimatedDays?: number | null;
  order: number;
  progress: number;
  status: ProjectStageStatus;
  createdAt: number;
  updatedAt: number;
  startedAt?: number | null;
  completedAt?: number | null;
}

export interface ProjectProgressUpdate {
  id: string;
  stageId: string;
  stageTitle: string;
  previousProgress: number;
  nextProgress: number;
  note: string;
  createdAt: number;
  createdByName?: string;
}

export interface ProjectAttachment {
  id: string;
  stageId: string;
  title: string;
  description: string;
  reason: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  url: string;
  createdAt: number;
  createdByName?: string;
}

export interface ProjectInternalNote {
  id: string;
  stageId: string;
  text: string;
  adminOnly: true;
  createdAt: number;
  createdByName?: string;
}

export interface ProjectWeeklyReport {
  id: string;
  weekStart: number;
  weekEnd: number;
  content: string;
  status: "draft" | "sent";
  sourceUpdateIds: string[];
  clientVisible: boolean;
  createdAt: number;
  updatedAt: number;
  createdByName?: string;
  sentAt?: number | null;
}

export interface ProjectFinalReport {
  content: string;
  generatedAt: number;
  approvedAt?: number | null;
  approvedByName?: string;
}

export interface UserProject {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  name: string;
  description: string;
  estimatedPrice: number | null;
  estimatedDuration: number | null;
  status: ProjectStatus;
  projectUrl?: string | null;
  createdAt: number;
  updatedAt: number;
  version?: string;
  iconBg?: string;
  brandColor?: string;
  stages?: ProjectStage[];
  progressUpdates?: ProjectProgressUpdate[];
  weeklyReports?: ProjectWeeklyReport[];
  attachments?: ProjectAttachment[];
  internalNotes?: ProjectInternalNote[];
  finalReport?: ProjectFinalReport | null;
  completedAt?: number | null;

  platforms?: string[];
  languages?: string[];
  markets?: string[];
  industry?: string;
  industryOther?: string | null;
  hasPayments?: boolean;
  hasExistingBusiness?: boolean;
  serviceModel?: string;
  closestApp?: string;
}

const unsupportedProjectStoreMessage =
  "User project mutations must use the Laravel project APIs.";

class UserProjectsStore {
  private projects: UserProject[] = [];
  private listeners: (() => void)[] = [];

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  getAllProjects() {
    return [...this.projects];
  }

  replaceProjects(projects: UserProject[]) {
    this.projects = projects;
    this.notify();
  }

  async addProject(_project: Omit<UserProject, "id" | "createdAt" | "updatedAt">) {
    throw new Error(unsupportedProjectStoreMessage);
  }

  async updateProject(_projectId: string, _updates: Partial<Omit<UserProject, "id" | "createdAt">>) {
    throw new Error(unsupportedProjectStoreMessage);
  }

  async deleteProject(_projectId: string) {
    throw new Error(unsupportedProjectStoreMessage);
  }
}

export const userProjectsStore = new UserProjectsStore();

export const useUserProjects = () => {
  const [projects, setProjects] = useState<UserProject[]>(userProjectsStore.getAllProjects());

  useEffect(() => {
    const update = () => setProjects(userProjectsStore.getAllProjects());
    update();
    return userProjectsStore.subscribe(update);
  }, []);

  return { projects, store: userProjectsStore };
};
