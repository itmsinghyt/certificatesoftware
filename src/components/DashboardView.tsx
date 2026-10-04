import React from 'react';
import { Certificate, SchoolProfile, Student } from '../types';
import {
  FileBadge2,
  FileCheck2,
  Users,
  HardDriveDownload,
  Printer,
  Eye,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Palette,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';
import { getAllAcademicYears } from '../utils/academicYear';

interface DashboardViewProps {
  students: Student[];
  certificates: Certificate[];
  school: SchoolProfile;
  lastBackupTime: string | null;
  onNavigate: (tab: 'issue' | 'templates' | 'certificates' | 'students' | 'backup' | 'settings', params?: any) => void;
  onPreviewCertificate: (cert: Certificate) => void;
  onPrintCertificate: (cert: Certificate) => void;
  onExportBackup: () => void;
  selectedYear?: string;
  onYearChange?: (year: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  certificates,
  school,
  lastBackupTime,
  onNavigate,
  onPreviewCertificate,
  onPrintCertificate,
  onExportBackup,
  selectedYear = 'all',
  onYearChange,
}) => {
  const allAcademicYears = getAllAcademicYears(school, students, certificates);
  const activeYear = selectedYear;

  // Filtered metrics based on active year selection
  const displayedCertificates =
    activeYear === 'all'
      ? certificates
      : certificates.filter((c) => c.academicYear === activeYear);

  const displayedStudents =
    activeYear === 'all'
      ? students
      : students.filter((s) => s.academicYear === activeYear);

  const characterCerts = displayedCertificates.filter((c) => c.certType === 'character');
  const transferCerts = displayedCertificates.filter((c) => c.certType === 'transfer');

  const recentCertificates = [...displayedCertificates]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const getStudentForCert = (studentId: string) => {
    return students.find((s) => s.id === studentId);
  };

  // Find max certificates in any year for percentage visual bars
  const maxCertsInAnyYear = Math.max(
    1,
    ...allAcademicYears.map((yr) => certificates.filter((c) => c.academicYear === yr).length)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Hero Welcome & Quick Launch Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/90 text-white p-6 sm:p-7 shadow-sm border border-slate-700/60">
        {/* Ambient lighting accents */}
        <div className="pointer-events-none absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 -bottom-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-xs">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Active Session: {school.currentAcademicSession}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Offline Vault Ready</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Certificate & Records Management Hub
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Issue, verify, and print official Character and Transfer Certificates with QR verification,
              multilingual support, and 20 built-in professional layouts.
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('issue', { type: 'character' })}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950 font-bold" />
              <span>+ Issue Certificate</span>
            </button>

            <button
              onClick={() => onNavigate('templates')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600/70 rounded-xl transition-all cursor-pointer backdrop-blur-xs"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Templates Gallery</span>
            </button>

            <button
              onClick={onExportBackup}
              title="Download instant offline backup (.json)"
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 rounded-xl transition-all cursor-pointer backdrop-blur-xs"
            >
              <HardDriveDownload className="w-4 h-4 text-emerald-400" />
              <span>Backup Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Session Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold pr-1">
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Filter Session:</span>
          </div>

          <button
            type="button"
            onClick={() => onYearChange?.('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeYear === 'all'
                ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 font-bold shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Sessions ({certificates.length})
          </button>

          {allAcademicYears.slice(0, 6).map((year) => {
            const count = certificates.filter((c) => c.academicYear === year).length;
            const isSelected = activeYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => onYearChange?.(year)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {year} <span className="text-[10px] font-medium opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:underline text-xs font-semibold cursor-pointer flex items-center gap-1"
        >
          <span>Manage Sessions →</span>
        </button>
      </div>

      {/* 3. Metric / KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Character Certificates */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-amber-300 dark:hover:border-amber-500/50 hover:shadow-xs transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Character Certificates</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileBadge2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {characterCerts.length}
            </span>
            <button
              onClick={() => onNavigate('certificates')}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View list</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Character & conduct records</span>
          </p>
        </div>

        {/* Transfer Certificates */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-xs transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Transfer Certificates (TC)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-700/50 text-blue-700 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {transferCerts.length}
            </span>
            <button
              onClick={() => onNavigate('certificates')}
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View list</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>School leaving & clearance</span>
          </p>
        </div>

        {/* Enrolled Students */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-xs transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enrolled Students</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {displayedStudents.length}
            </span>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Directory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Registered student database</span>
          </p>
        </div>

        {/* Backup Status */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-xs transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Local Data Security</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% Protected</span>
            </span>
            <button
              onClick={() => onNavigate('backup')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Vault</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 truncate">
            {lastBackupTime
              ? `Last saved: ${new Date(lastBackupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : 'Auto snapshot engine active'}
          </p>
        </div>
      </div>

      {/* 4. Action Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Template Gallery */}
        <div
          onClick={() => onNavigate('templates')}
          className="group p-5 bg-purple-50/40 dark:bg-slate-900 border border-purple-200/70 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/50 rounded-2xl cursor-pointer transition-all shadow-2xs hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold text-purple-900 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-full">
              20 Ready Layouts
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-200/70 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Palette className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 group-hover:text-purple-900 dark:group-hover:text-purple-300">
            Certificate Templates
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            Browse 20 distinctive designs in Portrait and Landscape modes.
          </p>
          <div className="mt-3.5 flex items-center gap-1 text-xs font-semibold text-purple-800 dark:text-purple-400">
            <span>Explore Designs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Issue Character Certificate */}
        <div
          onClick={() => onNavigate('issue', { type: 'character' })}
          className="group p-5 bg-amber-50/40 dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all shadow-2xs hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
              Live Canvas
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-200/70 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileBadge2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 group-hover:text-amber-900 dark:group-hover:text-amber-300">
            Issue Character Cert
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            Generate and print official Character Certificate with live real-time preview.
          </p>
          <div className="mt-3.5 flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-400">
            <span>Generate Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Issue Transfer Certificate */}
        <div
          onClick={() => onNavigate('issue', { type: 'transfer' })}
          className="group p-5 bg-blue-50/40 dark:bg-slate-900 border border-blue-200/70 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-2xl cursor-pointer transition-all shadow-2xs hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold text-blue-900 dark:text-blue-300 bg-blue-100/90 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full">
              School Leaving
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-200/70 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 group-hover:text-blue-900 dark:group-hover:text-blue-300">
            Issue Transfer Cert (TC)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            Official Transfer Certificate with financial clearance and dates.
          </p>
          <div className="mt-3.5 flex items-center gap-1 text-xs font-semibold text-blue-800 dark:text-blue-400">
            <span>Generate TC</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Backup Vault */}
        <div
          onClick={() => onNavigate('backup')}
          className="group p-5 bg-emerald-50/40 dark:bg-slate-900 border border-emerald-200/70 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 rounded-2xl cursor-pointer transition-all shadow-2xs hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              100% Offline
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-200/70 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <HardDriveDownload className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 group-hover:text-emerald-900 dark:group-hover:text-emerald-300">
            Backup & Vault
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            Export all student data and certificate archives into an offline file.
          </p>
          <div className="mt-3.5 flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            <span>Open Vault</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 5. Multi-Year Historical Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Multi-Year Academic Sessions & Records Overview</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparative summary of enrolled students and issued certificates across all academic years
            </p>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:underline cursor-pointer self-start sm:self-center"
          >
            + Add New Session
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="px-4 py-3">Academic Session</th>
                <th className="px-4 py-3">Enrolled Students</th>
                <th className="px-4 py-3">Character Certs (CC)</th>
                <th className="px-4 py-3">Transfer Certs (TC)</th>
                <th className="px-4 py-3">Total Volume</th>
                <th className="px-4 py-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {allAcademicYears.map((year) => {
                const yearStudents = students.filter((s) => s.academicYear === year);
                const yearCerts = certificates.filter((c) => c.academicYear === year);
                const yearCC = yearCerts.filter((c) => c.certType === 'character').length;
                const yearTC = yearCerts.filter((c) => c.certType === 'transfer').length;
                const isCurrent = year === school.currentAcademicSession;
                const percentage = Math.round((yearCerts.length / maxCertsInAnyYear) * 100);

                return (
                  <tr
                    key={year}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                      isCurrent ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{year}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                            Active Session
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {yearStudents.length} Students
                    </td>

                    <td className="px-4 py-3.5 font-mono text-amber-800 dark:text-amber-400 font-semibold">
                      {yearCC} Issued
                    </td>

                    <td className="px-4 py-3.5 font-mono text-blue-800 dark:text-blue-400 font-semibold">
                      {yearTC} Issued
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white min-w-[24px]">
                          {yearCerts.length}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.max(8, percentage)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={() => {
                            onYearChange?.(year);
                            onNavigate('students');
                          }}
                          title={`View ${yearStudents.length} students from ${year}`}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors cursor-pointer"
                        >
                          Students ({yearStudents.length})
                        </button>
                        <button
                          onClick={() => {
                            onYearChange?.(year);
                            onNavigate('certificates');
                          }}
                          title={`View certificates for ${year}`}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Certificates ({yearCerts.length})
                        </button>
                        <button
                          onClick={() => {
                            onYearChange?.(year);
                            onNavigate('issue', { year, type: 'character' });
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                        >
                          + Issue
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Recent Issued Certificates Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recently Issued Certificates
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click preview or print to view high-resolution certificate canvas
            </p>
          </div>

          <button
            onClick={() => onNavigate('certificates')}
            className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:underline cursor-pointer"
          >
            View all ({certificates.length}) →
          </button>
        </div>

        {recentCertificates.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No certificates issued yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
              Start by selecting a student or creating a new certificate from the button below.
            </p>
            <button
              onClick={() => onNavigate('issue', { type: 'character' })}
              className="mt-4 px-4 py-2 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-amber-300 cursor-pointer shadow-xs transition-colors"
            >
              + Issue First Certificate
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="px-4 py-3">Cert No / Dispatch</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Grade / Evaluation</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Print Count</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentCertificates.map((cert) => {
                  const student = getStudentForCert(cert.studentId);
                  const isChar = cert.certType === 'character';

                  return (
                    <tr key={cert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">{cert.certNo}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          Dispatch: {cert.dispatchNo}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isChar
                              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60'
                              : 'bg-blue-100 dark:bg-blue-950/70 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60'
                          }`}
                        >
                          {isChar ? 'Character (CC)' : 'Transfer (TC)'}
                        </span>
                        <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                          {cert.academicYear}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                            {student?.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-sm">
                              {student?.fullName || 'Student'}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                              Reg: {student?.regNo || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">{cert.passedClass}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{cert.divisionOrGpa}</span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                        {cert.issueDateAD}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Printer className="w-3 h-3 text-slate-400" />
                          <span>{cert.printCount} time{cert.printCount === 1 ? '' : 's'}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPreviewCertificate(cert)}
                            title="Preview Certificate"
                            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onPrintCertificate(cert)}
                            title="Print Certificate"
                            className="flex items-center gap-1 px-3 py-1 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                            <span>Print</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
