# SPEC.md — MacroMenu

*The complete source of truth for the app. Lives in the repo root. Claude reads this when building any feature. Working name "MacroMenu" is a placeholder — swap for your real brand. Tagline: "The macros are actually right."*

---

## 0. Mission

A **mobile-first web app** showing the **calories and macros (protein / carbs / fat) of menu items at restaurant chains**, recommending the best items for a user's fitness goal. It mirrors the look and feel of an app called **MenuFit**, but with one decisive difference: **MenuFit's nutrition data is AI-generated and frequently wrong (reviewers report calories off by 200+); ours is human-audited against official restaurant nutrition data, and every item is marked Verified.** We cover **fewer restaurants on purpose** — only fully-audited restaurants go live. The UI must look **polished, premium, and iOS-native**; visual fidelity matters as much as the data.

**The single most important constraint:** never invent, estimate, round, or AI-generate any nutrition number, and never fetch macros from an external API. Every displayed macro traces to a file in `src/data/`. There is **no AI chat** — this is a fixed audited dataset, not an LLM wrapper.

---

## 1. Tech stack & platform constraints

- **React + Vite + TypeScript**, **Tailwind CSS + shadcn/ui**, **react-router-dom**, **lucide-react** (UI chrome icons) + **emoji** for playful category/mood icons.
- **localStorage** for user profile, onboarding state, and favorites.
- **All nutrition data** lives in seeded TypeScript files in `src/data/`, typed and structured so it could move to a database later without changing components. **No external nutrition API. No AI-generated macros.**
- **Phone-frame container:** on screens wider than 480px, render the app inside a centered phone frame (max-width 430px, height `100dvh`, rounded corners, subtle bezel/shadow) on a neutral page background (`#E9E9EC`); on screens ≤480px fill edge-to-edge with no frame.
- **Faux iOS status bar** at the top of the frame (static: time 10:51, signal/5G/battery) to complete the real-app feel.

---

## 2. The product in one page

A user onboards once (goal + body stats → we compute daily calorie & macro targets). On **Home** they browse restaurants (near them, favorites, by craving/protein type, or search). Tapping a restaurant plays a short animated **analysis loading screen**, then lands on the restaurant page in **"Best for you"** mode — the menu reorganized into goal-based buckets (Best For Me, High Protein, Slightly Better, Low Calorie Drinks) each with a **0–100 fit score** and a **"Why this pick"** insight. They can flip to **"All menu items"** for the full menu by category, expand any item for macros, and open an **item detail** with the full breakdown, a **Verified ✓** badge, the data source, and healthier swaps. The **Menu** tab shows cross-restaurant **Suggested Meals**. The **Profile** tab holds stats, daily macro targets, and settings — including an **"Our Data & Accuracy"** page that is the brand's trust centerpiece.

**Bottom tab bar — 3 tabs, on all main screens:**
1. **Home** — house glyph (Discover)
2. **Menu** — stacked-burger glyph (Suggested Meals)
3. **Profile** — person glyph (Settings)

Active tab = **solid green circle (`#16A34A`) with a white glyph**; inactive = thin grey line glyph (`#9CA3AF`). Frosted white bar with a hairline top border.

---

## 3. Design system (non-negotiable — match the MenuFit screenshots)

### 3.1 Color tokens (define in the Tailwind config / CSS vars; never hardcode hex in components)
| Token | Hex | Use |
|---|---|---|
| green/primary | `#16A34A` | Active nav, primary buttons, "Open" badge, accents |
| green/bright | `#22C55E` | Score rings, success |
| cal | `#16A34A` | Calories |
| protein | `#3B82F6` | Protein (blue) |
| carbs | `#F59E0B` | Carbs (amber) |
| fat | `#8B5CF6` | Fat (purple) |
| danger | `#EF4444` | "Closed", errors |
| ink | `#0A0A0A` | Primary text |
| ink/soft | `#6B7280` | Secondary text |
| cta/black | `#111114` | "Order Now" pills (white text) |
| bg | `#F7F7F8` | App background |
| card | `#FFFFFF` | Cards |
| frame/bg | `#E9E9EC` | Behind the phone frame |

**Insight gradient:** left→right teal `#2DD4BF` → blue `#3B82F6` (used only on the "Why this pick" header strip).

