# mikefaudel.ca

Portfolio site built with [Astro](https://astro.build), deployed to Cloudflare Pages.

## Commands

| Command            | What it does                                 |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Local dev server at http://localhost:4321    |
| `npm run build`    | Build the static site to `dist/`             |
| `npm run lint:css` | Check styles follow the design system        |
| `npm run check`    | Lint, then build (what CI should run)        |
| `npm run format`   | Format all files with Prettier               |

## Structure

```
src/
  styles/tokens.css        Design tokens: the only place raw values live
  styles/global.css        Base element styles
  components/ui/           Primitives: Button, Tag, Container, SectionHeading
  components/patterns/     Composed pieces: CaseStudyFeature, WorkStack, ExperienceRow
  layouts/BaseLayout.astro Page shell: head, header, footer
  content/work/*.mdx       One file per case study
  pages/                   Routes (URLs match the old Framer site)
  pages/styleguide.astro   Living styleguide at /styleguide (noindex)
```

## Design system rules

1. **Tokens first.** Colours, font sizes, spacing, radii and motion come from
   `src/styles/tokens.css`. Stylelint rejects hex/rgb colours, px spacing and raw
   font sizes anywhere else.
2. **Semantic over primitive.** Components use `--color-text-muted`, not
   `--gray-300`. Add a semantic token rather than reaching for a primitive.
3. **Reuse before you build.** Check `/styleguide` for an existing component first.
   New components go in `ui/` (generic) or `patterns/` (portfolio-specific).
4. **Document as you go.** Every new token or component gets a sample on
   `/styleguide`.

## Adding a case study

Create `src/content/work/<slug>.mdx` with this frontmatter. It appears at `/work/<slug>`
and in the case study stacks automatically:

```yaml
title: "Full page title"
cardTitle: "Shorter title for the card"
summary: "One or two sentences."
company: "Company"
role: "Product Designer"
duration: "2024 – 2025"
cover: "../../assets/work/<slug>/cover.png"
coverAlt: "What the cover image shows"
tint: "blue" # page header colour: blue | purple | green | brown | red
glow: "blue" # card glow: green | orange | blue
order: 5
featured: true # set false to hide it from the home page (still on /work)
stats:
  - { value: "90%", label: "Stat label" }
  - { value: "2x", label: "Another stat" }
```

## Hidden pages

`src/pages/_consulting.astro` is the Services page, kept but not published (Astro skips
files starting with `_`). To bring it back, rename it to `consulting.astro` and add
`{ href: "/consulting", label: "Services" }` to the links in `src/components/SiteHeader.astro`.
