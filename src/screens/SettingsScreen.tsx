import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Moon, Eye, Activity, ShieldCheck, Download, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function SettingsScreen({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { settings, updateSettings } = useAppContext();

  return (
    <div className="p-4 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings & Privacy</h1>
      </header>

      {/* Privacy Badge */}
      <div className="bg-teal-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-800 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-teal-800 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-mint-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">100% On-Device & Private</h2>
            <p className="text-teal-200 text-sm leading-relaxed">
              Your health data never leaves this device. We do not use cloud databases or telemetry. 
              The AI model runs locally on your hardware.
            </p>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">Appearance & Accessibility</h3>
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          
          <ToggleRow 
            icon={Moon} 
            label="Dark Mode" 
            checked={settings.darkMode} 
            onChange={(checked) => updateSettings({ darkMode: checked })} 
          />
          
          <ToggleRow 
            icon={Eye} 
            label="High Contrast" 
            description="Increases border contrast for WCAG AAA compliance"
            checked={settings.highContrast} 
            onChange={(checked) => updateSettings({ highContrast: checked })} 
          />
          
          <ToggleRow 
            icon={Activity} 
            label="Reduced Motion" 
            description="Disables UI animations and transitions"
            checked={settings.reducedMotion} 
            onChange={(checked) => updateSettings({ reducedMotion: checked })} 
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">Daily Goals</h3>
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="calorie-target" className="font-medium text-slate-900 dark:text-white">Calorie Target</label>
              <span className="font-bold text-mint-600 dark:text-mint-400">{settings.dailyCalorieTarget} kcal</span>
            </div>
            <input 
              id="calorie-target"
              type="range" 
              min="1200" 
              max="3500" 
              step="50"
              value={settings.dailyCalorieTarget}
              onChange={(e) => updateSettings({ dailyCalorieTarget: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-mint-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="step-target" className="font-medium text-slate-900 dark:text-white">Step Target</label>
              <span className="font-bold text-mint-600 dark:text-mint-400">{settings.dailyStepTarget.toLocaleString()} steps</span>
            </div>
            <input 
              id="step-target"
              type="range" 
              min="4000" 
              max="20000" 
              step="500"
              value={settings.dailyStepTarget}
              onChange={(e) => updateSettings({ dailyStepTarget: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-mint-500"
            />
          </div>

        </div>
      </section>

      <section className="pb-8">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">Data Management</h3>
        <div className="flex flex-col gap-3">
          <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full py-4 px-6 font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-5 h-5" />
            Export Data
          </button>
          <button className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full py-4 px-6 font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            <Trash2 className="w-5 h-5" />
            Reset Sample Data
          </button>
        </div>
      </section>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, description, checked, onChange }: { icon: any, label: string, description?: string, checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">{label}</span>
          {description && <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-[200px]">{description}</span>}
        </div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-mint-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
          checked ? "bg-mint-500" : "bg-slate-300 dark:bg-slate-700"
        )}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span 
          className={cn(
            "block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out absolute top-1",
            checked ? "translate-x-7" : "translate-x-1"
          )} 
        />
      </button>
    </div>
  );
}
