import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18nContext';
import { authService } from '@/lib/auth-service';
import { apiService } from '@/lib/api-service';
import { useUserStoredProject } from '@/features/lead-project';
import type { ClientProjectExtras } from '../types';

// Raw fields the client project detail endpoint returns that the shared
// lead-project mapper doesn't carry through (it predates 2.1/2.2).
type RawClientProjectResponse = {
  status?: string | number | null;
  project_status?: { value?: string; key?: string; name?: string } | null;
  rejection_reason?: string | null;
  reports?: Array<{
    id: number;
    title?: string | null;
    date?: string | null;
    summary?: string | null;
    report_text?: string | null;
  }>;
};

function mapExtras(raw: RawClientProjectResponse | null | undefined): ClientProjectExtras {
  return {
    status: raw?.status ?? null,
    phase: raw?.project_status
      ? {
          value: raw.project_status.value || '',
          key: raw.project_status.key || null,
          name: raw.project_status.name || null,
        }
      : null,
    rejectionReason: raw?.rejection_reason || null,
    reports: (raw?.reports || []).map((report) => ({
      id: report.id,
      title: report.title || null,
      date: report.date || null,
      summary: report.summary || null,
      reportText: report.report_text || null,
    })),
  };
}

function useClientProjectExtras(id?: string) {
  const { language } = useTranslation();

  const query = useQuery({
    queryKey: ['projects', 'client-extras', id, language],
    queryFn: async () => {
      const response = await apiService.get<RawClientProjectResponse>(`user/my-projects/${id}`, {
        headers: { 'Accept-Language': language },
        skipGlobalToast: true,
      });
      if (!response.status || !response.data) return null;
      return response.data;
    },
    enabled: Boolean(id) && typeof window !== 'undefined' && Boolean(authService.getUserToken()),
    meta: { skipGlobalErrorToast: true },
  });

  return mapExtras(query.data);
}

export function useProjectDetails(id?: string) {
  const router = useRouter();
  const { t, dir, language } = useTranslation();
  const { project, loading, error } = useUserStoredProject(id);
  const extras = useClientProjectExtras(id);

  const handleOpenUrl = () => {
    if (project?.projectUrl) {
      window.open(project.projectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return {
    router,
    t,
    dir,
    language,
    project,
    extras,
    loading,
    error,
    handleOpenUrl,
  };
}
