import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';
import { app, db } from '@/lib/firebase-client';
import { UserProject } from '@/lib/userProjectsStore';
import { fetchAdminUsers, toggleAdminUserBlock } from '../api/admin-users-api';
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

  useEffect(() => {
    if (app && app.options) {
      console.log('Admin Dashboard Loaded. Firebase Project ID:', app.options.projectId);
    }
  }, []);

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
    const results: UserProject[] = [];
    const seenIds = new Set<string>();

    try {
      if (db) {
        try {
          const subColRef = collection(db, 'users', uid, 'projects');
          const subColQ = query(subColRef, orderBy('createdAt', 'desc'));
          const subColSnap = await getDocs(subColQ);
          subColSnap.forEach((d) => {
            if (!seenIds.has(d.id)) {
              results.push({ id: d.id, ...d.data() } as UserProject);
              seenIds.add(d.id);
            }
          });
        } catch (e) {
          console.warn('Subcollection fetch failed', e);
        }

        try {
          const rootColRef = collection(db, 'user-projects');
          const qUserId = query(rootColRef, where('userId', '==', uid));
          const snapUserId = await getDocs(qUserId);
          snapUserId.forEach((d) => {
            if (!seenIds.has(d.id)) {
              results.push({ id: d.id, ...d.data() } as UserProject);
              seenIds.add(d.id);
            }
          });
        } catch (e) {
          console.warn('Root collection fetch failed', e);
        }

        try {
          const legacyDocRef = doc(db, 'user-projects', uid);
          const legacySnap = await getDoc(legacyDocRef);
          if (legacySnap.exists()) {
            const data = legacySnap.data();
            if (data.projects && Array.isArray(data.projects)) {
              data.projects.forEach((p: any, idx: number) => {
                const pseudoId = `legacy_${uid}_${idx}`;
                if (!seenIds.has(pseudoId)) {
                  results.push({ ...p, id: pseudoId } as UserProject);
                  seenIds.add(pseudoId);
                }
              });
            }
          }
        } catch (e) {
          console.warn('Legacy doc fetch failed', e);
        }
      }

      results.sort((a, b) => {
        const dateA = a.createdAt || 0;
        const dateB = b.createdAt || 0;
        return dateB - dateA;
      });

      setUserProjects(results);
    } catch (err) {
      console.error('Error fetching user projects:', err);
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
    alert(`Exporting ${filteredUsers.length} users to CSV...`);
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
