# BabyShalls — Design System & Brand Style Guide
**Version:** 2.0  
**Status:** Living Design Standard  
**Store Concept:** Independent Children's Bookstore & Educational Wooden Toys Boutique  
**Location:** Jl. Cempaka No. 12, Malang, East Java  

---

## 1. Brand Philosophy & Aesthetic Vision

BabyShalls is an independent children's bookstore and wooden toy boutique that celebrates the wonder of early childhood, sensory curiosity, and screen-free discovery.

### Core Visual Metaphor: "The Cozy Living Storybook"
The BabyShalls visual experience is designed to feel like an **open, beautifully crafted children's book cover** or a warm lifestyle editorial layout—never a cold, boxy, or generic e-commerce portal.

### Brand Pillars & Personality
| Brand Pillar | Visual Expression | Emotional Impression |
| :--- | :--- | :--- |
| **Warmth & Care** | Cream-to-peach backgrounds, warm terracotta, soft sunlight tones | Gentle, welcoming, comforting |
| **Tactile Wonder** | Natural wooden toys, cloth textures, smooth rounded curves | Physical, sensory, high craftsmanship |
| **Playful Elegance** | Fluid asymmetrical waves, organic leaf sprigs, hand-drawn doodles | Whimsical yet refined; never childishly noisy |
| **Literary Pedigree** | Editorial serif headlines, generous whitespace, poetic pacing | Thoughtful curation, premium bookstore |

---

## 2. Color Palette & Design Tokens

The color palette is built on warm earthy neutrals, soft bakery creams, terracotta accents, and gentle botanical greens.

### 2.1 Color Tokens Specification

```css
:root {
  /* Surface & Base Backgrounds */
  --color-cream-light:     #FFF8EF; /* Primary page background (soft milky cream) */
  --color-offwhite:        #FFF9F0; /* Top header background & wave blending tone */
  --color-cream:           #FCF6EC; /* Card surface & alternate section background */
  
  /* Warm Transitions & Gradients */
  --color-peach-light:     #FFE4D0; /* Hero middle gradient stop */
  --color-peach:           #FCE0D4; /* Soft peach cards & hamper banner */
  --color-salmon:          #F6B79B; /* Hero deep gradient accent & floral petals */
  
  /* Primary Action & Brand Accent */
  --color-terracotta:      #DA7A5B; /* Main CTA buttons, active state highlights */
  --color-terracotta-dark: #C46749; /* CTA hover/focus state */
  
  /* Joyful & Botanical Accents */
  --color-mustard:         #F6C95E; /* Announcement bar, sun icon, sunburst doodles */
  --color-mustard-light:   #FDF3D6; /* Star badges & subtle highlights */
  --color-sage:            #DCE6C6; /* Sage green background for preschool cards */
  --color-sage-light:      #EBF2E0; /* Soft botanical fill */
  --color-leaf:            #A7C48A; /* Hand-drawn leaves & foliage doodles */
  --color-leaf-dark:       #709154; /* Botanical stems & leaf strokes */
  
  /* Typography & High-Contrast Elements */
  --color-warmbrown-dark:  #502E1E; /* Primary headlines (high legibility) */
  --color-warmbrown:       #6B3F2A; /* Body copy, titles, icons */
  --color-lightbrown:      #CBA989; /* Subtitles, placeholders, icon tints */
  --color-gray-border:     #EEDBC9; /* Subtle warm borders and dividers */
  
  /* Functional & Social */
  --color-whatsapp:        #25D366; /* WhatsApp floating action button */
  --color-whatsapp-hover:  #20BA59; /* WhatsApp hover state */
  --color-white:           #FFFFFF; /* Search box fill, card clean surfaces */
}
```

### 2.2 Color Swatch Quick Reference

| Token | Hex Code | Visual Swatch | Semantic Role |
| :--- | :--- | :--- | :--- |
| `cream-light` | `#FFF8EF` | `■` Cream | Base canvas for all editorial body sections |
| `offwhite` | `#FFF9F0` | `■` Off-White | Header and top wave blending layer |
| `peach-light` | `#FFE4D0` | `■` Peach | Hero organic gradient transition |
| `salmon` | `#F6B79B` | `■` Salmon | Hero warmth gradient & organic illustrations |
| `terracotta` | `#DA7A5B` | `■` Terracotta | Primary CTA buttons, badges, key conversion targets |
| `mustard` | `#F6C95E` | `■` Mustard | Top announcement bar, radiating sun doodles |
| `leaf` | `#A7C48A` | `■` Leaf | Botanical sage foliage and organic leaves |
| `warmbrown-dark` | `#502E1E` | `■` Espresso | Deep literary headings (Playfair Display) |
| `warmbrown` | `#6B3F2A` | `■` Warm Brown | Body typography (Nunito) & icons |

