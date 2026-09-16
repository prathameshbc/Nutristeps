import React from 'react';
import { useAppContext } from '../store/AppContext';
import { format } from 'date-fns';
import { Camera, Plus, Footprints } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export function HomeScreen({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { settings, foodItems, stepRecords, addSteps, deleteFoodItem } = useAppContext();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayFoods = foodItems.filter(f => f.date === today);
  const consumedCalories = todayFoods.reduce((acc, f) => acc + (f.calories * f.portionMultiplier), 0);
  const remainingCalories = Math.max(0, settings.dailyCalorieTarget - consumedCalories);
  
  const todaySteps = stepRecords.find(r => r.date === today)?.steps || 0;
  const stepProgress = Math.min(100, (todaySteps / settings.dailyStepTarget) * 100);
  
  const protein = todayFoods.reduce((acc, f) => acc + (f.protein * f.portionMultiplier), 0);
  const carbs = todayFoods.reduce((acc, f) => acc + (f.carbs * f.portionMultiplier), 0);
  const fat = todayFoods.reduce((acc, f) => acc + (f.fat * f.portionMultiplier), 0);
  
  // Progress Ring math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (Math.min(100, (consumedCalories / settings.dailyCalorieTarget) * 100) / 100) * circumference;

  return (
    <div className="p-4 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good morning, Alex</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's your summary for today</p>
      </header>

      {/* Calories Card */}
      <section className="bg-teal-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-800 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h2 className="text-teal-100 font-medium">Calories Remaining</h2>
            <p className="text-4xl font-bold mt-1">{Math.round(remainingCalories)}</p>
            <p className="text-sm text-teal-200 mt-1">Goal: {settings.dailyCalorieTarget} kcal</p>
          </div>
          
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} className="stroke-teal-800" strokeWidth="8" fill="none" />
              <motion.circle 
                cx="60" cy="60" r={radius} 
                className="stroke-mint-400" 
                strokeWidth="8" 
                fill="none" 
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-bold">{Math.round(consumedCalories)}</span>
              <span className="text-[10px] text-teal-200 uppercase tracking-wider">Eaten</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 relative z-10 bg-teal-950/30 p-3 rounded-2xl">
          <MacroBar label="Protein" value={protein} letter="P" color="bg-blue-400" />
          <MacroBar label="Carbs" value={carbs} letter="C" color="bg-amber-400" />
          <MacroBar label="Fat" value={fat} letter="F" color="bg-rose-400" />
        </div>
      </section>

      {/* Steps Card */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-mint-100 dark:bg-mint-900/30 rounded-full flex items-center justify-center text-mint-600 dark:text-mint-400">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Steps Today</h2>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {todaySteps.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ {settings.dailyStepTarget.toLocaleString()}</span>
            </p>
          </div>
        </div>
        <button 
          onClick={() => addSteps(500)}
          className="px-3 py-1.5 bg-mint-50 dark:bg-slate-800 text-mint-700 dark:text-mint-400 font-medium text-sm rounded-full hover:bg-mint-100 transition-colors focus:ring-2 focus:ring-mint-500 outline-none"
        >
          +500
        </button>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('scanner')}
          className="bg-slate-900 dark:bg-slate-800 text-white rounded-3xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors min-h-[100px] focus:ring-2 focus:ring-mint-500 outline-none"
        >
          <Camera className="w-6 h-6" />
          <span className="font-medium">Scan Food</span>
        </button>
        <button 
          onClick={() => onNavigate('diary')}
          className="bg-mint-500 text-white rounded-3xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-mint-600 transition-colors min-h-[100px] focus:ring-2 focus:ring-mint-500 outline-none"
        >
          <Plus className="w-6 h-6" />
          <span className="font-medium">Add Manual</span>
        </button>
      </section>

      {/* Today's Meals */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Meals</h2>
          <button onClick={() => onNavigate('diary')} className="text-mint-600 dark:text-mint-400 text-sm font-medium p-2">View All</button>
        </div>
        
        {todayFoods.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 text-center border border-slate-100 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">No meals logged yet today.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todayFoods.map(food => (
              <div key={food.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">{food.name}</span>
                    {food.isAiEstimate && <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">AI</span>}
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{food.mealType} • {food.portionMultiplier}x portion</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-slate-900 dark:text-white">{Math.round(food.calories * food.portionMultiplier)} kcal</span>
                  <button onClick={() => deleteFoodItem(food.id)} className="text-xs text-red-500 font-medium p-1 -mr-1">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MacroBar({ label, value, letter, color }: { label: string, value: number, letter: string, color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className={cn("w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold text-white", color)}>{letter}</span>
        <span className="text-xs text-teal-100">{label}</span>
      </div>
      <span className="font-semibold text-sm">{Math.round(value)}g</span>
    </div>
  );
}
