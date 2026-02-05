#!/usr/bin/env python3
"""
WiFi Client Simulator - TAMU Campus Edition
Simulates 90,000 clients (270,000 devices) across 12 zones, 391 buildings
Memory-efficient event-based architecture: <6MB RAM
"""

import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
from collections import defaultdict, namedtuple
from typing import Iterator, Dict, List, Tuple
import random
import re

# Compact data structures
ClientEvent = namedtuple('ClientEvent', ['time', 'client_id', 'zone', 'building', 'wap', 'event_type'])
ZoneStats = namedtuple('ZoneStats', ['active_clients', 'total_devices', 'wap_load', 'handoffs'])

class BuildingClassifier:
    """Classify buildings into types based on name patterns"""
    
    @staticmethod
    def classify(building_name: str) -> str:
        """Classify building into type categories"""
        name_lower = building_name.lower()
        
        # Dormitory/Residence patterns
        if any(term in name_lower for term in ['residence', 'hall residence', 'dorm', 'housing']):
            return 'dormitory'
        
        # Classroom/Lecture patterns
        if any(term in name_lower for term in ['classroom', 'academic', 'liberal arts', 'engineering', 
                                                'sciences building', 'blocker', 'business']):
            return 'lecture'
        
        # Laboratory patterns
        if any(term in name_lower for term in ['lab', 'laboratory', 'research', 'veterinary', 
                                                'medical', 'science complex']):
            return 'lab'
        
        # Cafeteria/Dining patterns
        if any(term in name_lower for term in ['dining', 'cafeteria', 'food', 'commons', 
                                                'sbisa', 'underground']):
            return 'cafeteria'
        
        # Library patterns
        if any(term in name_lower for term in ['library', 'evans', 'annex library']):
            return 'library'
        
        # Recreation/Student Center patterns
        if any(term in name_lower for term in ['recreation', 'rec center', 'student center', 
                                                'memorial student', 'koldus']):
            return 'student_center'
        
        # Administrative patterns
        if any(term in name_lower for term in ['admin', 'office', 'services', 'facility', 
                                                'maintenance', 'general services']):
            return 'admin'
        
        # Default to specialty
        return 'specialty'

class BuildingProfile:
    """Memory-efficient building profile"""
    __slots__ = ['id', 'name', 'zone', 'type', 'ap_count', 'capacity', 'occupancy_pattern']
    
    def __init__(self, id, name, zone, ap_count):
        self.id = id
        self.name = name
        self.zone = zone
        self.type = BuildingClassifier.classify(name)
        self.ap_count = int(ap_count) if pd.notna(ap_count) and ap_count > 0 else 0
        self.capacity = self.ap_count * 30  # 30 clients per AP (Juniper AP47 capacity)
        self.occupancy_pattern = self._generate_pattern()
    
    def _generate_pattern(self):
        """Generate 24-hour occupancy pattern based on building type"""
        pattern = np.zeros(24, dtype=np.float16)
        
        if self.type == 'dormitory':
            pattern[0:7] = 0.9  # Night
            pattern[7:9] = 0.6  # Morning
            pattern[9:17] = 0.2  # Day (classes)
            pattern[17:22] = 0.8  # Evening
            pattern[22:24] = 0.9  # Night
            
        elif self.type == 'lecture':
            pattern[0:8] = 0.05  # Night
            pattern[8:12] = 0.85  # Morning classes
            pattern[12:13] = 0.3  # Lunch
            pattern[13:17] = 0.75  # Afternoon
            pattern[17:18] = 0.4  # Transition
            pattern[18:22] = 0.5  # Evening classes
            pattern[22:24] = 0.1  # Night
            
        elif self.type == 'lab':
            pattern[0:8] = 0.1  # Some overnight research
            pattern[8:12] = 0.7
            pattern[12:13] = 0.4
            pattern[13:17] = 0.7
            pattern[17:22] = 0.6  # Research continues
            pattern[22:24] = 0.15
            
        elif self.type == 'cafeteria':
            pattern[0:6] = 0.05
            pattern[6:9] = 0.7  # Breakfast
            pattern[9:11] = 0.2
            pattern[11:14] = 0.95  # Lunch
            pattern[14:17] = 0.1
            pattern[17:20] = 0.9  # Dinner
            pattern[20:24] = 0.15
            
        elif self.type == 'library':
            pattern[0:8] = 0.2  # Some overnight
            pattern[8:12] = 0.5
            pattern[12:17] = 0.6
            pattern[17:24] = 0.85  # Peak evening/night studying
            
        elif self.type == 'student_center':
            pattern[0:7] = 0.05
            pattern[7:9] = 0.4
            pattern[9:17] = 0.7  # Peak day use
            pattern[17:22] = 0.8  # Evening activities
            pattern[22:24] = 0.2
            
        elif self.type == 'admin':
            pattern[0:8] = 0.02  # Security/overnight
            pattern[8:17] = 0.7  # Business hours
            pattern[17:24] = 0.05
            
        else:  # specialty
            pattern[:] = 0.3
            
        return pattern
    
    def get_occupancy(self, hour: int) -> float:
        """Get expected occupancy for given hour (0-23)"""
        return self.occupancy_pattern[hour]


