# Theme Analysis — Dawn

Generated: 2026-03-28

## Summary

This is Shopify's **Dawn theme, version 15.4.1** (confirmed in `config/settings_schema.json`). It is the official Shopify reference theme — clean, minimal, and heavily focused on accessibility and performance. No custom modifications have been made; this is a stock Dawn installation. All sections, snippets, and assets are standard theme defaults.

---

## File Structure Overview

**Counts:**
- Sections: 51 (including JSON group files)
- Snippets: 28
- Templates: 16 (including customer subdirectory)
- Asset files: ~100+ (CSS components, JS modules, SVG icons)
- Locales: 29 languages

**No custom files detected.** Everything follows Dawn's standard naming and structure. Notable files:

- `assets/constants.js` — Shared constants (debounce timer, pub/sub event names)
- `assets/pubsub.js` — Custom pub/sub system used for cross-component communication
- `assets/global.js` — Core utility functions + the bulk of web component definitions
- `sections/footer-group.json` / `sections/header-group.json` — Section group configs

---

## CSS Conventions

### Grid System

Dawn uses **flexbox** for its grid, not CSS Grid. The grid is built on the `.grid` + `.grid__item` class pattern with responsive column modifier classes:

```css
.grid { display: flex; flex-wrap: wrap; }
```

Column counts are controlled via modifier classes applied to the `.grid` element:
- `.grid--2-col-tablet-down` — 2 columns on tablet and below
- `.grid--1-col-tablet-down` — 1 column on tablet and below
- `.grid--{N}-col-desktop` — N columns on desktop (1–6)
- `.grid--{N}-col` — N columns (1–3 shorthand variants)

Column gaps are driven by CSS custom properties `--grid-mobile-horizontal-spacing`, `--grid-mobile-vertical-spacing`, `--grid-desktop-horizontal-spacing`, `--grid-desktop-vertical-spacing` — set from `settings.spacing_grid_horizontal` and `settings.spacing_grid_vertical` (default: 8px).

### Breakpoints

Three main breakpoints, consistent across the entire codebase:

| Breakpoint | Value | Usage |
|---|---|---|
| Mobile | `< 750px` | Default / mobile styles |
| Tablet | `750px` | Mid-range layout |
| Desktop | `990px` | Full desktop layout |

Also used occasionally:
- `max-width: 749px` — explicit mobile-only targeting
- `min-width: 750px and max-width: 989px` — tablet-only targeting (`.medium-hide`)

### Color Variables

All colors are defined as RGB channel values (no `#hex`, no `rgb()` — just raw `R,G,B` numbers) so they can be composed with alpha values using `rgba()`:

```css
/* Core color variables (set per color scheme in theme.liquid) */
--color-background: R,G,B
--color-foreground: R,G,B
--color-background-contrast: R,G,B
--color-shadow: R,G,B
--color-button: R,G,B
--color-button-text: R,G,B
--color-secondary-button: R,G,B
--color-secondary-button-text: R,G,B
--color-link: R,G,B
--color-badge-foreground: R,G,B
--color-badge-background: R,G,B

/* Gradient companion */
--gradient-background: (gradient or solid color)

/* Alpha control variables (set in base.css :root) */
--alpha-button-background: 1
--alpha-button-border: 1
--alpha-link: 0.85
--alpha-badge-border: 0.1
```

Used in CSS like: `rgba(var(--color-foreground), 0.75)` or `rgb(var(--color-background))`.

### Naming Convention

Dawn does **not use BEM strictly**. It uses a flat, component-scoped naming style:

- **Component prefix** — `card__`, `banner__`, `multicolumn__`, `rich-text__`
- **Double underscores** for children — `.banner__content`, `.multicolumn-card__image-wrapper`
- **Double dashes** for modifiers — `.button--primary`, `.button--secondary`, `.grid--2-col-desktop`
- **State/utility classes** — `.hidden`, `.visually-hidden`, `.center`, `.large-up-hide`, `.small-hide`
- **Section-scoped padding classes** — `.section-{{ section.id }}-padding`
- **Color scheme classes** — `.color-{{ scheme.id }}` applied to the outer container

