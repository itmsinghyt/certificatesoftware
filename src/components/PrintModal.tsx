import React, { useState } from 'react';
import { Certificate, CertificateOrientation, CertificateTemplateConfig, SchoolProfile, Student } from '../types';
import { CertificateTemplate } from './CertificateTemplate';
import { CERTIFICATE_TEMPLATES } from '../data/templatesData';
import { Printer, X, ZoomIn, ZoomOut, Layout } from 'lucide-react';

interface PrintModalProps {
  certificate: Certificate;
  student: Student;
  school: SchoolProfile;
  customTemplates?: CertificateTemplateConfig[];
  isOpen: boolean;
  onClose: () => void;
  onPrinted: (certId: string) => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  certificate,
  student,
  school,
  customTemplates = [],
  isOpen,
  onClose,
  onPrinted,
}) => {
  const [zoom, setZoom] = useState<number>(90);
  const [activeOrientation, setActiveOrientation] = useState<CertificateOrientation>(
    certificate.orientation || 'portrait'
  );
  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    certificate.templateId || 'tpl-classic-gold'
  );

  const allAvailableTemplates = [...customTemplates, ...CERTIFICATE_TEMPLATES];

  if (!isOpen) return null;

  const currentCertificate: Certificate = {
    ...certificate,
    templateId: activeTemplateId,
    orientation: activeOrientation,
  };

  const handlePrint = () => {
    // Add dynamic orientation class for printer
    document.body.classList.remove('print-mode-portrait', 'print-mode-landscape');
    document.body.classList.add(
      activeOrientation === 'landscape' ? 'print-mode-landscape' : 'print-mode-portrait'
    );

    onPrinted(certificate.id);
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex flex-col">
      
      {/* Top Modal Controls Bar (Hidden during actual print) */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 no-print">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-sm">
            <span>Certificate Print Preview</span>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            {certificate.certNo}
          </span>
        </div>

        {/* Quick Style & Orientation Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          {/* Orientation Toggle */}
          <div className="flex items-center p-1 bg-slate-800 rounded-lg">
            <button
              onClick={() => setActiveOrientation('portrait')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeOrientation === 'portrait' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5 rotate-90" />
              <span>Portrait</span>
            </button>
            <button
              onClick={() => setActiveOrientation('landscape')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeOrientation === 'landscape' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Landscape</span>
            </button>
          </div>

          {/* Template Selector dropdown */}
          <select
            value={activeTemplateId}
            onChange={(e) => setActiveTemplateId(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {allAvailableTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.isCustomUploaded ? '★ ' : ''}{t.name} ({t.category})
              </option>
            ))}
          </select>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setZoom(Math.max(60, zoom - 10))}
              title="Zoom out"
              className="p-1 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(130, zoom + 10))}
              title="Zoom in"
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
            <span>Print Certificate Now</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Certificate Viewing Stage */}
      <div className="flex-1 p-2 sm:p-4 md:p-8 flex justify-center items-start overflow-y-auto overflow-x-auto touch-scroll overscroll-contain bg-slate-900/60 print:p-0 print:m-0 print:bg-white">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 print:transform-none"
        >
          <div className="print-only-container">
            <CertificateTemplate
              certificate={currentCertificate}
              student={student}
              school={school}
              previewMode={false}
              orientationOverride={activeOrientation}
              templateIdOverride={activeTemplateId}
              customTemplates={customTemplates}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
