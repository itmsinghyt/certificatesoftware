import React, { useEffect, useState } from 'react';
import { Certificate, CertificateOrientation, CertificateTemplateConfig, SchoolProfile, Student } from '../types';
import { generateCertificateQRCode } from '../utils/qr';
import { getTemplateById } from '../data/templatesData';
import chandrodayaCrestImg from '../assets/images/chandrodaya_crest_1791080040741.jpg';
import studentPassportPhotoImg from '../assets/images/student_passport_photo_1791080054706.jpg';

interface CertificateTemplateProps {
  certificate: Certificate;
  student: Student;
  school: SchoolProfile;
  previewMode?: boolean;
  orientationOverride?: CertificateOrientation;
  templateIdOverride?: string;
  customTemplates?: CertificateTemplateConfig[];
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  certificate,
  student,
  school,
  previewMode = false,
  orientationOverride,
  templateIdOverride,
  customTemplates = [],
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const activeTemplateId = templateIdOverride || certificate.templateId || 'tpl-classic-gold';
  const tpl = getTemplateById(activeTemplateId, customTemplates);

  const orientation = orientationOverride || certificate.orientation || 'portrait';
  const isLandscape = orientation === 'landscape';

  const isChandrodayaModel = activeTemplateId === 'tpl-chandrodaya-official';
  const isTransferCharacter = certificate.certType === 'transfer_character' || isChandrodayaModel;

  const qrText = certificate.qrPayload || 
    `VERIFIED_CREDENTIAL|ID:${certificate.certNo}|DISP:${certificate.dispatchNo}|STUDENT:${student.fullName}|REG:${student.regNo}|BOARD:${student.symbolNo}|GPA:${certificate.divisionOrGpa}|YEAR:${certificate.academicYear}|INSTITUTION:${school.name}`;

  useEffect(() => {
    generateCertificateQRCode(qrText).then(url => {
      setQrCodeUrl(url);
    });
  }, [qrText]);

  const isCharacter = certificate.certType === 'character';
  const isTransfer = certificate.certType === 'transfer';
  const isBonafide = certificate.certType === 'bonafide';

  // Pronouns based on gender
  const isFemale = student.gender === 'Female';
  const title = isFemale ? 'Ms.' : 'Mr.';
  const sonDaughter = isFemale ? 'daughter' : 'son';
  const heShe = isFemale ? 'She' : 'He';
  const hisHer = isFemale ? 'her' : 'his';
  const himHer = isFemale ? 'her' : 'him';

  // Effective Student Photo
  const effectivePhoto = student.photoUrl || certificate.studentPhotoUrl || studentPassportPhotoImg;

  // Responsive canvas dimensions based on orientation
  const canvasStyle = isLandscape
    ? {
        width: '100%',
        maxWidth: previewMode ? '1020px' : '1060px',
        minHeight: '740px',
        boxSizing: 'border-box' as const,
      }
    : {
        width: '100%',
        maxWidth: previewMode ? '820px' : '820px',
        minHeight: '1050px',
        boxSizing: 'border-box' as const,
      };