---

## 3. Typography Architecture

BabyShalls utilizes a pair of Google Fonts that balance literary elegance with accessible warmth:

```
Headings & Display    : Playfair Display (Serif)
Body, Buttons, & UI   : Nunito (Rounded Sans-Serif)
```

### 3.1 Typeface Details
- **Playfair Display:** Used exclusively for editorial titles, section headers, brand logo, and hero headline. Brings an artisanal bookstore atmosphere reminiscent of classic picture book typography.
- **Nunito:** Used for descriptions, prices, navigation items, buttons, badges, and form controls. Its gently rounded terminals soften the interface, making it approachable and kid-friendly without feeling childish.

### 3.2 Typographic Hierarchy & Scale

| Level | Font Family | Size (Desktop) | Size (2K Display) | Size (Mobile) | Line Height | Weight |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Headline (H1)** | Playfair Display | `48px` | `64px` | `32px` | `1.15 - 1.18` | 700 (Bold) |
| **Section Title (H2)** | Playfair Display | `34px - 38px` | `44px` | `26px - 28px` | `1.2` | 700 (Bold) |
| **Card Title (H3)** | Playfair Display | `20px - 22px` | `26px` | `18px` | `1.25` | 700 (Bold) |
| **Lead / Subtitle** | Nunito | `17px - 18px` | `23px` | `15px` | `1.55 - 1.6` | 400 - 500 |
| **Body Regular** | Nunito | `15px` | `18px` | `14px` | `1.6` | 400 (Regular) |
| **Navigation Links** | Nunito | `14.5px` | `16px` | `15px` | `1.2` | 600 (SemiBold) |
| **CTA Button Text** | Nunito | `16px` | `22px` | `15px` | `1.0` | 700 (Bold) |
| **Badges & Microcopy**| Nunito | `12px - 13px` | `14px` | `11.5px` | `1.2` | 700 (Bold) |

---

## 4. Organic Waves & Fluid Edge Philosophy

### 4.1 Goodbye Boxy Banners, Hello Continuous Landscape
Traditional e-commerce designs place hero sections inside sharp rectangles or cards with rounded corners. **BabyShalls forbids rigid card boxes for the hero section.**

The hero must flow directly out of the header and dissolve naturally into the product catalog:
1. **Top Wave (`.hero-top-wave`):**
   - An asymmetrical SVG curve blending with the header background (`#FFF9F0`).
   - The lifestyle photograph extends underneath the wave, giving a layered, cinematic depth.
2. **Bottom Wave (`.hero-bottom-wave`):**
   - A multi-layered flowing wave transitioning from the hero's warm salmon/peach into the cream background (`#FFF8EF`) of the Shop by Age section.
   - Distinct layered heights creating rolling hill aesthetics.
3. **No Ellipse Clip-Paths:**
   - Elliptical clip-paths aggressively crop important image content and create harsh unnatural points. Always use layered SVG bezier curves or organic CSS pseudo-elements.

---

## 5. Decorative Language & Hand-Drawn Doodles

To accentuate the children's storybook feel, small organic doodles and botanical elements are placed along the edges and near key conversion elements.

### 5.1 Decorative Element Catalog
1. **Mustard Sunburst Doodle (`.hero-sunburst-doodle`):**
   - Three radiating rounded strokes placed above the primary headline.
   - Rotations: Left (`-32deg`), Center (`0deg`), Right (`+32deg`).
2. **Stacked Organic Flowers (`.hero-cta-flowers-stack` & `.hero-left-flowers-stack`):**
   - Clusters of warm mustard and soft salmon circular petals layered with terracotta centers.
   - Accompanied by mini sage leaves to form a blooming bouquet.
   - Placed beside the CTA button to draw visual weight without obstructing click targets.