### 3.2 Typography
Font **Inter** (Google Fonts). Screen titles weight 800, 30–34px. Card titles 800, 22–26px (wrap to 2 lines). Body 15–16px. Captions/secondary 13–14px `ink/soft`. Macro numbers 800; their labels 12px uppercase `ink/soft`.

### 3.3 Shape & spacing
Card radius 22px; inner stat tiles 16px; pills/buttons/badges fully rounded. Soft shadow `0 4px 20px rgba(0,0,0,0.06)`, no harsh borders. Screen horizontal padding 20px; gap between stacked cards 16–20px. Generous whitespace. **Macro color semantics everywhere:** calories green, protein blue, carbs amber, fat purple.

### 3.4 Signature components (build as reusable components)
- **`<ScoreBadge value={0-100} />`** — circular ring + big number + tiny uppercase tier label beneath. Tiers: **90–100 EXCELLENT, 80–89 GREAT, 70–79 SOLID, 55–69 GOOD, <55 OKAY.** Ring color: ≥80 bright green `#22C55E`, 70–79 green `#16A34A`, 55–69 amber `#F59E0B`, <55 grey. Sits top-right of recommendation cards.
- **`<MacroRow />`** — 4-up inline stats: `400 CAL | 34g Protein | 26g Carbs | 18g Fats`, thin vertical dividers, bold number on top, tiny grey label below.
- **`<MacroDotStat />`** — `● Protein: 49g` with a colored dot (protein blue, carbs amber, fat purple); used in expanded item rows.
- **`<MacroGrid />`** — 2×2 tiles, each with a colored circular icon + label + big value: Calories (flame, green), Protein (bicep, blue), Carbs (bread, amber), Fat (droplet, purple).
- **`<WhyThisPick />`** — gradient header strip (teal→blue) with a ✨ sparkle and the label **"Why this pick"**, then a white rounded box with one punchy sentence generated from the item's real macros (template-driven, never AI). *(Component may be named CoachInsight internally; the visible label is "Why this pick".)*
- **`<Pill>`** toggle — segmented control (e.g. "🌍 Best for you | 🍔 All menu items"): light grey track, selected segment = white card with soft shadow, unselected = grey text; supports emoji + label.
- **`<StatusBadge>`** — "Open" (green pill) / "Closed" (red pill), white text.
- **`<PriceTier>`** — small lucide `Banknote` icon + `$` or `$$` in `ink/soft`.
- **`<VerifiedBadge>`** — green lucide `BadgeCheck` + "Verified". The differentiator; appears on item rows, item detail, and recommendation cards.

### 3.5 The analysis / loading screen (must be faithful — a big part of the premium feel)
A full-screen takeover playing ~2.5–4s (`DURATION_MS = 3000`) when a user opens a restaurant:
- Top-right **X** (lucide `X` in a grey circle) to dismiss back to Home.
- **Floating restaurant logo cards** scattered in the upper third at slight random rotations, gently drifting (staggered CSS keyframe translate+rotate loops); the selected restaurant's logo is centered/largest.
- A **giant percentage** counting up `3% → 100%` in huge bold `ink`.
- A thin full-width **progress bar** (grey track, green fill) synced to the percentage.
- A white card of **status steps**, each turning bold with a green check as progress passes its threshold: `Locating Restaurant Menu` (0–25%), `Analyzing Menu Items` (25–55%), `Filtering for Your Goals` (55–85%), `Personal Healthy Menu` (85–100%).
- A **"Continue"** pill: disabled/grey until 100%, then solid black and routes to the restaurant page (auto-advance at 100% too). Respect `prefers-reduced-motion`.

---

## 4. Information architecture (routes)

```
/onboarding                  first-run flow (skippable to demo profile)
/                            Home / Discover (Tab 1)
/restaurant/:id/loading      analysis loading screen
/restaurant/:id              restaurant detail (Best for you ⇄ All menu items)
/item/:restaurantId/:itemId  item detail
/menu                        Suggested Meals (Tab 2)
/profile                     Profile / Settings (Tab 3)
/profile/preferences         edit goal, stats, macros
/profile/data                "Our Data & Accuracy"
```

---

## 5. Screen-by-screen spec

