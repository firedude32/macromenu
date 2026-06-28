// Typed data models for MacroMenu.
//
// These interfaces are deliberately normalized (restaurants, menu items, and
// combos in separate collections joined by id) so the seed in this folder can
// move to a real database later without touching any component. Every nutrition
// value lives in src/data/ and is human-audited — never AI-generated, estimated,
// or fetched from an external API.

export type Sex = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'veryActive';

export type Goal = 'cut' | 'maintain' | 'bulk';

/** Live (tappable into a menu) vs. listed-but-not-yet-audited. */
export type RestaurantStatus = 'verified' | 'auditPending';

/** The four numbers we display everywhere. cal = kcal; the rest in grams. */
export interface Macros {
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MenuItem extends Macros {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  /** Every seeded item is audited against the restaurant's official data. */
  verified: boolean;
  source: string;
  auditedOn: string; // ISO date (YYYY-MM-DD)
  /** Flagged in SPEC §9 with "(verify)" — re-check this value before launch. */
  needsVerify?: boolean;
  servingSize?: string;
  allergens?: string[];
}

/** One line of a combo's "Order:" build, e.g. "2× Chicken". */
export interface ComboComponent {
  name: string;
  qty: number;
  /** Optional FK to the MenuItem this component corresponds to. */
  itemId?: string;
}

/**
 * A pre-built recommendation (Chipotle bowls, CFA nugget combos). Totals are
 * the official/audited values from SPEC §9 (or the exact sum of audited
 * components — never an estimate).
 */
export interface Combo extends Macros {
  id: string;
  restaurantId: string;
  name: string;
  components: ComboComponent[];
  verified: boolean;
  source: string;
  auditedOn: string;
  /** True when the totals are the deterministic sum of audited components. */
  derivedFromComponents?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  status: RestaurantStatus;
  source?: string;
  auditedOn?: string;
  categories?: string[];
  /** Protein/cuisine tags used by the Home "in the mood for" filter. */
  cuisine?: string[];
  city?: string;
  distanceMi?: number;
  open?: boolean;
  priceTier?: 1 | 2;
}

export interface UserProfile {
  name: string;
  heightIn: number;
  weightLb: number;
  age: number;
  sex: Sex;
  activity: ActivityLevel;
  goal: Goal;
  /** Used to derive per-meal targets in the fit score. Defaults to 3. */
  mealsPerDay?: number;
  dailyCal: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  favorites: string[];
  cravings: string[];
}
