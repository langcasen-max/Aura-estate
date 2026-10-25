# Cloudflare Pages Deployment Guide (Sadiqabad Real Estate)

Follow these exact settings to ensure your Cloudflare Pages deployment succeeds with 100% reliability:

---

## 1. Cloudflare Pages Dashboard Settings

When creating or configuring your project in **Cloudflare Pages**:

| Setting | Value |
| :--- | :--- |
| **Framework preset** | `Vite` (or `None`) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave empty) |

---

## 2. Environment Variables (Critical for Vite 8)

In your Cloudflare Pages project:
1. Go to **Settings** > **Environment variables** > **Production** (and **Preview**).
2. Click **Add variable**:
   - **Variable name**: `NODE_VERSION`
   - **Value**: `22`
3. Save.

> **Why this is critical:** Vite 8 and modern Tailwind require Node.js >= 20.19.0 or Node 22+. Cloudflare's default runner uses an older Node version unless `NODE_VERSION=22` is specified.

---

## 3. Removing `bun.lock` from your GitHub Repository

If `bun.lock` was previously committed to your GitHub repository, Cloudflare Pages will detect it and try to run `bun install --frozen-lockfile`, which fails.

### Option A: From GitHub Website (Easiest)
1. Open your repository on GitHub (`github.com/your-username/your-repo`).
2. If you see `bun.lock` in the file list:
   - Click on `bun.lock`
   - Click the **Trash Can icon** (Delete this file)
   - Click **Commit changes**

### Option B: From your Git Terminal
Run these commands in your project folder:
```bash
git rm bun.lock
git add .
git commit -m "Remove bun.lock and add Cloudflare deployment configs"
git push origin main
```

---

## 4. Features Included in this Repository

- `.node-version` and `.nvmrc` set to `22.14.0`
- `scripts/clean-bun-lock.js` automatically purges bun lockfiles prior to any build
- `public/_redirects` ensures SPA client-side routing works on Cloudflare Pages without 404 errors
- Fresh `package-lock.json` provided for clean and fast `npm ci` builds
