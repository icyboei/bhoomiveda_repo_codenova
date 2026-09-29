# BhoomiVeda — Vanilla HTML / CSS / JS

This is the **plain HTML + CSS + JavaScript** version of the original React
project. Every page/feature has its own folder with three files:

```
bhumiveda-vanilla/
├── index.html             ← root redirect → home/index.html
├── README.md
├── assets/                ← logo, hero image, favicon
│
├── shared/                ← code reused on every page
│   ├── shell.css          ← global styles, fonts, animations
│   ├── shell.js           ← partial loader + dark-mode toggle
│   ├── data.js            ← all dummy data and constants
│   ├── config.js          ← put your Google Maps API key here
│   └── tailwind-config.js ← enables Tailwind dark-mode via class
│
├── navbar/                ← top bar (title, dark toggle, notifications)
│   ├── navbar.html
│   ├── navbar.css
│   └── navbar.js
│
├── sidebar/               ← left navigation column
│   ├── sidebar.html
│   ├── sidebar.css
│   └── sidebar.js
│
├── ai-assistant/          ← floating green chat button
│   ├── ai-assistant.html
│   ├── ai-assistant.css
│   └── ai-assistant.js
│
├── home/                  ← Dashboard page
│   ├── index.html
│   ├── home.css
│   └── home.js
│
├── ai-crop/               ← AI Crop Advisor (form + recommendations)
│   ├── index.html
│   ├── ai-crop.css
│   └── ai-crop.js
│
├── community/             ← Farmer community feed
│   ├── index.html
│   ├── community.css
│   └── community.js
│
├── schemes/               ← Government schemes list + filter
│   ├── index.html
│   ├── schemes.css
│   └── schemes.js
│
├── profile/               ← User profile + edit modal
│   ├── index.html
│   ├── profile.css
│   └── profile.js
│
└── services/              ← GPS + weather fetchers (used by ai-crop)
    ├── location.js
    ├── weather.js
    └── fetchFarmAutoData.js
```

## What each folder is for

| Folder         | What's inside                                                              |
|----------------|----------------------------------------------------------------------------|
| `assets/`      | Static images (logo, favicon, hero)                                        |
| `shared/`      | Site-wide CSS, JS, data, and configuration. Loaded by every page.          |
| `navbar/`      | Reusable top bar. Loaded into every page via `data-include`.               |
| `sidebar/`     | Reusable left navigation. Highlights active link from `<body data-page>`. |
| `ai-assistant/`| Floating chat button shown on every page.                                  |
| `home/`        | Dashboard widgets, weather card, market chart, profit chart.               |
| `ai-crop/`     | The big crop-recommendation form + AI result cards.                        |
| `community/`   | Post feed, post composer, trending topics, leaderboard.                    |
| `schemes/`     | Government schemes list with category filter + search.                     |
| `profile/`     | Farmer profile, productivity stats, achievements, edit modal.              |
| `services/`    | Browser-based GPS lookup + Google Weather API helpers.                     |

## How to run in VS Code

This project is **100% static** — no build step, no `npm install`. You only
need a local web server (browsers block `fetch()` on `file://` URLs, which
breaks the partial loader).

### Easiest: VS Code Live Server

1. Open the `bhumiveda-vanilla/` folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions
   panel.
3. Right-click `index.html` → **Open with Live Server**.
4. Your browser opens at `http://127.0.0.1:5500/` and you'll be redirected to
   the Dashboard.

### Alternative: built-in Python server

```bash
cd bhumiveda-vanilla
python3 -m http.server 8000
```
then open <http://localhost:8000>.

### Alternative: Node `npx`

```bash
cd bhumiveda-vanilla
npx serve .
```

## Enabling GPS + Weather (optional)

The AI Crop Advisor tries to auto-fill location and weather. To enable it:

1. Get a Google Maps Platform API key with **Geocoding API** and
   **Weather API** enabled.
2. Open `shared/config.js` and replace `your_google_maps_api_key_here` with
   your key.
3. Reload the AI Crop page and allow the browser's location prompt.

Without a key the form still works — you just fill it in manually.

## Notes

- **Tailwind CSS** is loaded from a CDN (`cdn.tailwindcss.com`) so every
  class from the original React project keeps working with zero compilation.
  Dark mode is toggled by adding `class="dark"` to `<html>` (see
  `shared/shell.js`).
- **Icons** come from the [Lucide](https://lucide.dev) CDN — same icon set
  the original `lucide-react` library uses.
- **Charts** are drawn with [Chart.js](https://www.chartjs.org/) CDN — a
  lightweight replacement for Recharts.
- All dummy data is centralized in `shared/data.js`, so editing one file
  updates every page that reads from it.
- Comments throughout the source explain what each section does — feel free
  to tweak colours, copy, or layout to match your own project.

Happy hacking 🌱
