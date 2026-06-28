# MacroMenu — verified-macro restaurant app

Mobile-first web app showing accurate, human-audited calories + macros for chain
restaurant menu items, recommending the best items for a user's fitness goal.
Premium, iOS-native UI.

Full spec: SPEC.md. Seed data: src/data/. Components: src/components/. Logic: src/lib/.

## Commands
- Dev server: `npm run dev`   (preview at localhost:5173)
- Build: `npm run build`      (output: dist/)
- Lint: `npm run lint`

## Stack
React + Vite + TypeScript, Tailwind + shadcn/ui, react-router-dom, lucide-react, Inter font.

## Non-negotiables (the product's whole point)
- NEVER invent, estimate, round, or AI-generate any nutrition number; NEVER fetch macros
  from an external API. Every displayed macro must trace to a file in src/data/.
- No AI chat or assistant anywhere. This is a fixed audited dataset, not an LLM wrapper.

## Conventions
- Design tokens live in the Tailwind config / CSS vars; never hardcode hex in components.
- Macro colors everywhere: calories green, protein blue, carbs amber, fat purple.
- Reuse components in src/components/; never fork or duplicate one.
- TypeScript for all data models; business logic as pure functions in src/lib/.
- Persist user profile, onboarding, and favorites with localStorage.
- Bottom nav has exactly 3 tabs: Home, Menu, Profile. No Coach/chat tab.

## Workflow rules
- Do ONLY the step asked. Don't modify files from prior steps unless the step requires it.
- Before finishing any task, state how you'll verify it, then verify (it compiles + renders).
- Keep diffs tightly scoped. Don't add pages, libraries, or features not requested.
- If an approach isn't working, stop and explain rather than thrashing on variations.
