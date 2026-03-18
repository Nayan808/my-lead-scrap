import React from 'react';
import { Business } from '../types';
import { Download } from 'lucide-react';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ExportButtonProps {
  businesses: Business[];
  filename?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  businesses, 
  filename = 'gmb-audit-results' 
}) => {
  const exportToCSV = () => {
    const csvData = businesses.map(business => ({
      'Business Name': business.name,
      'Address': business.address,
      'Phone': business.phone || 'N/A',
      'Clean Phone': business.cleanPhone || 'N/A',
      'Website': business.website || 'N/A',
      'Email': business.email || 'N/A',
      'Category': business.category,
      'Rating': business.rating,
      'Review Count': business.reviewCount,
      'Has Website': business.hasWebsite ? 'Yes' : 'No',
      'Has Email': business.hasEmail ? 'Yes' : 'No',
      'Has Phone': business.hasPhone ? 'Yes' : 'No',
      'Claimed Status': business.claimedStatus || 'Unknown'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const excelData = businesses.map(business => ({
      'Business Name': business.name,
      'Address': business.address,
      'Phone': business.phone || 'N/A',
      'Clean Phone': business.cleanPhone || 'N/A',
      'Website': business.website || 'N/A',
      'Email': business.email || 'N/A',
      'Category': business.category,
      'Rating': business.rating,
      'Review Count': business.reviewCount,
      'Has Website': business.hasWebsite ? 'Yes' : 'No',
      'Has Email': business.hasEmail ? 'Yes' : 'No',
      'Has Phone': business.hasPhone ? 'Yes' : 'No',
      'Claimed Status': business.claimedStatus || 'Unknown'
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'GMB Audit Results');
    
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={exportToCSV}
        disabled={businesses.length === 0}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        <Download className="w-4 h-4 mr-2" />
        Export to CSV
      </button>
      <button
        onClick={exportToExcel}
        disabled={businesses.length === 0}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        <Download className="w-4 h-4 mr-2" />
        Export to Excel
      </button>
    </div>
  );
};
