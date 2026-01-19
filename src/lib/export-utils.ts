import type { TaskTableData } from '@/types/data-table';

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: 'iso' | 'readable';
}

export function exportToCSV(
  data: TaskTableData[],
  options: ExportOptions = {}
): void {
  const {
    filename = 'tasks.csv',
    includeHeaders = true,
    dateFormat = 'readable',
  } = options;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return dateFormat === 'iso'
      ? date.toISOString()
      : date.toLocaleDateString();
  };

  const headers = [
    'ID',
    'Title',
    'Description',
    'Status',
    'Priority',
    'Assignee',
    'Due Date',
    'Task Types',
    'Order',
    'Created At',
    'Updated At',
  ];

  const csvContent = [
    // Headers
    ...(includeHeaders ? [headers.join(',')] : []),
    // Data rows
    ...data.map(row =>
      [
        row.id,
        `"${(row.title || '').replace(/"/g, '""')}"`,
        `"${(row.description || '').replace(/"/g, '""')}"`,
        `"${row.status?.name || ''}"`,
        `"${row.priority || ''}"`,
        `"${row.assignee || ''}"`,
        `"${formatDate(row.dueDate || '')}"`,
        `"${(row.taskTypes || []).map(t => t.name).join('; ')}"`,
        row.order,
        `"${formatDate(row.createdAt)}"`,
        `"${formatDate(row.updatedAt)}"`,
      ].join(',')
    ),
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

export function exportToJSON(
  data: TaskTableData[],
  options: ExportOptions = {}
): void {
  const { filename = 'tasks.json', dateFormat = 'iso' } = options;

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return dateFormat === 'iso'
      ? date.toISOString()
      : date.toLocaleDateString();
  };

  const jsonData = data.map(row => ({
    ...row,
    dueDate: formatDate(row.dueDate || ''),
    createdAt: formatDate(row.createdAt),
    updatedAt: formatDate(row.updatedAt),
  }));

  const jsonContent = JSON.stringify(jsonData, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function getExportFilename(
  prefix: string = 'tasks',
  format: 'csv' | 'json'
): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_${timestamp}.${format}`;
}
