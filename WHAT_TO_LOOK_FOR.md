# What to Look For: Building Data & Floor Plans

## 🎯 Quick Checklist

When gathering data for real buildings, here's what to look for and where to find it:

---

## 📍 Building Basic Info (5 minutes per building)

### From Campus Maps/Websites:
- [ ] **Building abbreviation code** (ZACH, HRBB, KYLE, etc.)
- [ ] **Full official name**
- [ ] **Campus zone/area** (match to your 12 zones)
- [ ] **General location** (which part of campus)

### From Google Maps:
- [ ] **GPS Coordinates**
  - Right-click on building → "What's here?"
  - Copy latitude, longitude (format: 30.6187, -96.3400)
  - Verify it's the center of the building

### Visual Inspection or Building Website:
- [ ] **Floor count**
  - Count from outside (look at windows)
  - Check building directory
  - Include basement if accessible
  - Don't count mechanical/roof levels

---

## 🏢 Floor Plans - What You're Looking For

### From Facilities/Architecture Department:

#### Best Options (in order of preference):
1. **CAD/DWG files** - Can convert to SVG
2. **PDF architectural drawings** - Can extract/convert
3. **PDF evacuation maps** - Simple but useful
4. **Scanned blueprints** - Better than nothing
5. **Hand-drawn sketches** - Start somewhere!

#### What to Request:
- "Current floor plans for [Building Name]"
- "Evacuation maps" (usually publicly available)
- "As-built drawings" (most accurate)
- "Space allocation plans" (shows room usage)

#### If Multiple Versions Available:
✅ **Take:** Most recent, shows current layout
✅ **Take:** Files that show room numbers clearly
✅ **Take:** Digital format (PDF, CAD, PNG) over paper
❌ **Skip:** Original construction drawings (too old)
❌ **Skip:** Mechanical/electrical plans (too detailed)

---

## 🗺️ What Makes a Good Floor Plan

### Minimum Requirements:
- Shows building outline/perimeter
- Shows major rooms/spaces
- Shows hallways/corridors
- Readable at 100% zoom
- Room numbers visible (if possible)

