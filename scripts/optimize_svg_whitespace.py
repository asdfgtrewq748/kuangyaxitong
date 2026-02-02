#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SVG Whitespace Optimization Script
Automatically detect and remove excess whitespace around SVG content
"""

import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path


def get_element_bounds(element, ns=None):
    """递归获取元素及其子元素的边界框"""
    bounds = None

    # 处理当前元素
    transform = element.get('transform', '')

    # 检查有具体形状的元素
    tags_with_bounds = ['rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path', 'text', 'image', 'use']

    if element.tag.endswith('rect'):
        x = float(element.get('x', 0))
        y = float(element.get('y', 0))
        width = float(element.get('width', 0))
        height = float(element.get('height', 0))
        bounds = (x, y, x + width, y + height)

    elif element.tag.endswith('circle'):
        cx = float(element.get('cx', 0))
        cy = float(element.get('cy', 0))
        r = float(element.get('r', 0))
        bounds = (cx - r, cy - r, cx + r, cy + r)

    elif element.tag.endswith('ellipse'):
        cx = float(element.get('cx', 0))
        cy = float(element.get('cy', 0))
        rx = float(element.get('rx', 0))
        ry = float(element.get('ry', 0))
        bounds = (cx - rx, cy - ry, cx + rx, cy + ry)

    elif element.tag.endswith('line'):
        x1 = float(element.get('x1', 0))
        y1 = float(element.get('y1', 0))
        x2 = float(element.get('x2', 0))
        y2 = float(element.get('y2', 0))
        bounds = (min(x1, x2), min(y1, y2), max(x1, x2), max(y1, y2))

    elif element.tag.endswith('path'):
        d = element.get('d', '')
        if d:
            # 简单的路径解析 - 提取所有数字坐标
            coords = re.findall(r'[MLHVCSQTAZ][^MLHVCSQTAZ]*', d, re.IGNORECASE)
            points = []
            for cmd in coords:
                if cmd:
                    numbers = re.findall(r'-?\d+\.?\d*', cmd)
                    if numbers:
                        points.extend([float(n) for n in numbers])

            # 路径解析比较复杂，这里使用简化方法
            if points:
                # 提取x和y坐标（取决于命令类型）
                x_coords = []
                y_coords = []
                i = 0
                current_x, current_y = 0, 0

                # 更精确的路径解析
                commands = re.findall(r'([MLHVCSQTAZ])\s*([^MLHVCSQTAZ]*)', d, re.IGNORECASE)
                for cmd, coords_str in commands:
                    coords = re.findall(r'-?\d+\.?\d*', coords_str)
                    coords = [float(c) for c in coords]

                    if cmd.upper() == 'M' or cmd.upper() == 'L':
                        for i in range(0, len(coords), 2):
                            if i + 1 < len(coords):
                                if cmd.isupper():
                                    current_x, current_y = coords[i], coords[i + 1]
                                else:
                                    current_x += coords[i]
                                    current_y += coords[i + 1]
                                x_coords.append(current_x)
                                y_coords.append(current_y)

                    elif cmd.upper() == 'H':
                        for x in coords:
                            if cmd.isupper():
                                current_x = x
                            else:
                                current_x += x
                            x_coords.append(current_x)
                            y_coords.append(current_y)

                    elif cmd.upper() == 'V':
                        for y in coords:
                            if cmd.isupper():
                                current_y = y
                            else:
                                current_y += y
                            x_coords.append(current_x)
                            y_coords.append(current_y)

                    elif cmd.upper() == 'C':
                        for i in range(0, len(coords), 6):
                            if i + 5 < len(coords):
                                if cmd.isupper():
                                    current_x, current_y = coords[i + 4], coords[i + 5]
                                else:
                                    current_x += coords[i + 4]
                                    current_y += coords[i + 5]
                                x_coords.append(current_x)
                                y_coords.append(current_y)

                    elif cmd.upper() == 'Z':
                        pass

                if x_coords and y_coords:
                    bounds = (min(x_coords), min(y_coords), max(x_coords), max(y_coords))

    elif element.tag.endswith('text'):
        x = float(element.get('x', 0))
        y = float(element.get('y', 0))
        font_size = float(element.get('font-size', 12))
        text = element.text or ''
        # 估算文本边界
        text_width = len(text) * font_size * 0.6
        bounds = (x, y - font_size, x + text_width, y + font_size * 0.3)

    elif element.tag.endswith('image'):
        x = float(element.get('x', 0))
        y = float(element.get('y', 0))
        width = float(element.get('width', 0))
        height = float(element.get('height', 0))
        bounds = (x, y, x + width, y + height)

    elif element.tag.endswith('use'):
        x = float(element.get('x', 0))
        y = float(element.get('y', 0))
        bounds = (x, y, x, y)  # use元素的边界需要递归查找引用

    # 递归处理子元素
    for child in element:
        child_bounds = get_element_bounds(child, ns)
        if child_bounds:
            if bounds is None:
                bounds = child_bounds
            else:
                bounds = (
                    min(bounds[0], child_bounds[0]),
                    min(bounds[1], child_bounds[1]),
                    max(bounds[2], child_bounds[2]),
                    max(bounds[3], child_bounds[3])
                )

    return bounds


def optimize_svg_whitespace(input_file, output_file=None, padding=10):
    """Optimize SVG file by removing surrounding whitespace"""

    if output_file is None:
        output_file = input_file

    # Read SVG file
    tree = ET.parse(input_file)
    root = tree.getroot()

    # Register namespace
    ns = {'svg': 'http://www.w3.org/2000/svg'}

    # Get current viewBox
    viewbox = root.get('viewBox')
    if viewbox:
        try:
            x, y, width, height = map(float, viewbox.split())
        except:
            print(f"Warning: Cannot parse viewBox '{viewbox}'")
            return False
    else:
        width = float(root.get('width', '0').replace('pt', '').replace('px', ''))
        height = float(root.get('height', '0').replace('pt', '').replace('px', ''))
        x, y = 0, 0

    print(f"\nProcessing: {os.path.basename(input_file)}")
    print(f"  Original viewBox: {x} {y} {width} {height}")

    # Find bounds of all graphic elements
    all_bounds = []

    # Iterate through all child elements
    for elem in root:
        if elem.tag.endswith('g') or elem.tag.endswith('svg'):
            # Handle groups and nested svg
            for child in elem.iter():
                if child.tag.endswith('rect') or child.tag.endswith('circle') or \
                   child.tag.endswith('ellipse') or child.tag.endswith('line') or \
                   child.tag.endswith('path') or child.tag.endswith('text') or \
                   child.tag.endswith('image') or child.tag.endswith('polygon') or \
                   child.tag.endswith('polyline'):
                    bounds = get_element_bounds(child, ns)
                    if bounds:
                        all_bounds.append(bounds)
        else:
            bounds = get_element_bounds(elem, ns)
            if bounds:
                all_bounds.append(bounds)

    if not all_bounds:
        print("  Warning: No graphic elements found")
        return False

    # Calculate total bounds
    min_x = min(b[0] for b in all_bounds)
    min_y = min(b[1] for b in all_bounds)
    max_x = max(b[2] for b in all_bounds)
    max_y = max(b[3] for b in all_bounds)

    print(f"  Content bounds: x={min_x:.2f}, y={min_y:.2f}, width={max_x - min_x:.2f}, height={max_y - min_y:.2f}")

    # Add padding
    min_x -= padding
    min_y -= padding
    max_x += padding
    max_y += padding

    # Calculate new viewBox
    new_x = min_x
    new_y = min_y
    new_width = max_x - min_x
    new_height = max_y - min_y

    # Calculate saved space
    original_area = width * height
    new_area = new_width * new_height
    reduction = (1 - new_area / original_area) * 100

    print(f"  New viewBox: {new_x:.2f} {new_y:.2f} {new_width:.2f} {new_height:.2f}")
    print(f"  Whitespace reduced: {reduction:.1f}%")

    # Update viewBox
    root.set('viewBox', f"{new_x} {new_y} {new_width} {new_height}")

    # If original SVG has fixed width/height attributes, update them
    if root.get('width') and 'pt' in root.get('width'):
        root.set('width', f"{new_width}pt")
    if root.get('height') and 'pt' in root.get('height'):
        root.set('height', f"{new_height}pt")

    # Save optimized file
    tree.write(output_file, encoding='utf-8', xml_declaration=True)
    print(f"  [OK] Saved optimized file")

    return True


def main():
    # MPI algorithm SVG files directory
    svg_dir = Path(r'd:\xiangmu\kuangyaxitong\frontend\public\mpi-algorithm')

    if not svg_dir.exists():
        print(f"Error: Directory does not exist {svg_dir}")
        return

    # Find all SVG files
    svg_files = list(svg_dir.glob('*.svg'))

    if not svg_files:
        print(f"No SVG files found in {svg_dir}")
        return

    print(f"Found {len(svg_files)} SVG files")
    print("=" * 60)

    # Backup original files
    import shutil
    backup_dir = svg_dir / 'backup'
    backup_dir.mkdir(exist_ok=True)
    print(f"\nCreated backup directory: {backup_dir}")

    # Optimize each SVG file
    results = []
    for svg_file in svg_files:
        # Backup
        backup_file = backup_dir / svg_file.name
        if not backup_file.exists():
            shutil.copy2(svg_file, backup_file)
            print(f"  [OK] Backed up: {svg_file.name}")

        # Optimize
        try:
            success = optimize_svg_whitespace(str(svg_file), padding=15)
            results.append((svg_file.name, success))
        except Exception as e:
            print(f"  [ERROR] {e}")
            results.append((svg_file.name, False))

    # Summary
    print("\n" + "=" * 60)
    print("Optimization Complete!")
    print(f"Total: {len(results)} files")
    print(f"Success: {sum(1 for _, s in results if s)} files")
    print(f"Failed: {sum(1 for _, s in results if not s)} files")
    print(f"\nBackup location: {backup_dir}")


if __name__ == '__main__':
    main()
