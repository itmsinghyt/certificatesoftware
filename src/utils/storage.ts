import { SchoolProfile, Student, Certificate, BackupData, AutoBackupSnapshot, CertificateTemplateConfig } from '../types';
import { initialSchoolProfile, initialStudents, initialCertificates } from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'cc_tc_school_profile_en_v2',
  STUDENTS: 'cc_tc_students_en_v2',
  CERTIFICATES: 'cc_tc_certificates_en_v2',
  CUSTOM_TEMPLATES: 'cc_tc_custom_templates_v2',
  SNAPSHOTS: 'cc_tc_auto_snapshots_en_v2',
  LAST_BACKUP: 'cc_tc_last_backup_time_en_v2',
};

// Generate simple hash/checksum for validation
function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

// Local Storage Handlers
export function loadSchoolProfile(): SchoolProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (stored) {
      return { ...initialSchoolProfile, ...JSON.parse(stored) };
    }
  } catch (err) {
    console.error('Failed to load school profile from localStorage:', err);
  }
  return initialSchoolProfile;
}

export function saveSchoolProfile(profile: SchoolProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save school profile:', err);
  }
}

export function loadStudents(): Student[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load students:', err);
  }
  return initialStudents;
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save students:', err);
  }
}

export function loadCertificates(): Certificate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load certificates:', err);
  }
  return initialCertificates;
}

export function saveCertificates(certificates: Certificate[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
  } catch (err) {
    console.error('Failed to save certificates:', err);
  }
}

export function loadCustomTemplates(): CertificateTemplateConfig[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load custom templates:', err);
  }
  return [];
}

export function saveCustomTemplates(templates: CertificateTemplateConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error('Failed to save custom templates:', err);
  }
}

export function addCustomTemplate(newTemplate: CertificateTemplateConfig): CertificateTemplateConfig[] {
  const existing = loadCustomTemplates();
  const updated = [newTemplate, ...existing.filter((t) => t.id !== newTemplate.id)];
  saveCustomTemplates(updated);
  return updated;
}

export function deleteCustomTemplate(templateId: string): CertificateTemplateConfig[] {
  const existing = loadCustomTemplates();
  const updated = existing.filter((t) => t.id !== templateId);
  saveCustomTemplates(updated);
  return updated;
}

export function loadAutoSnapshots(): AutoBackupSnapshot[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load snapshots:', err);
  }
  return [];
}

export function saveAutoSnapshot(
  reason: string,
  students: Student[],
  certificates: Certificate[],
  profile: SchoolProfile,
  customTemplates: CertificateTemplateConfig[] = []
): void {
  try {
    const existing = loadAutoSnapshots();
    const backupData: BackupData = {
      metadata: {
        appVersion: '2.0.0',
        appName: 'Certificate-Manager-Enterprise',
        exportedAt: new Date().toISOString(),
        studentCount: students.length,
        certificateCount: certificates.length,
        checksum: generateChecksum(JSON.stringify(students) + JSON.stringify(certificates)),
      },
      schoolProfile: profile,
      students,
      certificates,
      customTemplates,
    };

    const newSnapshot: AutoBackupSnapshot = {
      id: 'snap-' + Date.now(),
      timestamp: new Date().toISOString(),
      reason,
      studentCount: students.length,
      certificateCount: certificates.length,
      data: backupData,
    };

    // Keep last 8 snapshots to avoid storage overflow
    const updated = [newSnapshot, ...existing.slice(0, 7)];
    localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save auto snapshot:', err);
  }
}

export function getLastBackupTime(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_BACKUP);
}

export function setLastBackupTime(): void {
  localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, new Date().toISOString());
}

// FULL BACKUP EXPORT (JSON File Download)
export function exportDatabaseBackup(
  students: Student[],
  certificates: Certificate[],
  profile: SchoolProfile,
  customTemplates: CertificateTemplateConfig[] = []
): void {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  
  const payload: BackupData = {
    metadata: {
      appVersion: '2.0.0',
      appName: 'Certificate-Manager-Enterprise',
      exportedAt: now.toISOString(),
      studentCount: students.length,
      certificateCount: certificates.length,
      checksum: generateChecksum(JSON.stringify(students) + JSON.stringify(certificates)),
    },
    schoolProfile: profile,
    students,
    certificates,
    customTemplates,
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `School_Certificates_Backup_${dateStr}_${timeStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  setLastBackupTime();
  saveAutoSnapshot('Manual Backup Downloaded (JSON)', students, certificates, profile, customTemplates);
}

// Parse and validate imported backup JSON
export function parseAndValidateBackupJSON(content: string): { success: boolean; data?: BackupData; error?: string } {
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid file format: Not a valid JSON object.' };
    }

    if (!Array.isArray(parsed.students)) {
      return { success: false, error: 'Invalid backup: "students" registry array not found.' };
    }

    if (!Array.isArray(parsed.certificates)) {
      return { success: false, error: 'Invalid backup: "certificates" archive array not found.' };
    }

    return {
      success: true,
      data: parsed as BackupData,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `JSON parse error: ${err?.message || 'Corrupted file'}`,
    };
  }
}

// CSV Export for Students Directory
export function exportStudentsCSV(students: Student[], selectedYear?: string): void {
  const headers = [
    'Registration No',
    'Symbol / Roll No',
    'Academic Session',
    'Admission Year',
    'Full Name',
    'Gender',
    'Date of Birth (AD)',
    'Date of Birth (BS)',
    'Father Name',
    'Mother Name',
    'Address',
    'Phone',
    'Passed Class / Level',
    'GPA / Division',
    'Character Assessment',
    'Dues Cleared'
  ];

  const rows = students.map(s => [
    `"${s.regNo || ''}"`,
    `"${s.symbolNo || ''}"`,
    `"${s.academicYear || ''}"`,
    `"${s.admissionYear || ''}"`,
    `"${s.fullName || ''}"`,
    `"${s.gender || ''}"`,
    `"${s.dateOfBirthAD || ''}"`,
    `"${s.dateOfBirthBS || ''}"`,
    `"${s.fatherName || ''}"`,
    `"${s.motherName || ''}"`,
    `"${s.address || ''}"`,
    `"${s.phone || ''}"`,
    `"${s.passedClass || ''}"`,
    `"${s.divisionOrGpa || ''}"`,
    `"${s.characterRating || ''}"`,
    `"${s.duesCleared || ''}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const suffix = selectedYear && selectedYear !== 'all' ? `_${selectedYear.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
  link.download = `Students_Directory${suffix}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Reset data to default samples
export function resetDatabaseToDefault(): { students: Student[]; certificates: Certificate[]; profile: SchoolProfile } {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialSchoolProfile));
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
  localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(initialCertificates));
  return {
    students: initialStudents,
    certificates: initialCertificates,
    profile: initialSchoolProfile,
  };
}