### 5.1 Onboarding (`/onboarding`)
First-run only (`hasOnboarded` flag in localStorage). One question per step, large bold headers, progress dots, black "Continue" pill. Steps: **Welcome** (brand + tagline "The macros are actually right." + "Every number audited against official restaurant data.") → **Goal** (three big cards: Cut / Maintain / Bulk) → **About you** (height, weight, age, biological sex, activity level) → **Your targets** (computed daily calories + macros shown in the ring+legend layout, optionally fine-tune the split) → **Cravings** (optional multi-select protein moods) → **Done** → Home. Include a **"Skip — use demo profile"** link loading the §9.4 demo user.

### 5.2 Home / Discover (`/`)
Top to bottom: **Location** label + selected city with dropdown chevron (default "Clear Lake, IA"; tapping opens a simple city picker that only changes the header), and a top-right **filter icon** (three short rounded bars colored blue/orange/green → a minimal filter sheet: Open now, Verified only, Sort by distance/name). **Search bar** ("Search restaurants") filters the lists. **"What are you in the mood for?"** horizontal chips with emoji: Chicken 🍗, Seafood 🐟, Lamb 🍖, Beef 🥩, Pork 🍖, Tofu 🍲, Turkey 🦃. Rows: **Fast Food Restaurants** (logo cards), **Near Me** (storefront photo, Open/Closed pill, name, distance, PriceTier), **Favorite Restaurants** (heart + favorite count), **Most Popular**. Tapping a **verified** restaurant → `/restaurant/:id/loading`; tapping an **audit-pending** one → an "Audit in progress" sheet. Hearting persists to localStorage and syncs to Favorite Restaurants.

### 5.3 Mood / search results
A vertical list of matching restaurants (each row: circular thumbnail, name, distance, city, PriceTier, Open/Closed pill, right chevron). Keep the Location header + a search field showing the active query with an X to clear. Same tap behavior as 5.2.

