# Building MacroMenu with Claude Pro Only — Full Playbook

*How to build and ship the whole app using just your $20 Claude Pro subscription + free tools, no Lovable. Current as of mid-2026.*

---

## 0. The big picture: what changes vs Lovable

Lovable bundles five things into one product: an AI coder, a cloud code editor, a live preview, hosting, and an optional database. On Claude Pro you assemble the same outcome from parts:

| Lovable gives you | On Claude Pro you use | Cost |
|---|---|---|
| AI coder | **Claude Code** (included in Pro) | $0 (in your plan) |
| Cloud editor + preview | **Your machine** + VS Code + the Vite dev server (localhost) | Free |
| Knowledge Base | **CLAUDE.md** files (no 10k char cap!) | Free |
| Version control | **Git + GitHub** | Free |
| Hosting / live URL | **Vercel / Netlify / Cloudflare Pages** (free tier) | Free |
| Database (optional) | **Supabase** free tier — *not needed for this demo* | Free |

**The crucial point: everything we already built transfers directly.** The 11-step build sequence, the seed data, and the Knowledge Base all carry over. The project KB becomes a `CLAUDE.md` file; the workspace rules become a global `CLAUDE.md`; the seed data goes straight into the project. Claude Code reads `CLAUDE.md` on every turn exactly like Lovable reads its Knowledge Base — except there's **no 10,000-character limit**, so you can use the *full* `MacroMenu-Lovable-Prompt.md` (seed data and all) instead of the compressed version.

The only genuinely new work is: (1) a one-time environment setup, (2) previewing locally instead of in a cloud iframe, (3) wiring up a free host yourself, and (4) managing your shared usage limits.

---

## 1. Free tools you need

Install these once. Everything here is free and standard.

1. **Node.js 18+** (get the current LTS, Node 22) — from nodejs.org, or via `nvm`. This is **required regardless of how you install Claude Code**, because the app itself is a Vite/React project that needs Node to run and build. Verify with `node --version`.
2. **Git** — version control and your rollback safety net. Claude Code works best with it. Verify with `git --version`.
3. **A GitHub account** — your remote repo, and the thing your host connects to for auto-deploys.
4. **VS Code** (recommended, optional) — where you'll see the code and run Claude Code's terminal. Claude Code is terminal-first but integrates cleanly with VS Code.
5. **Claude Code** — included in your Pro plan (install steps in §3).
6. **A free static host** — pick one: **Vercel**, **Netlify**, or **Cloudflare Pages**. All have a free hobby tier, all auto-detect Vite, all give you a live URL that redeploys on every git push.
7. **A browser** — for the local preview (Vite at `localhost:5173`) and the deployed site.

You do **not** need a database, a backend, or any paid API. The whole accuracy pitch runs on seeded data baked into the app.

---

## 2. Which models to use for what

Claude Code on Pro defaults to **Sonnet** and lets you switch to **Opus** with the `/model` command. Your usage is one shared pool across claude.ai chat + Claude Code + Cowork, metered by a 5-hour rolling window and a weekly cap. So the game is: use the cheapest model that does the job well, and don't waste your window on chat when you're mid-build.

| Task | Model | Why |
|---|---|---|
| Planning, architecture, the initial scaffold reasoning, the scoring algorithm logic, hard multi-file debugging | **Opus 4.8** | Most capable; earns its higher token cost where a subtle mistake is expensive. Use **deliberately**, not by default. |
| The bulk of the build — generating screens, components, wiring routes, styling | **Sonnet 4.6** | The workhorse. Handles the large majority of coding well and is far lighter on your window. **This is your default.** |
| Trivial mechanical edits, quick reads, tiny tweaks | **Haiku 4.5** | Cheapest; conserves the window for the work that matters. |

**Practical routing for this project:**
- Do your **planning in the claude.ai chat with Opus** — but you've largely done this already (the KB + 11-step plan exist). Reuse them.
- Do the **execution in Claude Code, mostly on Sonnet.** Escalate to Opus with `/model opus` only for the genuinely hard steps — primarily **Step 3** (the scoring/TDEE utilities), and any moment where a build breaks and Sonnet circles on the fix.
- Drop back to Sonnet right after. Reaching for Opus on every prompt is the fastest way to burn a Pro window for no quality gain.

