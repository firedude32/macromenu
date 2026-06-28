// Seeded demo user so the app is populated on first load (SPEC §9.4).
// The daily targets are the audited values from the spec — they are stored
// verbatim and are what the Profile screen displays. The Mifflin-St Jeor
// functions in src/lib/tdee.ts recompute these whenever the user edits their
// profile during onboarding / Edit Preferences.

import type { UserProfile } from './types';

export const demoUser: UserProfile = {
  name: 'Ethan',
  heightIn: 70,
  weightLb: 175,
  age: 20,
  sex: 'male',
  activity: 'moderate',
  goal: 'maintain',
  dailyCal: 3120,
  dailyProtein: 195,
  dailyCarbs: 351,
  dailyFat: 104,
  favorites: ['chick-fil-a', 'chipotle'],
  cravings: ['chicken', 'beef'],
};
