# Aura Estates — Technical Requirements Document (TRD)

| | |
|---|---|
| **Document** | TRD v1.0 |
| **Date** | 20 October 2026 |
| **Audience** | Developers, DevOps, QA |
| **Status** | Target specification. Rules marked pending in Document 06 are not yet in the code |

---

## 1. Architecture Overview

```
 Browser (React 19 SPA, Vite, Tailwind v4)
        │  supabase-js (HTTPS, anon key + user JWT)
        ▼
 Supabase
   ├─ Auth      (email/password, recovery emails)
   ├─ Postgres  (tables + Row Level Security + triggers)
   └─ Storage   (bucket: property-images)

 Hosting: Vercel (static build + SPA rewrite)
```

There is **no custom server**. All authorisation is enforced by Postgres Row Level Security (RLS). The browser is never trusted for roles.

## 2. Technology Stack

| Layer | Choice |
|---|---|
| UI | React 19, TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), fonts: Instrument Serif + Plus Jakarta Sans |
| Backend | Supabase (`@supabase/supabase-js` v2) |
| Hosting | Vercel (`vercel.json` rewrites all paths to `index.html`) |
| Routing | Custom path router in `App.tsx` (History API) |
| State | React state + Context (`AuthContext`), service modules for data |

## 3. Repository Structure

```
src/
  App.tsx                 router, global state (filters, favourites, selected property)
  main.tsx
  config/site.ts          single source for agency name/address/phone/email (Phase 5)
  contexts/AuthContext.tsx
  lib/
    supabase.ts           client + isSupabaseConfigured + isUuid
    security.ts           validation, text normalising, filter escaping, slug, upload checks
    seo.ts                per-page meta + JSON-LD
  services/               ONE module per domain
    propertyService.ts
    favoriteService.ts
    inquiryService.ts
    userService.ts
    analyticsService.ts
    settingsService.ts
    mockData.ts           demo mode only (lazy-loaded)
  pages/                  Home, Properties, PropertyDetail, About, Contact,
                          Login, Register, ForgotPassword, ResetPassword,
                          Profile, Dashboard, NotFound
  components/
    ui/ layout/ property/ auth/ admin/
  types/                  property, inquiry, user, database
supabase/
  schema.sql
  migrations/
public/                   robots.txt, sitemap.xml, favicon
```

## 4. Environment and Configuration

`.env` (never committed, never zipped/shared):

```
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon/publishable key>
```

Rules:
- Credentials are read **only** from env vars. There is no hardcoded fallback project.
- If either variable is missing the app starts in **Demo mode** (mock data + localStorage) and logs a warning. Demo shortcuts (instant admin, role simulator) exist **only** in Demo mode.
- Set the same two variables in Vercel → Project → Settings → Environment Variables.
- `.env.example` documents the variables.

## 5. Authentication and Authorisation

### 5.1 Flow
1. `AuthProvider` subscribes to `supabase.auth.onAuthStateChange` (single source of truth; `INITIAL_SESSION` covers page load).
2. The callback **defers** profile loading with `setTimeout(0)` — awaiting Supabase calls inside this callback can deadlock the auth lock.
3. Profile row (`profiles`) supplies `role`. On a transient failure the previous profile is kept (an admin is never silently downgraded); a brand-new session defaults to least privilege (`user`).
4. `signUp` returns `needsEmailConfirmation` when Supabase created a user without a session.
5. Password reset: `resetPasswordForEmail` → link → `/reset-password`, which requires a valid recovery session before showing the form.

### 5.2 Role enforcement
| Layer | Mechanism |
|---|---|
| UI | `ProtectedRoute` hides pages (convenience only) |
| API | RLS policies call `public.is_admin()` (SECURITY DEFINER, pinned `search_path`) |
| Escalation | Trigger `prevent_user_role_escalation` blocks non-admins from changing `role`; SQL Editor / service role (no `auth.uid()`) may bootstrap the first admin |
| Sign-up | `handle_new_user` always creates profiles as `user`; the client never sends a role |

## 6. Data Access Rules (service layer)

These rules apply to every function in `src/services`:

1. **Configured backend → database is the only source of truth.** Errors are *thrown*; the UI shows them. No silent fallback to localStorage or mock data.
2. **Demo mode** (no env) uses `localStorage` + lazily imported mock data, clearly separated.
3. **Writes must verify effect.** `update`/`delete` chain `.select('id')` and throw if zero rows changed (RLS silently returns 0 rows instead of an error).
4. **UUID safety.** `id` columns are UUID. Lookups choose `id` vs `slug` with `isUuid()`; non-UUID values are never sent to UUID columns.
5. **Filter-injection safety.** Any user text placed inside a PostgREST `.or()`/`.ilike` string goes through `escapeFilterValue()`. Related-property queries avoid `.or()` entirely.
6. **No base64 in the database.** Image upload failure is an error; `data:` URLs are only produced in Demo mode.
7. **Partial updates.** `updateProperty` sends only provided fields, validated by `toDbFields()`.
8. **Atomic-ish creation.** If media insert fails after the property insert, the property row is removed.

