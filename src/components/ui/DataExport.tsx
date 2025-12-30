'use client';

import { useState } from 'react';
import { exportUserData, importUserData, isStorageAvailable } from '@/src/utils/storageHelpers';
import { useAuth } from '@/src/hooks/useAuth';

interface DataExportProps {
  onClose?: () => void;
}

export default function DataExport({ onClose }: DataExportProps) {
  const { userId } = useAuth();
  const [exportData, setExportData] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const data = exportUserData(userId || undefined);
      if (data) {
        setExportData(data);
        setImportStatus(null);
      } else {
        setImportStatus({ success: false, message: 'No data to export' });
      }
    } catch (error) {
      setImportStatus({ success: false, message: 'Export failed. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!exportData) return;
    
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-refresh-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const result = importUserData(content, userId || undefined);
        
        if (result.success) {
          setImportStatus({ success: true, message: 'Data imported successfully! Please refresh the page.' });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setImportStatus({ success: false, message: result.error || 'Import failed' });
        }
      } catch (error) {
        setImportStatus({ success: false, message: 'Invalid file format' });
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      setImportStatus({ success: false, message: 'Failed to read file' });
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };

  if (!isStorageAvailable()) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
        <p className="text-yellow-800 font-semibold">⚠️ Storage Not Available</p>
        <p className="text-sm text-yellow-700 mt-1">
          Your browser is blocking local storage. Please enable cookies/storage in your browser settings.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200 space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">💾 Data Backup & Restore</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Your data is stored locally on this device. Export your data regularly to prevent loss if you clear browser data or switch devices.
        </p>
      </div>

      {/* Export Section */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">📤 Export Your Data</h4>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </button>
          
          {exportData && (
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              📥 Download JSON
            </button>
          )}
        </div>
        
        {exportData && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Copy this data to save it:</p>
            <textarea
              readOnly
              value={exportData}
              className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg text-xs font-mono bg-gray-50 text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
          </div>
        )}
      </div>

      {/* Import Section */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-700">📥 Import Your Data</h4>
        <div className="flex items-center gap-3">
          <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500">
            {isImporting ? 'Importing...' : 'Choose File'}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
            />
          </label>
          <span className="text-sm text-gray-600">Select exported JSON file</span>
        </div>
      </div>

      {/* Status Messages */}
      {importStatus && (
        <div className={`p-3 rounded-lg ${
          importStatus.success 
            ? 'bg-green-50 border border-green-300 text-green-800' 
            : 'bg-red-50 border border-red-300 text-red-800'
        }`}>
          <p className="text-sm font-semibold">
            {importStatus.success ? '✅' : '❌'} {importStatus.message}
          </p>
        </div>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Close
        </button>
      )}
    </div>
  );
}

