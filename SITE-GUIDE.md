# mikefaudel.ca: site guide

Everything you need to pick this site up cold: where it lives, how it's built and
deployed, how to make common changes, and which decisions were deliberate. Written for
both people and AI coding tools. If you're an AI assistant, read this whole file before
changing anything, and follow "Before you finish a change" at the end.

Last updated: November 2026, at launch.

---

## 1. What this is

Mike Faudel's product design portfolio. It's a static site built with **Astro** (plus
MDX for case studies). It's hosted for free on **Cloudflare**, and the code is on
**GitHub**. It replaced a Framer site in November 2026, keeping the same URLs and content.

- Live site: https://www.mikefaudel.ca. This is the main address; `mikefaudel.ca` and
  `http://` both redirect to it.
- Preview copy: https://mikefaudel-ca.michaelfaudel.workers.dev. It's the same build,
  useful for checking a deploy.
- Code: https://github.com/michaelfaudel-droid/mikefaudel.ca. The repo is **public**, so
  never commit secrets.

## 2. Where everything lives

| What | Where | Account / notes |
|---|---|---|
| Code | GitHub, repo `michaelfaudel-droid/mikefaudel.ca`, branch `main` | Personal GitHub account `michaelfaudel-droid`. Don't use a work account. |
| Hosting | Cloudflare **Workers** (static assets), Worker named `mikefaudel-ca` | Free plan. Find it under Cloudflare dashboard → Compute (Workers) → Workers & Pages → mikefaudel-ca. |
| Deploys | **Workers Builds**, Cloudflare's GitHub integration | Builds and deploys automatically on every push to `main`. There's no manual deploy step. |
| DNS | Cloudflare, zone `mikefaudel.ca` | Nameservers `itzel.ns.cloudflare.com` and `pranab.ns.cloudflare.com`. |
| Domain registration | **Squarespace Domains** (formerly Google Domains; Tucows runs the registry side) | Renew there. Paid through **18 July 2027**, auto-renew on. Sign in with the personal Google account. |
| Search | Google Search Console, domain property `mikefaudel.ca` | Personal Google account. The sitemap is submitted. |
| Old site | Framer | Retired: domain removed, plan cancelled. The project may still exist on Framer's free plan, including an unpublished Etsy case study. |

There is no email on this domain. Contact goes to a Gmail address, shown on /contact.

## 3. Quick start