### 5.4 Restaurant detail (`/restaurant/:id`)
**Header:** back arrow; a small **info/warning-triangle** button (opens a data-source sheet: "Every item here is verified against official [restaurant] nutrition data."); restaurant logo + name centered; a **red heart** favorite (synced to Home) and a **black sparkle** button (opens the best-for-you bottom-sheet modal). Below the name: **Open** pill, "Your Area" + pin, PriceTier, and a small `Target` icon (recommendations tuned to the user's goal). **Segmented toggle:** "🌍 Best for you | 🍔 All menu items".

**Mode A — All menu items:** item search field; **category tabs** (horizontal scroll, underline on active) from the restaurant's categories (Breakfast Items, Entrées, Salads, Sides, Kids Menu, Drinks). **Item rows** (white cards): a left **checkbox** (adds to a sticky bottom tally bar "{n} items · {cal} cal · {protein}g P" with a reset), the item name (wraps 2 lines), and on the right 🔥 **calories in green** + an expander. **Expanded:** a `MacroDotStat` row + a `VerifiedBadge` line. Tapping the row body (not the checkbox) → item detail.

**Mode B — Best for you:** the menu reorganized into **collapsible goal buckets**, each a white card with emoji + title + chevron: ⭐ **Best For Me** (top fit-score items), 🍗 **High Protein**, 📈 **Slightly Better** (honest mid-tier, score ~55–79), 🥤 **Low Calorie Drinks** (drinks under ~60 cal). Also show 🥗 **Fat-Loss Friendly** when goal = Cut and 💪 **Mass Builder** when goal = Bulk. Expanding reveals recommendation cards (5.5), sorted by score descending.

### 5.5 Recommendation cards & best-for-you modal
Build **`RecommendationCard`** as a reusable component: **title** + `ScoreBadge` (top-right); an **"Order:"** line describing the build (e.g. "30 Count Grilled Nuggets, Small Fruit Cup, 1% Milk") for combos; a `MacroGrid` (2×2) or inline `MacroRow` on compact cards; and a **`WhyThisPick`** sentence from §10 templates (real numbers only). The restaurant-page **black sparkle** opens a **bottom-sheet modal** (app logo + X, restaurant logo, bucket title + restaurant name, 2–3 scored cards), defaulting to the restaurant's top picks.

### 5.6 Item detail (`/item/:restaurantId/:itemId`)
Item name + image (if present) + a prominent `VerifiedBadge` + this item's fit `ScoreBadge`. A full `MacroGrid`. Serving size/count and allergens **only if** those fields exist in the data. **Data source line (trust feature):** a green `BadgeCheck` + "Verified against official [restaurant] nutrition data. Last audited [auditedOn]." from the item's real fields, plus a small "Report an issue" link (console.log in the demo). **Healthier swaps:** 1–3 same-restaurant alternatives that improve fit for the goal, each a compact row with a colored delta (e.g. "−170 cal, +9g protein", green when better); tapping a swap opens its detail; hide the section if none.

### 5.7 Suggested Meals — Menu tab (`/menu`)
Header "Suggested Meals" + brand logo. A vertical feed of **cross-restaurant** `RecommendationCard`s personalized to the user's goal/macros, scored across **all verified restaurants**, highest score first, each with the restaurant's logo and a black **"Order Now"** pill (→ item detail / stub confirmation; no real ordering).

### 5.8 Profile / Settings (`/profile`)
Header "Settings" + circular **profile photo** (placeholder avatar). **Profile card:** Height (5'10"), Weight (175.0 lbs), Goal (Maintain), tappable to edit. **Total Daily Macros card** (build reusable — onboarding reuses it): a big ring showing total calories ("3.1K Calorie") + a legend of three mini progress rings — Protein 195g – 25% (blue), Carbs 351g – 45% (amber), Fat 104g – 30% (purple), all from the profile. **Settings list** (rows + chevrons): **Edit Preferences** (→ `/profile/preferences`: edit goal + stats, recompute targets via §8, persist, reflect on Profile; fields reusable by onboarding), **Terms and Conditions**, **Privacy Policy** (simple static pages), **Our Data & Accuracy** (→ `/profile/data`).

### 5.9 Our Data & Accuracy (`/profile/data`) — the brand centerpiece
Headline "Every number is verified." Copy: we audit each menu item against the restaurant's official published nutrition data, by hand, and re-check on a schedule — we don't guess with AI; that's why we cover fewer restaurants (quality over quantity). A list of **Verified restaurants** (with "audited [date]") and **Coming soon (audit in progress)**, both from the data by restaurant status. A short line on how to report a discrepancy.

---

## 6. Scoring algorithm (implement deterministically)

Compute a **0–100 fit score** for each item/combo given the user's per-meal target = daily target ÷ `mealsPerDay` (default 3).

```ts
const tCal = user.dailyCal / mealsPerDay;
const tP   = user.dailyProtein / mealsPerDay;
const density   = clamp((item.protein / Math.max(item.cal,1) * 100) / 12, 0, 1);   // protein per 100 cal, 12=elite
const pAdequacy = clamp(item.protein / Math.max(tP,1), 0, 1.2) / 1.2;
const calFit    = clamp(1 - Math.abs(item.cal - tCal) / tCal, 0, 1);
const balance   = macroRatioSimilarity(item, user); // 0..1 closeness of macro ratios

let s;
if (user.goal === 'cut')       s = 0.45*density + 0.25*calFit + 0.20*pAdequacy + 0.10*balance;
else if (user.goal === 'bulk') s = 0.35*density + 0.15*calFit + 0.30*pAdequacy + 0.20*balance;
else                           s = 0.35*density + 0.25*calFit + 0.20*pAdequacy + 0.20*balance;
const score = Math.round(clamp(s,0,1) * 100);
```

Tiers/colors drive `ScoreBadge` (§3.4). Sort each bucket by score descending. **Calibrate so genuinely great picks land in the 90s** (e.g. a double-chicken Chipotle bowl, CFA grilled nuggets).

---

## 7. Verified-accuracy features (the whole point)

Every item carries `verified: true`, a `source`, and an `auditedOn` date → render `VerifiedBadge` on item rows, item detail, and recommendation cards. **Restaurant states:** `verified` (live, tappable into a menu) vs `auditPending` (shown in lists, but tapping opens an "audit in progress" sheet — making "fewer restaurants" a feature). The "Our Data & Accuracy" page (5.9) and the restaurant header info-triangle explain the methodology. **No AI-generated macros anywhere. No AI chat.**

---

## 8. Macro & TDEE math (so targets are real)

- **BMR (Mifflin-St Jeor):** male `10*kg + 6.25*cm − 5*age + 5`; female `… − 161`.
- **TDEE** = BMR × activity: Sedentary 1.2, Light 1.375, Moderate 1.55, Active 1.725, Very active 1.9.
- **Goal calories:** Cut = TDEE − 20%; Maintain = TDEE; Bulk = TDEE + 10%.
- **Macro split:** Cut 40P/30C/30F; Maintain 25P/45C/30F; Bulk 30P/45C/25F. Grams: protein & carbs = `%*cal/4`, fat = `%*cal/9`.
- **Sanity check:** the demo user (5'10", 175 lb, maintain) should land near **3,100 cal, 195g P (25%), 351g C (45%), 104g F (30%)** — tune the seeded activity level to reproduce this so the Profile screen matches the reference.

---

## 9. Seed data (real, audited-style — verify against official PDFs before launch)

> Researched from official/published sources; good enough for a demo, but **lock every value against the restaurant's official nutrition source before launch.** Store with `source` + `auditedOn`. Values are cal / protein(g) / carbs(g) / fat(g).

### 9.1 Chick-fil-A — `verified` (chick-fil-a.com)
Entrées: Chicken Sandwich 420/28/41/18 · Spicy Chicken Sandwich 450/29/42/19 · Grilled Chicken Sandwich 390/28/44/12 · Nuggets 8ct (fried) 250/27/11/11 · Nuggets 12ct (fried) 380/40/16/17 · Grilled Nuggets 5ct 80/16/1/2 · Grilled Nuggets 8ct 130/25/1/3 · Grilled Nuggets 12ct 200/38/2/4.5 · Grilled Nuggets 30ct 510/98/4/11
Breakfast: Chick-n-Minis 4ct 360/20/41/13 · Egg White Grill 290/27/31/7 · Bacon, Egg & Cheese Biscuit 420/17/37/23 *(verify)* · Hash Browns 270/3/30/16 *(verify)*
Sides: Waffle Fries medium 420/5/45/24 · Mac & Cheese medium 450/19/30/28 *(verify)* · Small Fruit Cup 60/0/15/0 · Side Salad (no dressing) 160/5/12/10 *(verify)*
Salads: Grilled Cobb Salad (no dressing) 510/40/27/27 *(verify)*
Drinks: Diet Lemonade 25/0/5/0 · Unsweetened Iced Tea 0/0/0/0 · 1% Milk 130/8/16/5
Combos (for Best-for-you): **30ct Grilled Nuggets & Milk** = 30ct Grilled Nuggets + Small Fruit Cup + 1% Milk = **700/106/35/16**; **Lean Grilled Combo** = 12ct Grilled Nuggets + Side Salad (no dressing) + Diet Lemonade.

### 9.2 McDonald's — `verified` (published nutrition)
Big Mac 590/25/45/34 · Quarter Pounder w/ Cheese 520/30/42/26 · Double QP w/ Cheese 740/48/43/42 · McDouble 400/22/33/20 · Cheeseburger 300/15/32/13 · Hamburger 250/12/31/9 · McChicken 400/14/39/21 *(verify)* · McCrispy (Original) 470/26/45/20 · McNuggets 4pc 170/9/10/10 · McNuggets 6pc 250/14/15/15 *(verify)* · McNuggets 10pc 410/24/24/24 *(verify)* · Filet-O-Fish 390/16/38/19 · Egg McMuffin 310/17/30/13 · Sausage McMuffin w/ Egg 480/21/30/31 *(verify)* · World Famous Fries medium 320/4/43/15 *(verify)* · Side Salad (no dressing) 15/1/3/0 · Apple Slices 15/0/4/0 · Diet Coke medium 0/0/0/0

### 9.3 Chipotle — `verified` (component-based; bowls computed from official components)
Components (per serving): Chicken 180/32/0/7 · Steak 150/21/1/6 · Barbacoa 170/24/2/7 · Carnitas 210/23/0/12 · Carne Asada 250/29/1/14 · Sofritas 150/8/9/10 · White Rice 210/4/40/4 · Brown Rice 210/4/36/6 · Black Beans 130/8/22/1.5 · Pinto Beans 130/8/21/1.5 · Fajita Veggies 20/1/5/0 · Fresh Tomato Salsa 25/1/4/0 · Roasted Chili-Corn Salsa 80/2/16/1.5 · Cheese 110/6/1/9 · Sour Cream 110/2/2/9 · Guacamole 230/2/8/22 · Romaine Lettuce 5/0/1/0 · Flour Tortilla (burrito) 320/8/50/9 · Chips 540/7/73/25
Pre-built bowls: **High-Protein Chicken Bowl** (chicken+white rice+black beans+fajita veggies+tomato salsa+cheese) = **675/52/72/22**; **Double Chicken Power Bowl** (2× chicken+black beans+fajita veggies+tomato salsa+romaine) = **540/74/32/16** *(should score ~99)*; **Steak Burrito Bowl** (steak+white rice+black beans+tomato salsa+cheese+sour cream) = **735/42/70/30**; **Keto Steak Bowl** (2× steak+cheese+sour cream+guac+fajita veggies+romaine) = **775/53/19/52**; **Sofritas Veggie Bowl** (sofritas+brown rice+black beans+fajita veggies+tomato salsa+guac) = **765/24/84/40**.
*(Optional: a live bowl builder that sums these exact component values.)*

### 9.4 Seeded demo user (so the app is populated on load)
```ts
{ name: "Ethan", heightIn: 70, weightLb: 175, age: 20, sex: "male",
  activity: "moderate", goal: "maintain",
  dailyCal: 3120, dailyProtein: 195, dailyCarbs: 351, dailyFat: 104,
  favorites: ["chick-fil-a", "chipotle"], cravings: ["chicken","beef"] }
```

### 9.5 Restaurants (states)
**Verified (live):** Chick-fil-A, McDonald's, Chipotle. *(Optionally add Waffle House + Sweetgreen as verified with a few audited items to power Suggested Meals; otherwise use the three above.)*
**Audit in progress (listed, not tappable into a live menu):** Culver's, Taco Bell, Subway, Arby's, Perkins, Gyro Place, 7 Stars Family Restaurant — each with a storefront/logo, distance, open/closed, price tier.

---

## 10. Microcopy & tone

Confident, clean, fitness-literate, not bro-y. Short. **"Why this pick" templates** (fill with real numbers): high-protein → "{P}g of protein while staying under your calorie ceiling — ideal for {goal}."; low-cal → "Only {cal} cal with {P}g protein — a lean, high-value pick."; balanced → "A balanced {cal}-cal plate that fits your {goal} targets cleanly." Non-verified state → "Not verified yet. Here's a verified pick nearby."

---

## 11. Build sequence (one step per prompt; don't modify prior steps unless required)

1. Scaffold + design tokens + phone frame + faux status bar + 3-tab bar + empty routes.
2. Reusable components (+ a temporary `/gallery` route to review them).
3. Seed data + types + TDEE/scoring utilities (with console.log sanity checks).
4. Home / Discover.
5. Restaurant detail (both modes) + reusable RecommendationCard.
6. Analysis loading screen.
7. Item detail (+ healthier swaps).
8. Suggested Meals tab + best-for-you bottom-sheet modal.
9. Profile + Edit Preferences + Our Data & Accuracy.
10. Onboarding (+ skip-to-demo + app-entry gate).
11. Polish pass (animations, spacing, responsiveness, remove `/gallery`, verify against §12).

---

## 12. Acceptance criteria (definition of done)

- App renders in a centered phone frame on desktop and edge-to-edge on mobile; faux status bar present.
- 3-tab bar works with correct active (green circle) / inactive states.
- Home shows all rows from seed data; search and mood filtering work; verified tap → loading → restaurant; audit-pending tap → sheet; hearting persists.
- Loading screen: count-up %, floating logos, 4 status steps, gated Continue, smooth hand-off.
- Restaurant page toggles both modes (category tabs + expandable rows + Verified + tally / goal buckets + scored cards + "Why this pick").
- Item detail: 2×2 MacroGrid, VerifiedBadge, real source + audit date, sensible healthier swaps.
- Scores are computed (not hardcoded); great picks land in the 90s; buckets sort by score.
- Profile reproduces 3.1K / 195 / 351 / 104; editing goal changes the numbers.
- Onboarding computes targets (Mifflin-St Jeor), persists to localStorage; skip-to-demo works.
- **Every displayed macro traces to `src/data/` — none AI-generated or API-fetched.** Macro colors consistent everywhere.

---

## 13. Out of scope (demo)

Real ordering/checkout, real geolocation, real auth, payments/paywall, push notifications, a live backend, AI chat. "Order Now" → stub confirmation. Keep the data layer swappable to a database later.
