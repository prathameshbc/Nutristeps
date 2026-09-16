import React, { useState, useEffect } from 'react';
import { Camera, Zap, Image as ImageIcon, Sparkles, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../store/AppContext';
import { MealType } from '../types';
import { format } from 'date-fns';

export function ScannerScreen({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [stage, setStage] = useState<'camera' | 'analyzing' | 'result'>('camera');
  
  // Camera Stage
  if (stage === 'camera') {
    return (
      <div className="h-full bg-black relative flex flex-col text-white">
        <div className="flex-1 relative flex items-center justify-center">
          {/* Simulated Viewfinder */}
          <div className="absolute inset-0 bg-slate-900" />
          <div className="w-64 h-64 border-2 border-white/30 relative z-10">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-mint-400" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-mint-400" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-mint-400" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-mint-400" />
          </div>
          <div className="absolute bottom-1/4 text-center z-10 w-full">
            <p className="bg-black/50 inline-block px-4 py-2 rounded-full text-sm font-medium">Center food in frame</p>
          </div>
        </div>
        
        <div className="h-48 bg-black flex items-center justify-around pb-8 px-6">
          <button className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center focus:ring-2 focus:ring-mint-500">
            <Zap className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => {
              setStage('analyzing');
              setTimeout(() => setStage('result'), 1500);
            }}
            className="w-20 h-20 rounded-full border-4 border-slate-300 flex items-center justify-center focus:ring-4 focus:ring-mint-500"
            aria-label="Capture photo"
          >
            <div className="w-16 h-16 bg-white rounded-full" />
          </button>
          
          <button className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center focus:ring-2 focus:ring-mint-500">
            <ImageIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  // Analyzing Stage
  if (stage === 'analyzing') {
    return (
      <div className="h-full bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8"
        >
          <Sparkles className="w-16 h-16 text-mint-400" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Analyzing Food</h2>
        <p className="text-slate-400 text-center">On-device neural model is estimating nutritional values...</p>
      </div>
    );
  }

  return <ResultScreen onNavigate={onNavigate} />;
}

function ResultScreen({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { addFoodItem } = useAppContext();
  const [multiplier, setMultiplier] = useState(1);
  const [mealType, setMealType] = useState<MealType>(MealType.LUNCH);
  
  const baseCalories = 520;
  const baseProtein = 35;
  const baseCarbs = 42;
  const baseFat = 24;

  const handleSave = () => {
    addFoodItem({
      id: Math.random().toString(),
      name: 'Avocado Toast with Egg',
      calories: baseCalories,
      protein: baseProtein,
      carbs: baseCarbs,
      fat: baseFat,
      mealType,
      date: format(new Date(), 'yyyy-MM-dd'),
      isAiEstimate: true,
      portionMultiplier: multiplier
    });
    onNavigate('home');
  };

  return (
    <div className="p-4 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Avocado Toast</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">with Fried Egg</p>
          </div>
          <div className="bg-mint-100 dark:bg-mint-900/40 text-mint-700 dark:text-mint-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            94% Match
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-6">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block" />
            AI Estimates
          </p>
          <div className="flex justify-between items-end mb-4">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{Math.round(baseCalories * multiplier)} <span className="text-lg font-normal text-slate-500">kcal</span></span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Protein</p>
              <p className="font-semibold text-slate-900 dark:text-white">{Math.round(baseProtein * multiplier)}g</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Carbs</p>
              <p className="font-semibold text-slate-900 dark:text-white">{Math.round(baseCarbs * multiplier)}g</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Fat</p>
              <p className="font-semibold text-slate-900 dark:text-white">{Math.round(baseFat * multiplier)}g</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-slate-900 dark:text-white mb-3">Portion Size</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1">
              <button 
                onClick={() => setMultiplier(Math.max(0.25, multiplier - 0.25))}
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm"
              >
                <Minus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
              <span className="w-16 text-center font-bold text-slate-900 dark:text-white">{multiplier}x</span>
              <button 
                onClick={() => setMultiplier(multiplier + 0.25)}
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm"
              >
                <Plus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[0.5, 1.0, 1.5].map(val => (
                <button 
                  key={val}
                  onClick={() => setMultiplier(val)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap",
                    multiplier === val 
                      ? "bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 border-transparent" 
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  )}
                >
                  {val}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-slate-900 dark:text-white mb-3">Meal</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(MealType).map(type => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={cn(
                  "p-3 rounded-2xl text-sm font-medium border text-center transition-colors",
                  mealType === type
                    ? "bg-mint-50 dark:bg-mint-900/30 border-mint-200 dark:border-mint-800 text-mint-700 dark:text-mint-300"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-mint-500 text-white rounded-full py-4 font-bold text-lg hover:bg-mint-600 transition-colors shadow-lg shadow-mint-500/25 focus:ring-4 focus:ring-mint-500 outline-none"
      >
        Add to Diary
      </button>
    </div>
  );
}
