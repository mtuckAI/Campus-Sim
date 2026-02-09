# Micro-Analysis Data Structure

## Design Philosophy

This data structure is designed to be:
- **Modular**: Separate files for different data types
- **Extensible**: Easy to add new metrics without breaking existing code
- **Editable**: Human-readable JSON with clear documentation
- **Scalable**: Can start with minimal data and add detail incrementally

## File Organization

```
data/micro-analysis/
├── buildings/
│   ├── buildings_index.json       # Master list of all buildings
│   ├── ZACH.json                  # Per-building data files
│   ├── HRBB.json
│   └── KYLE.json
│
├── access-points/
│   ├── ap_locations.json          # AP placement coordinates
│   ├── ap_metrics_hour_00.json    # Hourly metrics (separate files)
│   ├── ap_metrics_hour_10.json
│   └── ...
│
├── floor-plans/
│   ├── floor_plan_metadata.json   # Floor plan dimensions and info
│   ├── ZACH_floor_1.svg           # Optional: actual floor plan images
│   └── ZACH_floor_2.svg
│
├── location-types/
│   ├── location_types.json        # Room type definitions
│   └── analysis_thresholds.json   # Configurable thresholds
│
└── schemas/
    ├── building_schema.json       # JSON Schema validators
    ├── ap_schema.json
    └── metrics_schema.json
```

## Why This Structure?

1. **Separate files per building**: Easy to add/edit individual buildings
2. **Hourly metrics in separate files**: Reduce file size, load only needed hours
3. **Extensible metrics**: Add new fields without restructuring existing data
4. **Optional data**: Start simple, add detail as needed
5. **JSON Schema validation**: Catch errors early while maintaining flexibility
