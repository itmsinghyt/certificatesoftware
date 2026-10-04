import React, { useState, useEffect } from 'react';
import { Certificate, CertificateOrientation, CertificateTemplateConfig, CertificateType, SchoolProfile, Student } from '../types';
import { CertificateTemplate } from './CertificateTemplate';
import { CERTIFICATE_TEMPLATES, getTemplateById } from '../data/templatesData';
import {
  FileBadge2,
  FileCheck2,
  Printer,
  Save,
  UserPlus,
  Search,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Layout,
  Palette,
  Upload,
  ZoomIn,
  ZoomOut,
  Calendar,
  PenTool
} from 'lucide-react';
import { getAllAcademicYears, derivePreviousYear } from '../utils/academicYear';

interface IssueCertificateViewProps {
  students: Student[];
  certificates: Certificate[];
  school: SchoolProfile;
  customTemplates?: CertificateTemplateConfig[];
  initialType?: CertificateType;
  initialStudentId?: string;
  initialTemplateId?: string;
  initialOrientation?: CertificateOrientation;
  initialAcademicYear?: string;
  onSaveCertificate: (cert: Certificate, student: Student, printImmediately: boolean) => void;
  onBack: () => void;
  onOpenUploadModal?: () => void;
}

export const IssueCertificateView: React.FC<IssueCertificateViewProps> = ({
  students,
  certificates,
  school,
  customTemplates = [],
  initialType = 'character',
  initialStudentId,
  initialTemplateId,
  initialOrientation,
  initialAcademicYear,
  onSaveCertificate,
  onBack,
  onOpenUploadModal,
}) => {
  const [certType, setCertType] = useState<CertificateType>(initialType);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudentId || (students[0]?.id || ''));
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [templateId, setTemplateId] = useState<string>(initialTemplateId || school.defaultTemplateId || 'tpl-classic-gold');
  const [orientation, setOrientation] = useState<CertificateOrientation>(initialOrientation || school.defaultOrientation || 'portrait');
  const [showNewStudentForm, setShowNewStudentForm] = useState<boolean>(false);
  const [previewZoom, setPreviewZoom] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 48;
      if (window.innerWidth < 1024) return 65;
    }
    return 85;
  });

  const allAvailableTemplates = [...customTemplates, ...CERTIFICATE_TEMPLATES];
  const allAcademicYears = getAllAcademicYears(school, students, certificates);

  // Auto-generate Next Certificate No & Dispatch No
  const generateNextCertNo = (type: CertificateType) => {
    const prefix = type === 'character' ? 'CC' : type === 'transfer' ? 'TC' : 'BC';
    const year = new Date().getFullYear();
    const sameTypeCount = certificates.filter(c => c.certType === type).length + 1;
    const pad = String(sameTypeCount).padStart(4, '0');
    return `${prefix}-${year}-${pad}`;
  };

  const generateNextDispatchNo = () => {
    const nextNo = certificates.length + 140;
    const year = new Date().getFullYear();
    return `${nextNo}/${year}`;
  };

  // Form State
  const [certNo, setCertNo] = useState<string>(generateNextCertNo(certType));
  const [dispatchNo, setDispatchNo] = useState<string>(generateNextDispatchNo());
  const [issueDateAD, setIssueDateAD] = useState<string>(new Date().toISOString().split('T')[0]);
  const [issueDateBS, setIssueDateBS] = useState<string>('2081/06/19 B.S.');
  const [academicYear, setAcademicYear] = useState<string>(initialAcademicYear || school.currentAcademicSession || '2081 B.S.');
  
  // Student Editable/Override State
  const [regNo, setRegNo] = useState<string>('');
  const [symbolNo, setSymbolNo] = useState<string>('');
  const [serialNo, setSerialNo] = useState<string>('8296');
  const [fullName, setFullName] = useState<string>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dateOfBirthAD, setDateOfBirthAD] = useState<string>('');
  const [dateOfBirthBS, setDateOfBirthBS] = useState<string>('');
  const [fatherName, setFatherName] = useState<string>('');
  const [motherName, setMotherName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [passedClass, setPassedClass] = useState<string>('SEE (Grade -10)/SLC Examination (Grade XII)');
  const [divisionOrGpa, setDivisionOrGpa] = useState<string>('2.54 GPA/CGPA');
  const [characterRating, setCharacterRating] = useState<'Exemplary' | 'Very Good' | 'Good'>('Exemplary');
  const [duesCleared, setDuesCleared] = useState<'Yes' | 'No'>('Yes');
  const [reasonForLeaving, setReasonForLeaving] = useState<string>('This school has no objection if he/she studies in any other institutions in the country of abroad.');
  const [admissionYear, setAdmissionYear] = useState<string>('2079 B.S.');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [studyFromBS, setStudyFromBS] = useState<string>('2079 B.S.');
  const [studyToBS, setStudyToBS] = useState<string>('2081 B.S.');
  const [examHeldYearBS, setExamHeldYearBS] = useState<string>('2081 B.S.');
  const [examHeldYearAD, setExamHeldYearAD] = useState<string>('2024A.D.');

  // Signatory Overrides
  const [preparedBy, setPreparedBy] = useState<string>(school.preparedByName || 'written by');
  const [preparedByTitle, setPreparedByTitle] = useState<string>(school.preparedByTitle || 'written by');
  const [preparedBySignatureUrl, setPreparedBySignatureUrl] = useState<string>(school.preparedBySignatureUrl || '');

  const [verifiedBy, setVerifiedBy] = useState<string>(school.accountantName || 'Checked By');
  const [verifiedByTitle, setVerifiedByTitle] = useState<string>(school.accountantTitle || 'Checked By');
  const [verifiedBySignatureUrl, setVerifiedBySignatureUrl] = useState<string>(school.accountantSignatureUrl || '');

  const [headmaster, setHeadmaster] = useState<string>(school.principalName || 'Head Master');
  const [headmasterTitle, setHeadmasterTitle] = useState<string>(school.principalTitle || 'Headteacher');
  const [headmasterDesignation, setHeadmasterDesignation] = useState<string>(school.principalDesignation || 'Head Master / Principal');
  const [headmasterSignatureUrl, setHeadmasterSignatureUrl] = useState<string>(school.principalSignatureUrl || '');
  const [showSignatorySettings, setShowSignatorySettings] = useState<boolean>(false);

  // When selected student changes, populate fields
  useEffect(() => {
    if (selectedStudentId && !showNewStudentForm) {
      const std = students.find(s => s.id === selectedStudentId);
      if (std) {
        setRegNo(std.regNo || '');
        setSymbolNo(std.symbolNo || '');
        setSerialNo(std.serialNo || '8296');
        setFullName(std.fullName || '');
        setGender(std.gender || 'Male');
        setDateOfBirthAD(std.dateOfBirthAD || '');
        setDateOfBirthBS(std.dateOfBirthBS || '');
        setFatherName(std.fatherName || '');
        setMotherName(std.motherName || '');
        setAddress(std.address || '');
        setPassedClass(std.passedClass || 'SEE (Grade -10)/SLC Examination (Grade XII)');
        setDivisionOrGpa(std.divisionOrGpa || '2.54 GPA/CGPA');
        setCharacterRating(std.characterRating || 'Exemplary');
        setDuesCleared(std.duesCleared || 'Yes');
        setReasonForLeaving(std.reasonForLeaving || 'This school has no objection if he/she studies in any other institutions in the country of abroad.');
        if (std.academicYear) setAcademicYear(std.academicYear);
        setAdmissionYear(std.admissionYear || '2079 B.S.');
        setPhotoUrl(std.photoUrl || '');
        setStudyFromBS(std.studyFromBS || '2079 B.S.');
        setStudyToBS(std.studyToBS || '2081 B.S.');
        setExamHeldYearBS(std.examHeldYearBS || '2081 B.S.');
        setExamHeldYearAD(std.examHeldYearAD || '2024A.D.');
      }
    }
  }, [selectedStudentId, showNewStudentForm, students]);

  // Update cert number when type changes
  const handleTypeChange = (newType: CertificateType) => {
    setCertType(newType);
    setCertNo(generateNextCertNo(newType));
  };

  // Live composite student object for preview
  const previewStudent: Student = {
    id: selectedStudentId || 'temp-id',
    regNo,
    symbolNo,
    serialNo,
    fullName,
    gender,
    dateOfBirthAD,
    dateOfBirthBS,
    fatherName,
    motherName,
    address,
    phone: '',
    academicYear,
    passedClass,
    divisionOrGpa,
    characterRating,
    admissionYear,
    duesCleared,
    reasonForLeaving,
    photoUrl,
    studyFromBS,
    studyToBS,
    examHeldYearBS,
    examHeldYearAD,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Live composite certificate object for preview
  const previewCertificate: Certificate = {
    id: 'preview-cert-' + Date.now(),
    certNo,
    dispatchNo,
    serialNo,
    studentId: previewStudent.id,
    certType,
    issueDateAD,
    issueDateBS,
    academicYear,
    templateId,
    orientation,
    characterRating,
    divisionOrGpa,
    passedClass,
    reasonForLeaving,
    duesCleared,
    preparedBy,
    preparedByTitle,
    preparedBySignatureUrl,
    verifiedBy,
    verifiedByTitle,
    verifiedBySignatureUrl,
    headmaster,
    headmasterTitle,
    headmasterDesignation,
    headmasterSignatureUrl,
    studentPhotoUrl: photoUrl,
    studyFromBS,
    studyToBS,
    createdAt: new Date().toISOString(),
    printCount: 0,
  };

  const handleSave = (printImmediately: boolean) => {
    if (!fullName.trim()) {
      alert('Please enter the student\'s full name.');
      return;
    }

    const studentToSave: Student = {
      ...previewStudent,
      id: showNewStudentForm || !selectedStudentId ? 'std-' + Date.now() : selectedStudentId,
    };

    const certToSave: Certificate = {
      ...previewCertificate,
      id: 'cert-' + Date.now(),
      studentId: studentToSave.id,
    };

    onSaveCertificate(certToSave, studentToSave, printImmediately);
  };

  const [studentYearFilter, setStudentYearFilter] = useState<string>('all');

  const filteredStudents = students.filter(s => {
    if (studentYearFilter !== 'all' && s.academicYear !== studentYearFilter) return false;
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.regNo.toLowerCase().includes(q) ||
      s.symbolNo.toLowerCase().includes(q) ||
      (s.academicYear && s.academicYear.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Certificate Live Print Canvas
            </h2>
            <p className="text-xs text-slate-500">
              Choose from 20 templates or the exact Photo Replica, switch Portrait/Landscape, and preview live updates
            </p>
          </div>
        </div>

        {/* Certificate Type Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg flex-wrap gap-1">
          <button
            onClick={() => {
              handleTypeChange('transfer_character');
              setTemplateId('tpl-chandrodaya-official');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              certType === 'transfer_character'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transfer / Character (Official Model)</span>
          </button>

          <button
            onClick={() => handleTypeChange('character')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              certType === 'character'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileBadge2 className="w-3.5 h-3.5" />
            <span>Character Certificate</span>
          </button>

          <button
            onClick={() => handleTypeChange('transfer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              certType === 'transfer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Transfer Certificate (TC)</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Record</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Save & Print Now</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Form on Left, Real-Time Certificate Canvas on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Input Controls */}
        <div className="xl:col-span-5 space-y-4">
          
          {/* Section 1: Template & Orientation Control */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-700" />
                Template & Orientation (20 Templates Available)
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                {CERTIFICATE_TEMPLATES.length} Designs
              </span>
            </span>

            {/* Orientation Toggle Button */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">
                Page Orientation:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation('portrait')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    orientation === 'portrait'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Layout className="w-4 h-4 rotate-90 text-amber-700" />
                  <span>Portrait (A4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrientation('landscape')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    orientation === 'landscape'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Layout className="w-4 h-4 text-amber-700" />
                  <span>Landscape (A4)</span>
                </button>
              </div>
            </div>

            {/* Template Selector dropdown & Quick Carousel */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-semibold text-xs">
                  Choose Design Template (Design & Custom):
                </label>
                {onOpenUploadModal && (
                  <button
                    type="button"
                    onClick={onOpenUploadModal}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 hover:underline cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>+ Upload Template</span>
                  </button>
                )}
              </div>

              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {allAvailableTemplates.map((t, idx) => (
                  <option key={t.id} value={t.id}>
                    #{idx + 1}. {t.name} {t.isCustomUploaded ? '★ [CUSTOM UPLOADED]' : `(${t.category})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Mini visual pills for top templates */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {allAvailableTemplates.slice(0, 8).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  className={`px-2 py-1 rounded border whitespace-nowrap cursor-pointer transition-colors ${
                    templateId === t.id
                      ? 'bg-slate-900 text-white font-bold border-slate-900'
                      : t.isCustomUploaded
                      ? 'bg-amber-100 text-amber-950 border-amber-300 font-medium'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.isCustomUploaded ? '★ ' + t.name.split(' ')[0] : t.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Student Selection */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">1</span>
                Student Selection
              </span>

              <button
                onClick={() => {
                  setShowNewStudentForm(!showNewStudentForm);
                  if (!showNewStudentForm) setSelectedStudentId('');
                }}
                className="text-xs text-amber-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{showNewStudentForm ? 'Choose from list' : '+ Enter new student'}</span>
              </button>
            </div>

            {!showNewStudentForm ? (
              <div className="space-y-2">
                {/* Session Filter for Students */}
                <div className="flex flex-wrap items-center gap-1 text-[11px] pb-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
                    <Calendar className="w-3 h-3 text-amber-700" />
                    <span>सत्र:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStudentYearFilter('all')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                      studentYearFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    सबै ({students.length})
                  </button>
                  {allAcademicYears.slice(0, 4).map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setStudentYearFilter(yr)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                        studentYearFilter === yr
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search student by name, reg no or roll no..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 border border-slate-100 rounded-lg p-1 bg-slate-50/50">
                  {filteredStudents.length === 0 ? (
                    <div className="p-3 text-center text-slate-400 text-xs">
                      यस सत्रमा कुनै विद्यार्थी फेला परेन।
                    </div>
                  ) : (
                    filteredStudents.map((std) => (
                      <div
                        key={std.id}
                        onClick={() => setSelectedStudentId(std.id)}
                        className={`p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-all ${
                          selectedStudentId === std.id
                            ? 'bg-amber-100/70 border border-amber-300 font-semibold text-slate-950 shadow-2xs'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 truncate">{std.fullName}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-slate-200 text-slate-800 shrink-0">
                              {std.academicYear || '-'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block truncate">
                            Reg: {std.regNo} · Roll: {std.symbolNo || '-'}
                          </span>
                        </div>
                        {selectedStudentId === std.id && (
                          <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Session mismatch detector */}
                {selectedStudentId && (() => {
                  const currStd = students.find(s => s.id === selectedStudentId);
                  if (currStd && currStd.academicYear && currStd.academicYear !== academicYear) {
                    return (
                      <div className="p-2 bg-amber-50 border border-amber-300 rounded-lg text-[11px] text-amber-950 flex items-center justify-between gap-2">
                        <span>
                          विद्यार्थीको सत्र: <strong>{currStd.academicYear}</strong> | प्रमाणपत्र सत्र: <strong>{academicYear}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAcademicYear(currStd.academicYear);
                            setStudyToBS(currStd.academicYear);
                            setExamHeldYearBS(currStd.academicYear);
                          }}
                          className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold shrink-0 cursor-pointer"
                        >
                          प्रमाणपत्रमा यो सत्र राख्नुहोस्
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            ) : (
              <div className="p-2 bg-amber-50/50 border border-amber-200 rounded-lg text-xs text-amber-900">
                Fill the fields below; this student profile will also be saved to your directory automatically.
              </div>
            )}
          </div>

          {/* Section 3: Student Personal Details */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">2</span>
              Student Personal & Academic Profile
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name: *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aaryan Shrestha"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">School Registration No: *</label>
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="JJSS-2024-001"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Symbol / Board Exam Roll No:</label>
                <input
                  type="text"
                  value={symbolNo}
                  onChange={(e) => setSymbolNo(e.target.value)}
                  placeholder="02801452K"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Date of Birth (AD):</label>
                <input
                  type="date"
                  value={dateOfBirthAD}
                  onChange={(e) => setDateOfBirthAD(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Date of Birth (BS / Other Calendar):</label>
                <input
                  type="text"
                  value={dateOfBirthBS}
                  onChange={(e) => setDateOfBirthBS(e.target.value)}
                  placeholder="2063/05/14 B.S."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Father's Full Name:</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="Deepak Kumar Shrestha"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Mother's Full Name:</label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="Sushila Shrestha"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Residential Address:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Koteshwor-32, Kathmandu, Nepal"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Certificate Details */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">3</span>
              Certificate & Evaluation Details
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Certificate Serial No: *</label>
                <input
                  type="text"
                  value={certNo}
                  onChange={(e) => setCertNo(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Dispatch / Register No: *</label>
                <input
                  type="text"
                  value={dispatchNo}
                  onChange={(e) => setDispatchNo(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Date of Issue (AD):</label>
                <input
                  type="date"
                  value={issueDateAD}
                  onChange={(e) => setIssueDateAD(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold text-xs">Academic Session (शैक्षिक सत्र):</label>
                  <span className="text-[10px] text-amber-800 font-semibold">Multi-Year</span>
                </div>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    list="issue-academic-sessions-list"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g. 2081 B.S."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <datalist id="issue-academic-sessions-list">
                    {allAcademicYears.map((y) => (
                      <option key={y} value={y} />
                    ))}
                  </datalist>

                  {/* Quick Session switcher pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                    {allAcademicYears.slice(0, 6).map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => {
                          setAcademicYear(y);
                          setStudyToBS(y);
                          setExamHeldYearBS(y);
                          setStudyFromBS(derivePreviousYear(y, 2));
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer transition-colors ${
                          academicYear === y
                            ? 'bg-amber-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Passed Class / Level:</label>
                <input
                  type="text"
                  value={passedClass}
                  onChange={(e) => setPassedClass(e.target.value)}
                  placeholder="Grade 10 (Secondary Education Examination - SEE)"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Result / Division / GPA:</label>
                <input
                  type="text"
                  value={divisionOrGpa}
                  onChange={(e) => setDivisionOrGpa(e.target.value)}
                  placeholder="GPA 3.85 (A+)"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Character & Conduct Evaluation:</label>
                <select
                  value={characterRating}
                  onChange={(e) => setCharacterRating(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                >
                  <option value="Exemplary">Exemplary (Outstanding)</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                </select>
              </div>

              {/* Transfer Certificate specifics */}
              {certType === 'transfer' && (
                <>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">School Dues Cleared:</label>
                    <select
                      value={duesCleared}
                      onChange={(e) => setDuesCleared(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                    >
                      <option value="Yes">Yes - Fully Cleared</option>
                      <option value="No">No - Pending Dues</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">Reason for Leaving School:</label>
                    <input
                      type="text"
                      value={reasonForLeaving}
                      onChange={(e) => setReasonForLeaving(e.target.value)}
                      placeholder="For higher secondary education / Relocation"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 5: Certificate Signatories & Digital Signatures */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>5. Signatories & Digital Signatures</span>
              </span>

              <button
                type="button"
                onClick={() => setShowSignatorySettings(!showSignatorySettings)}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 hover:underline cursor-pointer"
              >
                {showSignatorySettings ? 'Collapse' : 'Customize Signatures'}
              </button>
            </div>

            {showSignatorySettings ? (
              <div className="space-y-3 pt-1">
                {/* 1. Written By */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block text-[11px]">1. Prepared By / Written By:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Title:</label>
                      <input
                        type="text"
                        value={preparedByTitle}
                        onChange={(e) => setPreparedByTitle(e.target.value)}
                        placeholder="written by"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Name:</label>
                      <input
                        type="text"
                        value={preparedBy}
                        onChange={(e) => setPreparedBy(e.target.value)}
                        placeholder="written by"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    {preparedBySignatureUrl ? (
                      <div className="flex items-center justify-between bg-white p-1.5 border border-slate-200 rounded">
                        <img src={preparedBySignatureUrl} alt="Signature" className="h-6 max-w-[80px] object-contain" />
                        <button
                          type="button"
                          onClick={() => setPreparedBySignatureUrl('')}
                          className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-1.5 p-1 bg-white hover:bg-slate-100 border border-dashed border-slate-300 rounded text-[11px] font-medium text-slate-600 cursor-pointer">
                        <Upload className="w-3 h-3 text-slate-400" />
                        <span>Upload Signature PNG</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = (ev) => setPreparedBySignatureUrl((ev.target?.result as string) || '');
                              r.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 2. Checked By */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block text-[11px]">2. Checked By / Verified By:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Title:</label>
                      <input
                        type="text"
                        value={verifiedByTitle}
                        onChange={(e) => setVerifiedByTitle(e.target.value)}
                        placeholder="Checked By"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Name:</label>
                      <input
                        type="text"
                        value={verifiedBy}
                        onChange={(e) => setVerifiedBy(e.target.value)}
                        placeholder="Checked By"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    {verifiedBySignatureUrl ? (
                      <div className="flex items-center justify-between bg-white p-1.5 border border-slate-200 rounded">
                        <img src={verifiedBySignatureUrl} alt="Signature" className="h-6 max-w-[80px] object-contain" />
                        <button
                          type="button"
                          onClick={() => setVerifiedBySignatureUrl('')}
                          className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-1.5 p-1 bg-white hover:bg-slate-100 border border-dashed border-slate-300 rounded text-[11px] font-medium text-slate-600 cursor-pointer">
                        <Upload className="w-3 h-3 text-slate-400" />
                        <span>Upload Signature PNG</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = (ev) => setVerifiedBySignatureUrl((ev.target?.result as string) || '');
                              r.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 3. Head Master */}
                <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block text-[11px]">3. Headteacher / Head Master:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Title:</label>
                      <input
                        type="text"
                        value={headmasterTitle}
                        onChange={(e) => setHeadmasterTitle(e.target.value)}
                        placeholder="Headteacher"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Name:</label>
                      <input
                        type="text"
                        value={headmaster}
                        onChange={(e) => setHeadmaster(e.target.value)}
                        placeholder="Head Master"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Designation:</label>
                    <input
                      type="text"
                      value={headmasterDesignation}
                      onChange={(e) => setHeadmasterDesignation(e.target.value)}
                      placeholder="Headteacher / Head Master"
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    {headmasterSignatureUrl ? (
                      <div className="flex items-center justify-between bg-white p-1.5 border border-amber-300 rounded">
                        <img src={headmasterSignatureUrl} alt="Signature" className="h-6 max-w-[90px] object-contain" />
                        <button
                          type="button"
                          onClick={() => setHeadmasterSignatureUrl('')}
                          className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-1.5 p-1 bg-white hover:bg-amber-100/50 border border-dashed border-amber-300 rounded text-[11px] font-medium text-amber-900 cursor-pointer">
                        <Upload className="w-3 h-3 text-amber-600" />
                        <span>Upload Headmaster Signature PNG</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = (ev) => setHeadmasterSignatureUrl((ev.target?.result as string) || '');
                              r.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setPreparedBy(school.preparedByName || 'written by');
                      setPreparedByTitle(school.preparedByTitle || 'written by');
                      setPreparedBySignatureUrl(school.preparedBySignatureUrl || '');
                      setVerifiedBy(school.accountantName || 'Checked By');
                      setVerifiedByTitle(school.accountantTitle || 'Checked By');
                      setVerifiedBySignatureUrl(school.accountantSignatureUrl || '');
                      setHeadmaster(school.principalName || 'Head Master');
                      setHeadmasterTitle(school.principalTitle || 'Headteacher');
                      setHeadmasterDesignation(school.principalDesignation || 'Head Master / Principal');
                      setHeadmasterSignatureUrl(school.principalSignatureUrl || '');
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                  >
                    Reset to School Defaults
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Default: <span className="font-semibold text-slate-700">{preparedByTitle}</span> · <span className="font-semibold text-slate-700">{verifiedByTitle}</span> · <span className="font-semibold text-slate-700">{headmasterTitle}</span>. Click "Customize Signatures" to write custom names or upload signatures.
              </p>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Live Print Preview Canvas */}
        <div className="xl:col-span-7 xl:sticky xl:top-2">
          <div className="bg-slate-900/5 border border-slate-300 rounded-xl p-3">
            
            {/* Live Print Canvas Control Toolbar */}
            <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs gap-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Live Print Canvas ({orientation.toUpperCase()})
              </span>

              {/* Quick Orientation switch and Zoom controls on the Canvas toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Zoom Controls for Mobile, Tab, Laptop, Desktop */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1.5 py-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPreviewZoom((z) => Math.max(35, z - 10))}
                    title="Zoom Out"
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-semibold text-slate-700 w-10 text-center">
                    {previewZoom}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom((z) => Math.min(125, z + 10))}
                    title="Zoom In"
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.innerWidth < 640) setPreviewZoom(48);
                      else if (window.innerWidth < 1024) setPreviewZoom(65);
                      else setPreviewZoom(85);
                    }}
                    title="Fit to Screen"
                    className="text-[10px] text-slate-500 hover:text-slate-800 hover:underline px-1 cursor-pointer font-medium border-l border-slate-200"
                  >
                    Fit
                  </button>
                </div>

                <div className="flex items-center p-0.5 bg-slate-200/80 rounded-md">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      orientation === 'portrait' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    <Layout className="w-3 h-3 rotate-90" />
                    <span className="hidden sm:inline">Portrait</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      orientation === 'landscape' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    <Layout className="w-3 h-3" />
                    <span className="hidden sm:inline">Landscape</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 font-mono hidden md:inline truncate max-w-[120px]">
                  {getTemplateById(templateId, customTemplates).name}
                </span>
              </div>
            </div>

            {/* Scrollable preview container */}
            <div className="overflow-x-auto max-h-[820px] overflow-y-auto overscroll-contain touch-scroll rounded shadow-inner p-2 bg-slate-200/50 flex justify-center">
              <div
                className="transform origin-top transition-transform duration-150"
                style={{
                  transform: `scale(${previewZoom / 100})`,
                  width: orientation === 'landscape' ? '1060px' : '820px',
                }}
              >
                <CertificateTemplate
                  certificate={previewCertificate}
                  student={previewStudent}
                  school={school}
                  previewMode={true}
                  orientationOverride={orientation}
                  templateIdOverride={templateId}
                  customTemplates={customTemplates}
                />
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
