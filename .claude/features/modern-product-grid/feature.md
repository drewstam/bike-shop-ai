# Modern Product Grid

## Brief

A collection page section for showcasing full face helmets. The layout uses an offset/staggered grid where some product elements sit higher than others in each row, creating a modern asymmetric look. This gives the page a more editorial, premium feel compared to the standard uniform grid.

The user will provide a reference screenshot in the `reference/` folder.

---

## Scoping Questions

Generated: 2026-03-29
Chosen approach: Custom section with CSS Grid + Web Component

### Q1: Data source — where do the products come from?

The grid needs products to display. How should the section get them?

- [ ] a) **Collection picker** — store owner picks a collection in the customizer, section loops through its products. Most flexible, works for any collection.
- [ ] b) **Automatic (page context)** — section reads from the current collection on a collection page. Simpler, but only works on collection templates.
- [ ] c) **Manual product picker** — store owner picks individual products one by one. Maximum control, but tedious for larger grids.

**Notes:**
All products with the tag "Full Face Mountain Bike Helmets" should be the data source. Implementation approach: use a **collection picker** in the section settings — the store owner points it at a collection that contains (or is auto-filtered by) this tag. This keeps the section reusable rather than hardcoding a tag filter.


### Q2: Secondary lifestyle image — where does it come from?

The design shows a lifestyle/action photo appearing on hover. Where should this image be sourced?

- [ ] a) **Product metafield** — each product stores a secondary lifestyle image in a metafield (e.g. `custom.lifestyle_image`). Most scalable, client manages per product.
- [x] b) **Second product image** — use the product's second media image. Simple, but less control — the second image might not always be a lifestyle shot.
- [ ] c) **Section block per product** — store owner manually assigns lifestyle images in the section settings. Full control but high maintenance.

**Notes:**
Use the second product image (`product.media[1]`) as the lifestyle/hover image. If a product only has one image, the hover reveal simply won't show.


### Q3: Product info shown on each card

The design shows product name + year below each card. What info should display?

- [ ] a) **Product title + metafield year** — title from product, year from a metafield (e.g. `custom.year`)
- [ ] b) **Product title + product type or tag** — use an existing product attribute for the year/season info
- [x] c) **Product title only** — keep it minimal, no year/season

**Notes:**


### Q4: The "STORE" button visible in the mobile screenshot — what does it do?

I see a neon green "STORE" button in the top left of the mobile view.

- [ ] a) **Links to the main store/shop page** — navigational CTA
- [x] b) **Part of the page header, not this section** — ignore, it's external to the grid
- [ ] c) **Something else** — describe below

**Notes:**


### Q5: Click behavior — what happens when you click a product card?

- [x] a) **Navigate to product page** — standard product link
- [ ] b) **Open a quick-view modal** — show product details without leaving the page
- [ ] c) **No link for now** — this is a showcase/gallery, not a shop grid (add links later)

**Notes:**


### Q6: Stagger pattern — how should the offset work?

The design shows alternating row offsets. Should this be:

- [x] a) **Fixed pattern** — e.g., odd items offset up, even items down, repeating consistently. Predictable and clean.
- [ ] b) **Configurable per card** — store owner can set each card's offset position. Maximum flexibility but complex settings.
- [ ] c) **Automatic variety** — CSS-driven pattern that creates visual variety without manual control (e.g., nth-child based offsets)

**Notes:**


### Q7: How many products per row on desktop?

The design shows what looks like 4 columns with varying sizes.

- [x] a) **4 columns** — matches the design exactly
- [ ] b) **Configurable (2-4 columns)** — let the store owner choose
- [ ] c) **Something else** — describe below

**Notes:**
Make it pagable and only have 2 rows maximum on the page at a time.

### Q8: Should cards link to a product or is this purely a visual showcase?

Looking at the design more carefully, this feels editorial — like a helmet showcase/gallery rather than a traditional e-commerce grid. This affects whether we build it with Shopify product data or as a more flexible content section.

- [x] a) **Product-driven** — pulls from Shopify products, links to product pages, uses product data
- [ ] b) **Content-driven** — uses blocks with image pickers, custom text fields, optional links. More flexible for editorial/showcase use.
- [ ] c) **Hybrid** — product picker for data, but with overrides for display name, year label, images

**Notes:**


---

### Recommendations

1. **Accent color (neon green/yellow):** The design uses a distinct accent color for the year text and hover border. I'd recommend making this a section-level color setting so the client can adjust it. We should check if the theme's existing color schemes can accommodate this or if we need a standalone color picker.

2. **Elliptical image reveal:** The lifestyle image on hover uses a curved/elliptical clip-path. This is a CSS `clip-path: ellipse()` or a custom SVG clip — purely CSS, no JS needed for the shape itself. The web component would handle showing/hiding it on hover.

3. **Card sizes:** The design shows cards at different sizes (some larger, some smaller). This could be achieved with CSS Grid `grid-column: span 2` / `grid-row: span 2` on certain items, driven by an nth-child pattern or a per-card size setting.

4. **Dark background:** The design has a dark/black background throughout. We should use Dawn's color scheme system (`color_scheme` setting) rather than hardcoding dark colors — this lets the client switch schemes if needed.