**Usage hygiene (so the whole build fits in Pro):**
- Keep `CLAUDE.md` tight-ish — it's resent on every turn, so bloat burns tokens. (You have room, but don't pad it.)
- Prefer **one clear prompt over several "please refine" follow-ups** — batched edits cost less.
- Use `/status` (or `/usage`) inside Claude Code to watch your remaining capacity, and `/compact` to trim context mid-session.
- If you hit a 5-hour window, you just **wait for the reset** (usually under 5 hours) — nothing is charged or lost. The 12-step build comfortably fits within Pro if you spread it across a couple of sessions.

---

## 3. Exact build process, start to finish

### Phase A — One-time environment setup (~20–30 min)

1. **Install Node.js LTS** (22). Download from nodejs.org, or with nvm:
   ```
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   nvm install 22
   ```
   Then verify: `node --version` (must be v18+).
2. **Install Git** (git-scm.com or your OS package manager). Verify: `git --version`.
3. **Create a GitHub account** at github.com.
4. **Install VS Code** (code.visualstudio.com) — recommended.
5. **Install Claude Code.** Easiest is the native installer (no Node needed for Claude Code itself):
   - macOS / Linux: `curl -fsSL https://claude.ai/install.sh | bash`
   - Windows (PowerShell): `irm https://claude.ai/install.ps1 | iex` — **Windows users: WSL2 is strongly recommended** to avoid path/permission friction.
   - Or via npm (needs Node 18+): `npm install -g @anthropic-ai/claude-code` — **never** use `sudo` with this.
