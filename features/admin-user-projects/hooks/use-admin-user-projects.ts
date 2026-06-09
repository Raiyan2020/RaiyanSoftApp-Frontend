import { useState, useEffect } from 'react';
import { UserProject, ProjectStatus } from '@/lib/userProjectsStore';
import { UserProjectEditValues } from '../schemas/user-project-edit.schema';
import { AdminProjectSummary, fetchAdminProjects, updateAdminProject } from '../api/admin-projects-api';

export const statusOptions: ProjectStatus[] = [
  'pricing',
  'design',
  'development',
  'publishing',
  'support',
  'completed',
  'cancelled',
];

export const INDUSTRIES = [
  'Food & Delivery',
  'Fashion & Clothing',
  'Pharmacy & Healthcare',
  'Pets & Animals',
  'Services',
  'Education',
  'Real Estate',
  'Travel & Tourism',
  'Finance',
  'Logistics & Shipping',
  'Other',
];

const apiStatusToProjectStatus = (status?: string): ProjectStatus => {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('completed') || normalized.includes('مكتمل')) return 'completed';
  if (normalized.includes('cancel') || normalized.includes('رفض') || normalized.includes('ملغي')) return 'cancelled';
  if (normalized.includes('design')) return 'design';
  if (normalized.includes('develop')) return 'development';
  if (normalized.includes('publish')) return 'publishing';
  if (normalized.includes('support')) return 'support';
  return 'pricing';
};

const enumValue = (value: unknown): string => {
  if (value && typeof value === 'object' && 'value' in value) {
    return String((value as { value?: string | number }).value || '');
  }
  return value === undefined || value === null ? '' : String(value);
};

const projectTypeToIndustry = (type?: unknown) => {
  const normalized = enumValue(type);
  const map: Record<string, string> = {
    food_delivery: 'Food & Delivery',
    fashion_clothing: 'Fashion & Clothing',
    pharmacy_healthcare: 'Pharmacy & Healthcare',
    pets_animals: 'Pets & Animals',
    services: 'Services',
    education: 'Education',
    real_estate: 'Real Estate',
    travel_tourism: 'Travel & Tourism',
    finance: 'Finance',
    logistics_shipping: 'Logistics & Shipping',
    other: 'Other',
  };
  return map[normalized] || normalized;
};

const industryToProjectType = (industry?: string) => {
  const map: Record<string, string> = {
    'Food & Delivery': 'food_delivery',
    'Fashion & Clothing': 'fashion_clothing',
    'Pharmacy & Healthcare': 'pharmacy_healthcare',
    'Pets & Animals': 'pets_animals',
    Services: 'services',
    Education: 'education',
    'Real Estate': 'real_estate',
    'Travel & Tourism': 'travel_tourism',
    Finance: 'finance',
    'Logistics & Shipping': 'logistics_shipping',
    Other: 'other',
  };
  return industry ? map[industry] || industry : null;
};

const parseApiDate = (date?: string) => {
  if (!date) return Date.now();
  const normalized = date.replace(/\//g, '-');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? Date.now() : parsed.getTime();
};

const mapAdminProjectToUserProject = (project: AdminProjectSummary): UserProject => ({
  id: String(project.id),
  ownerId: 'api',
  ownerName: project.user?.full_name || 'Customer',
  ownerEmail: project.user?.email || '',
  name: project.project_name || `Project ${project.id}`,
  description: project.description || '',
  estimatedPrice: null,
  estimatedDuration:
    project.estimated_duration === undefined || project.estimated_duration === null
      ? null
      : Number(project.estimated_duration),
  status: apiStatusToProjectStatus(enumValue(project.project_status) || project.status),
  projectUrl: project.project_url || null,
  createdAt: parseApiDate(project.date),
  updatedAt: parseApiDate(project.date),
  version: enumValue(project.project_status) || project.status || 'Backend',
  industry: projectTypeToIndustry(project.type),
  iconBg: '#1DB7F0',
  brandColor: '#1DB7F0',
});

export function useAdminUserProjects() {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [editingProject, setEditingProject] = useState<UserProject | null>(null);
  const [formData, setFormData] = useState<UserProjectEditValues>({
    name: '',
    description: '',
    estimatedPrice: '',
    estimatedDuration: '',
    status: 'pricing',
    projectUrl: '',
    industry: '',
    industryOther: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = (await fetchAdminProjects()).map(mapAdminProjectToUserProject);

      results.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setProjects(results);
    } catch (err: any) {
      console.error('Failed to load projects:', err);
      setError(`Error loading projects: ${err.message || 'Request failed.'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name || '',
        description: editingProject.description || '',
        estimatedPrice: editingProject.estimatedPrice ?? '',
        estimatedDuration: editingProject.estimatedDuration ?? '',
        status: editingProject.status || 'pricing',
        projectUrl: editingProject.projectUrl || '',
        industry: editingProject.industry || '',
        industryOther: editingProject.industryOther || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        estimatedPrice: '',
        estimatedDuration: '',
        status: 'pricing',
        projectUrl: '',
        industry: '',
        industryOther: '',
      });
    }
  }, [editingProject]);

  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.ownerName && p.ownerName.toLowerCase().includes(term)) ||
      (p.ownerEmail && p.ownerEmail.toLowerCase().includes(term))
    );
  });

  const handleEdit = (project: UserProject) => {
    setEditingProject(project);
  };

  const handleSave = async (data: UserProjectEditValues) => {
    if (!editingProject) return;

    setIsSaving(true);
    try {
      const updates = {
        name: data.name,
        description: data.description || '',
        estimatedPrice: data.estimatedPrice !== '' ? Number(data.estimatedPrice) : null,
        estimatedDuration: data.estimatedDuration !== '' ? Number(data.estimatedDuration) : null,
        status: data.status,
        projectUrl: data.projectUrl || null,
        industry: data.industry,
        industryOther: data.industryOther || null,
      };

      if (editingProject.ownerId === 'api') {
        await updateAdminProject(editingProject.id, {
          project_name: data.name || undefined,
          estimated_duration: data.estimatedDuration !== '' ? Number(data.estimatedDuration) : null,
          project_status: data.status || null,
          project_url: data.projectUrl || null,
          type: industryToProjectType(data.industry) || null,
        });
        await fetchProjects();
        setEditingProject(null);
        return;
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...p, ...updates } : p))
      );

      setEditingProject(null);
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Project edit is local only until the backend adds an update project endpoint.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (ts: number) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleDateString('en-UK', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return {
    projects,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    editingProject,
    setEditingProject,
    formData,
    setFormData,
    isSaving,
    filteredProjects,
    handleEdit,
    handleSave,
    formatDate,
  };
}
