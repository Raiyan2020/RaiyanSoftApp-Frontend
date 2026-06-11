import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/lib/auth-service';
import { globalToast } from '@/lib/toast-context';
import { globalConfirm } from '@/lib/confirm-dialog';
import { useAdminEmployeesList } from '@/features/admin-employees';
import {
  ProjectAttachment,
  ProjectProgressUpdate,
  ProjectStage,
  ProjectStageStatus,
  ProjectWeeklyReport,
  UserProject,
} from '@/lib/userProjectsStore';
import {
  AdminProjectReport,
  AdminProjectSummary,
  AdminStage,
  AdminStageAttachment,
  AdminStageProgress,
  createAdminReport,
  createAdminStage,
  createAdminStageAttachment,
  createAdminStageProgress,
  deleteAdminReport,
  deleteAdminStageAttachment,
  fetchAdminProject,
  fetchAdminReports,
  fetchAdminStage,
  fetchAdminStageAttachments,
  fetchAdminStageProgress,
  fetchAdminStages,
  generateAdminReport,
  updateAdminStage,
} from '../services/admin-projects-api';

export type ProjectDetailTab = 'overview' | 'plan' | 'progress' | 'reports' | 'files' | 'final';

export interface StageFormState {
  title: string;
  description: string;
  assignedTo: string;
  /** Raw admin IDs from the API, used as fallback when the assignee name can't be resolved in the employees list */
  existingAdminIds: number[];
  estimatedDays: string;
  status: ProjectStageStatus;
}

export interface AttachmentFormState {
  stageId: string;
  title: string;
  description: string;
  reason: string;
}

export interface WeeklyReportFormState {
  weekStart: string;
  weekEnd: string;
  content: string;
}

const emptyStageForm: StageFormState = {
  title: '',
  description: '',
  assignedTo: '',
  existingAdminIds: [],
  estimatedDays: '',
  status: 'planned',
};

const emptyAttachmentForm: AttachmentFormState = {
  stageId: '',
  title: '',
  description: '',
  reason: '',
};

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

const getDefaultReportRange = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return {
    weekStart: toDateInputValue(start),
    weekEnd: toDateInputValue(end),
    content: '',
  };
};

const enumValue = (value: unknown): string => {
  if (value && typeof value === 'object' && 'value' in value) {
    return String((value as { value?: string | number }).value || '');
  }
  return value === undefined || value === null ? '' : String(value);
};

const apiStageStatusToStageStatus = (status?: unknown): ProjectStageStatus => {
  const normalized = enumValue(status).toLowerCase();
  if (normalized === '1' || normalized === 'pending') return 'planned';
  if (normalized === '2') return 'active';
  if (normalized === '3') return 'completed';
  if (normalized === '4') return 'planned';
  if (normalized === '5') return 'blocked';
  if (normalized === 'active' || normalized === 'completed' || normalized === 'blocked' || normalized === 'planned') {
    return normalized;
  }
  if (normalized.includes('complete') || normalized.includes('مكتمل')) return 'completed';
  if (normalized.includes('active') || normalized.includes('progress') || normalized.includes('نشط')) return 'active';
  if (normalized.includes('block') || normalized.includes('متوقف')) return 'blocked';
  return 'planned';
};

const stageStatusToApiStatus = (status: ProjectStageStatus) => {
  if (status === 'active') return 2;
  if (status === 'completed') return 3;
  if (status === 'planned') return 4;
  if (status === 'blocked') return 5;
  return 1;
};

const normalizeApiStage = (stage: AdminStage, index: number): ProjectStage => {
  const createdAt = stage.created_at ? new Date(stage.created_at).getTime() : Date.now();
  const updatedAt = stage.updated_at ? new Date(stage.updated_at).getTime() : createdAt;
  const status = apiStageStatusToStageStatus(stage.status);
  const assignedTo =
    stage.admins
      ?.map((admin) => admin.full_name || admin.name)
      .filter(Boolean)
      .join(', ') || '';

  return {
    id: String(stage.id),
    title: stage.title || 'Untitled Stage',
    description: stage.description || '',
    assignedTo,
    estimatedDays: stage.days === undefined || stage.days === null ? null : Number(stage.days),
    order: index,
    progress: status === 'completed' ? 100 : status === 'active' ? 50 : 0,
    status,
    createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
    updatedAt: Number.isNaN(updatedAt) ? Date.now() : updatedAt,
    startedAt: status === 'active' || status === 'completed' ? updatedAt : null,
    completedAt: status === 'completed' ? updatedAt : null,
  };
};

