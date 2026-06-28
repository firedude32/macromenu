// Recommendation engine for the restaurant page's "Best for you" mode
// (SPEC.md §5.4 mode B, §5.5, §10). Pure functions only — combos and items
// are merged into a single scorable shape, scored with the real fit-score
// math from score.ts, and grouped into goal buckets. No numbers here are
// invented: every Macros value traces back to src/data/.

import type { Combo, Goal, Macros, UserProfile } from '../data/types';
import { combos, menuItems } from '../data';
import { fitScore } from './score';

export interface Recommendable extends Macros {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  verified: boolean;
  kind: 'item' | 'combo';
  /** The "Order:" build description (SPEC §5.5). */
  orderLine: string;
}

export interface ScoredRecommendable extends Recommendable {
  score: number;
}

function comboOrderLine(combo: Combo): string {
  return combo.components
    .map((c) => (c.qty > 1 ? `${c.qty}× ${c.name}` : c.name))
    .join(', ');
}

/**
 * All recommendable picks for a restaurant: standalone menu items plus
 * pre-built combos. Chipotle's raw "Components" (rice, salsa, etc.) are
 * building blocks, not orderable picks on their own, so they're excluded —
 * the Chipotle bowls in combos.ts are what gets recommended there.
 */
export function restaurantRecommendables(restaurantId: string): Recommendable[] {
  const items: Recommendable[] = menuItems
    .filter((i) => i.restaurantId === restaurantId && i.category !== 'Components')
    .map((i) => ({
      id: i.id,
      restaurantId: i.restaurantId,
      name: i.name,
      category: i.category,
      cal: i.cal,
      protein: i.protein,
      carbs: i.carbs,
      fat: i.fat,
      verified: i.verified,
      kind: 'item',
      orderLine: i.name,
    }));

  const comboPicks: Recommendable[] = combos
    .filter((c) => c.restaurantId === restaurantId)
    .map((c) => ({
      id: c.id,
      restaurantId: c.restaurantId,
      name: c.name,
      category: 'Combos',
      cal: c.cal,
      protein: c.protein,
      carbs: c.carbs,
      fat: c.fat,
      verified: c.verified,
      kind: 'combo',
      orderLine: comboOrderLine(c),
    }));

  return [...items, ...comboPicks];
}

/** Recommendables scored for a user and sorted score descending. */
export function scoredRecommendables(
  restaurantId: string,
  user: UserProfile,
): ScoredRecommendable[] {
  return restaurantRecommendables(restaurantId)
    .map((r) => ({ ...r, score: fitScore(r, user) }))
    .sort((a, b) => b.score - a.score);
}

export interface RecommendationBucket {
  key: string;
  emoji: string;
  title: string;
  items: ScoredRecommendable[];
}

const GOAL_WORD: Record<Goal, string> = {
  cut: 'cutting',
  maintain: 'maintaining',
  bulk: 'bulking',
};

/** "Why this pick" sentence from real macros, per the §10 templates. */
export function whyThisPick(item: Macros, user: UserProfile): string {
  const meals = user.mealsPerDay ?? 3;
  const tCal = user.dailyCal / meals;
  const tP = user.dailyProtein / meals;
  const density = item.protein / Math.max(item.cal, 1);
  const goalWord = GOAL_WORD[user.goal];

  if (item.cal <= tCal * 0.5) {
    return `Only ${item.cal} cal with ${item.protein}g protein — a lean, high-value pick.`;
  }
  if (density >= 0.08 && item.protein >= tP * 0.3) {
    return `${item.protein}g of protein while staying under your calorie ceiling — ideal for ${goalWord}.`;
  }
  return `A balanced ${item.cal}-cal plate that fits your ${goalWord} targets cleanly.`;
}

/** Goal-based buckets for the restaurant page's "Best for you" mode (SPEC §5.4). */
export function recommendationBuckets(
  restaurantId: string,
  user: UserProfile,
): RecommendationBucket[] {
  const meals = user.mealsPerDay ?? 3;
  const tCal = user.dailyCal / meals;
  const all = scoredRecommendables(restaurantId, user);
  const buckets: RecommendationBucket[] = [];

  const bestForMe = all.slice(0, 5);
  if (bestForMe.length) {
    buckets.push({ key: 'best', emoji: '⭐', title: 'Best For Me', items: bestForMe });
  }

  const highProtein = all
    .filter((i) => i.protein / Math.max(i.cal, 1) >= 0.08)
    .slice(0, 5);
  if (highProtein.length) {
    buckets.push({ key: 'protein', emoji: '🍗', title: 'High Protein', items: highProtein });
  }

  const slightlyBetter = all.filter((i) => i.score >= 55 && i.score <= 79).slice(0, 5);
  if (slightlyBetter.length) {
    buckets.push({ key: 'slightly', emoji: '📈', title: 'Slightly Better', items: slightlyBetter });
  }

  const lowCalDrinks = all.filter((i) => i.category === 'Drinks' && i.cal < 60);
  if (lowCalDrinks.length) {
    buckets.push({ key: 'drinks', emoji: '🥤', title: 'Low Calorie Drinks', items: lowCalDrinks });
  }

  if (user.goal === 'cut') {
    const fatLossFriendly = all.filter((i) => i.cal <= tCal * 0.85).slice(0, 5);
    if (fatLossFriendly.length) {
      buckets.push({ key: 'fatloss', emoji: '🥗', title: 'Fat-Loss Friendly', items: fatLossFriendly });
    }
  }
  if (user.goal === 'bulk') {
    const massBuilder = all.filter((i) => i.cal >= tCal * 0.9).slice(0, 5);
    if (massBuilder.length) {
      buckets.push({ key: 'mass', emoji: '💪', title: 'Mass Builder', items: massBuilder });
    }
  }

  return buckets;
}
