# DESIGN.md — TYRIA LIGHTING Visual & Interaction System

## 1. Visual World & Philosophy
- **Principle**: *"Light is the only color."*
- The interface is an architectural darkroom and precision optical instrument. Surfaces are matte carbon-black (`#07080B`) or architectural paper-white (`#F5F6F8` in light mode) framed by 1px hairline technical grid lines. Saturation comes exclusively from illuminated LED surfaces (`--glow`) and engineering indicator accents (`#1E6FD9`).

## 2. Color Tokens
| Token | Dark Theme (Default) | Light Theme | Usage |
|---|---|---|---|
| `--bg-primary` | `#07080B` | `#F5F6F8` | Primary viewport canvas |
| `--bg-elevated` | `#0D0F14` | `#FFFFFF` | Cards, technical drawers, filter panels |
| `--bg-surface` | `#13161F` | `#ECEEF2` | Interactive controls, table headers, swatches |
| `--text-primary` | `#F3F5F8` | `#0B0D13` | Headings, key specifications |
| `--text-secondary` | `#949A8` (`#949BA8`) | `#4B5262` | Body copy, engineering notes |
| `--text-muted` | `#5E6573` | `#7A8294` | Coordinate labels, watermarks, units |
| `--border-hairline` | `rgba(255, 255, 255, 0.08)` | `rgba(11, 13, 19, 0.10)` | 1px structural grid & card borders |
| `--brand-blue` | `#1E6FD9` | `#1E6FD9` | Technical UI accents, active filter indicators |
| `--glow` | Dynamic (`#FFD9A0` at 3000K) | Dynamic (`#FFD9A0` at 3000K) | Driven by `GlowContext` (1600K–12000K) |

## 3. Typography
- **Display & Headings**: `'Space Grotesk', sans-serif` — geometric, architectural proportions (`tracking-tight`, `font-semibold` to `font-bold`).
- **Body & UI Copy**: `'Inter', sans-serif` — clean, high legibility for international engineers and buyers.
- **Technical Specs & Part Numbers**: `'JetBrains Mono', monospace` (`font-variant-numeric: tabular-nums`) — used for all item numbers (`TY-NT1617V24P10-Cx`), dimensions (`16×17 mm`), wattages, lumens, CCT values, and coordinate rulers.

## 4. Layout, Borders & Motion
- **Grid**: 12-column architectural grid (`max-w-[1440px]`), generous structural whitespace, exposed 1px hairline dividers instead of heavy drop shadows.
- **Photorealistic Diffused Glow**: Illuminated SVG strokes and borders use layered CSS `drop-shadow` / `box-shadow` with `--glow` (`0 0 8px var(--glow), 0 0 24px color-mix(in srgb, var(--glow) 45%, transparent)`).
- **Accessibility & Motion**: Respects `prefers-reduced-motion: reduce`; WCAG AA contrast across both dark and light themes; keyboard-navigable controls and drawers.
