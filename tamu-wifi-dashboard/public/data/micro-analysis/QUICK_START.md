# Quick Start: Add a Building in 5 Minutes

## Step 1: Get Basic Info (2 minutes)

**You need just 5 things:**

1. **Building Code** - Short ID like "ZACH", "HRBB", "KYLE"
2. **Building Name** - Full name like "Zachry Engineering Center"
3. **Zone Number** - Which zone (1-12) from the main campus zones
4. **Coordinates** - Right-click on Google Maps → copy lat/lng
5. **Floor Count** - How many floors (including ground)

**Optional but helpful:**
- AP count (check your network management system)
- Building type (academic, residential, athletics, etc.)
- Square footage

## Step 2: Create Building File (2 minutes)

1. Copy `TEMPLATE_MINIMAL.json`
2. Rename to `YOUR_BUILDING_CODE.json`
3. Fill in the 5 required fields
4. Save in `buildings/` folder

```json
{
  "building_info": {
    "id": "HRBB",
    "name": "Harrington Tower",
    "zone_id": 2,
    "coordinates": {
      "lat": 30.6196,
      "lng": -96.3426
    },
    "floors": 18
  },
  "floor_info": [
    {"floor_number": 1, "ap_count": 8},
    {"floor_number": 2, "ap_count": 8}
  ]
}
```

## Step 3: Register Building (1 minute)

Edit `buildings/buildings_index.json`:

```json
{
  "buildings": [
    {
      "id": "HRBB",
      "name": "Harrington Tower",
      "zone_id": 2,
      "zone_name": "Central Campus",
      "enabled": true,
      "data_file": "HRBB.json"
    }
  ]
}
```

## Done! ✅

Your building will now appear in the building selector.

---

## Add More Detail Later

### Want to add AP locations?

Edit `access-points/ap_locations.json`:

```json
{
  "HRBB": {
    "building_id": "HRBB",
    "total_aps": 144,
    "access_points": [
      {
        "ap_id": "AP-HRBB-1F-001",
        "floor": 1,
        "location": {"room": "101", "x": 50, "y": 75}
      }
    ]
  }
}
```

### Want to add room details?

Edit your building JSON and expand `room_inventory`:

```json
{
  "room_inventory": {
    "lecture_halls": {
      "count": 4,
      "locations": [
        {"room": "101", "floor": 1, "capacity": 200}
      ]
    }
  }
}
```

---

## Where to Get Info Quickly

| Info | Quick Source | Time |
|------|-------------|------|
| Building code | Campus map | 10 sec |
| Building name | Campus map | 10 sec |
| Zone | Look at existing `ZONE_NAMES` in App.jsx | 30 sec |
| Coordinates | Google Maps (right-click → coordinates) | 30 sec |
| Floor count | Wikipedia, building website, or count windows | 1 min |
| AP count | Network management system dashboard | 2 min |

---

## Examples from TAMU

### Zachry Engineering Center
- Code: ZACH
- Floors: 4
- Zone: 2 (Central Campus)
- Coords: 30.6187, -96.3400
- APs: 48

### Kyle Field
- Code: KYLE
- Floors: 5
- Zone: 10 (Athletics District)
- Coords: 30.6104, -96.3401
- APs: ~300+

### Memorial Student Center
- Code: MSC
- Floors: 3
- Zone: 2 (Central Campus)
- Coords: 30.6133, -96.3415
- APs: ~50

---

## Tips

✅ **Start minimal** - Just 5 fields gets your building in the system
✅ **Add detail incrementally** - Expand as you collect more data
✅ **Use templates** - Copy existing buildings as starting points
✅ **Test as you go** - Reload dashboard to see your building appear
✅ **Document sources** - Add notes about where data came from

❌ **Don't wait for perfect data** - Add what you have, improve later
❌ **Don't guess coordinates** - Use Google Maps for accuracy
❌ **Don't duplicate building IDs** - Keep IDs unique

---

## Troubleshooting

**Building doesn't appear?**
- Check `buildings_index.json` has `"enabled": true`
- Verify JSON syntax (use JSONLint.com)
- Check browser console for errors

**Wrong location on map?**
- Verify lat/lng order (latitude first, longitude second)
- Check coordinate signs (North is positive, West is negative)

**Need help?**
- Look at `ZACH.json` as a working example
- Read `BUILDING_DATA_COLLECTION_GUIDE.md` for details
- Check JSON syntax with online validator
