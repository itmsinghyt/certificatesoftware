import React, { useState } from 'react';
import {
  Certificate,
  CertificateOrientation,
  CertificateTemplateConfig,
  SchoolProfile,
  Student,
  TemplateCategory
} from '../types';
import { CERTIFICATE_TEMPLATES } from '../data/templatesData';
import chandrodayaCrestImg from '../assets/images/chandrodaya_crest_1791080040741.jpg';
import studentPassportPhotoImg from '../assets/images/student_passport_photo_1791080054706.jpg';
import {
  Sparkles,
  Layout,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  Search,
  Grid,
  List,
  Check,
  Award,
  Layers,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';

interface TemplateGalleryViewProps {
  school: SchoolProfile;
  students: Student[];
  customTemplates?: CertificateTemplateConfig[];
  onSelectTemplate: (templateId: string, orientation: CertificateOrientation) => void;
  onPreviewTemplate: (cert: Certificate) => void;
  onOpenUploadModal: () => void;
  onDeleteCustomTemplate?: (id: string) => void;
}

export const TemplateGalleryView: React.FC<TemplateGalleryViewProps> = ({
  school,
  students,
  customTemplates = [],
  onSelectTemplate,
  onPreviewTemplate,
  onOpenUploadModal,
  onDeleteCustomTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrientation, setSelectedOrientation] = useState<CertificateOrientation>('portrait');
  const [previewCertType, setPreviewCertType] = useState<'character' | 'transfer'>('character');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  const allAvailableTemplates = [...customTemplates, ...CERTIFICATE_TEMPLATES];

  const demoStudent = students[0] || {
    id: 'demo-student',
    regNo: 'JJSS-2024-001',
    symbolNo: '02801452K',
    fullName: 'Aaryan Shrestha',
    gender: 'Male' as const,
    dateOfBirthAD: '2006-08-30',
    dateOfBirthBS: '2063/05/14 B.S.',
    fatherName: 'Deepak Kumar Shrestha',
    motherName: 'Sushila Shrestha',
    address: 'Kathmandu, Nepal',
    phone: '+977-9841238990',
    academicYear: '2023-2024',
    passedClass: 'Grade 10 (SEE)',
    divisionOrGpa: 'GPA 3.85 (A+)',
    characterRating: 'Exemplary' as const,
    admissionYear: '2018',
    duesCleared: 'Yes' as const,
    reasonForLeaving: 'For higher secondary studies',
    createdAt: '',
    updatedAt: '',
  };

  const categories: ('All' | TemplateCategory)[] = [
    'All',
    'Government Official',
    'Uploaded Custom',
    'Traditional',
    'Collegiate',
    'Modern',
    'Vintage',
    'Executive',
    'Minimalist',
  ];

  const categoryLabels: Record<string, { label: string; badge?: string }> = {
    'All': { label: 'All Templates' },
    'Government Official': { label: 'Govt Official', badge: 'Official' },
    'Uploaded Custom': { label: 'Uploaded Custom', badge: 'Custom' },
    'Traditional': { label: 'Traditional' },
    'Collegiate': { label: 'Collegiate' },
    'Modern': { label: 'Modern' },
    'Vintage': { label: 'Vintage' },
    'Executive': { label: 'Executive' },
    'Minimalist': { label: 'Minimalist' },
  };

  const filteredTemplates = allAvailableTemplates.filter((tpl) => {
    if (selectedCategory !== 'All' && tpl.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tpl.name.toLowerCase().includes(q);
      const matchCat = tpl.category.toLowerCase().includes(q);
      const matchDesc = tpl.description.toLowerCase().includes(q);
      return matchName || matchCat || matchDesc;
    }
    return true;
  });

  const createDummyCertForTemplate = (tplId: string): Certificate => {
    return {
      id: 'demo-cert-' + tplId,
      certNo: previewCertType === 'character' ? 'CC-2024-0088' : 'TC-2024-0045',
      dispatchNo: '142/2024',
      studentId: demoStudent.id,
      certType: previewCertType,
      issueDateAD: '2024-07-12',
      issueDateBS: '2081/03/28 B.S.',
      academicYear: '2023-2024',
      templateId: tplId,
      orientation: selectedOrientation,
      characterRating: 'Exemplary',
      divisionOrGpa: 'GPA 3.85 (A+)',
      passedClass: 'Grade 10 (Secondary Education Examination - SEE)',
      reasonForLeaving: 'For higher secondary (+2) education',
      duesCleared: 'Yes',
      preparedBy: school.preparedByName,
      verifiedBy: school.accountantName,
      headmaster: school.principalName,
      headmasterDesignation: school.principalDesignation,
      createdAt: new Date().toISOString(),
      printCount: 1,
    };
  };

  const isLandscape = selectedOrientation === 'landscape';

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Official Academic Templates & Custom Upload Collection</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Certificate Template Gallery
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Choose from ready-to-use official academic designs or upload your institution's custom certificate scan/press stationery. All templates adapt between Portrait and Landscape.
          </p>
        </div>

        {/* Global Orientation & Type Controls + Upload Button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          
          {/* Upload Custom Template CTA Button */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Upload className="w-4 h-4 text-slate-950" />
            <span>Upload Custom Template</span>
          </button>

          {/* Orientation Toggle */}
          <div className="flex items-center p-1 bg-slate-800/90 border border-slate-700 rounded-xl text-xs">
            <button
              onClick={() => setSelectedOrientation('portrait')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                !isLandscape
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5 rotate-90" />
              <span>Portrait</span>
            </button>

            <button
              onClick={() => setSelectedOrientation('landscape')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                isLandscape
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Landscape</span>
            </button>
          </div>

          {/* Certificate Type Switcher */}
          <div className="flex items-center p-1 bg-slate-800/90 border border-slate-700 rounded-xl text-xs">
            <button
              onClick={() => setPreviewCertType('character')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                previewCertType === 'character'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Character
            </button>
            <button
              onClick={() => setPreviewCertType('transfer')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                previewCertType === 'transfer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Transfer (TC)
            </button>
          </div>

        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        
        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by name, theme or category..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-400 font-semibold px-1 flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => {
            const count = cat === 'All'
              ? allAvailableTemplates.length
              : allAvailableTemplates.filter((t) => t.category === cat).length;
            const isActive = selectedCategory === cat;
            const labelText = categoryLabels[cat]?.label || cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap text-xs flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{labelText}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Toggle (Grid vs List) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setViewLayout('grid')}
            title="Grid View"
            className={`p-1.5 rounded-md cursor-pointer transition-colors ${
              viewLayout === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewLayout('list')}
            title="Compact List View"
            className={`p-1.5 rounded-md cursor-pointer transition-colors ${
              viewLayout === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 3. Main Templates Display */}
      {viewLayout === 'grid' ? (
        
        /* GRID VIEW: Distinctive, clean, perfectly scaled certificate cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Hero Upload Card (Shown on All or Uploaded Custom category) */}
          {(selectedCategory === 'All' || selectedCategory === 'Uploaded Custom') && (
            <div
              onClick={onOpenUploadModal}
              className="border-2 border-dashed border-amber-400/80 hover:border-amber-500 bg-amber-50/30 hover:bg-amber-50/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xs hover:shadow-md group min-h-[360px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                Upload Custom Template
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
                Import scanned certificate paper, pre-printed stationery, or custom Canva/Photoshop border design.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-white px-3 py-1.5 rounded-lg border border-amber-300 shadow-2xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New File (PNG / JPG)</span>
              </div>
            </div>
          )}

          {filteredTemplates.map((template, idx) => {
            const sampleCert = createDummyCertForTemplate(template.id);
            const isCurrentDefault = school.defaultTemplateId === template.id;
            const isUserUploaded = template.id.startsWith('tpl-custom-');

            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                {/* Top Card Info Bar */}
                <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                        {template.name}
                      </h3>
                      {isCurrentDefault && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {template.description}
                    </p>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                    template.id === 'tpl-chandrodaya-official'
                      ? 'bg-rose-100 text-rose-950 font-bold border border-rose-300'
                      : template.isCustomUploaded
                      ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {template.id === 'tpl-chandrodaya-official' ? '★ Official Model' : template.category}
                  </span>
                </div>

                {/* Pixel-Perfect Certificate Thumbnail Canvas */}
                <div className="bg-slate-100/60 p-4 flex items-center justify-center min-h-[290px] overflow-hidden">
                  
                  {/* Miniature Authentic Mockup Container */}
                  <div
                    onClick={() => onPreviewTemplate(sampleCert)}
                    className={`cursor-pointer transition-transform duration-200 group-hover:scale-[1.02] ${
                      isLandscape ? 'w-full max-w-[340px] aspect-[1.414/1]' : 'w-[230px] aspect-[1/1.38]'
                    } ${template.outerBorderClass} border-2 ${template.accentBorder} p-2 flex flex-col justify-between shadow-sm relative rounded-xs overflow-hidden`}
                  >
                    {/* Background image preview if custom uploaded */}
                    {template.isCustomUploaded && template.backgroundImageUrl && (
                      <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                          backgroundImage: `url(${template.backgroundImageUrl})`,
                          backgroundSize: '100% 100%',
                          backgroundPosition: 'center',
                          opacity: template.backgroundOpacity ?? 0.95,
                        }}
                      />
                    )}

                    {/* Corner Flourishes in mini (only if not custom uploaded) */}
                    {!template.isCustomUploaded && (
                      <>
                        <div className="absolute top-1 left-1 text-[8px] opacity-60">{template.cornerFlourish}</div>
                        <div className="absolute top-1 right-1 text-[8px] opacity-60">{template.cornerFlourish}</div>
                        <div className="absolute bottom-1 left-1 text-[8px] opacity-60">{template.cornerFlourish}</div>
                        <div className="absolute bottom-1 right-1 text-[8px] opacity-60">{template.cornerFlourish}</div>
                      </>
                    )}

                    {/* Inner Decorative Pinstripe Frame */}
                    {template.id === 'tpl-chandrodaya-official' ? (
                      <div className="relative z-10 w-full h-full p-2 bg-white flex flex-col justify-between text-slate-950 font-serif border border-black">
                        {/* Mini Top Section */}
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <img
                              src={chandrodayaCrestImg}
                              alt=""
                              className="w-5 h-5 object-contain shrink-0"
                            />
                            <div className="flex-1 text-center leading-tight px-0.5">
                              <p className="text-[7.5px] font-bold uppercase tracking-tight text-slate-950 leading-none">
                                SHREE CHANDRODAYA SEC. SCHOOL
                              </p>
                              <p className="text-[5.5px] text-slate-700 leading-none mt-0.5">
                                Kedarsyun-6, Bhadasain, Bajhang
                              </p>
                              <p className="text-[5px] font-semibold text-slate-600 leading-none">
                                Sudurpaschim Province · Estd. 2021
                              </p>
                            </div>
                            <div className="w-5 h-6 border border-black p-0.5 bg-white shrink-0 overflow-hidden">
                              <img
                                src={studentPassportPhotoImg}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          {/* S.No, Reg No, Symbol No Row */}
                          <div className="flex justify-between items-center text-[5.5px] font-mono font-bold mt-1 text-slate-950 border-t border-slate-200 pt-0.5">
                            <div>
                              <span>S.No: 8296 · Reg: 807680080021</span>
                            </div>
                            <div>
                              <span>Date: 2083/06/16</span>
                            </div>
                          </div>

                          {/* Solid Red Title Ribbon */}
                          <div className="bg-[#dc2626] text-white text-center py-0.5 my-1 shadow-2xs">
                            <p className="text-[6.5px] font-bold uppercase tracking-wider leading-none">
                              TRANSFER/CHARACTER CERTIFICATE
                            </p>
                          </div>
                        </div>

                        {/* Mini Body Placeholder */}
                        <div className="px-0.5 text-[6.5px] text-slate-800 leading-tight space-y-0.5 text-justify font-serif">
                          <p className="line-clamp-3">
                            This is to certify that Mr. <span className="font-bold underline text-black">Janak Bohara</span> Son of Mr. <span className="font-bold underline text-black">Madan Bahadur Bohara</span> passed the <span className="font-bold">SEE (Grade -10)</span> held in 2081 B.S. with <span className="font-bold">2.54 GPA</span>. He has good moral character.
                          </p>
                        </div>

                        {/* Mini Signatures Row */}
                        <div className="pt-1 border-t border-slate-200 grid grid-cols-3 gap-0.5 items-end text-center text-[5.5px]">
                          <div>
                            <p className="font-mono text-slate-500 text-[5px]">.......</p>
                            <span className="text-slate-800 block text-[5px]">written by</span>
                          </div>
                          <div>
                            <p className="font-mono text-slate-500 text-[5px]">.......</p>
                            <span className="text-slate-800 block text-[5px]">Checked By</span>
                          </div>
                          <div>
                            <p className="font-mono text-slate-500 text-[5px]">.......</p>
                            <span className="font-bold text-slate-950 block text-[5px]">Head Master</span>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className={`relative z-10 w-full h-full p-2 ${
                        template.isCustomUploaded
                          ? 'bg-transparent border border-transparent'
                          : `border border-dashed ${template.accentBorder} ${template.innerBorderClass} bg-white/95`
                      } flex flex-col justify-between text-center`}>
                      
                      {/* Mini Header */}
                      <div>
                        <div className="flex items-center justify-between text-[7px] text-slate-500 pb-0.5 border-b border-slate-200">
                          <span className="font-mono">NO: {sampleCert.certNo}</span>
                          <span className="font-mono">{sampleCert.issueDateAD}</span>
                        </div>

                        {!template.hideDefaultHeader && (
                          <div className="pt-1.5 flex items-center justify-center gap-1.5">
                            <img
                              src={school.logoUrl}
                              alt=""
                              className="w-5 h-5 object-contain"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-left">
                              <p className="text-[7px] font-bold text-slate-900 truncate max-w-[130px] leading-tight">
                                {school.name}
                              </p>
                              <p className="text-[6px] text-slate-500 truncate max-w-[130px]">
                                {school.address}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Mini Title Ribbon */}
                        <div className="my-1.5">
                          <span className={`inline-block px-2 py-0.5 border text-[7px] font-bold uppercase tracking-wider rounded-xs ${template.badgeStyle}`}>
                            {previewCertType === 'character' ? 'CHARACTER CERTIFICATE' : 'TRANSFER CERTIFICATE'}
                          </span>
                        </div>
                      </div>

                      {/* Mini Body Placeholder */}
                      <div className="px-1 text-[7px] text-slate-700 leading-snug space-y-1">
                        <p className="line-clamp-2">
                          This is to certify that <span className="font-bold underline text-slate-950">{demoStudent.fullName}</span> has completed <span className="font-semibold">{demoStudent.passedClass}</span> with <span className="font-bold">{demoStudent.divisionOrGpa}</span>.
                        </p>
                        <div className={`p-1 border-l-2 ${template.accentBorder} bg-slate-50/90 text-[6px] text-left text-slate-600`}>
                          Conduct: <strong className="text-slate-900">{demoStudent.characterRating}</strong> · Discipline verified.
                        </div>
                      </div>

                      {/* Mini Signatures Row */}
                      <div className="pt-1 border-t border-slate-200 grid grid-cols-3 gap-1 items-end text-[6px]">
                        <div>
                          <div className="border-b border-slate-300 pb-0.5 font-serif italic text-slate-600 truncate">
                            {school.preparedByName}
                          </div>
                          <span className="text-slate-400 block">Prepared By</span>
                        </div>
                        <div className="flex justify-center">
                          <div className={`w-4 h-4 rounded-full border border-dashed ${template.sealColor} flex items-center justify-center text-[4px] font-bold`}>
                            SEAL
                          </div>
                        </div>
                        <div>
                          <div className="border-b border-slate-400 pb-0.5 font-serif font-bold text-slate-800 truncate">
                            {school.principalName}
                          </div>
                          <span className="text-slate-400 block">Principal</span>
                        </div>
                      </div>

                    </div>
                    )}
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onPreviewTemplate(sampleCert)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-700 hover:text-slate-950 hover:bg-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    {isUserUploaded && onDeleteCustomTemplate && (
                      <button
                        onClick={() => onDeleteCustomTemplate(template.id)}
                        title="Delete custom uploaded template"
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectTemplate(template.id, selectedOrientation)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-white bg-slate-900 hover:bg-amber-600 rounded-lg font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Use in Canvas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* LIST VIEW: Structured, neat tabular layout for rapid comparison */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3">Template Name & Theme</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Visual Style & Border</th>
                  <th className="px-4 py-3">Best Recommended For</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTemplates.map((template, idx) => {
                  const sampleCert = createDummyCertForTemplate(template.id);
                  const isCurrentDefault = school.defaultTemplateId === template.id;

                  return (
                    <tr key={template.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-400 text-center">
                        {String(idx + 1).padStart(2, '0')}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300"
                            style={{ backgroundColor: template.primaryColor }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">
                              {template.name}
                            </span>
                            {isCurrentDefault && (
                              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                                Default School Template
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded font-semibold text-xs ${
                          template.id === 'tpl-chandrodaya-official'
                            ? 'bg-rose-100 text-rose-950 font-bold border border-rose-300'
                            : template.isCustomUploaded
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {template.id === 'tpl-chandrodaya-official' ? '★ Official Govt Model' : template.category}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600 max-w-xs">
                        <span className="line-clamp-1">{template.description}</span>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        <span className="font-mono text-[11px]">Portrait & Landscape A4</span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onPreviewTemplate(sampleCert)}
                            className="flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-md font-semibold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => onSelectTemplate(template.id, selectedOrientation)}
                            className="flex items-center gap-1 px-3 py-1 text-white bg-slate-900 hover:bg-amber-600 rounded-md font-semibold cursor-pointer"
                          >
                            <span>Use in Canvas</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}

    </div>
  );
};
