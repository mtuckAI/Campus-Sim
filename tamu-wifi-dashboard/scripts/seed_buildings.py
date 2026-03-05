## **File:** `tamu-wifi-dashboard/scripts/seed_buildings.py`

#```python
"""
seed_buildings.py
Reads TAMU_buildings_with_floor_estimates.xlsx and generates:
  - public/data/micro-analysis/buildings/buildings_index.json
  - public/data/micro-analysis/buildings/{BUILDING_ID}.json  (one per building)

Only creates files that DON'T already exist (safe to re-run).
Buildings with existing Tier 2/3 files are never overwritten.
"""
import re, json, os
from datetime import date
import openpyxl

XLSX_PATH  = "../../TAMU_buildings_with_floor_estimates.xlsx"
OUTPUT_DIR = "../public/data/micro-analysis/buildings"
TODAY      = str(date.today())

FLOOR_COL = {
    "conservative": 3,   # 0-indexed after name/count/zone
    "tiered":       4,
    "recommended":  5,
    "confidence":   6,
}

def make_id(name):
    return re.sub(r'[^a-zA-Z0-9]+', '_', name).strip('_').upper()

def floors_per_ap(ap_count, floor_est):
    """Distribute APs across floors evenly."""
    if not floor_est or floor_est < 1:
        floor_est = 1
    per_floor = round(ap_count / floor_est)
    return [
        {
            "floor_number": f + 1,
            "label": f"Floor {f + 1}",
            "dimensions": {
                "width_m": None, "height_m": None,
                "width_ft": None, "height_ft": None
            },
            "ap_count_estimated": per_floor,
            "placed_aps": [],
            "walls": [],
            "floor_plan_image": None
        }
        for f in range(floor_est)
    ]

wb    = openpyxl.load_workbook(XLSX_PATH)
ws    = wb.active
index = []

for row in ws.iter_rows(min_row=2, values_only=True):
    name = row[0]
    if not name:
        continue
    ap_count    = row[1] or 0
    zone        = row[2] or 1
    conservative = row[3] or 1
    tiered       = row[4] or 1
    recommended  = row[5] or 1
    confidence   = row[6] or "Low"

    bld_id   = make_id(name)
    filename = f"{bld_id}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)

    index.append({
        "id":                    bld_id,
        "name":                  name,
        "zone_id":               zone,
        "total_ap_count":        ap_count,
        "floor_count_recommended": recommended,
        "confidence":            confidence,
        "tier":                  1,
        "data_file":             filename,
        "enabled":               True
    })

    # Never overwrite existing Tier 2 or 3 files
    if os.path.exists(filepath):
        print(f"  SKIP (exists): {filename}")
        continue

    building_json = {
        "schema_version": "2.0",
        "data_source": {
            "tier": 1,
            "label": "XLSX estimate",
            "confidence": confidence,
            "last_updated": TODAY,
            "ekahau_file": None,
            "ekahau_survey_date": None
        },
        "building_info": {
            "id": bld_id,
            "name": name,
            "zone_id": zone,
            "coordinates": {"lat": None, "lng": None},
            "building_type": "academic",
            "construction_year": None,
            "total_ap_count": ap_count,
            "floor_count_estimate": {
                "conservative": conservative,
                "tiered": tiered,
                "recommended": recommended
            }
        },
        "floors": floors_per_ap(ap_count, recommended),
        "room_inventory": None,
        "analysis_config": {
            "wifi_gen_mix": {
                "wifi7_pct": 10, "wifi6_pct": 25,
                "wifi5_pct": 40, "wifi4_pct": 25,
                "legacy_factor": 50
            },
            "mlo_enabled": False,
            "channel_width_5ghz": 80,
            "channel_width_6ghz": 160
        }
    }

    with open(filepath, 'w') as f:
        json.dump(building_json, f, indent=2)
    print(f"  CREATED: {filename}")

# Write index (always regenerated, safe)
index_path = os.path.join(OUTPUT_DIR, "buildings_index.json")
with open(index_path, 'w') as f:
    json.dump({
        "metadata": {
            "version": "2.0",
            "total_buildings": len(index),
            "last_updated": TODAY,
            "source": "TAMU_buildings_with_floor_estimates.xlsx"
        },
        "buildings": index
    }, f, indent=2)
print(f"\nINDEX written: {len(index)} buildings → buildings_index.json")
#```