### Spacing Patterns

No spacing utility classes (no `.mt-4`, `.p-2` style utilities). All spacing is either:
1. **Section-level padding** via `.section-{{ section.id }}-padding` (dynamically scoped per section)
2. **Section spacing** via `--spacing-sections-desktop` / `--spacing-sections-mobile` — applied as `margin-top` between `.section + .section` elements
3. **Manual values** in component CSS files

### Page Width / Containers

```css
/* Primary container */
.page-width {
  max-width: var(--page-width);  /* default: 120rem (1200px), configurable 1000–1600px */
  margin: 0 auto;
  padding: 0 1.5rem;             /* mobile */
}

@media (min-width: 750px) {
  .page-width { padding: 0 5rem; }
}
```

Other container variants:
- `.page-width--narrow` — max-width: 72.6rem on desktop, 9rem padding on tablet
- `.page-width-desktop` — no padding mobile, max-width + 5rem padding desktop
- `.page-width-tablet` — 5rem padding from 750px up
- `.content-container--full-width` — breaks out of `.page-width` to span full width

---

## JavaScript Conventions

### Base Files (do not modify)

| File | Purpose |
|---|---|
| `assets/constants.js` | Shared constants: `ON_CHANGE_DEBOUNCE_TIMER`, `PUB_SUB_EVENTS` |
| `assets/pubsub.js` | Pub/sub system: `subscribe(event, callback)` / `publish(event, data)` |
| `assets/global.js` | Core utils + main web component definitions (see list below) |
| `assets/details-disclosure.js` | `details-disclosure`, `header-menu` components |
| `assets/details-modal.js` | `details-modal` component |
| `assets/search-form.js` | `search-form` component |
| `assets/animations.js` | Scroll-reveal animation logic |
| `assets/theme-editor.js` | Theme editor event handling |

### Existing Components

All custom elements registered via `customElements.define()`:

**In `global.js`:**
| Tag | Purpose |
|---|---|
| `quantity-input` | +/- quantity stepper with validation |
| `menu-drawer` | Mobile slide-out nav drawer |
| `header-drawer` | Header-level drawer wrapper |
| `modal-dialog` | Generic modal with focus trap |
| `bulk-modal` | Modal variant for bulk add |
| `modal-opener` | Button that triggers a modal |
| `deferred-media` | Lazy-loads video/3D on click |
| `slider-component` | Accessible slider/carousel |
| `slideshow-component` | Extends slider for slideshow use |
| `variant-selects` | Product variant selector |
| `product-recommendations` | Fetches + renders recommended products via Section Rendering API |
| `account-icon` | Account icon with login state |
| `bulk-add` | Bulk add to cart |

**In separate files:**
| Tag | File | Purpose |
|---|---|---|
| `cart-drawer` | `cart-drawer.js` | Cart drawer panel |
| `cart-drawer-items` | `cart-drawer.js` | Items list inside cart drawer |
| `cart-notification` | `cart-notification.js` | Add-to-cart notification popup |
| `cart-remove-button` | `cart.js` | Remove item from cart |
| `cart-items` | `cart.js` | Cart items list (cart page) |
| `details-disclosure` | `details-disclosure.js` | Dropdown disclosure |
| `header-menu` | `details-disclosure.js` | Header nav menu |
| `details-modal` | `details-modal.js` | Details-based modal |
| `facet-filters-form` | `facets.js` | Collection filter form |
| `price-range` | `facets.js` | Price range filter |
| `facet-remove` | `facets.js` | Remove active filter |
| `main-search` | `main-search.js` | Main search page |
| `media-gallery` | `media-gallery.js` | Product media gallery |
| `password-modal` | `password-modal.js` | Password page modal |
| `pickup-availability` | `pickup-availability.js` | Store pickup availability |
| `pickup-availability-drawer` | `pickup-availability.js` | Pickup info drawer |
| `predictive-search` | `predictive-search.js` | Live search autocomplete |
| `price-per-item` | `price-per-item.js` | Volume pricing display |
| `product-form` | `product-form.js` | Product add-to-cart form |
| `product-info` | `product-info.js` | Product info with variant updates |
| `product-modal` | `product-modal.js` | Product image modal |
| `product-model` | `product-model.js` | 3D model viewer |
| `quantity-popover` | `quantity-popover.js` | Quantity popover for bulk add |
| `quick-add-bulk` | `quick-add-bulk.js` | Bulk quick-add modal |
| `quick-add` | `quick-add.js` | Quick-add to cart from collection |
| `quick-order-list` | `quick-order-list.js` | B2B quick order list |
| `quick-order-list-items` | `quick-order-list.js` | Items within quick order list |
| `recipient-form` | `recipient-form.js` | Gift card recipient form |
| `search-form` | `search-form.js` | Search form with predictive |
| `share-button` | `share.js` | Native share / clipboard copy |
| `show-more-button` | `show-more.js` | Progressive disclosure |
| `localization-form` | `localization-form.js` | Language/currency switcher |