3. **Botanical Sage Leaf Branches (`.hero-left-leaves`, `.hero-right-leaves`):**
   - Subtle sage green stems (`#91B077`, `#7A9A60`) that frame the hero composition from outer screen edges.
4. **Playful Micro-Accents (`.hero-cta-decorations`):**
   - Floating outline hearts (`.cta-deco-heart`) with gentle bobbing animations (`heartFloat`).
   - 4-point twinkle stars (`.cta-deco-twinkle`) with subtle scale pulsation (`twinklePulse`).
   - Soft pastel confetti dots (`.cta-deco-dot`) in mustard and salmon.

### 5.2 Safe-Zone & Overlap Rules
- **Rule 1 — Zero Text Collision:** Decorative elements must **never** overlap headline text, body copy, or price tags.
- **Rule 2 — Tablet Breakpoint Guard (`<= 860px`):** On screens narrower than 860px, edge leaves (`.hero-left-leaves`) must be hidden (`display: none !important;`) to ensure maximum legibility for the typography.
- **Rule 3 — CTA No-Wrap Rule:** The CTA button and its companion flower stack must have `flex-wrap: nowrap;` across all screen sizes so they remain cleanly paired side-by-side.

---

## 6. Photography & Imagery Art Direction

### 6.1 Hero Photography Requirements
- **Subject:** A young child engaged in reading a colorful picture book, surrounded by natural wooden toys (cars, stacking rings, building blocks) and soft plush companions.
- **Lighting:** Soft, warm, natural morning sunlight streaming from the window. Golden hour warmth.
- **Color Temperature:** 3500K - 4500K (warm neutral, honeyed wood, linen beige, gentle cream).
- **Styling:** Natural linen clothing (floral print or soft earth tones), natural unpainted or pastel wooden educational toys.
- **Composition:** Asymmetrical editorial layout occupying 52% - 55% of the hero stage.
- **Edge Blending:** Left edge treated with an organic alpha gradient (`linear-gradient(to right, #FFEBDC 0%, ... transparent 100%)`) allowing the photo to blend smoothly into the editorial text block.

### 6.2 Product Photography
- **Books:** Shown at a 3:4 aspect ratio with clean subtle shadows (`0 6px 18px rgba(107, 63, 42, 0.08)`), featuring cover art clearly without distortion.
- **Toys & Hampers:** Photographed on neutral cream surfaces, showcasing natural wood grain, soft fabric ribbons, and tactile packaging.

---

## 7. Component Specifications

### 7.1 Primary CTA Button (`.hero-cta-btn`)
- **Background:** `--color-terracotta` (`#DA7A5B`)
- **Hover Background:** `--color-terracotta-dark` (`#C46749`)
- **Shape:** Full Pill (`border-radius: 9999px`)
- **Typography:** Nunito 700 (Bold)
- **Shadow:** `0 6px 20px rgba(218, 122, 91, 0.35)`
- **Hover Micro-interaction:** `translateY(-2px)` with shadow bloom (`0 10px 26px rgba(218, 122, 91, 0.46)`) and `translateX(+4px)` arrow slide.

### 7.2 Shop by Age Cards (`.age-card`)
- **Border Radius:** `20px` (`--radius-xl`)
- **Border:** `1px solid rgba(238, 219, 201, 0.6)`
- **Hover Effect:** `translateY(-6px)` with shadow lift
- **Color Themes by Stage:**
  - **Newborn+ :** Soft warm cream (`#FCF4EB`)
  - **Ages 1–3 :** Warm peach (`#FCECE0`)
  - **Ages 3+  :** Gentle sage green (`#EBF2E5`)
  - **Ages 6+  :** Sweet peach apricot (`#FDEFE5`)

### 7.3 Product Cards (`.product-card`)
- **Surface:** Pure White (`#FFFFFF`) with `16px` border radius
- **Header Badges:** Pill badges in top corners (`Bestseller`, `Imported Book`, `Age Tag`)
- **Wishlist Heart:** Top-right floating circle button with smooth pink heart fill toggle
- **Cart CTA:** Direct action button adding item to live cart drawer with counter update.

### 7.4 Floating WhatsApp Button (`.floating-whatsapp-btn`)
- **Color:** Brand WhatsApp Green (`#25D366`)
- **Position:** Fixed bottom-right corner (`bottom: 24px; right: 24px; z-index: 90;`)
- **Shape:** Pill button with live pulsation ring (`waPulse`)
- **Pre-filled Message:** Configured to launch direct chat with BabyShalls Malang store assistant.

