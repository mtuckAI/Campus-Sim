# Building Data Collection Guide

## Essential Information to Instantiate a Real Campus Building

This guide outlines what information is needed to add a real building from campus to the micro-level analysis simulator.

---

## 📋 Tier 1: REQUIRED - Basic Building Information

### Building Identification
- **Building ID/Code** (e.g., "ZACH", "HRBB", "KYLE")
  - Must be unique across campus
  - Recommendation: Use official campus building codes
- **Full Building Name** (e.g., "Zachry Engineering Center")
- **Zone Assignment** (which of the 12 campus zones: 1=West, 2=Central, etc.)
- **Building Type**
  - Options: `academic`, `administrative`, `athletics`, `residential`, `research`, `student_services`, `healthcare`, `mixed_use`

### Physical Attributes
- **Geographic Coordinates**
  - Latitude (e.g., 30.6187)
  - Longitude (e.g., -96.3400)
  - Used for: mapping, distance calculations, coverage planning
- **Number of Floors** (including basement/ground level)
- **Approximate Square Footage** (total across all floors)
- **Typical Peak Occupancy** (maximum expected users)
- **Construction Year** (optional, helps identify building materials/RF characteristics)

### Current WiFi Infrastructure
- **Total APs Deployed** (count of access points)
- **AP Model(s)** (e.g., "Juniper AP47", "Cisco 9130AXI")
- **Deployment Date** (when APs were installed)
- **Management Zone** (if using zone-based architecture)

**Minimum to Start:** Building ID, Name, Zone, Coordinates, Floor Count, AP Count

---

## 📋 Tier 2: RECOMMENDED - Floor & Room Layout

### Per-Floor Information
For each floor, collect:
- **Floor Number/Identifier** (B1, G, 1, 2, 3, etc.)
- **Floor Dimensions** (approximate)
  - Width (in feet or meters)
  - Length/Height (in feet or meters)
  - Helps render proportional floor plans
- **Floor Plan Image** (optional)
  - Format: SVG (preferred), PNG, or PDF
  - Resolution: high enough to read room numbers
  - Can be architectural drawing, evacuation map, or simple sketch