### Service contract (propertyService)
| Function | Notes |
|---|---|
| `getProperties(filters)` | server-side filters/sort; amenities filtered client-side |
| `getFeaturedProperties()` | DB only, max 6 |
| `getRelatedProperties(p, n)` | type → city → latest; never throws |
| `getPropertyByIdOrSlug(x)` | UUID→`id`, else `slug`; `maybeSingle`; `null` if absent |
| `getPropertiesByIds(ids[])` | used for the Saved list (independent of active filters) |
| `createProperty / updateProperty / deleteProperty` | admin; throw on failure |
| `addPropertyMedia / deletePropertyMedia / updatePropertyMedia / setPrimaryMedia / reorderPropertyMedia` | keep exactly one cover |
| `uploadImageFile(file)` | validates, uploads to `property-images`, returns public URL |

## 7. Client Routing and State

| Path | Page | Access |
|---|---|---|
| `/` | Home | public |
| `/properties` | Listings | public |
| `/property/:slug` | Detail | public |
| `/about`, `/contact` | Info | public |
| `/login`, `/register`, `/forgot-password` | Auth | public |
| `/reset-password` | Reset | recovery session |
| `/profile` | Profile | signed in |
| `/dashboard[/properties\|/inquiries]` | Client or admin dashboard | signed in |
| `/admin[/…]` | Admin console | admin |
| anything else | 404 | public |

State rules:
- Filters live in React state **and** are written to the URL (`replaceState`) on `/properties`; initial and `popstate` parsing reads them back (including `page_size`).
- `page` / `page_size` changes **do not refetch**; pagination is a client-side slice of the fetched result. (Server pagination is a P2 item for very large catalogues.)
- Property fetches use a `cancelled` flag to prevent stale responses overwriting newer ones.
- The detail page tracks the resolved slug so a previous property is never flashed.
- Featured properties are fetched once, not on every filter change.
- Favourites: guests → `localStorage`; signed-in → `favorites` table; guest favourites merge on sign-in; local favourites are cleared on sign-out.

## 8. Validation and Security Controls

| Control | Implementation |
|---|---|
| Email / phone | `isValidEmail`, `isValidPhone` (7–15 digits; `+ ( ) - . / space` allowed) |
| Text | `sanitizeText`: removes control chars, trims, caps length. **Does not** strip `<…>` (React escapes output) |
| Image URL | `isSafeImageUrl`: only `http(s)` or `data:image/(jpeg\|png\|webp\|avif)` |
| Upload | client check (type, ≤10 MB) **and** bucket limits (10 MB; jpeg/png/webp/avif) |
| Slug | `generateSafeSlug` (accents → ASCII, kebab-case) |
| Inquiry insert | RLS: required fields, email regex, length limits, `user_id` must be NULL or `auth.uid()`, `status='new'` |
| Privacy | `profiles` readable only by owner or admin (admin contact details are no longer public) |
| Secrets | Only the public anon key is in the browser; service-role key is never used client-side |
| CSV export | Quote every cell, neutralise leading `= + - @`, download via `Blob` (not `data:` URL, which truncates at `#`) |

## 9. Performance Requirements
- Route-level lazy loading for Dashboard/admin code.
- Images: `loading="lazy"`, explicit sizes, compressed assets (hero ≤ 300 KB, listing images ≤ 200 KB recommended).
- Demo mock data imported lazily, never in the production path.
- Database indexes on type, status, city, price, featured, and composite search (see Backend Schema).
- Target: LCP < 2.5 s on 4G mobile, CLS < 0.1.

## 10. SEO
- `updatePageSeo()` sets title/description/canonical/OG per route; JSON-LD on home and detail pages.
- `robots.txt` uses an **absolute** sitemap URL; `sitemap.xml` should list static pages (property URLs are added at build/deploy time or via a generated sitemap).
- `og:image` provided in `index.html`.
- Note: as a client-rendered SPA, social-card scrapers may not run JS. If link previews matter, add prerendering or SSR in a later phase.

## 11. Accessibility
- Visible focus states, labelled inputs, `aria-live` for form errors.
- Modals: `role="dialog"`, `aria-modal`, Escape to close, focus moved in and restored on close, scroll lock.
- Colour contrast ≥ 4.5:1 for body text; touch targets ≥ 40 px.

## 12. Build, Test, Deploy

| Step | Command / Action |
|---|---|
| Install | `npm install` (use **one** package manager; keep a single lockfile) |
| Dev | `npm run dev` |
| Type-check | `npx tsc --noEmit` |
| Build | `npm run build` |
| Deploy | Push to Git → Vercel; env vars set in Vercel |
| DB | Run `schema.sql` → phase 7 migration → `20261011_phase_fixes_*.sql` in order |

### Test matrix (minimum)
| Area | Cases |
|---|---|
| Auth | register (with and without email confirm), login, wrong password, forgot/reset, expired link, sign-out clears favourites |
| Roles | client cannot open `/admin`; client cannot write properties via API; admin can |
| Listings | each filter, sort, pagination, URL restore, empty result |
| Detail | open by slug in a fresh browser, unknown slug → not-found state |
| Admin CRUD | create (duplicate slug error), edit, delete, toggle featured |
| Media | upload ok, oversize rejected, wrong type rejected, set cover, delete cover |
| Enquiry | each type, invalid phone/email, guest and signed-in, status change, CSV with `#` and `=` characters |
| Failure | offline / RLS denial must show an error, never "success" |

## 13. Known Technical Debts / Open Items
- `strict` TypeScript is not enabled yet (needs a local pass: many `any` casts around Supabase typed calls).
- Dependency list contains unused packages (`express`, `dotenv`, `@google/genai`, `motion`, etc.) to remove.
- Verify Vite/TypeScript major versions install cleanly and update bundler options accordingly (`manualChunks` placement).
- Site settings are browser-local until a `site_settings` table is added.
