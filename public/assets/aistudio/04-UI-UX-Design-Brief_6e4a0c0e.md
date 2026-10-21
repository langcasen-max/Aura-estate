# Aura Estates — UI/UX Design Brief

| | |
|---|---|
| **Document** | UI/UX Design Brief v1.0 |
| **Date** | 20 October 2026 |

---

## 1. Brand and Experience Goals
**Brand personality:** calm, editorial, discreet luxury — "gallery, not marketplace".
**Keywords:** refined · spacious · confident · trustworthy · quiet.
**The experience should feel like:** turning the pages of an architecture magazine that also lets you book a viewing in two taps.

**Design principles**
1. **Photography leads.** Large, well-cropped images; UI stays out of the way.
2. **Generous whitespace.** Let each listing breathe; avoid dense grids of badges.
3. **One clear action per screen.** The enquiry CTA is always obvious, never shouting.
4. **Honest feedback.** Every action shows loading, success or a plain-language error.
5. **Mobile first.** Most luxury browsing happens on phones.

## 2. Visual Language (matches the current codebase)

### Typography
| Use | Font | Notes |
|---|---|---|
| Display / headings | **Instrument Serif** (`font-serif`, `.font-display`) | large, tight tracking, sentence case |
| Body / UI | **Plus Jakarta Sans** (`font-sans`) | 14–16 px body, 12 px helper text |
| Numbers (prices) | Serif for hero prices, sans tabular for tables | |

Scale: 12 · 14 · 16 · 18 · 24 · 32 · 48 · 64 px. Line-height 1.5 body, 1.1–1.2 headings.

### Colour (Tailwind `stone` neutral system + restrained accent)
| Role | Token | Usage |
|---|---|---|
| Ink / primary | `stone-900` | headings, primary buttons |
| Text | `stone-700` / `stone-600` | body, secondary |
| Muted | `stone-500` / `stone-400` | helper text, icons |
| Borders | `stone-200` / `stone-100` | cards, dividers |
| Surface | `white` / `stone-50` | cards / page background |
| Accent | `amber-50 … amber-900` | featured, highlights, admin accents |
| Success | `emerald-50 … 900` | confirmations |
| Error | `red-50 … 700` | validation, destructive |

Rules: body text ≥ 4.5:1 contrast; never rely on colour alone (pair with icon/text); accent is used sparingly (≤ 10 % of any screen).

### Shape, elevation, motion
- Radius: 8 px (inputs/buttons), 12 px (cards), 16 px+ (hero/modals).
- Shadow: very soft (`shadow-xs/sm`); borders do most of the work.
- Motion: 150–250 ms ease-out; fade/slide-up for modals and cards; hover image zoom ≤ 3 %. Respect `prefers-reduced-motion`.
- Define the `fade-in` / `fade-in-up` keyframes in CSS (class names used in components must exist).

### Layout
- Container max-width ≈ 1280 px, side padding 16 / 24 / 32 px (mobile / tablet / desktop).
- 12-column grid desktop; listing grid 1 / 2 / 3 columns (mobile / tablet / desktop).
- Breakpoints: 640 · 768 · 1024 · 1280.

## 3. Components Inventory

| Component | Key specs |
|---|---|
| **Button** | primary (stone-900), secondary, outline, ghost, danger; sizes sm/md/lg; loading spinner; disabled state; min height 40 px |
| **Input / Select / Textarea** | visible label, helper/error text, left/right icon (right-icon **buttons must be clickable**, e.g. password eye), 44 px height |
| **PropertyCard** | 4:3 image with skeleton + error fallback, status chip, heart, price, title, location, bed/bath/sqft row |
| **PropertyGrid** | responsive grid, skeletons, empty state, pagination |
| **SearchFilter (hero & bar)** | Buy/Rent segmented control, location, type, price; advanced filter drawer on mobile |
| **Gallery** | cover + thumbnails, keyboard arrows, swipe on mobile, lightbox |
| **EnquiryForm** | type chips, conditional date/time, inline validation, success panel |
| **Modal** | focus trap, Escape, focus restored, scroll lock, `aria-labelledby` unique id |
| **Toast / inline alerts** | success, error, info; `aria-live` |
| **Navbar** | sticky, translucent on scroll, mobile drawer, saved counter |
| **Footer** | links that actually filter (Buy / Rent / types), contact block from site config, legal links |
| **Admin: Sidebar, Tables, Stat cards, Charts, Badges** | dense but legible; row actions in a menu; destructive actions always confirm |

## 4. Key Screens — Layout Guidance

### Home
1. Full-bleed hero image (compressed, `fetchpriority=high`), headline in serif, search card overlapping the bottom edge.
2. Featured residences (3-up) with "View all".
3. Value / services strip (viewing, dossier, advisory, financing).
4. Closing CTA → Contact.

### Listings
- Left: filters (desktop sticky) · mobile: "Filters" button → bottom sheet.
- Top: result count, sort select, active-filter chips (removable).
- Grid + pagination; skeletons while loading.

### Property Detail
- Gallery top; sticky enquiry card on desktop, sticky "Enquire" bar on mobile.
- Facts row → description → amenities (icon list) → location → related residences.

### Auth pages
- Centered narrow card, serif title, one primary button, secondary links beneath.
- Demo shortcuts are shown **only** in Demo mode.

### Admin
- Left sidebar (collapsible on mobile), content area with page title + primary action top-right.
- Tables: sticky header, search, status filters, row quick actions, empty and error states.
- Forms in modals/drawers with sections (Basics · Pricing · Location · Amenities · Media).

## 5. Content and Tone
- Voice: concise, warm, professional. No hype words ("amazing", "stunning").
- Buttons are verbs: *Request viewing*, *Send enquiry*, *Save residence*.
- Errors say what happened and what to do: "That email is already registered. Try signing in instead."
- Currency formatted by locale (`$12,500,000`); areas as `8,400 sq ft`.

## 6. Accessibility (WCAG 2.2 AA)
- Keyboard reachable everywhere, visible focus ring, logical order.
- Images: meaningful `alt`; decorative → empty alt.
- Forms: labels linked to inputs, errors associated with `aria-describedby`.
- Dialogs: focus trap and restore; Escape closes.
- Touch targets ≥ 40 × 40 px; text resizable to 200 %.
- Motion reduced when requested.

## 7. Responsive Behaviour
| Element | Mobile | Desktop |
|---|---|---|
| Navigation | drawer | inline links |
| Filters | bottom sheet | sidebar / bar |
| Grid | 1 col | 3 col |
| Enquiry CTA | sticky bottom bar | sticky side card |
| Admin tables | horizontal scroll or card rows | full table |

## 8. Performance Guardrails for Design
- Hero ≤ 300 KB, cards ≤ 200 KB (WebP/AVIF preferred); always reserve image space (aspect ratio) to avoid layout shift.
- Max two font families, `font-display: swap`.
- Prefer CSS effects to heavy libraries.

## 9. Design QA Checklist
- [ ] Every interactive element has hover, focus, active, disabled states
- [ ] Every list has loading, empty and error states
- [ ] Contrast checked on all text over images (add gradient scrim)
- [ ] All icons-only buttons have `aria-label`
- [ ] Password eye button is clickable and keyboard accessible
- [ ] Footer links do something sensible
- [ ] Animations referenced in code are defined
- [ ] 360 px wide screen has no horizontal scroll
