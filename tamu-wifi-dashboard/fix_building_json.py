#!/usr/bin/env python3
"""
Fix duplicate floor plans in Ekahau parsed building JSON files.
Keeps only the "Post" variant (or "Existing" if no Post) for each floor.
"""

import json
import sys
from pathlib import Path

def fix_building_json(json_path):
    """Fix a single building JSON file by deduplicating floor plans."""
    
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    # Deduplicate floor plans - keep one per floor number
    floor_info = data.get('floor_info', [])
    
    # Group by floor number
    floors_by_number = {}
    for floor in floor_info:
        floor_num = floor['floor_number']
        if floor_num not in floors_by_number:
            floors_by_number[floor_num] = []
        floors_by_number[floor_num].append(floor)
    
    # For each floor, pick the best variant (prefer Post > Existing > Predictive)
    deduplicated_floors = []
    total_aps = 0
    
    for floor_num in sorted(floors_by_number.keys()):
        variants = floors_by_number[floor_num]
        
        # Priority: Post > Existing > Predictive > old-Post
        best_variant = None
        for priority_label in [' (Post)', ' (Existing)', ' (Predictive)', ' (old-Post)']:
            for variant in variants:
                if priority_label in variant['floor_label']:
                    best_variant = variant
                    break
            if best_variant:
                break
        
        # Fallback to first variant if none match
        if not best_variant:
            best_variant = variants[0]
        
        deduplicated_floors.append(best_variant)
        total_aps += best_variant.get('ap_count', 0)
    
    # Update the data
    data['floor_info'] = deduplicated_floors
    data['building_info']['floors'] = len(deduplicated_floors)
    
    # Fix square footage - sum only the deduplicated floors
    total_sqft = sum(
        floor['dimensions']['width_ft'] * floor['dimensions']['height_ft']
        for floor in deduplicated_floors
    )
    data['building_info']['square_feet'] = int(total_sqft)
    
    # Fix AP count
    data['network_info']['total_aps'] = total_aps
    
    # Write back
    with open(json_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"✅ Fixed {json_path.name}:")
    print(f"   Floors: {data['building_info']['floors']} (was {len(floor_info)})")
    print(f"   Square feet: {data['building_info']['square_feet']:,} (was 13,255,833)")
    print(f"   Total APs: {total_aps}")
    print()

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_building_json.py <building_json_file_or_directory>")
        print("\nExamples:")
        print("  python fix_building_json.py 'TAMU_ 0468 1 EVANS LIBRARY.json'")
        print("  python fix_building_json.py /path/to/buildings/")
        sys.exit(1)
    
    path = Path(sys.argv[1])
    
    if path.is_file():
        # Fix single file
        fix_building_json(path)
    elif path.is_dir():
        # Fix all JSON files in directory
        json_files = list(path.glob('*.json'))
        json_files = [f for f in json_files if f.name != 'buildings_index.json']
        
        print(f"Found {len(json_files)} building files to fix\n")
        
        for json_file in json_files:
            try:
                fix_building_json(json_file)
            except Exception as e:
                print(f"❌ Error fixing {json_file.name}: {e}\n")
    else:
        print(f"Error: {path} is not a valid file or directory")
        sys.exit(1)

if __name__ == '__main__':
    main()