### Event Patterns

Dawn uses a **custom pub/sub system** (`pubsub.js`) for cross-component communication. Always use this for events that need to cross component boundaries — do not use custom DOM events for cart/quantity updates.

```js
// Subscribe
const unsubscribe = subscribe(PUB_SUB_EVENTS.cartUpdate, (data) => { ... });

// Publish
publish(PUB_SUB_EVENTS.cartUpdate, { cart: responseData });

// Unsubscribe (call in disconnectedCallback)
unsubscribe();
```

**Defined event names** (from `constants.js`):
- `PUB_SUB_EVENTS.cartUpdate` — `'cart-update'`
- `PUB_SUB_EVENTS.quantityUpdate` — `'quantity-update'`
- `PUB_SUB_EVENTS.optionValueSelectionChange` — `'option-value-selection-change'`
- `PUB_SUB_EVENTS.variantChange` — `'variant-change'`
- `PUB_SUB_EVENTS.cartError` — `'cart-error'`

### Third-Party Libraries

None. Dawn is framework-free — pure vanilla JS only.

### Script Loading

**Global base scripts** are loaded in `layout/theme.liquid` with `defer="defer"`:
```liquid
<script src="{{ 'constants.js' | asset_url }}" defer="defer"></script>
<script src="{{ 'pubsub.js' | asset_url }}" defer="defer"></script>
<script src="{{ 'global.js' | asset_url }}" defer="defer"></script>
```

**Section-specific scripts** are loaded inline at the top of section files with `defer="defer"`:
```liquid
<script src="{{ 'product-form.js' | asset_url }}" defer="defer"></script>
```

**Conditional loading** is used — scripts are only included when their feature is active:
```liquid
{%- unless section.settings.quick_add == 'none' -%}
  <script src="{{ 'product-form.js' | asset_url }}" defer="defer"></script>
{%- endunless -%}
```

No `type="module"` loading. All scripts use `defer`. No inline script blocks for feature logic.

---

## Liquid Conventions

### Section Wrapper Pattern

Most content sections use this outer wrapper:

```liquid
<div class="color-{{ section.settings.color_scheme }} isolate gradient">
  <div class="page-width section-{{ section.id }}-padding">
    <!-- content -->
  </div>
</div>
```

Full-width variants drop `page-width` from the outer div and re-add it inside:
```liquid
<div class="isolate{% unless section.settings.full_width %} page-width{% endunless %}">
  <div class="rich-text color-{{ section.settings.color_scheme }} gradient{% if section.settings.full_width %} rich-text--full-width content-container--full-width{% endif %} section-{{ section.id }}-padding">
    <div class="{% if section.settings.full_width %} page-width{% endif %}">
```

Banner/hero sections use `id="Banner-{{ section.id }}"` instead of `.page-width` for the outer element.

### Section Padding Approach

