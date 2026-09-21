# Performance & SEO — how this site is built

A study guide to every performance and SEO decision in this portfolio. The site is a
single hand-written `index.html` (static HTML + CSS + a few KB of vanilla JS), served by
GitHub Pages at `www.prashantshinde.in`.

Measured result (local, uncached): **~177 KB total first load · 12 requests ·
DOMContentLoaded ~20 ms**. On GitHub Pages' CDN with Brotli, real-world Largest
Contentful Paint (LCP) lands comfortably under 1 s.

---

## Part 1 — Performance

### The mental model: the critical rendering path

A browser can't paint text until it has (1) the HTML, (2) the CSS needed to lay it out,
and (3) — if text uses a web font — that font. Anything that blocks those steps delays
the first paint. Every decision below is about shortening that path and shrinking what
travels over it.

Three metrics worth knowing (Google's **Core Web Vitals**):

- **LCP (Largest Contentful Paint)** — when the biggest above-the-fold element (here, the
  `<h1>` or the hero photo) finishes rendering. Target < 2.5 s (we aim < 1 s).
- **CLS (Cumulative Layout Shift)** — how much content jumps around as it loads. Target < 0.1.
- **INP (Interaction to Next Paint)** — responsiveness to input. Trivial here (almost no JS).

---

### 1. No framework — vanilla static HTML/CSS/JS

React/Angular/Vue would ship 100–300 KB of JavaScript just to render what is essentially
static content, then make the browser parse and execute it before the page is interactive.
For a content page that's pure overhead.

- **What we did:** hand-written semantic HTML, plain CSS, ~2–4 KB of vanilla JS.
- **Why it wins:** no hydration, no runtime, no bundle. The HTML *is* the page.

### 2. Critical CSS is inlined; nothing render-blocking

An external stylesheet (`<link rel="stylesheet">`) is **render-blocking**: the browser
must fetch and parse it before painting. A round-trip to fetch a separate CSS file can
cost 100–300 ms.

- **What we did:** all CSS lives in a single `<style>` block in the `<head>`. Zero external
  CSS requests, zero render-blocking stylesheets.
- **Trade-off:** the CSS isn't cached separately across pages — irrelevant for a
  single-page site, and the whole HTML is tiny and compresses well.

### 3. Fonts: self-hosted, subset, variable, swap, preload

Web fonts are the classic hidden performance tax. Three problems and their fixes:

**a) Third-party connection cost.** Loading from `fonts.googleapis.com` needs a DNS
lookup + TLS handshake to *another origin* before the font even downloads.
→ **We self-host.** The `.woff2` files sit in `assets/fonts/` on the same origin. No
third-party connection.

**b) Downloading glyphs you never show.** Google's default files include Cyrillic, Greek,
Vietnamese, etc.
→ **We subset to `latin` only.** The download script (see below) keeps just the Latin
`@font-face` blocks. Two families (Fraunces display + Instrument Sans body) in **3 files,
~175 KB total** — and because they're **variable fonts**, those 3 files cover every
weight (400–700) plus italics and optical sizing, instead of one file per weight.

**c) Invisible text while the font loads (FOIT).**
→ **`font-display: swap`** tells the browser to render text immediately in a fallback
font, then swap to the web font when ready. Text is never invisible.

→ **`<link rel="preload" as="font">`** on the two most critical files (the display serif
and the body sans) so the browser starts fetching them in parallel with CSS parsing
rather than discovering them later.

```html
<link rel="preload" href="assets/fonts/fraunces-normal.woff2" as="font" type="font/woff2" crossorigin />
```
```css
@font-face {
  font-family: 'Fraunces';
  font-weight: 400 700;      /* one variable file, whole weight range */
  font-display: swap;
  src: url(assets/fonts/fraunces-normal.woff2) format('woff2');
}
```

**How the fonts were pulled** (reproducible): request the Google Fonts CSS with a browser
User-Agent (so it returns modern `woff2` URLs), parse out only the `/* latin */`
`@font-face` blocks, download each `.woff2` locally, and rewrite the `src:` to the local
path. `woff2` is already the most compressed web-font format, so no extra compression step
is needed.

### 4. Images: modern formats, right size, no layout shift, lazy below the fold

Images are usually the heaviest bytes on a page. Four techniques, all visible in the
project cards and hero:

**a) Modern formats with graceful fallback.** AVIF and WebP are dramatically smaller than
JPEG/PNG at the same quality. `<picture>` lets the browser pick the best one it supports
and fall back to the original.

```html
<picture>
  <source srcset="…/myphoto.avif" type="image/avif" />
  <source srcset="…/myphoto.webp" type="image/webp" />
  <img src="…/myphoto.png" width="272" height="332" … />
</picture>
```

