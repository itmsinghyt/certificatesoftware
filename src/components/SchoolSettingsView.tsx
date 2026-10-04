import React, { useState } from 'react';
import { CertificateOrientation, SchoolProfile, Student, Certificate } from '../types';
import { CERTIFICATE_TEMPLATES } from '../data/templatesData';
import { Theme } from '../utils/theme';
import { ThemeSwitcher } from './ThemeSwitcher';
import {
  School,
  Save,
  CheckCircle2,
  Palette,
  Calendar,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Users,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Award,
  ChevronRight,
  ChevronLeft,
  PenTool,
  Image as ImageIcon,
  RotateCcw,
  SunMoon
} from 'lucide-react';

interface SchoolSettingsViewProps {
  school: SchoolProfile;
  students?: Student[];
  certificates?: Certificate[];
  onSaveProfile: (profile: SchoolProfile) => void;
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

type SettingsTab = 'profile' | 'sessions' | 'signatories' | 'defaults';

export const SchoolSettingsView: React.FC<SchoolSettingsViewProps> = ({
  school,
  students = [],
  certificates = [],
  onSaveProfile,
  theme = 'system',
  onThemeChange,
}) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('profile');

  const [formData, setFormData] = useState<SchoolProfile>({
    ...school,
    principalTitle: school.principalTitle || 'Headteacher',
    accountantTitle: school.accountantTitle || 'Checked By',
    preparedByTitle: school.preparedByTitle || 'written by',
    academicSessions:
      school.academicSessions && school.academicSessions.length > 0
        ? school.academicSessions
        : [
            '2082 B.S.',
            '2081 B.S.',
            '2080 B.S.',
            '2079 B.S.',
            '2078 B.S.',
            '2077 B.S.',
            '2024-2025 A.D.',
            '2023-2024 A.D.',
          ],
  });

  const [newSessionInput, setNewSessionInput] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const sessionsList = formData.academicSessions || [];

  const handleAddSession = () => {
    const val = newSessionInput.trim();
    if (!val) return;
    if (sessionsList.includes(val)) {
      alert('This academic session already exists.');
      return;
    }
    const updated = [val, ...sessionsList];
    setFormData({
      ...formData,
      academicSessions: updated,
    });
    setNewSessionInput('');
  };

  const handleRemoveSession = (sessionToRemove: string) => {
    if (sessionToRemove === formData.currentAcademicSession) {
      alert('Cannot delete the currently active session. Please set another session as active first.');
      return;
    }
    const updated = sessionsList.filter((s) => s !== sessionToRemove);
    setFormData({
      ...formData,
      academicSessions: updated,
    });
  };