**This is the standard pattern used across all sections.** Dawn uses `0.75` as the mobile multiplier (not `0.5` — always follow what the theme actually uses):

```liquid
{%- style -%}
  .section-{{ section.id }}-padding {
    padding-top: {{ section.settings.padding_top | times: 0.75 | round: 0 }}px;
    padding-bottom: {{ section.settings.padding_bottom | times: 0.75 | round: 0 }}px;
  }

  @media screen and (min-width: 750px) {
    .section-{{ section.id }}-padding {
      padding-top: {{ section.settings.padding_top }}px;
      padding-bottom: {{ section.settings.padding_bottom }}px;
    }
  }
{%- endstyle -%}
```

The `.section-{{ section.id }}-padding` class is applied to the inner content wrapper (not the outermost element).

### Standard Schema Settings

Settings that appear in virtually every section (in this order):

1. **Content settings** — heading, text, collection/product pickers (section-specific)
2. `color_scheme` — `type: color_scheme`, default: `"scheme-1"`
3. **Section padding header** — `type: header`, content: `"t:sections.all.padding.section_padding_heading"`
4. `padding_top` — `type: range`, min: 0, max: 100, step: 4, unit: px
5. `padding_bottom` — `type: range`, min: 0, max: 100, step: 4, unit: px

Default padding values vary by section (28–52px), not always the same.

### Section Structure

Standard file anatomy:
```liquid
{{ 'section-name.css' | asset_url | stylesheet_tag }}
{{ 'component-xyz.css' | asset_url | stylesheet_tag }}  {# if needed #}

<script src="{{ 'feature.js' | asset_url }}" defer="defer"></script>  {# if needed #}

{%- style -%}
  .section-{{ section.id }}-padding { ... }
{%- endstyle -%}

{%- liquid
  assign some_var = ...
-%}

<div class="color-{{ section.settings.color_scheme }} isolate gradient">
  <div class="page-width section-{{ section.id }}-padding">
    <!-- markup -->
  </div>
</div>

{% schema %}
{ ... }
{% endschema %}
```

### Snippet Patterns

Snippets follow a `noun-type` naming convention (not `snippet-` prefixed):
- `card-product.liquid`, `card-collection.liquid`, `article-card.liquid` — Card renderers
- `price.liquid`, `unit-price.liquid` — Price display
- `product-media.liquid`, `product-thumbnail.liquid` — Media components
- `icon-accordion.liquid`, `icon-with-text.liquid` — Icon helpers
- `header-drawer.liquid`, `header-mega-menu.liquid`, `header-dropdown-menu.liquid` — Header nav
- `facets.liquid`, `pagination.liquid` — Collection page helpers

Snippets are rendered with `{% render 'snippet-name', param: value %}`. Parameters are explicit — no variable bleeding.

### Translation Approach

**Fully translated** — every user-facing string uses `t:` keys. No hardcoded English text in Liquid. Pattern:

- Labels: `"label": "t:sections.all.colors.label"`
- Defaults: `"default": "t:sections.image-banner.blocks.heading.settings.heading.default"`
- Schema names: `"name": "t:sections.rich-text.name"`

In Liquid markup: `{{ 'newsletter.label' | t }}` or `{{ 'general.slider.previous_slide' | t }}`.

**Rule:** All new sections must follow this pattern — use translation keys for all schema labels and defaults, not hardcoded strings.

### Block Patterns

Blocks typically contain content settings only (no padding/color at block level). Common recurring block types:

- `heading` — inline_richtext + heading_size select
- `text` / `paragraph` — richtext content
- `button` / `buttons` — label, url, style toggle (primary/secondary)
- `caption` — text + style select + size select
- `image` — image_picker
- `column` — image + title + text + link (for multicolumn)
- `@app` — app block slot (commonly added to newsletter, footer)

Block settings never include color_scheme or padding — those live at section level only.

---

## Schema Conventions

### Common Settings

Present in almost every section:

