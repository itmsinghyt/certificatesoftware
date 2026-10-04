import React, { useState } from 'react';
import { Certificate, CertificateOrientation, CertificateTemplateConfig, SchoolProfile, Student } from '../types';
import { CertificateTemplate } from './CertificateTemplate';
import { CERTIFICATE_TEMPLATES } from '../data/templatesData';
import { Printer, X, ZoomIn, ZoomOut, Layout, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface BatchPrintModalProps {
  selectedCertificates: Certificate[];
  students: Student[];
  school: SchoolProfile;
  customTemplates?: CertificateTemplateConfig[];
  isOpen: boolean;
  onClose: () => void;
  onPrinted: (certIds: string[]) => void;
}

export const BatchPrintModal: React.FC<BatchPrintModalProps> = ({
  selectedCertificates,
  students,
  school,
  customTemplates = [],
  isOpen,
  onClose,
  onPrinted,
}) => {
  const [zoom, setZoom] = useState<number>(85);
  const [activeOrientation, setActiveOrientation] = useState<CertificateOrientation>(
    selectedCertificates[0]?.orientation || 'portrait'
  );
  const [activeTemplateOverride, setActiveTemplateOverride] = useState<string>('');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('all');

  const allAvailableTemplates = [...customTemplates, ...CERTIFICATE_TEMPLATES];

  if (!isOpen || selectedCertificates.length === 0) return null;

  const getStudent = (studentId: string) => {
    return students.find((s) => s.id === studentId) || {
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
    };
  };

  const handlePrint = () => {
    // Add print orientation class to body dynamically
    document.body.classList.remove('print-mode-portrait', 'print-mode-landscape');
    document.body.classList.add(
      activeOrientation === 'landscape' ? 'print-mode-landscape' : 'print-mode-portrait'
    );

    onPrinted(selectedCertificates.map((c) => c.id));
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex flex-col">
      
      {/* Top Modal Controls Header (Hidden during browser printing) */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 no-print">
        
        {/* Selection Count Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Batch Print Preview (छानिएका प्रमाणपत्रहरू मात्र)</span>
          </div>

          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-full font-mono">
            {selectedCertificates.length} Certificate{selectedCertificates.length === 1 ? '' : 's'} Selected
          </span>
        </div>

        {/* Center Controls: Orientation + Template override + Zoom */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          
          {/* Orientation Toggle */}
          <div className="flex items-center p-1 bg-slate-800 rounded-lg">
            <button
              onClick={() => setActiveOrientation('portrait')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeOrientation === 'portrait' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5 rotate-90" />
              <span>Portrait</span>
            </button>
            <button
              onClick={() => setActiveOrientation('landscape')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeOrientation === 'landscape' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Landscape</span>
            </button>
          </div>

          {/* Template Selector dropdown */}
          <select
            value={activeTemplateOverride}
            onChange={(e) => setActiveTemplateOverride(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">Keep Original Templates</option>
            {allAvailableTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                Apply to All: {t.isCustomUploaded ? '★ ' : ''}{t.name}
              </option>
            ))}
          </select>

          {/* View mode toggle */}
          <div className="hidden sm:flex items-center p-1 bg-slate-800 rounded-lg text-[11px]">
            <button
              onClick={() => setViewMode('all')}
              className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                viewMode === 'all' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Show All ({selectedCertificates.length})
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                viewMode === 'single' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Page by Page
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(130, zoom + 10))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Selected ({selectedCertificates.length})</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Single-Page Paging Toolbar if Single View Mode is on */}
      {viewMode === 'single' && selectedCertificates.length > 1 && (
        <div className="bg-slate-950 border-b border-slate-800 text-slate-300 px-4 py-2 flex items-center justify-center gap-4 text-xs no-print">
          <button
            onClick={() => setActivePageIndex(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono">
            Certificate {activePageIndex + 1} of {selectedCertificates.length}
          </span>
          <button
            onClick={() => setActivePageIndex(Math.min(selectedCertificates.length - 1, activePageIndex + 1))}
            disabled={activePageIndex === selectedCertificates.length - 1}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Print Stage Container */}
      <div className="flex-1 p-2 sm:p-4 md:p-8 flex flex-col items-center justify-start overflow-y-auto overflow-x-auto touch-scroll overscroll-contain bg-slate-900/60 print:p-0 print:m-0 print:bg-white space-y-8 print:space-y-0">
        
        {/* If user is previewing 'single' in UI, show that index; during print, ALWAYS render all selected certificates! */}
        {selectedCertificates.map((cert, index) => {
          const student = getStudent(cert.studentId);
          const isHiddenInUIPreview = viewMode === 'single' && index !== activePageIndex;

          return (
            <div
              key={cert.id}
              className={`batch-print-item w-full flex justify-center ${
                isHiddenInUIPreview ? 'hidden print:block' : 'block'
              }`}
            >
              <div
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                className="transition-transform duration-150 print:transform-none w-full flex justify-center"
              >
                <div className="print-only-container">
                  <CertificateTemplate
                    certificate={cert}
                    student={student}
                    school={school}
                    previewMode={false}
                    orientationOverride={activeOrientation}
                    templateIdOverride={activeTemplateOverride || cert.templateId}
                    customTemplates={customTemplates}
                  />
                </div>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
};
