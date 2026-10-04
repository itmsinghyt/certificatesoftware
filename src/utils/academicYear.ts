import { Certificate, SchoolProfile, Student } from '../types';

export const DEFAULT_ACADEMIC_YEARS = [
  '2082 B.S.',
  '2081 B.S.',
  '2080 B.S.',
  '2079 B.S.',
  '2078 B.S.',
  '2077 B.S.',
  '2076 B.S.',
  '2025-2026 A.D.',
  '2024-2025 A.D.',
  '2023-2024 A.D.',
  '2022-2023 A.D.',
];

/**
 * Returns a deduplicated, cleanly sorted list of all academic years available
 * across school profile settings, enrolled students, and issued certificates.
 */
export function getAllAcademicYears(
  school?: SchoolProfile,
  students: Student[] = [],
  certificates: Certificate[] = []
): string[] {
  const set = new Set<string>();

  // 1. Configured sessions in school profile
  if (school?.academicSessions && Array.isArray(school.academicSessions)) {
    school.academicSessions.forEach((y) => {
      if (y && y.trim()) set.add(y.trim());
    });
  }

  // 2. Current academic session
  if (school?.currentAcademicSession?.trim()) {
    set.add(school.currentAcademicSession.trim());
  }

  // 3. Years from student records
  students.forEach((s) => {
    if (s.academicYear?.trim()) set.add(s.academicYear.trim());
  });

  // 4. Years from issued certificates
  certificates.forEach((c) => {
    if (c.academicYear?.trim()) set.add(c.academicYear.trim());
  });

  // 5. Fallback defaults if list is too small
  if (set.size === 0) {
    DEFAULT_ACADEMIC_YEARS.forEach((y) => set.add(y));
  }

  const list = Array.from(set);

  // Sort descending: extract 4-digit numbers where possible (e.g. 2082 > 2081 > 2080 or 2024 > 2023)
  return list.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '').slice(0, 4), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, '').slice(0, 4), 10) || 0;
    return numB - numA;
  });
}

export function derivePreviousYear(year: string, offset: number = 1): string {
  if (!year) return '2080 B.S.';
  const match = year.match(/\d{4}/);
  if (!match) return year;
  const num = parseInt(match[0], 10);
  const prevNum = num - offset;
  return year.replace(match[0], String(prevNum));
}

export function deriveNextYear(year: string, offset: number = 1): string {
  if (!year) return '2082 B.S.';
  const match = year.match(/\d{4}/);
  if (!match) return year;
  const num = parseInt(match[0], 10);
  const nextNum = num + offset;
  return year.replace(match[0], String(nextNum));
}

export interface YearStatistics {
  academicYear: string;
  isCurrent: boolean;
  totalStudents: number;
  totalCertificates: number;
  characterCount: number;
  transferCount: number;
  transferCharacterCount: number;
}

export function getYearStatistics(
  year: string,
  students: Student[] = [],
  certificates: Certificate[] = [],
  currentSession?: string
): YearStatistics {
  const isAll = year === 'all';
  const yearStudents = isAll ? students : students.filter((s) => s.academicYear === year);
  const yearCerts = isAll ? certificates : certificates.filter((c) => c.academicYear === year);

  return {
    academicYear: year,
    isCurrent: !isAll && year === currentSession,
    totalStudents: yearStudents.length,
    totalCertificates: yearCerts.length,
    characterCount: yearCerts.filter((c) => c.certType === 'character').length,
    transferCount: yearCerts.filter((c) => c.certType === 'transfer').length,
    transferCharacterCount: yearCerts.filter((c) => c.certType === 'transfer_character').length,
  };
}
