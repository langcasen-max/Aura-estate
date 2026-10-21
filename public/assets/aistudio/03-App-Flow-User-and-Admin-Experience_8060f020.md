# Aura Estates — App Flow (User and Admin Experience)

| | |
|---|---|
| **Document** | App Flow v1.0 |
| **Date** | 20 October 2026 |

How to read: each flow lists the **trigger → steps → success → failure handling**. "System" lines describe what the app does behind the scenes.

---

## 1. Site Map

```
Public
├─ /                    Home
├─ /properties          Listings (filters, sort, pages)
├─ /property/:slug      Property detail + enquiry form
├─ /about
├─ /contact
├─ /login   /register   /forgot-password   /reset-password
└─ 404

Signed-in client
├─ /profile
└─ /dashboard           Overview · Saved residences · My enquiries

Admin
└─ /admin (or /dashboard as admin)
   ├─ Overview
   ├─ Properties   (/dashboard/properties)
   ├─ Enquiries    (/dashboard/inquiries)
   ├─ Users
   ├─ Analytics
   └─ Settings
```

## 2. Navigation Rules
- Top bar: **Properties · Buy · Rent · About · Contact**, favourites counter, Sign in / account menu.
- **Properties** always shows *all* listings (resets the Buy/Rent filter). **Buy** and **Rent** pre-filter by status.
- Account menu: Dashboard, Profile, Sign out. Admins also see Admin Console.
- Mobile: hamburger drawer with the same items; closes on navigation.
- Browser Back/Forward restore both page and filters.

## 3. Visitor Flows

### 3.1 Discover (Home)
1. Visitor lands on Home → hero search with **Buy / Rent** toggle, location text, type, price.
2. Presses **Search** → goes to `/properties` with those filters applied and in the URL.
3. Or scrolls → *Featured Residences* (real listings only) → clicks a card → detail page.
- *Empty/failed featured fetch:* section shows a retry message, not fake listings.

### 3.2 Browse and Filter
1. `/properties` loads with skeleton cards.
2. Visitor changes filters (type, status, price, beds, baths, size, amenities, text) or sort.
3. Results update; URL updates; result count shown.
4. Pagination: change page or page size → instant (no reload, no flicker).
5. **Clear all** resets to "all listings".
- *No results:* friendly empty state with a Clear-filters button.
- *Network/DB error:* error state with **Try again**.

### 3.3 View a Property
1. Click card → `/property/<slug>`.
2. System fetches by slug; shows a skeleton until resolved (never the previous property).
3. Page shows: gallery (cover + thumbnails), price, facts, description, amenities, location, **Enquire** panel, related residences.
4. Heart icon saves/unsaves.
- *Slug unknown:* "Residence Unavailable" with a link back to listings.
- *Opened from a shared link in a new browser:* works (database lookup by slug).

### 3.4 Send an Enquiry
1. On the detail page (or Contact page) choose an **enquiry type**.
2. For *Private viewing*: pick preferred date and time.
3. Enter name, email, phone (optional), message.
4. Submit → inline validation (email format; phone accepts `+1 (310) 555-0190`).
5. System inserts the enquiry (guest: no `user_id`; signed-in: own `user_id`; `status = new`).
6. Success panel confirms; form clears.
- *Validation error:* field-level messages, nothing lost.
- *Server rejection (RLS/limits):* clear error, form keeps content.

### 3.5 Save Favourites
- **Guest:** heart stores the property id locally (counter updates).
- **Signed in:** heart writes to `favorites`.
- **On sign-in:** guest favourites merge into the account (only valid ids).
- **On sign-out:** local favourites are cleared so the next user starts empty.
- Saved list shows the actual saved properties regardless of any active filter.

## 4. Account Flows

### 4.1 Register
1. `/register` → name, email, password, confirm.
2. Validation → submit.
3. **If email confirmation is ON:** screen "Please confirm your email — we sent a link to …" with *Go to Sign In*.
4. **If OFF:** account is active, user lands on `/dashboard`.
- *Email already registered:* clear message with link to Sign in.

