import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodItem, StepRecord, UserSettings } from '../types';
import { defaultSettings, mockFoodItems, mockStepRecords } from '../data/mockData';
import { format } from 'date-fns';

interface AppState {
  settings: UserSettings;
  foodItems: FoodItem[];
  stepRecords: StepRecord[];
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  addFoodItem: (item: FoodItem) => void;
  deleteFoodItem: (id: string) => void;
  addSteps: (steps: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('nutri_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('nutri_food');
    return saved ? JSON.parse(saved) : mockFoodItems;
  });

  const [stepRecords, setStepRecords] = useState<StepRecord[]>(() => {
    const saved = localStorage.getItem('nutri_steps');
    return saved ? JSON.parse(saved) : mockStepRecords;
  });

  useEffect(() => {
    localStorage.setItem('nutri_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('nutri_food', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('nutri_steps', JSON.stringify(stepRecords));
  }, [stepRecords]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addFoodItem = (item: FoodItem) => {
    setFoodItems(prev => [...prev, item]);
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems(prev => prev.filter(f => f.id !== id));
  };

  const addSteps = (steps: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setStepRecords(prev => {
      const todayRecord = prev.find(r => r.date === today);
      if (todayRecord) {
        return prev.map(r => 
          r.date === today 
            ? { ...r, steps: r.steps + steps, distanceKm: r.distanceKm + (steps * 0.0008), activeCalories: r.activeCalories + (steps * 0.04) } 
            : r
        );
      } else {
        return [...prev, { date: today, steps, distanceKm: steps * 0.0008, activeCalories: steps * 0.04 }];
      }
    });
  };

  return (
    <AppContext.Provider value={{ settings, foodItems, stepRecords, updateSettings, addFoodItem, deleteFoodItem, addSteps }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
