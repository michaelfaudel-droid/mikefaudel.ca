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
  components/patterns/     Composed pieces: CaseStudyCard, WorkGrid, ExperienceRow
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
and in the grids automatically:

```yaml
title: "Project title"
summary: "One sentence."
company: "Company"
role: "Product Designer"
year: "2025"
tags: ["Tag"]
tint: "blue" # blue | purple | green | brown | red
order: 5
```
