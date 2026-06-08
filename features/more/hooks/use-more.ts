import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import { guestStore } from '@/lib/guestStore';
import { useAuthGuard } from '@/lib/authGuardContext';
import { deleteUserAccount, logoutUser } from '@/features/auth/api/user-auth-api';

export function useMore() {
  const router = useRouter();
  const [showSignOut, setShowSignOut] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { t, dir } = useTranslation();
  const { requireAuth } = useAuthGuard();

  useEffect(() => {
    const unsubscribe = authService.subscribe(({ user: currentUser }) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isGuest = !user && guestStore.isGuest;
  const userName = user ? `${user.first_name} ${user.last_name}` : (isGuest ? t('home.guest') : 'User');
  const userEmail = user?.email || (isGuest ? 'Guest Access' : 'No Email');

  const handleSignOut = async () => {
    try {
      if (authService.getUserToken()) {
        await logoutUser();
      }
    } catch (error) {
      console.error('Backend sign out failed', error);
    } finally {
      authService.clearUserSession();
      guestStore.setGuest(false);
      router.push('/login');
    }
  };

  const handleGuestExit = () => {
    guestStore.setGuest(false);
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
    } catch (error) {
      console.error('Backend account deletion failed', error);
    } finally {
      authService.clearUserSession();
      guestStore.setGuest(false);
      router.push('/login');
    }
  };

  const protectedNavigate = (path: string) => {
    requireAuth(() => router.push(path));
  };

  return {
    router,
    t,
    dir,
    isGuest,
    userName,
    userEmail,
    showSignOut,
    setShowSignOut,
    showDelete,
    setShowDelete,
    handleSignOut,
    handleGuestExit,
    handleDeleteAccount,
    protectedNavigate,
  };
}
