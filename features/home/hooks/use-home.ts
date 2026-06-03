import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import { useAuthGuard } from '@/lib/authGuardContext';
import { guestStore } from '@/lib/guestStore';
import { useUserProjects } from '@/lib/userProjectsStore';

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
  const userName = currentUser ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : (isGuest ? t('home.guest') : 'User');

  const { projects } = useUserProjects();
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
    isWizardOpen,
    setIsWizardOpen,
    handleCreateClick,
    handleNotificationsClick,
  };
}
