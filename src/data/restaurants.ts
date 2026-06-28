// Seed data — every nutrition value is copied VERBATIM from SPEC.md §9.
// Nothing here is rounded, estimated, recalculated, or fetched from an API.
// Values are cal / protein(g) / carbs(g) / fat(g). Combo totals are either the
// official figure given in §9 or the exact sum of the audited components.

import type { Combo, MenuItem, Restaurant } from './types';

// Audit metadata. `auditedOn` is when our team last hand-checked the menu
// against the restaurant's official source; it is descriptive metadata, not a
// nutrition value.
const CFA_SOURCE = 'chick-fil-a.com — official nutrition';
const MCD_SOURCE = "McDonald's published nutrition";
const CHIPOTLE_SOURCE = 'Chipotle official component nutrition';
const AUDITED_ON = '2026-06-15';

// ---------------------------------------------------------------------------
// Restaurants
// ---------------------------------------------------------------------------

export const restaurants: Restaurant[] = [
  {
    id: 'chick-fil-a',
    name: 'Chick-fil-A',
    status: 'verified',
    source: CFA_SOURCE,
    auditedOn: AUDITED_ON,
    categories: ['Entrées', 'Breakfast', 'Sides', 'Salads', 'Drinks'],
    cuisine: ['chicken'],
    city: 'Clear Lake, IA',
    distanceMi: 1.2,
    open: true,
    priceTier: 1,
  },
  {
    id: 'mcdonalds',
    name: "McDonald's",
    status: 'verified',
    source: MCD_SOURCE,
    auditedOn: AUDITED_ON,
    categories: ['Burgers', 'Chicken & Fish', 'Breakfast', 'Sides', 'Drinks'],
    cuisine: ['beef', 'chicken'],
    city: 'Clear Lake, IA',
    distanceMi: 0.8,
    open: true,
    priceTier: 1,
  },
  {
    id: 'chipotle',
    name: 'Chipotle',
    status: 'verified',
    source: CHIPOTLE_SOURCE,
    auditedOn: AUDITED_ON,
    categories: ['Bowls', 'Components'],
    cuisine: ['chicken', 'beef', 'pork', 'tofu'],
    city: 'Clear Lake, IA',
    distanceMi: 2.1,
    open: true,
    priceTier: 2,
  },

  // Audit in progress — listed in the app, but not tappable into a live menu
  // (SPEC §9.5). No nutrition data is seeded for these on purpose.
  {
    id: 'culvers',
    name: "Culver's",
    status: 'auditPending',
    city: 'Clear Lake, IA',
    distanceMi: 1.5,
    open: true,
    priceTier: 1,
  },
  {
    id: 'taco-bell',
    name: 'Taco Bell',
    status: 'auditPending',
    city: 'Clear Lake, IA',
    distanceMi: 2.4,
    open: true,
    priceTier: 1,
  },
  {
    id: 'subway',
    name: 'Subway',
    status: 'auditPending',
    city: 'Clear Lake, IA',
    distanceMi: 0.6,
    open: true,
    priceTier: 1,
  },
  {
    id: 'arbys',
    name: "Arby's",
    status: 'auditPending',
    city: 'Clear Lake, IA',
    distanceMi: 3.1,
    open: false,
    priceTier: 1,
  },
  {
    id: 'perkins',
    name: 'Perkins',
    status: 'auditPending',
    city: 'Clear Lake, IA',
    distanceMi: 2.0,
    open: true,
    priceTier: 2,
  },
  {
    id: 'gyro-place',
    name: 'Gyro Place',
    status: 'auditPending',
    city: 'Clear Lake, IA',
    distanceMi: 1.8,
    open: true,
    priceTier: 2,
  },
  {
    id: '7-stars-family-restaurant',
    name: '7 Stars Family Restaurant',
    status: 'auditPending',
    city: 'Clear Lake, IA',
    distanceMi: 4.2,
    open: false,
    priceTier: 2,
  },
];

