import React from 'react';
import { Home, Camera, Activity, LineChart, Book } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: any) => void;
}

export function BottomNav({ currentTab, onNavigate }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'diary', icon: Book, label: 'Diary' },
    { id: 'scanner', icon: Camera, label: 'Scan' },
    { id: 'activity', icon: Activity, label: 'Activity' },
    { id: 'insights', icon: LineChart, label: 'Insights' },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 pb-safe z-20">
      <div className="flex justify-around items-center h-16">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          const isScanner = tab.id === 'scanner';
          
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full min-w-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-500",
                isScanner ? "relative -top-5" : ""
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isScanner ? (
                <div className="bg-teal-600 text-white p-4 rounded-[20px] shadow-lg hover:bg-teal-700 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
              ) : (
                <>
                  <div className={cn(
                    "px-4 py-1 rounded-full transition-colors",
                    isActive ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-[10px] mt-1 font-medium",
                    isActive ? "text-teal-700 dark:text-teal-300" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {tab.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
