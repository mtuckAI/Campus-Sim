# Data Requirements Summary - Micro-Level Analysis

## What Information is Needed to Instantiate a Real Building?

### 🎯 Quick Answer

**Absolute Minimum (5 fields - 2 minutes to collect):**
1. Building Code (e.g., "ZACH")
2. Building Name (e.g., "Zachry Engineering Center")
3. Zone Number (1-12)
4. GPS Coordinates (lat, lng)
5. Floor Count

**That's it to start!** Everything else is optional and can be added incrementally.

---

## 📊 Data Tiers (Progressive Enhancement)

### Tier 1: MINIMAL (Required) ⭐
**Time to collect: 2-5 minutes**

```json
{
  "id": "ZACH",
  "name": "Zachry Engineering Center",
  "zone_id": 2,
  "coordinates": {"lat": 30.6187, "lng": -96.3400},
  "floors": 4
}
```

**Result:** Building appears in selector, can view on map

---

### Tier 2: BASIC (Recommended) ⭐⭐
**Time to collect: 30 minutes - 2 hours**

Add:
- AP count per floor
- Building type (academic, residential, etc.)
- Square footage
- Typical occupancy
- Room type counts (how many lecture halls, labs, offices)

**Result:** Can show building statistics, capacity planning

---

### Tier 3: DETAILED (Good for Analysis) ⭐⭐⭐
**Time to collect: 4-8 hours**

Add:
- AP locations (room numbers)
- AP coordinates (X, Y on floor plan)
- Radio configuration (channels, power)
- Floor dimensions
- Key room locations

**Result:** Can display APs on floor plan, analyze coverage

---

### Tier 4: COMPREHENSIVE (Full Simulation) ⭐⭐⭐⭐
**Time to collect: 1-2 weeks**

Add:
- Detailed room inventory
- Room schedules and occupancy patterns
- RF characteristics (materials, interference)
- Historical performance data
- Problem areas and known issues

**Result:** Full micro-level simulation with realistic usage patterns

---

## 🗂️ Data Sources by Category

### Building Information
| Data | Source | Difficulty |
|------|--------|-----------|
| Building code/name | Campus map, facilities dept | Easy |
| Coordinates | Google Maps | Easy |
| Floor count | Building website, visual count | Easy |
| Square footage | Facilities, public records | Easy |
| Construction year | Public records, Wikipedia | Easy |
| Building type | Obvious from usage | Easy |

### WiFi Infrastructure
| Data | Source | Difficulty |
|------|--------|-----------|
| AP count | Network management system | Easy |
| AP model | Network management system | Easy |
| AP locations | Site survey docs, walk building | Medium |
| AP coordinates | Physical measurement, survey | Hard |
| Radio config | Management system export | Easy |

### Room Information
| Data | Source | Difficulty |
|------|--------|-----------|
| Room counts by type | Floor plans, facilities | Medium |
| Room capacities | Registrar, facilities | Medium |
| Room schedules | Registrar, scheduling system | Medium |
| Floor plans (images) | Facilities, architecture dept | Medium |

### Performance Data
| Data | Source | Difficulty |
|------|--------|-----------|
| Client associations | Management system reports | Easy |
| Throughput metrics | Management system analytics | Easy |
| Roaming data | Advanced analytics (Mist AI, etc.) | Medium |
| Handoff matrices | Custom reports, API queries | Hard |
| Problem reports | Help desk tickets | Easy |

---

## 📋 Practical Collection Strategy

### Phase 1: Quick Add (Day 1)
**Goal: Get building in the system**

1. Look up building on campus map (2 min)
2. Get coordinates from Google Maps (1 min)
3. Count floors visually or from building website (2 min)
4. Copy `TEMPLATE_MINIMAL.json` and fill in (2 min)
5. Add to `buildings_index.json` (1 min)

**Total time: ~10 minutes**

### Phase 2: Basic Data (Week 1)
**Goal: Add operational context**

1. Export AP list from network management system (10 min)
2. Get floor plans from facilities (30-60 min)
3. Count rooms by type on floor plans (30 min)
4. Get building square footage (10 min)
5. Estimate peak occupancy from registrar data (15 min)
6. Update building JSON file (15 min)

**Total time: ~2-3 hours**

