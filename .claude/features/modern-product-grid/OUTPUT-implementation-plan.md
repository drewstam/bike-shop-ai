# Implementation Plan: Modern Product Grid

Generated: 2026-03-29
Feature spec: `.claude/features/modern-product-grid/feature.md`

## Summary

A custom staggered product grid section for showcasing helmets from a selected collection. Desktop shows a 4-column offset layout with hover effects (yellow accent border + elliptical lifestyle image reveal from the product's second image). Mobile collapses to a uniform 2-column grid. "Load more" button appends products in batches of 8 via the Section Rendering API.

## Human-First Breakdown

### Admin Setup (human tasks in Shopify admin)

#### Automated collection — already created
The "Full Face Helmets" smart collection (filtered by tag "Full Face Mountain Bike Helmets") was set up during scoping. No additional admin work needed.

#### Ensure products have a second image
The hover reveal depends on each product having at least 2 images. The first image is the main product shot; the second should be the lifestyle/action photo.

- [ ] Check that each product in the collection has at least 2 images uploaded
- [ ] The second image should be the lifestyle shot you want revealed on hover
- [ ] Products with only 1 image will still work — they just won't show the hover reveal

### Code Preparation (before any visitor touches the page)

1. Create a section file that loads its own CSS and JS assets
2. Add a collection picker setting to the section schema — this is how the store owner selects which collection to display
3. Build the grid markup: a container with product cards inside, 4 columns on desktop
4. Each card is an anchor (`<a>`) wrapping: primary image, product title, and a hidden secondary image container
5. The secondary image container is invisible by default — it only appears on hover
6. Add a "Load more" button below the grid — hidden if all products are already shown
7. Use Shopify's `{% paginate %}` tag to limit to 8 products per page
8. Wrap the grid in a `<modern-product-grid>` custom element for JS behavior

### Live Behavior (when a user interacts)

1. Page loads — the grid shows up to 8 products (4 per row, 2 rows) in a staggered layout
2. On desktop, even-positioned cards (2nd, 4th in each row) are offset downward, creating the asymmetric look
3. User hovers over a card — the card border transitions from light gray to the yellow accent color used throughout the site
4. If that product has a second image, it fades/reveals from the right side of the card with a curved/elliptical left edge (clip-path)
5. User moves the mouse away — border returns to default, secondary image hides
6. User clicks a card — navigates to that product's page
7. If more than 8 products exist, a "Load more" button appears below the grid
8. User clicks "Load more" — JS fetches the next page of products via the Section Rendering API and appends them to the grid
9. If all products are now loaded, the "Load more" button disappears
10. On mobile — 2-column uniform grid, no stagger, no hover effects, tap navigates to product

## Files

### New Files
- `sections/section-modern-product-grid.liquid` — section markup, schema, asset loading, paginate logic
- `assets/section-modern-product-grid.css` — grid layout, stagger offsets, card styles, hover effects, elliptical clip-path, responsive rules
- `assets/modern-product-grid.js` — web component handling hover interaction (show/hide secondary image) and "Load more" pagination via Section Rendering API

### Modified Files
- None — fully self-contained, no Dawn core files touched

### Theme Components Reused
- `page-width` wrapper class — for consistent max-width and horizontal padding
- `.section-{{ section.id }}-padding` — Dawn's standard section padding pattern (0.75 mobile multiplier)
- `color-{{ section.settings.color_scheme }}` + `gradient` — Dawn's color scheme system for background/text colors
- `| image_url: width:` + `| image_tag` — Shopify image transforms for responsive, optimized images

## Build Steps

### Step 1: Section skeleton with schema

**Do:** Create the Liquid section file with the full schema (all settings), asset loading lines, and an empty markup placeholder. This establishes the file and makes the section available in the theme customizer immediately.

**Files:** `sections/section-modern-product-grid.liquid`

**Details:**
- Load `section-modern-product-grid.css` via `| asset_url | stylesheet_tag`
- Load `modern-product-grid.js` via `| asset_url` with `defer="defer"`
- Add the `{%- style -%}` block for dynamic section padding using Dawn's pattern (0.75 mobile multiplier, 750px breakpoint)
- Schema settings:
  - `collection` — type: `collection`, for picking the data source
  - `accent_color` — type: `color`, default: the site's yellow, for hover border and accents
  - `color_scheme` — type: `color_scheme`, default: `"scheme-1"`
  - `padding_top` — type: `range`, 0–100, step 4, default 36
  - `padding_bottom` — type: `range`, 0–100, step 4, default 36
- Add preset: `{ "name": "Modern Product Grid" }`
- Outer wrapper: `<div class="color-{{ section.settings.color_scheme }} isolate gradient">` → `<div class="page-width section-{{ section.id }}-padding">`
- Inside: placeholder text like "Grid will go here"

**Verify:** Section appears in the theme customizer under "Add section." Settings panel shows all 5 settings. No errors in the console.

---

### Step 2: Static grid markup with hardcoded cards

**Do:** Replace the placeholder with a static HTML grid structure — 8 hardcoded card elements with placeholder content. No Liquid data yet. This lets us get the CSS layout right before wiring up dynamic data.

**Files:** `sections/section-modern-product-grid.liquid`

**Details:**
- Wrap the grid in `<modern-product-grid class="modern-product-grid">` custom element
- Inside: a `<div class="modern-product-grid__grid">` containing 8 card elements
- Each card: `<a class="modern-product-grid__card" href="#">`
  - `<div class="modern-product-grid__card-image">` — placeholder image area
  - `<div class="modern-product-grid__card-info">` — "Product Name" text
  - `<div class="modern-product-grid__card-reveal">` — secondary image container (hidden by default)
- After the grid: `<div class="modern-product-grid__load-more">` with a button

**Verify:** Section renders 8 card-shaped elements in a single column (no CSS yet). Structure is visible in browser dev tools.

---

### Step 3: CSS — grid layout and stagger pattern

**Do:** Create the CSS file with the 4-column grid, stagger offsets, card styling (dark background, thin border), and responsive 2-column mobile layout.

**Files:** `assets/section-modern-product-grid.css`

**Details:**
- `.modern-product-grid__grid` — CSS Grid, `grid-template-columns: repeat(4, 1fr)`, gap for spacing
- Stagger pattern using `nth-child`: even cards (2nd, 4th, 6th, 8th) get `transform: translateY(60px)` (adjust value to match design). The parent grid needs enough `padding-bottom` to accommodate the offset.
- `.modern-product-grid__card`:
  - `border: 1px solid rgba(var(--color-foreground), 0.2)` — thin light border using Dawn's color vars
  - `transition: border-color 0.3s ease`
  - `position: relative` (for the reveal overlay positioning)
  - `display: block`, `text-decoration: none`
- `.modern-product-grid__card-image`:
  - `aspect-ratio: 1 / 1` (square, matching design)
  - `overflow: hidden`
  - Image inside: `width: 100%`, `height: 100%`, `object-fit: cover`
- `.modern-product-grid__card-info`:
  - Product title below the image, using `color: rgb(var(--color-foreground))`
  - Padding, text truncation with `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`
- `.modern-product-grid__card-reveal`:
  - `position: absolute`, anchored to the right side of the card, extending beyond it
  - `clip-path: ellipse(...)` for the curved left edge
  - `opacity: 0`, `visibility: hidden`, `transition: opacity 0.4s ease`
  - `pointer-events: none` (so it doesn't block card clicks)
- Hover state: `.modern-product-grid__card:hover` → `border-color: var(--modern-grid-accent-color)`
- Hover reveal: `.modern-product-grid__card:hover .modern-product-grid__card-reveal` → `opacity: 1`, `visibility: visible`
- Mobile (`max-width: 749px`): grid switches to `grid-template-columns: repeat(2, 1fr)`, no transform offset, reveal container hidden permanently
- Use a CSS custom property `--modern-grid-accent-color` set in the section's `{%- style -%}` block from `section.settings.accent_color`

**Verify:** Desktop shows 4-column staggered grid with thin borders. Cards are visually offset in an alternating pattern. Mobile shows clean 2-column grid. Hovering a card changes its border to the accent color.

---

### Step 4: Dynamic Liquid data — products from collection

**Do:** Replace hardcoded cards with a Liquid `{% paginate %}` + `{% for %}` loop over the selected collection's products. Wire up product images, titles, URLs, and the secondary image.

**Files:** `sections/section-modern-product-grid.liquid`

**Details:**
- Wrap the grid in `{% paginate collection.products by 8 %}` (where `collection` is assigned from `section.settings.collection`)
- Assign: `{%- assign collection = section.settings.collection -%}`
- Guard: if collection is blank or empty, render nothing (or a minimal empty state)
- For each product in `collection.products`:
  - `href="{{ product.url }}"` on the card link
  - Primary image: `{{ product.featured_image | image_url: width: 600 | image_tag: loading: 'lazy', class: 'modern-product-grid__image' }}`
  - Title: `{{ product.title }}`
  - Secondary image: check `{% if product.media.size > 1 %}`, then render `{{ product.media[1].preview_image | image_url: width: 800 | image_tag: loading: 'lazy', class: 'modern-product-grid__reveal-image' }}` inside the reveal container
  - Add `data-has-reveal="true"` on cards that have a secondary image (helps JS/CSS target them)
- "Load more" button: only render if `paginate.pages > 1`
  - Store `{{ paginate.next.url }}` as a `data-next-url` attribute on the `<modern-product-grid>` element
  - Store `{{ paginate.current_page }}` and `{{ paginate.pages }}` as data attributes for JS
- Close `{% endpaginate %}`

**Verify:** Section pulls real products from the selected collection. Images, titles, and links work. Only 8 products show. "Load more" button appears if the collection has more than 8 products. Products with 2+ images have the reveal container populated.

---

### Step 5: CSS refinement — match the design

**Do:** Fine-tune spacing, typography, image sizing, and the stagger offset to closely match the reference screenshots. Adjust the elliptical clip-path to match the curved reveal shape from Desktop 4.

**Files:** `assets/section-modern-product-grid.css`

**Details:**
- Refine the `translateY` offset value by comparing against the Desktop 1 screenshot — the offset should feel noticeable but not extreme (roughly 40–80px, needs visual tuning)
- Fine-tune the `clip-path: ellipse()` values on the reveal container to match the curved left edge from Desktop 4. Starting point: `clip-path: ellipse(75% 50% at 70% 50%)` — adjust from there
- The reveal image should extend to the right of the card. Position it with `right: 0`, `top: 0`, and let it overflow the card boundaries. The card needs `overflow: visible` but the grid may need `overflow: hidden` at the row level to prevent horizontal scrollbar
- Card padding and spacing to match the design — the cards have internal padding around the image
- Title typography: match Dawn's body font, appropriate size, the accent color is not used on title text (title stays foreground color)
- "Load more" button styling: match the site's button conventions or keep it minimal (border button, accent color on hover)
- Ensure the grid gap matches the visual spacing in the reference screenshots

**Verify:** Desktop layout visually matches the reference screenshots. Stagger pattern looks right. Hover reveals the lifestyle image with the curved edge. Card proportions and spacing feel correct.

---

### Step 6: JavaScript — web component for hover + Load more

**Do:** Create the web component that handles two things: (1) hover interaction for showing/hiding the secondary image reveal, and (2) "Load more" button pagination.

**Files:** `assets/modern-product-grid.js`

**Details:**
- Register `<modern-product-grid>` custom element with `customElements.define()`
- Guard with `if (!customElements.get('modern-product-grid'))` to prevent double registration
- `connectedCallback()`:
  - Cache DOM references: grid container, load more button, all cards
  - Bind hover listeners on cards (mouseenter/mouseleave) for reveal show/hide
  - Bind click listener on "Load more" button
- Hover handling:
  - On `mouseenter`: add a class like `is-revealing` to the card (CSS handles the visual transition)
  - On `mouseleave`: remove the class
  - Only target cards that have `data-has-reveal="true"`
  - Use `matchMedia('(hover: hover)')` to skip binding on touch devices
- "Load more" handling:
  - On click: read the `data-next-url` from the component
  - Fetch that URL with `?section_id={{ section.id }}` appended (Section Rendering API)
  - Parse the response HTML, extract the new grid items
  - Append them to the existing grid
  - Update `data-next-url` to the next page URL from the fetched content (if there is one)
  - If no more pages, hide the button
  - Add a loading state class during fetch to disable the button and show feedback
- `disconnectedCallback()`:
  - Clean up event listeners

**Verify:** Hovering a card with a secondary image triggers the reveal animation. Hovering a card without one only shows the border change. "Load more" button fetches and appends the next 8 products. Button disappears after the last page. No console errors. No memory leaks on navigation.

---

### Step 7: Edge cases and polish

**Do:** Handle all edge cases identified in the spec. Test and fix any layout issues.

**Files:** All three files as needed

**Details:**
- **Empty collection**: if no collection selected or collection is empty, hide the section entirely (`{% if collection == blank or collection.products.size == 0 %}{% continue or return %}`)
- **< 8 products**: grid renders fewer cards, no "Load more" button. CSS Grid handles partial rows naturally.
- **Single-image products**: card renders without the reveal container. Hover only shows accent border.
- **Long titles**: CSS truncation with `text-overflow: ellipsis` — already in Step 3, verify it works
- **Image aspect ratios**: `object-fit: cover` on all images — already in Step 3, verify consistency
- **Stagger on appended items**: newly loaded cards from "Load more" must also follow the nth-child stagger pattern. Since we're appending to the same grid, CSS nth-child continues naturally — but verify this works correctly.
- **Loading state for "Load more"**: button shows "Loading..." or similar during fetch, disabled to prevent double clicks
- **JS disabled fallback**: without JS, the grid still renders the first 8 products with a non-functional "Load more" button. Consider wrapping the button in a `<noscript>` alternative or using `paginate.next.url` as the button's `href` so it falls back to a standard page load

**Verify:** All edge cases behave as expected. Empty state doesn't break layout. Partial rows look clean. Long titles truncate. Load more works across multiple pages.

---

### Step 8: Accessibility and final polish

**Do:** Ensure the section is accessible and follows best practices.

**Files:** All three files as needed

**Details:**
- Cards are `<a>` tags — already keyboard focusable and screen reader accessible
- Add `aria-label` on each card: `aria-label="{{ product.title }}"`
- "Load more" button: add `aria-label="Load more products"` and update `aria-busy="true"` during loading
- Reveal image: mark as decorative with `alt=""` or `role="presentation"` since it's supplementary
- Primary image: ensure `alt="{{ product.featured_image.alt | default: product.title }}"` is set
- Focus styles: ensure cards have a visible focus outline (use the accent color to match hover)
- Reduced motion: add `@media (prefers-reduced-motion: reduce)` to disable transitions and transforms for users who prefer it
- Ensure the hover reveal doesn't trap focus or confuse screen readers — it's purely visual, no interactive elements inside it

**Verify:** Tab through the grid — each card gets focus with a visible indicator. Screen reader announces product names. "Load more" announces its state. No motion for users with reduced motion preference.

## Risks & Considerations

- **Elliptical clip-path precision**: The curved reveal edge needs visual tuning to match the design. The exact `clip-path: ellipse()` values will require iteration — plan for some back-and-forth during Step 5.
- **Overflow management**: The reveal image extends beyond the card boundary. Need to ensure it doesn't cause horizontal scrollbar on the page. The grid or section container may need `overflow: hidden` on the x-axis while allowing y-axis overflow for the stagger.
- **Stagger + pagination**: When "Load more" appends new cards, the nth-child CSS stagger pattern continues from the total count, not the new batch. This should work naturally with CSS Grid, but needs verification.
- **Performance**: Secondary images are loaded for all visible cards even though they're only seen on hover. Using `loading="lazy"` helps, but if the collection is very large (50+ products after multiple "Load more" clicks), memory could grow. Acceptable for the expected collection size.
- **Section Rendering API URL format**: The fetch URL needs the `section_id` parameter to return only the section HTML. Verify the exact URL format works with Shopify's paginate + section rendering.

## Open Questions

- None — all decisions resolved during scoping.
