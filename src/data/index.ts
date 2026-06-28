// Single import surface for the seed data layer. Keeping everything behind this
// barrel means swapping the seed for a real database later only touches this
// folder, not the components that consume it.

export * from './types';
export { restaurants, menuItems, combos } from './restaurants';
export { demoUser } from './user';
