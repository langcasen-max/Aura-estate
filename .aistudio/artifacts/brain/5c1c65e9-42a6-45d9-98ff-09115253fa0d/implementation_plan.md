# Cloudflare Pages Flawless Build & Automatic bun.lock Deletion

Configure automated pre-build and in-build cleanups to purge `bun.lock` and `bun.lockb`, set up Cloudflare Pages SPA redirection rules, establish Node 20 runtime pinning, and ensure 100% clean deployment without build or routing errors.

### User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed **Cloudflare Pages connected to GitHub repository** and requested a **dedicated Cloudflare build command with automatic bun.lock removal**. All build scripts, routing rules, and lockfile safeguards will be automated to ensure smooth deployments.

- **Confirmed Decision 1**: Deploying via Cloudflare Pages connected to GitHub repository.
- **Confirmed Decision 2**: Automatic deletion of `bun.lock` and `bun.lockb` through a dedicated ES-module cleanup script executed before every build command.
- **Critical Cloudflare SPA Requirement**: Add `public/_redirects` to route all page paths (`/properties`, `/property/:slug`, `/admin`, etc.) to `/index.html` with HTTP 200 to prevent 404 errors on direct navigation or page refresh.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. Guarantees that `bun.lock` and `bun.lockb` are instantly and automatically deleted before npm or Vite runs, preventing Cloudflare's build container from falsely detecting Bun or failing package resolution.
  2. Creates `public/_redirects` so Cloudflare Pages serves the React Single Page Application across all deep routes without 404 errors.
  3. Pins Node.js runtime to version 20 via `.node-version` and `.nvmrc` so Cloudflare's build environment uses modern Node compatible with Vite 8 and React 19.
  4. Provides explicit Cloudflare build command options in `package.json` (`npm run build` and `npm run build:cloudflare`).
- **Target Audience**: Website owner and administrator deploying Sadiqabad Real Estate to Cloudflare Pages.
- **Key Value**: 100% automated, zero-error deployment pipeline on Cloudflare with zero manual lockfile cleanup required.

---

### 2. User Experience & Visual Design

- **Zero Breaking Visual Changes**: Existing styling, Sadiqabad real estate listings, PKR currency, Marla sizing, and Admin Panel functionality remain completely intact.
- **Routing Reliability**: Visitors refreshing URLs like `/property/3-marla-budget-house-kausar-colony-sadiqabad` or navigating directly to `/admin` on Cloudflare Pages will experience seamless client-side SPA routing rather than Cloudflare's default 404 "Page Not Found".

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Cross-Platform ES-Module Lockfile Cleaner Script**
  - *Chosen Approach*: Implement `scripts/clean-bun-lock.js` using native `node:fs` and `node:path`. Hook it into `prebuild`, `build`, and `build:cloudflare`.
  - *Why*: The previous `node -e` inline script used CommonJS `require()`, which throws syntax errors in Node ESM (`"type": "module"`) environments. A dedicated script runs reliably across Linux (Cloudflare runner), macOS, and Windows.
  - *Alternatives Considered*: Shell command `rm -f bun.lock`, which fails on Windows systems.

- **Decision 2: Cloudflare Pages Redirects File (`public/_redirects`)**
  - *Chosen Approach*: Add `/* /index.html 200` in `public/_redirects`. Vite automatically copies everything from `public/` into `dist/` root on build.
  - *Why*: Cloudflare Pages reads `_redirects` at the root of the output directory (`dist/_redirects`) to handle SPA fallback routing.

- **Decision 3: Node Environment Pinning**
  - *Chosen Approach*: Add `.node-version` and `.nvmrc` specifying `20.18.0`.
  - *Why*: Cloudflare Pages build environment automatically inspects `.node-version` or `.nvmrc` to install and activate Node 20, avoiding older Node 18 or 16 fallbacks that break Vite 8.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   GitHub Repository                    │
│   (git push ignores bun.lock / bun.lockb via .gitignore)│
└──────────────────────────┬─────────────────────────────┘
                           │ Webhook Trigger
                           ▼
┌────────────────────────────────────────────────────────┐
│             Cloudflare Pages Build Runner              │
│                                                        │
│  1. Node 20 detected via .node-version / .nvmrc        │
│  2. npm run build:cloudflare                           │
│     ├── Step A: scripts/clean-bun-lock.js              │
│     │   └── Auto-deletes any bun.lock / bun.lockb      │
│     └── Step B: vite build                             │
│         └── Compiles TypeScript & React into /dist     │
│  3. Output Directory: dist                             │
│     ├── index.html                                     │
│     ├── assets/ (CSS & JS bundles)                     │
│     └── _redirects (/* /index.html 200 for SPA routes) │
└──────────────────────────┬─────────────────────────────┘
                           │ Deployed
                           ▼
┌────────────────────────────────────────────────────────┐
│               Live Production App                      │
│   https://<your-project>.pages.dev                     │
│   • Direct link access to all property URLs            │
│   • Admin login & Sadiqabad property catalogue         │
└────────────────────────────────────────────────────────┘
```

#### Proposed Changes

1. **`scripts/clean-bun-lock.js`**:
   - Cross-platform Node script that deletes `bun.lock` and `bun.lockb` silently if they exist.
2. **`package.json`**:
   - Update `scripts.prebuild` to call `node scripts/clean-bun-lock.js`.
   - Update `scripts.build` to `node scripts/clean-bun-lock.js && vite build`.
   - Add `scripts["build:cloudflare"]` = `node scripts/clean-bun-lock.js && vite build`.
3. **`public/_redirects`**:
   - Add SPA fallback rule: `/*    /index.html   200`.
4. **`.node-version` & `.nvmrc`**:
   - Set version to `20.18.0`.
5. **`.gitignore`**:
   - Verify `bun.lock` and `bun.lockb` entries are present.
6. **Cloudflare Deployment Settings Guide**:
   - Build Command: `npm run build:cloudflare` (or `npm run build`)
   - Build output directory: `dist`
   - Framework preset: `Vite` or `None`

#### Verification Plan

1. Verify `compile_applet` succeeds with the new scripts and files.
2. Verify `lint_applet` passes without errors.
3. Test lockfile cleaner by creating a dummy `bun.lock` file and executing the clean/build script to confirm automatic deletion.
