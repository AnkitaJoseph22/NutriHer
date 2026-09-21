# NutriHer — Frontend

React + Vite + Tailwind frontend for NutriHer, structured so the existing
EfficientNet-B0 food classifier and Python calculation engine can be wired
in behind FastAPI without touching any component code.

## Run it

```bash
npm install
npm run dev
```

## Connect the FastAPI backend

Set the API base URL (defaults to `http://localhost:8000`):

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000
```

Then replace the mock bodies in `src/services/*.js` with real calls through
`apiRequest()` from `src/services/api.js`. Every page imports only from
`services/`, never fetches directly, so swapping mocks for real endpoints
is a one-file-at-a-time change:

| Service file                       | Backend endpoint(s)                  |
|-------------------------------------|---------------------------------------|
| `services/foodService.js`           | `POST /predict`, `GET /nutrients`     |
| `services/nutritionService.js`      | `POST /absorption`                    |
| `services/cycleService.js`          | `GET /cycle`                          |
| `services/profileService.js`        | `GET/POST /profile`                   |
| `services/insightService.js`        | `POST /insights`                      |

## Structure

```text
src/
├── main.jsx            # entry point
├── App.jsx             # top-level state + page routing
├── index.css           # Tailwind directives
├── styles/
│   └── tokens.js        # colors, fonts, shared constants
├── components/
│   ├── ui.jsx            # Card, Pill, buttons, inputs, etc.
│   ├── Shell.jsx         # sidebar (desktop) / bottom nav (mobile)
│   ├── IronRing.jsx      # circular progress ring
│   └── CyclePhaseBar.jsx # menstrual phase timeline
├── pages/
│   ├── Welcome.jsx
│   ├── Onboarding.jsx    # multi-step profile setup
│   ├── Dashboard.jsx
│   ├── Food.jsx          # upload → predict → portion → nutrients
│   ├── Absorption.jsx
│   ├── Cycle.jsx
│   ├── Symptoms.jsx
│   ├── Insights.jsx
│   └── Profile.jsx
├── services/            # mock-now, API-ready service layer
│   ├── api.js
│   ├── foodService.js
│   ├── nutritionService.js
│   ├── cycleService.js
│   ├── profileService.js
│   └── insightService.js
└── data/
    └── foodDb.js         # placeholder nutrient table (replace with IFCT 2017)
```

## Demo Mode

"Explore Demo" on the welcome screen loads a pre-filled profile (Ananya, 23,
day 18 of a 28-day cycle) and skips onboarding, matching the university
demonstration flow: profile → cycle → symptoms → dashboard → upload Pongal
image → 98.63% detection → portion → iron → absorption → personalized insight.
