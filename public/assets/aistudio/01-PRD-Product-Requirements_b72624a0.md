# Aura Estates — Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | Aura Estates — Modern Luxury Real Estate Platform |
| **Document** | PRD v1.0 |
| **Date** | 20 October 2026 |
| **Status** | Target specification. Items still being implemented are tracked in Document 06 (Implementation Plan) |

---

## 1. Product Summary

Aura Estates is a single-page web application for a luxury real-estate agency. Visitors browse and filter premium residences, save favourites, and send enquiries (private viewings, dossiers, acquisition or financing advice). Agency staff (admins) manage the property catalogue, galleries, enquiries and client accounts from a built-in dashboard.

**One-line pitch:** *A fast, editorial-quality property showcase that turns browsing into qualified enquiries, with a back-office that lets a small team run the whole pipeline.*

## 2. Goals and Non-Goals

### Goals
1. Present listings beautifully and load fast on mobile.
2. Convert visitors into **enquiries** (primary KPI).
3. Let admins add/edit/remove listings and images without a developer.
4. Give admins one place to triage enquiries from *New* to *Closed*.
5. Keep client data private and the admin area secure (role enforced by the database, not the browser).

### Non-Goals (v1)
- Online payments, mortgage calculators with live rates, e-signature.
- Multi-agency / multi-tenant support.
- Native mobile apps (the web app is responsive).
- Map-based search (latitude/longitude are stored, but no map UI yet).

## 3. Users and Roles

| Role | Who | Can do |
|---|---|---|
| **Visitor (public)** | Anyone, not signed in | Browse listings, filter/search, open details, submit an enquiry, keep favourites locally |
| **Client (`user`)** | Registered customer | Everything above + persistent favourites, profile editing, view own enquiries |
| **Admin (`admin`)** | Agency staff | Everything above + manage properties/media, all enquiries, user roles, analytics, settings |

Roles are stored in `profiles.role`. The first admin is created manually in the database (see Implementation Plan). A client can **never** change their own role.

## 4. Feature Requirements

Priority: **P0** must-have for launch · **P1** should-have · **P2** later.

### 4.1 Public Site
| ID | Requirement | Priority |
|---|---|---|
| PUB-1 | Home page with hero search (buy / rent toggle, location, type, price) and featured residences | P0 |
| PUB-2 | Property listing page with filters: listing status, type, price range, beds, baths, sq ft, city, amenities, text search | P0 |
| PUB-3 | Sorting: newest, oldest, price ↑/↓, size, bedrooms | P0 |
| PUB-4 | Pagination with a selectable page size | P0 |
| PUB-5 | Filters are reflected in the URL so a filtered view can be shared and survives refresh/back | P1 |
| PUB-6 | Property detail page: gallery, key facts, description, amenities, location, related properties, enquiry form | P0 |
| PUB-7 | Shareable property URL by slug (`/property/<slug>`) that works for a first-time visitor | P0 |
| PUB-8 | About and Contact pages; contact form | P0 |
| PUB-9 | Favourite (save) a property; guests keep favourites locally and they merge into the account on sign-in | P1 |
| PUB-10 | Per-page SEO title/description, structured data, sitemap and robots | P1 |
| PUB-11 | Friendly loading, empty and error states everywhere (no blank screens) | P0 |

### 4.2 Accounts
| ID | Requirement | Priority |
|---|---|---|
| ACC-1 | Register with name, email, password (min 6 chars; confirm password) | P0 |
| ACC-2 | If email confirmation is enabled, show a clear "check your inbox" screen | P0 |
| ACC-3 | Sign in / sign out with friendly error messages | P0 |
| ACC-4 | Forgot-password email and reset-password page that only works from a valid recovery link | P0 |
| ACC-5 | Profile page: edit name, phone, avatar URL | P1 |
| ACC-6 | Protected routes: `/dashboard`, `/profile` need sign-in; `/admin` needs admin | P0 |
| ACC-7 | Redirect back to the originally requested page after sign-in | P1 |

### 4.3 Enquiries
| ID | Requirement | Priority |
|---|---|---|
| ENQ-1 | Enquiry types: private viewing, architectural dossier, acquisition advisory, financing, general | P0 |
| ENQ-2 | Fields: name, email, phone (optional), message, optional preferred date/time (viewings) | P0 |
| ENQ-3 | Validation of email and phone (international formats such as `+1 (310) 555-0190` must be accepted) | P0 |
| ENQ-4 | Guests and signed-in users can submit; a user can see their own enquiries | P0 |
| ENQ-5 | Admin pipeline status: New → Contacted → Qualified → Closed | P0 |
| ENQ-6 | Admin can delete an enquiry and export enquiries to CSV | P1 |

### 4.4 Admin Dashboard
| ID | Requirement | Priority |
|---|---|---|
| ADM-1 | Overview: key counts and recent activity | P0 |
| ADM-2 | Properties: table with search, status/featured toggles, create, edit, delete (with confirmation) | P0 |
| ADM-3 | Media manager: upload or add by URL, set cover, reorder, delete, alt text | P0 |
| ADM-4 | Enquiries: filter, search, view details, change status, export | P0 |
| ADM-5 | Users: list accounts, promote/demote role | P0 |
| ADM-6 | Analytics: enquiries over time, listings by type/status, pipeline funnel, estimated commission | P1 |
| ADM-7 | Settings: agency contact details, commission rate | P1 |
| ADM-8 | Every admin action shows a truthful result: a failed save must show an error, never a false "success" | P0 |

## 5. Business Rules
- A property has a **unique slug**; creating a duplicate shows a clear message.
- Exactly **one** gallery image is the cover; deleting the cover promotes another image automatically.
- Listing status `sold` and `pending` are visible to admins only; the public sees `for_sale` and `for_rent`.
- Prices are stored with currency (default USD); size in sq ft.
- Enquiry status flows only forward in normal use but admins may set any status.
- Input text is stored as typed (output is escaped by React); no silent deletion of characters such as `<` or `>`.

## 6. Success Metrics
| Metric | Target |
|---|---|
| Visitor → enquiry conversion | ≥ 2 % |
| Lighthouse Performance (mobile) | ≥ 85 |
| Lighthouse Accessibility | ≥ 95 |
| Time for an admin to publish a new listing with 5 photos | < 5 minutes |
| Median first response to a *New* enquiry | < 24 hours |
| Critical bugs open at launch | 0 |

## 7. Assumptions, Risks, Dependencies
| Item | Detail | Mitigation |
|---|---|---|
| Supabase availability | All data lives in Supabase | Show retryable error states; keep env vars correct |
| Email deliverability | Sign-up/reset emails | Configure custom SMTP for production |
| Spam enquiries | Public insert is allowed | Server-side validation now; add CAPTCHA/rate limit (P1) |
| Image weight | Large JPGs hurt mobile speed | Compress hero/listing images; upload size limit 10 MB |
| Demo mode | Without env vars the app runs on mock data | Demo shortcuts are hidden whenever a backend is configured |

## 8. Release Scope
- **MVP (launch):** all P0 items.
- **v1.1:** all P1 items (URL-synced filters, analytics, settings in database, CAPTCHA).
- **Later (P2):** map view, saved searches, email notifications to admins, multi-language.

## 9. Acceptance Criteria (summary)
1. A new visitor opening a shared `/property/<slug>` link sees that property (no 404).
2. Home page "Featured" shows only real database listings.
3. A client cannot see any admin UI or perform admin writes, in the UI **or** via the API.
4. Creating, editing or deleting a listing either truly persists or shows an error.
5. Password show/hide works; phone numbers in international format validate.
6. Filtered listing URLs can be refreshed and shared.