  const handleSetActiveSession = (session: string) => {
    setFormData({
      ...formData,
      currentAcademicSession: session,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please select a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, logoUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper for generic signature file upload
  const handleSignatureUpload = (
    field: 'principalSignatureUrl' | 'accountantSignatureUrl' | 'preparedBySignatureUrl',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Signature image size exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, [field]: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (type: 'standard' | 'formal') => {
    if (type === 'standard') {
      setFormData((prev) => ({
        ...prev,
        principalName: 'Head Master',
        principalTitle: 'Headteacher',
        principalDesignation: 'Headteacher / Head Master',
        accountantName: 'Checked By',
        accountantTitle: 'Checked By',
        preparedByName: 'written by',
        preparedByTitle: 'written by',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        principalName: 'Prem Bahadur Singh',
        principalTitle: 'Headmaster',
        principalDesignation: 'Head Master / Principal',
        accountantName: 'Ramesh Giri',
        accountantTitle: 'Checked By (Accountant)',
        preparedByName: 'Sita Thapa',
        preparedByTitle: 'Written By (Administration)',
      }));
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const tabs = [
    {
      id: 'profile' as SettingsTab,
      label: 'Institution Profile',
      icon: School,
      description: 'Name, address & contact information',
    },
    {
      id: 'sessions' as SettingsTab,
      label: 'Academic Sessions',
      icon: Calendar,
      badge: sessionsList.length,
      description: 'Manage academic years & active session',
    },
    {
      id: 'signatories' as SettingsTab,
      label: 'Signatories & Staff',
      icon: Users,
      description: 'Authorized signatories for certificates',
    },
    {
      id: 'defaults' as SettingsTab,
      label: 'Certificate Defaults',
      icon: Palette,
      description: 'Default layout, template & orientation',
    },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your school credentials, multi-year sessions, certificate signatories, and layout defaults
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSubmit()}
          className="flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-center"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5 shadow-2xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Settings saved successfully! All newly generated and printed certificates will use these updated details.
          </span>
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSettingsTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSettingsTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate">{tab.label}</span>
                    {typeof tab.badge === 'number' && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-slate-800 text-amber-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ================= TAB 1: INSTITUTION PROFILE ================= */}
        {activeSettingsTab === 'profile' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <School className="w-4 h-4 text-amber-600" />
                  <span>Institution Profile & General Information</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  These details appear on the header and body of all issued certificates
                </p>
              </div>
            </div>

            {/* School Logo & Branding Row */}
            <div className="p-4 bg-slate-50/80 border border-slate-200/70 rounded-xl flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden shrink-0">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Emblem"
                    className="w-12 h-12 object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <School className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="block text-xs font-bold text-slate-800">
                  Institution Logo / Seal Emblem
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Recommended: Square PNG or JPG with transparent background (under 2MB)
                </span>
                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      className="text-xs text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  School / Institution Full Name: *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shree Chandrodaya Secondary School"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Board Affiliation / Recognition: *
                </label>
                <input
                  type="text"
                  required
                  value={formData.affiliation}
                  onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  placeholder="e.g. Kedarsyun Rural Municipality – 6, Bhadasain, Bajhang"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Established Year:
                </label>
                <input
                  type="text"
                  value={formData.establishedYear}
                  onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                  placeholder="e.g. 2021"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  School Registration No / Code:
                </label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                  placeholder="e.g. 807680080021"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Campus Address:</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Kedarsyun Rural Municipality – 6, Bhadasain, Bajhang, Sudurpaschim Province, Nepal"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Phone:</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +977-9848123456"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Official Email:</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. chandrodaya.sec@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Official Website:</span>
                </label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="e.g. www.chandrodaya.edu.np"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  School Motto / Tagline:
                </label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  placeholder="e.g. Estd. 2021"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab('sessions')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <span>Next: Academic Sessions</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ACADEMIC SESSIONS ================= */}
        {activeSettingsTab === 'sessions' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Multi-Year Academic Sessions</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage academic years for student enrollment, class progression, and certificate generation
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-[11px] text-slate-500 font-medium">Currently Active:</span>
                <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 rounded-lg">
                  ★ {formData.currentAcademicSession}
                </span>
              </div>
            </div>

            {/* Add New Session Form */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newSessionInput}
                  onChange={(e) => setNewSessionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSession();
                    }
                  }}
                  placeholder="Enter new academic session (e.g. 2083 B.S. or 2025-2026 A.D.)..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSession}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Session</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Quick Add:</span>
              </span>
              {[
                '2084 B.S.',
                '2083 B.S.',
                '2082 B.S.',
                '2081 B.S.',
                '2080 B.S.',
                '2079 B.S.',
                '2026-2027 A.D.',
                '2025-2026 A.D.',
                '2024-2025 A.D.',
              ].map((preset) => {
                const alreadyExists = sessionsList.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    disabled={alreadyExists}
                    onClick={() => {
                      if (!alreadyExists) {
                        setFormData({
                          ...formData,
                          academicSessions: [preset, ...sessionsList],
                        });
                      }
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      alreadyExists
                        ? 'bg-slate-100 text-slate-400 cursor-default line-through decoration-slate-300'
                        : 'bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 cursor-pointer shadow-2xs'
                    }`}
                    title={alreadyExists ? 'Already configured' : `Add ${preset}`}
                  >
                    + {preset}
                  </button>
                );
              })}
            </div>

            {/* Configured Sessions Grid */}
            <div>
              <label className="block text-slate-700 font-semibold mb-2.5 text-xs">
                Configured Academic Sessions ({sessionsList.length} Sessions):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sessionsList.map((session) => {
                  const isActive = session === formData.currentAcademicSession;
                  const stdCount = students.filter((s) => s.academicYear === session).length;
                  const certCount = certificates.filter((c) => c.academicYear === session).length;

                  return (
                    <div
                      key={session}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                        isActive
                          ? 'bg-amber-50/80 border-amber-400 text-amber-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSetActiveSession(session)}
                        className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer flex-1"
                        title={
                          isActive
                            ? 'Currently active default session'
                            : 'Click to set this as the default active session'
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                            isActive
                              ? 'border-amber-600 bg-amber-600 text-white'
                              : 'border-slate-300 bg-white text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-bold font-mono">{session}</span>
                            {isActive && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1 py-0.2 rounded font-bold uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                            {stdCount} Students · {certCount} Certs
                          </span>
                        </div>
                      </button>

                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSession(session)}
                          title={`Delete session ${session}`}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSettingsTab('profile')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab('signatories')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <span>Next: Signatories</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SIGNATORIES & STAFF ================= */}
        {activeSettingsTab === 'signatories' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-blue-600" />
                  <span>Certificate Signatories & Staff</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Write customized signatory names and titles, or upload digital signature images
                </p>
              </div>

              {/* Quick presets toolbar */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-semibold">Presets:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('standard')}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                  title="Apply standard Nepali school format ('written by', 'Checked By', 'Head Master')"
                >
                  Standard School
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('formal')}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg cursor-pointer transition-colors"
                  title="Apply formal personnel names"
                >
                  Staff Names
                </button>
              </div>
            </div>

            {/* Signatories 3-Column / Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* 1. PREPARED BY / WRITTEN BY */}
              <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      <span>1. Prepared By</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Issuer</span>
                  </div>

                  {/* Title / Label */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Certificate Display Title:
                    </label>
                    <input
                      type="text"
                      value={formData.preparedByTitle || 'written by'}
                      onChange={(e) =>
                        setFormData({ ...formData, preparedByTitle: e.target.value })
                      }
                      placeholder="e.g. written by or Prepared By"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Personnel Full Name:
                    </label>
                    <input
                      type="text"
                      value={formData.preparedByName}
                      onChange={(e) =>
                        setFormData({ ...formData, preparedByName: e.target.value })
                      }
                      placeholder="e.g. written by or Sita Thapa"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Digital Signature Upload Box */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Digital Signature:
                    </label>

                    {formData.preparedBySignatureUrl ? (
                      <div className="p-2.5 bg-white border border-amber-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                        <img
                          src={formData.preparedBySignatureUrl}
                          alt="Prepared By Signature"
                          className="h-9 max-w-[110px] object-contain"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, preparedBySignatureUrl: '' })
                          }
                          className="text-xs text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/30 rounded-xl cursor-pointer transition-colors text-center">
                        <Upload className="w-4 h-4 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-700">
                          Upload Signature Image
                        </span>
                        <span className="text-[10px] text-slate-400">
                          PNG/JPG with transparent bg
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSignatureUpload('preparedBySignatureUrl', e)
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/40">
                  Appears in left signature column. Blank signature prints dotted manual line.
                </p>
              </div>

              {/* 2. CHECKED BY / ACCOUNTANT */}
              <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>2. Checked By</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Verifier</span>
                  </div>

                  {/* Title / Label */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Certificate Display Title:
                    </label>
                    <input
                      type="text"
                      value={formData.accountantTitle || 'Checked By'}
                      onChange={(e) =>
                        setFormData({ ...formData, accountantTitle: e.target.value })
                      }
                      placeholder="e.g. Checked By or Accountant"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Accountant / Verifier Name:
                    </label>
                    <input
                      type="text"
                      value={formData.accountantName}
                      onChange={(e) =>
                        setFormData({ ...formData, accountantName: e.target.value })
                      }
                      placeholder="e.g. Checked By or Ramesh Giri"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Digital Signature Upload Box */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Digital Signature:
                    </label>

                    {formData.accountantSignatureUrl ? (
                      <div className="p-2.5 bg-white border border-amber-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                        <img
                          src={formData.accountantSignatureUrl}
                          alt="Checked By Signature"
                          className="h-9 max-w-[110px] object-contain"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, accountantSignatureUrl: '' })
                          }
                          className="text-xs text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/30 rounded-xl cursor-pointer transition-colors text-center">
                        <Upload className="w-4 h-4 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-700">
                          Upload Signature Image
                        </span>
                        <span className="text-[10px] text-slate-400">
                          PNG/JPG with transparent bg
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSignatureUpload('accountantSignatureUrl', e)
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/40">
                  Appears in center signature column. Responsible for financial & record clearance.
                </p>
              </div>

              {/* 3. HEADMASTER / PRINCIPAL */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      <span>3. Head Master / Principal</span>
                    </span>
                    <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  </div>

                  {/* Title / Label */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Certificate Display Title:
                    </label>
                    <input
                      type="text"
                      value={formData.principalTitle || 'Headteacher'}
                      onChange={(e) =>
                        setFormData({ ...formData, principalTitle: e.target.value })
                      }
                      placeholder="e.g. Headteacher or Principal"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Headmaster Full Name: *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.principalName}
                      onChange={(e) =>
                        setFormData({ ...formData, principalName: e.target.value })
                      }
                      placeholder="e.g. Head Master or Prem Bahadur Singh"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Designation / Role Title:
                    </label>
                    <input
                      type="text"
                      value={formData.principalDesignation}
                      onChange={(e) =>
                        setFormData({ ...formData, principalDesignation: e.target.value })
                      }
                      placeholder="e.g. Headteacher / Head Master"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Digital Signature Upload Box */}
                  <div className="pt-2 border-t border-amber-200/60">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Digital Signature:
                    </label>

                    {formData.principalSignatureUrl ? (
                      <div className="p-2.5 bg-white border border-amber-300 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                        <img
                          src={formData.principalSignatureUrl}
                          alt="Headmaster Signature"
                          className="h-10 max-w-[130px] object-contain"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, principalSignatureUrl: '' })
                          }
                          className="text-xs text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-white hover:bg-amber-50/50 rounded-xl cursor-pointer transition-colors text-center">
                        <Upload className="w-4 h-4 text-amber-600 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-800">
                          Upload Headmaster Signature
                        </span>
                        <span className="text-[10px] text-slate-400">
                          PNG/JPG with transparent bg
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSignatureUpload('principalSignatureUrl', e)
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-amber-800/80 pt-1 border-t border-amber-200/60">
                  Primary signatory on right column. Digital signature prints directly on official certificates.
                </p>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSettingsTab('sessions')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: Sessions</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Signatories</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSettingsTab('defaults')}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <span>Next: Defaults</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CERTIFICATE DEFAULTS ================= */}
        {activeSettingsTab === 'defaults' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>Default Certificate Design & Print Layout</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set preferred default template design, layout orientation, and certificate preferences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Default Certificate Template:
                </label>
                <select
                  value={formData.defaultTemplateId || 'tpl-classic-gold'}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultTemplateId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {CERTIFICATE_TEMPLATES.map((t, idx) => (
                    <option key={t.id} value={t.id}>
                      #{idx + 1}. {t.name} ({t.category})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  New certificates will automatically use this layout when created
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Default Print Orientation:
                </label>
                <select
                  value={formData.defaultOrientation || 'portrait'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultOrientation: e.target.value as CertificateOrientation,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="portrait">Portrait Mode (A4 Vertical 210mm × 297mm)</option>
                  <option value="landscape">Landscape Mode (A4 Horizontal 297mm × 210mm)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Default page orientation when sending certificates to the printer
                </p>
              </div>
            </div>

            {/* Selected Template Quick Preview Info Card */}
            {(() => {
              const selectedTpl =
                CERTIFICATE_TEMPLATES.find((t) => t.id === formData.defaultTemplateId) ||
                CERTIFICATE_TEMPLATES[0];

              return (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {selectedTpl?.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                          {selectedTpl?.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {selectedTpl?.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 border border-amber-300 px-2 py-1 rounded-md shrink-0">
                    Active Default
                  </span>
                </div>
              );
            })()}

            {/* Application Theme Preference Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <SunMoon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Interface Theme Mode (Dark / Light / System)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      Select your preferred workspace theme or synchronize automatically with your device settings
                    </span>
                  </div>
                </div>

                {onThemeChange && (
                  <ThemeSwitcher
                    theme={theme}
                    onThemeChange={onThemeChange}
                    variant="segmented"
                  />
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSettingsTab('signatories')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: Signatories</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
