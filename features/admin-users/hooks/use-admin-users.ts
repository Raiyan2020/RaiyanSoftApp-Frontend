import { useCallback, useEffect, useMemo, useState } from 'react';
import { globalToast } from '@/lib/toast-context';
import { UserProject } from '@/lib/userProjectsStore';
import { fetchAdminUsers, toggleAdminUserBlock } from '../services/admin-users-api';
import { fetchAdminProjects } from '@/features/admin-user-projects';
import { AdminUser } from '../types/admin-user.types';
import { mapAdminApiUser } from '../utils/admin-user-mappers';

export function useAdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Disabled'>('All');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'projects'>('profile');
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = searchTerm.trim();
      const data = await fetchAdminUsers({
        name: query,
        email: query,
        phone: query,
      });
      const mappedUsers = data.map(mapAdminApiUser);
      setUsers(mappedUsers);
      setSelectedUser((current) =>
        current ? mappedUsers.find((user) => user.id === current.id) || current : null
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadUsers]);

  const fetchUserProjects = async (uid: string) => {
    setLoadingProjects(true);

    try {
      const apiProjects = await fetchAdminProjects();
      const results: UserProject[] = apiProjects
        .filter((project) => String(project.user?.id || '') === String(uid))
        .map((project) => ({
          id: String(project.id),
          ownerId: String(project.user?.id || uid),
          ownerName: project.user?.full_name || '',
          ownerEmail: project.user?.email || '',
          name: project.project_name || `Project ${project.id}`,
          description: project.description || '',
          estimatedPrice: null,
          estimatedDuration:
            project.estimated_duration === undefined || project.estimated_duration === null
              ? null
              : Number(project.estimated_duration),
          status: 'pricing',
          projectUrl: project.project_url || null,
          createdAt: project.date ? new Date(project.date.replace(/\//g, '-')).getTime() : Date.now(),
          updatedAt: Date.now(),
          stages: [],
          progressUpdates: [],
          weeklyReports: [],
          attachments: [],
          internalNotes: [],
          finalReport: null,
        } as UserProject))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setUserProjects(results);
    } catch (err: any) {
      console.error('Error fetching user projects:', err);
      setActionError(err.message || 'Failed to load user projects.');
      setUserProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (selectedUser && activeTab === 'projects') {
      fetchUserProjects(selectedUser.id);
    }
  }, [selectedUser, activeTab]);

  useEffect(() => {
    if (!selectedUser) {
      setActiveTab('profile');
      setUserProjects([]);
    }
  }, [selectedUser]);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesFilter = filterStatus === 'All' || user.status === filterStatus;

    return matchesSearch && matchesFilter;
  }), [filterStatus, searchTerm, users]);

  const formatDate = (ts: number) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleDateString('en-UK', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (ts: number) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString('en-UK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExport = () => {
    globalToast.info(`Exporting ${filteredUsers.length} users to CSV...`);
  };

  const handleToggleStatus = async (user: AdminUser) => {
    setActionError(null);

    try {
      await toggleAdminUserBlock(user.id);
      await loadUsers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update user status.');
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      setActionError('Deleting admin users is not available in the Postman collection.');
      setDeleteId(null);
    }
  };

  return {
    users,
    loading,
    error,
    actionError,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    selectedUser,
    setSelectedUser,
    deleteId,
    setDeleteId,
    activeTab,
    setActiveTab,
    userProjects,
    loadingProjects,
    filteredUsers,
    formatDate,
    formatDateTime,
    handleExport,
    handleToggleStatus,
    handleDelete,
  };
}
