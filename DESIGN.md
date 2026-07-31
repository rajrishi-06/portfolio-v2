# Design system — "Datasheet"

The single source of truth for this redesign. Every component is built against
this file. If something here and the code disagree, this file is wrong and
should be updated — do not let the code drift silently.

## The idea

The site is a **component datasheet for a person**, not a magazine and not a
dev-portfolio template.

Raj builds infrastructure: a real-time payments pipeline at NPCI (Kafka,
Cassandra, KeyDB, ELK), a storage engine in C++, automation tooling. The native
document of that world is the datasheet — numbered sections, plots, tabular
characteristics, a revision history, ordering information. So the page borrows
that document's *discipline*, not its parody:

| Datasheet section      | Page section      |
| ---------------------- | ----------------- |
| Part identification    | Hero + Fig. 1     |
| Characteristics        | Currently (NPCI)  |
| Selection table        | Work              |
| Characteristics        | About / stack     |
| Revision history       | Journey           |
| Ordering information   | Contact           |

**Rule:** the structure encodes real information. Section numbers are real
(a datasheet is numbered), the work table is a real table of 9 real projects,
the characteristics tables list tools actually used. Nothing decorative wears
technical clothing. No fake "absolute maximum ratings", no invented metrics —
and where a fact cannot be shown (see § What is deliberately NOT here), it is
cut rather than approximated.

## What this replaces

Everything that made the old site look like every other portfolio:

| Out                            | In                                         |
| ------------------------------ | ------------------------------------------ |
| Glass / `backdrop-filter`      | Flat fills, hairline rules                 |
| Gradients, glows, conic halos  | One flat accent, no gradient anywhere      |
| `rounded-2xl` everywhere       | Radius 0 (2px only on interactive chips)   |
| Drop shadows                   | Rules and negative space                   |
| Masonry card grid              | An index table + margin preview            |
| Centered hero + portrait card  | Left-aligned ident block + a plotted figure |

If a change needs a gradient, a blur, or a shadow to work, it is the wrong
change.

## Color

Six values. Cool bone paper, cool near-black ink, one flat ultramarine.
Deliberately **not** warm cream — this is drafting stock, not book stock.

Every text tier clears 4.5:1 against **both** `bg` and `surface`. `faint` is the
quietest text on the page but it still carries information — rail labels, table
heads, row numbers — so it is held to the body-copy floor rather than treated as
decoration. The first draft of this palette had `faint` at 2.8:1; if you retune
these, re-measure rather than eyeballing.

### Light (default)

| Token       | Hex       | RGB           | On `bg` | Use                              |
| ----------- | --------- | ------------- | ------- | -------------------------------- |
| `bg`        | `#EFF0EC` | `239 240 236` | —       | Page ground                      |
| `surface`   | `#E7E9E3` | `231 233 227` | —       | Insets, blocks, hover fill       |
| `ink`       | `#16181A` | `22 24 26`    | 15.6:1  | Primary text, rules              |
| `muted`     | `#484D53` | `72 77 83`    | 7.5:1   | Body secondary, table cells      |
| `faint`     | `#60676E` | `96 103 110`  | 5.0:1   | Labels, captions, row numbers    |
| `accent`    | `#1B34E8` | `27 52 232`   | 6.8:1   | Signal: links, active, Fig. 1    |

### Dark

The negative of the same sheet — not a different design.

| Token       | Hex       | RGB           | On `bg` |
| ----------- | --------- | ------------- | ------- |
| `bg`        | `#101214` | `16 18 20`    | —       |
| `surface`   | `#181B1E` | `24 27 30`    | —       |
| `ink`       | `#EDEEEA` | `237 238 234` | 16.1:1  |
| `muted`     | `#B2B8BE` | `178 184 190` | 9.4:1   |
| `faint`     | `#7E858D` | `126 133 141` | 5.0:1   |
| `accent`    | `#5C74FF` | `92 116 255`  | 4.8:1   |

`overlay` stays as-is (black in light, white in dark) so hairlines and hover
fills flip with the theme. **Rules are `overlay` at 0.14 (hairline) or 0.28
(structural).** Nothing between.

## Type

Three faces, three jobs. No face does two jobs.

| Role                    | Family           | Tailwind        | Notes                              |
| ----------------------- | ---------------- | --------------- | ---------------------------------- |
| Display / headings      | Spectral         | `font-display`  | 400 + 600. Tight leading, no tracking-tight below 3xl. |
| Body / prose            | Inter            | `font-sans`     | 400/500/600                        |
| Data, labels, numbers   | IBM Plex Mono    | `font-mono`     | 400/500. **Everything small is mono.** |

The mono is the datasheet's voice and should be visible everywhere: section
numbers, eyebrows, table headers, tags, periods, stat values, captions and
the footer.

### Scale

