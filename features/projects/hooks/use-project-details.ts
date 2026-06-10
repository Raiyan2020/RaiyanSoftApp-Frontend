import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18nContext';
import { useUserStoredProject } from '@/features/lead-project';

export function useProjectDetails(id?: string) {
  const router = useRouter();
  const { t, dir, language } = useTranslation();
  const { project, loading, error } = useUserStoredProject(id);

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
    loading,
    error,
    handleOpenUrl,
  };
}
