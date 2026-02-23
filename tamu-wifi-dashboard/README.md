# Campus-Sim: TAMU WiFi Dashboard

React-based web dashboard for visualizing Texas A&M campus WiFi infrastructure. Displays building floor plans, access point locations, inventory, and micro-level analysis by building.

## What It Does

- **Building View**: Interactive floor plan visualization with AP locations overlaid
- **Micro-Analysis Tab**: Per-building deep dive — floor selection, AP inventory, coverage data
- **AP Inventory**: Browse and filter access points across campus buildings
- **Zone Navigation**: Campus organized by zones for easy navigation

## Quick Start

### Requirements
- Node.js (v18 or higher)
- npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/mtuckAI/Campus-Sim.git
cd Campus-Sim/tamu-wifi-dashboard

# Install dependencies
npm install

# Start development server
npm start
```

Open your browser to **http://localhost:5173**

### Build for Production

```bash
npm run build
# Output goes to dist/
```

## Project Structure

```
tamu-wifi-dashboard/
├── public/
│   └── data/
│       └── micro-analysis/
│           ├── buildings/          # Per-building JSON data files
│           ├── access-points/      # AP location data
│           └── location-types/     # Location type definitions
├── src/
│   ├── App.jsx                     # Root component
│   ├── App.css                     # Global styles
│   └── components/
│       └── micro-analysis/
│           ├── MicroAnalysisTab.jsx    # Main analysis tab
│           └── BuildingView.jsx        # Floor plan + AP visualization
├── index.html
├── package.json
└── vite.config.js
```

## Adding a New Building

Building data comes from the Ekahau parser. To add a new building:

1. Parse the building's `.esx` file using [tamu-ekahau-parser](https://github.com/mtuckAI/tamu-ekahau-parser)
2. Sync the output to this repo:
   ```bash
   python cli.py sync ../Campus-Sim/tamu-wifi-dashboard/public/data/micro-analysis/
   ```
3. Commit and push:
   ```bash
   git add public/data/micro-analysis/
   git commit -m "Add building data for [BUILDING NAME]"
   git push origin main
   ```

## Currently Loaded Buildings

| Building | ID | Floors |
|----------|----|--------|
| Memorial Student Center | MSC_0454 | 3 |
| Evans Library | TAMU_0468_1 | 4 |
| Cushing Library | TAMU_0468_2 | 3 |
| Library Annex | TAMU_0468_3 | 2 |
| Veterinary Teaching Hospital | TAMU_0508 | 3 |
| The Commons | THE_COMMONS_0440 | 2 |

## Data Source

All building and AP data is parsed from Ekahau WiFi site survey files using the companion tool:
→ [tamu-ekahau-parser](https://github.com/mtuckAI/tamu-ekahau-parser)

## Tech Stack

- React 18
- Vite
- CSS (custom, no UI framework)

## Contributing

1. Pull latest main before starting work:
   ```bash
   git pull origin main
   ```
2. Create a feature branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit and push your branch, then merge to main when stable

## Contact

TAMU WiFi Team
