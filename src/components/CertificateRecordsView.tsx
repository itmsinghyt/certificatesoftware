import React, { useState } from 'react';
import { Certificate, CertificateType, SchoolProfile, Student } from '../types';
import {
  Search,
  Eye,
  Printer,
  Trash2,
  FileBadge2,
  FileCheck2,
  Plus,
  Download,
  AlertCircle,
  CheckSquare,
  Square,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { getAllAcademicYears } from '../utils/academicYear';

interface CertificateRecordsViewProps {
  certificates: Certificate[];
  students: Student[];
  school: SchoolProfile;
  onPreview: (cert: Certificate) => void;
  onPrint: (cert: Certificate) => void;
  onPrintBatch: (selectedCerts: Certificate[]) => void;
  onDelete: (certId: string) => void;
  onNewCertificate: () => void;
  initialYear?: string;
  onYearChange?: (year: string) => void;
}

export const CertificateRecordsView: React.FC<CertificateRecordsViewProps> = ({
  certificates,
  students,
  school,
  onPreview,
  onPrint,
  onPrintBatch,
  onDelete,
  onNewCertificate,
  initialYear = 'all',
  onYearChange,
}) => {
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | CertificateType>('all');
  const [yearFilter, setYearFilter] = useState<string>(initialYear);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  React.useEffect(() => {
    if (initialYear !== undefined) {
      setYearFilter(initialYear);
    }
  }, [initialYear]);

  const allAcademicYears = getAllAcademicYears(school, students, certificates);

  const getStudent = (studentId: string) => {
    return students.find((s) => s.id === studentId);
  };

  const filteredCertificates = certificates.filter((cert) => {
    if (typeFilter !== 'all' && cert.certType !== typeFilter) return false;
    if (yearFilter !== 'all' && cert.academicYear !== yearFilter) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const std = getStudent(cert.studentId);
      const matchCertNo = cert.certNo.toLowerCase().includes(q);
      const matchDispatch = cert.dispatchNo.toLowerCase().includes(q);
      const matchStd = std?.fullName.toLowerCase().includes(q) || false;
      const matchReg = std?.regNo.toLowerCase().includes(q) || false;
      const matchSymbol = std?.symbolNo.toLowerCase().includes(q) || false;
      const matchYear = cert.academicYear?.toLowerCase().includes(q) || false;
      return matchCertNo || matchDispatch || matchStd || matchReg || matchSymbol || matchYear;
    }

    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCertificates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCertificates.map((c) => c.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const selectedCertificates = certificates.filter((c) => selectedIds.includes(c.id));

  const handleTriggerBatchPrint = () => {
    if (selectedCertificates.length === 0) {
      alert('Please select at least one certificate to print.');
      return;
    }
    onPrintBatch(selectedCertificates);
  };

  const handleExportCSV = () => {
    const headers = [
      'Certificate No',
      'Dispatch No',
      'Certificate Type',
      'Academic Session',
      'Student Name',
      'Registration No',
      'Symbol No',
      'Class Passed',
      'GPA/Division',
      'Issue Date',
      'Orientation',
      'Print Count'
    ];

    const rows = filteredCertificates.map(c => {
      const s = getStudent(c.studentId);
      return [
        `"${c.certNo}"`,
        `"${c.dispatchNo}"`,
        `"${c.certType === 'character' ? 'Character' : c.certType === 'transfer' ? 'Transfer' : 'Transfer_Character'}"`,
        `"${c.academicYear || ''}"`,
        `"${s?.fullName || ''}"`,
        `"${s?.regNo || ''}"`,
        `"${s?.symbolNo || ''}"`,
        `"${c.passedClass}"`,
        `"${c.divisionOrGpa}"`,
        `"${c.issueDateAD}"`,
        `"${c.orientation || 'portrait'}"`,
        c.printCount
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const suffix = yearFilter !== 'all' ? `_${yearFilter.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
    link.download = `Certificates_Registry${suffix}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isAllFilteredSelected = filteredCertificates.length > 0 && selectedIds.length === filteredCertificates.length;

  return (
    <div className="space-y-4">
      
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Issued Certificates Archive (जारी प्रमाणपत्रहरूको अभिलेख)
          </h2>
          <p className="text-xs text-slate-500">
            Master register of all issued credentials · Select specific certificates to print
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Batch Print Button - Prominent! */}
          <button
            onClick={handleTriggerBatchPrint}
            disabled={selectedIds.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer ${
              selectedIds.length > 0
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 animate-pulse'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print Selected ({selectedIds.length})</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNewCertificate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Certificate</span>
          </button>
        </div>
      </div>

      {/* Selection Control Banner (Shows when certificates are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2 font-semibold text-amber-950">
            <CheckSquare className="w-4 h-4 text-amber-700" />
            <span>
              {selectedIds.length} of {filteredCertificates.length} certificate{selectedIds.length === 1 ? '' : 's'} selected for printing (Select गरेको मात्र Print हुनेछ).
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerBatchPrint}
              className="px-3.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Proceed to Print ({selectedIds.length})</span>
            </button>

            <button
              onClick={handleDeselectAll}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Filter, Search, and Selection Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5 text-xs">
        
        {/* Row 1: Multi-Year Session Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100">
          <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>शैक्षिक सत्र:</span>
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
            सबै वर्ष ({certificates.length})
          </button>

          {allAcademicYears.map((yr) => {
            const count = certificates.filter((c) => c.academicYear === yr).length;
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

        {/* Row 2: Type Filters & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Interactive Segmented Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg flex-wrap">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types ({filteredCertificates.length})
            </button>

            <button
              onClick={() => setTypeFilter('character')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                typeFilter === 'character'
                  ? 'bg-white text-amber-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileBadge2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Character ({certificates.filter((c) => c.certType === 'character' && (yearFilter === 'all' || c.academicYear === yearFilter)).length})</span>
            </button>

            <button
              onClick={() => setTypeFilter('transfer')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                typeFilter === 'transfer'
                  ? 'bg-white text-blue-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Transfer / TC ({certificates.filter((c) => c.certType === 'transfer' && (yearFilter === 'all' || c.academicYear === yearFilter)).length})</span>
            </button>

            <button
              onClick={() => setTypeFilter('transfer_character')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                typeFilter === 'transfer_character'
                  ? 'bg-white text-rose-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Transfer/Character ({certificates.filter((c) => c.certType === 'transfer_character' && (yearFilter === 'all' || c.academicYear === yearFilter)).length})</span>
            </button>
          </div>

          {/* Selection & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium cursor-pointer"
            >
              {isAllFilteredSelected ? <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isAllFilteredSelected ? 'Deselect All' : 'Select All Filtered'}</span>
            </button>

            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, cert no or dispatch..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Certificates Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredCertificates.length === 0 ? (
          <div className="p-10 text-center">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No certificates found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or create a new certificate.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-4 py-2.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllFilteredSelected}
                      onChange={handleSelectAll}
                      title="Select / Deselect all"
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-2.5">Certificate & Dispatch No</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Academic Session</th>
                  <th className="px-4 py-2.5">Student Name</th>
                  <th className="px-4 py-2.5">Reg & Symbol No</th>
                  <th className="px-4 py-2.5">Class / GPA</th>
                  <th className="px-4 py-2.5">Issue Date</th>
                  <th className="px-4 py-2.5">Orientation</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCertificates.map((cert) => {
                  const student = getStudent(cert.studentId);
                  const isChar = cert.certType === 'character';
                  const isSelected = selectedIds.includes(cert.id);

                  return (
                    <tr
                      key={cert.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-amber-50/60 font-medium' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(cert.id)}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-slate-900 block">{cert.certNo}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Dispatch: {cert.dispatchNo}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isChar ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {isChar ? 'Character' : 'Transfer'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] whitespace-nowrap">
                          {cert.academicYear || '-'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block text-sm">
                          {student?.fullName || 'Student'}
                        </span>
                        <span className="text-slate-500 text-[11px] font-mono">{student?.phone || 'No phone'}</span>
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-700">
                        <span className="block">{student?.regNo || '-'}</span>
                        <span className="text-[10px] text-slate-400">Symbol: {student?.symbolNo || '-'}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800 block">{cert.passedClass}</span>
                        <span className="text-slate-600 text-[11px] font-mono">{cert.divisionOrGpa}</span>
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        <span className="font-mono block">{cert.issueDateAD}</span>
                        {cert.issueDateBS && <span className="text-[10px] text-slate-400 font-mono">{cert.issueDateBS}</span>}
                      </td>

                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px] capitalize">
                        {cert.orientation || 'portrait'}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onPreview(cert)}
                            title="Preview Certificate"
                            className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onPrint(cert)}
                            title="Print this Certificate"
                            className="flex items-center gap-1 px-2.5 py-1 text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-md font-semibold transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-700" />
                            <span>Print</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete certificate ${cert.certNo}?`)) {
                                onDelete(cert.id);
                              }
                            }}
                            title="Delete"
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
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
