import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  FileBadge2,
  FileCheck2,
  Users,
  HardDriveDownload,
  Settings,
  Palette,
  X,
  PanelLeftClose,
  School,
} from 'lucide-react';
import { SchoolProfile, Student, Certificate } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'issue'
  | 'templates'
  | 'certificates'
  | 'students'
  | 'backup'
  | 'settings';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  studentCount?: number;
  certificateCount?: number;
  lastBackupTime?: string | null;
  school?: SchoolProfile;
  selectedYear?: string;
  onYearChange?: (year: string) => void;
  availableYears?: string[];
  students?: Student[];
  certificates?: Certificate[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  studentCount = 0,
  certificateCount = 0,
  school,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'issue' as ActiveTab,
      label: 'Issue Certificate',
      icon: FileBadge2,
    },
    {
      id: 'templates' as ActiveTab,
      label: 'Templates',
      icon: Palette,
    },
    {
      id: 'certificates' as ActiveTab,
      label: 'Certificates',
      icon: FileCheck2,
      badge: certificateCount,
    },
    {
      id: 'students' as ActiveTab,
      label: 'Students',
      icon: Users,
      badge: studentCount,
    },
    {
      id: 'backup' as ActiveTab,
      label: 'Backup & Restore',
      icon: HardDriveDownload,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleItemClick = (id: ActiveTab) => {
    onTabChange(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sidebarContent = (
    <div className="flex flex-col h-full min-h-0 bg-slate-900 text-slate-200 select-none">
      {/* Top Header: System navigation identity & close button */}
      <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <FileBadge2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-bold text-white tracking-tight">
              Certificate Portal
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">
              Navigation Menu
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          title="Close sidebar (Ctrl+B)"
          aria-label="Close sidebar"
          className="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
        >
          <PanelLeftClose className="w-4 h-4 hidden lg:block" />
          <X className="w-4 h-4 lg:hidden" />
        </button>
      </div>

      {/* Navigation Menu: Only options, cleanly spaced */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto overscroll-contain">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left group ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 font-semibold shadow-xs border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {/* Left active accent bar */}
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-amber-400 rounded-r-full" />
              )}

              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate text-[13px]">{item.label}</span>
              </div>

              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-full shrink-0 font-medium ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: Clean collapse toggle in English */}
      <div className="p-3 border-t border-slate-800/80 shrink-0">
        <button
          type="button"
          onClick={onClose}
          title="Collapse sidebar (Ctrl+B)"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <PanelLeftClose className="w-3.5 h-3.5" />
            <span>Collapse Sidebar</span>
          </span>
          <kbd className="hidden lg:inline text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
            Ctrl+B
          </kbd>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile & Tablet Backdrop Overlay (< lg) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* 2. Mobile & Tablet Slide-Over Drawer (< lg) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* 3. Desktop / Laptop In-Flow Collapsible Sidebar (>= lg) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 h-full border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out no-print ${
          isOpen
            ? 'w-64 opacity-100'
            : 'w-0 opacity-0 overflow-hidden pointer-events-none border-r-0'
        }`}
      >
        <div className="w-64 h-full flex flex-col min-h-0">{sidebarContent}</div>
      </aside>
    </>
  );
};
