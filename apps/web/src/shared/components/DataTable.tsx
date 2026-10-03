import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  onRowClick,
  pageSize = 10,
  emptyState,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      return sortDirection === 'asc' ? 1 : -1;
    });
  }, [data, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const allSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.includes(keyExtractor(row)));

  const handleSelectAllOnPage = () => {
    if (!onSelectAll) return;
    if (allSelected) {
      const pageIds = paginatedData.map(keyExtractor);
      onSelectAll(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedData.map(keyExtractor);
      const newIds = Array.from(new Set([...selectedIds, ...pageIds]));
      onSelectAll(newIds);
    }
  };

  return (
    <div className={cn('w-full bg-white dark:bg-[#1C1C1C] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/50">
              {onSelectRow && (
                <th
                  className="py-3.5 px-4 w-10 text-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAllOnPage();
                  }}
                  title={allSelected ? 'Deselect all on this page' : 'Select all on this page'}
                >
                  <input
                    type="checkbox"
                    checked={allSelected}
                    readOnly
                    className="rounded border-stone-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4 pointer-events-none"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 select-none',
                    col.sortable && 'cursor-pointer hover:text-stone-800 dark:hover:text-stone-200',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-stone-400">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectRow ? 1 : 0)} className="py-12 text-center">
                  {emptyState || (
                    <div className="text-stone-400 text-sm">No matching records found</div>
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const id = keyExtractor(row);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={cn(
                      'transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/40 text-sm',
                      isSelected && 'bg-indigo-50/40 dark:bg-indigo-950/20',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    {onSelectRow && (
                      <td
                        className="py-3 px-4 w-10 text-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRow(id);
                        }}
                        title={isSelected ? 'Deselect student' : 'Select student'}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="rounded border-stone-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4 pointer-events-none"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn('py-3.5 px-4 text-stone-700 dark:text-stone-200', col.className)}>
                        {col.render ? col.render(row, index) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/30 dark:bg-stone-900/20 text-xs text-stone-500 dark:text-stone-400">
          <div>
            Showing <span className="font-semibold text-stone-700 dark:text-stone-200">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-stone-700 dark:text-stone-200">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-stone-700 dark:text-stone-200">{sortedData.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              pill
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              pill
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
