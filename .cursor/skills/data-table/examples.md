# Data Table Examples

## Example 1 — Profile records (reference)

**Feature:** `components/profile/profile-table.tsx`  
**Row type:** `ProfileRecord`  
**Filters:** `scope` (all | booking | deal | project | notification | info)  
**Search keys:** id, title, owner, description, status, type

```tsx
const dataTable = useDataTable<ProfileRecord>({
  data: records,
  columns,
  initialPageSize: 5,
  initialSorting: [{ id: 'date', desc: true }],
  initialFilters: { scope },
  searchKeys: ['id', 'title', 'owner', 'description', 'status', 'type'],
  filterFn: (row, filters) =>
    filters.scope === 'all' || row.type === filters.scope,
});

// scope comes from parent tab — sync via useEffect:
useEffect(() => {
  dataTable.setFilter('scope', scope);
}, [scope]);
```

Mobile card shows: id, title, type badge, status badge, owner, date, amount, action buttons.

---

## Example 2 — Admin leads

**Feature:** `features/admin-leads/`  
**Row type:** `Lead`

```tsx
const dataTable = useDataTable<Lead>({
  data: leads,
  columns: leadColumns,
  initialSorting: [{ id: 'createdAt', desc: true }],
  initialFilters: { status: 'all' },
  searchKeys: ['id', 'name', 'phone', 'email'],
  filterFn: (lead, filters) => {
    const status = filters.status as string;
    if (status === 'all') return lead.status !== 'deleted';
    return lead.status === status;
  },
});
```

Replace `LeadsFilterBar` search with `DataTableToolbar`. Keep `LeadDetailDrawer` in feature.

---

## Example 3 — Sortable column header only

```tsx
{
  accessorKey: 'date',
  header: ({ column }) => (
    <DataTableSortHeader
      column={column}
      label={dir === 'rtl' ? 'التاريخ' : 'Date'}
    />
  ),
  cell: ({ row }) => (
    <span className="font-mono text-sm">{row.original.date}</span>
  ),
}
```

---

## Example 4 — Custom mobile card

```tsx
function LeadMobileCard({ lead, onSelect }: { lead: Lead; onSelect: () => void }) {
  const { dir } = useTranslation();

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-start">
      <h3 className="font-black text-[var(--text)]">{lead.name}</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{lead.phone}</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={onSelect}>
          {dir === 'rtl' ? 'عرض' : 'View'}
        </Button>
      </div>
    </article>
  );
}

// In feature render:
renderMobileRow={(row) => (
  <LeadMobileCard lead={row} onSelect={() => setSelectedLead(row)} />
)}
```

---

## Example 5 — Toolbar with status filter

```tsx
<DataTableToolbar
  search={dataTable.search}
  onSearchChange={dataTable.setSearch}
  searchPlaceholder={dir === 'rtl' ? 'بحث في العملاء...' : 'Search leads...'}
  filters={
    <select
      value={String(dataTable.filters.status ?? 'all')}
      onChange={(e) => dataTable.setFilter('status', e.target.value)}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm"
    >
      <option value="all">{dir === 'rtl' ? 'الكل' : 'All'}</option>
      <option value="pending">{dir === 'rtl' ? 'قيد المراجعة' : 'Pending'}</option>
      <option value="approved">{dir === 'rtl' ? 'مقبول' : 'Approved'}</option>
    </select>
  }
  actions={
    <Button onClick={onExport} variant="outline">
      {dir === 'rtl' ? 'تصدير' : 'Export'}
    </Button>
  }
/>
```

---

## Example 6 — `applyClientQuery` utility

```ts
// lib/data-table/apply-client-query.ts
export function applyClientQuery<T>({
  data,
  search,
  searchKeys,
  filters,
  filterFn,
  sorting,
  pagination,
}: ClientQueryParams<T>): DataTableQueryResult<T> {
  let rows = data;

  if (filterFn && filters) {
    rows = rows.filter((row) => filterFn(row, filters));
  }

  if (search.trim() && searchKeys?.length) {
    const q = search.trim().toLowerCase();
    rows = rows.filter((row) =>
      searchKeys.some((key) => {
        const value = typeof key === 'function' ? key(row) : String(row[key] ?? '');
        return value.toLowerCase().includes(q);
      })
    );
  }

  const sort = sorting[0];
  if (sort) {
    rows = [...rows].sort((a, b) => compareValues(a[sort.id as keyof T], b[sort.id as keyof T], sort.desc));
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
```

---

## Checklist before shipping a new table

- [ ] Uses `useDataTable` — no duplicate search/sort/page state
- [ ] Uses `DataTable` + `DataTablePagination` — no copied chevron buttons
- [ ] `renderMobileRow` provided and tested at 375px width
- [ ] RTL: labels align to start, pagination arrows correct
- [ ] Empty state via `DataTableEmptyState` or `emptyMessage`
- [ ] Domain dialogs remain in feature folder