### 7.5 Payment & Shipping Partner Badges (`.payment-badges`)
- **Surface:** Pure White Pill (`background: #FFFFFF; border-radius: 9999px; padding: 6px 14px;`)
- **Shadow:** `0 2px 8px rgba(0, 0, 0, 0.08)`
- **Logos Included:**
  - **Midtrans:** Official isometric 3D cube in sky blue (`#00AEEF`), cyan-blue (`#0067A3`), and navy (`#002B49`) + `midtrans` wordmark.
  - **Divider:** Subtle light slate vertical line (`#CBD5E1`).
  - **RajaOngkir:** 3-point crown in crimson red (`#D32F2F`) + `rajaongkir` dual-color wordmark (`raja` in red, `ongkir` in slate `#1E293B`).
- **Hover Micro-interaction:** `translateY(-1px)` with elevated soft shadow.

---

## 8. Responsive Breakpoint Matrix

| Viewport Category | Screen Width Range | Layout Behavior & Scale |
| :--- | :--- | :--- |
| **2K & Ultrawide** | `min-width: 2000px` | Full bleed to right edge (`width: 100%; max-width: 100%; margin: 0; grid-template-columns: 44% 56%`). Photo is strictly stuck/attached to the right side of the page with no gap. Headline: `64px`. CTA font: `22px` with `22px 56px` padding. Waves scale to `110px` top and `140px` bottom. |
| **Large Desktop** | `1600px - 1999px` | Full bleed to right edge (`width: 100%; max-width: 100%; margin: 0; grid-template-columns: 45% 55%`). Headline: `54px`. CTA font: `19px` with `18px 46px` padding. |
| **Standard Desktop** | `1025px - 1599px` | Two-column editorial grid (`46% / 54%`). Left text block, right photo stuck to right screen border with organic left gradient blend. Double waves active. |
| **Tablet Landscape/Portrait** | `769px - 1024px` | Two-column grid (`48% / 52%`). Headline: `34px`. Padding left clamped to `clamp(55px, 6vw, 75px)`. Left leaves downsized to `38px`. |
| **Small Tablet Guard** | `<= 860px` | Left foliage hidden (`display: none !important;`) to ensure zero collision with text. Corner flowers shifted down. |
| **Mobile Portrait** | `<= 768px` | Single-column stacked layout (`grid-template-columns: 1fr`). Centered copy, photography underneath with top gradient blend. Mobile navigation drawer active. |
| **Mobile Compact** | `<= 480px` | Headline: `27px`. Full-width touch-friendly CTA (`max-width: 280px`). Photo height clamped to `260px`. |

---

## 9. Animation & Motion Design Tokens

```css
:root {
  --transition-fast:   0.18s ease;
  --transition-smooth: 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Keyframe Animation Guidelines
1. **`gentle-spin` (20s linear infinite):** Subtle continuous rotation on the smiling sun brand logo icon.
2. **`flowerGentleBob` (4.5s ease-in-out infinite):** Soft vertical float (`translateY(-4px)` with `rotate(2deg)`) on the CTA stacked flower cluster.
3. **`heartFloat` (3.8s ease-in-out infinite):** Whimsical floating motion (`translateY(-5px)` with `rotate(4deg)`) on decorative hearts.
4. **`twinklePulse` (3.0s ease-in-out infinite):** Gentle scale breathing (`scale(1.25)`) on mustard sparkle stars.
5. **Accessibility Standard (`prefers-reduced-motion`):** All infinite keyframe loops automatically deactivate when user system preference requests reduced motion.

---

## 10. Code & Implementation Governance

When adding new components, landing pages, or promotional banners to BabyShalls:
1. **Never introduce harsh boxy cards** for full-bleed promotional sections; always use flowing organic transitions.
2. **Always reference CSS variables** (`var(--color-...)`, `var(--radius-...)`) rather than hardcoding static hex values.
3. **Preserve the editorial contrast:** Always ensure dark brown (`#502E1E` or `#6B3F2A`) is used on cream/peach backgrounds for WCAG AA accessible contrast.
4. **Maintain the dual-typeface discipline:** Reserve `Playfair Display` for moments of storytelling and literary emphasis; use `Nunito` for functional interactions and body reading comfort.

