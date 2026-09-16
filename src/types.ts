export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  SNACK = 'Snack',
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: MealType;
  date: string;
  isAiEstimate: boolean;
  portionMultiplier: number;
}

export interface StepRecord {
  date: string;
  steps: number;
  distanceKm: number;
  activeCalories: number;
}

export interface UserSettings {
  dailyCalorieTarget: number;
  dailyStepTarget: number;
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}