  /* ========================================================================= */
  /* EXACT REPLICA FOR SHREE CHANDRODAYA SECONDARY SCHOOL PHOTO MODEL          */
  /* ========================================================================= */
  if (isChandrodayaModel) {
    return (
      <div
        className={`relative mx-auto transition-all select-none print:shadow-none print:m-0 print:w-full bg-white ${
          previewMode ? 'shadow-md rounded-sm' : 'shadow-2xl'
        } certificate-frame-chandrodaya`}
        style={canvasStyle}
      >
        {/* Inner thin black border box */}
        <div className="border border-black p-5 sm:p-8 w-full h-full flex flex-col justify-between bg-white text-slate-950 font-serif relative">
          
          {/* TOP SECTION: Left Crest + Center Header with Seal + Right Passport Photo */}
          <div>
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              
              {/* Left School Crest Emblem */}
              <div className="w-20 sm:w-24 shrink-0 flex flex-col items-center">
                <img
                  src={chandrodayaCrestImg}
                  alt="Chandrodaya Crest"
                  className="w-18 h-18 sm:w-22 sm:h-22 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Center Institutional Typography + Circular Ink Stamp */}
              <div className="flex-1 text-center relative px-1">
                <h1 className="text-xl sm:text-2xl md:text-[25px] font-bold font-serif text-slate-950 uppercase tracking-wide leading-tight">
                  SHREE CHANDRODAYA SECONDARY SCHOOL
                </h1>
                
                <div className="text-xs sm:text-sm font-semibold text-slate-900 mt-1 leading-snug">
                  <p>Kedarsyun Rural Municipality – 6</p>
                  <p>Bhadasain, Bajhang</p>
                  <p>Sudurpaschim Province, Nepal</p>
                  <p className="font-bold">Estd. 2021</p>
                </div>

                {/* Authentic Circular Rubber Stamp in Center with Slight Tilt */}
                <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-85 rotate-[-3deg]">
                  <svg viewBox="0 0 170 170" className="w-28 h-28 sm:w-32 sm:h-32 text-indigo-950/80">
                    <circle cx="85" cy="85" r="80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" />
                    <circle cx="85" cy="85" r="74" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      id="stampArc"
                      d="M 25 85 A 60 60 0 1 1 145 85 A 60 60 0 1 1 25 85"
                      fill="none"
                    />
                    <text className="text-[9.5px] font-bold uppercase tracking-wider fill-current">
                      <textPath href="#stampArc" startOffset="0%">
                        * Chandrodaya Secondary School * Kedarsyun-6, Bajhang *
                      </textPath>
                    </text>
                    {/* Star of David / Two Interlaced Triangles */}
                    <polygon points="85,38 118,95 52,95" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <polygon points="85,115 118,58 52,58" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="85" cy="77" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                    <text x="85" y="80" textAnchor="middle" className="text-[7px] font-bold fill-current">ESTD</text>
                    <text x="85" y="132" textAnchor="middle" className="text-[8px] font-bold fill-current">2021</text>
                  </svg>
                </div>
              </div>

              {/* Right Student Passport Photo */}
              <div className="w-20 sm:w-24 shrink-0 flex flex-col items-end">
                <div className="w-[88px] h-[110px] sm:w-[100px] sm:h-[125px] border-2 border-black bg-white overflow-hidden shadow-xs p-0.5">
                  <img
                    src={effectivePhoto}
                    alt="Student Photo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

            </div>

            {/* METADATA ROW: S.No, Regd. N., Symbol No, Date */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-950 mt-3 pt-1">
              <div className="space-y-0.5">
                <p>
                  <span className="font-bold">S.No. :- </span>
                  <span className="font-mono text-slate-950">{certificate.serialNo || student.serialNo || '8296'}</span>
                </p>
                <p>
                  <span className="font-bold">Regd. N. </span>
                  <span className="font-mono text-slate-950">{student.regNo || '807680080021'}</span>
                </p>
                <p>
                  <span className="font-bold">Symbol No : </span>
                  <span className="font-mono text-slate-950">{student.symbolNo || '26800401'}</span>
                </p>
              </div>

              <div className="text-right">
                <p>
                  <span className="font-bold">Date : </span>
                  <span className="font-mono text-slate-950">{certificate.issueDateBS || '2083/06/16'}</span>
                </p>
              </div>
            </div>

            {/* SOLID VIBRANT RED TITLE RIBBON */}
            <div className="bg-[#dc2626] border-2 border-[#b91c1c] text-white py-1 px-4 text-center my-3 shadow-xs">
              <h2 className="text-white text-base sm:text-lg md:text-xl font-serif font-black tracking-widest uppercase">
                TRANSFER/CHARACTER CERTIFICATE
              </h2>
            </div>

            {/* CERTIFICATE BODY TEXT */}
            <div className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-slate-950 text-justify space-y-3 font-serif mt-2">
              <p className="leading-loose">
                This is to certify that Mr./Mrs./Miss. <strong className="font-bold underline text-black px-1">{student.fullName}</strong> 
                Son/Daughter of Mr. <strong className="font-bold underline text-black px-1">{student.fatherName}</strong> 
                and <strong className="font-bold underline text-black px-1">{student.motherName}</strong> 
                resident of <strong className="font-bold text-black px-1">{student.address || 'Kedarsyun Rural Municipality ward no. 5, Bajhang District Sudurpaschim Province'}</strong> 
                has been studying in this school from <strong className="font-bold text-black px-1">{student.studyFromBS || '2079 B.S.'}</strong> 
                to <strong className="font-bold text-black px-1">{student.studyToBS || '2081 B.S.'}</strong> 
                He/She passed/completed the <strong className="font-bold text-black px-1">{certificate.passedClass || student.passedClass || 'SEE (Grade -10)/SLC Examination (Grade XII)'}</strong> 
                held in <strong className="font-bold text-black px-1">{student.examHeldYearBS || '2081 B.S.'} ({student.examHeldYearAD || '2024A.D.'})</strong> 
                with <strong className="font-bold text-black px-1">{certificate.divisionOrGpa || student.divisionOrGpa || '2.54 GPA/CGPA'}</strong> Division. 
                His/Her conduct was satisfactory while at school to the best of my knowledge. 
                He/She has good moral character. 
                His/Her date of birth according to school record is <strong className="font-bold text-black px-1">{student.dateOfBirthBS || '2062/05/02 B.S.'} ({student.dateOfBirthAD || '2005/08/18A.D.'})</strong>
              </p>

              <p className="text-left pt-1">
                This school has no objection if he/she studies in any other institutions in the country of abroad.
              </p>

              <p className="text-center font-bold text-black text-sm sm:text-base pt-2">
                I wish every success for his/her bright future.
              </p>
            </div>
          </div>

          {/* BOTTOM SIGNATURES SECTION: 3 Columns Matching Official Format */}
          <div className="pt-6 mt-4 border-t border-transparent grid grid-cols-3 gap-4 text-center items-end text-xs sm:text-sm font-serif">
            
            {/* 1. Written By / Prepared By */}
            <div>
              <div className="min-h-[44px] flex flex-col items-center justify-end">
                {certificate.preparedBySignatureUrl || school.preparedBySignatureUrl ? (
                  <img
                    src={certificate.preparedBySignatureUrl || school.preparedBySignatureUrl}
                    alt="Signature"
                    className="max-h-11 max-w-[120px] object-contain mb-0.5"
                  />
                ) : (
                  <svg viewBox="0 0 120 40" className="w-24 h-9 text-slate-900 stroke-current fill-none stroke-[2]">
                    <path d="M10,25 Q30,5 45,28 T70,18 T95,30" />
                    <path d="M25,28 Q50,35 80,25" />
                  </svg>
                )}
                <p className="tracking-widest font-mono text-slate-700">...................</p>
              </div>
              <p className="font-serif text-slate-950 font-normal mt-1">
                {certificate.preparedByTitle || school.preparedByTitle || 'written by'}
              </p>
              {certificate.preparedBy && certificate.preparedBy !== 'written by' && (
                <p className="font-serif text-[11px] text-slate-700">
                  {certificate.preparedBy}
                </p>
              )}
            </div>

            {/* 2. Checked By / Verified By */}
            <div>
              <div className="min-h-[44px] flex flex-col items-center justify-end">
                {certificate.verifiedBySignatureUrl || school.accountantSignatureUrl ? (
                  <img
                    src={certificate.verifiedBySignatureUrl || school.accountantSignatureUrl}
                    alt="Signature"
                    className="max-h-11 max-w-[120px] object-contain mb-0.5"
                  />
                ) : (
                  <svg viewBox="0 0 120 40" className="w-24 h-9 text-slate-900 stroke-current fill-none stroke-[2]">
                    <path d="M15,20 C30,5 50,5 55,25 C60,35 40,38 35,25 C30,10 65,15 85,25 T105,22" />
                  </svg>
                )}
                <p className="tracking-widest font-mono text-slate-700">...................</p>
              </div>
              <p className="font-serif text-slate-950 font-normal mt-1">
                {certificate.verifiedByTitle || school.accountantTitle || 'Checked By'}
              </p>
              {certificate.verifiedBy && certificate.verifiedBy !== 'Checked By' && (
                <p className="font-serif text-[11px] text-slate-700">
                  {certificate.verifiedBy}
                </p>
              )}
            </div>

            {/* 3. Headteacher / Head Master */}
            <div>
              <div className="min-h-[44px] flex flex-col items-center justify-end">
                {certificate.headmasterSignatureUrl || school.principalSignatureUrl ? (
                  <img
                    src={certificate.headmasterSignatureUrl || school.principalSignatureUrl}
                    alt="Signature"
                    className="max-h-11 max-w-[140px] object-contain mb-0.5"
                  />
                ) : (
                  <svg viewBox="0 0 140 40" className="w-28 h-9 text-slate-900 stroke-current fill-none stroke-[2.2]">
                    <path d="M10,30 Q30,10 50,22 T90,12 T125,25" />
                    <path d="M30,22 Q70,5 110,28" />
                  </svg>
                )}
                <p className="tracking-widest font-mono text-slate-700">...................</p>
              </div>
              <p className="font-bold text-slate-950 text-xs sm:text-sm">
                {certificate.headmasterTitle || school.principalTitle || 'Headteacher'}
              </p>
              <p className="font-semibold text-slate-800 text-[11px] sm:text-xs leading-none">
                {certificate.headmaster || school.principalName || 'Head Master'}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-700 italic mt-0.5 truncate max-w-full">
                {school.name}
              </p>
            </div>

          </div>

        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* STANDARD TEMPLATES RENDERER                                               */
  /* ========================================================================= */
  return (
    <div
      className={`relative mx-auto transition-all select-none print:shadow-none print:m-0 print:w-full overflow-hidden ${
        previewMode ? 'shadow-md rounded-sm' : 'shadow-2xl'
      } ${tpl.outerBorderClass}`}
      style={canvasStyle}
    >
      {/* Uploaded Custom Template Background Layer */}
      {tpl.isCustomUploaded && tpl.backgroundImageUrl && (
        <div
          className={`absolute inset-0 pointer-events-none z-0 ${
            tpl.printBackground === false ? 'print:hidden' : ''
          }`}
          style={{
            backgroundImage: `url(${tpl.backgroundImageUrl})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: tpl.backgroundOpacity ?? 1.0,
          }}
        />
      )}

      {/* Pre-printed stationery non-print notification banner for admin on screen */}
      {tpl.isCustomUploaded && tpl.printBackground === false && (
        <div className="absolute top-1 right-2 z-30 bg-amber-500/90 text-slate-950 font-bold text-[8px] px-1.5 py-0.5 rounded shadow-xs no-print">
          Pre-Printed Paper Mode (Background won't print)
        </div>
      )}

      {/* Outer Border with decorative frame */}
      <div className={`relative z-10 p-3 md:p-5 w-full h-full ${tpl.isCustomUploaded ? 'border-2 border-transparent' : 'border-4 ' + tpl.accentBorder}`}>
        <div
          className={`relative p-5 md:p-7 h-full ${
            tpl.isCustomUploaded ? 'border border-transparent bg-transparent' : `border border-dashed ${tpl.accentBorder} ${tpl.innerBorderClass} bg-white/95`
          } flex flex-col justify-between`}
          style={{
            paddingTop: tpl.contentPaddingTop ? `${tpl.contentPaddingTop}px` : undefined,
          }}
        >
          
          {/* Subtle Background Watermark Logo (shown when not custom uploaded) */}
          {!tpl.isCustomUploaded && (
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${tpl.watermarkOpacity} overflow-hidden`}>
              <img
                src={school.logoUrl}
                alt=""
                className={`${isLandscape ? 'w-80 h-80' : 'w-96 h-96'} object-contain grayscale`}
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Corner Flourish Ornaments (only on built-in templates) */}
          {!tpl.isCustomUploaded && (
            <>
              <div className="absolute top-2 left-2 text-xs font-serif text-slate-700/60 pointer-events-none">
                {tpl.cornerFlourish}
              </div>
              <div className="absolute top-2 right-2 text-xs font-serif text-slate-700/60 pointer-events-none">
                {tpl.cornerFlourish}
              </div>
              <div className="absolute bottom-2 left-2 text-xs font-serif text-slate-700/60 pointer-events-none">
                {tpl.cornerFlourish}
              </div>
              <div className="absolute bottom-2 right-2 text-xs font-serif text-slate-700/60 pointer-events-none">
                {tpl.cornerFlourish}
              </div>
            </>
          )}

          {/* Top Section Container */}
          <div>
            {/* Top Metadata Row: Dispatch No, Reg No, Date */}
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 pb-2 border-b border-slate-300/80">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900">Dispatch No:</span>
                  <span className="font-mono text-slate-900 font-bold">{certificate.dispatchNo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900">School Reg:</span>
                  <span className="font-mono">{school.registrationNo}</span>
                </div>
              </div>

              {/* Template identifier badge (quiet indicator) */}
              <div className="hidden sm:block text-[10px] text-slate-400 font-mono">
                {tpl.name} · {orientation.toUpperCase()}
              </div>

              <div className="text-right space-y-0.5">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="font-semibold text-slate-900">Certificate No:</span>
                  <span className="font-mono font-bold text-slate-900">{certificate.certNo}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="font-semibold text-slate-900">Date of Issue:</span>
                  <span className="font-mono font-medium">{certificate.issueDateAD} {certificate.issueDateBS ? `(${certificate.issueDateBS})` : ''}</span>
                </div>
              </div>
            </div>

            {/* Institutional Header with Logo */}
            {!tpl.hideDefaultHeader ? (
              <div className={`text-center ${isLandscape ? 'pt-2 pb-2' : 'pt-4 pb-3'}`}>
                <div className="flex items-center justify-center gap-4 mb-1">
                  <img
                    src={school.logoUrl}
                    alt="School Emblem"
                    className={`${isLandscape ? 'w-14 h-14 md:w-16 md:h-16' : 'w-16 h-16 md:w-20 md:h-20'} object-contain drop-shadow-sm`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center flex-1">
                    <p className="text-[11px] tracking-wider text-slate-600 font-sans font-semibold uppercase">
                      {school.affiliation}
                    </p>
                    <h1 className={`${isLandscape ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} font-bold ${tpl.fontFamilyTitle} text-slate-900 tracking-wider leading-tight uppercase`}>
                      {school.name}
                    </h1>
                    <p className="text-xs text-slate-700 font-medium">
                      {school.address}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Established: {school.establishedYear} · Phone: {school.phone} · Email: {school.email}
                    </p>
                  </div>
                  <div className={`${isLandscape ? 'w-14 h-14' : 'w-16 h-16'} hidden md:flex items-center justify-center opacity-90`}>
                    {qrCodeUrl && (
                      <img src={qrCodeUrl} alt="QR" className="w-14 h-14 p-0.5 border border-slate-300 rounded bg-white shadow-2xs" />
                    )}
                  </div>
                </div>

                {/* School Motto */}
                <div className="inline-block px-4 py-0.5 border-y border-slate-300 text-[10px] italic text-slate-600 font-serif">
                  "{school.motto}"
                </div>
              </div>
            ) : (
              /* If header is hidden because the uploaded template already has it */
              <div className="h-14 flex items-center justify-between px-2">
                <div />
                {qrCodeUrl && (
                  <div className="opacity-90">
                    <img src={qrCodeUrl} alt="QR" className="w-12 h-12 p-0.5 border border-slate-300 rounded bg-white shadow-2xs" />
                  </div>
                )}
              </div>
            )}

            {/* Certificate Title Banner */}
            <div className={`text-center ${isLandscape ? 'my-2' : 'my-3'}`}>
              <div className={`inline-block px-8 py-1.5 border-2 rounded-sm shadow-xs ${tpl.badgeStyle}`}>
                <h2 className={`${isLandscape ? 'text-base md:text-lg' : 'text-lg md:text-xl'} font-bold ${tpl.fontFamilyTitle} uppercase tracking-widest text-slate-950`}>
                  {certificate.certType === 'transfer_character' && 'TRANSFER/CHARACTER CERTIFICATE'}
                  {isCharacter && 'CHARACTER CERTIFICATE'}
                  {isTransfer && 'TRANSFER CERTIFICATE'}
                  {isBonafide && 'BONAFIDE & STUDY CERTIFICATE'}
                </h2>
                <p className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider -mt-0.5">
                  {certificate.certType === 'transfer_character' && 'Official School Leaving & Character Record'}
                  {isCharacter && 'Official Record of Academic Conduct & Character'}
                  {isTransfer && 'Official School Leaving Certificate'}
                  {isBonafide && 'Certificate of Enrollment & Recommendation'}
                </p>
              </div>
            </div>

            {/* Student Academic Identification Ribbon */}
            <div className={`bg-slate-50/80 border border-slate-200 rounded p-2 text-xs ${
              isLandscape ? 'my-2 grid grid-cols-4 gap-3' : 'my-3 grid grid-cols-2 md:grid-cols-4 gap-2'
            }`}>
              <div>
                <span className="text-slate-500 block text-[11px]">Student Reg No:</span>
                <span className="font-mono font-bold text-slate-900">{student.regNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Symbol / Roll No:</span>
                <span className="font-mono font-bold text-slate-900">{student.symbolNo || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Academic Session:</span>
                <span className="font-semibold text-slate-900">{certificate.academicYear}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Result / Grade:</span>
                <span className="font-semibold text-slate-900">{certificate.divisionOrGpa}</span>
              </div>
            </div>

            {/* CERTIFICATE BODY TEXT */}
            <div className={`leading-relaxed text-slate-800 font-sans ${isLandscape ? 'my-3 text-xs md:text-sm space-y-2.5' : 'my-5 text-sm md:text-base space-y-3.5'}`}>
              
              <p className="text-justify leading-loose">
                This is to certify that {title} <span className="font-bold underline decoration-slate-400 underline-offset-4 text-slate-950 px-1">{student.fullName}</span>, 
                the bonafide {sonDaughter} of Mr. <span className="font-bold underline decoration-slate-400 underline-offset-4 text-slate-950 px-1">{student.fatherName}</span> and 
                Mrs. <span className="font-bold underline decoration-slate-400 underline-offset-4 text-slate-950 px-1">{student.motherName}</span>, 
                a permanent resident of <span className="font-semibold underline decoration-slate-400 underline-offset-4 px-1">{student.address}</span>, 
                was a regular student of this institution. {heShe} has satisfactorily completed and passed the official examination of 
                <span className="font-bold underline decoration-slate-400 underline-offset-4 px-1">{certificate.passedClass}</span> in the academic session of 
                <span className="font-bold px-1">{certificate.academicYear}</span>, securing <span className="font-bold px-1">{certificate.divisionOrGpa}</span>.
              </p>

              <p className="text-justify leading-relaxed">
                According to the official institutional register, {hisHer} date of birth is recorded as 
                <span className="font-bold font-mono px-1.5">{student.dateOfBirthAD} A.D.</span> 
                {student.dateOfBirthBS ? <span>(corresponding to <span className="font-bold font-mono px-1">{student.dateOfBirthBS}</span>)</span> : ''}.
              </p>

              {/* Character Assessment Paragraph */}
              {isCharacter && (
                <div className={`p-2.5 bg-amber-50/50 border-l-4 ${tpl.accentBorder} rounded-r text-xs md:text-sm`}>
                  <p className="font-medium text-slate-900 leading-snug">
                    <span className="font-bold text-slate-950">Conduct & Moral Appraisal:</span> During {hisHer} period of study at this institution, 
                    {hisHer} moral character, academic discipline, and general demeanor were found to be 
                    <span className="font-bold text-slate-950 underline px-1.5">{certificate.characterRating || 'Exemplary'}</span>. 
                    To the best of our official knowledge, {heShe.toLowerCase()} was not involved in any act or activity detrimental to the discipline of the institution.
                  </p>
                  {student.remarks && (
                    <p className="text-[11px] text-slate-600 mt-1 italic">
                      Special Observation: {student.remarks}
                    </p>
                  )}
                </div>
              )}

              {/* Transfer Certificate Specific Rows */}
              {isTransfer && (
                <div className="space-y-1.5 border border-slate-300 rounded p-2.5 bg-slate-50/70 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block">Reason for Leaving Institution:</span>
                      <span className="font-semibold text-slate-900">{certificate.reasonForLeaving || student.reasonForLeaving || 'For higher secondary studies'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Institutional Dues Clearance:</span>
                      <span className="font-bold text-emerald-800">{certificate.duesCleared === 'Yes' ? 'Cleared (No outstanding dues)' : 'Pending'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Year of Admission:</span>
                      <span className="font-mono font-medium">{student.admissionYear || '2019'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Conduct & Demeanor:</span>
                      <span className="font-bold text-slate-900">{certificate.characterRating}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Blessing Line */}
              <p className="text-center italic text-xs text-slate-600 pt-1 font-medium">
                We warmly commend {himHer} and extend our sincere best wishes for {hisHer} future academic endeavors, career, and life.
              </p>
            </div>
          </div>

          {/* Bottom Signatures & Seal Section */}
          <div className={`${isLandscape ? 'pt-4 mt-2' : 'pt-6 mt-4'} border-t border-slate-300`}>
            <div className="grid grid-cols-4 gap-3 text-center items-end">
              
              {/* 1. Prepared By */}
              <div>
                <div className="border-b border-dashed border-slate-400 pb-1 mb-1 min-h-[38px] flex flex-col items-center justify-end">
                  {certificate.preparedBySignatureUrl || school.preparedBySignatureUrl ? (
                    <img
                      src={certificate.preparedBySignatureUrl || school.preparedBySignatureUrl}
                      alt="Signature"
                      className="max-h-9 max-w-[100px] object-contain"
                    />
                  ) : (
                    <span className="font-serif italic text-xs text-slate-800">
                      {certificate.preparedBy || school.preparedByName || 'Prepared By'}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {certificate.preparedByTitle || school.preparedByTitle || 'Prepared By'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {certificate.preparedBy && certificate.preparedBy !== 'written by' && certificate.preparedBy !== 'Prepared By'
                    ? certificate.preparedBy
                    : school.preparedByDesignation || 'Administration'}
                </p>
              </div>

              {/* 2. Verified By / Accountant */}
              <div>
                <div className="border-b border-dashed border-slate-400 pb-1 mb-1 min-h-[38px] flex flex-col items-center justify-end">
                  {certificate.verifiedBySignatureUrl || school.accountantSignatureUrl ? (
                    <img
                      src={certificate.verifiedBySignatureUrl || school.accountantSignatureUrl}
                      alt="Signature"
                      className="max-h-9 max-w-[100px] object-contain"
                    />
                  ) : (
                    <span className="font-serif italic text-xs text-slate-800">
                      {certificate.verifiedBy || school.accountantName || 'Verified By'}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {certificate.verifiedByTitle || school.accountantTitle || 'Verified By'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {certificate.verifiedBy && certificate.verifiedBy !== 'Checked By' && certificate.verifiedBy !== 'Verified By'
                    ? certificate.verifiedBy
                    : school.accountantDesignation || 'Accounts / Examination'}
                </p>
              </div>

              {/* 3. Official Seal / Stamp */}
              <div className="flex flex-col items-center justify-center">
                <div className={`${isLandscape ? 'w-14 h-14' : 'w-16 h-16'} rounded-full border-2 border-dashed ${tpl.sealColor} flex items-center justify-center p-1 text-center`}>
                  <div className="text-[8px] font-bold uppercase tracking-tighter leading-tight">
                    OFFICIAL
                    <br />
                    INSTITUTION
                    <br />
                    SEAL
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Official Seal</p>
              </div>

              {/* 4. Headmaster / Principal */}
              <div>
                <div className="border-b-2 border-slate-900 pb-1 mb-1 min-h-[38px] flex flex-col items-center justify-end">
                  {certificate.headmasterSignatureUrl || school.principalSignatureUrl ? (
                    <img
                      src={certificate.headmasterSignatureUrl || school.principalSignatureUrl}
                      alt="Signature"
                      className="max-h-10 max-w-[120px] object-contain"
                    />
                  ) : (
                    <span className="font-serif font-bold italic text-xs text-slate-900">
                      {certificate.headmaster || school.principalName}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-950">
                  {certificate.headmaster || school.principalName}
                </p>
                <p className="text-[10px] font-semibold text-slate-700">
                  {certificate.headmasterDesignation || school.principalDesignation || 'Head Master'}
                </p>
              </div>
            </div>

            {/* Micro security footer */}
            <div className="mt-4 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span>* Notice: Any alteration or unauthorized erasure renders this certificate invalid.</span>
              <span>CERT-ID: {certificate.id}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
