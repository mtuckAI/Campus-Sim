# Micro-Level Analysis Components

This directory contains components for building-level and AP-level analysis of the campus WiFi simulator.

## Directory Structure

```
micro-analysis/
├── building/           # Building-level components
│   ├── BuildingSelector.jsx       # Zone → Building drill-down selector
│   ├── BuildingOverview.jsx       # Building summary stats
│   └── BuildingList.jsx           # List view of buildings in a zone
│
├── ap/                 # Access Point level components
│   ├── APPlacementMap.jsx         # Visual floor plan with AP locations
│   ├── APDetailPanel.jsx          # Individual AP metrics panel
│   └── APLoadHeatmap.jsx          # AP load distribution heatmap
│
├── analytics/          # Analysis and UX metrics
│   ├── HandoffAnalyzer.jsx        # AP-to-AP handoff flow visualization
│   ├── RoamingHealthScore.jsx    # Roaming success/failure metrics
│   ├── StickyClientDetector.jsx  # Client stickiness analysis
│   └── CoverageAnalysis.jsx      # Signal strength and coverage gaps
│
└── shared/             # Shared utilities and components
    ├── FloorPlanCanvas.jsx        # Reusable floor plan renderer
    ├── APMarker.jsx               # AP icon/marker component
    ├── SignalStrengthIndicator.jsx
    └── microAnalysisTypes.js      # TypeScript/JSDoc type definitions
```

## Features to Implement

### Phase 1: Building Selection Layer
- [x] Directory structure created
- [ ] BuildingSelector component with zone drill-down
- [ ] BuildingList showing top buildings by client count
- [ ] Integration with existing App.jsx

### Phase 2: Floor Plan Visualization
- [ ] FloorPlanCanvas with SVG/Canvas rendering
- [ ] APPlacementMap showing AP locations
- [ ] Real-time client attachment visualization
- [ ] Interactive AP markers with tooltips

### Phase 3: AP-Level Analytics
- [ ] APDetailPanel with comprehensive metrics
- [ ] HandoffAnalyzer with Sankey/flow diagrams
- [ ] RoamingHealthScore dashboard
- [ ] StickyClientDetector with alerts

### Phase 4: User Experience Insights
- [ ] Coverage gap detection
- [ ] Load balancing analysis
- [ ] Channel utilization heatmaps
- [ ] RSSI distribution analytics

## Data Model

See `/public/data/micro-analysis/building_data_schema.json` for the expected data structure.

## Integration Points

- **App.jsx**: New "Micro Analysis" tab added to main navigation
- **Existing simulator**: Completely isolated - no changes to macro-level views
- **Data source**: Separate JSON files in `/public/data/micro-analysis/`