### Phase 3: Detailed Mapping (Week 2-3)
**Goal: Map AP locations precisely**

1. Print floor plans (10 min)
2. Walk building, mark AP locations (2-4 hours)
3. Note room numbers where APs are mounted (30 min)
4. Extract radio configs from management system (30 min)
5. Create `ap_locations.json` entry (1-2 hours)

**Total time: ~5-8 hours**

### Phase 4: Performance Analysis (Month 1)
**Goal: Add historical data for simulation**

1. Export 1 week of metrics from management system (1 hour)
2. Process and aggregate data by hour (2 hours)
3. Identify handoff patterns (1 hour)
4. Document known issues from help desk (1 hour)
5. Create hourly metrics files (2 hours)

**Total time: ~7-10 hours**

---

## 🎯 Real-World Example: Zachry Engineering Center

### What We Collected (Tier 2 Data)

#### From Public Sources (15 minutes):
- Name: Zachry Engineering Center
- Code: ZACH
- Coordinates: 30.6187, -96.3400 (Google Maps)
- Floors: 4 (counted windows)
- Construction: 1973 (Wikipedia)
- Square footage: ~520,000 (facilities website)
- Type: Academic (obvious)

#### From Network Management System (30 minutes):
- Total APs: 48 Juniper AP47 units
- Deployed: August 2024
- Management zone: central-campus
- AP breakdown: Floor 1 (14), Floor 2 (12), Floor 3 (11), Floor 4 (11)

#### From Floor Plans (1 hour):
- 8 lecture halls (capacity 80-250 each)
- 24 computer/research labs
- 120 offices
- 16 major hallways
- 6 stairwells

**Total time invested: ~2 hours**
**Result: Full Tier 2 data, ready for analysis**

---

## 🚀 Recommendation: Start Small, Grow Fast

### Week 1: Add 5 Buildings (Minimal Data)
- Just basic info (Tier 1)
- **Time: 1 hour total**
- Result: Building selector populated

### Week 2: Detail 1 Building
- Pick highest-priority building
- Collect Tier 3 data (AP locations)
- **Time: 8 hours**
- Result: Full floor plan visualization

### Week 3-4: Add Historical Data
- Export performance metrics
- Create hourly data files
- **Time: 10 hours**
- Result: Realistic simulation

### Ongoing: Expand Incrementally
- Add more buildings at Tier 1
- Promote key buildings to Tier 2/3
- Update with new AP deployments
- **Time: As needed**

---

## 💡 Key Insights

### You DON'T Need:
❌ Perfect data before starting
❌ Complete floor plans
❌ Every AP location measured precisely
❌ Historical data for every hour
❌ All rooms documented

### You DO Need:
✅ Building identifier and name
✅ Approximate location (GPS)
✅ Floor count
✅ **Willingness to add detail over time**

### The Data Model Supports:
✅ Starting with minimal data
✅ Adding detail incrementally
✅ Missing fields (everything is optional except 5 core fields)
✅ Varying levels of detail per building
✅ Easy editing and updates

---

## 📞 Where to Get Help

### Internal Resources:
- **Facilities Department**: Floor plans, building specs
- **Network Operations**: AP inventory, configs
- **Registrar**: Room schedules, occupancy
- **Help Desk**: Problem reports, user complaints
- **GIS Department**: Coordinates, campus maps

### Tools:
- **Google Maps**: Coordinates
- **Network Management System**: AP data, metrics
- **JSONLint**: Validate JSON syntax
- **Building Website**: Public information

### Documentation:
- `QUICK_START.md`: Add a building in 5 minutes
- `BUILDING_DATA_COLLECTION_GUIDE.md`: Comprehensive guide
- `TEMPLATE_MINIMAL.json`: Start here
- `TEMPLATE_FULL.json`: See all possible fields
- `ZACH.json`: Working example

---

## Summary

**To instantiate a real building, you need:**

**Minimum:** 5 fields, 5 minutes
- Building ID, Name, Zone, Coordinates, Floors

**Recommended:** 10-15 fields, 2 hours
- Add AP count, room counts, building type

**Optimal:** 30-50 fields, 8 hours
- Add AP locations, radio configs, floor details

**Advanced:** 100+ fields, 1-2 weeks
- Add historical data, schedules, performance metrics

**Start with minimum data, expand as you collect more information!**