// ---------------------------------------------------------------------------
// Menu items (factories keep the verbatim values readable)
// ---------------------------------------------------------------------------

const item = (
  restaurantId: string,
  source: string,
  id: string,
  name: string,
  category: string,
  cal: number,
  protein: number,
  carbs: number,
  fat: number,
  needsVerify = false,
): MenuItem => ({
  id,
  restaurantId,
  name,
  category,
  cal,
  protein,
  carbs,
  fat,
  verified: true,
  source,
  auditedOn: AUDITED_ON,
  ...(needsVerify ? { needsVerify: true } : {}),
});

const cfa = (
  id: string,
  name: string,
  category: string,
  cal: number,
  p: number,
  c: number,
  f: number,
  v = false,
) => item('chick-fil-a', CFA_SOURCE, id, name, category, cal, p, c, f, v);

const mcd = (
  id: string,
  name: string,
  category: string,
  cal: number,
  p: number,
  c: number,
  f: number,
  v = false,
) => item('mcdonalds', MCD_SOURCE, id, name, category, cal, p, c, f, v);

const chp = (
  id: string,
  name: string,
  category: string,
  cal: number,
  p: number,
  c: number,
  f: number,
) => item('chipotle', CHIPOTLE_SOURCE, id, name, category, cal, p, c, f);

// --- Chick-fil-A (SPEC §9.1) ---
const chickFilAItems: MenuItem[] = [
  // Entrées
  cfa('cfa-chicken-sandwich', 'Chicken Sandwich', 'Entrées', 420, 28, 41, 18),
  cfa('cfa-spicy-chicken-sandwich', 'Spicy Chicken Sandwich', 'Entrées', 450, 29, 42, 19),
  cfa('cfa-grilled-chicken-sandwich', 'Grilled Chicken Sandwich', 'Entrées', 390, 28, 44, 12),
  cfa('cfa-nuggets-8ct', 'Nuggets 8ct', 'Entrées', 250, 27, 11, 11),
  cfa('cfa-nuggets-12ct', 'Nuggets 12ct', 'Entrées', 380, 40, 16, 17),
  cfa('cfa-grilled-nuggets-5ct', 'Grilled Nuggets 5ct', 'Entrées', 80, 16, 1, 2),
  cfa('cfa-grilled-nuggets-8ct', 'Grilled Nuggets 8ct', 'Entrées', 130, 25, 1, 3),
  cfa('cfa-grilled-nuggets-12ct', 'Grilled Nuggets 12ct', 'Entrées', 200, 38, 2, 4.5),
  cfa('cfa-grilled-nuggets-30ct', 'Grilled Nuggets 30ct', 'Entrées', 510, 98, 4, 11),
  // Breakfast
  cfa('cfa-chick-n-minis-4ct', 'Chick-n-Minis 4ct', 'Breakfast', 360, 20, 41, 13),
  cfa('cfa-egg-white-grill', 'Egg White Grill', 'Breakfast', 290, 27, 31, 7),
  cfa('cfa-bacon-egg-cheese-biscuit', 'Bacon, Egg & Cheese Biscuit', 'Breakfast', 420, 17, 37, 23, true),
  cfa('cfa-hash-browns', 'Hash Browns', 'Breakfast', 270, 3, 30, 16, true),
  // Sides
  cfa('cfa-waffle-fries-medium', 'Waffle Fries (medium)', 'Sides', 420, 5, 45, 24),
  cfa('cfa-mac-and-cheese-medium', 'Mac & Cheese (medium)', 'Sides', 450, 19, 30, 28, true),
  cfa('cfa-small-fruit-cup', 'Small Fruit Cup', 'Sides', 60, 0, 15, 0),
  cfa('cfa-side-salad', 'Side Salad (no dressing)', 'Sides', 160, 5, 12, 10, true),
  // Salads
  cfa('cfa-grilled-cobb-salad', 'Grilled Cobb Salad (no dressing)', 'Salads', 510, 40, 27, 27, true),
  // Drinks
  cfa('cfa-diet-lemonade', 'Diet Lemonade', 'Drinks', 25, 0, 5, 0),
  cfa('cfa-unsweetened-iced-tea', 'Unsweetened Iced Tea', 'Drinks', 0, 0, 0, 0),
  cfa('cfa-1pct-milk', '1% Milk', 'Drinks', 130, 8, 16, 5),
];

