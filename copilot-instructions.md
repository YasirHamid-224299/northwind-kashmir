# Northwind Kashmir Project Instructions

## Project Purpose

Northwind Kashmir is a static tourism and travel-agency website for Kashmir, India. It promotes customized Kashmir tour packages, hotel stays, destination guides, Gulmarg Gondola information, trip planning, galleries, and WhatsApp-based travel enquiries.

There is no backend, database, authentication system, or frontend framework. The site is made of static HTML, generated CSS, vanilla JavaScript, local image assets, and third-party CDN resources.

## Technology Stack

- HTML pages at the repository root and in nested route directories.
- Tailwind CSS 3.4 with PostCSS and Autoprefixer.
- Vanilla JavaScript in `assets/js/main.js`.
- Google Fonts: Playfair Display, Inter, and Poppins.
- Font Awesome 6.5 and AOS 2.3 loaded from CDNs.
- CommonJS Node.js scripts in `scripts/`.
- Vercel deployment configured to serve the `dist/` directory.

## Important Files

- `package.json`: npm scripts and development dependencies.
- `package-lock.json`: locked dependency versions; use `npm ci` for setup.
- `tailwind.config.js`: Tailwind content scanning and custom font families.
- `postcss.config.js`: Tailwind and Autoprefixer configuration.
- `assets/css/input.css`: Tailwind entry file and shared component classes.
- `output.css`: generated CSS copied back to the repository root by the build.
- `assets/js/main.js`: shared browser behavior used across the site.
- `scripts/build.js`: copies assets and HTML into `dist/` and copies generated CSS.
- `scripts/generate-sitemap.js`: discovers HTML pages and writes `sitemap.xml`.
- `scripts/sync-layouts.js`: synchronizes the shared navigation and footer across pages.
- `scripts/generate-cluster-pages.js`: data and templates for package, destination, and Gondola guide pages.
- `scripts/generate-hotel-pages.js`: data and templates for hotel directory pages.
- `scripts/update-packages-nav-footer.js`: legacy targeted navigation/footer update script.
- `vercel.json`: sets `dist` as the deployment output directory.
- `robots.txt`: crawler rules and production sitemap location.
- `DESIGN_IMPROVEMENTS.md`: historical design notes and remaining UI suggestions.

## Page Organization

Root marketing pages:

- `index.html`
- `about.html`
- `contact.html`
- `gallery.html`
- `hotels.html`
- `packages.html`
- `gondola.html`

Nested SEO/content routes include:

- Tour packages: `kashmir-*-package/`, `gulmarg-tour-package/`, `pahalgam-tour-package/`, and `sonmarg-tour-package/`.
- Destination guides: `*-tourism/`.
- Hotel directories: `*-hotels/`.
- Gondola guides: `gondola-faq/`, `gondola-guide/`, `gondola-phase-1/`, `gondola-phase-2/`, `gondola-prices/`, `gulmarg-gondola-booking/`, and `gulmarg-gondola-tickets/`.
- Supporting pages: `plan-your-trip/`, `trip-stories/`, and `author/yasir-hamid/`.

Nested route pages normally use `index.html` and are published as directory URLs such as `/gulmarg-tourism/`.

## Shared JavaScript Behavior

`assets/js/main.js` initializes features conditionally after `DOMContentLoaded`, so pages can safely share the same script. Features include:

- Mobile menu toggle and Escape-key closing.
- Active navigation styling.
- Fade sliders for hero and secondary content.
- Gallery lightbox.
- Package category filtering.
- Contact forms that compose WhatsApp messages.
- AOS scroll animations.
- Exit-intent popup.
- Mobile sticky contact/action bar.
- Travel calculator, itinerary builder, and Gondola alert registration using `localStorage`.

The site uses WhatsApp rather than a server-side form submission. Preserve the existing phone number and message flow unless the task explicitly changes business contact details.

## Styling Conventions

- Shared Tailwind component classes are defined in `assets/css/input.css`.
- Main visual palette: dark navy `#0B1F3A`, gold `#D4AF37`, warm light background `#f8f5ee`, and neutral gray text.
- Use the existing classes such as `section-shell`, `section-title`, `section-copy`, `premium-card`, `premium-button`, `soft-panel`, `form-field`, and `site-nav` before inventing new patterns.
- Preserve the existing responsive, mobile-first approach.
- Use `font-display` for major headings, `font-sans` for body text, and `font-accent` for calls to action.
- Avoid broad formatting changes to generated or shared markup when a focused edit is sufficient.

## Build and Development Workflow

Initial setup:

```bash
npm ci
```

Build production output:

```bash
npm run build
```

This runs Tailwind, regenerates the sitemap, copies files to `dist/`, and updates the root `output.css`.

Watch Tailwind during styling work:

```bash
npm run watch
```

Generate only the sitemap:

```bash
npm run generate-sitemap
```

The `npm run build` pipeline regenerates cluster and hotel pages, synchronizes shared navigation/footer layouts, rebuilds Tailwind CSS, regenerates the sitemap, and copies the site into `dist/`. When changing generator data/templates or shared navigation/footer, use the normal build so the published output remains reproducible.

There is currently no real test suite. `npm test` intentionally exits with an error because no tests are defined. Validate changes with the production build, HTML inspection, and browser checks when available.

## Editing Rules for AI

1. Inspect the nearest owning file before editing. Keep changes focused on the requested page, shared component, generator, or script.
2. Determine whether the target page is hand-authored or generated before changing it.
3. If a change belongs to all pages, update the source of truth in `scripts/sync-layouts.js`, `assets/css/input.css`, or `assets/js/main.js` instead of manually editing many generated pages.
4. If changing generated page content, update the relevant data/template script and regenerate pages so the source remains reproducible.
5. Preserve SEO metadata, canonical URLs, Open Graph tags, JSON-LD, accessibility attributes, and mobile navigation behavior.
6. Use root-relative paths such as `/output.css`, `/assets/...`, and `/assets/js/main.js` for nested pages. Root pages may use paths relative to the root.
7. Do not add a framework or backend for a small content or styling task.
8. Do not commit changes automatically.
9. Do not alter business claims, ratings, licensing information, contact details, prices, or hotel facts without explicit confirmation or a reliable source.
10. After edits, run the narrowest useful validation first, then run `npm run build` when dependencies are installed.

## Known Risks and Checks

- Dependencies may be absent; run `npm ci` before diagnosing a missing `tailwindcss` command.
- `output.css` is generated. Do not make manual CSS changes there unless specifically requested; edit `assets/css/input.css` instead.
- Shared layout synchronization can overwrite manual navigation/footer changes in HTML files.
- Active-nav matching may not correctly recognize every nested directory URL because the script compares pathname segments with `.html` links.
- Some content uses custom-looking Tailwind classes such as `text-gray-650` or `border-gray-150`; verify that a class is generated before relying on it.
- CDN dependencies require network access and are not integrity-pinned.
- `localStorage`-backed planner data can be affected by corrupted browser storage.
- Check nested-page asset paths carefully. A page can render HTML while silently failing to load CSS, JavaScript, or images.
- Verify responsive behavior at mobile, tablet, and desktop widths after navigation, form, layout, or typography changes.

## Deployment Model

Vercel deploys the contents of `dist/`. A production deployment should therefore follow this order:

1. Install locked dependencies with `npm ci`.
2. Run any required page generators and `node scripts/sync-layouts.js`.
3. Run `npm run build`.
4. Confirm the generated `dist/` contains all root pages, nested routes, assets, `output.css`, `robots.txt`, and `sitemap.xml`.

The production site referenced by metadata and crawler files is `https://www.northwindkashmir.com`.
