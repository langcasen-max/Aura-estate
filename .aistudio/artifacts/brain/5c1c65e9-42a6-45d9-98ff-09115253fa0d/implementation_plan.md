# Light Mode Theme System & Header Toggle Implementation Plan

Introduce a comprehensive Light Mode as the primary default theme across the Sadiqabad Real Estate application, complete with an interactive Theme Toggle (Sun/Moon) in the header navigation, persisting preferences in `localStorage`, and styling the navigation bar and footer in a soft ivory stone palette with warm golden accents.

### User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed that **Light Mode will be the default theme** with a **Theme Toggle button in the header**, and that the navigation bar and footer will feature a **soft ivory stone background with warm golden accents**.

- **Confirmed Decision 1**: Default theme is Light Mode, with instant switching to Dark Mode via a header toggle button.
- **Confirmed Decision 2**: Navigation bar and footer styled with soft ivory stone surfaces (`#FBF9F5` / `#F6F3ED`) and warm golden accents (`amber-800` / `amber-900/10` borders) in Light Mode, transitioning smoothly to obsidian stone in Dark Mode.
- **Persistence Strategy**: User theme selection saved to `localStorage` under key `'sadiqabad_theme'` with automatic root HTML class management.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. Implements a React `ThemeProvider` and `useTheme()` hook managing `'light' | 'dark'` modes.
  2. Embeds an interactive Sun/Moon Theme Toggle in the top navigation bar with smooth micro-interactions.
  3. Styles the entire navigation bar, mobile drawer, footer, and page canvases in a soft ivory stone aesthetic with warm gold accents for Light Mode, while preserving full high-contrast luxury styling for Dark Mode.
  4. Adapts brand wordmark logo, navigation links, and dropdown menus seamlessly between Light and Dark modes.
- **Target Audience**: Sadiqabad residents, overseas Pakistanis, and property investors browsing properties during daytime or nighttime.
- **Key Value**: Superior visual comfort, clean daytime readability, and effortless personal control over website atmosphere.

---

### 2. User Experience & Visual Design

#### Visual Palette (Light Mode - Soft Ivory Stone & Warm Gold)
- **Canvas / Background**: `#FBF9F5` (Soft Ivory Stone)
- **Header Surface**: `#FBF9F5/95` with backdrop blur, fine hairline border `rgba(180, 83, 9, 0.12)`
- **Footer Surface**: `#F6F3ED` with warm golden accents and dark charcoal typography (`stone-800`)
- **Primary Typography**: Charcoal & Deep Espresso (`stone-900`, `stone-800`)
- **Warm Golden Accents**: Rich Ochre & Amber (`amber-700`, `amber-800`)
- **Interactive Theme Toggle**: Dedicated round pill button with Sun (`lucide:Sun`) and Moon (`lucide:Moon`) icons, smooth 200ms transform transition.

#### Visual Palette (Dark Mode - Deep Obsidian & Gold)
- **Canvas / Background**: `#0C0A09` (`stone-950`)
- **Header Surface**: `stone-900/90` with hairline border `stone-800`
- **Footer Surface**: `stone-950` with muted stone typography and warm amber highlights

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: React Theme Context with HTML Class Sync**
  - *Chosen Approach*: `ThemeContext` injecting/removing `.dark` class on `document.documentElement` and persisting in `localStorage`.
  - *Why*: Tailwind v4 and standard CSS utilities seamlessly respond to `.dark` class hierarchy without full-page reloads or flickering.
- **Decision 2: Top Bar Contract Compliance**
  - *Chosen Approach*: Place the Theme Toggle cleanly inside Zone 3 (Action zone) adjacent to Favorites and User Account icon.
  - *Why*: Preserves the strict 3-zone Top Bar contract (Brand Wordmark — Nav Links — Action Zone) without cluttering brand identity.

---

### 4. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────┐
│                      App Root                          │
│   <AuthProvider>                                       │
│     <ThemeProvider default="light">                    │
│       <AppRouter>                                      │
└──────────────────────────┬─────────────────────────────┘
                           │ Provides { theme, toggleTheme, isDark }
                           ▼
┌────────────────────────────────────────────────────────┐
│                       Navbar                           │
│   [Zone 1: Logo] ─── [Zone 2: Links] ─── [Zone 3: Acts]│
│                                           ├── Favorites│
│                                           ├── ThemeBtn │ ◄── [Sun / Moon]
│                                           └── Auth/User│
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│     Light Mode Theme    │ │     Dark Mode Theme     │
│ • Canvas: #FBF9F5       │ │ • Canvas: stone-950     │
│ • Header: Ivory Stone   │ │ • Header: Obsidian      │
│ • Footer: #F6F3ED       │ │ • Footer: Deep Stone    │
│ • Gold: amber-800       │ │ • Gold: amber-400       │
└─────────────────────────┘ └─────────────────────────┘
```

#### Files to Create & Update

1. **`src/contexts/ThemeContext.tsx`** (New):
   - Defines `'light' | 'dark'` state, `toggleTheme`, `isDark`.
   - Reads/writes to `localStorage.getItem('sadiqabad_theme')`.
   - Defaults to `'light'`.
2. **`src/components/layout/Navbar.tsx`**:
   - Integrates Theme Toggle button with Sun/Moon icon.
   - Supports ivory stone background in Light Mode and obsidian in Dark Mode.
   - Adjusts mobile menu drawer colors to match active theme.
3. **`src/components/common/Logo.tsx`**:
   - Adapts wordmark typography color dynamically based on theme.
4. **`src/components/layout/Footer.tsx`**:
   - Adapts to soft ivory stone surface (`#F6F3ED`) with warm golden accents when in Light Mode.
5. **`src/App.tsx`**:
   - Wraps the app in `<ThemeProvider>`.
   - Updates main layout background classes to support light/dark transitions.

#### Verification Plan

1. Verify `compile_applet` succeeds without errors.
2. Verify `lint_applet` passes cleanly.
3. Test toggling between Light Mode and Dark Mode; verify `localStorage` persistence and aesthetic visual transitions across all pages (Home, Properties, Detail, About, Contact, Admin).