### Room Inventory Summary
Count of rooms by type (doesn't need specific room numbers yet):
- **Lecture Halls**: count + typical capacity (e.g., "4 halls, 100-250 capacity each")
- **Classrooms**: count + typical capacity
- **Computer Labs**: count + typical capacity
- **Research Labs**: count + typical capacity
- **Offices**: count (individual + shared)
- **Conference/Meeting Rooms**: count
- **Study Areas**: count
- **Hallways/Corridors**: major corridor count
- **Stairwells**: count
- **Elevators**: count
- **Restrooms**: count
- **Storage/Utility**: count
- **Other**: specify type and count

**Why this matters:** Different room types have different WiFi usage patterns, density requirements, and roaming behaviors.

---

## 📋 Tier 3: DETAILED - Access Point Placement

For each Access Point in the building:

### AP Identity
- **AP ID/Name** (e.g., "AP-ZACH-1F-001")
- **MAC Address** (for tracking in network management)
- **Serial Number** (optional)
- **Model** (e.g., "Juniper AP47")
- **Firmware Version** (current)

### Physical Location
- **Floor Number**
- **Room Number/Location** (e.g., "101", "Hallway-A", "Stairwell-B")
- **Room Type** (lecture_hall, hallway, office, lab, etc.)
- **Description** (e.g., "Front left corner of lecture hall")
- **Coordinates** (if available)
  - X, Y position in feet/meters from building origin (e.g., southwest corner)
  - OR: GPS coordinates if outdoor/rooftop
  - Height above floor (in feet)
- **Mounting Type** (ceiling, wall, pole, etc.)

### Radio Configuration
For each radio band (2.4GHz, 5GHz, 6GHz):
- **Enabled?** (yes/no)
- **Channel Number** (e.g., 1, 6, 11 for 2.4GHz; 36, 48, 149 for 5GHz)
- **Transmit Power** (in dBm, e.g., 14, 17, 20)
- **Channel Width** (20MHz, 40MHz, 80MHz, 160MHz)
- **Antenna Type** (internal, external, directional)
- **Antenna Orientation** (if directional)

### Installation Metadata
- **Installation Date**
- **Last Maintenance Date**
- **Known Issues** (if any)
- **Notes** (special considerations)

**Where to get this:**
- Network management system (Mist AI, Cisco Prime, Aruba Central, etc.)
- Site survey documentation
- Facility drawings
- Physical AP labels
- Walk the building with WiFi scanner

---

## 📋 Tier 4: OPTIONAL - Specific Room Details

For key rooms where detailed analysis is desired:

### Room-Level Data
- **Room Number/ID**
- **Room Name** (e.g., "Main Lecture Hall")
- **Room Type** (from location_types.json)
- **Floor**
- **Capacity** (seated/standing)
- **Dimensions** (length × width × height)
- **Coordinates** (X, Y position on floor plan)
- **Typical Schedule**
  - Class times for classrooms
  - Peak usage hours
  - Occupancy patterns by hour
- **AP Coverage** (which APs primarily serve this room)
- **Known Issues**
  - Dead zones
  - Interference sources
  - Sticky client problems
  - Coverage gaps

### Special Considerations
- **RF Challenges**
  - Metal walls/doors
  - Concrete construction
  - Glass partitions
  - Interference sources (microwaves, motors, other equipment)
- **Usage Patterns**
  - Synchronized activity (classes starting on the hour)
  - Mobile vs stationary users
  - High bandwidth needs
  - Real-time applications (Zoom, Teams, VoIP)

---

## 📋 Tier 5: ADVANCED - Historical Performance Data

If available from network management system:

### Per-AP Historical Metrics
Export for typical weekday, by hour (0-23):
- **Client Associations** (count)
- **Client Device Types** (laptop, smartphone, tablet, IoT)
- **Operating Systems** (Windows, Mac, iOS, Android, Linux)
- **Average RSSI** (signal strength)
- **Min/Max RSSI**
- **Channel Utilization %**
- **Throughput** (Mbps)
- **Retry Rate %**
- **Error Rate %**
- **Data Transferred** (GB)

### Roaming & Handoff Data
- **Successful Roams** (count)
- **Failed Roams** (count)
- **Average Roam Time** (milliseconds)
- **Handoff Matrix** (which APs clients move between)
- **Sticky Client Count** (clients with weak signal not roaming)

### Problem Reports
- **User Complaints** (tickets, survey feedback)
- **Known Dead Zones**
- **Capacity Issues** (times/locations)
- **Interference Issues**
- **Coverage Gaps**

**Where to get this:**
- Mist AI Dashboard → Insights → Service Levels
- Cisco DNA Center → Assurance
- Aruba Central → Reports
- SNMP/API exports
- Syslog analysis
- Help desk tickets

---

## 🎯 Practical Data Collection Workflow

### Step 1: Start with Minimal Data (30 minutes)
Collect Tier 1 only:
1. Building name, code, zone
2. Coordinates (Google Maps)
3. Floor count
4. AP count (from network management system)
5. Square footage (from facilities)

**Result:** Building appears in building selector

### Step 2: Add Floor Layout (2 hours)
Collect Tier 2:
1. Get floor plans from facilities department
2. Count rooms by type on each floor
3. Measure/estimate floor dimensions
4. Note major hallways and stairwells

**Result:** Can render basic floor plan structure

### Step 3: Map AP Locations (4-8 hours)
Collect Tier 3:
1. Export AP list from network management system
2. Match AP names to physical locations
3. Walk building with floor plans, note AP positions
4. Record mounting locations and room numbers
5. Extract radio configuration from management system

**Result:** Can display APs on floor plan with proper placement

### Step 4: Add Room Details (varies)
Collect Tier 4 for priority rooms:
1. Identify high-traffic or problem areas
2. Get room schedules from registrar
3. Document known issues from help desk
4. Note special RF considerations

**Result:** Can analyze room-specific usage patterns

### Step 5: Import Historical Data (2-4 hours)
Collect Tier 5:
1. Export 1 week of data from network management
2. Process and aggregate by hour
3. Calculate handoff matrices
4. Identify problem patterns

**Result:** Realistic simulation with actual usage patterns

---

## 📝 Data Collection Templates

### Quick Building Survey Form
```
Building: __________________
Code: __________
Zone: ____  Type: ____________
Coordinates: ___._______°N, ___._______°W
Floors: ____  Square Feet: ________
APs Deployed: ____  Model: __________
Peak Occupancy: ______
Data Collector: __________  Date: ________
```

### AP Location Survey Form
```
AP Name: __________________
MAC: __:__:__:__:__:__
Floor: ____  Room: ________
Location Description: _____________________
Coordinates: X=_____ Y=_____ Height=_____
2.4GHz: Channel __  Power __ dBm
5GHz:   Channel __  Power __ dBm
Notes: _________________________________
```

---

## 🔍 Example: Zachry Engineering Center (ZACH)

### Tier 1 - Basic Info ✅
- Building ID: ZACH
- Name: Zachry Engineering Center
- Zone: 2 (Central Campus)
- Type: Academic
- Coordinates: 30.6187°N, -96.3400°W
- Floors: 4
- Square Feet: ~520,000
- Peak Occupancy: ~2,500
- APs: 48 Juniper AP47
- Construction: 1973

### Tier 2 - Layout ✅
- Floor 1: 14 APs, 4 lecture halls, 8 labs, 25 offices
- Floor 2: 12 APs, 3 classrooms, 10 labs, 30 offices
- Floor 3: 11 APs, 2 classrooms, 6 labs, 35 offices
- Floor 4: 11 APs, research spaces, 30 offices
- Dimensions: ~250ft × 180ft per floor

### Tier 3 - AP Details (example)
```json
{
  "ap_id": "AP-ZACH-1F-001",
  "floor": 1,
  "room": "101",
  "type": "lecture_hall",
  "x": 45.2, "y": 78.5,
  "2.4GHz": {"channel": 6, "power": 14},
  "5GHz": {"channel": 36, "power": 17}
}
```

---

## 🚀 Quick Start: Add Your First Building

**Need immediately:**
1. Building code/name
2. Zone number (1-12)
3. Coordinates (Google Maps right-click → coordinates)
4. Floor count
5. AP count (check network management system)

**That's it to start!** Add more detail as you collect it.

---

## 📞 Where to Get This Information

| Data Type | Source |
|-----------|--------|
| Building names, codes | Facilities/Campus map |
| Coordinates | Google Maps, GIS department |
| Floor plans | Facilities, Architecture dept |
| AP inventory | Network management system |
| AP locations | Network team, site surveys |
| Radio config | Management system exports |
| Usage data | Analytics/reporting tools |
| Problem reports | Help desk tickets |
| Occupancy | Registrar, facilities |

---

## 🎯 Summary

**Minimum to start:** 5 fields (name, code, zone, coordinates, floors)
**Good working data:** Add Tier 2 (floor layout + room counts)
**Full analysis:** Add Tier 3 (AP locations)
**Advanced simulation:** Add Tier 4 & 5 (room details + historical data)

Start minimal and expand as needed!
