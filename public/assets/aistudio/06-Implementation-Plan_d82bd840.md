# Aura Estates — Implementation Plan

| | |
|---|---|
| **Document** | Implementation Plan v1.0 |
| **Date** | 20 October 2026 |

This plan turns the audit findings (issues **#1–#37**) into **6 delivery phases**, followed by a launch checklist. Status is shown per task.

Legend: ✅ done · 🔶 partly done · ⏳ not started

---

## 1. Phase Overview

| Phase | Theme | Issues covered | Status |
|---|---|---|---|
| **1** | Security and Auth | #1, #7, #8, #10 (RLS part), #15, #16, #34 | ✅ code + SQL ready |
| **2** | Data layer integrity | #2, #3, #4, #5, #6, #9, #11, #35, #14, #13 | 🔶 propertyService + security lib done |
| **3** | App logic and routing | #17, #18, #19, #20, #21, #36 | ⏳ |
| **4** | UI and form bugs | #12, #22, #24, #25, #30, #33 | ⏳ |
| **5** | Admin, settings, SEO | #23, #37, #9 (UI), #32 | ⏳ |
| **6** | Config, cleanup, verification | #26, #27, #28, #29, #31 | ⏳ |
| **Launch** | Supabase setup → deploy → QA → go-live | — | ⏳ |

## 2. Phase 1 — Security and Auth ✅

| Task | Result |
|---|---|
| Remove hardcoded Supabase URL/key fallback; read env only | ✅ `lib/supabase.ts` |
| `isSupabaseConfigured` true only for real env values | ✅ |
| Demo login / "Switch to Admin Mode" / role simulator shown only in Demo mode | ✅ Login, Register, Dashboard, AdminSidebar, AdminUsersView |
| `signIn` no longer falls back to a fake admin when a backend exists | ✅ |
| Sign-up with email confirmation shows a "check your inbox" screen | ✅ |
| Reset-password page requires a valid recovery session | ✅ |
| `onAuthStateChange` no longer awaits Supabase calls inside the callback; single profile load path | ✅ |
| Profile fetch failure never downgrades an admin | ✅ |
| `updateProfile` verifies a row changed; never touches localStorage in live mode | ✅ |
| SQL: remove public read of admin profiles; pin `search_path`; fix first-admin bootstrap; inquiry insert checks; bucket size/type limits | ✅ `20261011_phase_fixes_security_and_integrity.sql` |
| **You must:** run the new SQL; keep `.env` out of zips/Git; (optional) rotate the anon key | ⏳ owner action |

**Exit criteria:** a client cannot reach admin UI; no demo buttons in production; sign-up/reset flows behave correctly.

## 3. Phase 2 — Data Layer Integrity 🔶

| Task | Status |
|---|---|
| `security.ts`: stop deleting `<…>` text, fix phone validation, accent-safe slugs, add `escapeFilterValue`, `isSafeImageUrl` | ✅ |
| `propertyService` rewrite: DB-only when configured, errors thrown, UUID/slug lookup fixed, no fake featured data, escaped search, no base64 fallback, verified writes, `getPropertiesByIds` | ✅ |
| `favoriteService`: no default `prop-1`, only valid UUIDs synced, `clearLocalFavorites()` | ⏳ |
| `inquiryService`: validate `property_id`, parse type from message header, verified status/delete, no local fallback when live | ⏳ |
| `userService`: real profiles only, real enquiry counts, remove fake users, `createManagedUser` returns an honest message in live mode | ⏳ |
| `analyticsService`: use parsed enquiry type (no text guessing), commission from settings | ⏳ |
| Type-check all services | ⏳ |

**Exit criteria:** every admin write either persists or shows an error; shared slug links work in a fresh browser; no mock data in live mode.

## 4. Phase 3 — App Logic and Routing ⏳

| Task | Detail |
|---|---|
| Properties link resets filter | Navbar "Properties" passes `{ listing_status: 'all' }` (desktop + mobile) |
| Filters ⇄ URL | write via `replaceState` on `/properties`; parse `page_size` too |
| No refetch on page change | fetch key excludes `page` / `page_size`; featured fetched once |
| Race conditions | `cancelled` flag in `loadProperties` and detail resolution |
| Detail flash | track `resolvedParam`; show skeleton until it matches |
| Saved list | load with `getPropertiesByIds`, independent of filters |
| Favourites | default `[]`; clear on sign-out; merge guests on sign-in |
| Remove dead functions | `getPropertiesWithPagination`, `getUserInquiries`, etc. (#36) |

**Exit criteria:** refresh/back keep filters; page switching is instant; saved list stable under filters.

## 5. Phase 4 — UI and Form Bugs ⏳

| Task | Detail |
|---|---|
| Password eye button | wrapper `pointer-events-none` → only the icon wrapper (non-interactive icons) |
| Contact/inquiry validation | uses fixed phone validator (already in `security.ts`) |
| CSV export | `Blob` download, quote all cells, neutralise `= + - @` |
| Footer | working filtered links (Buy, Rent, types); add Privacy and Terms pages |
| Status labels | public UI shows only for-sale / for-rent; hidden statuses admin-only (matches RLS) (#25) |
| Missing animations | define `fade-in`, `fade-in-up`; replace `scrollbar-none` with CSS utility (#30) |
| Modal accessibility | focus trap + restore, unique title id (#33) |

**Exit criteria:** UI QA checklist in Design Brief §9 passes.

## 6. Phase 5 — Admin, Settings, SEO ⏳

| Task | Detail |
|---|---|
| `config/site.ts` | single agency identity used by Footer, Contact, settings defaults, JSON-LD |
| Settings | remove dead toggles (maintenance, auto-responder); keep agency details + commission; clear note that values are per-browser **or** add `site_settings` table (see Backend Schema §3.6) |
| Users view | hide status "suspend" (no backend), real counts only, explain account provisioning |
| Backup export | admin-only, document that it contains personal data; use `Blob` |
| SEO | absolute sitemap URL in `robots.txt`, more sitemap entries, `og:image`, config-driven JSON-LD |

**Exit criteria:** no admin control pretends to do something it does not.

## 7. Phase 6 — Config, Cleanup, Verification ⏳

| Task | Detail |
|---|---|
| Remove unused deps | `express`, `dotenv`, `@google/genai`, `motion`, `lucide-react`, `autoprefixer`, `esbuild`, `tsx` (confirm unused first) |
| One package manager | keep `package-lock.json` **or** `bun.lock`, delete the other, align README |
| Bundler config | verify `manualChunks` placement for the installed Vite major version |
| Image weight | compress hero and listing images (target hero ≤ 300 KB, others ≤ 200 KB, WebP) |
| TypeScript | `npx tsc --noEmit` clean; then enable `"strict": true` and fix the casts |
| Build | `npm run build` succeeds; check bundle size |

**Exit criteria:** clean install, type-check and production build on a fresh machine.

> Note: the build environment used during development has no network access, so `npm install`, `tsc` against real type packages, and `vite build` must be run on your machine at the end of Phase 6.

## 8. Launch Plan

### 8.1 Supabase setup (≈ 30 min)
1. Create project → copy URL and anon key.
2. SQL Editor: run `schema.sql` → phase 7 migration → `20261011_…` migration.
3. Auth → URL Configuration: add site URL and `https://<domain>/reset-password`, `https://<domain>/login` to redirect allow-list.
4. Auth → Email: decide on confirmation; configure SMTP for production.
5. Register yourself, then promote to admin (Backend Schema §9).
6. Storage: confirm bucket `property-images` and its limits.

### 8.2 Content
- Add 6–12 real listings with compressed images; mark 3–6 as featured.
- Fill agency details; add Privacy and Terms text.

### 8.3 Deploy (Vercel)
1. Connect repo; framework preset Vite.
2. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. Deploy; attach custom domain; update sitemap/robots/canonical domain.

### 8.4 Pre-launch QA — must all pass
- [ ] Test matrix in TRD §12
- [ ] Fresh-browser open of a shared `/property/<slug>` link
- [ ] Client account cannot reach admin; direct API write as client is rejected
- [ ] Failed save shows an error (simulate by blocking network)
- [ ] Mobile pass at 360 px; Lighthouse ≥ targets
- [ ] No console errors on main flows; no `.env` in the repository

### 8.5 Go-live and after
- Monitor Supabase logs and Vercel analytics for the first week.
- Triage new enquiries daily.
- v1.1 backlog: CAPTCHA/rate limiting, `site_settings` table, enquiry columns, admin email notifications, server-side pagination, prerendering for social previews.

## 9. Timeline (single developer, indicative)

| Block | Effort |
|---|---|
| Phase 2 remainder | 0.5–1 day |
| Phase 3 | 1 day |
| Phase 4 | 1 day |
| Phase 5 | 1 day |
| Phase 6 | 0.5–1 day |
| Launch setup + QA | 1–1.5 days |
| **Total** | **≈ 5–6.5 working days** |

## 10. Definition of Done (project)
1. All six phases' exit criteria met.
2. `npm run build` and `npx tsc --noEmit` pass.
3. Pre-launch QA checklist fully ticked.
4. SQL migrations applied in order on the production project.
5. These six documents updated to match what shipped.
