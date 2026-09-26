# MythCraft Website

Marketing landing page for **MythCraft: The Rise of Olympus**, the iOS crafting game where you rebuild Greek mythology from Chaos to the throne of Olympus.

## What this is

A static, dependency-free landing page (plain HTML/CSS/JS) built for the App Store launch. The visual identity is a 1:1 port of the app's **Olympus Day** theme (`Theme.swift` in the app repo): Aegean sky blues, ink-navy outlines, hard slab shadows, sun-gold CTAs, Lilita One display type over Nunito body.

Key sections:

- **Hero**: the app's title-screen key art with the arced logotype and App Store CTA.
- **How it plays**: the drag-two-things pitch with real recipes from the game's authored spine.
- **The Oracle's Table**: an interactive pocket edition of Chapter 1's crafting demo, including the Titanomachy clash overlay (with a reduced-motion fallback).
- **The Books**: the four-Book saga structure and the buy-once promise.
- **Codex marquee**: the illustrated chip set with authored lore lines on hover.
- **Promises**: premium/no-ads, privacy, and tone commitments.

## Run locally

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Assets

`assets/chips/` and `assets/art/` are exported from the app's asset catalog (`LifeCraft/Assets.xcassets` in the MythCraft repo). The app repo remains the source of truth; re-export from there when art changes.

## Deploying

The website is published at https://robsansom.github.io/MythCraft/ from
https://github.com/robsansom/MythCraft.

`.github/workflows/deploy.yml` publishes automatically when `main` is pushed.
It can also be run manually from the repository's Actions tab. GitHub Pages
must use **GitHub Actions** as its publishing source (Settings → Pages).

There is no build step. The workflow publishes only `index.html`, `assets/`,
`css/`, and `js/`. Relative asset paths support the `/MythCraft/` project URL.

To publish an update, commit the website changes and push `main` to `origin`.
A custom domain can be added later in Settings → Pages after its DNS is ready.
