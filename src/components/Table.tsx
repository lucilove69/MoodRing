import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  render?: (value: any, record: T) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  onRowClick?: (record: T) => void;
  onSelectionChange?: (selectedKeys: string[]) => void;
  rowKey?: keyof T;
}

function Table<T extends { [key: string]: any }>({
  data,
  columns,
  className = '',
  bordered = false,
  striped = false,
  hoverable = true,
  selectable = false,
  onRowClick,
  onSelectionChange,
  rowKey = 'id' as keyof T,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleSort = (column: Column<T>) => {
    if (!column.sorter) return;

    setSortConfig((current) => {
      if (
        current &&
        current.key === column.key &&
        current.direction === 'asc'
      ) {
        return { key: column.key, direction: 'desc' };
      }
      return { key: column.key, direction: 'asc' };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelectedKeys = checked ? data.map((item) => String(item[rowKey])) : [];
    setSelectedKeys(newSelectedKeys);
    onSelectionChange?.(newSelectedKeys);
  };

  const handleSelect = (key: string, checked: boolean) => {
    const newSelectedKeys = checked
      ? [...selectedKeys, key]
      : selectedKeys.filter((k) => k !== key);
    setSelectedKeys(newSelectedKeys);
    onSelectionChange?.(newSelectedKeys);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;

    const column = columns.find((col) => col.key === sortConfig.key);
    if (!column?.sorter) return 0;

    const result = column.sorter(a, b);
    return sortConfig.direction === 'asc' ? result : -result;
  });

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {selectable && (
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedKeys.length === data.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-white/30"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-2 text-left ${
                  column.align ? `text-${column.align}` : ''
                }`}
                style={{ width: column.width }}
              >
                <div
                  className={`flex items-center ${
                    column.sorter ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => handleSort(column)}
                >
                  {column.title}
                  {column.sorter && (
                    <span className="ml-1">
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((record, index) => (
            <tr
              key={String(record[rowKey])}
              className={`${
                bordered ? 'border-b border-white/10' : ''
              } ${
                striped && index % 2 === 1 ? 'bg-white/5' : ''
              } ${
                hoverable ? 'hover:bg-white/10' : ''
              } ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick?.(record)}
            >
              {selectable && (
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(String(record[rowKey]))}
                    onChange={(e) =>
                      handleSelect(String(record[rowKey]), e.target.checked)
                    }
                    className="rounded border-white/30"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-2 ${
                    column.align ? `text-${column.align}` : ''
                  }`}
                >
                  {column.render
                    ? column.render(record[column.dataIndex], record)
                    : record[column.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table; 