6. **Authenticate.** Run `claude` in a terminal; it opens a browser to log in. **Sign in with your Pro account only** (don't add Console/API credentials, or it may bill you per-token instead of using your plan). Then run `claude doctor` to confirm a clean install.

### Phase B — Create the project

1. Make and enter a project folder, and start version control:
   ```
   mkdir macromenu && cd macromenu
   git init
   ```
2. Start Claude Code in that folder: `claude`
3. **Set up your two memory files** (the Lovable Knowledge Base equivalents):
   - **Global rules** → `~/.claude/CLAUDE.md`: paste your **workspace-knowledge** content. This applies to every project you build with Claude Code.
   - **Project spec** → `./CLAUDE.md` (in the project folder): paste your **project knowledge**. Because there's no 10k cap here, use the **full `MacroMenu-Lovable-Prompt.md`** — mission, design system, all screen specs, scoring, *and the full Section 9 seed data*. This is the single biggest upgrade over the Lovable setup: the seed data lives in your persistent context instead of being pasted into one prompt.
   - You can ask Claude Code to create these files for you — just paste the content and say "save this as ./CLAUDE.md".
4. **Run Step 1 (scaffold).** In Claude Code, give it the Step 1 prompt, but let it also handle the project creation — e.g.: *"Scaffold a Vite + React + TypeScript project with Tailwind and shadcn/ui, react-router-dom, lucide-react, and the Inter font. Run the npm commands to create it and install dependencies. Then do Step 1 of the BUILD SEQUENCE in CLAUDE.md — design tokens, phone-frame container, faux status bar, bottom tab bar, empty routes. Stop there."* Claude Code runs the terminal commands itself (with your approval) and writes the files.

### Phase C — Preview locally as you build

- Start the dev server (Claude Code can run this for you, or you run it in a second terminal):
  ```
  npm run dev
  ```
- Open the URL it prints (usually `http://localhost:5173`). The app live-reloads as Claude Code edits files — this is your "preview," equivalent to Lovable's right-hand pane.
- **Work on a branch and commit often** for rollback safety: `git checkout -b build`, then commit after each working step (`git add -A && git commit -m "Step 4: Home screen"`). Claude Code can do these commits for you.

### Phase D — Walk the build sequence

Feed the **same Step 2 → Step 11 prompts** you already have, one per turn, reviewing the localhost preview after each. The only adaptation: Step 3 no longer needs the seed data pasted in (it's already in `CLAUDE.md`) — just say *"Do Step 3 using the seed data in CLAUDE.md."* Remember to also run the **remove-Coach** change and the **Step 11 polish pass**.

Default to Sonnet; flip to Opus (`/model opus`) for Step 3's math and any stubborn bug, then back.

### Phase E — Deploy to a free live URL

1. **Push to GitHub.** Create an empty repo on github.com, then (Claude Code can do this):
   ```
   git remote add origin https://github.com/<you>/macromenu.git
   git push -u origin build   # or main
   ```
2. **Connect the repo to a host.** On Vercel/Netlify/Cloudflare Pages: "New project" → import your GitHub repo. It auto-detects Vite (build command `npm run build`, output dir `dist`), builds, and hands you a live URL. Every future `git push` auto-redeploys.
3. **Fix SPA routing** (one small step, because react-router needs deep links to fall back to index.html). Ask Claude Code: *"Add the config so this Vite + react-router app routes all paths to index.html on [Netlify/Vercel/Cloudflare]."* (Netlify: a `_redirects` file with `/* /index.html 200`; Vercel: a `vercel.json` rewrite; Cloudflare Pages: a `_redirects` file.)

That live URL is your shareable demo — the same end product Lovable would have given you, now fully yours.

### Phase F — Iterate

Talk to Claude Code → review at localhost → commit → push → auto-deploy. Identical loop to Lovable, just self-assembled and lock-in-free.

---

## 4. Watch-outs and differences vs Lovable

- **You own everything.** The code, the repo, the deploy config — all portable, no platform lock-in. Big long-term win if MacroMenu becomes real.
- **One-time setup tax.** The 20–30 min environment setup is the convenience Lovable charges for. You pay it once.
- **Shared usage pool.** Chat + Claude Code draw from the same 5-hour/weekly limits. Don't burn your window on long chats while building. Monitor with `/status`.
- **Claude Code touches real files and runs real commands.** It asks before most actions; keep Git initialized and work on a branch so you always have a rollback point.
- **No KB size cap.** Use the full spec + seed data in `CLAUDE.md` — better grounding than the compressed Lovable version.
- **Hosting is BYO but trivial.** ~10 minutes to connect a free host the first time; automatic forever after.

---

## 5. Quick-start cheat sheet

```
# One-time setup
install Node 22, Git, VS Code, a GitHub account
curl -fsSL https://claude.ai/install.sh | bash      # (Windows: irm https://claude.ai/install.ps1 | iex)
claude            # log in with Pro account only
claude doctor     # verify

# Project
mkdir macromenu && cd macromenu && git init && claude
# -> save workspace rules to ~/.claude/CLAUDE.md
# -> save full project spec + seed data to ./CLAUDE.md
# -> Step 1: scaffold Vite+React+TS+Tailwind+shadcn + tokens + frame + nav
npm run dev       # preview at localhost:5173

# Build: Steps 2..11 (Sonnet default; /model opus for Step 3 + hard bugs)
# commit after each working step

# Deploy
push repo to GitHub -> import into Vercel/Netlify/Cloudflare Pages -> live URL
# add SPA index.html fallback for react-router
```

---

## 6. Zero-install fallback: build it in claude.ai Artifacts

If you'd rather not set up an environment at all, you can have Claude build the app as a **single-file React Artifact** directly in the claude.ai chat — no Node, no terminal, no install. Honest tradeoffs:

- **No persistence.** Artifacts can't use localStorage/sessionStorage, so onboarding/profile/favorites would be **in-memory only and reset on refresh.**
- **Single-file constraint.** Multi-route, multi-screen apps get crammed into one component with view-state "routing" instead of real `react-router`. Doable for a demo, messier to maintain.
- **Shareable, but not ownable.** You get a Claude artifact link to show people, not a real repo you can deploy to your own domain or take to the App Store later.

**Use Artifacts for:** a fast, zero-setup *visual* demo to react to. **Use Claude Code for:** the real, ownable, deployable product — which is what you're actually building. For MacroMenu, the Claude Code path is the right one.