// --- McDonald's (SPEC §9.2) ---
const mcdonaldsItems: MenuItem[] = [
  // Burgers
  mcd('mcd-big-mac', 'Big Mac', 'Burgers', 590, 25, 45, 34),
  mcd('mcd-quarter-pounder-cheese', 'Quarter Pounder w/ Cheese', 'Burgers', 520, 30, 42, 26),
  mcd('mcd-double-quarter-pounder-cheese', 'Double Quarter Pounder w/ Cheese', 'Burgers', 740, 48, 43, 42),
  mcd('mcd-mcdouble', 'McDouble', 'Burgers', 400, 22, 33, 20),
  mcd('mcd-cheeseburger', 'Cheeseburger', 'Burgers', 300, 15, 32, 13),
  mcd('mcd-hamburger', 'Hamburger', 'Burgers', 250, 12, 31, 9),
  // Chicken & Fish
  mcd('mcd-mcchicken', 'McChicken', 'Chicken & Fish', 400, 14, 39, 21, true),
  mcd('mcd-mccrispy-original', 'McCrispy (Original)', 'Chicken & Fish', 470, 26, 45, 20),
  mcd('mcd-mcnuggets-4pc', 'McNuggets 4pc', 'Chicken & Fish', 170, 9, 10, 10),
  mcd('mcd-mcnuggets-6pc', 'McNuggets 6pc', 'Chicken & Fish', 250, 14, 15, 15, true),
  mcd('mcd-mcnuggets-10pc', 'McNuggets 10pc', 'Chicken & Fish', 410, 24, 24, 24, true),
  mcd('mcd-filet-o-fish', 'Filet-O-Fish', 'Chicken & Fish', 390, 16, 38, 19),
  // Breakfast
  mcd('mcd-egg-mcmuffin', 'Egg McMuffin', 'Breakfast', 310, 17, 30, 13),
  mcd('mcd-sausage-mcmuffin-egg', 'Sausage McMuffin w/ Egg', 'Breakfast', 480, 21, 30, 31, true),
  // Sides
  mcd('mcd-fries-medium', 'World Famous Fries (medium)', 'Sides', 320, 4, 43, 15, true),
  mcd('mcd-side-salad', 'Side Salad (no dressing)', 'Sides', 15, 1, 3, 0),
  mcd('mcd-apple-slices', 'Apple Slices', 'Sides', 15, 0, 4, 0),
  // Drinks
  mcd('mcd-diet-coke-medium', 'Diet Coke (medium)', 'Drinks', 0, 0, 0, 0),
];

