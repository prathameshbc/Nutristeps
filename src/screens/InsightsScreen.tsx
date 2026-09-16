import React from 'react';
import { useAppContext } from '../store/AppContext';
import { format, subDays } from 'date-fns';
import { Flame, Trophy, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, ReferenceLine } from 'recharts';

export function InsightsScreen() {
  const { stepRecords, settings } = useAppContext();
  
  const last7Days = stepRecords.slice(0, 7);
  const avgSteps = last7Days.reduce((acc, r) => acc + r.steps, 0) / Math.max(1, last7Days.length);
  
  // Mock Calorie data for 7 days
  const calorieData = Array.from({ length: 7 }).map((_, i) => ({
    day: format(subDays(new Date(), 6 - i), 'EEE'),
    calories: 1600 + Math.random() * 800
  }));

  const stepData = last7Days.map(r => ({
    day: format(new Date(r.date), 'EEE'),
    steps: r.steps
  })).reverse();

  return (
    <div className="p-4 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Insights</h1>
        <p className="text-slate-500 dark:text-slate-400">Your weekly progress</p>
      </header>

      {/* Streaks & Goals */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-5 text-white flex flex-col gap-2">
          <Flame className="w-8 h-8 opacity-80" />
          <div>
            <p className="text-3xl font-black">5</p>
            <p className="text-sm font-medium opacity-90">Day Streak</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-mint-500 to-teal-600 rounded-3xl p-5 text-white flex flex-col gap-2">
          <Trophy className="w-8 h-8 opacity-80" />
          <div>
            <p className="text-3xl font-black">85%</p>
            <p className="text-sm font-medium opacity-90">Goal Completion</p>
          </div>
        </div>
      </section>

      {/* Averages */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-mint-500" />
            Weekly Averages
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 divide-x divide-slate-100 dark:divide-slate-800">
          <div className="flex flex-col items-center">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Steps / Day</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(avgSteps).toLocaleString()}</p>
          </div>
          <div className="flex flex-col items-center pl-4">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Calories / Day</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">1,860</p>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">7-Day Calorie Intake</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px' }} />
                <ReferenceLine y={settings.dailyCalorieTarget} stroke="#f59e0b" strokeDasharray="3 3" />
                <Bar dataKey="calories" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">7-Day Step Count</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px' }} />
                <ReferenceLine y={settings.dailyStepTarget} stroke="#22c55e" strokeDasharray="3 3" />
                <Bar dataKey="steps" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
