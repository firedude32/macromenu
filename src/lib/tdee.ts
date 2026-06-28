// Mifflin-St Jeor TDEE + macro math (SPEC §8). Pure functions — no side
// effects, no I/O — so onboarding and Edit Preferences can recompute a user's
// daily targets deterministically.

import type { ActivityLevel, Goal, Sex } from '../data/types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

/** Macro split per goal, as fractions of total calories (P / C / F). */
export const MACRO_SPLITS: Record<Goal, { protein: number; carbs: number; fat: number }> = {
  cut: { protein: 0.4, carbs: 0.3, fat: 0.3 },
  maintain: { protein: 0.25, carbs: 0.45, fat: 0.3 },
  bulk: { protein: 0.3, carbs: 0.45, fat: 0.25 },
};

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export const lbToKg = (lb: number): number => lb * LB_TO_KG;
export const inToCm = (inch: number): number => inch * IN_TO_CM;

export interface BodyStats {
  weightLb: number;
  heightIn: number;
  age: number;
  sex: Sex;
}

/** Basal metabolic rate (Mifflin-St Jeor). */
export function mifflinBMR({ weightLb, heightIn, age, sex }: BodyStats): number {
  const base = 10 * lbToKg(weightLb) + 6.25 * inToCm(heightIn) - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

/** Total daily energy expenditure = BMR × activity multiplier. */
export function tdee(stats: BodyStats & { activity: ActivityLevel }): number {
  return mifflinBMR(stats) * ACTIVITY_MULTIPLIERS[stats.activity];
}

/** Goal-adjusted calorie target: cut −20%, maintain ±0, bulk +10%. */
export function goalCalories(tdeeValue: number, goal: Goal): number {
  if (goal === 'cut') return tdeeValue * 0.8;
  if (goal === 'bulk') return tdeeValue * 1.1;
  return tdeeValue;
}

export interface MacroTargets {
  dailyCal: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

/** Split a calorie target into protein/carbs/fat grams (4/4/9 kcal per g). */
export function macroTargets(cal: number, goal: Goal): MacroTargets {
  const split = MACRO_SPLITS[goal];
  return {
    dailyCal: Math.round(cal),
    dailyProtein: Math.round((split.protein * cal) / 4),
    dailyCarbs: Math.round((split.carbs * cal) / 4),
    dailyFat: Math.round((split.fat * cal) / 9),
  };
}

/** Full pipeline: body stats + activity + goal → daily calorie & macro targets. */
export function computeTargets(
  stats: BodyStats & { activity: ActivityLevel; goal: Goal },
): MacroTargets {
  return macroTargets(goalCalories(tdee(stats), stats.goal), stats.goal);
}
