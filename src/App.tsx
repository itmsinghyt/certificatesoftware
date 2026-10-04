/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PanelLeftOpen } from 'lucide-react';
import {
  AutoBackupSnapshot,
  BackupData,
  Certificate,
  CertificateOrientation,
  CertificateTemplateConfig,
  CertificateType,
  SchoolProfile,
  Student
} from './types';
import {
  loadSchoolProfile,
  saveSchoolProfile,
  loadStudents,
  saveStudents,
  loadCertificates,
  saveCertificates,
  loadCustomTemplates,
  addCustomTemplate,
  deleteCustomTemplate,
  loadAutoSnapshots,
  saveAutoSnapshot,
  getLastBackupTime,
  setLastBackupTime,
  exportDatabaseBackup,
  resetDatabaseToDefault
} from './utils/storage';

import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { IssueCertificateView } from './components/IssueCertificateView';
import { TemplateGalleryView } from './components/TemplateGalleryView';
import { CertificateRecordsView } from './components/CertificateRecordsView';
import { StudentDirectoryView } from './components/StudentDirectoryView';
import { BackupRestoreView } from './components/BackupRestoreView';
import { SchoolSettingsView } from './components/SchoolSettingsView';
import { PrintModal } from './components/PrintModal';
import { BatchPrintModal } from './components/BatchPrintModal';
import { UploadTemplateModal } from './components/UploadTemplateModal';
import { getAllAcademicYears } from './utils/academicYear';
import { useTheme } from './utils/theme';

