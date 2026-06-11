# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Wilder House** (`forsythparkvacationrentals.com`) — A static vacation rental website for a historic 1898 property in Savannah, Georgia. Built with:
- **Hosting**: Cloudflare Pages (serves HTML/assets)
- **Workers**: Cloudflare Workers (_worker.js handles routing and special endpoints)
- **Deployment**: Wrangler CLI (`npx wrangler pages deploy`)
- **Architecture**: Static HTML files with embedded JavaScript, no build step

## Key Files & Architecture

### Core Deployment Files
- **`_worker.js`** — Cloudflare Worker entry point. Handles:
  - `/ical-proxy` endpoint (fetches Airbnb calendar with security checks)
  - Falls through to `env.ASSETS.fetch()` for all other requests (static files)
  - No custom routing needed; relies on Pages file structure

- **`_headers`** — Cloudflare Pages response headers. Sets:
  - CSP (Content-Security-Policy) with required domains
  - Cache-Control directives per file type (HTML: no-cache, assets: long-lived)
  - Security headers (HSTS, X-Frame-Options, etc.)
  - **Critical**: CSP must allow APIs used by pages (open-meteo, sunrise-sunset, elevenlabs, mapbox, etc.)

- **`_redirects`** — URL rewrite rules. Handles:
  - Clean URLs: `savannah-day-planner.html` → `/savannah-day-planner`
  - Catch-all rule: `/*.html /:splat 301` strips .html extensions
  - Legacy redirects for old URLs

### Page Structure
- **HTML pages**: Root-level `.html` files (e.g., `savannah-day-planner.html`, `right-now-savannah.html`)
- **Assets**: Images (`.webp`), icons, audio files in root directory
- **Functions**: `/functions/ical-proxy.js` — single Cloudflare Function (legacy, handled by Worker now)

### Interactive Tools (Full-Stack HTML Pages)
- **`savannah-day-planner.html`** — Real-time activity planner (32 activities, weather-based scoring)
- **`right-now-savannah.html`** — Real-time "best thing to do right now" with mood filters
- **`savannah-ghost-tour.html`** — GPS-enabled interactive tour with audio narration (Leaflet map, ElevenLabs)
- **`submit-review.html`** — Guest review submission form

## Deployment Workflow

> 🛑 **NEVER overwrite `index.html` with tour/landing/experiment content.**
> `index.html` is the vacation-rental homepage (~73 KB, contains the suites
> grid, booking links, and full schema). It has twice been gutted by sessions
> pasting other content into it, then pushed live by a deploy. If a task needs a
> new page, create a NEW `.html` file — do not repurpose `index.html`.

### Deploy Changes
```bash
# PREFERRED: guarded deploy — refuses to publish a gutted homepage, then pins --branch=main
pwsh ./deploy.ps1
```
The `deploy.ps1` wrapper validates that `index.html` is still the real homepage
(>50 KB and contains the suites/booking markers) before uploading. Always prefer
it over a raw `wrangler` call. If you must deploy manually, first confirm the
homepage is intact:
```bash
curl -sL https://forsythparkvacationrentals.com/ | grep -c "Our Suites"   # must be >= 1
```
```bash
# Raw deploy (only if you've verified index.html yourself)
npx wrangler pages deploy . --project-name=thewilderhouse --branch=main --commit-dirty=true
```
- Uploads all files (caches unchanged ones)
- Recompiles Worker bundle

> ⚠️ **CRITICAL — deploying from a git worktree / feature branch:**
> Wrangler tags the Pages deployment with the **current git branch name**. The
> production site (`forsythparkvacationrentals.com`) only serves the **`main`**
> branch deployment. If you deploy from any other branch (e.g. a
> `claude/...` worktree branch), it creates a **preview** deployment that is
> gated behind Cloudflare Access (a login page) and the live site does **not**
> change. Always force production explicitly:
> ```bash
> npx wrangler pages deploy . --project-name=thewilderhouse --branch=main --commit-dirty=true
> ```
> Verify it actually went live by curling production (bypasses browser/SW cache):
> ```bash
> curl -sL https://forsythparkvacationrentals.com/savannah-day-planner | grep -c "<marker you just added>"
> ```
- Cloudflare Pages serves updated assets immediately

### Deploy with GitHub Integration
The site **does NOT** use GitHub auto-deployment. All 327+ deployments are manual via Wrangler.

