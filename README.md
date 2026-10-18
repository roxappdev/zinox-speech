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

Requirements: **Node.js 20+** (or [Bun](https://bun.sh) 1.1+). No database, no backend services, no environment variables — the project is fully self-contained.

```bash
# 1. Install dependencies
npm install        # or: bun install

# 2. Development server
npm run dev        # → http://localhost:3000

# Production
npm run build
npm run start      # serves the standalone build
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

## 🌐 Browser support

Chrome/Edge 113+ (WebGPU acceleration), Firefox and Safari via WASM fallback. Mobile browsers supported; the first engine download is Wi-Fi-friendly (~90 MB).

## 📸 QA

End-to-end verified in a headless browser: full generation pipeline, WAV download, FAQ accordion, mobile layout at 390 px, zero console errors. See `screenshots/`.

## 📄 Licenses

All third-party libraries used by this project are distributed under permissive, open-source licenses.