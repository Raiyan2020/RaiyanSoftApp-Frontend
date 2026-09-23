import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import { translateMessage } from '@/lib/i18n-utils';
import { useAuthGuard } from '@/lib/authGuardContext';
import { guestStore } from '@/lib/guestStore';
import { getUserDisplayName } from '@/lib/user-display';
import { useMyProjects } from '@/features/projects';

export function useHome() {
  const router = useRouter();
  const { t } = useTranslation();
  const { requireAuth } = useAuthGuard();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe(({ user }) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isGuest = !currentUser && guestStore.isGuest;
  const userName = currentUser ? getUserDisplayName(currentUser) : (isGuest ? t('home.guest') : translateMessage('User'));

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    pagination: projectsPagination,
    setPage: setProjectsPage,
  } = useMyProjects(Boolean(currentUser));
  const userCreatedProjects = currentUser ? projects : [];

  const handleCreateClick = () => {
    setIsWizardOpen(true);
  };

  const handleNotificationsClick = () => {
    requireAuth(() => router.push('/notifications'));
  };

  return {
    currentUser,
    isGuest,
    userName,
    projects: userCreatedProjects,
    projectsLoading,
    projectsError,
    projectsPagination,
    setProjectsPage,
    isWizardOpen,
    setIsWizardOpen,
    handleCreateClick,
    handleNotificationsClick,
  };
}
