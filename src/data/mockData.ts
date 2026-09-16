import { FoodItem, MealType, StepRecord, UserSettings } from '../types';
import { format, subDays } from 'date-fns';

export const defaultSettings: UserSettings = {
  dailyCalorieTarget: 2100,
  dailyStepTarget: 10000,
  darkMode: true,
  highContrast: false,
  reducedMotion: false,
};

const today = format(new Date(), 'yyyy-MM-dd');

export const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 320,
    protein: 10,
    carbs: 55,
    fat: 6,
    mealType: MealType.BREAKFAST,
    date: today,
    isAiEstimate: false,
    portionMultiplier: 1,
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    calories: 450,
    protein: 45,
    carbs: 20,
    fat: 18,
    mealType: MealType.LUNCH,
    date: today,
    isAiEstimate: true,
    portionMultiplier: 1,
  }
];

export const mockStepRecords: StepRecord[] = Array.from({ length: 7 }).map((_, i) => {
  const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
  return {
    date,
    steps: 5000 + Math.floor(Math.random() * 6000),
    distanceKm: 4 + Math.random() * 4,
    activeCalories: 200 + Math.random() * 200,
  };
}).reverse();