const parseApiProjectDate = (date?: string) => {
  if (!date) return Date.now();
  const parsed = new Date(date.replace(/\//g, '-'));
  return Number.isNaN(parsed.getTime()) ? Date.now() : parsed.getTime();
};

const apiStatusToProjectStatus = (status?: unknown): UserProject['status'] => {
  const normalized = enumValue(status).toLowerCase();
  if (normalized.includes('completed') || normalized.includes('مكتمل')) return 'completed';
  if (normalized.includes('cancel') || normalized.includes('رفض') || normalized.includes('ملغي')) return 'cancelled';
  if (normalized.includes('design')) return 'design';
  if (normalized.includes('develop')) return 'development';
  if (normalized.includes('publish')) return 'publishing';
  if (normalized.includes('support')) return 'support';
  return 'pricing';
};

const mapApiProjectToUserProject = (
  project: AdminProjectSummary,
  stages: ProjectStage[],
  progressUpdates: ProjectProgressUpdate[] = [],
  weeklyReports: ProjectWeeklyReport[] = [],
  attachments: ProjectAttachment[] = []
): UserProject => ({
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
  status: apiStatusToProjectStatus(project.project_status || project.status),
  projectUrl: project.project_url || null,
  createdAt: parseApiProjectDate(project.date),
  updatedAt: Date.now(),
  version: enumValue(project.project_status || project.status) || 'Backend',
  iconBg: '#1DB7F0',
  brandColor: '#1DB7F0',
  industry: enumValue(project.type) || '',
  stages,
  progressUpdates,
  weeklyReports,
  attachments,
  internalNotes: [],
  finalReport: null,
});

const normalizeApiProgressUpdate = (
  update: AdminStageProgress,
  stagesById: Map<string, ProjectStage>
): ProjectProgressUpdate => {
  const stageId = String(update.stage_id || '');
  const stage = stagesById.get(stageId);
  const nextProgress = Number(update.percentage ?? update.progress ?? stage?.progress ?? 0);
  return {
    id: String(update.id),
    stageId,
    stageTitle: stage?.title || 'Stage',
    previousProgress: nextProgress,
    nextProgress,
    note: update.note || '',
    createdAt: update.created_at ? new Date(update.created_at).getTime() : Date.now(),
    createdByName: update.admin?.full_name || update.admin?.name || 'Admin',
  };
};

const normalizeApiWeeklyReport = (report: AdminProjectReport): ProjectWeeklyReport => {
  const weekStart = report.start_date ? parseDateInput(report.start_date) : Date.now();
  const weekEnd = report.end_date ? parseDateInput(report.end_date, true) : weekStart;
  const updatedAt = report.updated_at ? new Date(report.updated_at).getTime() : Date.now();
  const createdAt = report.created_at ? new Date(report.created_at).getTime() : updatedAt;
  return {
    id: String(report.id),
    weekStart,
    weekEnd,
    content: report.report_text || report.content || '',
    status: report.status === 'sent' ? 'sent' : 'draft',
    sourceUpdateIds: [],
    clientVisible: report.status === 'sent',
    createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
    updatedAt: Number.isNaN(updatedAt) ? Date.now() : updatedAt,
    createdByName: 'Admin',
    sentAt: report.status === 'sent' ? updatedAt : null,
  };
};

/** Normalises a storage URL from the backend.
 *  Laravel's APP_URL may be stale (e.g. portal.new.raiyansoft.net) while the
 *  real server lives at the host of NEXT_PUBLIC_API_URL. We swap the origin so
 *  the link always points to the live server. */
const normalizeStorageUrl = (raw?: string | null): string => {
  if (!raw) return '';
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    if (!apiBase) return raw;
    const apiOrigin = new URL(apiBase).origin;   // e.g. https://portal.raiyan.cc
    const parsed = new URL(raw);
    if (parsed.origin !== apiOrigin) {
      parsed.host = new URL(apiBase).host;
      parsed.protocol = new URL(apiBase).protocol;
      return parsed.toString();
    }
  } catch {
    // not a valid absolute URL — return as-is
  }
  return raw;
};

const normalizeApiAttachment = (attachment: AdminStageAttachment): ProjectAttachment => {
  const createdAt = attachment.created_at ? new Date(attachment.created_at).getTime() : Date.now();
  const fileName = attachment.file_name || attachment.title || 'attachment';
  return {
    id: String(attachment.id),
    stageId: String(attachment.stage_id || ''),
    title: attachment.title || 'Untitled attachment',
    description: attachment.description || '',
    reason: attachment.reason || '',
    fileName,
    fileType: attachment.file_type || String(attachment.type || attachment.type_label || 'application/octet-stream'),
    fileSize: Number(attachment.file_size || 0),
    storagePath: '',
    url: normalizeStorageUrl(attachment.attachment_url || attachment.url || attachment.attachment),
    createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
    createdByName: 'Admin',
  };
};

const parseDateInput = (value: string, endOfDay = false) => {
  const date = value ? new Date(`${value}T00:00:00`) : new Date();
  if (endOfDay) date.setHours(23, 59, 59, 999);
  return date.getTime();
};

const formatReportDate = (value: number) =>
  new Date(value).toLocaleDateString('en-UK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const getCurrentActorName = () => {
  const admin = authService.getAdmin();
  const user = authService.getUser();
  const actor = admin || user;
  return actor?.full_name || actor?.name || actor?.email || 'Admin';
};

const resolveAdminIds = (
  assignedTo: string,
  admins: Array<{ id: string | number; name?: string; first_name?: string; last_name?: string }>
) => {
  if (!assignedTo.trim()) return [];
  const directId = Number(assignedTo);
  if (Number.isInteger(directId)) return [directId];
  const matched = admins.find((admin) => {
    const fullName = admin.name || [admin.first_name, admin.last_name].filter(Boolean).join(' ').trim();
    return fullName === assignedTo;
  });
  if (!matched) return [];
  const numericId = Number(matched.id);
  return Number.isInteger(numericId) ? [numericId] : [];
};

const resolveAssignedToValue = (
  assignedTo: string,
  admins: Array<{ id: string | number; name?: string; first_name?: string; last_name?: string }>
) => {
  if (!assignedTo.trim()) return '';
  const directMatch = admins.find((admin) => String(admin.id) === assignedTo);
  if (directMatch) return String(directMatch.id);
  const matched = admins.find((admin) => {
    const fullName = admin.name || [admin.first_name, admin.last_name].filter(Boolean).join(' ').trim();
    return fullName === assignedTo;
  });
  return matched ? String(matched.id) : assignedTo;
};

const optionalList = async <T,>(loader: () => Promise<T[]>): Promise<T[]> => {
  try {
    return await loader();
  } catch {
    return [];
  }
};

export function useAdminProjectOperations(ownerId?: string, projectId?: string) {
  const { employees } = useAdminEmployeesList();
  const isApiProject = ownerId === 'api';
  const [project, setProject] = useState<UserProject | null>(null);
  const [activeTab, setActiveTab] = useState<ProjectDetailTab>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);
  const [stageForm, setStageForm] = useState<StageFormState>(emptyStageForm);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [loadingStageId, setLoadingStageId] = useState<string | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [progressValue, setProgressValue] = useState(0);
  const [progressNote, setProgressNote] = useState('');
  const [attachmentForm, setAttachmentForm] = useState<AttachmentFormState>(emptyAttachmentForm);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [noteStageId, setNoteStageId] = useState('');
  const [noteText, setNoteText] = useState('');
  const [reportForm, setReportForm] = useState<WeeklyReportFormState>(getDefaultReportRange);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [finalReportContent, setFinalReportContent] = useState('');

  const setError = useCallback((message: string | null) => {
    setErrorState(message);
    if (message) {
      globalToast.error(message);
    }
  }, []);

  const loadProject = useCallback(async () => {
    if (!isApiProject || !projectId) {
      setProject(null);
      setError('This admin project page now requires a Laravel API project.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [apiProject, apiStages, apiProgress, apiReports, apiAttachments] = await Promise.all([
        fetchAdminProject(projectId),
        fetchAdminStages(),
        optionalList(() => fetchAdminStageProgress({ project_id: projectId, per_page: 100 })),
        optionalList(() => fetchAdminReports({ project_id: projectId })),
        optionalList(() => fetchAdminStageAttachments({ project_id: projectId, per_page: 100 })),
      ]);
      const normalizedStages = apiStages
        .filter((stage) => {
          const stageProjectId = stage.project_id || stage.project?.id;
          return !stageProjectId || String(stageProjectId) === String(projectId);
        })
        .map(normalizeApiStage);
      const stageIds = new Set(normalizedStages.map((stage) => stage.id));
      const stagesById = new Map(normalizedStages.map((stage) => [stage.id, stage]));
      const normalizedProgress = apiProgress
        .filter(
          (update) =>
            String(update.project_id || '') === String(projectId) ||
            stageIds.has(String(update.stage_id || ''))
        )
        .map((update) => normalizeApiProgressUpdate(update, stagesById))
        .sort((a, b) => b.createdAt - a.createdAt);
      const latestProgressByStage = new Map<string, ProjectProgressUpdate>();
      normalizedProgress
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .forEach((update) => {
          if (!latestProgressByStage.has(update.stageId)) latestProgressByStage.set(update.stageId, update);
        });
      const stagesWithProgress = normalizedStages.map((stage) => {
        const latest = latestProgressByStage.get(stage.id);
        if (!latest) return stage;
        const progress = Math.max(0, Math.min(100, Number(latest.nextProgress) || 0));
        return {
          ...stage,
          progress,
          status: progress >= 100 ? 'completed' : stage.status === 'planned' ? 'active' : stage.status,
          updatedAt: latest.createdAt,
        } satisfies ProjectStage;
      });
      const normalizedReports = apiReports
        .filter((report) => String(report.project_id || '') === String(projectId))
        .map(normalizeApiWeeklyReport)
        .sort((a, b) => b.weekStart - a.weekStart);
      const normalizedAttachments = apiAttachments
        .filter((attachment) => stageIds.has(String(attachment.stage_id || '')))
        .map(normalizeApiAttachment)
        .sort((a, b) => b.createdAt - a.createdAt);
      const normalizedProject = mapApiProjectToUserProject(
        apiProject,
        stagesWithProgress,
        normalizedProgress,
        normalizedReports,
        normalizedAttachments
      );

      setProject(normalizedProject);
      setFinalReportContent(normalizedReports[0]?.content || '');

      const activeStage = stagesWithProgress.find((stage) => stage.status === 'active');
      const firstStage = stagesWithProgress[0];
      const defaultStage = activeStage || firstStage;
      if (defaultStage) {
        setSelectedStageId(defaultStage.id);
        setProgressValue(defaultStage.progress || 0);
        setAttachmentForm((prev) => ({ ...prev, stageId: prev.stageId || defaultStage.id }));
        setNoteStageId((prev) => prev || defaultStage.id);
      }
    } catch (err: any) {
      console.error('Failed to load project operations:', err);
      setError(err.message || 'Failed to load project.');
    } finally {
      setLoading(false);
    }
  }, [isApiProject, projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const stages = project?.stages || [];
  const progressUpdates = project?.progressUpdates || [];
  const weeklyReports = project?.weeklyReports || [];
  const attachments = project?.attachments || [];
  const internalNotes = project?.internalNotes || [];
  const selectedStage = stages.find((stage) => stage.id === selectedStageId) || null;
  const completedStages = stages.filter((stage) => stage.status === 'completed').length;
  const completionChecks = {
    hasStages: stages.length > 0,
    allStagesComplete: stages.length > 0 && stages.every((stage) => stage.status === 'completed' || stage.progress >= 100),
    hasProgressHistory: progressUpdates.length > 0,
    hasReportHistory: weeklyReports.some((report) => report.status === 'sent'),
  };
  const canApproveCompletion =
    completionChecks.hasStages && completionChecks.allStagesComplete && project?.status !== 'completed';
  const overallProgress = stages.length
    ? Math.round(stages.reduce((sum, stage) => sum + (stage.progress || 0), 0) / stages.length)
    : 0;

  useEffect(() => {
    if (selectedStage) {
      setProgressValue(selectedStage.progress || 0);
    }
  }, [selectedStage?.id]);

  const resetStageForm = () => {
    setStageForm(emptyStageForm);
    setEditingStageId(null);
  };

  const startEditStage = async (stage: ProjectStage) => {
    setLoadingStageId(stage.id);
    let selectedStage = stage;
    let rawAdminIds: number[] = [];

    if (isApiProject) {
      try {
        const apiStage = await fetchAdminStage(stage.id);
        rawAdminIds = (apiStage.admin_ids || apiStage.admins?.map((a) => Number(a.id)).filter(Boolean) || []) as number[];
        selectedStage = normalizeApiStage(apiStage, stage.order || 0);
      } catch (err) {
        console.warn('Failed to load stage detail, using list data:', err);
      }
    }

    setEditingStageId(selectedStage.id);
    setStageForm({
      title: selectedStage.title,
      description: selectedStage.description || '',
      assignedTo: resolveAssignedToValue(selectedStage.assignedTo || '', employees),
      existingAdminIds: rawAdminIds,
      estimatedDays: selectedStage.estimatedDays ? String(selectedStage.estimatedDays) : '',
      status: selectedStage.status,
    });
    setActiveTab('plan');
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        document.getElementById('stage-editor-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    setLoadingStageId(null);
  };

  const saveStage = async () => {
    if (!project || !stageForm.title.trim()) return;

    setSaving(true);
    try {
      const resolvedAdminIds = resolveAdminIds(stageForm.assignedTo, employees);
      // Fall back to the IDs loaded when opening the edit form (e.g. when the assignee is
      // a super admin not present in the employees list)
      const finalAdminIds = resolvedAdminIds.length > 0 ? resolvedAdminIds : stageForm.existingAdminIds;
      const stagePayload = {
        project_id: String(projectId || project?.id || ''),
        title: stageForm.title.trim(),
        description: stageForm.description.trim(),
        days: stageForm.estimatedDays ? Number(stageForm.estimatedDays) : null,
        status: stageStatusToApiStatus(stageForm.status),
        admin_ids: finalAdminIds,
      };

      if (!isApiProject) {
        const message = 'This project is not available from the Laravel API.';
        setError(message);
        globalToast.error(message);
        return;
      }
      if (finalAdminIds.length === 0) {
        const message = 'Please assign at least one employee before saving this stage.';
        setError(message);
        globalToast.error(message);
        return;
      }
      if (!stagePayload.days || stagePayload.days < 1) {
        const message = 'Estimated days is required for backend stages.';
        setError(message);
        globalToast.error(message);
        return;
      }
      if (editingStageId) {
        await updateAdminStage(editingStageId, stagePayload);
      } else {
        await createAdminStage(stagePayload);
      }
      await loadProject();
      resetStageForm();
    } catch (err: any) {
      console.error('Failed to save stage:', err);
      const message = err?.message || 'Failed to save stage.';
      setError(message);
      globalToast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const deleteStage = async (stageId: string) => {
    if (!project) return;
    const confirmed = await globalConfirm.confirm({
      title: 'Delete stage?',
      message: 'Delete this stage? Progress updates will remain in history.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      if (isApiProject) {
        globalToast.info('Stage deletion is not available for API-backed projects yet.');
        return;
      }
      globalToast.error('This project is not available from the Laravel API.');
    } catch (err: any) {
      console.error('Failed to delete stage:', err);
      setError(err.message || 'Failed to delete stage.');
    } finally {
      setSaving(false);
    }
  };

  const saveProgressUpdate = async () => {
    if (!project || !selectedStage) return;
    if (!progressNote.trim()) {
      setError('Add a progress note before saving the update.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const now = Date.now();
      const nextValue = Math.max(0, Math.min(100, Number(progressValue) || 0));
      if (nextValue >= 100 && selectedStage.progress < 100) {
        const confirmed = await globalConfirm.confirm({
          title: 'Mark stage complete?',
          message: 'Mark this stage complete at 100% progress?',
          confirmText: 'Mark complete',
          cancelText: 'Cancel',
        });
        if (!confirmed) {
          setSaving(false);
          return;
        }
      }
      if (!isApiProject) {
        const message = 'This project is not available from the Laravel API.';
        setError(message);
        globalToast.error(message);
        return;
      }
      await createAdminStageProgress({
        stage_id: selectedStage.id,
        project_id: projectId || project.id,
        percentage: nextValue,
        note: progressNote.trim(),
      });
      await loadProject();
      setProgressNote('');
    } catch (err: any) {
      console.error('Failed to save progress update:', err);
      setError(err.message || 'Failed to save progress update.');
    } finally {
      setSaving(false);
    }
  };

  const saveAttachment = async () => {
    if (!project || !ownerId || !projectId) return;
    if (!attachmentForm.stageId || !attachmentForm.title.trim() || !attachmentForm.description.trim() || !attachmentForm.reason.trim()) {
      setError('Attachment requires a stage, title, description, and reason.');
      return;
    }
    if (!attachmentFile) {
      setError('Choose a document file before saving the attachment.');
      return;
    }
    const allowedExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar)$/i;
    if (!allowedExtensions.test(attachmentFile.name)) {
      setError('Only document files are allowed (PDF, Word, Excel, PowerPoint, ZIP, etc.). Photos and videos are not permitted.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (!isApiProject) {
        const message = 'This project is not available from the Laravel API.';
        setError(message);
        globalToast.error(message);
        return;
      }
      await createAdminStageAttachment({
        stage_id: attachmentForm.stageId,
        title: attachmentForm.title.trim(),
        description: attachmentForm.description.trim(),
        reason: attachmentForm.reason.trim(),
        type: 2,
        attachment: attachmentFile,
      });
      await loadProject();
      setAttachmentForm({ ...emptyAttachmentForm, stageId: attachmentForm.stageId });
      setAttachmentFile(null);
    } catch (err: any) {
      console.error('Failed to save attachment:', err);
      setError(err.message || 'Failed to save attachment.');
    } finally {
      setSaving(false);
    }
  };

  const deleteAttachment = async (attachmentId: string) => {
    if (!project) return;
    const attachment = attachments.find((item) => item.id === attachmentId);
    if (!attachment) return;
    const confirmed = await globalConfirm.confirm({
      title: 'Delete attachment?',
      message: 'Delete this attachment?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      if (!isApiProject) {
        const message = 'This project is not available from the Laravel API.';
        setError(message);
        globalToast.error(message);
        return;
      }
      await deleteAdminStageAttachment(attachmentId);
      await loadProject();
    } catch (err: any) {
      console.error('Failed to delete attachment:', err);
      setError(err.message || 'Failed to delete attachment.');
    } finally {
      setSaving(false);
    }
  };

  const saveInternalNote = async () => {
    if (!project) return;
    if (!noteStageId || !noteText.trim()) {
      setError('Choose a stage and write a note before saving.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const message = 'Internal notes are not available in the Laravel backend routes yet.';
      setError(message);
      globalToast.info(message);
    } catch (err: any) {
      console.error('Failed to save internal note:', err);
      setError(err.message || 'Failed to save internal note.');
    } finally {
      setSaving(false);
    }
  };

  const deleteInternalNote = async (noteId: string) => {
    if (!project) return;
    const confirmed = await globalConfirm.confirm({
      title: 'Delete note?',
      message: 'Delete this internal note?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const message = 'Internal notes are not available in the Laravel backend routes yet.';
      setError(message);
      globalToast.info(message);
    } catch (err: any) {
      console.error('Failed to delete internal note:', err);
      setError(err.message || 'Failed to delete internal note.');
    } finally {
      setSaving(false);
    }
  };

  const resetReportForm = () => {
    setReportForm(getDefaultReportRange());
    setEditingReportId(null);
  };

  const startEditReport = (report: ProjectWeeklyReport) => {
    setEditingReportId(report.id);
    setReportForm({
      weekStart: toDateInputValue(new Date(report.weekStart)),
      weekEnd: toDateInputValue(new Date(report.weekEnd)),
      content: report.content,
    });
    setActiveTab('reports');
  };

  const generateWeeklyDraft = async () => {
    if (!project) return;

    const weekStart = parseDateInput(reportForm.weekStart);
    const weekEnd = parseDateInput(reportForm.weekEnd, true);

    if (isApiProject) {
      setSaving(true);
      setError(null);
      try {
        const generated = await generateAdminReport(projectId || project.id, reportForm.weekStart, reportForm.weekEnd);
        const content =
          generated && 'report_text' in generated
            ? generated.report_text
            : generated && 'content' in generated
            ? generated.content
            : '';
        setReportForm((prev) => ({
          ...prev,
          content: content || prev.content,
        }));
      } catch (err: any) {
        console.error('Failed to generate report draft:', err);
        setError(err.message || 'Failed to generate report draft.');
      } finally {
        setSaving(false);
      }
      return;
    }

    const updatesInRange = progressUpdates
      .filter((update) => update.createdAt >= weekStart && update.createdAt <= weekEnd)
      .sort((a, b) => a.createdAt - b.createdAt);

    const stageSummary = stages
      .map((stage) => `- ${stage.title}: ${stage.progress}% (${stage.status})`)
      .join('\n');

    const updateSummary = updatesInRange.length
      ? updatesInRange
          .map(
            (update) =>
              `- ${formatReportDate(update.createdAt)} - ${update.stageTitle}: ${update.previousProgress}% to ${
                update.nextProgress
              }%. ${update.note}`
          )
          .join('\n')
      : '- No progress updates were logged during this week.';

    setReportForm((prev) => ({
      ...prev,
      content: [
        `Weekly report for ${project.name}`,
        `Period: ${formatReportDate(weekStart)} - ${formatReportDate(weekEnd)}`,
        '',
        'Progress summary:',
        stageSummary || '- No stages have been planned yet.',
        '',
        'Updates this week:',
        updateSummary,
        '',
        `Overall progress: ${overallProgress}%`,
      ].join('\n'),
    }));
  };

  const saveWeeklyReport = async (_markSent = false) => {
    if (!project) return;
    if (!reportForm.weekStart || !reportForm.weekEnd || !reportForm.content.trim()) {
      setError('Choose a week range and write report content before saving.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (!isApiProject) {
        const message = 'This project is not available from the Laravel API.';
        setError(message);
        globalToast.error(message);
        return;
      }
      await createAdminReport({
        project_id: projectId || project.id,
        start_date: reportForm.weekStart,
        end_date: reportForm.weekEnd,
        report_text: reportForm.content.trim(),
      });
      await loadProject();
      resetReportForm();
    } catch (err: any) {
      console.error('Failed to save weekly report:', err);
      setError(err.message || 'Failed to save weekly report.');
    } finally {
      setSaving(false);
    }
  };

  const deleteWeeklyReport = async (reportId: string) => {
    if (!project) return;
    const confirmed = await globalConfirm.confirm({
      title: 'Delete report?',
      message: 'Delete this weekly report?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      if (!isApiProject) {
        const message = 'This project is not available from the Laravel API.';
        setError(message);
        globalToast.error(message);
        return;
      }
      await deleteAdminReport(reportId);
      await loadProject();
      if (editingReportId === reportId) resetReportForm();
    } catch (err: any) {
      console.error('Failed to delete weekly report:', err);
      setError(err.message || 'Failed to delete weekly report.');
    } finally {
      setSaving(false);
    }
  };

  const generateFinalReport = () => {
    if (!project) return;

    const stageLines = stages.length
      ? stages
          .map(
            (stage, index) =>
              `${index + 1}. ${stage.title} - ${stage.status}, ${stage.progress}% complete, assigned to ${
                stage.assignedTo || 'unassigned'
              }, estimated ${stage.estimatedDays || 0} days.`
          )
          .join('\n')
      : 'No stages were planned.';

    const progressLines = progressUpdates.length
      ? progressUpdates
          .slice()
          .sort((a, b) => a.createdAt - b.createdAt)
          .map(
            (update) =>
              `- ${formatReportDate(update.createdAt)} - ${update.stageTitle}: ${update.previousProgress}% to ${
                update.nextProgress
              }%. ${update.note}`
          )
          .join('\n')
      : 'No progress updates were logged.';

    const reportLines = weeklyReports.length
      ? weeklyReports
          .filter((report) => report.status === 'sent')
          .map((report) => `- ${formatReportDate(report.weekStart)} - ${formatReportDate(report.weekEnd)}: sent`)
          .join('\n')
      : 'No weekly reports were sent.';

    const attachmentLines = attachments.length
      ? attachments.map((attachment) => `- ${attachment.title}: ${attachment.fileName}`).join('\n')
      : 'No dashboard attachments were added.';

    const noteLines = internalNotes.length
      ? internalNotes.map((note) => `- ${formatReportDate(note.createdAt)}: ${note.text}`).join('\n')
      : 'No internal notes were added.';

    setFinalReportContent(
      [
        `Final project report for ${project.name}`,
        `Client: ${project.ownerName} (${project.ownerEmail})`,
        `Generated: ${formatReportDate(Date.now())}`,
        `Overall progress: ${overallProgress}%`,
        '',
        'Stages:',
        stageLines,
        '',
        'Progress history:',
        progressLines,
        '',
        'Weekly reports:',
        reportLines,
        '',
        'Dashboard attachments:',
        attachmentLines,
        '',
        'Internal admin notes:',
        noteLines,
      ].join('\n')
    );
  };

  const saveFinalReport = async () => {
    if (!project || !finalReportContent.trim()) {
      setError('Generate or write a final report before saving.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const finalReport = {
        content: finalReportContent.trim(),
        generatedAt: project.finalReport?.generatedAt || Date.now(),
        approvedAt: project.finalReport?.approvedAt || null,
        approvedByName: project.finalReport?.approvedByName || '',
      };

      if (!isApiProject) {
        const message = 'This project is not available from the Laravel API.';
        setError(message);
        globalToast.error(message);
        return;
      }
      await createAdminReport({
        project_id: projectId || project.id,
        start_date: toDateInputValue(new Date()),
        end_date: toDateInputValue(new Date()),
        report_text: finalReport.content,
      });
      await loadProject();
    } catch (err: any) {
      console.error('Failed to save final report:', err);
      setError(err.message || 'Failed to save final report.');
    } finally {
      setSaving(false);
    }
  };

  const approveProjectCompletion = async () => {
    if (!project) return;
    if (isApiProject) {
      const message = 'Project completion approval endpoint is not available in the Laravel backend routes yet.';
      setError(message);
      globalToast.info(message);
      return;
    }
    const message = 'This project is not available from the Laravel API.';
    setError(message);
    globalToast.error(message);
  };

  return {
    isApiProject,
    project,
    stages,
    employees,
    progressUpdates,
    weeklyReports,
    attachments,
    internalNotes,
    selectedStage,
    completedStages,
    completionChecks,
    canApproveCompletion,
    overallProgress,
    activeTab,
    setActiveTab,
    loading,
    saving,
    error,
    setError,
    stageForm,
    setStageForm,
    editingStageId,
    loadingStageId,
    selectedStageId,
    setSelectedStageId,
    progressValue,
    setProgressValue,
    progressNote,
    setProgressNote,
    attachmentForm,
    setAttachmentForm,
    attachmentFile,
    setAttachmentFile,
    noteStageId,
    setNoteStageId,
    noteText,
    setNoteText,
    reportForm,
    setReportForm,
    editingReportId,
    finalReportContent,
    setFinalReportContent,
    loadProject,
    saveStage,
    deleteStage,
    startEditStage,
    resetStageForm,
    saveProgressUpdate,
    saveAttachment,
    deleteAttachment,
    saveInternalNote,
    deleteInternalNote,
    generateWeeklyDraft,
    saveWeeklyReport,
    deleteWeeklyReport,
    startEditReport,
    resetReportForm,
    generateFinalReport,
    saveFinalReport,
    approveProjectCompletion,
  };
}