### Debugging Deployments
```bash
# Check current git status
git status

# Push to GitHub for version control (doesn't auto-deploy)
git push origin main

# Deploy to live site (always pin --branch=main for production — see warning above)
npx wrangler pages deploy . --project-name=thewilderhouse --branch=main --commit-dirty=true
```

## Common Development Tasks

### Add a New Page/Tool
1. **Create HTML file** in root: `your-tool.html` (with proper `<meta>` tags, CSP awareness)
2. **Update CSP in `_headers`** if the page uses external APIs
3. **Add to `_redirects`** if custom routing needed (usually not—catch-all handles it)
4. **Link from main site** (`index.html`) in navigation
5. **Deploy**: `npx wrangler pages deploy . --project-name=thewilderhouse --branch=main --commit-dirty=true`

### Update CSP Headers
Edit `_headers` file — add new domains to:
- `script-src` for external scripts
- `style-src` for stylesheets (e.g., fonts.googleapis.com)
- `connect-src` for API calls (e.g., api.open-meteo.com, static.cloudflareinsights.com)
- `font-src` for web fonts (e.g., fonts.gstatic.com)
- `frame-src` for iframes

**Deploy after changes**: `npx wrangler pages deploy`

### Fix 404 Errors on New Pages
If a new page returns 404:
1. Verify file is in root directory as `.html`
2. Check `_redirects` for conflicting rules
3. Hard refresh browser (Ctrl+Shift+R) to clear service worker cache
4. Redeploy with Wrangler

### Service Worker Caching Issues
If changes don't appear after deployment:
- **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Private/incognito mode**: No service worker cache
- **Clear site data**: DevTools → Application → Storage → Clear Site Data

## External APIs & Dependencies

### Required for Live Features
- **Open-Meteo** (`api.open-meteo.com`) — Real-time weather data (no auth needed)
- **Sunrise-Sunset** (`api.sunrise-sunset.org`) — Solar timing, golden hour
- **ElevenLabs** (`api.elevenlabs.io`) — Text-to-speech for tour narration
- **Mapbox** (`api.mapbox.com`, tile servers) — Interactive maps
- **Google Analytics** — Site analytics
- **Cloudflare Web Analytics** (`static.cloudflareinsights.com`) — Performance monitoring

### CSP Whitelisting
All APIs must be explicitly allowed in `_headers` CSP directives or pages will fail silently (requests blocked by browser).

## Important Patterns

### Clean URLs
The `/*.html /:splat 301` rule in `_redirects` automatically strips `.html` extensions. No special configuration needed for new pages—just name them with `.html` extension and they're accessible as `/pagename`.

### Embedded JavaScript
Pages use inline `<script>` tags with `'unsafe-inline'` (allowed by CSP). No build step or bundler—all code runs directly in browser.

### Responsive Design
Use CSS Grid/Flexbox. Mobile-first design with `clamp()` for responsive typography.

### Cloudflare Transform Rules
The site uses **Cloudflare Transform Rules** (in dashboard) to modify response headers separately from `_headers` file. If CSP conflicts occur, Transform Rules are applied after `_headers`, so check both:
1. `_headers` file (static asset CSP)
2. Cloudflare dashboard → Rules → Transform Rules (may override/add headers)

## Testing

### Local Preview
No local development server configured. All testing is on deployed site or via browser DevTools.

### Console Errors
- **CSP violations**: Red errors in console. Check `_headers` and Cloudflare Transform Rules.
- **404 on new pages**: Hard refresh or incognito mode to bypass service worker cache.
- **API failures**: Check network tab; verify domain in CSP.

## Git Workflow
```bash
git add <files>
git commit -m "Meaningful message"
git push origin main  # For version control (doesn't auto-deploy)
npx wrangler pages deploy . --project-name=thewilderhouse  # Deploy to live
```

## Next Steps for New Features
1. **Plan**: What page/tool, what APIs needed?
2. **Build**: Create `.html` file with all code inline
3. **Update CSP**: Add API domains to `_headers`
4. **Deploy**: `npx wrangler pages deploy`
5. **Test**: Hard refresh, check console, verify on mobile
6. **Commit**: Push to GitHub for version control

---

**Last Updated**: May 2026  
**Contact**: Travis (site owner, commercialgreenhousesforsale@gmail.com)
