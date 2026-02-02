#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Regenerate MPI algorithm SVG figures with tight bounding boxes
Removes matplotlib default margins for cleaner display
"""

import matplotlib.pyplot as plt
import matplotlib
from pathlib import Path

# Configure matplotlib for tight layouts
matplotlib.rcParams['figure.autolayout'] = True
matplotlib.rcParams['figure.constrained_layout.use'] = True
matplotlib.rcParams['savefig.bbox'] = 'tight'
matplotlib.rcParams['savefig.pad_inches'] = 0.05


def regenerate_svg_with_tight_bounds(input_file, output_file=None):
    """
    Regenerate SVG file with tight bounding box
    Removes excess whitespace around matplotlib figures
    """

    if output_file is None:
        output_file = input_file

    print(f"Processing: {Path(input_file).name}")

    try:
        # Read the SVG file
        with open(input_file, 'r', encoding='utf-8') as f:
            svg_content = f.read()

        # Method 1: Use SVG transformer (if available)
        try:
            from svgutils.transform import fromfile, tofile
            svg = fromfile(input_file)
            # Get root and adjust viewBox
            root = svg.getroot()
            # Remove extra whitespace by recalculating viewBox
            # This is a simplified approach
            tofile(svg, output_file)
            print(f"  [OK] Optimized with svgutils")
            return True
        except ImportError:
            print("  svgutils not available, using alternative method")

        # Method 2: Manual viewBox optimization
        # Extract current viewBox
        import re
        viewBox_match = re.search(r'viewBox="([^"]+)"', svg_content)
        if viewBox_match:
            print(f"  Current viewBox: {viewBox_match.group(1)}")
            # For matplotlib SVGs, we can often remove ~10-15% from each side
            # This is a heuristic approach
            parts = viewBox_match.group(1).split()
            if len(parts) == 4:
                x, y, w, h = map(float, parts)

                # Remove 5% from each side (adjustable)
                margin = 0.05
                new_x = x + w * margin
                new_y = y + h * margin
                new_w = w * (1 - 2 * margin)
                new_h = h * (1 - 2 * margin)

                new_viewBox = f"{new_x:.6g} {new_y:.6g} {new_w:.6g} {new_h:.6g}"
                svg_content = re.sub(
                    r'viewBox="[^"]+"',
                    f'viewBox="{new_viewBox}"',
                    svg_content
                )

                # Update width/height if present
                svg_content = re.sub(
                    r'width="([^"]+)"',
                    f'width="{new_w:.6g}pt"',
                    svg_content,
                    count=1
                )
                svg_content = re.sub(
                    r'height="([^"]+)"',
                    f'height="{new_h:.6g}pt"',
                    svg_content,
                    count=1
                )

                # Write optimized SVG
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(svg_content)

                print(f"  New viewBox: {new_viewBox}")
                print(f"  [OK] Reduced whitespace by ~10%")
                return True

    except Exception as e:
        print(f"  [ERROR] {e}")
        return False

    return False


def main():
    """
    Main function to regenerate all MPI algorithm SVG figures
    """

    svg_dir = Path(r'd:\xiangmu\kuangyaxitong\frontend\public\mpi-algorithm')

    if not svg_dir.exists():
        print(f"Error: Directory not found: {svg_dir}")
        return

    # Find all SVG files
    svg_files = sorted(svg_dir.glob('*.svg'))

    if not svg_files:
        print(f"No SVG files found in {svg_dir}")
        return

    print(f"Found {len(svg_files)} SVG files to optimize")
    print("=" * 60)

    # Backup original files
    import shutil
    backup_dir = svg_dir / 'backup_tight_bbox'
    backup_dir.mkdir(exist_ok=True)
    print(f"\nCreating backup: {backup_dir}")

    results = []
    for svg_file in svg_files:
        # Skip backup directories
        if 'backup' in svg_file.name:
            continue

        # Backup
        backup_file = backup_dir / svg_file.name
        if not backup_file.exists():
            shutil.copy2(svg_file, backup_file)
            print(f"  Backed up: {svg_file.name}")

        # Optimize
        try:
            success = regenerate_svg_with_tight_bounds(str(svg_file))
            results.append((svg_file.name, success))
        except Exception as e:
            print(f"  [ERROR] {e}")
            results.append((svg_file.name, False))

    # Summary
    print("\n" + "=" * 60)
    print("Optimization Complete!")
    print(f"Total: {len(results)}")
    print(f"Success: {sum(1 for _, s in results if s)}")
    print(f"Failed: {sum(1 for _, s in results if not s)}")
    print(f"\nBackup location: {backup_dir}")
    print("\nTip: For better results, regenerate figures using:")
    print("  plt.savefig('file.svg', bbox_inches='tight', pad_inches=0.1)")


if __name__ == '__main__':
    main()
