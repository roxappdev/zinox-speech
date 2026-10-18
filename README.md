# Zinox Speech — Free AI Text to Speech, 100% in Your Browser

An SEO-optimized English landing page with a **fully working in-browser text-to-speech demo**, built with **Next.js 16 + Tailwind CSS 4 + shadcn/ui**. All speech synthesis runs locally on the user's device via WebAssembly or WebGPU.

No servers, no API keys, no uploads — the neural engine (~90 MB) is downloaded once, cached by the browser, and all synthesis happens locally on your own hardware.

---

## ✨ What's inside

### Landing page (single `/` route)

| Section | Description |
|---|---|
| Header | Sticky navigation with anchor links to all sections |
| Hero | Animated equalizer, key stats, primary CTAs |
| Live TTS demo | Real speech synthesis in the browser (see below) |
| Features | 6 benefit cards (privacy, WebGPU, voices, free, offline, WAV export) |
| How it works | 3 steps + 6 use cases |
| FAQ | 8 items, shadcn accordion |
| Footer | Brand and navigation |

### TTS demo (`src/components/landing/tts-demo.tsx`)

- 16 curated voices with quality grades (A → C) grouped by accent/gender
- Speed slider (0.5×–1.5×), device switch **WASM (INT8, ~90 MB)** / **WebGPU (FP32, ~330 MB)**
- Long-text handling: sentence chunking (280 chars) with seamless audio stitching
- Engine download progress, canvas waveform visualization with playback progress
- RTF (real-time factor) performance badge, WAV file export

### SEO

- Metadata in `src/app/layout.tsx`: title, description, keywords, canonical, robots directives, OpenGraph + Twitter cards, `metadataBase`
- `sitemap.ts`, `robots.ts`, `manifest.ts`, `icon.svg`, dynamic `opengraph-image.tsx` (1200×630 via `next/og`)
- JSON-LD structured data in `page.tsx`: `SoftwareApplication` + `FAQPage`
- Semantic HTML with a clean heading hierarchy (1×h1, 5×h2, …)

---

## 🚀 Quick start

Requirements: **Node.js 20+**. No database, no backend services, no environment variables — the project is fully self-contained.

```bash
# 1. Install dependencies
npm install

# 2. Development server
npm run dev        # → http://localhost:3000

# 3. Static production build (outputs to ./out)
npm run build
npm run preview    # serves ./out locally on http://localhost:3000
```

> ⚠️ **Serve over HTTP(S), never open via `file://`** — the AI runtime and model downloads require a normal HTTP origin. First generation downloads ~90 MB of weights; afterwards they are cached by the browser and work offline.

---

## 📁 Project structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (sections + JSON-LD)
│   │   ├── layout.tsx            # Metadata, OG, Twitter, canonical
│   │   ├── sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.svg
│   │   └── globals.css           # Tailwind 4 theme tokens
│   ├── components/landing/       # header, hero, tts-demo, features,
│   │                             # how-it-works, faq, footer
│   └── lib/site.ts               # Brand, URL, voices, FAQ, samples
├── screenshots/                  # QA screenshots (desktop/mobile/generation)
├── package.json bun.lock         # Bun lockfile (npm/yarn work too)
└── README.md
```

---

## 🎨 Customization

- **Brand / copy / voices / FAQ / samples** → `src/lib/site.ts` (single source of truth; `SITE_URL` defaults to `https://zinoxspeech.com` — replace with your domain or set `NEXT_PUBLIC_SITE_URL`)
- **Colors / theme** → CSS variables in `src/app/globals.css`
- **Sections** → `src/components/landing/*.tsx`
- **Voices** → add/remove entries in `VOICES`

## 🌍 Deploying to GitHub Pages

The project builds to a fully static site (`output: "export"`), so it is hosted on
GitHub Pages at **https://zinox.org/**.

1. Push the repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The included workflow `.github/workflows/deploy.yml` builds and publishes `out/` on
   every push to `main`.

Because the site uses a **custom root domain**, the build runs with an empty base path,
and the workflow writes `CNAME` (zinox.org) plus `.nojekyll` into the artifact.

If you ever host it under a project sub-path (`https://<user>.github.io/<repo>/`) instead,
set `NEXT_PUBLIC_BASE_PATH=/<repo>` before building.

Local production build that mirrors the deployment:

```bash
NEXT_PUBLIC_BASE_PATH="" \
NEXT_PUBLIC_SITE_URL=https://zinox.org \
npm run build
```

## 🌐 Browser support

Chrome, Edge, Firefox and Safari. The engine runs on the CPU through WebAssembly, so no
special hardware or browser flags are required. Mobile browsers are supported; the first
engine download is Wi-Fi-friendly (~90 MB).

## 📸 QA

End-to-end verified in a headless browser: full generation pipeline, WAV download, FAQ accordion, mobile layout at 390 px, zero console errors. See `screenshots/`.

## 📄 Licenses

All third-party libraries used by this project are distributed under permissive, open-source licenses.