import React from 'react';
import { useAppContext } from '../store/AppContext';
import { format, subDays, getHours } from 'date-fns';
import { Flame, Route, Clock, Footprints } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, ReferenceLine } from 'recharts';

export function ActivityScreen() {
  const { stepRecords, settings } = useAppContext();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayRecord = stepRecords.find(r => r.date === today) || { steps: 0, distanceKm: 0, activeCalories: 0 };
  
  const progress = Math.min(100, (todayRecord.steps / settings.dailyStepTarget) * 100);

  // Mock hourly data
  const currentHour = getHours(new Date());
  const hourlyData = Array.from({ length: 24 }).map((_, i) => ({
    hour: `${i}:00`,
    steps: i <= currentHour ? Math.floor(Math.random() * 800) : 0
  }));

  // Weekly data
  const weeklyData = stepRecords.slice(0, 7).map(r => ({
    day: format(new Date(r.date), 'EEE'),
    steps: r.steps
  }));

  return (
    <div className="p-4 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Activity</h1>
        <p className="text-slate-500 dark:text-slate-400">{format(new Date(), 'EEEE, MMMM d')}</p>
      </header>

      {/* Hero Progress */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-mint-50 dark:bg-mint-900/10 rounded-full blur-3xl -mr-10 -mt-10" />
        
        <div className="relative w-48 h-48 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
            <circle 
              cx="60" cy="60" r="54" 
              className="stroke-mint-500" 
              strokeWidth="12" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={(2 * Math.PI * 54) - ((progress / 100) * (2 * Math.PI * 54))}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <Footprints className="w-6 h-6 text-mint-500 mb-1" />
            <span className="text-3xl font-black text-slate-900 dark:text-white">{todayRecord.steps.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Steps</span>
          </div>
        </div>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium">Goal: {settings.dailyStepTarget.toLocaleString()}</p>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-3 gap-3">
        <MetricBox icon={Route} label="Distance" value={`${todayRecord.distanceKm.toFixed(2)} km`} color="text-blue-500" />
        <MetricBox icon={Flame} label="Active" value={`${Math.round(todayRecord.activeCalories)} kcal`} color="text-amber-500" />
        <MetricBox icon={Clock} label="Move Time" value={`${Math.round(todayRecord.steps / 100)} min`} color="text-purple-500" />
      </section>

      {/* Weekly Trend */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white">7-Day Trend</h2>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <ReferenceLine y={settings.dailyStepTarget} stroke="#22c55e" strokeDasharray="3 3" />
              <Bar dataKey="steps" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Hourly Distribution */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white">Today's Distribution</h2>
        </div>
        <div className="flex items-end justify-between h-24 gap-1">
          {hourlyData.filter((_, i) => i % 2 === 0).map((data, i) => (
            <div key={i} className="flex flex-col items-center flex-1 gap-2">
              <div className="w-full bg-mint-50 dark:bg-slate-800 rounded-t-sm flex items-end justify-center h-full">
                <div 
                  className="w-full bg-mint-400 rounded-t-sm" 
                  style={{ height: `${Math.max(2, (data.steps / 800) * 100)}%` }} 
                />
              </div>
              <span className="text-[9px] text-slate-400">{i % 2 === 0 ? data.hour : ''}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricBox({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col gap-2 items-center text-center">
      <div className={cn("w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center", color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
