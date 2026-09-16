import React from 'react';
import { useAppContext } from '../store/AppContext';
import { format } from 'date-fns';
import { MealType } from '../types';
import { Plus, Flame, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export function DiaryScreen() {
  const { foodItems, settings, deleteFoodItem } = useAppContext();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayFoods = foodItems.filter(f => f.date === today);

  const mealGroups = Object.values(MealType).map(type => {
    const foods = todayFoods.filter(f => f.mealType === type);
    const calories = foods.reduce((acc, f) => acc + (f.calories * f.portionMultiplier), 0);
    return { type, foods, calories };
  });

  const totalCalories = todayFoods.reduce((acc, f) => acc + (f.calories * f.portionMultiplier), 0);
  const remaining = Math.max(0, settings.dailyCalorieTarget - totalCalories);

  return (
    <div className="p-4 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Food Diary</h1>
        <p className="text-slate-500 dark:text-slate-400">{format(new Date(), 'EEEE, MMMM d')}</p>
      </header>

      {/* Summary Bar */}
      <section className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Remaining</p>
            <p className="text-xl font-bold">{Math.round(remaining)} <span className="text-sm font-normal text-slate-400">/ {settings.dailyCalorieTarget}</span></p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Consumed</p>
          <p className="text-xl font-bold">{Math.round(totalCalories)} kcal</p>
        </div>
      </section>

      {/* Meal Sections */}
      <div className="flex flex-col gap-6">
        {mealGroups.map(group => (
          <section key={group.type}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{group.type}</h2>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{Math.round(group.calories)} kcal</span>
              </div>
              <button 
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-mint-500 outline-none"
                aria-label={`Add to ${group.type}`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {group.foods.length === 0 ? (
              <div className="bg-transparent border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
                <p className="text-slate-400 dark:text-slate-500 text-sm">Tap + to log {group.type.toLowerCase()}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {group.foods.map(food => (
                  <div key={food.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-lg">{food.name}</span>
                        {food.isAiEstimate && (
                          <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                            <Sparkles className="w-3 h-3" /> AI
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-mint-600 dark:text-mint-400 text-lg">{Math.round(food.calories * food.portionMultiplier)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Portion: {food.portionMultiplier}x</p>
                      
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400"><span className="text-slate-900 dark:text-white">{Math.round(food.protein * food.portionMultiplier)}g</span> P</span>
                        <span className="text-slate-600 dark:text-slate-400"><span className="text-slate-900 dark:text-white">{Math.round(food.carbs * food.portionMultiplier)}g</span> C</span>
                        <span className="text-slate-600 dark:text-slate-400"><span className="text-slate-900 dark:text-white">{Math.round(food.fat * food.portionMultiplier)}g</span> F</span>
                        <button 
                          onClick={() => deleteFoodItem(food.id)}
                          className="ml-2 text-red-500 hover:text-red-600 p-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
