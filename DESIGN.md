# NutriSnap design system

## Identity and visual direction

NutriSnap (Nutri-Kcal) is a nutrition workspace for searching, reviewing, and saving food information. Minimal Athletic Brutalism is expressed through bold, tightly spaced headlines, prominent KCAL figures, a disciplined grid, strong contrast, and restrained borders. The interface emphasizes practical food decisions rather than decorative workout imagery or invented performance statistics.

The dashboard displays totals across **all saved entries**, not daily totals or a goal percentage. Signed-out, loading, and failed requests display a dash instead of invented numbers. Empty authenticated history produces zero totals. AI responses are explicitly estimates; users enter and confirm their own values before saving.

## Original logo

The original asset is preserved byte-for-byte at `src/images/logo1.png`. Its NK lettering and flexed-arm shape must not be redrawn, distorted, cropped, or replaced. The desktop sidebar uses the asset on a small ivory backing for readable presentation in either theme. Mobile pairs the original logo with a compact wordmark to leave room for controls. Preserve the original image even when adding future non-destructive variants.

## Themes and semantic tokens

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--background` | #111512 | #F5F5EE | Page and input background |
| `--surface` | #1B211C | #FFFFFF | Cards and panels |
| `--surface-raised` | #232B24 | #E4E9DB | Secondary controls |
| `--text` | #F1F4E9 | #171D16 | Primary text |
| `--muted` | #ADB6A8 | #5C6656 | Supporting labels |
| `--accent` | #C7F36B | #526F22 | Primary actions and highlights |
| `--on-accent` | #171D16 | #FFFFFF | Content on accent fills |
| `--border` | #354036 | #C9D1C0 | Panel and control boundaries |
| `--danger` | #FFB4AB | #A22C25 | Errors and destructive actions |
| `--danger-surface` | #362321 | #FFEBE7 | Error backgrounds |

The dark palette is defined in `src/theme/dark.css`; light overrides are in `light.css`. Shared typography, spacing, and radius tokens are in `tokens.css`. Macro secondary colors also have theme-specific tokens. Color never communicates a nutrient or action alone: text labels remain visible.

The header offers System, Dark, and Light. Explicit choices persist under `nutrisnap-theme`; System removes that override and follows live OS preference changes. A head script sets the initial theme before application styles load. Storage failures fall back to system selection.

The theme selector remains a native, labeled `<select>` so browser and assistive-technology keyboard behavior is preserved. Its closed control and option list use the active theme's `--surface`, `--text`, `--border`, `--accent`, and `--on-accent` tokens. The selected option uses the lime/olive accent with readable on-accent text; hover uses `--surface-raised`; keyboard focus uses the existing visible accent outline. `color-scheme` and `accent-color` communicate the active palette to browsers that render native menus. The control keeps a 44px touch target, a compact width on narrow screens, and may use the operating system's native popup surface where that browser does not expose option-painting controls.

## Typography

The implementation uses local system fonts without external font downloads: Arial/Helvetica Neue for text and Arial Black/Arial for display headings. This avoids font-loading shifts and additional dependencies.

- Body: 15px with 1.6 line height.
- Page headings: fluid 2.2–3.5rem, heavy weight, tight tracking.
- Section headings: fluid 1.3–1.65rem.
- KCAL hero: fluid 2.8–5.8rem, tabular numerals.
- Entry calories: fluid 2.3–3.3rem.
- Eyebrows: 0.65rem, uppercase, wide tracking.
- Buttons: 0.85rem; labels: 0.8rem; supporting copy: 0.75rem.

Long names and large values wrap. Do not reduce required nutrition information to unreadable text to fit a card.

## Spacing, grid, and surfaces

Spacing tokens use 4, 8, 12, 16, 24, 32, 48, and 64px. Most cards use 24–32px padding; compact screens use smaller page gutters. Content is capped at 1600px inside the workspace.

Cards use a 12px radius; controls use 6px. Borders are 1px. There are no decorative gradients or card shadows. Use whitespace and hierarchy rather than nested ornamental containers.

## Responsive behavior

Layouts are mobile-first and use Grid/Flexbox with `minmax(0, 1fr)` to accommodate long content.

| Width | Behavior |
| --- | --- |
| 320–359px | Compact header; single-column macro form fields |
| 360–599px | Stacked overview and feature panels; bottom navigation |
| 600–1023px | Two-column feature/overview panels; three action cards; two history columns |
| 1024px+ | 246px desktop sidebar; bottom navigation hidden; two-column authentication layout |
| 1280px+ | Larger gutters; three history columns |
| Ultrawide | Centered workspace with a 1600px content cap |

Below 1024px, all six existing feature destinations remain available through fixed bottom navigation. Page footer spacing prevents it from covering final actions. The header wraps rather than clipping account controls.

Safe-area insets protect header, content, and mobile navigation. Layout height uses dynamic viewport units. Inputs use fluid widths; textareas resize vertically. Low-height desktop windows hide the optional sidebar slogan.

A progressive `horizontal-viewport-segments: 2` rule increases the central grid gap using viewport-segment environment values when supported. This is a fallback enhancement, not a claim of physical hinge alignment. Actual foldable hardware, virtual keyboards, browser zoom, and unsupported segment APIs require manual verification.

## Reusable components

- `PageHeading`: eyebrow, page title, supporting text, optional action.
- `Icon`: small inline SVG line icons; decorative and hidden from assistive technology.
- `Feedback`: error alerts, success statuses, and loading feedback.
- `NutritionCard`: food name, meal label, KCAL, three macros, optional metadata and actions.
- `EntryForm`: labeled fields, native constraints, validation, save feedback.
- `FoodResult`: Nutritionix result and explicit save.
- `AppLayout`: shared shell, account controls, theme selection, navigation.

Primary buttons use accent/on-accent; secondary buttons use neutral surfaces. Danger buttons include an explicit action label. Interactive controls have a 44px or greater intended touch height; standard forms and buttons use 48px.

Nutrition bars express each macro's share of the summed gram amounts, **not calorie contribution or goal completion**. The adjacent numeric values are authoritative; decorative tracks are hidden from screen readers.

## Accessibility

The implementation provides semantic landmarks, one primary page heading, explicit input labels, a skip link, route-change focus on main content, visible focus outlines, live feedback, and reduced-motion overrides. The deletion dialog uses native `dialog.showModal()` for modality and keyboard focus containment. Cancel is the initial action; unsuccessful deletion leaves the dialog open with feedback.

Native validation rejects required empty fields and negative entered nutrient values. Optional blank nutrition values remain blank. Names and errors wrap rather than overflow.

Screenshots and browser tests supplement, but do not replace, a screen-reader audit and checks on actual devices.

## Token usage and future changes

```css
.panel {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.button.primary {
  background: var(--accent);
  color: var(--on-accent);
}
```

Add colors to theme files, not individual pages. Reuse shared nutrition and feedback components. Keep new routes tied to real functionality. Keep actual backend data distinguishable from estimates, unavailable values, and any explicitly labeled future demos. Extend both themes and responsive states together.
