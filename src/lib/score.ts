// 0–100 fit score + tier/color helpers (SPEC §6, §3.4). Pure functions.
//
// Structure follows §6 exactly: four sub-scores (protein density, calorie fit,
// protein adequacy, macro balance) blended with goal-dependent weights, then
// rounded to 0–100. Two deliberate calibrations follow §6's directive to
// "calibrate so genuinely great picks land in the 90s":
//   1. calFit is lean-friendly — a pick at or under its per-meal calorie target
//      is not penalized (lean, protein-dense picks shouldn't lose points for
//      being light); only going over target costs.
//   2. Weights are density-forward. The product's whole point is protein
//      quality, and §6's illustrative weights alone don't lift the named
//      examples (a double-chicken Chipotle bowl, CFA grilled nuggets) into the
//      90s, so density carries more of the blend.

import type { Goal, Macros, UserProfile } from '../data/types';
import { MACRO_SPLITS } from './tdee';

const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

/** protein per 100 cal where 12 = elite (1.0). */
const DENSITY_ELITE = 12;

const GOAL_WEIGHTS: Record<
  Goal,
  { density: number; calFit: number; pAdequacy: number; balance: number }
> = {
  cut: { density: 0.7, calFit: 0.14, pAdequacy: 0.08, balance: 0.08 },
  maintain: { density: 0.68, calFit: 0.14, pAdequacy: 0.1, balance: 0.08 },
  bulk: { density: 0.56, calFit: 0.1, pAdequacy: 0.26, balance: 0.08 },
};

/** Macro calorie fractions (protein/carbs/fat as a share of total kcal). */
function macroFractions(m: Macros): { p: number; c: number; f: number } {
  const p = m.protein * 4;
  const c = m.carbs * 4;
  const f = m.fat * 9;
  const total = Math.max(p + c + f, 1);
  return { p: p / total, c: c / total, f: f / total };
}

/** 0..1 closeness of an item's macro ratios to the user's goal split. */
function macroRatioSimilarity(item: Macros, goal: Goal): number {
  const split = MACRO_SPLITS[goal];
  const fr = macroFractions(item);
  const dist =
    Math.abs(fr.p - split.protein) +
    Math.abs(fr.c - split.carbs) +
    Math.abs(fr.f - split.fat);
  // Max possible L1 distance between two distributions is 2.
  return clamp(1 - dist / 2, 0, 1);
}

export interface ScoreBreakdown {
  score: number;
  density: number;
  calFit: number;
  pAdequacy: number;
  balance: number;
}

const mealsFor = (user: UserProfile, override?: number): number =>
  override ?? user.mealsPerDay ?? 3;

/** Full breakdown of an item/combo's fit for a user (handy for debugging). */
export function fitScoreBreakdown(
  item: Macros,
  user: UserProfile,
  mealsPerDay?: number,
): ScoreBreakdown {
  const meals = mealsFor(user, mealsPerDay);
  const tCal = user.dailyCal / meals;
  const tP = user.dailyProtein / meals;

  const density = clamp(((item.protein / Math.max(item.cal, 1)) * 100) / DENSITY_ELITE, 0, 1);
  const pAdequacy = clamp(item.protein / Math.max(tP, 1), 0, 1.2) / 1.2;
  // Lean-friendly: at/under per-meal calories = full marks; over target is penalized.
  const calFit = item.cal <= tCal ? 1 : clamp(1 - (item.cal - tCal) / tCal, 0, 1);
  const balance = macroRatioSimilarity(item, user.goal);

  const w = GOAL_WEIGHTS[user.goal];
  const s =
    w.density * density +
    w.calFit * calFit +
    w.pAdequacy * pAdequacy +
    w.balance * balance;

  return {
    score: Math.round(clamp(s, 0, 1) * 100),
    density,
    calFit,
    pAdequacy,
    balance,
  };
}

/** 0–100 fit score for an item/combo given the user's goal & targets. */
export function fitScore(item: Macros, user: UserProfile, mealsPerDay?: number): number {
  return fitScoreBreakdown(item, user, mealsPerDay).score;
}

export type ScoreTier = 'EXCELLENT' | 'GREAT' | 'SOLID' | 'GOOD' | 'OKAY';

/** Tier label for a 0–100 score (SPEC §3.4). */
export function scoreTier(score: number): ScoreTier {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 80) return 'GREAT';
  if (score >= 70) return 'SOLID';
  if (score >= 55) return 'GOOD';
  return 'OKAY';
}

/**
 * Ring color for a score, as a design-token key (SPEC §3.4):
 *   ≥80 bright green · 70–79 green · 55–69 amber · <55 grey.
 * Returns a token name (never a raw hex) so components map it to the
 * Tailwind / CSS-var palette.
 */
export type ScoreColorToken = 'green-bright' | 'green-primary' | 'carbs' | 'ink-soft';

export function scoreColor(score: number): ScoreColorToken {
  if (score >= 80) return 'green-bright';
  if (score >= 70) return 'green-primary';
  if (score >= 55) return 'carbs';
  return 'ink-soft';
}
