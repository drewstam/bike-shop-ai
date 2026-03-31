# QA: Modern Product Grid

Feature spec: `.claude/features/modern-product-grid/feature.md`
Implementation plan: `.claude/features/modern-product-grid/OUTPUT-implementation-plan.md`

## How to Use This File

1. Run through the checklist after implementation — check items that pass, add notes on items that fail
2. Tell AI to read this file — it will fix the issues and reset the checklist for another round
3. Repeat until everything passes
4. Previous rounds are kept as a log below the current round

## Current Round (Round 1)

Status: Not started

### Core behavior
- [y] Section appears in theme customizer under "Add section"
- [y] Collection picker setting works — selecting a collection populates the grid
- [y] Grid displays up to 8 products from the selected collection
- [ ] Product images render correctly (no stretching, no cropping issues)
- [y] Product titles display below each card
- [ ] Clicking a card navigates to the correct product page
- [ ] Cards with 2+ images show the secondary image reveal on hover
- [ ] Cards with only 1 image show accent border on hover but no image reveal
- [ ] Accent color setting in customizer changes the hover border color

### Layout
- [ ] Desktop: 4-column grid displays correctly
- [ ] Desktop: stagger/offset pattern is visible — alternating cards sit lower
- [ ] Desktop: card spacing and proportions match the reference design
- [ ] Desktop: the elliptical/curved clip-path on the reveal image matches the design
- [ ] Desktop: reveal image extends to the right of the card without causing horizontal scrollbar
- [ ] Mobile (< 750px): 2-column uniform grid, no stagger
- [ ] Mobile: cards display cleanly with proper spacing

### Load more
- [ ] "Load more" button appears when collection has more than 8 products
- [ ] "Load more" button is hidden when collection has 8 or fewer products
- [ ] Clicking "Load more" appends the next batch of products below the existing grid
- [ ] Newly appended cards follow the same stagger pattern
- [ ] Newly appended cards have working hover effects (border + reveal)
- [ ] "Load more" button disappears after all products are loaded
- [ ] Button shows loading state during fetch (disabled, visual feedback)
- [ ] Multiple rapid clicks don't cause duplicate fetches

### Edge cases
- [ ] Empty collection (or no collection selected) — section handles gracefully (hides or shows empty state)
- [ ] Collection with fewer than 4 products — partial row displays without layout issues
- [ ] Collection with exactly 8 products — no "Load more" button, grid fills naturally
- [ ] Very long product title — truncates with ellipsis, doesn't break card layout
- [ ] Products with different image aspect ratios — cards remain consistent height

### Customizer settings
- [ ] Color scheme setting changes background and text colors
- [ ] Accent color picker works and updates hover border color
- [ ] Padding top/bottom sliders adjust section spacing
- [ ] Section works in the theme customizer preview (live updates)

### Accessibility
- [ ] Cards are keyboard-focusable (Tab key navigates through them)
- [ ] Focus state is visually distinct (visible outline or accent border)
- [ ] Screen reader announces product names on each card
- [ ] "Load more" button is accessible via keyboard
- [ ] Images have appropriate alt text
- [ ] Prefers-reduced-motion: transitions and stagger transforms are disabled

### JavaScript disabled
- [ ] Grid still renders first 8 products without JS
- [ ] "Load more" button either falls back to a page link or is hidden

## Previous Rounds

[Empty — no rounds completed yet.]
