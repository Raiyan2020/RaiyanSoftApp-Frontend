'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Pencil,
  Plus,
  Search,
  X,
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18nContext';
import {
  getStatusLabel,
  getTypeLabel,
  ProfileRecord,
  ProfileRecordStatus,
  ProfileRecordType,
  profileRecords,
  profileRecordTypes,
} from './profile-records-data';

type ProfileRecordScope = 'all' | ProfileRecordType;

interface ProfileTableProps {
  scope?: ProfileRecordScope;
  selectedRecordId?: string | null;
  onOpenBookingDialog?: () => void;
  onOpenLeadDialog?: () => void;
}

type RecordFormValues = Pick<ProfileRecord, 'title' | 'type' | 'owner' | 'date' | 'amount' | 'status' | 'description'>;

const statusColors: Record<ProfileRecordStatus, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const typeColors: Record<ProfileRecordType, string> = {
  booking: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  deal: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  project: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  notification: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  info: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

const emptyForm: RecordFormValues = {
  title: '',
  type: 'booking',
  owner: '',
  date: new Date().toISOString().slice(0, 10),
  amount: 0,
  status: 'pending',
  description: '',
};

function fakeServerQuery({
  records,
  scope,
  search,
  sorting,
  pagination,
}: {
  records: ProfileRecord[];
  scope: ProfileRecordScope;
  search: string;
  sorting: SortingState;
  pagination: PaginationState;
}) {
  const normalizedSearch = search.trim().toLowerCase();
  let rows = records.filter((record) => {
    const matchesScope = scope === 'all' ? true : record.type === scope;
    const matchesSearch = normalizedSearch
      ? [record.id, record.title, record.owner, record.description, record.status, record.type]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      : true;

    return matchesScope && matchesSearch;
  });

  const sort = sorting[0];
  if (sort) {
    rows = [...rows].sort((a, b) => {
      const aValue = a[sort.id as keyof ProfileRecord];
      const bValue = b[sort.id as keyof ProfileRecord];
      const result = String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      return sort.desc ? -result : result;
    });
  }

  const totalRows = rows.length;
  const start = pagination.pageIndex * pagination.pageSize;
  const pagedRows = rows.slice(start, start + pagination.pageSize);

  return {
    rows: pagedRows,
    allRows: rows,
    totalRows,
    pageCount: Math.max(1, Math.ceil(totalRows / pagination.pageSize)),
  };
}

export default function ProfileTable({
  scope = 'all',
  selectedRecordId,
  onOpenBookingDialog,
  onOpenLeadDialog,
}: ProfileTableProps) {
  const { dir } = useTranslation();
  const [records, setRecords] = useState<ProfileRecord[]>(profileRecords);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsRecord, setDetailsRecord] = useState<ProfileRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<ProfileRecord | null>(null);
  const [formValues, setFormValues] = useState<RecordFormValues>(emptyForm);

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [scope, search]);

  const serverResult = useMemo(
    () => fakeServerQuery({ records, scope, search, sorting, pagination }),
    [records, scope, search, sorting, pagination]
  );

  useEffect(() => {
    if (!selectedRecordId) return;

    const targetIndex = serverResult.allRows.findIndex((record) => record.id === selectedRecordId);
    if (targetIndex >= 0) {
      const targetPageIndex = Math.floor(targetIndex / pagination.pageSize);
      if (targetPageIndex !== pagination.pageIndex) {
        setPagination((current) => ({ ...current, pageIndex: targetPageIndex }));
        return;
      }
    }

    const targetRecord = records.find((record) => record.id === selectedRecordId);
    if (targetRecord) {
      setDetailsRecord(targetRecord);
      window.setTimeout(() => {
        document.getElementById(`profile-record-${targetRecord.id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 80);
    }
  }, [selectedRecordId, serverResult.allRows, pagination.pageIndex, pagination.pageSize, records]);

  const openCreateDialog = () => {
    if (scope === 'booking') {
      onOpenBookingDialog?.();
      return;
    }

    if (onOpenLeadDialog) {
      onOpenLeadDialog();
      return;
    }

    setEditingRecord(null);
    setFormValues({
      ...emptyForm,
      type: scope === 'all' ? 'booking' : scope,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (record: ProfileRecord) => {
    setEditingRecord(record);
    setFormValues({
      title: record.title,
      type: record.type,
      owner: record.owner,
      date: record.date,
      amount: record.amount,
      status: record.status,
      description: record.description,
    });
    setDialogOpen(true);
  };

  const openDetailsDialog = (record: ProfileRecord) => {
    setDetailsRecord(record);
  };

  const markRecordComplete = (recordId: string) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === recordId ? { ...record, status: 'completed' } : record
      )
    );
    setDetailsRecord((current) =>
      current?.id === recordId ? { ...current, status: 'completed' } : current
    );
  };

  const saveRecord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingRecord) {
      setRecords((current) =>
        current.map((record) =>
          record.id === editingRecord.id
            ? { ...record, ...formValues, amount: Number(formValues.amount) || 0 }
            : record
        )
      );
    } else {
      setRecords((current) => [
        {
          id: `REC-${Date.now().toString().slice(-4)}`,
          ...formValues,
          amount: Number(formValues.amount) || 0,
        },
        ...current,
      ]);
    }

    setDialogOpen(false);
  };

  const columns = useMemo<ColumnDef<ProfileRecord>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-primary"
          >
            {dir === 'rtl' ? 'السجل' : 'Record'}
            <ArrowUpDown size={14} />
          </button>
        ),
        cell: ({ row }) => (
          <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
            <div className="font-bold text-[var(--text)] max-w-[18rem] truncate">{row.original.title}</div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">{row.original.id}</div>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: () => <span>{dir === 'rtl' ? 'النوع' : 'Type'}</span>,
        cell: ({ row }) => (
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${typeColors[row.original.type]}`}>
            {getTypeLabel(row.original.type, dir)}
          </span>
        ),
      },
      {
        accessorKey: 'owner',
        header: () => <span>{dir === 'rtl' ? 'المسؤول' : 'Owner'}</span>,
        cell: ({ row }) => <span className="text-sm text-[var(--text)]">{row.original.owner}</span>,
      },
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="mx-auto inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-primary"
          >
            {dir === 'rtl' ? 'التاريخ' : 'Date'}
            <ArrowUpDown size={14} />
          </button>
        ),
        cell: ({ row }) => <div className="text-center font-mono text-sm">{row.original.date}</div>,
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="mx-auto inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-primary"
          >
            {dir === 'rtl' ? 'القيمة' : 'Amount'}
            <ArrowUpDown size={14} />
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-center font-mono text-sm">
            {row.original.amount > 0 ? `$${row.original.amount.toLocaleString()}` : '-'}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: () => <span>{dir === 'rtl' ? 'الحالة' : 'Status'}</span>,
        cell: ({ row }) => (
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusColors[row.original.status]}`}>
            {getStatusLabel(row.original.status, dir)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <span>{dir === 'rtl' ? 'الإجراءات' : 'Actions'}</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => openDetailsDialog(row.original)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-primary"
              aria-label={dir === 'rtl' ? 'عرض' : 'View'}
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              onClick={() => markRecordComplete(row.original.id)}
              disabled={row.original.status === 'completed'}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-emerald-400 disabled:opacity-40"
              aria-label={dir === 'rtl' ? 'تمييز كمكتمل' : 'Mark complete'}
            >
              <CheckCircle2 size={16} />
            </button>
            <Link
              href={`/profile/records/${row.original.id}`}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-primary"
              aria-label={dir === 'rtl' ? 'فتح الصفحة' : 'Open page'}
            >
              <ChevronRight size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </Link>
            <button
              type="button"
              onClick={() => openEditDialog(row.original)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-primary"
              aria-label={dir === 'rtl' ? 'تعديل' : 'Edit'}
            >
              <Pencil size={16} />
            </button>
          </div>
        ),
      },
    ],
    [dir]
  );

  const table = useReactTable({
    data: serverResult.rows,
    columns,
    pageCount: serverResult.pageCount,
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  const currentStart = serverResult.totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const currentEnd = Math.min((pagination.pageIndex + 1) * pagination.pageSize, serverResult.totalRows);

  const PaginationFirstIcon = dir === 'rtl' ? ChevronsRight : ChevronsLeft;
  const PaginationPrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const PaginationNextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const PaginationLastIcon = dir === 'rtl' ? ChevronsLeft : ChevronsRight;

  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-4 sm:space-y-5" dir={dir}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 text-start">
          <h2 className="text-lg font-black text-[var(--text)] sm:text-xl">
            {scope === 'all' ? (dir === 'rtl' ? 'كل السجلات' : 'All Records') : getTypeLabel(scope, dir)}
          </h2>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            {dir === 'rtl'
              ? 'بيانات تجريبية الآن، بنفس شكل الربط المتوقع مع API لاحقاً.'
              : 'Fake data for now, shaped like future API-driven records.'}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:shrink-0">
          <div className="relative min-w-0 w-full sm:min-w-[14rem] sm:flex-1 lg:w-64">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={dir === 'rtl' ? 'بحث في السجلات...' : 'Search records...'}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-3 ps-10 pe-4 text-sm text-[var(--text)] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              dir={dir}
            />
          </div>
          <Button type="button" onClick={openCreateDialog} className="w-full shrink-0 gap-2 sm:w-auto">
            <Plus size={16} />
            {scope === 'booking'
              ? dir === 'rtl' ? 'إضافة حجز' : 'Add Booking'
              : dir === 'rtl' ? 'إضافة طلب' : 'Add Lead'}
          </Button>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {rows.length > 0 ? (
          rows.map((row) => (
            <ProfileRecordCard
              key={row.id}
              record={row.original}
              dir={dir}
              isSelected={selectedRecordId === row.original.id}
              onView={() => openDetailsDialog(row.original)}
              onComplete={() => markRecordComplete(row.original.id)}
              onEdit={() => openEditDialog(row.original)}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-10 text-center text-sm text-[var(--text-muted)]">
            {dir === 'rtl' ? 'لا توجد سجلات مطابقة.' : 'No matching records found.'}
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] lg:block">
        <table className="w-full min-w-[860px] text-sm" dir={dir}>
          <thead className="border-b border-[var(--border)] bg-[var(--surface)] text-xs uppercase text-[var(--text-muted)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-5 py-4 font-bold text-center first:text-start">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr
                  key={row.id}
                  id={`profile-record-${row.original.id}`}
                  className={`transition-colors hover:bg-[var(--surface)]/70 ${
                    selectedRecordId === row.original.id ? 'bg-primary/10 ring-1 ring-inset ring-primary/30' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4 text-center text-[var(--text-muted)] first:text-start">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-[var(--text-muted)]">
                  {dir === 'rtl' ? 'لا توجد سجلات مطابقة.' : 'No matching records found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center text-xs font-medium text-[var(--text-muted)] sm:text-start">
          {dir === 'rtl'
            ? `عرض ${currentStart} - ${currentEnd} من ${serverResult.totalRows}`
            : `Showing ${currentStart} - ${currentEnd} of ${serverResult.totalRows}`}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end" dir={dir}>
          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] transition-colors hover:bg-[var(--surface)] disabled:opacity-40"
            aria-label={dir === 'rtl' ? 'الصفحة الأولى' : 'First page'}
          >
            <PaginationFirstIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] transition-colors hover:bg-[var(--surface)] disabled:opacity-40"
            aria-label={dir === 'rtl' ? 'الصفحة السابقة' : 'Previous page'}
          >
            <PaginationPrevIcon size={16} />
          </button>
          <span className="px-2 text-xs font-bold text-[var(--text-muted)]">
            {pagination.pageIndex + 1} / {serverResult.pageCount}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] transition-colors hover:bg-[var(--surface)] disabled:opacity-40"
            aria-label={dir === 'rtl' ? 'الصفحة التالية' : 'Next page'}
          >
            <PaginationNextIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => table.setPageIndex(serverResult.pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] transition-colors hover:bg-[var(--surface)] disabled:opacity-40"
            aria-label={dir === 'rtl' ? 'الصفحة الأخيرة' : 'Last page'}
          >
            <PaginationLastIcon size={16} />
          </button>
        </div>
      </div>

      {dialogOpen ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-4" dir={dir}>
          <form
            onSubmit={saveRecord}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl no-scrollbar sm:rounded-3xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4 text-start">
              <div className="flex-1">
                <h3 className="text-xl font-black text-[var(--text)]">
                  {editingRecord
                    ? dir === 'rtl' ? 'تعديل السجل' : 'Update Record'
                    : dir === 'rtl' ? 'إضافة سجل جديد' : 'Create Record'}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {dir === 'rtl' ? 'هذه البيانات تجريبية حتى يتم ربط API.' : 'This is fake data until the API is connected.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={dir === 'rtl' ? 'العنوان' : 'Title'}
                value={formValues.title}
                onChange={(event) => setFormValues((current) => ({ ...current, title: event.target.value }))}
                required
                dir={dir}
              />
              <Input
                label={dir === 'rtl' ? 'المسؤول' : 'Owner'}
                value={formValues.owner}
                onChange={(event) => setFormValues((current) => ({ ...current, owner: event.target.value }))}
                required
                dir={dir}
              />
              <div className="space-y-2">
                <label className="ms-1 block text-xs font-medium text-[var(--text-muted)]">
                  {dir === 'rtl' ? 'النوع' : 'Type'}
                </label>
                <select
                  value={formValues.type}
                  onChange={(event) => setFormValues((current) => ({ ...current, type: event.target.value as ProfileRecordType }))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary"
                >
                  {profileRecordTypes.map((type) => (
                    <option key={type} value={type}>
                      {getTypeLabel(type, dir)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="ms-1 block text-xs font-medium text-[var(--text-muted)]">
                  {dir === 'rtl' ? 'الحالة' : 'Status'}
                </label>
                <select
                  value={formValues.status}
                  onChange={(event) => setFormValues((current) => ({ ...current, status: event.target.value as ProfileRecordStatus }))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary"
                >
                  {(['active', 'pending', 'completed', 'cancelled', 'draft'] as ProfileRecordStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status, dir)}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label={dir === 'rtl' ? 'التاريخ' : 'Date'}
                type="date"
                value={formValues.date}
                onChange={(event) => setFormValues((current) => ({ ...current, date: event.target.value }))}
                required
                dir="ltr"
              />
              <Input
                label={dir === 'rtl' ? 'القيمة' : 'Amount'}
                type="number"
                min={0}
                value={String(formValues.amount)}
                onChange={(event) => setFormValues((current) => ({ ...current, amount: Number(event.target.value) }))}
                dir="ltr"
              />
              <div className="sm:col-span-2">
                <Textarea
                  label={dir === 'rtl' ? 'الوصف' : 'Description'}
                  value={formValues.description}
                  onChange={(event) => setFormValues((current) => ({ ...current, description: event.target.value }))}
                  required
                  dir={dir}
                  rows={4}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                {dir === 'rtl' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" className="w-full gap-2 sm:w-auto">
                <Check size={16} />
                {dir === 'rtl' ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      {detailsRecord ? (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-4" dir={dir}>
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl no-scrollbar sm:rounded-3xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4 text-start">
              <div className="min-w-0 flex-1">
                <p className="mb-2 font-mono text-xs font-bold text-[var(--text-muted)]">{detailsRecord.id}</p>
                <h3 className="text-2xl font-black text-[var(--text)]">{detailsRecord.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${typeColors[detailsRecord.type]}`}>
                    {getTypeLabel(detailsRecord.type, dir)}
                  </span>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusColors[detailsRecord.status]}`}>
                    {getStatusLabel(detailsRecord.status, dir)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsRecord(null)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <DetailLine label={dir === 'rtl' ? 'المسؤول' : 'Owner'} value={detailsRecord.owner} />
              <DetailLine label={dir === 'rtl' ? 'التاريخ' : 'Date'} value={detailsRecord.date} />
              <DetailLine
                label={dir === 'rtl' ? 'القيمة' : 'Amount'}
                value={detailsRecord.amount > 0 ? `$${detailsRecord.amount.toLocaleString()}` : '-'}
              />
              <div className="text-start">
                <p className="text-xs font-bold text-[var(--text-muted)]">{dir === 'rtl' ? 'التفاصيل' : 'Details'}</p>
                <p className="mt-1 break-words text-sm leading-7 text-[var(--text)]">{detailsRecord.description}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setDetailsRecord(null)} className="w-full sm:w-auto">
                {dir === 'rtl' ? 'إغلاق' : 'Close'}
              </Button>
              <Button
                type="button"
                onClick={() => markRecordComplete(detailsRecord.id)}
                disabled={detailsRecord.status === 'completed'}
                className="w-full gap-2 sm:w-auto"
              >
                <CheckCircle2 size={16} />
                {dir === 'rtl' ? 'تمييز كمكتمل' : 'Mark complete'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DetailLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 text-start sm:flex-row sm:gap-4">
      <span className="shrink-0 text-xs font-bold text-[var(--text-muted)] sm:w-28">{label}</span>
      <span className="min-w-0 flex-1 break-words text-sm font-bold text-[var(--text)]">{value}</span>
    </div>
  );
}

function ProfileRecordCard({
  record,
  dir,
  isSelected,
  onView,
  onComplete,
  onEdit,
}: {
  record: ProfileRecord;
  dir: 'ltr' | 'rtl';
  isSelected: boolean;
  onView: () => void;
  onComplete: () => void;
  onEdit: () => void;
}) {
  return (
    <article
      id={`profile-record-${record.id}`}
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition-colors ${
        isSelected ? 'bg-primary/10 ring-1 ring-inset ring-primary/30' : ''
      }`}
    >
      <div className="text-start">
        <p className="font-mono text-[11px] font-bold text-[var(--text-muted)]">{record.id}</p>
        <h3 className="mt-1 break-words text-base font-black text-[var(--text)]">{record.title}</h3>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${typeColors[record.type]}`}>
          {getTypeLabel(record.type, dir)}
        </span>
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusColors[record.status]}`}>
          {getStatusLabel(record.status, dir)}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-start">
        <div>
          <dt className="text-[11px] font-bold text-[var(--text-muted)]">{dir === 'rtl' ? 'المسؤول' : 'Owner'}</dt>
          <dd className="mt-1 break-words text-sm font-bold text-[var(--text)]">{record.owner}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold text-[var(--text-muted)]">{dir === 'rtl' ? 'التاريخ' : 'Date'}</dt>
          <dd className="mt-1 font-mono text-sm text-[var(--text)]">{record.date}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[11px] font-bold text-[var(--text-muted)]">{dir === 'rtl' ? 'القيمة' : 'Amount'}</dt>
          <dd className="mt-1 font-mono text-sm text-[var(--text)]">
            {record.amount > 0 ? `$${record.amount.toLocaleString()}` : '-'}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
        <button
          type="button"
          onClick={onView}
          className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-primary"
          aria-label={dir === 'rtl' ? 'عرض' : 'View'}
        >
          <Eye size={16} />
        </button>
        <button
          type="button"
          onClick={onComplete}
          disabled={record.status === 'completed'}
          className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-emerald-400 disabled:opacity-40"
          aria-label={dir === 'rtl' ? 'تمييز كمكتمل' : 'Mark complete'}
        >
          <CheckCircle2 size={16} />
        </button>
        <Link
          href={`/profile/records/${record.id}`}
          className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-primary"
          aria-label={dir === 'rtl' ? 'فتح الصفحة' : 'Open page'}
        >
          <ChevronRight size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
        </Link>
        <button
          type="button"
          onClick={onEdit}
          className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-primary"
          aria-label={dir === 'rtl' ? 'تعديل' : 'Edit'}
        >
          <Pencil size={16} />
        </button>
      </div>
    </article>
  );
}
