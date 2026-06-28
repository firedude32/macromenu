// Dev sanity checks (SPEC §11 step 3). Importing this module logs the demo
// user's daily targets and a few fit scores to the console on app load, so the
// numbers can be eyeballed against the spec while building. It will be imported
// from the app entry point (main.tsx) in a later step; running it directly also
// works for verification.

import { combos, demoUser, menuItems } from '../data';
import { fitScore } from './score';

const byId = <T extends { id: string }>(list: T[], id: string): T => {
  const found = list.find((x) => x.id === id);
  if (!found) throw new Error(`sanityCheck: missing seed id "${id}"`);
  return found;
};

export function runSanityChecks(): void {
  // Demo user's daily targets (audited, stored on the profile) — expect 3120/195/351/104.
  console.log('[MacroMenu] Demo user daily targets:', {
    cal: demoUser.dailyCal,
    protein: demoUser.dailyProtein,
    carbs: demoUser.dailyCarbs,
    fat: demoUser.dailyFat,
  });

  const doubleChicken = byId(combos, 'chipotle-double-chicken-power-bowl');
  const grilledNuggets12 = byId(menuItems, 'cfa-grilled-nuggets-12ct');
  const bigMac = byId(menuItems, 'mcd-big-mac');

  // Great picks should land in the 90s; the Big Mac should score lower.
  console.log('[MacroMenu] Fit scores for demo user (goal: %s)', demoUser.goal, {
    'Chipotle Double Chicken Power Bowl': fitScore(doubleChicken, demoUser),
    'CFA 12ct Grilled Nuggets': fitScore(grilledNuggets12, demoUser),
    'McDonald’s Big Mac': fitScore(bigMac, demoUser),
  });
}

// Run on import so the checks fire when the app loads.
runSanityChecks();
