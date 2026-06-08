import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import { useAuthGuard } from '@/lib/authGuardContext';
import { guestStore } from '@/lib/guestStore';
import { getUserDisplayName } from '@/lib/user-display';
import { useUserStoredProjects } from '@/features/lead-project/hooks/use-user-stored-projects';

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
  const userName = currentUser ? getUserDisplayName(currentUser) : (isGuest ? t('home.guest') : 'User');

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useUserStoredProjects(Boolean(currentUser));
  const userCreatedProjects = currentUser ? projects : [];

  const handleCreateClick = () => {
    requireAuth(() => setIsWizardOpen(true));
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
    isWizardOpen,
    setIsWizardOpen,
    handleCreateClick,
    handleNotificationsClick,
  };
}
