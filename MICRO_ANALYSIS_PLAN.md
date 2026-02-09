# Campus WiFi Simulator - Micro-Level Analysis Feature

## Branch: `feature/micro-level-analysis`

This branch contains the isolated development of micro-level (building and AP-level) analysis capabilities.

## ✅ Completed Setup

### 1. Directory Structure
```
tamu-wifi-dashboard/
├── src/components/micro-analysis/
│   ├── building/          # Building-level components
│   ├── ap/                # Access Point components
│   ├── analytics/         # Analysis & UX metrics
│   └── shared/            # Shared utilities
│
└── public/data/micro-analysis/
    ├── buildings/         # Per-building data files
    ├── access-points/     # AP locations and metrics
    ├── floor-plans/       # Floor plan metadata/images
    ├── location-types/    # Room type definitions
    └── schemas/           # JSON schema validators
```

### 2. Modular, Extensible Data Model

#### Buildings Index (`buildings/buildings_index.json`)
- Master list of all buildings
- Enable/disable buildings for analysis
- Easy to add new buildings

#### Per-Building Data (`buildings/ZACH.json`)
- Building info (location, size, type)
- Floor information and dimensions
- Room inventory by type (lecture halls, labs, offices, etc.)
- **Easy to edit and extend**

#### AP Locations (`access-points/ap_locations.json`)
- Physical placement coordinates
- Radio configuration (channels, power)
- Installation metadata
- **Structured by building for easy maintenance**

#### Hourly Metrics (`access-points/ap_metrics_hour_XX.json`)
- Separate file per hour (reduces file size)
- Client attachment counts
- Performance metrics (throughput, channel utilization)
- Handoff data (AP-to-AP transitions)
- Roaming analysis (sticky clients, success rates)
- **Load only the hours you need**

#### Location Types (`location-types/location_types.json`)
- Configurable room type definitions
- Expected behavior patterns
- Challenge identification
- Color coding for visualization
- **Add new room types without code changes**

#### Analysis Thresholds (`location-types/analysis_thresholds.json`)
- **ALL THRESHOLDS ARE EDITABLE**
- Signal strength ranges
- Sticky client detection parameters
- Channel utilization levels
- Roaming health scores
- Alert priorities
- **Tune analysis behavior without touching code**

## Design Principles

### ✅ Modular
- Separate files for different data types
- Easy to locate and edit specific data
- Component isolation prevents breaking changes

### ✅ Extensible
- Add new buildings: Add entry to `buildings_index.json` and create `BLDG_ID.json`
- Add new metrics: Add fields to any JSON file - old code won't break
- Add new room types: Edit `location_types.json`
- Add new APs: Add entries to `ap_locations.json`

### ✅ Editable
- Human-readable JSON (not minified)
- Clear property names and structure
- Embedded documentation in metadata sections
- No data in code - all configuration in JSON

### ✅ Scalable
- Start with minimal data (just 1 building, 3 APs)
- Add detail incrementally as needed
- Hourly metrics in separate files (don't load all 24 hours at once)
- Optional fields everywhere

## Next Steps

### Phase 1: UI Components (Next)
1. Create `BuildingSelector` component - zone drill-down
2. Create `BuildingList` - show buildings in selected zone
3. Add "Micro Analysis" tab to main App.jsx

### Phase 2: Visualization
1. `FloorPlanViewer` - SVG/Canvas floor plan renderer
2. `APPlacementMap` - show AP locations on floor plan
3. Real-time client attachment visualization

### Phase 3: Analytics
1. `APDetailPanel` - comprehensive AP metrics
2. `HandoffAnalyzer` - visualize client transitions
3. `RoamingHealthScore` - roaming performance dashboard
4. `StickyClientDetector` - identify problem clients

### Phase 4: User Experience Insights
1. Coverage gap detection
2. Load balancing analysis
3. Channel utilization heatmaps
4. RSSI distribution analytics

## How to Extend the Data Model

### Adding a New Building
1. Edit `buildings/buildings_index.json` - add building entry
2. Create `buildings/YOUR_BUILDING.json` - copy ZACH.json as template
3. Add AP locations to `access-points/ap_locations.json`
4. Add metrics to `access-points/ap_metrics_hour_XX.json`

### Adding New Metrics
Just add new fields to the JSON files - no code changes needed:

```json
{
  "AP-ZACH-1F-001": {
    "basic": { ... },
    "performance": { ... },
    "YOUR_NEW_METRIC": {
      "value": 123,
      "description": "What this measures"
    }
  }
}
```

### Adjusting Analysis Thresholds
Edit `location-types/analysis_thresholds.json`:

```json
{
  "sticky_client_detection": {
    "sticky_client_rssi": -70,  // ← Change this value
    "sticky_duration_minutes": 5  // ← Or this
  }
}
```

## File Checklist

- ✅ `src/components/micro-analysis/README.md` - Component documentation
- ✅ `public/data/micro-analysis/README.md` - Data structure documentation
- ✅ `public/data/micro-analysis/buildings/buildings_index.json` - Building index
- ✅ `public/data/micro-analysis/buildings/ZACH.json` - Example building
- ✅ `public/data/micro-analysis/access-points/ap_locations.json` - AP placements
- ✅ `public/data/micro-analysis/access-points/ap_metrics_hour_10.json` - Example metrics
- ✅ `public/data/micro-analysis/location-types/location_types.json` - Room types
- ✅ `public/data/micro-analysis/location-types/analysis_thresholds.json` - Thresholds
- ⏳ Component implementations (pending)

## Isolated from Main Simulator

**Zero impact on existing simulator:**
- All new files in separate directories
- New tab in UI (existing tabs unchanged)
- Separate data files
- No modifications to existing components
- Can be developed, tested, and merged independently
