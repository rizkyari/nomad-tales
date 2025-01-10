import { unparse } from 'papaparse';

/**
 * Exports data to a CSV file.
 * @param {string} fileName - The name of the CSV file.
 * @param {Array<Object>} data - The data to be exported.
 */
export const exportToCSV = (fileName: string, data: Array<Object>) => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const csv = unparse(data);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
