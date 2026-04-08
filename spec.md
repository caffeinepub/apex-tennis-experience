# Apex Tennis Experience

## Current State
New project — no existing application files beyond scaffolding.

## Requested Changes (Diff)

### Add
- Cinematic intro screen with Three.js animated neon particle field, 3D tennis player silhouette, ball impact shockwave explosion, and "ENTER EXPERIENCE" button with glassmorphism + glow
- Sticky glassmorphism navbar: "APEX TENNIS" logo + Home/Player/Blog/Rackets links + neon hamburger mobile menu
- Home page with: animated hero text (letter stagger), featured player glassmorphism card with animated stat bars, Three.js 3D rotating racket model, horizontal scroll blog preview cards, CTA banner with animated gradient
- Player Profile page: fullscreen neon hero, animated stat bars (Speed/Power/Accuracy/Endurance) with count-up on scroll, career timeline with milestone cards, video highlights placeholder cards
- Blog page: masonry grid layout, category filter buttons with neon active state, 3D CSS tilt hover cards, blog detail view with reading progress bar
- Racket Showcase page: floating animation grid cards with neon outline, product detail page with Three.js rotating racket, animated spec bars, add-to-cart animation
- Racket CMS panel: admin interface to add/edit/remove racket products (name, specs, description, price)
- Global effects: animated particle canvas background, custom neon cursor glow trail, gradient wave animations, light streak section transitions, neon flicker effect
- Scroll animations: Intersection Observer fade+slide+stagger on all sections, number counter animation, scale/opacity/rotation transforms
- Micro interactions: ripple on buttons, animated neon underline on links, card lift+shadow, neon focus glow on inputs
- Bonus: Neon Blue / Neon Pink theme toggle, AI Coach Q&A panel with pre-written tips, Live Match Stats animated scoreboard, Interactive Training section with drill cards
- Fully responsive: mobile simplified animations, tablet grid layouts

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Select `authorization` component for the racket CMS admin panel
2. Generate Motoko backend with racket CRUD operations (name, description, specs: weight/balance/power, price, imageUrl)
3. Build frontend:
   - Global: CSS custom properties for neon color tokens, particle canvas, cursor glow trail, theme toggle context
   - IntroScreen component: Three.js canvas with player silhouette geometry, particle field, ball + shockwave sequence, ENTER EXPERIENCE button
   - Navbar: glassmorphism sticky bar, mobile menu
   - HomePage: hero text stagger, FeaturedPlayerCard, RacketHighlight3D (Three.js), BlogPreviewScroll, CTABanner
   - PlayerPage: parallax hero, AnimatedStatBars, CareerTimeline, VideoHighlights
   - BlogPage: masonry grid, category filters, tilt cards, BlogDetailView with progress bar
   - RacketsPage: floating grid, RacketDetailPage with Three.js model, spec bars, cart animation
   - RacketCMSPanel: admin CRUD form UI wired to backend
   - AICoachPanel, LiveMatchStats, TrainingDrills components
   - Scroll animation hooks using IntersectionObserver
