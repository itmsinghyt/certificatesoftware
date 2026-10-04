export type CertificateType = 'character' | 'transfer' | 'bonafide' | 'transfer_character';

export type CertificateOrientation = 'portrait' | 'landscape';

export type TemplateCategory =
  | 'All'
  | 'Government Official'
  | 'Traditional'
  | 'Collegiate'
  | 'Modern'
  | 'Vintage'
  | 'Executive'
  | 'Minimalist'
  | 'Uploaded Custom';

export interface CertificateTemplateConfig {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  primaryColor: string;
  accentBorder: string;
  outerBorderClass: string;
  innerBorderClass: string;
  bgClass: string;
  cornerFlourish: string;
  badgeStyle: string;
  fontFamilyTitle: string;
  sealColor: string;
  watermarkOpacity: string;
  // Custom Uploaded Template Properties
  isCustomUploaded?: boolean;
  backgroundImageUrl?: string;
  hideDefaultHeader?: boolean;
  contentPaddingTop?: number;
  printBackground?: boolean;
  backgroundOpacity?: number;
  createdAt?: string;
}

export interface Student {
  id: string;
  regNo: string;           // Registration No (e.g. REG-2024-0142 or 807680080021)
  symbolNo: string;        // Symbol / Board Roll No (e.g. 02409812A or 26800401)
  fullName: string;        // Full Name (e.g. Janak Bohara)
  fullNameNe?: string;     // Optional Devanagari Name
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirthAD: string;   // A.D. Date of Birth (YYYY-MM-DD)
  dateOfBirthBS?: string;  // B.S. Date of Birth (e.g. 2062/05/02 B.S.)
  fatherName: string;
  motherName: string;
  guardianName?: string;
  address: string;         // e.g. Kedarsyun Rural Municipality ward no. 5, Bajhang District Sudurpaschim Province
  phone: string;
  academicYear: string;    // e.g. 2081 B.S. or 2023-2024
  passedClass: string;     // e.g. SEE (Grade -10)/SLC Examination (Grade XII)
  divisionOrGpa: string;   // e.g. 2.54 GPA/CGPA
  characterRating: 'Exemplary' | 'Very Good' | 'Good';
  admissionYear?: string;  // e.g. 2079 B.S.
  dateOfLeaving?: string;  // e.g. 2081 B.S.
  duesCleared: 'Yes' | 'No';
  reasonForLeaving?: string;
  remarks?: string;
  photoUrl?: string;       // Student passport photo data/URL
  serialNo?: string;       // S.No. (e.g. 8296)
  municipality?: string;   // e.g. Kedarsyun Rural Municipality
  wardNo?: string;         // e.g. 5
  district?: string;       // e.g. Bajhang District
  province?: string;       // e.g. Sudurpaschim Province
  studyFromBS?: string;    // e.g. 2079 B.S.
  studyToBS?: string;      // e.g. 2081 B.S.
  examHeldYearBS?: string; // e.g. 2081 B.S.
  examHeldYearAD?: string; // e.g. 2024A.D.
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  certNo: string;          // Certificate No (e.g. CC-2024-0088)
  dispatchNo: string;      // Dispatch / Serial No (e.g. 142/2024)
  serialNo?: string;       // S.No. (e.g. 8296)
  studentId: string;
  certType: CertificateType;
  issueDateAD: string;     // Issue Date A.D. (e.g. 2024-07-12)
  issueDateBS?: string;    // B.S. Date (e.g. 2083/06/16)
  academicYear: string;
  templateId: string;      // Template ID
  templateTheme?: string;
  orientation: CertificateOrientation; // 'portrait' | 'landscape'
  characterRating: string;
  divisionOrGpa: string;
  passedClass: string;
  reasonForLeaving?: string;
  duesCleared: string;
  remarks?: string;
  preparedBy: string;      // written by / prepared by name
  preparedByTitle?: string; // custom title (e.g. 'written by', 'Prepared By')
  preparedBySignatureUrl?: string; // optional uploaded signature image
  verifiedBy: string;      // Checked By / accountant name
  verifiedByTitle?: string; // custom title (e.g. 'Checked By', 'Verified By')
  verifiedBySignatureUrl?: string; // optional uploaded signature image
  headmaster: string;      // Head Master / Headteacher name
  headmasterDesignation: string;
  headmasterTitle?: string; // custom title (e.g. 'Headteacher', 'Head Master', 'Principal')
  headmasterSignatureUrl?: string; // optional uploaded signature image
  schoolNameOverride?: string;
  schoolAddressOverride?: string;
  studentPhotoUrl?: string;
  studyFromBS?: string;
  studyToBS?: string;
  qrPayload?: string;
  createdAt: string;
  printCount: number;
  lastPrintedAt?: string;
}

export interface SchoolProfile {
  name: string;
  affiliation: string;
  establishedYear: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  registrationNo: string;
  motto: string;
  logoUrl: string;
  principalName: string;
  principalDesignation: string;
  principalTitle?: string;
  principalSignatureUrl?: string;
  accountantName: string;
  accountantTitle?: string;
  accountantDesignation?: string;
  accountantSignatureUrl?: string;
  preparedByName: string;
  preparedByTitle?: string;
  preparedByDesignation?: string;
  preparedBySignatureUrl?: string;
  defaultTemplateId: string;
  defaultTheme?: string;
  defaultOrientation: CertificateOrientation;
  currentAcademicSession: string;
  academicSessions?: string[];
}

export interface BackupMetadata {
  appVersion: string;
  appName: string;
  exportedAt: string;
  studentCount: number;
  certificateCount: number;
  checksum: string;
}

export interface BackupData {
  metadata: BackupMetadata;
  schoolProfile: SchoolProfile;
  students: Student[];
  certificates: Certificate[];
  customTemplates?: CertificateTemplateConfig[];
}

export interface AutoBackupSnapshot {
  id: string;
  timestamp: string;
  reason: string;
  studentCount: number;
  certificateCount: number;
  data: BackupData;
}
