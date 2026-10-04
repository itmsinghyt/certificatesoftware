import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { Theme } from '../utils/theme';

interface ThemeSwitcherProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  variant?: 'dropdown' | 'segmented';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  theme,
  onThemeChange,
  variant = 'dropdown',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options: { id: Theme; label: string; icon: typeof Sun; desc: string }[] = [
    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean white appearance' },
    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Eye-friendly deep dark' },
    { id: 'system', label: 'System', icon: Laptop, desc: 'Matches device settings' },
  ];

  const currentOption = options.find((o) => o.id === theme) || options[2];
  const CurrentIcon = currentOption.icon;

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl ${className}`}
        role="group"
        aria-label="Theme mode switcher"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onThemeChange(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={`${opt.label} Mode - ${opt.desc}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Theme: ${currentOption.label} (Click to switch)`}
        aria-label="Toggle theme mode"
        className="flex items-center justify-center gap-1.5 px-2.5 h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="hidden md:inline">{currentOption.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1">
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Theme Preference
          </div>

          <div className="space-y-0.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onThemeChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                    <div>
                      <span className="block">{opt.label}</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                        {opt.desc}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
