#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple SVG viewBox optimizer using matplotlib and svgutils
Removes whitespace by calculating tight bounding box
"""

import os
import re
from pathlib import Path
import xml.etree.ElementTree as ET


def get_svg_content_bounds(svg_content):
    """Extract actual content bounds from SVG"""
    root = ET.fromstring(svg_content)

    # Find all path, rect, circle, text elements
    all_coords = []

    def collect_coords(element):
        # Get coordinates from transform
        transform = element.get('transform', '')

        # Process different element types
        if 'path' in element.tag:
            d = element.get('d', '')
            # Extract all coordinates from path data
            numbers = re.findall(r'-?\d+\.?\d*', d)
            coords = [float(n) for n in numbers]
            # Path coordinates are in x,y pairs
            for i in range(0, len(coords) - 1, 2):
                all_coords.append((coords[i], coords[i + 1]))

        elif element.tag.endswith('rect'):
            x = float(element.get('x', 0))
            y = float(element.get('y', 0))
            w = float(element.get('width', 0))
            h = float(element.get('height', 0))
            all_coords.extend([
                (x, y), (x + w, y), (x, y + h), (x + w, y + h)
            ])

        elif element.tag.endswith('circle'):
            cx = float(element.get('cx', 0))
            cy = float(element.get('cy', 0))
            r = float(element.get('r', 0))
            all_coords.extend([
                (cx - r, cy - r), (cx + r, cy - r),
                (cx - r, cy + r), (cx + r, cy + r)
            ])

        elif element.tag.endswith('text'):
            x = float(element.get('x', 0))
            y = float(element.get('y', 0))
            all_coords.append((x, y))

        elif element.tag.endswith('line'):
            x1 = float(element.get('x1', 0))
            y1 = float(element.get('y1', 0))
            x2 = float(element.get('x2', 0))
            y2 = float(element.get('y2', 0))
            all_coords.append((x1, y1))
            all_coords.append((x2, y2))

        # Recursively process child elements
        for child in element:
            collect_coords(child)

    # Start collection from root
    for elem in root:
        collect_coords(elem)

    if not all_coords:
        return None

    # Calculate bounds
    min_x = min(c[0] for c in all_coords)
    max_x = max(c[0] for c in all_coords)
    min_y = min(c[1] for c in all_coords)
    max_y = max(c[1] for c in all_coords)

    return {
        'min_x': min_x,
        'max_x': max_x,
        'min_y': min_y,
        'max_y': max_y,
        'width': max_x - min_x,
        'height': max_y - min_y
    }


def optimize_svg_viewbox(file_path, padding=10):
    """Optimize SVG by adjusting viewBox to content bounds"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"\nProcessing: {os.path.basename(file_path)}")

    # Get current viewBox
    viewBox_match = re.search(r'viewBox="([^"]+)"', content)
    if not viewBox_match:
        print("  [SKIP] No viewBox found")
        return False

    current_vb = viewBox_match.group(1)
    parts = current_vb.split()
    if len(parts) != 4:
        print(f"  [SKIP] Invalid viewBox: {current_vb}")
        return False

    orig_x, orig_y, orig_w, orig_h = map(float, parts)
    print(f"  Current viewBox: {orig_x} {orig_y} {orig_w} {orig_h}")

    # Get content bounds
    bounds = get_svg_content_bounds(content)
    if not bounds:
        print("  [SKIP] No content found")
        return False

    print(f"  Content bounds: x={bounds['min_x']:.2f}, y={bounds['min_y']:.2f}, "
          f"w={bounds['width']:.2f}, h={bounds['height']:.2f}")

    # Calculate new viewBox with padding
    new_x = bounds['min_x'] - padding
    new_y = bounds['min_y'] - padding
    new_w = bounds['width'] + padding * 2
    new_h = bounds['height'] + padding * 2

    # Check if optimization would reduce size
    orig_area = orig_w * orig_h
    new_area = new_w * new_h

    if new_area >= orig_area:
        print("  [SKIP] Content is larger than current viewBox")
        return False

    reduction = (1 - new_area / orig_area) * 100
    print(f"  New viewBox: {new_x:.2f} {new_y:.2f} {new_w:.2f} {new_h:.2f}")
    print(f"  Size reduction: {reduction:.1f}%")

    # Update viewBox in content
    new_vb = f"{new_x:.6g} {new_y:.6g} {new_w:.6g} {new_h:.6g}"
    content = re.sub(r'viewBox="[^"]+"', f'viewBox="{new_vb}"', content)

    # Also update width/height if present
    width_match = re.search(r'width="([^"]+)"', content)
    height_match = re.search(r'height="([^"]+)"', content)

    if width_match and 'pt' in width_match.group(1):
        content = re.sub(r'width="[^"]+"', f'width="{new_w:.6g}pt"', content, count=1)
    if height_match and 'pt' in height_match.group(1):
        content = re.sub(r'height="[^"]+"', f'height="{new_h:.6g}pt"', content, count=1)

    # Write optimized content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("  [OK] File optimized")
    return True


def main():
    svg_dir = Path(r'd:\xiangmu\kuangyaxitong\frontend\public\mpi-algorithm')

    if not svg_dir.exists():
        print(f"Error: Directory not found: {svg_dir}")
        return

    svg_files = sorted(svg_dir.glob('*.svg'))

    if not svg_files:
        print(f"No SVG files found in {svg_dir}")
        return

    print(f"Found {len(svg_files)} SVG files")
    print("=" * 60)

    # Backup
    import shutil
    backup_dir = svg_dir / 'backup_before_optimize'
    backup_dir.mkdir(exist_ok=True)

    results = []
    for svg_file in svg_files:
        # Backup
        backup_file = backup_dir / svg_file.name
        if not backup_file.exists():
            shutil.copy2(svg_file, backup_file)

        # Optimize
        try:
            success = optimize_svg_viewbox(str(svg_file), padding=10)
            results.append((svg_file.name, success))
        except Exception as e:
            print(f"  [ERROR] {e}")
            results.append((svg_file.name, False))

    # Summary
    print("\n" + "=" * 60)
    print("Optimization Complete!")
    print(f"Total: {len(results)}")
    print(f"Optimized: {sum(1 for _, s in results if s)}")
    print(f"Skipped: {sum(1 for _, s in results if not s)}")
    print(f"\nBackup: {backup_dir}")


if __name__ == '__main__':
    main()