// --- Chipotle components (SPEC §9.3) ---
const chipotleItems: MenuItem[] = [
  chp('chipotle-chicken', 'Chicken', 'Components', 180, 32, 0, 7),
  chp('chipotle-steak', 'Steak', 'Components', 150, 21, 1, 6),
  chp('chipotle-barbacoa', 'Barbacoa', 'Components', 170, 24, 2, 7),
  chp('chipotle-carnitas', 'Carnitas', 'Components', 210, 23, 0, 12),
  chp('chipotle-carne-asada', 'Carne Asada', 'Components', 250, 29, 1, 14),
  chp('chipotle-sofritas', 'Sofritas', 'Components', 150, 8, 9, 10),
  chp('chipotle-white-rice', 'White Rice', 'Components', 210, 4, 40, 4),
  chp('chipotle-brown-rice', 'Brown Rice', 'Components', 210, 4, 36, 6),
  chp('chipotle-black-beans', 'Black Beans', 'Components', 130, 8, 22, 1.5),
  chp('chipotle-pinto-beans', 'Pinto Beans', 'Components', 130, 8, 21, 1.5),
  chp('chipotle-fajita-veggies', 'Fajita Veggies', 'Components', 20, 1, 5, 0),
  chp('chipotle-fresh-tomato-salsa', 'Fresh Tomato Salsa', 'Components', 25, 1, 4, 0),
  chp('chipotle-roasted-chili-corn-salsa', 'Roasted Chili-Corn Salsa', 'Components', 80, 2, 16, 1.5),
  chp('chipotle-cheese', 'Cheese', 'Components', 110, 6, 1, 9),
  chp('chipotle-sour-cream', 'Sour Cream', 'Components', 110, 2, 2, 9),
  chp('chipotle-guacamole', 'Guacamole', 'Components', 230, 2, 8, 22),
  chp('chipotle-romaine-lettuce', 'Romaine Lettuce', 'Components', 5, 0, 1, 0),
  chp('chipotle-flour-tortilla', 'Flour Tortilla (burrito)', 'Components', 320, 8, 50, 9),
  chp('chipotle-chips', 'Chips', 'Components', 540, 7, 73, 25),
];

export const menuItems: MenuItem[] = [
  ...chickFilAItems,
  ...mcdonaldsItems,
  ...chipotleItems,
];

// ---------------------------------------------------------------------------
// Combos (Best-for-you builds). Totals are verbatim from §9 where given.
// ---------------------------------------------------------------------------