| Name      | Size / leading         | Face    | Use                       |
| --------- | ---------------------- | ------- | ------------------------- |
| `hero`    | `clamp(2.75rem,7vw,5.5rem)` / 0.98 | display | The one H1     |
| `title`   | `clamp(1.75rem,3.5vw,2.75rem)` / 1.08 | display | Section H2   |
| `sub`     | `1.25rem` / 1.45       | display | Lead paragraphs           |
| `body`    | `0.9375rem` / 1.65     | sans    | Prose                     |
| `label`   | `0.6875rem` / 1.2, `tracking-[0.14em]`, uppercase | mono | Rail labels, table heads |
| `data`    | `0.8125rem` / 1.4      | mono    | Cell values, tags, meta   |

Use `.u-label` and `.u-data` from `index.css` rather than re-typing these.

## Layout — the rail

Every section is a two-column measured grid. This repeats down the whole page
and is the thing that makes it read as one document.

```
│◀──────────────── container 1280px ────────────────────────────────▶│
┌────────────┬───────────────────────────────────┬──────────────────┐
│ §02        │  Selected work                    │                  │
│ WORK       │                                   │  PREVIEW         │
│            │  ┌────┬───────────┬──────┬──────┐ │  ┌────────────┐  │
│ (mono,     │  │ №  │ NAME      │ LANG │ TAGS │ │  │ screenshot │  │
│  sticky at │  ├────┼───────────┼──────┼──────┤ │  │  of hovered │  │
│  top-28)   │  │ 01 │ Cp-Card   │ JS   │ HTML │ │  │    row     │  │
│            │  │ 02 │ Action    │ JS   │ LLM  │ │  └────────────┘  │
└────────────┴───────────────────────────────────┴──────────────────┘
    176px                    1fr                        320px
```

- Grid: `lg:grid-cols-[176px_1fr]`, `gap-x-10`. Below `lg`, the rail collapses
  to a single horizontal line above the content.
- The container is 1280px because the work table plus a legibly-sized preview
  needs it. At 1160 the preview was 200px and the screenshots were unreadable.
- The rail is `position: sticky; top: 7rem` on `lg+` so the section number
  tracks with the reader. It is the wayfinding — that is why the nav does not
  need a scroll-spy pill.
- Every section is separated by a **full-bleed hairline**, not by padding alone.
- Section padding: `py-20 lg:py-28`. Never more, never less.

## Signature

**Fig. 1** — the plotted Lissajous figure on the identification plate. A scope
draws an XY figure when fed two related signals, so it is instrument vernacular
rather than ornament, and it carries no numbers or axis labels, so it asserts
nothing that would have to be true.

Everything else stays quiet so this reads.

### What is deliberately NOT here

§01 once carried a block diagram of the NPCI pipeline — ordered stages, directed
wires, a signal travelling them. **It was removed on purpose.** A public
portfolio is the wrong place to publish an employer's internal architecture. The
technologies stay, because a tech list is ordinary resume material; the shape of
the system does not.

If you are tempted to re-add arrows, ordering, or stage names to
`StackTable.tsx`, that is the line being crossed.

## Motion

Three behaviours, total.

1. **Rule draw** — on section entry, the section's hairline scales from
   `scaleX(0)` to `1`, `transform-origin: left`, 600ms. Nothing fades in.
   Content is present on load; only the rule animates.
2. **Fig. 1** — the arc sweeping the figure and the plotting head riding its
   leading edge. Both are CSS (`stroke-dashoffset`, `offset-distance`) on a
   shared 9s linear cycle, so they composite off the main thread and stay in
   phase without a JS ticker. The dash pattern sums to exactly one path length;
   that is what keeps the head locked to the arc.
3. **Row hover** — a work-table row shows its screenshot in the right margin
   and an accent bar on the left. 150ms, no lift, no scale.

Anything not on this list does not animate. No stagger, no parallax, no
magnetic buttons, no tilt, no fade-up on every element.

`<MotionConfig reducedMotion="user">` stays in `App.tsx`; CSS animations get an
explicit `prefers-reduced-motion` block.

## Component rules

- **Radius**: `0` everywhere. Exception: `2px` on chips, inputs and buttons so
  they read as interactive. Nothing is ever a pill or a circle except the
  portrait and the status dot.
- **Borders**: `1px solid rgb(var(--c-overlay)/0.14)`. Structural dividers use
  `/0.28`. Never a colored border except on `:focus-visible`.
- **Buttons**: square, 1px rule, mono label, uppercase, `tracking-[0.08em]`.
  Primary is a solid ink fill with paper text. No shadow, ever.
- **Focus**: `outline: 2px solid accent; outline-offset: 2px`. Visible on
  everything. Never removed.
- **Tables**: hairline row rules only — no vertical rules, no zebra except on
  hover. Numeric columns use `font-variant-numeric: tabular-nums`.
- **Images**: square corners, 1px rule, no shadow.

## Quality floor

Not optional, not negotiable:

- Responsive to 360px with no horizontal overflow.
- Visible keyboard focus on every interactive element.
- `prefers-reduced-motion` honoured by all three motion behaviours.
- Light and dark both fully designed — dark is not an afterthought tint.
- Contrast: body text ≥ 4.5:1, large text ≥ 3:1, in both themes.
- No invented facts. Every number on the page already exists in `src/data/`.
