'use client';

import { useEffect, useState } from 'react';
import { EmployeeValues } from '../schemas/employee.schema';
import { AdminEmployee } from '../types/admin-employee.types';
import { useAdminEmployeesList } from './use-admin-employees-list';
import { useAdminEmployee } from './use-admin-employee';
import { useCreateEmployee } from './use-create-employee';
import { useUpdateEmployee } from './use-update-employee';
import { useDeleteEmployee } from './use-delete-employee';
import { useToggleEmployeeBlock } from './use-toggle-employee-block';

const emptyForm: EmployeeValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'super_admin',
  password: '',
};

export function useAdminEmployees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<AdminEmployee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [formData, setFormData] = useState<EmployeeValues>(emptyForm);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [selectedListEmployee, setSelectedListEmployee] = useState<AdminEmployee | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 whenever the effective (debounced) search changes.
  // Adjusted during render instead of in an effect, so the search change and
  // the page reset land in the same render pass.
  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  const {
    employees,
    pagination,
    loading: listLoading,
    error: listError,
    reload: reloadList,
  } = useAdminEmployeesList(page, debouncedSearch);

  const goToPage = (nextPage: number) => {
    if (!pagination) return;
    setPage(Math.min(Math.max(1, nextPage), pagination.last_page));
  };
  const {
    employee: selectedEmployee,
    loading: detailLoading,
    error: detailError,
    reload: reloadDetail,
  } = useAdminEmployee(selectedEmployeeId, selectedEmployeeId !== null);

  const { createEmployee, loading: createLoading, error: createError } = useCreateEmployee();
  const { updateEmployee, loading: updateLoading, error: updateError } = useUpdateEmployee();
  const { deleteEmployee, loading: deleteLoading, error: deleteError } = useDeleteEmployee();
  const { toggleBlock, loading: toggleLoading, error: toggleError } = useToggleEmployeeBlock();

  // Search runs server-side across all pages (admin/employess?search=).
  const filteredEmployees = employees;

  const handleOpenModal = (employee?: AdminEmployee) => {
    setCreatedPassword(null);
    setActionMessage(null);

    if (employee) {
      const [fallbackFirstName = '', ...fallbackLastNameParts] = (employee.full_name || '').split(' ');
      setEditingEmployee(employee);
      setFormData({
        firstName: employee.first_name || fallbackFirstName,
        lastName: employee.last_name || fallbackLastNameParts.join(' '),
        email: employee.email || '',
        phone: employee.phone || '',
        role: 'super_admin',
        password: '',
      });
    } else {
      setEditingEmployee(null);
      setFormData(emptyForm);
    }

    setIsModalOpen(true);
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: pass }));
  };

  const handleSubmit = async (data: EmployeeValues) => {
    setActionMessage(null);

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          first_name: data.firstName.trim(),
          last_name: data.lastName.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          role: data.role,
        });
        setActionMessage('Employee updated successfully.');
        setIsModalOpen(false);
        await reloadList();
        if (selectedEmployeeId === editingEmployee.id) await reloadDetail();
      } else {
        if (!data.password || data.password.length < 8) {
          throw new Error('Password must be at least 8 characters.');
        }

        await createEmployee({
          first_name: data.firstName.trim(),
          last_name: data.lastName.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          password: data.password,
          role: data.role,
        });

        setCreatedPassword(data.password);
        await reloadList();
      }
    } catch {
      // errors surfaced via mutation hooks
    }
  };

  const openEmployee = (employee: AdminEmployee) => {
    setSelectedEmployeeId(employee.id);
    setSelectedListEmployee(employee);
    setActionMessage(null);
  };

  const closeEmployee = () => {
    setSelectedEmployeeId(null);
    setSelectedListEmployee(null);
    setActionMessage(null);
  };

  const handleToggleStatus = async (employee: AdminEmployee) => {
    try {
      await toggleBlock(employee.id);
      setActionMessage('Employee status updated successfully.');
      await Promise.all([reloadList(), selectedEmployeeId === employee.id ? reloadDetail() : Promise.resolve()]);
    } catch {
      // error surfaced via toggleError
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteEmployee(deleteId);
      if (selectedEmployeeId === deleteId) closeEmployee();
      setDeleteId(null);
      // Deleting the last item on a page beyond the first empties it; step
      // back a page (the page-change effect in useAdminEmployeesList then
      // reloads automatically) instead of reloading the now-empty page.
      if (employees.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await reloadList();
      }
    } catch {
      // error surfaced via deleteError
    }
  };

  const isSubmitting = createLoading || updateLoading;
  const actionError = createError || updateError || deleteError || toggleError || detailError;

  return {
    employees,
    filteredEmployees,
    pagination,
    goToPage,
    // Typed-but-not-yet-debounced search counts as loading.
    listLoading: listLoading || searchTerm.trim() !== debouncedSearch,
    listError,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    editingEmployee,
    selectedEmployee: selectedEmployee || selectedListEmployee,
    selectedEmployeeId,
    detailLoading,
    deleteId,
    setDeleteId,
    isSubmitting,
    deleteLoading,
    toggleLoading,
    createdPassword,
    formData,
    setFormData,
    actionMessage,
    actionError,
    handleOpenModal,
    generatePassword,
    handleSubmit,
    handleToggleStatus,
    handleDelete,
    openEmployee,
    closeEmployee,
    reloadList,
  };
}
