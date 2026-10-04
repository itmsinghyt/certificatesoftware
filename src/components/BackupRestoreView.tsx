import React, { useState, useRef } from 'react';
import { AutoBackupSnapshot, BackupData, Certificate, SchoolProfile, Student } from '../types';
import {
  Download,
  Upload,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Database,
  History,
  Info
} from 'lucide-react';
import { exportDatabaseBackup, exportStudentsCSV, parseAndValidateBackupJSON } from '../utils/storage';

interface BackupRestoreViewProps {
  students: Student[];
  certificates: Certificate[];
  school: SchoolProfile;
  lastBackupTime: string | null;
  snapshots: AutoBackupSnapshot[];
  onRestoreData: (backup: BackupData) => void;
  onResetToDefault: () => void;
}

export const BackupRestoreView: React.FC<BackupRestoreViewProps> = ({
  students,
  certificates,
  school,
  lastBackupTime,
  snapshots,
  onRestoreData,
  onResetToDefault,
}) => {
  const [importedBackup, setImportedBackup] = useState<BackupData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger JSON Export
  const handleExport = () => {
    exportDatabaseBackup(students, certificates, school);
    setSuccessMessage('Backup file (.json) downloaded successfully. Keep this safe on your computer or USB drive.');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setSuccessMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = parseAndValidateBackupJSON(content);
      if (result.success && result.data) {
        setImportedBackup(result.data);
      } else {
        setImportError(result.error || 'Invalid backup file');
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read the selected file.');
    };
    reader.readAsText(file);
  };

  // Confirm restore
  const handleConfirmRestore = () => {
    if (!importedBackup) return;
    setIsProcessing(true);
    try {
      onRestoreData(importedBackup);
      setSuccessMessage('Data successfully restored from backup file!');
      setImportedBackup(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setImportError('Failed to restore data: ' + err.message);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(null), 6000);
    }
  };

  // Restore from an auto-snapshot
  const handleRestoreSnapshot = (snapshot: AutoBackupSnapshot) => {
    if (confirm(`Do you want to restore the system to snapshot from ${new Date(snapshot.timestamp).toLocaleString()}?`)) {
      onRestoreData(snapshot.data);
      setSuccessMessage('Successfully rolled back to previous snapshot!');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Local Data Safety Vault</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Data Backup & Disaster Recovery
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Safeguard your institution's certificates and student records with offline JSON backups and automated snapshots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Success / Alert Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {importError && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{importError}</span>
        </div>
      )}

      {/* Main Grid: Backup Export + Backup Import */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: Export Complete Backup */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                1. Create Full Backup File
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Recommended
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Packages institution profiles, {students.length} student records, and {certificates.length} issued certificates into an encrypted checksummed JSON archive.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Total Student Records:</span>
                <span className="font-mono font-bold">{students.length}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Total Issued Certificates:</span>
                <span className="font-mono font-bold">{certificates.length}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Last Export Date:</span>
                <span className="font-mono text-slate-500">
                  {lastBackupTime ? new Date(lastBackupTime).toLocaleString() : 'No recent export'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Save Backup (.JSON) to Computer</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-1.5">
              * Store this file on a secure drive or cloud backup for long-term archival.
            </p>
          </div>
        </div>

        {/* CARD 2: Restore from Backup File */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                2. Restore from Backup File
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Upload a previously exported .json file to restore all student data and certificate archives seamlessly.
            </p>

            {/* File input container */}
            <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 text-center bg-slate-50/50 transition-all">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="backup-file-upload"
              />
              <label
                htmlFor="backup-file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-1"
              >
                <Database className="w-8 h-8 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">
                  Select Backup File (.json)
                </span>
                <span className="text-[10px] text-slate-500">
                  Click to browse and validate file
                </span>
              </label>
            </div>

            {/* Preview of selected backup file */}
            {importedBackup && (
              <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-blue-950">
                  <span>Valid Backup Archive Detected:</span>
                  <span className="font-mono text-[11px] text-blue-700">
                    {importedBackup.metadata?.exportedAt ? new Date(importedBackup.metadata.exportedAt).toLocaleDateString() : 'Verified'}
                  </span>
                </div>
                <div className="text-slate-700 flex justify-between">
                  <span>Institution:</span>
                  <span className="font-semibold">{importedBackup.schoolProfile?.name || 'N/A'}</span>
                </div>
                <div className="text-slate-700 flex justify-between">
                  <span>Enrolled Students:</span>
                  <span className="font-mono font-bold">{importedBackup.students?.length || 0}</span>
                </div>
                <div className="text-slate-700 flex justify-between">
                  <span>Issued Certificates:</span>
                  <span className="font-mono font-bold">{importedBackup.certificates?.length || 0}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={handleConfirmRestore}
              disabled={!importedBackup || isProcessing}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg shadow-xs transition-colors ${
                importedBackup && !isProcessing
                  ? 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isProcessing ? 'Restoring records...' : 'Restore System Now'}</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-1.5">
              * A safety snapshot of your current state is created before restoration.
            </p>
          </div>
        </div>

      </div>

      {/* Snapshot History Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Automated Local Snapshots
              </h3>
              <p className="text-xs text-slate-500">
                Roll back to any recent historical point if an accidental edit or deletion occurs
              </p>
            </div>
          </div>
        </div>

        {snapshots.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No snapshots recorded yet. Adding certificates or students will automatically populate rollback points.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {snapshots.map((snap) => (
              <div key={snap.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/80 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{snap.reason}</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      ({new Date(snap.timestamp).toLocaleString()})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-5">
                    Students: {snap.studentCount} · Certificates: {snap.certificateCount}
                  </div>
                </div>

                <button
                  onClick={() => handleRestoreSnapshot(snap)}
                  className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  Rollback to This
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSV Spreadsheet Export & Danger Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CSV Export */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Export Students to Excel (CSV)
            </h4>
            <p className="text-[11px] text-slate-500">
              Download student records in standard spreadsheet format
            </p>
          </div>
          <button
            onClick={() => exportStudentsCSV(students)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Reset / Sample Data */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Reset / Reload Sample Data
            </h4>
            <p className="text-[11px] text-slate-500">
              Reload sample demo students and certificates for testing
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Do you want to reload sample demonstration data? Existing changes will be replaced.')) {
                onResetToDefault();
                setSuccessMessage('Sample demonstration data successfully loaded!');
                setTimeout(() => setSuccessMessage(null), 4000);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample Data</span>
          </button>
        </div>

      </div>

      {/* Security Guidance Note */}
      <div className="p-4 bg-slate-900 text-slate-300 rounded-xl text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <Info className="w-4 h-4" />
          <span>Local Storage & Privacy Guarantee:</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          1. This software runs 100% locally in your browser sandbox. Student confidential credentials never leak to any public cloud server.<br />
          2. It is strongly recommended to download a <strong className="text-white">Full Backup (.JSON)</strong> periodically and keep it on an external flash drive.<br />
          3. Even if your browser cache is cleared, restoring your downloaded backup file will instantly bring back every student and certificate record.
        </p>
      </div>

    </div>
  );
};