### 4.2 Sign In
1. `/login` → email, password (show/hide eye works).
2. Success → redirect to the page originally requested, else `/dashboard`.
3. *Wrong credentials / unconfirmed email / rate limit:* mapped friendly messages.

### 4.3 Forgot / Reset Password
1. `/forgot-password` → enter email → "If an account exists, a link was sent".
2. User opens the email link → `/reset-password` with a recovery session.
3. Enter new password + confirm → success → Sign in.
- *Opened without a valid link or link expired:* "Recovery link invalid or expired" + **Request new link**.

### 4.4 Profile
- Edit full name, phone (validated), avatar URL → Save.
- Failure (e.g. permission) shows an error; success updates the header name immediately.
- Role is displayed but **not editable**.

### 4.5 Sign Out
- Ends the session, clears local favourites, returns to Home.

## 5. Client Dashboard Flow
- **Overview:** greeting, counts (saved, enquiries).
- **Saved residences:** grid of saved properties; remove with the heart.
- **My enquiries:** list of own enquiries with type, property, date and status (New/Contacted/Qualified/Closed).
- No admin controls are rendered for clients. (In Demo mode only, a QA role switch exists.)

## 6. Admin Flows

### 6.1 Access
- Admin signs in → Admin Console. Non-admin visiting `/admin` → "Access restricted" screen.
- Even if the UI were bypassed, the database refuses admin writes (RLS).

### 6.2 Properties — Create
1. Properties → **Add Residence**.
2. Fill: title, slug (auto from title, editable), description, type, status, price, beds, baths, sq ft, year, address block, amenities, featured toggle.
3. Add cover image (**Upload** or **URL**); optional extra images.
4. Save → listing appears in the table; public site shows it (if `for_sale`/`for_rent`).
- *Duplicate slug:* "A listing with this URL slug already exists…".
- *Upload fails / too big / wrong type:* specific error; nothing saved.
- *Permission denied:* error message (never a fake success).

### 6.3 Properties — Edit / Quick actions
- Edit opens the same form pre-filled; only changed fields are sent.
- Table quick toggles: **Featured** on/off, **Status** change. If the change did not persist, the toggle reverts and an error shows.

### 6.4 Properties — Delete
1. Delete → confirmation modal (shows title).
2. Confirm → listing, gallery rows and favourites referencing it are removed.
3. Failure → modal stays open with the error.

### 6.5 Media Manager
- **Add:** upload file(s) or paste a URL (+ alt text).
- **Set cover:** exactly one cover; also updates the listing's `featured_image`.
- **Reorder:** drag/arrow controls; saved on confirm.
- **Delete:** if the cover is deleted, the first remaining image becomes the cover.

### 6.6 Enquiries
1. List with filters (status, type, search) and a status badge.
2. Open an enquiry → details (contact info, property link, message, preferred slot).
3. Change status New → Contacted → Qualified → Closed (verified write).
4. Delete (confirm) · **Export CSV** (all cells quoted, formulas neutralised).

### 6.7 Users
- Table of real accounts from `profiles` (name, email, role, joined, enquiry count).
- **Promote / demote** role (confirmation when changing your own role).
- Creating accounts directly is **not** supported by the browser (it cannot create auth users): people register themselves, then an admin promotes them. The "Provision account" button explains this instead of faking success.

### 6.8 Analytics
- Enquiries over time, by type, funnel by status, listings by type/status, estimated commission = sum(sold prices) × commission rate (from Settings).

### 6.9 Settings
- Agency name, address, phone, email, hours, commission rate.
- These values feed the Footer and Contact page from one shared config.

## 7. Global States

| State | Behaviour |
|---|---|
| Loading | skeletons / spinners, never a blank page |
| Empty | explanatory text + next action |
| Error | plain-language message + **Try again** |
| Offline | error state; no data is invented |
| 404 | NotFound page with link Home |
| Session expired | next protected action redirects to Sign in, then returns |

## 8. Decision Diagram — Access Control

```
Open protected URL
   │
   ├─ not signed in ──► /login (remember destination) ──► after login go back
   │
   ├─ signed in, route needs admin, role≠admin ──► "Access restricted"
   │
   └─ allowed ──► page; every write still checked by the database (RLS)
```