5. **Performance:** If lifestyle images are large, we should use Shopify's image transforms (`| image_url: width: X`) and `loading="lazy"` for the secondary images since they only appear on hover.

6. **Mobile simplification:** The mobile design drops the stagger and uses a clean 2-column grid. This is smart — the offset effect doesn't work well on small screens. We'll use the 750px breakpoint to switch layouts.

## Extended Brief

Generated: 2026-03-29

### Chosen Approach

Custom section with CSS Grid + Web Component. Fully self-contained — no modifications to Dawn core files. The web component handles hover interactions (accent border + lifestyle image reveal) and "Load more" pagination.

### Requirements

- Product-driven staggered grid pulling from a **collection picker** section setting
- **Desktop:** 4-column offset grid with a fixed alternating stagger pattern — some cards sit higher than others in each row
- **Mobile (< 750px):** 2-column uniform grid, no stagger
- Each card displays: product image on dark background, thin light border, product title below
- **Hover state:** border changes to accent color (neon green/yellow) + secondary lifestyle image appears with an elliptical/curved clip-path reveal
- Secondary image sourced from `product.media[1]` — if only one image exists, hover shows accent border only (no image reveal)
- Clicking a card navigates to the product page
- **Max 2 rows visible per load** (8 products on desktop per page)
- **"Load more" button** to append the next batch of products without a full page reload
- Accent color configurable via a section-level color picker setting
- Background handled via Dawn's color scheme system (not hardcoded dark)
- Standard section padding settings (top/bottom)

### Where It Lives

Collection page template — but built as a reusable section with a collection picker, so it can be placed on any template (homepage, custom pages, etc.).

### Data Sources

- **Collection:** via section setting (`type: collection`) → loop through `collection.products`
- **Product title:** `product.title`
- **Primary image:** `product.featured_image`
- **Secondary/lifestyle image:** `product.media[1].preview_image` (second media item)
- **Product URL:** `product.url`

### User Interaction

- **Hover (desktop):** card border transitions to accent color; if a secondary image exists, it reveals from the right side of the card using an elliptical clip-path animation
- **Click:** navigates to the product page
- **Load more:** clicking the button fetches and appends the next page of products (8 more) below the current grid. Button disappears when all products are loaded.
- **Mobile:** no hover effects (touch devices), standard tap to navigate

### Customizer Settings

**Section-level:**
- Collection picker — which collection to display
- Accent color — color picker for hover border and any accent elements
- Color scheme — Dawn's standard color scheme selector (controls background, text colors)
- Padding top / bottom — standard range sliders

**Not configurable (by design):**
- Number of columns (fixed at 4 desktop / 2 mobile)
- Stagger pattern (fixed CSS pattern)
- Products per page (fixed at 8)
- Card border style

### Decisions Made

| Decision | Choice | Reasoning |
|---|---|---|
| Data source | Collection picker | Reusable across collections, client manages products via Shopify collection rules |
| Secondary image | product.media[1] | Simplest approach, no metafield setup needed. Client just ensures second image is the lifestyle shot |
| Product info | Title only | Clean minimal look matching the design. No year/season labels needed |
| Click behavior | Navigate to product page | Standard e-commerce behavior, product-driven grid |
| Stagger pattern | Fixed CSS pattern | Predictable, no complex settings. nth-child based offsets |
| Columns | 4 fixed on desktop | Matches the design. No need for configurability |
| Pagination | "Load more" button | More modern feel than numbered pagination, fits the editorial design |
| STORE button | Out of scope | Part of the page header, not this section |

### Edge Cases to Handle

- **Product with 1 image only** — hover shows accent border but no lifestyle image reveal
- **Collection has < 8 products** — no "Load more" button shown, grid fills naturally
- **Odd number of products in last row** — CSS Grid handles gaps gracefully, no empty card placeholders
- **Empty collection** — section either hides entirely or shows a minimal empty state
- **Very long product titles** — truncate with ellipsis to prevent card layout breaking
- **Images with different aspect ratios** — use `object-fit: cover` to maintain consistent card proportions
- **Mobile touch** — no hover effects, just tap to navigate

### Out of Scope

- Quick-add / add-to-cart from the grid
- Filtering or sorting controls
- Price display on cards
- Year/season labels
- The "STORE" button (external to this section)
- Variant selection on cards
- Badge/tag overlays on cards

### Dependencies

- Dawn's color scheme system (already exists)
- Shopify's Section Rendering API (for "Load more" fetching)
- An automated collection set up in Shopify Admin with the tag "Full Face Mountain Bike Helmets" (already created)

### Notes

- The elliptical clip-path reveal is the signature interaction — needs careful CSS work to match the curved edge from the design screenshots
- Performance: use Shopify image transforms (`| image_url: width:`) and `loading="lazy"` on secondary images since they only appear on hover
- The "Load more" button will use the Section Rendering API to fetch the next page — same pattern Dawn uses for product recommendations

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# feature.md — v1.0

# AI Shopify Developer Bootcamp

# by Coding with Jan

# https://codingwithjan.com

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