Real savings from the conversion (done with the `sharp` library):

| Image        | Original | WebP  | AVIF |
|--------------|---------:|------:|-----:|
| Portrait     | 165 KB   | 13 KB | **8 KB** |
| Fynkestra    | 191 KB   | 26 KB | **17 KB** |
| Apcensys     |  83 KB   | 20 KB | **15 KB** |
| Rock-Paper…  |  74 KB   | 18 KB | **12 KB** |

**b) Resized to what's actually displayed.** Screenshots were capped at ~1100 px wide
(enough for a 2× retina render of a half-width card) instead of shipping full-res source.

**c) Explicit `width`/`height` → zero CLS.** When the browser knows an image's aspect
ratio *before* it loads, it reserves the exact space, so nothing jumps when the image
arrives. Every `<img>` has intrinsic dimensions, and the thumbnail containers use a fixed
`aspect-ratio: 16 / 10`.

**d) Lazy-load below the fold, prioritize the hero.**
- Project images: `loading="lazy"` + `decoding="async"` — they only download as you scroll near them.
- Hero photo: `fetchpriority="high"` and *not* lazy — it's the likely LCP element, so we want it early.

### 5. Icons are inline SVG (no icon font)

Icon fonts (Font Awesome, etc.) are an extra render-blocking request of tens of KB for a
handful of glyphs, plus accessibility quirks. Every icon here is a small inline `<svg>` —
zero extra requests, scalable, and colorable with `currentColor`.

### 6. JavaScript: tiny, dependency-free, deferred, and non-essential

- **~2–4 KB of vanilla JS**, no libraries.
- The main `<script>` sits at the **end of `<body>`**, so it never blocks rendering.
- It does three small things: theme toggle, an `IntersectionObserver` for scroll-reveal
  animations, and setting the footer year.
- **Graceful degradation:** a tiny inline script adds a `js` class to `<html>`, and the
  reveal animation's starting `opacity: 0` is scoped to `html.js`. So if JS ever fails or
  is disabled, all content is fully visible — the page never depends on JS to show content.

### 7. Cheap visual effects only (no `backdrop-filter`, GPU-friendly)