```json
{
  "type": "color_scheme",
  "id": "color_scheme",
  "label": "t:sections.all.colors.label",
  "default": "scheme-1"
},
{
  "type": "header",
  "content": "t:sections.all.padding.section_padding_heading"
},
{
  "type": "range",
  "id": "padding_top",
  "min": 0,
  "max": 100,
  "step": 4,
  "unit": "px",
  "label": "t:sections.all.padding.padding_top",
  "default": 36
},
{
  "type": "range",
  "id": "padding_bottom",
  "min": 0,
  "max": 100,
  "step": 4,
  "unit": "px",
  "label": "t:sections.all.padding.padding_bottom",
  "default": 36
}
```

Sections with headings also include:
```json
{
  "type": "select",
  "id": "heading_size",
  "options": [
    { "value": "h2", "label": "t:sections.all.heading_size.options__1.label" },
    { "value": "h1", "label": "t:sections.all.heading_size.options__2.label" },
    { "value": "h0", "label": "t:sections.all.heading_size.options__3.label" },
    { "value": "hxl", "label": "t:sections.all.heading_size.options__4.label" },
    { "value": "hxxl", "label": "t:sections.all.heading_size.options__5.label" }
  ],
  "default": "h1",
  "label": "t:sections.all.heading_size.label"
}
```

### Color Scheme Handling

Color schemes are defined globally in `settings_schema.json` as a `color_scheme_group`. Each scheme defines: `background`, `background_gradient`, `text`, `button`, `button_label`, `secondary_button_label`, `shadow`.

In `theme.liquid`, each scheme generates a `.color-{{ scheme.id }}` class with all the CSS custom properties set. Applied to sections via:

```liquid
<div class="color-{{ section.settings.color_scheme }} gradient">
```

The `.gradient` class applies `background: var(--gradient-background)`. Always pair `color-*` + `gradient` together.

### Padding / Spacing Approach

- Range: 0–100px, step: 4px
- Most sections default to 36px top/bottom (some use 40/52 for more visual weight)
- **Mobile multiplier: `0.75`** (Dawn uses 75%, not 50%)
- Breakpoint for full padding: `750px`

### Preset Patterns

Presets always include an unconfigured entry so the section appears in the customizer. Content sections include default blocks:

```json
"presets": [
  {
    "name": "t:sections.multicolumn.presets.name",
    "blocks": [
      { "type": "column" },
      { "type": "column" },
      { "type": "column" }
    ]
  }
]
```

Presets use translation keys for the name (`t:sections.X.presets.name`), not hardcoded strings.

---

## Visual Analysis

No reference images found in `.claude/context/reference/`. No visual analysis available.

---

## Recommendations

1. **Mobile padding multiplier is `0.75`, not `0.5`.** The CLAUDE.md template shows `0.5` but Dawn consistently uses `0.75`. Always use `0.75` for new sections to match the theme.

2. **Color variables are RGB channels, not hex.** Never write `color: #121212` directly. Always use `rgb(var(--color-foreground))` or `rgba(var(--color-foreground), 0.75)`. New sections must use these variables.

3. **Translation keys are required.** Every schema label, content string, and default must reference a `t:` key. New sections should add their keys to `locales/en.default.schema.json`.

4. **`global.js` is the most critical file** — do not touch it. It defines the slider, modal, variant selector, drawer, and more. Breaking it would break the entire theme.

5. **Pub/sub is the correct inter-component communication channel.** If a new component needs to react to cart or variant changes, subscribe to `PUB_SUB_EVENTS` — don't add direct DOM listeners across components.

6. **Section spacing between sections** is handled by `--spacing-sections-desktop` CSS variable applied as `margin-top` on `.section + .section`. Do not add `margin-top` to section wrappers manually — it will double up.

7. **`slider-component` is reusable.** Before building a custom slider, check if wrapping content in `<slider-component>` with the correct grid + slider classes is sufficient. It handles keyboard, touch, and button navigation.

8. **No CDN, no libraries.** All JS must live in `assets/`. `global.js` already handles most interactive patterns — check if an existing component can be reused or extended before building from scratch.