export default function App() {
  const { theme, setTheme } = useTheme();

  // Core Local State (synced with localStorage)
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(loadSchoolProfile);
  const [students, setStudents] = useState<Student[]>(loadStudents);
  const [certificates, setCertificates] = useState<Certificate[]>(loadCertificates);
  const [customTemplates, setCustomTemplates] = useState<CertificateTemplateConfig[]>(loadCustomTemplates);
  const [snapshots, setSnapshots] = useState<AutoBackupSnapshot[]>(loadAutoSnapshots);
  const [lastBackupTime, setLastBackupTimeState] = useState<string | null>(getLastBackupTime);

  // Upload Template Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Navigation and UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Global Multi-Year Session Filter State ('all' or specific session e.g. '2081 B.S.')
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Issue View parameters
  const [issueParams, setIssueParams] = useState<{
    type?: CertificateType;
    studentId?: string;
    templateId?: string;
    orientation?: CertificateOrientation;
    academicYear?: string;
  }>({});

  // Single Certificate Print Modal State
  const [activePrintCert, setActivePrintCert] = useState<Certificate | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Batch Print Modal State (Selected Certificates Only!)
  const [batchPrintCertificates, setBatchPrintCertificates] = useState<Certificate[]>([]);
  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState<boolean>(false);

  // Responsive sidebar open/close state (Default: open on laptop/computer >= 1024px, closed on mobile/tablet)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Main scrollable content container reference
  const mainContentRef = useRef<HTMLElement>(null);

  // Global keyboard shortcut to toggle sidebar (Ctrl+B or Cmd+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smoothly scroll content area to top whenever active view/tab changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab]);

  // Sync state changes with localStorage
  useEffect(() => {
    saveSchoolProfile(schoolProfile);
  }, [schoolProfile]);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveCertificates(certificates);
  }, [certificates]);

  // Handler: Save newly issued certificate
  const handleSaveCertificate = (newCert: Certificate, student: Student, printImmediately: boolean) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      return exists ? prev.map((s) => (s.id === student.id ? student : s)) : [student, ...prev];
    });

    setCertificates((prev) => [newCert, ...prev]);

    saveAutoSnapshot(
      `Issued Certificate: ${newCert.certNo} (${student.fullName})`,
      [student, ...students.filter((s) => s.id !== student.id)],
      [newCert, ...certificates],
      schoolProfile
    );
    setSnapshots(loadAutoSnapshots());

    if (printImmediately) {
      setActivePrintCert(newCert);
      setIsPrintModalOpen(true);
    } else {
      setActiveTab('certificates');
    }
  };

  // Handler: Add Student
  const handleAddStudent = (newStudent: Student) => {
    const updated = [newStudent, ...students];
    setStudents(updated);
    saveAutoSnapshot(`Added Student: ${newStudent.fullName}`, updated, certificates, schoolProfile);
    setSnapshots(loadAutoSnapshots());
  };

  // Handler: Update Student
  const handleUpdateStudent = (updatedStudent: Student) => {
    const updated = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    setStudents(updated);
    saveAutoSnapshot(`Updated Student: ${updatedStudent.fullName}`, updated, certificates, schoolProfile);
    setSnapshots(loadAutoSnapshots());
  };

  // Handler: Batch Change Academic Session for Students
  const handleBatchChangeStudentYear = (studentIds: string[], newYear: string) => {
    const updated = students.map((s) =>
      studentIds.includes(s.id)
        ? { ...s, academicYear: newYear, updatedAt: new Date().toISOString() }
        : s
    );
    setStudents(updated);
    saveAutoSnapshot(
      `Updated Session to ${newYear} for ${studentIds.length} students`,
      updated,
      certificates,
      schoolProfile
    );
    setSnapshots(loadAutoSnapshots());
  };

  // Handler: Delete Student
  const handleDeleteStudent = (studentId: string) => {
    const updated = students.filter((s) => s.id !== studentId);
    setStudents(updated);
    saveAutoSnapshot(`Deleted Student Record`, updated, certificates, schoolProfile);
    setSnapshots(loadAutoSnapshots());
  };

  // Handler: Delete Certificate
  const handleDeleteCertificate = (certId: string) => {
    const updated = certificates.filter((c) => c.id !== certId);
    setCertificates(updated);
    saveAutoSnapshot(`Deleted Certificate: ${certId}`, students, updated, schoolProfile);
    setSnapshots(loadAutoSnapshots());
  };

  // Handler: Preview Certificate in Print Modal
  const handlePreviewCertificate = (cert: Certificate) => {
    setActivePrintCert(cert);
    setIsPrintModalOpen(true);
  };

  // Handler: Direct Print Single Certificate
  const handlePrintCertificate = (cert: Certificate) => {
    setActivePrintCert(cert);
    setIsPrintModalOpen(true);
  };

  // Handler: Trigger Batch Print for Selected Certificates
  const handlePrintBatch = (selectedCerts: Certificate[]) => {
    setBatchPrintCertificates(selectedCerts);
    setIsBatchPrintModalOpen(true);
  };

  // Handler: Track Certificate Printed Count
  const handleCertificatePrinted = (certId: string) => {
    setCertificates((prev) =>
      prev.map((c) => {
        if (c.id === certId) {
          return {
            ...c,
            printCount: (c.printCount || 0) + 1,
            lastPrintedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  // Handler: Track Batch Certificates Printed Count
  const handleBatchPrinted = (certIds: string[]) => {
    setCertificates((prev) =>
      prev.map((c) => {
        if (certIds.includes(c.id)) {
          return {
            ...c,
            printCount: (c.printCount || 0) + 1,
            lastPrintedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  // Handler: Direct Certificate Issue for a specific Student
  const handleIssueForStudent = (studentId: string, certType: CertificateType) => {
    setIssueParams({ type: certType, studentId });
    setActiveTab('issue');
  };

  // Handler: Batch Issue for multiple selected students
  const handleIssueBatchForStudents = (studentIds: string[], certType: CertificateType) => {
    const year = new Date().getFullYear();
    const createdCerts: Certificate[] = [];

    studentIds.forEach((stdId, idx) => {
      const std = students.find((s) => s.id === stdId);
      if (!std) return;

      const prefix = certType === 'character' ? 'CC' : 'TC';
      const count = certificates.length + idx + 1;
      const certNo = `${prefix}-${year}-${String(count).padStart(4, '0')}`;
      const dispatchNo = `${count + 140}/${year}`;

      const newCert: Certificate = {
        id: 'cert-' + Date.now() + '-' + idx,
        certNo,
        dispatchNo,
        studentId: std.id,
        certType,
        issueDateAD: new Date().toISOString().split('T')[0],
        issueDateBS: '2081/06/19 B.S.',
        academicYear: std.academicYear || '2023-2024',
        templateId: schoolProfile.defaultTemplateId || 'tpl-classic-gold',
        orientation: schoolProfile.defaultOrientation || 'portrait',
        characterRating: std.characterRating || 'Exemplary',
        divisionOrGpa: std.divisionOrGpa || 'GPA 3.80 (A+)',
        passedClass: std.passedClass || 'Grade 10 (SEE)',
        duesCleared: std.duesCleared || 'Yes',
        preparedBy: schoolProfile.preparedByName,
        verifiedBy: schoolProfile.accountantName,
        headmaster: schoolProfile.principalName,
        headmasterDesignation: schoolProfile.principalDesignation,
        createdAt: new Date().toISOString(),
        printCount: 0,
      };

      createdCerts.push(newCert);
    });

    const updatedCerts = [...createdCerts, ...certificates];
    setCertificates(updatedCerts);
    saveAutoSnapshot(
      `Batch Generated ${createdCerts.length} ${certType === 'character' ? 'Character' : 'Transfer'} Certificates`,
      students,
      updatedCerts,
      schoolProfile
    );
    setSnapshots(loadAutoSnapshots());

    // Automatically open batch print modal with the newly created certificates!
    setBatchPrintCertificates(createdCerts);
    setIsBatchPrintModalOpen(true);
  };

  // Handler: Select Template from Gallery
  const handleSelectTemplateFromGallery = (templateId: string, orientation: CertificateOrientation) => {
    setIssueParams({
      templateId,
      orientation,
      type: 'character',
    });
    setActiveTab('issue');
  };

  // Handler: Save New Custom Uploaded Template
  const handleSaveCustomTemplate = (newTemplate: CertificateTemplateConfig) => {
    const updated = addCustomTemplate(newTemplate);
    setCustomTemplates(updated);
    setIssueParams({
      templateId: newTemplate.id,
      orientation: 'portrait',
      type: 'character',
    });
    setActiveTab('issue');
  };

  // Handler: Delete Custom Uploaded Template
  const handleDeleteCustomTemplate = (templateId: string) => {
    const updated = deleteCustomTemplate(templateId);
    setCustomTemplates(updated);
  };

  // Handler: Restore Data from Backup File or Snapshot
  const handleRestoreData = (backup: BackupData) => {
    saveAutoSnapshot('Pre-Restore Snapshot', students, certificates, schoolProfile, customTemplates);

    if (backup.schoolProfile) setSchoolProfile(backup.schoolProfile);
    if (backup.students) setStudents(backup.students);
    if (backup.certificates) setCertificates(backup.certificates);
    if (backup.customTemplates) {
      setCustomTemplates(backup.customTemplates);
      localStorage.setItem('cc_tc_custom_templates_v2', JSON.stringify(backup.customTemplates));
    }

    setLastBackupTime();
    setLastBackupTimeState(new Date().toISOString());
    setSnapshots(loadAutoSnapshots());
  };

  // Handler: Reset to Sample Demo Data
  const handleResetToDefault = () => {
    const defaults = resetDatabaseToDefault();
    setSchoolProfile(defaults.profile);
    setStudents(defaults.students);
    setCertificates(defaults.certificates);
    setSnapshots([]);
  };

  // Handler: Export Backup JSON File
  const handleExportBackup = () => {
    exportDatabaseBackup(students, certificates, schoolProfile, customTemplates);
    setLastBackupTimeState(new Date().toISOString());
    setSnapshots(loadAutoSnapshots());
  };

  // Active student for single print modal
  const activeStudentForPrint = activePrintCert
    ? students.find((s) => s.id === activePrintCert.studentId) || {
        id: 'unknown',
        regNo: 'N/A',
        symbolNo: 'N/A',
        fullName: 'Student Name',
        gender: 'Male' as const,
        dateOfBirthAD: '2006-01-01',
        fatherName: 'Father Name',
        motherName: 'Mother Name',
        address: 'Kathmandu, Nepal',
        phone: '',
        academicYear: '2024',
        passedClass: 'Grade 10',
        divisionOrGpa: 'A',
        characterRating: 'Exemplary' as const,
        duesCleared: 'Yes' as const,
        createdAt: '',
        updatedAt: '',
      }
    : null;

  const availableAcademicYears = getAllAcademicYears(schoolProfile, students, certificates);

  return (
    <div className="h-screen h-[100dvh] max-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col antialiased text-slate-800 dark:text-slate-200 overflow-hidden transition-colors">
      
      {/* 1. Admin Panel Top Heading */}
      <Header
        school={schoolProfile}
        searchQuery={globalSearch}
        onSearchChange={(q) => {
          setGlobalSearch(q);
          if (q.trim() && activeTab !== 'certificates' && activeTab !== 'students') {
            setActiveTab('certificates');
          }
        }}
        onNewCertificateClick={() => {
          setIssueParams({
            type: 'character',
            academicYear: selectedYear !== 'all' ? selectedYear : schoolProfile.currentAcademicSession
          });
          setActiveTab('issue');
        }}
        onBackupClick={handleExportBackup}
        lastBackupTime={lastBackupTime}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        availableYears={availableAcademicYears}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Body: Sidebar + Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        
        {/* 2. Admin Panel Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'issue') {
              setIssueParams({
                type: 'character',
                academicYear: selectedYear !== 'all' ? selectedYear : schoolProfile.currentAcademicSession
              });
            }
          }}
          studentCount={students.length}
          certificateCount={certificates.length}
          lastBackupTime={lastBackupTime}
          school={schoolProfile}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          availableYears={availableAcademicYears}
          students={students}
          certificates={certificates}
        />

        {/* Quick Unhide / Expand floating trigger for Laptop & Desktop Computer */}
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            title="Open Sidebar (Ctrl+B)"
            aria-label="Open Sidebar navigation"
            className="hidden lg:flex fixed left-0 top-16 z-30 items-center gap-1.5 py-1.5 px-2 bg-slate-900 text-amber-400 hover:text-white hover:bg-slate-800 rounded-r-lg border border-l-0 border-slate-700 shadow-md transition-all cursor-pointer group"
          >
            <PanelLeftOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold pr-1">Sidebar</span>
          </button>
        )}

        {/* 3. Content Area - Independently scrollable across all modes: Mobile, Tablet, Laptop, Computer */}
        <main
          ref={mainContentRef}
          className="flex-1 min-w-0 min-h-0 overflow-y-auto overscroll-contain touch-scroll p-3 sm:p-4 md:p-6 lg:p-8 no-print bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors"
        >
          <div className="max-w-7xl mx-auto pb-16 sm:pb-12">
            
            {activeTab === 'dashboard' && (
              <DashboardView
                students={students}
                certificates={certificates}
                school={schoolProfile}
                lastBackupTime={lastBackupTime}
                onNavigate={(tab, params) => {
                  if (params) {
                    if (params.year) setSelectedYear(params.year);
                    setIssueParams(params);
                  }
                  setActiveTab(tab);
                }}
                onPreviewCertificate={handlePreviewCertificate}
                onPrintCertificate={handlePrintCertificate}
                onExportBackup={handleExportBackup}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            )}

            {activeTab === 'templates' && (
              <TemplateGalleryView
                school={schoolProfile}
                students={students}
                customTemplates={customTemplates}
                onSelectTemplate={handleSelectTemplateFromGallery}
                onPreviewTemplate={handlePreviewCertificate}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
                onDeleteCustomTemplate={handleDeleteCustomTemplate}
              />
            )}

            {activeTab === 'issue' && (
              <IssueCertificateView
                students={students}
                certificates={certificates}
                school={schoolProfile}
                customTemplates={customTemplates}
                initialType={issueParams.type || 'character'}
                initialStudentId={issueParams.studentId}
                initialTemplateId={issueParams.templateId}
                initialOrientation={issueParams.orientation}
                initialAcademicYear={issueParams.academicYear || (selectedYear !== 'all' ? selectedYear : schoolProfile.currentAcademicSession)}
                onSaveCertificate={handleSaveCertificate}
                onBack={() => setActiveTab('dashboard')}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
              />
            )}

            {activeTab === 'certificates' && (
              <CertificateRecordsView
                certificates={certificates}
                students={students}
                school={schoolProfile}
                onPreview={handlePreviewCertificate}
                onPrint={handlePrintCertificate}
                onPrintBatch={handlePrintBatch}
                onDelete={handleDeleteCertificate}
                onNewCertificate={() => {
                  setIssueParams({
                    type: 'character',
                    academicYear: selectedYear !== 'all' ? selectedYear : schoolProfile.currentAcademicSession
                  });
                  setActiveTab('issue');
                }}
                initialYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            )}

            {activeTab === 'students' && (
              <StudentDirectoryView
                students={students}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onIssueForStudent={handleIssueForStudent}
                onIssueBatchForStudents={handleIssueBatchForStudents}
                onBatchChangeYear={handleBatchChangeStudentYear}
                school={schoolProfile}
                initialYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            )}

            {activeTab === 'backup' && (
              <BackupRestoreView
                students={students}
                certificates={certificates}
                school={schoolProfile}
                lastBackupTime={lastBackupTime}
                snapshots={snapshots}
                onRestoreData={handleRestoreData}
                onResetToDefault={handleResetToDefault}
              />
            )}

            {activeTab === 'settings' && (
              <SchoolSettingsView
                school={schoolProfile}
                students={students}
                certificates={certificates}
                onSaveProfile={(updated) => setSchoolProfile(updated)}
                theme={theme}
                onThemeChange={setTheme}
              />
            )}

          </div>
        </main>

      </div>

      {/* 4. Single Certificate Print & Preview Modal */}
      {isPrintModalOpen && activePrintCert && activeStudentForPrint && (
        <PrintModal
          certificate={activePrintCert}
          student={activeStudentForPrint}
          school={schoolProfile}
          customTemplates={customTemplates}
          isOpen={isPrintModalOpen}
          onClose={() => {
            setIsPrintModalOpen(false);
            setActivePrintCert(null);
          }}
          onPrinted={handleCertificatePrinted}
        />
      )}

      {/* 5. Batch Print Modal (Prints ONLY selected certificates!) */}
      {isBatchPrintModalOpen && batchPrintCertificates.length > 0 && (
        <BatchPrintModal
          selectedCertificates={batchPrintCertificates}
          students={students}
          school={schoolProfile}
          customTemplates={customTemplates}
          isOpen={isBatchPrintModalOpen}
          onClose={() => {
            setIsBatchPrintModalOpen(false);
            setBatchPrintCertificates([]);
          }}
          onPrinted={handleBatchPrinted}
        />
      )}

      {/* 6. Upload Custom Template Studio Modal */}
      {isUploadModalOpen && (
        <UploadTemplateModal
          isOpen={isUploadModalOpen}
          school={schoolProfile}
          sampleStudent={students[0]}
          onClose={() => setIsUploadModalOpen(false)}
          onSaveTemplate={handleSaveCustomTemplate}
        />
      )}

    </div>
  );
}