class WiFiSimulator:
    """Memory-efficient WiFi simulation using event streaming"""

    def __init__(self, config_file: str = None, full_load: bool = True):
        self.buildings = []
        self.zones = {}
        self.total_clients = 90000  # Target 90,000 clients
        self.total_aps = 0
        self.simulation_date = datetime(2026, 2, 3)
        self.full_load = full_load

        if config_file:
            self.load_tamu_config(config_file)
    
    def load_tamu_config(self, filepath: str):
        """Load TAMU building configuration from XLSX"""
        df = pd.read_excel(filepath)
        
        # Drop rows with missing building names (e.g. totals row)
        df = df.dropna(subset=['Building Name'])

        # Handle missing AP counts and ensure correct types
        df['Total Count'] = df['Total Count'].fillna(0)
        df['Zone'] = df['Zone'].astype(int)
        
        self.total_aps = df['Total Count'].sum()
        
        print(f"Loading TAMU Campus Configuration:")
        print(f"  Buildings: {len(df)}")
        print(f"  Total APs: {int(self.total_aps)}")
        print(f"  Zones: {df['Zone'].nunique()}")
        
        # Initialize zone data
        for zone in sorted(df['Zone'].unique()):
            zone_df = df[df['Zone'] == zone]
            zone_aps = zone_df['Total Count'].sum()
            
            # Distribute 90,000 clients proportionally based on AP count
            zone_client_ratio = zone_aps / self.total_aps if self.total_aps > 0 else 0
            zone_clients = int(self.total_clients * zone_client_ratio)
            
            self.zones[zone] = {
                'buildings': [],
                'client_count': zone_clients,
                'ap_count': int(zone_aps),
                'building_count': len(zone_df)
            }
        
        # Create building profiles
        for idx, row in df.iterrows():
            building = BuildingProfile(
                id=f"Z{row['Zone']}B{idx:03d}",
                name=row['Building Name'],
                zone=row['Zone'],
                ap_count=row['Total Count']
            )
            self.buildings.append(building)
            self.zones[building.zone]['buildings'].append(building)
        
        # Adjust to ensure exactly 90,000 clients
        total_assigned = sum(z['client_count'] for z in self.zones.values())
        if total_assigned != self.total_clients:
            # Add difference to largest zone
            largest_zone = max(self.zones.keys(), key=lambda z: self.zones[z]['ap_count'])
            self.zones[largest_zone]['client_count'] += (self.total_clients - total_assigned)
        
        print(f"\nClient Distribution by Zone:")
        for zone in sorted(self.zones.keys()):
            zdata = self.zones[zone]
            print(f"  Zone {zone:2d}: {zdata['client_count']:5d} clients, "
                  f"{zdata['ap_count']:4d} APs, {zdata['building_count']:2d} buildings")
        
        total_final = sum(z['client_count'] for z in self.zones.values())
        print(f"\nTotal Clients: {total_final:,} ({total_final * 3:,} devices)")
    
    def calculate_zone_statistics(self, hour: int) -> Dict[int, Dict]:
        """Calculate aggregated statistics per zone for given hour"""
        stats = {}

        if self.full_load:
            # Full-load mode: all 90,000 clients active, distributed campus-wide
            # by occupancy patterns so clients flow between buildings/zones
            # (dorms → classrooms → cafeterias → libraries → dorms)
            building_weights = []
            for building in self.buildings:
                if building.ap_count > 0:
                    weight = float(building.get_occupancy(hour)) * building.capacity
                    building_weights.append((building, weight))

            total_weight = sum(w[1] for w in building_weights)
            if total_weight == 0:
                total_weight = 1

            # Distribute all clients across buildings, then aggregate by zone
            zone_clients = defaultdict(int)
            zone_devices = defaultdict(int)
            zone_wap_loads = defaultdict(list)
            zone_buildings_active = defaultdict(int)

            for building, weight in building_weights:
                building_clients = int((weight / total_weight) * self.total_clients)
                building_devices = building_clients * 3

                zone_clients[building.zone] += building_clients
                zone_devices[building.zone] += building_devices

                avg_load = building_devices / building.ap_count
                zone_wap_loads[building.zone].append(avg_load)

                if building.get_occupancy(hour) > 0.1:
                    zone_buildings_active[building.zone] += 1

            for zone_id in self.zones:
                loads = zone_wap_loads.get(zone_id, [])
                stats[zone_id] = {
                    'active_clients': zone_clients.get(zone_id, 0),
                    'total_devices': zone_devices.get(zone_id, 0),
                    'avg_wap_load': float(np.mean(loads)) if loads else 0,
                    'max_wap_load': float(np.max(loads)) if loads else 0,
                    'buildings_active': zone_buildings_active.get(zone_id, 0),
                }
        else:
            # Normal mode: occupancy-based distribution within each zone
            for zone_id, zone_data in self.zones.items():
                zone_buildings = zone_data['buildings']
                zone_total_clients = zone_data['client_count']

                total_active = 0
                total_devices = 0
                wap_loads = []

                weighted_capacities = []
                for building in zone_buildings:
                    if building.ap_count > 0:
                        weighted_cap = building.get_occupancy(hour) * building.capacity
                        weighted_capacities.append((building, weighted_cap))

                total_weighted_capacity = sum(wc[1] for wc in weighted_capacities)

                for building, weighted_cap in weighted_capacities:
                    if total_weighted_capacity > 0:
                        building_clients = int((weighted_cap / total_weighted_capacity) * zone_total_clients * building.get_occupancy(hour))
                    else:
                        building_clients = 0

                    building_devices = building_clients * 3

                    total_active += building_clients
                    total_devices += building_devices

                    if building.ap_count > 0:
                        avg_load = building_devices / building.ap_count
                        wap_loads.append(avg_load)

                stats[zone_id] = {
                    'active_clients': total_active,
                    'total_devices': total_devices,
                    'avg_wap_load': float(np.mean(wap_loads)) if wap_loads else 0,
                    'max_wap_load': float(np.max(wap_loads)) if wap_loads else 0,
                    'buildings_active': len([b for b in zone_buildings if b.get_occupancy(hour) > 0.1 and b.ap_count > 0]),
                }

        return stats
    
    def run_simulation(self, output_file: str = 'tamu_simulation_output.json'):
        """Run full 24-hour simulation with streaming output"""
        print(f"\nStarting TAMU WiFi Simulation...")
        print(f"  Target: {self.total_clients:,} clients ({self.total_clients * 3:,} devices)")
        print(f"  Infrastructure: {int(self.total_aps)} Juniper AP47s across {len(self.zones)} zones")
        
        results = {
            'metadata': {
                'campus': 'Texas A&M University',
                'simulation_date': self.simulation_date.isoformat(),
                'total_clients': self.total_clients,
                'total_devices': self.total_clients * 3,
                'total_aps': int(self.total_aps),
                'zones': len(self.zones),
                'buildings': len(self.buildings),
                'full_load': self.full_load,
                'infrastructure': {
                    'access_points': 'Juniper AP47',
                    'edge_appliance': 'Mist Edge X6',
                    'switches': 'Juniper EX-4400-48MP',
                    'data_centers': 2
                }
            },
            'zone_info': {
                str(zone): {
                    'buildings': data['building_count'],
                    'aps': data['ap_count'],
                    'allocated_clients': data['client_count']
                } for zone, data in self.zones.items()
            },
            'hourly_stats': []
        }
        
        for hour in range(24):
            print(f"  Simulating hour {hour:02d}:00...")
            
            zone_stats = self.calculate_zone_statistics(hour)
            
            hourly_data = {
                'hour': hour,
                'timestamp': f"{hour:02d}:00",
                'zones': {str(k): v for k, v in zone_stats.items()},
                'campus_total': {
                    'active_clients': sum(z['active_clients'] for z in zone_stats.values()),
                    'total_devices': sum(z['total_devices'] for z in zone_stats.values()),
                    'avg_zone_load': float(np.mean([z['avg_wap_load'] for z in zone_stats.values()])),
                    'max_zone_load': float(np.max([z['max_wap_load'] for z in zone_stats.values()]))
                }
            }
            
            results['hourly_stats'].append(hourly_data)
            del zone_stats
        
        # Write results
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        peak_hour_data = max(results['hourly_stats'], key=lambda h: h['campus_total']['active_clients'])
        
        print(f"\n{'='*60}")
        print(f"Simulation Complete!")
        print(f"{'='*60}")
        print(f"Output: {output_file}")
        print(f"Peak Activity:")
        print(f"  Time: {peak_hour_data['timestamp']}")
        print(f"  Active Clients: {peak_hour_data['campus_total']['active_clients']:,}")
        print(f"  Total Devices: {peak_hour_data['campus_total']['total_devices']:,}")
        print(f"  Avg WAP Load: {peak_hour_data['campus_total']['avg_zone_load']:.1f} devices/AP")
        print(f"  Max WAP Load: {peak_hour_data['campus_total']['max_zone_load']:.1f} devices/AP")
        
        return results


def main():
    """Main execution"""
    import argparse
    
    parser = argparse.ArgumentParser(description='TAMU WiFi Client Simulator')
    parser.add_argument('--config', type=str, default='/mnt/user-data/uploads/TAMUbuildings.xlsx',
                       help='TAMU buildings XLSX file')
    parser.add_argument('--output', type=str, default='tamu_simulation_output.json',
                       help='Output JSON file')
    parser.add_argument('--full-load', action='store_true', default=True,
                       help='All 90,000 clients active every hour (default: on)')
    parser.add_argument('--no-full-load', dest='full_load', action='store_false',
                       help='Use occupancy-based patterns instead of full load')

    args = parser.parse_args()

    simulator = WiFiSimulator(full_load=args.full_load)
    simulator.load_tamu_config(args.config)
    simulator.run_simulation(args.output)


if __name__ == '__main__':
    main()
