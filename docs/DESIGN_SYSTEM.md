# Design System

## Design direction
Premium dark, calm, editorial and precise. The interface should feel like a carefully crafted personal finance utility, not a generic admin template. It should communicate trust and clarity.

## Provisional colour tokens
These are starting tokens; validate contrast in implementation and adjust only through a documented design review.

| Token | Hex | Use |
|---|---|---|
| `color.bg` | `#101216` | Main app background |
| `color.surface` | `#191D24` | Primary surface |
| `color.surface-elevated` | `#202630` | Menus/dialogs/elevated surface |
| `color.border` | `#2A303A` | Subtle dividers and outlines |
| `color.text-primary` | `#F3F4F2` | Main text |
| `color.text-secondary` | `#A7ADB7` | Supporting text |
| `color.text-muted` | `#7D8591` | Low-emphasis metadata |
| `color.accent` | `#A5C96B` | Primary action and selected state |
| `color.accent-strong` | `#B9D987` | Hover/active accent, check contrast |
| `color.success` | `#8CCB9A` | Success semantics |
| `color.warning` | `#E5B86B` | Warning semantics |
| `color.danger` | `#E18A8A` | Destructive/error semantics |

Do not use the accent for every element. Preserve neutral space and hierarchy. Semantic colours must not be the sole way of communicating state.

## Typography
- Use a modern, highly legible sans-serif family. Candidate: Inter or Geist; choose one and load efficiently.
- Use tabular numerals for prices, dates and analytics.
- Keep body copy comfortably readable; target 14–16px minimum for core UI.
- Use clear hierarchy: page title, section title, label, metadata.
- Avoid overly tiny all-caps labels and excessive font-weight variation.

## Layout and spacing
- Use a consistent spacing scale based on 4px.
- Mobile-first; no horizontal page overflow.
- Use cards only when they create meaningful grouping. Prefer clear sections and restrained surfaces over card-everything layouts.
- Keep data tables and charts legible on mobile; provide alternate stacked layouts when necessary.
- Touch targets should generally be at least 44x44 CSS px.
- Use consistent corner radii; avoid excessive pill shapes and oversized rounded cards.

## Components
Create a small, coherent component system:
- Button: primary, secondary, tertiary, destructive, loading and disabled.
- Form field: visible label, helper text, validation and error.
- Select/combobox: searchable provider selector, keyboard accessible.
- Dialog/drawer: confirmation and focused editing.
- Subscription row/card: provider identity, amount/currency, next date, status.
- Status indicator: text plus colour/icon; no colour-only meaning.
- Calendar event and date cell.
- Chart legend and accessible data alternative.
- Toast/inline feedback.
- Empty state with helpful next action.
- Navigation: mobile bottom nav; desktop sidebar.

Use Lucide icons consistently. Do not use emoji as product UI icons. Use provider brand marks only where their use and source are verified.

## Motion
- Ease-out for entrances and state transitions.
- Dropdown transitions approximately 150–250ms.
- List stagger approximately 30ms only for short, purposeful sequences.
- Press feedback around scale 0.97.
- Subtle success pulse; no routine bounce.
- Crossfade icon state changes; avoid unnecessary blur.
- Respect reduced-motion settings and avoid animating layout dimensions when opacity/transform will do.

## Accessibility
- WCAG 2.2 AA target.
- Verify text and control contrast.
- Visible focus indicators.
- Keyboard-operable menus, dialogs, calendar and forms.
- Semantic headings and landmarks.
- Screen-reader labels and status announcements.
- Do not rely on colour alone.
- Respect reduced motion and zoom.