export const combos: Combo[] = [
  // --- Chick-fil-A (SPEC §9.1) ---
  {
    id: 'cfa-30ct-grilled-nuggets-and-milk',
    restaurantId: 'chick-fil-a',
    name: '30ct Grilled Nuggets & Milk',
    components: [
      { name: 'Grilled Nuggets 30ct', qty: 1, itemId: 'cfa-grilled-nuggets-30ct' },
      { name: 'Small Fruit Cup', qty: 1, itemId: 'cfa-small-fruit-cup' },
      { name: '1% Milk', qty: 1, itemId: 'cfa-1pct-milk' },
    ],
    // Official total given in §9.1.
    cal: 700,
    protein: 106,
    carbs: 35,
    fat: 16,
    verified: true,
    source: CFA_SOURCE,
    auditedOn: AUDITED_ON,
  },
  {
    id: 'cfa-lean-grilled-combo',
    restaurantId: 'chick-fil-a',
    name: 'Lean Grilled Combo',
    components: [
      { name: 'Grilled Nuggets 12ct', qty: 1, itemId: 'cfa-grilled-nuggets-12ct' },
      { name: 'Side Salad (no dressing)', qty: 1, itemId: 'cfa-side-salad' },
      { name: 'Diet Lemonade', qty: 1, itemId: 'cfa-diet-lemonade' },
    ],
    // §9.1 gives no total for this combo, so totals are the exact sum of the
    // three audited components (200+160+25 / 38+5+0 / 2+12+5 / 4.5+10+0).
    cal: 385,
    protein: 43,
    carbs: 19,
    fat: 14.5,
    verified: true,
    source: CFA_SOURCE,
    auditedOn: AUDITED_ON,
    derivedFromComponents: true,
  },

  // --- Chipotle pre-built bowls (SPEC §9.3) ---
  {
    id: 'chipotle-high-protein-chicken-bowl',
    restaurantId: 'chipotle',
    name: 'High-Protein Chicken Bowl',
    components: [
      { name: 'Chicken', qty: 1, itemId: 'chipotle-chicken' },
      { name: 'White Rice', qty: 1, itemId: 'chipotle-white-rice' },
      { name: 'Black Beans', qty: 1, itemId: 'chipotle-black-beans' },
      { name: 'Fajita Veggies', qty: 1, itemId: 'chipotle-fajita-veggies' },
      { name: 'Fresh Tomato Salsa', qty: 1, itemId: 'chipotle-fresh-tomato-salsa' },
      { name: 'Cheese', qty: 1, itemId: 'chipotle-cheese' },
    ],
    cal: 675,
    protein: 52,
    carbs: 72,
    fat: 22,
    verified: true,
    source: CHIPOTLE_SOURCE,
    auditedOn: AUDITED_ON,
  },
  {
    id: 'chipotle-double-chicken-power-bowl',
    restaurantId: 'chipotle',
    name: 'Double Chicken Power Bowl',
    components: [
      { name: 'Chicken', qty: 2, itemId: 'chipotle-chicken' },
      { name: 'Black Beans', qty: 1, itemId: 'chipotle-black-beans' },
      { name: 'Fajita Veggies', qty: 1, itemId: 'chipotle-fajita-veggies' },
      { name: 'Fresh Tomato Salsa', qty: 1, itemId: 'chipotle-fresh-tomato-salsa' },
      { name: 'Romaine Lettuce', qty: 1, itemId: 'chipotle-romaine-lettuce' },
    ],
    cal: 540,
    protein: 74,
    carbs: 32,
    fat: 16,
    verified: true,
    source: CHIPOTLE_SOURCE,
    auditedOn: AUDITED_ON,
  },
  {
    id: 'chipotle-steak-burrito-bowl',
    restaurantId: 'chipotle',
    name: 'Steak Burrito Bowl',
    components: [
      { name: 'Steak', qty: 1, itemId: 'chipotle-steak' },
      { name: 'White Rice', qty: 1, itemId: 'chipotle-white-rice' },
      { name: 'Black Beans', qty: 1, itemId: 'chipotle-black-beans' },
      { name: 'Fresh Tomato Salsa', qty: 1, itemId: 'chipotle-fresh-tomato-salsa' },
      { name: 'Cheese', qty: 1, itemId: 'chipotle-cheese' },
      { name: 'Sour Cream', qty: 1, itemId: 'chipotle-sour-cream' },
    ],
    cal: 735,
    protein: 42,
    carbs: 70,
    fat: 30,
    verified: true,
    source: CHIPOTLE_SOURCE,
    auditedOn: AUDITED_ON,
  },
  {
    id: 'chipotle-keto-steak-bowl',
    restaurantId: 'chipotle',
    name: 'Keto Steak Bowl',
    components: [
      { name: 'Steak', qty: 2, itemId: 'chipotle-steak' },
      { name: 'Cheese', qty: 1, itemId: 'chipotle-cheese' },
      { name: 'Sour Cream', qty: 1, itemId: 'chipotle-sour-cream' },
      { name: 'Guacamole', qty: 1, itemId: 'chipotle-guacamole' },
      { name: 'Fajita Veggies', qty: 1, itemId: 'chipotle-fajita-veggies' },
      { name: 'Romaine Lettuce', qty: 1, itemId: 'chipotle-romaine-lettuce' },
    ],
    cal: 775,
    protein: 53,
    carbs: 19,
    fat: 52,
    verified: true,
    source: CHIPOTLE_SOURCE,
    auditedOn: AUDITED_ON,
  },
  {
    id: 'chipotle-sofritas-veggie-bowl',
    restaurantId: 'chipotle',
    name: 'Sofritas Veggie Bowl',
    components: [
      { name: 'Sofritas', qty: 1, itemId: 'chipotle-sofritas' },
      { name: 'Brown Rice', qty: 1, itemId: 'chipotle-brown-rice' },
      { name: 'Black Beans', qty: 1, itemId: 'chipotle-black-beans' },
      { name: 'Fajita Veggies', qty: 1, itemId: 'chipotle-fajita-veggies' },
      { name: 'Fresh Tomato Salsa', qty: 1, itemId: 'chipotle-fresh-tomato-salsa' },
      { name: 'Guacamole', qty: 1, itemId: 'chipotle-guacamole' },
    ],
    cal: 765,
    protein: 24,
    carbs: 84,
    fat: 40,
    verified: true,
    source: CHIPOTLE_SOURCE,
    auditedOn: AUDITED_ON,
  },
];
