import React, { useState, useRef } from 'react';
import {
  CertificateOrientation,
  CertificateTemplateConfig,
  SchoolProfile,
  Student
} from '../types';
import portraitCustomTemplateImage from '../assets/images/custom_cert_template_1791079176303.jpg';
import landscapeCustomTemplateImage from '../assets/images/custom_cert_landscape_1791079189709.jpg';
import {
  Upload,
  X,
  Check,
  Layout,
  Image as ImageIcon,
  Sliders,
  Eye,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Printer
} from 'lucide-react';

interface UploadTemplateModalProps {
  isOpen: boolean;
  school: SchoolProfile;
  sampleStudent?: Student;
  onClose: () => void;
  onSaveTemplate: (newTemplate: CertificateTemplateConfig) => void;
}

export const UploadTemplateModal: React.FC<UploadTemplateModalProps> = ({
  isOpen,
  school,
  sampleStudent,
  onClose,
  onSaveTemplate,
}) => {
  const [templateName, setTemplateName] = useState<string>('My Custom School Template');
  const [orientation, setOrientation] = useState<CertificateOrientation>('portrait');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(portraitCustomTemplateImage);
  const [fileName, setFileName] = useState<string>('official_border_sample.jpg');
  const [hideDefaultHeader, setHideDefaultHeader] = useState<boolean>(false);
  const [printBackground, setPrintBackground] = useState<boolean>(true);
  const [contentPaddingTop, setContentPaddingTop] = useState<number>(0);
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(1.0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const demoStudent = sampleStudent || {
    id: 'demo',
    regNo: 'JJSS-2024-001',
    symbolNo: '02801452K',
    fullName: 'Aaryan Shrestha',
    gender: 'Male' as const,
    dateOfBirthAD: '2006-08-30',
    dateOfBirthBS: '2063/05/14 B.S.',
    fatherName: 'Deepak Kumar Shrestha',
    motherName: 'Sushila Shrestha',
    address: 'Kathmandu, Nepal',
    phone: '',
    academicYear: '2023-2024',
    passedClass: 'Grade 10 (Secondary Education Examination - SEE)',
    divisionOrGpa: 'GPA 3.85 (A+)',
    characterRating: 'Exemplary' as const,
    admissionYear: '2018',
    duesCleared: 'Yes' as const,
    reasonForLeaving: 'For higher secondary studies',
    createdAt: '',
    updatedAt: '',
  };

  const handleFileProcess = (file: File) => {
    setErrorMsg('');
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, JPEG, WEBP, or SVG).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('File size too large. Please upload an image under 8 MB.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImagePreviewUrl(e.target.result);
        if (!templateName || templateName === 'My Custom School Template') {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          setTemplateName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      setErrorMsg('Please enter a name for your custom template.');
      return;
    }

    if (!imagePreviewUrl) {
      setErrorMsg('Please upload or select a template image.');
      return;
    }

    const newTemplateId = 'tpl-custom-' + Date.now();
    const newConfig: CertificateTemplateConfig = {
      id: newTemplateId,
      name: templateName.trim(),
      category: 'Uploaded Custom',
      description: `User-uploaded template for ${school.name} (${orientation})`,
      primaryColor: '#b48328',
      accentBorder: 'border-amber-800',
      outerBorderClass: 'border-slate-800 bg-[#fffdf9]',
      innerBorderClass: 'border-amber-800/60',
      bgClass: 'bg-white',
      cornerFlourish: '❖',
      badgeStyle: 'bg-amber-100/90 border-amber-800 text-amber-950 font-serif',
      fontFamilyTitle: 'font-cinzel',
      sealColor: 'border-red-700 text-red-800 bg-red-50/50',
      watermarkOpacity: 'opacity-[0.03]',
      isCustomUploaded: true,
      backgroundImageUrl: imagePreviewUrl,
      hideDefaultHeader,
      contentPaddingTop,
      printBackground,
      backgroundOpacity,
      createdAt: new Date().toISOString(),
    };

    onSaveTemplate(newConfig);
    onClose();
  };

  const isLandscape = orientation === 'landscape';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Custom Template Studio
                </span>
              </div>
              <h2 className="text-lg font-bold">Upload Custom Certificate Template</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split Left Configuration Form & Right Live Preview Canvas */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT COLUMN: Controls & Upload (5 Cols) */}
          <div className="lg:col-span-5 p-5 border-r border-slate-200 space-y-4 bg-slate-50/50 overflow-y-auto max-h-[78vh]">
            
            {/* 1. Upload Dropzone */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>1. Upload Template Image (JPG / PNG): *</span>
                <span className="text-[11px] text-slate-500 font-normal">Max 8MB</span>
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-amber-500 bg-amber-50/80 scale-[1.01]'
                    : 'border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Click to choose image or drag & drop here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports high-resolution scans, Canva/Photoshop exports, or border frames
                    </p>
                  </div>
                </div>

                {fileName && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-amber-900 font-medium">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate max-w-[200px]">{fileName}</span>
                  </div>
                )}
              </div>

              {/* Sample Presets Quick Buttons */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreviewUrl(portraitCustomTemplateImage);
                    setFileName('official_gold_frame.jpg');
                    setOrientation('portrait');
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-200 hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  Portrait Archival
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreviewUrl(landscapeCustomTemplateImage);
                    setFileName('royal_diploma_frame.jpg');
                    setOrientation('landscape');
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-200 hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  Landscape Diploma
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 2. Template Metadata */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  2. Template Name: *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. Shree Janajyoti Official SEE Border 2024"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Orientation Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  3. Canvas Orientation:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      !isLandscape
                        ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Layout className="w-3.5 h-3.5 rotate-90 text-amber-700" />
                    <span>Portrait (A4)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      isLandscape
                        ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Layout className="w-3.5 h-3.5 text-amber-700" />
                    <span>Landscape (A4)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Pre-Printed vs Full Print Modes */}
            <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
              <label className="block font-bold text-slate-800">
                4. Printing Behavior & Pre-Printed Stationery:
              </label>

              <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printBackground}
                    onChange={(e) => setPrintBackground(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Print Template Background Image</span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      {printBackground
                        ? 'Background image and borders will be printed along with student text on white paper.'
                        : 'Pre-printed mode: Background is shown on screen for alignment, but hidden during printer output to print directly on physical pre-printed certificates.'}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-slate-100">
                  <input
                    type="checkbox"
                    checked={hideDefaultHeader}
                    onChange={(e) => setHideDefaultHeader(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Hide Default School Header & Emblem</span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      Check this if your uploaded template already includes the printed school name, motto, and logo at the top.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* 4. Fine-Tuning Sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-600" />
                  <span>5. Fine-Tuning & Alignment:</span>
                </label>
              </div>

              {/* Background Opacity */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Background Opacity:</span>
                  <span className="font-mono font-bold text-amber-800">{Math.round(backgroundOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={backgroundOpacity}
                  onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Top Padding Offset */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Text Vertical Offset:</span>
                  <span className="font-mono font-bold text-amber-800">{contentPaddingTop} px</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="120"
                  step="5"
                  value={contentPaddingTop}
                  onChange={(e) => setContentPaddingTop(parseInt(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">
                  Adjust to align certificate text precisely with physical pre-printed lines or frames.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Real-Time Live Preview Canvas (7 Cols) */}
          <div className="lg:col-span-7 p-5 bg-slate-200/70 flex flex-col justify-between overflow-y-auto max-h-[78vh]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-800">
                    Live Canvas Overlay Preview ({orientation.toUpperCase()})
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-300">
                  Real Student Data Preview
                </span>
              </div>

              {/* Live Canvas Mockup */}
              <div className="flex items-center justify-center p-2 bg-slate-300/40 rounded-xl border border-slate-300/80 overflow-hidden">
                <div
                  className={`relative bg-white shadow-xl rounded-xs overflow-hidden transition-all duration-300 ${
                    isLandscape ? 'w-full max-w-[580px] aspect-[1.414/1]' : 'w-[400px] aspect-[1/1.38]'
                  }`}
                  style={{
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Uploaded Background Image Layer */}
                  {imagePreviewUrl && (
                    <div
                      className="absolute inset-0 pointer-events-none z-0"
                      style={{
                        backgroundImage: `url(${imagePreviewUrl})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: backgroundOpacity,
                      }}
                    />
                  )}

                  {/* Pre-printed stationery overlay watermark tag (preview only) */}
                  {!printBackground && (
                    <div className="absolute top-2 right-2 z-20 bg-amber-500/90 text-slate-950 font-bold text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
                      Pre-Printed Paper Mode (Background won't print)
                    </div>
                  )}

                  {/* Overlay Certificate Content */}
                  <div
                    className="relative z-10 w-full h-full p-4 flex flex-col justify-between text-slate-900"
                    style={{
                      paddingTop: `${Math.max(12, 16 + contentPaddingTop * 0.4)}px`,
                    }}
                  >
                    {/* Top School Header */}
                    {!hideDefaultHeader ? (
                      <div>
                        <div className="flex items-center justify-between text-[7px] text-slate-600 pb-0.5 border-b border-slate-300/80">
                          <span className="font-mono">DISPATCH: 142/2024</span>
                          <span className="font-mono font-bold">CERT NO: CC-2024-0088</span>
                        </div>

                        <div className="pt-1 flex items-center justify-center gap-2">
                          <img
                            src={school.logoUrl}
                            alt=""
                            className="w-7 h-7 object-contain drop-shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-center">
                            <p className="text-[7px] text-slate-600 font-semibold uppercase">{school.affiliation}</p>
                            <h3 className="text-[10px] font-bold font-serif uppercase tracking-wider text-slate-900 leading-tight">
                              {school.name}
                            </h3>
                            <p className="text-[7px] text-slate-600">{school.address}</p>
                          </div>
                        </div>

                        <div className="text-center my-1">
                          <span className="inline-block px-3 py-0.5 bg-amber-100/90 border border-amber-800 text-[7px] font-bold uppercase tracking-wider rounded-xs text-amber-950 font-serif">
                            CHARACTER CERTIFICATE
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-10 flex items-center justify-center border border-dashed border-amber-400/60 bg-amber-50/40 rounded text-[8px] text-amber-900 font-semibold mb-1">
                        [Header reserved for your pre-printed school banner]
                      </div>
                    )}

                    {/* Student Identification Banner */}
                    <div className="my-1 p-1 bg-slate-50/80 border border-slate-200 rounded grid grid-cols-4 gap-1 text-[7px]">
                      <div><span className="text-slate-500 block">Reg:</span><strong className="font-mono">{demoStudent.regNo}</strong></div>
                      <div><span className="text-slate-500 block">Roll:</span><strong className="font-mono">{demoStudent.symbolNo}</strong></div>
                      <div><span className="text-slate-500 block">Session:</span><strong>{demoStudent.academicYear}</strong></div>
                      <div><span className="text-slate-500 block">Result:</span><strong>{demoStudent.divisionOrGpa}</strong></div>
                    </div>

                    {/* Body Paragraph */}
                    <div className="text-[7.5px] leading-relaxed text-slate-800 text-justify space-y-1">
                      <p>
                        This is to certify that Mr. <span className="font-bold underline text-slate-950">{demoStudent.fullName}</span>, son of Mr. <span className="font-semibold underline">{demoStudent.fatherName}</span> and Mrs. <span className="font-semibold underline">{demoStudent.motherName}</span>, resident of <span className="font-medium underline">{demoStudent.address}</span>, was a regular student of this institution. He has passed <span className="font-bold">{demoStudent.passedClass}</span> securing <span className="font-bold">{demoStudent.divisionOrGpa}</span>.
                      </p>
                      <div className="p-1 bg-amber-50/60 border-l-2 border-amber-700 text-[7px] text-slate-800">
                        Conduct: <strong className="text-slate-950">{demoStudent.characterRating}</strong> · Moral character & academic discipline verified.
                      </div>
                    </div>

                    {/* Signatures Row */}
                    <div className="pt-2 border-t border-slate-300 grid grid-cols-4 gap-1 text-center items-end text-[6.5px]">
                      <div>
                        <div className="border-b border-dashed border-slate-400 pb-0.5 italic text-slate-700 font-serif">
                          {school.preparedByName}
                        </div>
                        <span className="text-slate-400 block">Prepared By</span>
                      </div>
                      <div>
                        <div className="border-b border-dashed border-slate-400 pb-0.5 italic text-slate-700 font-serif">
                          {school.accountantName}
                        </div>
                        <span className="text-slate-400 block">Verified By</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full border border-dashed border-red-700 flex items-center justify-center text-[5px] text-red-700 font-bold">
                          SEAL
                        </div>
                        <span className="text-slate-400 block text-[6px]">Official Seal</span>
                      </div>
                      <div>
                        <div className="border-b-2 border-slate-900 pb-0.5 font-bold font-serif text-slate-900">
                          {school.principalName}
                        </div>
                        <span className="text-slate-500 font-semibold block">{school.principalDesignation}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Help Note */}
            <div className="mt-3 p-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-600 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-semibold text-slate-900">Live Canvas Ready:</span> Your uploaded template will be saved to your local software library and can be chosen whenever you issue or print Character & Transfer Certificates!
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save & Use Template</span>
          </button>
        </div>

      </div>
    </div>
  );
};