The earlier dark design used soft CSS gradient glows for atmosphere — deliberately **not**
`backdrop-filter: blur()`, which forces the GPU to re-composite everything behind it on
every scroll frame and is a common cause of jank on mobile. Animations are limited to
`transform`/`opacity` (compositor-friendly properties that don't trigger layout/paint).

### 8. No flash of the wrong theme

Theme is applied by a **synchronous inline script in the `<head>`, before first paint**,
reading the saved preference from `localStorage`. If it ran after render, you'd see a
flash of the default theme before it corrected — a classic dark-mode bug we avoid.

### 9. Respecting `prefers-reduced-motion`

Users who ask their OS to reduce motion get no scroll animations and instant reveals:

```css
@media (prefers-reduced-motion: reduce) {
  html.js .reveal { opacity: 1; transform: none; transition: none; }
  html { scroll-behavior: auto; }
}
```

### Performance checklist (copyable for future projects)

- [ ] No framework unless the app genuinely needs one
- [ ] Critical CSS inlined; no render-blocking `<link rel=stylesheet>`
- [ ] Fonts: self-hosted · subset · `woff2` · `font-display: swap` · preload the critical ones
- [ ] Images: AVIF/WebP via `<picture>` · resized to display size · explicit `width`/`height` · `loading="lazy"` below the fold · `fetchpriority="high"` on the LCP image
- [ ] Icons inline SVG, not an icon font
- [ ] JS deferred to end of body, minimal, no libraries; content works without it
- [ ] Avoid `backdrop-filter`; animate only `transform`/`opacity`
- [ ] Set the theme before first paint to avoid a flash
- [ ] Honor `prefers-reduced-motion`

---

## Part 2 — SEO

SEO here is "technical SEO": making the page easy for search engines and social platforms
to crawl, understand, and rank. (Content quality is the other half — that's on you.)

### 1. Semantic, well-structured HTML

Search engines infer meaning from tags, not just text.

- Exactly **one `<h1>`** (the hero headline), with `<h2>` section titles beneath it — a
  clean heading hierarchy crawlers use to outline the page.
- Real landmarks: `<nav>`, `<main>`, `<section>` (each with an `id`), `<article>` for each
  project, `<footer>`. This also directly helps accessibility (screen-reader landmarks),
  and mobile-friendliness + accessibility are themselves ranking signals.

### 2. The core meta tags

```html
<title>Prashant Shinde — AI-native full-stack engineer</title>
<meta name="description" content="… 7+ years across Atlassian, PayPal and Barclays …" />
<link rel="canonical" href="https://www.prashantshinde.in/" />
```

- **`<title>`** — the clickable headline in search results; put the strongest keywords first.
- **`meta description`** — the grey snippet under the title. Doesn't affect ranking
  directly, but a good one improves click-through.
- **`canonical`** — tells Google the one true URL for this page, so `www` vs apex vs
  trailing-slash variants don't get treated as duplicate content and split ranking.

### 3. Open Graph + Twitter Cards (social sharing)

These control the preview card when the link is shared on LinkedIn, X, Slack, WhatsApp, etc.
Without them you get an ugly, blank unfurl.

```html
<meta property="og:title" content="…" />
<meta property="og:description" content="…" />
<meta property="og:image" content="https://www.prashantshinde.in/…/myphoto.png" />
<meta name="twitter:card" content="summary_large_image" />
```

`og:image` should be an absolute URL. `summary_large_image` gives the big-image card style.

### 4. Structured data (JSON-LD `Person` schema)

A machine-readable description of *who this page is about*, in Google's preferred format
([schema.org](https://schema.org) via JSON-LD). It can power richer search features and
helps Google build its knowledge graph entry for you.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Prashant Shinde",
  "jobTitle": "Software Engineer",
  "worksFor": { "@type": "Organization", "name": "Atlassian" },
  "sameAs": ["https://github.com/prashantns9", "https://www.linkedin.com/in/prashantns9/"]
}
</script>
```

`sameAs` links your other authoritative profiles — a strong entity-disambiguation signal.

### 5. Descriptive `alt` text

Every meaningful image has `alt` (e.g. `alt="Fynkestra app screenshot"`). This is read by
screen readers, shown if an image fails, and indexed by image search. Purely decorative
SVG icons get `aria-hidden="true"` instead, so assistive tech and crawlers skip the noise.

### 6. Custom domain + HTTPS

Served over HTTPS on a custom domain (`CNAME` → `www.prashantshinde.in`). HTTPS is a
confirmed (light) ranking signal and a requirement for many browser features.

### 7. Mobile-friendliness

Google indexes the **mobile** version of pages first (mobile-first indexing). The layout is
fully responsive with a proper `<meta name="viewport">`, fluid `clamp()` typography, and
tested breakpoints — so the page Google actually ranks is the good one.

### 8. Speed is an SEO factor

Core Web Vitals (Part 1) feed directly into ranking. Fast, stable, responsive pages get a
ranking nudge and, more importantly, don't lose users to slow loads.

### SEO checklist (copyable)

- [ ] One `<h1>`, logical `<h2>`… hierarchy, semantic landmarks (`main`/`nav`/`section`/`footer`)
- [ ] Unique `<title>` (keywords first) + compelling `meta description`
- [ ] `<link rel="canonical">` to the single true URL
- [ ] Open Graph + Twitter Card tags, `og:image` as an absolute URL
- [ ] JSON-LD structured data (`Person`, `WebSite`, etc.) with `sameAs`
- [ ] Descriptive `alt` on content images; `aria-hidden` on decorative ones
- [ ] HTTPS + canonical domain
- [ ] Responsive with a correct `viewport` meta
- [ ] Fast Core Web Vitals

---

## Part 3 — How to verify (and keep it honest)

- **Chrome DevTools → Lighthouse:** run on the *deployed* URL (not localhost) for
  Performance, SEO, Accessibility, Best-Practices scores plus specific fixes.
- **DevTools → Network:** check total transferred bytes, request count, and that images
  are served as AVIF/WebP. Throttle to "Slow 4G" to feel real-world load.
- **DevTools → Performance / Web Vitals overlay:** inspect LCP, CLS, INP live.
- **View source:** confirm the CSS is inlined and the meta/JSON-LD are present.
- **[PageSpeed Insights](https://pagespeed.web.dev/)** and **[WebPageTest](https://webpagetest.org)**
  for field-like data and waterfalls.
- **Rich Results Test** (Google) to validate the JSON-LD.

## Possible future improvements

- **Subset fonts even further** with `pyftsubset` (glyph-level, not just language) — could
  shave the ~175 KB of fonts down significantly if you pin the exact characters used.
- **`sitemap.xml` + `robots.txt`** — minor for a one-pager, standard for multi-page sites.
- **Self-host or drop the logo SVGs** if any are large; inline the small ones.
- **HTTP caching headers** — GitHub Pages sets its own; a custom host lets you tune
  `Cache-Control` and immutable hashed asset names.
- **Minify** the HTML/CSS/JS on deploy (a build step) — GitHub Pages already gzips/brotlis,
  so the win is small, but it trims a few more KB.
