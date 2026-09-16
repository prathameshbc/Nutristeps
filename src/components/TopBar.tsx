import React from 'react';
import { Settings, ShieldCheck, ArrowLeft } from 'lucide-react';

interface TopBarProps {
  currentTab: string;
  onNavigate: (tab: any) => void;
}

export function TopBar({ currentTab, onNavigate }: TopBarProps) {
  const isSubScreen = currentTab === 'diary' || currentTab === 'settings' || currentTab === 'scanner';

  return (
    <header className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-2">
        {isSubScreen && (
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-mint-500 outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-slate-800 dark:text-slate-200" />
          </button>
        )}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 rounded-full border border-teal-100 dark:border-teal-800/50">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-xs font-medium text-teal-700 dark:text-teal-300">100% Private</span>
        </div>
      </div>
      
      {!isSubScreen && (
        <button 
          onClick={() => onNavigate('settings')}
          className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-mint-500 outline-none"
          aria-label="Settings"
        >
          <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
      )}
    </header>
  );
}
