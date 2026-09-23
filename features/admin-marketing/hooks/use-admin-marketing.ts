import { useState, useEffect, useRef } from 'react';
import { marketingStore, useMarketingHistory } from '@/lib/marketingNotifications';
import { fetchAdminUsers } from '@/features/admin-users/services/admin-users-api';
import { mapAdminApiUser } from '@/features/admin-users/utils/admin-user-mappers';
import { AdminUser as User } from '@/features/admin-users/types/admin-user.types';
import { NotificationValues } from '../schemas/notification.schema';
import { sendAdminNotification } from '../services/admin-notifications-api';
import { translateMessage } from '@/lib/i18n-utils';
import { getIntlLocale, readStoredLanguage } from '@/lib/language';

export function useAdminMarketing() {
  const { history } = useMarketingHistory();

  const [targetType, setTargetType] = useState<'all' | 'single'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  // Results are tagged with the query they answer, so "searching" is simply
  // "the current query has no answer yet" — covers the debounce window and
  // the in-flight request, and never shows stale results for an old query.
  const [searchResult, setSearchResult] = useState<{ query: string; users: User[]; failed: boolean }>({
    query: '',
    users: [],
    failed: false,
  });
  const trimmedQuery = searchQuery.trim();
  const isSearchingUsers = trimmedQuery !== '' && searchResult.query !== trimmedQuery;
  const filteredUsers = isSearchingUsers ? [] : searchResult.users;
  const userSearchFailed = !isSearchingUsers && searchResult.failed;

  const [formData, setFormData] = useState<NotificationValues>({
    title: '',
    message: '',
    imageUrl: '',
    deepLink: '',
    isScheduled: false,
    scheduledDate: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced server-side search across name/email/phone (backend does the
  // partial, case-insensitive LIKE matching via AdminUserService::getUsers).
  useEffect(() => {
    const query = trimmedQuery;
    if (query === '') return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const { items } = await fetchAdminUsers({ search: query });
        if (!cancelled) setSearchResult({ query, users: items.slice(0, 5).map(mapAdminApiUser), failed: false });
      } catch {
        if (!cancelled) setSearchResult({ query, users: [], failed: true });
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchQuery('');
    setShowUserDropdown(false);
  };

  const handleSubmit = async (data: NotificationValues) => {
    if (targetType === 'single' && !selectedUser) return;

    setIsSending(true);

    try {
      await sendAdminNotification({
        audience: targetType === 'all' ? 'all_users' : 'users',
        userIds: targetType === 'single' && selectedUser ? [selectedUser.id] : undefined,
        titleAr: data.title,
        titleEn: data.title,
        descriptionAr: data.message,
        descriptionEn: data.message,
      });

      await marketingStore.sendNotification({
        target: {
          type: targetType,
          userId: selectedUser?.id,
          userName: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : undefined,
        },
        title: data.title,
        body: data.message,
        imageUrl: data.imageUrl,
        deepLink: data.deepLink,
        scheduledAt:
          data.isScheduled && data.scheduledDate
            ? new Date(data.scheduledDate).getTime()
            : undefined,
      });

      setSuccessMessage(
        targetType === 'all'
          ? translateMessage('Notification queued for all users')
          : translateMessage('Notification queued for {name}').replace('{name}', selectedUser?.firstName || '')
      );

      setFormData({
        title: '',
        message: '',
        imageUrl: '',
        deepLink: '',
        isScheduled: false,
        scheduledDate: '',
      });
      setSelectedUser(null);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const formatHistoryDate = (ts: number) => {
    return new Date(ts).toLocaleString(getIntlLocale(readStoredLanguage()), {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return {
    history,
    targetType,
    setTargetType,
    selectedUser,
    setSelectedUser,
    searchQuery,
    setSearchQuery,
    showUserDropdown,
    setShowUserDropdown,
    formData,
    setFormData,
    isSending,
    successMessage,
    dropdownRef,
    filteredUsers,
    isSearchingUsers,
    userSearchFailed,
    handleUserSelect,
    handleSubmit,
    formatHistoryDate,
  };
}