### Nice to Have:
- Room dimensions
- Door locations
- Stairwell positions
- Scale indicator (e.g., 1" = 20')
- North arrow

### Don't Need:
- Plumbing details
- Electrical outlets
- Furniture layouts
- HVAC systems
- Fine details like door swings

---

## 📶 WiFi Infrastructure Data

### From Network Management System (Mist, Cisco, Aruba, etc.):

#### Navigate to:
1. **Inventory** or **Access Points** section
2. Filter by building or location
3. Export list to CSV/Excel

#### Essential Fields to Export:
- [ ] **AP Name/ID** (e.g., "AP-ZACH-1F-001")
- [ ] **MAC Address**
- [ ] **Model** (e.g., "Juniper AP47")
- [ ] **Location** (building, floor, room)
- [ ] **Status** (active, inactive)

#### Radio Configuration (if available):
- [ ] **Channel numbers** (2.4GHz and 5GHz)
- [ ] **Transmit power** (dBm)
- [ ] **Channel width** (20, 40, 80 MHz)

#### Optional but Useful:
- Installation date
- Firmware version
- IP address
- Serial number

---

## 🏗️ Room Information

### From Registrar or Scheduling System:

For **classrooms and lecture halls**:
- [ ] Room numbers
- [ ] Room type (lecture hall, classroom, lab)
- [ ] Seating capacity
- [ ] Class schedule (days/times in use)

### From Facilities:

For **all spaces**:
- [ ] Total office count
- [ ] Lab count and types
- [ ] Conference room count
- [ ] Study area locations
- [ ] Square footage per floor

### What You're Counting:
```
Floor 1:
- Lecture halls: 4 (capacities: 250, 150, 100, 80)
- Computer labs: 2 (capacities: 30, 30)
- Offices: 25
- Hallways: 3 main corridors
- Stairwells: 2
```

---

## 📊 Performance Data (Optional - Advanced)

### From Network Analytics/Reports:

#### Look for reports named:
- "Client Statistics"
- "AP Performance"
- "User Experience"
- "Service Level Reports"
- "Wireless Health"

#### Export Time Period:
- **Best:** 1 typical weekday (Tuesday-Thursday)
- **Good:** 1 week average
- **Acceptable:** 1 month aggregate

#### Key Metrics to Export:
- Client associations per AP (by hour)
- Channel utilization percentage
- Average RSSI/signal strength
- Throughput (Mbps)
- Retry/error rates
- Roaming success rates

#### File Format:
- CSV or Excel preferred
- One row per AP per hour is ideal
- Include timestamps

---

## 🎓 TAMU-Specific Resources

### Websites to Check:
- **Campus Map**: https://www.tamu.edu/map/
- **Building Directory**: Search for building names
- **Facilities Services**: Contact for floor plans
- **GIS Department**: May have digital building data

### Departments to Contact:

#### For Floor Plans:
- Facilities Planning & Construction
- Physical Plant
- Space Management
- University Architect's Office

#### For Room Data:
- Office of the Registrar (class schedules)
- Space Management (room inventory)
- Building coordinators (building-specific info)

#### For WiFi Data:
- IT Network Operations Center
- Campus WiFi support team
- Mist AI admin portal
- Juniper dashboard access

### Example Email:
```
Subject: Request for Floor Plans - [Building Name]

Hi [Name],

I'm working on a WiFi network analysis project for campus and need
floor plans for [Building Name].

Could you provide:
- Current floor plans (PDF or CAD preferred)
- OR evacuation maps if floor plans aren't available
- All floors including basement/ground level

These will be used for WiFi access point mapping and coverage analysis.

Thank you!
[Your Name]
```

---

## 🔍 Building Data Priority List

### High Priority (Start Here):
1. **Zachry Engineering (ZACH)** - Already have template
2. **Memorial Student Center (MSC)** - High traffic
3. **Evans Library** - High density, long sessions
4. **Kyle Field (KYLE)** - Large venue, unique challenges
5. **Reed Arena** - Events, variable density

### Medium Priority:
6. **Academic Building (ACAD)** - Typical classroom building
7. **Blocker Building** - Standard academic
8. **Harrington Tower (HRBB)** - High-rise residence
9. **Commons/Dining halls** - High density, short sessions
10. **Rec Center** - Mobile users, variable usage

### Low Priority (Add Later):
- Small administrative buildings
- Storage/maintenance buildings
- Remote facilities
- Low-traffic satellite buildings

---

## ✅ Success Criteria

### You Have Enough When:
- [ ] 5 buildings with basic info (Tier 1)
- [ ] 2 buildings with floor plans
- [ ] 1 building with AP locations mapped
- [ ] Floor plans are readable and show room numbers
- [ ] AP inventory exported from management system

### You Can Start Building UI When:
- [ ] At least 1 building fully documented (Tier 3)
- [ ] Floor plan available (any format)
- [ ] 10+ APs with room locations known

---

## 💡 Pro Tips

### For Floor Plans:
✅ **Ask for "evacuation maps"** - Usually public, easy to get
✅ **Check building entrance** - Often posted there
✅ **Take photos** - If can't get digital files
✅ **Accept anything** - Even sketches are useful
❌ **Don't wait for perfect** - Start with what you have

### For AP Locations:
✅ **Walk the building** - Visually locate APs
✅ **Use WiFi scanner** - See AP names in real-time
✅ **Ask maintenance staff** - They know where APs are
✅ **Check ceiling tiles** - Most APs are ceiling-mounted
❌ **Don't guess** - Approximate is fine, but verify

### For Data Collection:
✅ **Start small** - One building, Tier 1 data
✅ **Iterate quickly** - Add more buildings at basic level
✅ **Go deep later** - Pick 1-2 buildings for detailed analysis
✅ **Document sources** - Note where each piece of data came from

---

## 📝 Data Collection Log Template

```
Building: ___________________
Date Collected: _____________
Collected By: _______________

Data Sources:
□ Campus map: _______________
□ Google Maps: ______________
□ Floor plans from: _________
□ AP data from: _____________
□ Room data from: ___________

Status:
□ Tier 1 complete (basic info)
□ Tier 2 complete (floor plans)
□ Tier 3 complete (AP locations)
□ Ready for simulation

Notes:
_____________________________
_____________________________
```

---

## 🚀 Next Steps After Reading

1. Identify 3-5 target buildings (start with high-priority list)
2. Check campus map for building codes and locations
3. Contact facilities for floor plans (use email template)
4. Export AP inventory from network management system
5. Start with TEMPLATE_MINIMAL.json for first building
6. Use QUICK_START.md to add first building in 5 minutes

**Remember: Perfect data isn't required. Start with basics and improve!**
