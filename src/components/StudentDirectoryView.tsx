import React, { useState, useEffect } from 'react';
import { CertificateOrientation, CertificateType, SchoolProfile, Student } from '../types';
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  FileBadge2,
  FileCheck2,
  Download,
  AlertCircle,
  X,
  CheckSquare,
  Square,
  Printer,
  Calendar,
} from 'lucide-react';
import { exportStudentsCSV } from '../utils/storage';
import { getAllAcademicYears } from '../utils/academicYear';

interface StudentDirectoryViewProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onIssueForStudent: (studentId: string, certType: CertificateType) => void;
  onIssueBatchForStudents?: (studentIds: string[], certType: CertificateType) => void;
  onBatchChangeYear?: (studentIds: string[], newYear: string) => void;
  school?: SchoolProfile;
  initialYear?: string;
  onYearChange?: (year: string) => void;
}

export const StudentDirectoryView: React.FC<StudentDirectoryViewProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onIssueForStudent,
  onIssueBatchForStudents,
  onBatchChangeYear,
  school,
  initialYear = 'all',
  onYearChange,
}) => {
  const [search, setSearch] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>(initialYear);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isBatchSessionModalOpen, setIsBatchSessionModalOpen] = useState<boolean>(false);
  const [batchTargetSession, setBatchTargetSession] = useState<string>(
    school?.currentAcademicSession || '2081 B.S.'
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialYear !== undefined) {
      setYearFilter(initialYear);
    }
  }, [initialYear]);

  const allAcademicYears = getAllAcademicYears(school, students);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<Student>>({
    fullName: '',
    regNo: '',
    symbolNo: '',
    gender: 'Male',
    dateOfBirthAD: '2006-08-30',
    dateOfBirthBS: '2063/05/14 B.S.',
    fatherName: '',
    motherName: '',
    address: 'Kathmandu, Nepal',
    phone: '',
    academicYear: '2023-2024',
    passedClass: 'Grade 10 (Secondary Education Examination - SEE)',
    divisionOrGpa: 'GPA 3.80 (A+)',
    characterRating: 'Exemplary',
    duesCleared: 'Yes',
    reasonForLeaving: 'For higher studies',
  });

  const openAddModal = () => {
    setEditingStudent(null);
    const year = new Date().getFullYear();
    const defaultYear = yearFilter !== 'all' ? yearFilter : school?.currentAcademicSession || '2081 B.S.';
    setFormData({
      fullName: '',
      regNo: `REG-${year}-${String(students.length + 1).padStart(3, '0')}`,
      symbolNo: '',
      gender: 'Male',
      dateOfBirthAD: '2006-08-30',
      dateOfBirthBS: '2063/05/14 B.S.',
      fatherName: '',
      motherName: '',
      address: school?.address || 'Kathmandu, Nepal',
      phone: '',
      academicYear: defaultYear,
      admissionYear: '2079 B.S.',
      passedClass: 'Grade 10 (Secondary Education Examination - SEE)',
      divisionOrGpa: 'GPA 3.80 (A+)',
      characterRating: 'Exemplary',
      duesCleared: 'Yes',
      reasonForLeaving: 'For higher studies',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim()) {
      alert('Please enter student\'s full name.');
      return;
    }

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...formData,
        updatedAt: new Date().toISOString(),
      } as Student);
    } else {
      const newStudent: Student = {
        ...formData,
        id: 'std-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Student;
      onAddStudent(newStudent);
    }
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter((s) => {
    if (yearFilter !== 'all' && s.academicYear !== yearFilter) return false;

    const q = search.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.regNo.toLowerCase().includes(q) ||
      s.symbolNo.toLowerCase().includes(q) ||
      (s.address && s.address.toLowerCase().includes(q)) ||
      (s.academicYear && s.academicYear.toLowerCase().includes(q)) ||
      s.phone.includes(q)
    );
  });

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const isAllSelected = filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length;

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Student Directory & Enrollment Records
          </h2>
          <p className="text-xs text-slate-500">
            Official records of registered, enrolled, and graduated students · Select students for batch certificate generation or session promotion
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedStudentIds.length > 0 && onIssueBatchForStudents && (
            <button
              onClick={() => onIssueBatchForStudents(selectedStudentIds, 'character')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <FileBadge2 className="w-3.5 h-3.5" />
              <span>Issue Character Cert ({selectedStudentIds.length})</span>
            </button>
          )}

          <button
            onClick={() => exportStudentsCSV(filteredStudents, yearFilter)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>
        </div>
      </div>

      {/* Selected Indicator Banner */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2 font-semibold text-amber-950">
            <CheckSquare className="w-4 h-4 text-amber-700" />
            <span>
              {selectedStudentIds.length} student{selectedStudentIds.length === 1 ? '' : 's'} selected in directory.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Batch Change Academic Session Button */}
            {onBatchChangeYear && (
              <button
                type="button"
                onClick={() => setIsBatchSessionModalOpen(true)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Change Session / Promote ({selectedStudentIds.length})</span>
              </button>
            )}

            {onIssueBatchForStudents && (
              <>
                <button
                  onClick={() => onIssueBatchForStudents(selectedStudentIds, 'character')}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Generate Character Certs
                </button>
                <button
                  onClick={() => onIssueBatchForStudents(selectedStudentIds, 'transfer')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Generate Transfer Certs (TC)
                </button>
              </>
            )}
            <button
              onClick={() => setSelectedStudentIds([])}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-medium cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Multi-Year Academic Session Filter Pills & Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5 text-xs">
        
        {/* Quick Clickable Year Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-100">
          <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>Academic Session:</span>
          </span>

          <button
            type="button"
            onClick={() => {
              setYearFilter('all');
              onYearChange?.('all');
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              yearFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Sessions ({students.length})
          </button>

          {allAcademicYears.map((yr) => {
            const count = students.filter((s) => s.academicYear === yr).length;
            const isSelected = yearFilter === yr;
            const isCurrent = yr === school?.currentAcademicSession;

            return (
              <button
                key={yr}
                type="button"
                onClick={() => {
                  setYearFilter(yr);
                  onYearChange?.(yr);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{yr}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-amber-800 text-amber-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
                {isCurrent && (
                  <span className={`text-[9px] uppercase font-bold ${isSelected ? 'text-amber-200' : 'text-amber-700'}`}>
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, reg no or symbol no..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium cursor-pointer"
            >
              {isAllSelected ? <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isAllSelected ? 'Deselect All' : 'Select All Filtered'}</span>
            </button>

            <span className="text-slate-500 font-mono">
              Total: <span className="font-bold text-slate-900">{filteredStudents.length}</span> students
            </span>
          </div>
        </div>
      </div>

      {/* Students Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-10 text-center">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No students found</p>
            <p className="text-xs text-slate-400 mt-1">Try another search term or click "Add Student" above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-4 py-2.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-2.5">Reg & Symbol No</th>
                  <th className="px-4 py-2.5">Academic Session</th>
                  <th className="px-4 py-2.5">Full Name & Gender</th>
                  <th className="px-4 py-2.5">Parentage</th>
                  <th className="px-4 py-2.5">Date of Birth</th>
                  <th className="px-4 py-2.5">Class / GPA</th>
                  <th className="px-4 py-2.5">Address & Phone</th>
                  <th className="px-4 py-2.5 text-right">Quick Issue</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => {
                  const isSelected = selectedStudentIds.includes(std.id);

                  return (
                    <tr
                      key={std.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-amber-50/60 font-medium' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectStudent(std.id)}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-slate-900 block">{std.regNo}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Symbol: {std.symbolNo || '-'}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] whitespace-nowrap">
                          {std.academicYear || '-'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block text-sm">
                          {std.fullName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">{std.gender}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-slate-800 block font-medium">F: {std.fatherName}</span>
                        <span className="text-slate-500 text-[11px]">M: {std.motherName}</span>
                      </td>

                      <td className="px-4 py-3 text-slate-700 font-mono">
                        <span className="block">{std.dateOfBirthAD}</span>
                        {std.dateOfBirthBS && <span className="text-[10px] text-slate-400">{std.dateOfBirthBS}</span>}
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800 block">{std.passedClass}</span>
                        <span className="text-slate-500 text-[11px] font-mono">{std.divisionOrGpa}</span>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        <span className="block truncate max-w-[140px]">{std.address}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{std.phone || '-'}</span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onIssueForStudent(std.id, 'character')}
                            title="Issue Character Certificate"
                            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors cursor-pointer"
                          >
                            <FileBadge2 className="w-3 h-3 text-amber-700" />
                            <span>CC</span>
                          </button>

                          <button
                            onClick={() => onIssueForStudent(std.id, 'transfer')}
                            title="Issue Transfer Certificate (TC)"
                            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors cursor-pointer"
                          >
                            <FileCheck2 className="w-3 h-3 text-blue-700" />
                            <span>TC</span>
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(std)}
                            title="Edit Profile"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete student profile for ${std.fullName}?`)) {
                                onDeleteStudent(std.id);
                              }
                            }}
                            title="Delete Student"
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Batch Change Academic Session Modal */}
      {isBatchSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    शैक्षिक सत्र स्तरोन्नति / परिवर्तन
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Change Academic Session for {selectedStudentIds.length} Students
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBatchSessionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-950">
                <p className="font-semibold">
                  छनोट गरिएका {selectedStudentIds.length} जना विद्यार्थीहरूलाई कुन नयाँ शैक्षिक सत्रमा सार्न चाहनुहुन्छ?
                </p>
                <p className="text-[11px] text-amber-800 mt-1">
                  सबै छनोट भएका विद्यार्थीहरूको शैक्षिक सत्र एकैसाथ अपडेट हुनेछ र अभिलेख सुरक्षित रहनेछ।
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  नयाँ शैक्षिक सत्र छनोट गर्नुहोस् (Select Target Academic Session):
                </label>
                <select
                  value={batchTargetSession}
                  onChange={(e) => setBatchTargetSession(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 cursor-pointer"
                >
                  {allAcademicYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} {yr === school?.currentAcademicSession ? '★ (चालु सत्र / Active Session)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 text-[11px]">द्रुत छनोट:</span>
                {allAcademicYears.slice(0, 5).map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setBatchTargetSession(yr)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                      batchTargetSession === yr
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchSessionModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  रद्द गर्नुहोस् (Cancel)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onBatchChangeYear) {
                      onBatchChangeYear(selectedStudentIds, batchTargetSession);
                      setSelectedStudentIds([]);
                      setIsBatchSessionModalOpen(false);
                      setYearFilter(batchTargetSession);
                      onYearChange?.(batchTargetSession);
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm cursor-pointer"
                >
                  सत्र अद्यावधिक गर्नुहोस् (Update Session)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingStudent ? 'Edit Student Profile' : 'New Student Registration Form'}
                </h3>
                <p className="text-xs text-slate-300">
                  Enter student details accurately for academic certificate generation
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name: *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender:</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">School Registration No: *</label>
                  <input
                    type="text"
                    required
                    value={formData.regNo}
                    onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Symbol / Board Exam Roll No:</label>
                  <input
                    type="text"
                    value={formData.symbolNo}
                    onChange={(e) => setFormData({ ...formData, symbolNo: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Academic Session (शैक्षिक सत्र): *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      list="academic-sessions-list"
                      required
                      value={formData.academicYear || ''}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      placeholder="e.g. 2081 B.S."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                    />
                    <datalist id="academic-sessions-list">
                      {allAcademicYears.map((y) => (
                        <option key={y} value={y} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Admission Year (भर्ना वर्ष):</label>
                  <input
                    type="text"
                    value={formData.admissionYear || ''}
                    onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                    placeholder="e.g. 2079 B.S."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Phone:</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+977-9800000000"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date of Birth (AD):</label>
                  <input
                    type="date"
                    value={formData.dateOfBirthAD}
                    onChange={(e) => setFormData({ ...formData, dateOfBirthAD: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date of Birth (BS / Secondary):</label>
                  <input
                    type="text"
                    value={formData.dateOfBirthBS}
                    onChange={(e) => setFormData({ ...formData, dateOfBirthBS: e.target.value })}
                    placeholder="2063/05/14 B.S."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Father's Full Name:</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mother's Full Name:</label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Residential Address:</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Passed Class / Level:</label>
                  <input
                    type="text"
                    value={formData.passedClass}
                    onChange={(e) => setFormData({ ...formData, passedClass: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Result / GPA / Division:</label>
                  <input
                    type="text"
                    value={formData.divisionOrGpa}
                    onChange={(e) => setFormData({ ...formData, divisionOrGpa: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>

              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  {editingStudent ? 'Update Student Record' : 'Save Student Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