Requirements: Node 22.23+ (the repo's `.node-version` says 24) and npm.

```sh
git clone https://github.com/michaelfaudel-droid/mikefaudel.ca.git
cd mikefaudel.ca
npm install
npx astro dev --background   # dev server at http://localhost:4321 (see AGENTS.md)
npx astro dev stop           # stop it
npm run check                # lint styles + build; must pass before pushing
git push                     # deploys automatically (about 1–2 minutes)
```

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server. `npx astro dev --background` runs it in the background. |
| `npm run build` | Builds the static site into `dist/`. |
| `npm run lint:css` | Stylelint: enforces the design-system rules (section 6). |
| `npm run check` | Lint, then build. Run this before every push. |
| `npm run format` | Prettier on everything. |

## 4. How deploys work, and what to do when one fails

1. Push to `main`, and Cloudflare Workers Builds runs `npm install` and `astro build`.
2. The Worker serves `./dist` (see `wrangler.jsonc`).
3. You can see the build status on the GitHub commit (check name "Workers Builds:
   mikefaudel-ca") or in Cloudflare → the Worker → Deployments.

From the terminal:
```sh
gh api repos/michaelfaudel-droid/mikefaudel.ca/commits/<sha>/check-runs \
  --jq '.check_runs[0] | "\(.status) \(.conclusion)"'
```

**Known quirk:** builds occasionally fail or sit "queued" for no code reason, even when
the same commit builds fine locally. The fix that has always worked is an empty retry
commit, or **Retry build** in the Cloudflare dashboard:
```sh
git commit --allow-empty -m "Retry Cloudflare build" && git push
```

**Lockfile gotcha:** `package-lock.json` must point at the public npm registry
(`https://registry.npmjs.org/`). Cloudflare can't reach private or corporate mirrors. If
you run `npm install` on a machine with a different registry configured (the original
work laptop used a Microsoft mirror), rewrite the URLs before committing:
```sh
REG=$(npm config get registry)   # e.g. a corporate mirror; nothing to do if it's registry.npmjs.org
sed -i '' "s#${REG%/}/#https://registry.npmjs.org/#g" package-lock.json   # macOS sed; on Linux drop the ''
grep '"resolved"' package-lock.json | grep -vc 'registry.npmjs.org'      # must print 0
```
Astro is pinned to `7.4.2` because that mirror lagged behind. On a normal machine it's
fine to upgrade. Test with `npm run check` and look over the pages afterwards.

## 5. Repo map

```
astro.config.mjs        Site URL (www), sitemap, URL format (no trailing slash, .html files)
wrangler.jsonc          Cloudflare Worker config: serves dist/, uses 404.html for missing pages
public/                 Copied as-is to the site root:
  _redirects            301s for retired Framer URLs (Cloudflare reads this file)
  robots.txt            Allows everything; points to the sitemap
  og.jpg                Site-wide link-preview image (1200×630), made from scripts/og-image.html
  favicon.png, apple-touch-icon.png   Tab icon and phone home-screen icon
  mike-faudel-resume.pdf              The "Download resume" file on /about
  grain.png             Noise texture used by the animated background
scripts/og-image.html   Source for public/og.jpg (see section 7, "Preview image")
src/
  styles/tokens.css     ALL design tokens: the only place raw colours, sizes and so on live
  styles/global.css     Base element styles, heading sizes, .prose (case study text)
  layouts/BaseLayout.astro  <head> (title, description, canonical, previews, icons), header, footer, background
  components/
    SiteHeader.astro    Logo and nav links; hide-on-scroll behaviour
    SiteFooter.astro    "Get in touch", ©, LinkedIn and Contact links
    AmbientBackground.astro  Animated drifting circles and grain (canvas)
    ui/                 Generic pieces: Button, Container, SectionHeading, Tag, CopyButton, WordFlip, ShineChip
    patterns/           Portfolio pieces: CaseStudyFeature (card), WorkStack (stacking list), ExperienceCard
    content/            Blocks used inside case study MDX: Stats, Facts, Gallery, Quote, LogoTicker
  content.config.ts     Schema for case study front matter
  content/work/*.mdx    One file per case study (text and component blocks)
  data/experience.ts    Roles shown under "Experience" (Home uses `summary`, About uses `detail`)
  assets/               Images processed by Astro (resized and compressed at build)
    work/<slug>/        Case study images; customer logos are in work/copilot-studio/logos/
    brand/              logo.png (header outline logo), mark.png (three-colour mark)
    about/portrait.png, logos/ (company logos for Experience)
  pages/
    index.astro         Home: hero, word flip, case study stack, Experience; Person structured data
    work/index.astro    Work: case study stack, plus the expertise sentence with shine chips
    work/[slug].astro   Case study page template (all case studies share it)
    about.astro         About: portrait, intro, resume button, Experience
    contact.astro       Contact: email with Copy button, mail link, LinkedIn
    404.astro           Not-found page
    styleguide.astro    /styleguide: living reference of every token and component (noindex)
    _consulting.astro   Hidden Services page; the leading "_" means it isn't published
```

## 6. Design system rules

These are enforced by Stylelint and expected of every change:

1. **Raw values live only in `src/styles/tokens.css`.** No hex or rgb colours, px
   spacing or raw font sizes anywhere else; `npm run lint:css` rejects them.
2. **Components use semantic tokens** (`--color-text-muted`, `--space-md`,
   `--text-heading`), not primitives (`--gray-300`). If no semantic token fits, add one
   in tokens.css.
3. **Reuse before building.** Check `/styleguide` (run the dev server, then open
   http://localhost:4321/styleguide) for an existing component first.
4. **Every new token or component gets a sample on `/styleguide`.**
5. **Motion respects reduced motion.** Duration tokens drop to 0 under
   `prefers-reduced-motion`, and JS animations check it too. Keep it that way for new
   animations.

Key facts:
- **Fonts:** Lexend Deca for display (`--font-display`), Hanken Grotesk for body
  (`--font-sans`). Both are bundled via @fontsource, so there are no external font
  requests.
- **Colours:** dark theme only. Black background, near-white text, project tints,
  ambient palette, card glows.
- **Layout widths:**
  - `--width-feature` (63.5rem / 1016px) is the main page column used everywhere.
  - `--width-reading` (46rem) is the centred text column inside case studies.
  - The header stays wider (`--width-content`) on purpose.
- **Type scale:** `--text-display` (hero name, up to 130px), `--text-title` (case study
  titles and stats, up to 46px), `--text-heading` (h2, up to 38px), `--text-xl` (h3, up
  to 30px), `--text-reading` (case study body, 20px), and smaller sizes below those.

## 7. Common changes: where to make them

| Change | Where |
|---|---|
| Home tagline words (the flip) | `taglineWords` array near the top of `src/pages/index.astro`. It always lands on the `final=` word ("effortless"). |
| Speed of the word flip | Constants at the top of the script in `src/components/ui/WordFlip.astro` |
| About intro text | `src/pages/about.astro` |
| Resume | Replace `public/mike-faudel-resume.pdf`, keeping the same file name. |
| Experience (roles, dates, text) | `src/data/experience.ts` (`summary` shows on Home, `detail` on About) |
| Nav links | `links` array in `src/components/SiteHeader.astro` |
| Contact email | `email` in `src/pages/contact.astro` |
| Footer links | `src/components/SiteFooter.astro` |
| Case study text | `src/content/work/<slug>.mdx` |
| New case study | New `src/content/work/<slug>.mdx`, with images in `src/assets/work/<slug>/`. Front matter is described in README.md and `src/content.config.ts`. It appears on Home and Work automatically, ordered by `order`; set `featured: false` to show it on Work only. |
| Card title, summary, stats on a card | That case study's front matter (`cardTitle`, `summary`, `stats`) |
| Card glow / page header colour | Front matter `glow` (green, orange, blue) and `tint` (blue, purple, green, brown, red) |
| Customer logos (Copilot Studio) | `<LogoTicker>` block in `copilot-studio.mdx`, with files in `src/assets/work/copilot-studio/logos/`. Recolour new logos to the same grey (#A4A4A4) with transparent backgrounds. |
| Expertise sentence and chips (Work page) | Bottom of `src/pages/work/index.astro` |
| Colours, sizes, spacing | `src/styles/tokens.css`. Change the token, not the component. |
| Page titles and search descriptions | The `title` and `description` props on `<BaseLayout>` in each page. Case studies use their front matter `summary`. Default in `BaseLayout.astro`. |
| **Job change** | Update `person` (`jobTitle`, `worksFor`) in `src/pages/index.astro`, the descriptions mentioning Microsoft (Home, About, Contact, Work), `experience.ts`, the About text, the Work expertise sentence, and the resume. Search the repo for "Microsoft". |
| Preview image (link previews) | Edit `scripts/og-image.html`, then regenerate `public/og.jpg` with the commands in README.md ("Link-preview image"). |
| Hide or show a page | Prefix the file name with `_` to unpublish it. Remove its nav link, and add a 301 in `public/_redirects` if it was public. |
| Redirect an old URL | Add a line to `public/_redirects`: `/old /new 301` |

## 8. Interactive behaviour and where it lives

All of these are hand-written: no animation libraries.

| Behaviour | File | Notes |
|---|---|---|
| Animated background (soft drifting circles and grain) on Home, Work, Contact | `components/AmbientBackground.astro` | Canvas. Softness is drawn in (feathered gradients and masked edges) rather than with a CSS `blur()`, because iOS Safari skips large blurs and showed hard edges. Don't switch back to `filter: blur`. |
| Word flip in the home tagline | `components/ui/WordFlip.astro` | About 3.5s, once per full page load or refresh, not on client-side navigation back to Home. Lands on "effortless". The words share one grid cell so the layout never shifts. |
| Stacking case study cards (Home and Work) | `patterns/WorkStack.astro`, `patterns/CaseStudyFeature.astro` | CSS `position: sticky`, plus a small script that shrinks the cards behind (`--stack-shrink`). Off on short or narrow screens. Cards use `clip-path` so Safari clips the glow to the rounded corners. |
| Header hides on scroll down, returns on scroll up | `components/SiteHeader.astro` | Sticky; gets a blurred dark backdrop once scrolled. On phones the links have 44px+ tap targets and the current page is underlined. |
| Logo tilt on hover | `components/SiteHeader.astro` | Values copied from Framer. |
| About portrait fade-in and hover tilt; 👋 hover | `pages/about.astro` | |
| Customer logo ticker | `components/content/LogoTicker.astro` | 75px/s, loops seamlessly, pauses on hover, static under reduced motion. |
| Shine chips (Work page) | `components/ui/ShineChip.astro` | The sweep text is CSS-generated, so each keyword appears once in the page text. |
| Copy email button | `components/ui/CopyButton.astro` | Clipboard API with a fallback for older browsers. |

Page transitions use Astro's `<ClientRouter />`, so scripts initialise on the
`astro:page-load` event, not on plain page load. Follow that pattern for new scripts.

## 9. SEO and sharing

- **Canonical address:** `https://www.mikefaudel.ca`, set as `site` in `astro.config.mjs`.
  URLs have no trailing slash; `/work/` redirects to `/work`.
- **Sitemap:** `@astrojs/sitemap` generates `/sitemap-index.xml`, with the styleguide
  excluded. It's submitted in Search Console.
- **robots.txt:** `public/robots.txt`.
- **Search descriptions:** every page has its own description (see section 7).
- **Structured data:** a schema.org `Person` on the home page (name, job title, employer,
  LinkedIn). Update it on a job change.
- **Link previews:** `og:image` on every page. Main pages use `public/og.jpg`; case
  studies use their cover (`[slug].astro`). Apps cache previews, so use LinkedIn Post
  Inspector or add `?v=2` to test a change.
- **Retired URLs:** `public/_redirects` sends `/consulting` to `/about` and the Etsy case
  study to `/work`.
- **Hidden from search:** `/styleguide` and the 404 page (`noindex`).

## 10. Domain and Cloudflare settings (don't break these)

DNS records in Cloudflare (zone `mikefaudel.ca`):

| Record | Purpose | Touch it? |
|---|---|---|
| Worker custom domains `www.mikefaudel.ca` and `mikefaudel.ca` | Point the domain at the site. They're managed from the Worker's **Domains** tab, not the DNS page. | Leave as is |
| TXT `@` `google-site-verification=…` | Keeps Search Console access | **Never delete** |
| TXT `@` `v=spf1 -all`, TXT `_dmarc` (p=reject), TXT `_domainkey` (empty DKIM) | Tell email providers nobody sends mail from this domain, which stops spoofing | Keep. Only change them if you set up email on the domain. |

Other zone settings:
- **Redirect Rule "Root to www":** hostname equals `mikefaudel.ca`, dynamic redirect to
  `concat("https://www.mikefaudel.ca", http.request.uri.path)`, 301, keeps the query
  string. Find it under Rules.
- **Always Use HTTPS:** on (SSL/TLS → Edge Certificates).
- **Certificates** are issued and renewed automatically by Cloudflare.
- **DNSSEC** is off. If you ever turn it on, do it in Cloudflare.

To check what's live from a terminal, bypassing your local DNS cache:
```sh
dig +short @itzel.ns.cloudflare.com www.mikefaudel.ca
curl -sI --resolve www.mikefaudel.ca:443:172.64.80.1 https://www.mikefaudel.ca/ | head -3
```
(In zsh, write the `--resolve` flag inline, as above. Putting it in a `$VAR` doesn't
split into separate arguments.)

## 11. Decisions already made (don't undo without asking)

These came out of the launch review with Mike. They're deliberate, not oversights:

- **No hero buttons** on Home. Work is right below, and contact is in the nav and footer.
- **No "eyebrow" labels** above section headings. The experience heading is "Experience".
- **Visible nav links on mobile, not a hamburger.** There are only three links; the
  header hides on scroll instead.
- **The header stays wider** than the page column, while content aligns to the
  1016px column.
- **Stacking cards on both Home and Work** (the old grid card was removed). Home shows
  `featured` case studies; Work shows all of them.
- **The Services page is hidden** (`_consulting.astro`): it isn't useful while job
  hunting, and it could raise questions with an employer.
- **Contact is a page**, not a `mailto:` link, because mailto does nothing on machines
  without a mail app. The "Get in touch" animation was tried and removed.
- **The word flip always lands on "effortless"**, plays once per load, and takes about
  3.5s.
- **The logo ticker heading is "Used by"**, not "Customers", so it doesn't read as
  Mike's own clients. All logos are publicly announced Copilot Studio customers.
- **The Etsy case study was retired.** Its URL redirects to /work.
- **www is the canonical host.**

## 12. Known gaps and ideas (not done)

- Component Collections and Mix Versioning have no `duration`. Their pages hide it while
  the value is `"TODO"`.
- Case study image alt text was written from context during the migration and could use
  a review.
- Optional: Cloudflare Web Analytics (free, no cookie banner). Turn it on under zone →
  Analytics & Logs → Web Analytics.

## 13. Before you finish a change

1. `npm run check` passes (style lint and build).
2. Look at the change in the dev server at desktop width and at about 375px (phone): no
   sideways scrolling, and tap targets of 44px or more.
3. New tokens or components have a `/styleguide` sample.
4. If the lockfile changed, it points only at registry.npmjs.org (section 4).
5. Commit and push to `main`. Then confirm the Cloudflare build succeeded and check the
   change on https://www.mikefaudel.ca, or on the workers.dev preview if your DNS is
   cached.
