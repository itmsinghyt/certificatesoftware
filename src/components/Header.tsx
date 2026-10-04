import React, { useState } from 'react';
import { SchoolProfile } from '../types';
import {
  PlusCircle,
  Download,
  Search,
  School,
  ShieldCheck,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar,
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Theme } from '../utils/theme';

interface HeaderProps {
  school: SchoolProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewCertificateClick: () => void;
  onBackupClick: () => void;
  lastBackupTime: string | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  school,
  searchQuery,
  onSearchChange,
  onNewCertificateClick,
  onBackupClick,
  lastBackupTime,
  isSidebarOpen,
  onToggleSidebar,
  selectedYear,
  onYearChange,
  availableYears,
  theme,
  onThemeChange,
}) => {
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState<boolean>(false);

  return (
    <header className="shrink-0 bg-white dark:bg-slate-900 border-b border-neutral-200/80 dark:border-slate-800 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 no-print shadow-2xs z-30 transition-colors">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Sidebar Toggle & Institution Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          
          {/* Sidebar Hide/Show Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? "Hide sidebar (Ctrl+B)" : "Show sidebar (Ctrl+B)"}
            aria-label={isSidebarOpen ? "Hide sidebar navigation" : "Show sidebar navigation"}
            aria-expanded={isSidebarOpen}
            className={`flex items-center justify-center gap-1.5 px-2.5 h-9 rounded-lg transition-all cursor-pointer shrink-0 border focus:outline-none focus:ring-2 focus:ring-amber-500/30 active:scale-95 ${
              isSidebarOpen
                ? 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                : 'text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border-amber-300 dark:border-amber-700/60 shadow-2xs font-semibold'
            }`}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 hidden lg:block text-slate-700 dark:text-slate-300" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 hidden lg:block text-amber-700 dark:text-amber-400 font-bold" />
            )}
            
            {isSidebarOpen ? (
              <X className="w-4 h-4 lg:hidden text-slate-700 dark:text-slate-300" />
            ) : (
              <Menu className="w-4 h-4 lg:hidden text-slate-700 dark:text-slate-300" />
            )}

            <span className="hidden xl:inline text-xs font-semibold">
              {isSidebarOpen ? 'Hide' : 'Sidebar'}
            </span>
          </button>

          {/* School Crest / Logo */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {school.logoUrl ? (
              <img
                src={school.logoUrl}
                alt="Institution Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <School className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800 dark:text-amber-400" />
            )}
          </div>

          {/* Institution Name & Session */}
          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white truncate tracking-tight font-sans">
                {school.name}
              </h1>
              <span className="hidden xl:inline-block text-[10px] font-medium text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/50 px-1.5 py-0.5 rounded shrink-0">
                Session: {school.currentAcademicSession}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate font-sans">
              <span className="hidden sm:inline">Official </span>Certificate Management System
            </p>
          </div>
        </div>

        {/* Zone 2: Global Search (Desktop / Laptop / Tablet) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-2">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search student, roll no, or cert no..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Zone 3: Multi-Year Academic Session Selector, Theme Switcher & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Multi-Year Academic Session Switcher */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100/80 dark:hover:bg-slate-700/80 border border-amber-200 dark:border-slate-700 rounded-lg px-2 sm:px-2.5 py-1 text-xs shrink-0 shadow-2xs transition-colors">
            <Calendar className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
            <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 hidden lg:inline whitespace-nowrap">
              Session:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              title="Filter by Academic Session"
              className="bg-transparent text-xs font-bold text-amber-950 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[105px] sm:max-w-[145px] truncate"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Sessions</option>
              {availableYears.map((y) => (
                <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {y} {y === school.currentAcademicSession ? '★ Current' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Switcher: Light / Dark / System Default */}
          <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} variant="dropdown" />
          
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}
            title="Search certificates"
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            {isMobileSearchExpanded ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* Backup Button */}
          <button
            type="button"
            onClick={onBackupClick}
            title={lastBackupTime ? `Last local backup: ${new Date(lastBackupTime).toLocaleTimeString()}` : 'Download local backup (.json)'}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Backup</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 hidden lg:inline" />
          </button>

          {/* New Certificate Button */}
          <button
            type="button"
            onClick={onNewCertificateClick}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-400 dark:text-slate-950 rounded-lg hover:bg-slate-800 dark:hover:bg-amber-300 active:scale-95 transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">+ New Certificate</span>
            <span className="sm:hidden font-medium">New</span>
          </button>
        </div>

      </div>

      {/* Mobile Expandable Search Bar */}
      {isMobileSearchExpanded && (
        <div className="md:hidden mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search student, roll no, cert no..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
