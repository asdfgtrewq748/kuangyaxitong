"""
Contour line generator for interpolated grids.

This module provides functions to:
- Generate contour line data from 2D interpolated grids
- Calculate optimal contour levels
- Format contour data for frontend visualization
- Generate high-quality matplotlib contour images
"""

from __future__ import annotations

from typing import Dict, List, Optional
import numpy as np
from scipy.interpolate import splprep, splev
from scipy.ndimage import gaussian_filter
import io
import base64


def calculate_optimal_levels(grid: np.ndarray, method: str = "equal", num_levels: int = 10) -> List[float]:
    """
    Calculate optimal contour levels based on data distribution.

    Args:
        grid: 2D array of interpolated values
        method: Method for calculating levels ("equal", "quantile", "natural")
        num_levels: Number of contour levels

    Returns:
        List of contour level values
    """
    # Remove NaN values
    valid_values = grid[np.isfinite(grid)]

    if len(valid_values) == 0:
        return []

    min_val = float(np.min(valid_values))
    max_val = float(np.max(valid_values))

    if min_val == max_val:
        return [min_val]

    if method == "equal":
        # Equal spacing between min and max
        return list(np.linspace(min_val, max_val, num_levels))

    elif method == "quantile":
        # Based on data distribution
        quantiles = np.linspace(0, 1, num_levels)
        return [float(np.quantile(valid_values, q)) for q in quantiles]

    elif method == "natural":
        # Jenks natural breaks (simplified version using quantiles)
        # For true Jenks, we'd use more complex algorithm
        return calculate_optimal_levels(grid, "quantile", num_levels)

    else:
        return calculate_optimal_levels(grid, "equal", num_levels)


def generate_contours(
    grid: np.ndarray,
    bounds: Dict,
    levels: Optional[List[float]] = None,
    num_levels: int = 10,
    level_method: str = "equal"
) -> Dict:
    """
    Generate contour line data using marching squares algorithm.

    Args:
        grid: 2D array of interpolated values (rows, cols)
        bounds: Dictionary with min_x, max_x, min_y, max_y
        levels: Optional list of contour levels (auto-calculated if None)
        num_levels: Number of contour levels if levels is None
        level_method: Method for calculating levels

    Returns:
        Dictionary with contour data:
        {
            "contours": [
                {
                    "level": 5.0,
                    "paths": [
                        [[x1, y1], [x2, y2], ...],  # First line segment
                        [[x1, y1], [x2, y2], ...],  # Disconnected segment
                    ],
                    "color": "#3b82f6",
                    "label": "5.0m"
                },
                ...
            ],
            "value_range": {"min": 1.5, "max": 18.86}
        }
    """
    try:
        from skimage import measure
    except ImportError:
        # scikit-image not available, return empty contours
        return {"contours": [], "error": "scikit-image not available"}

    # Remove NaN and infinite values
    grid_clean = np.copy(grid)
    grid_clean[~np.isfinite(grid_clean)] = np.nanmean(grid_clean[np.isfinite(grid_clean)])

    if levels is None:
        levels = calculate_optimal_levels(grid_clean, level_method, num_levels)

    if not levels:
        return {"contours": [], "error": "no valid levels"}

    min_x = bounds["min_x"]
    max_x = bounds["max_x"]
    min_y = bounds["min_y"]
    max_y = bounds["max_y"]

    rows, cols = grid_clean.shape

    contours_data = []

    for level in levels:
        # Find contours at this level
        contours = measure.find_contours(grid_clean, level)

        if len(contours) == 0:
            continue

        paths = []
        for contour in contours:
            # contour is an array of (row, col) coordinates
            path_points = []
            for point in contour:
                # Convert (row, col) to (x, y)
                # row 0 corresponds to max_y, row rows-1 corresponds to min_y
                # col 0 corresponds to min_x, col cols-1 corresponds to max_x

                row, col = point[0], point[1]
                x = min_x + (col / (cols - 1)) * (max_x - min_x)
                y = max_y - (row / (rows - 1)) * (max_y - min_y)

                path_points.append([float(x), float(y)])

            if len(path_points) > 1:
                # Smooth the path for better rendering
                smoothed = smooth_contour_path(path_points, n_points=150)
                paths.append(smoothed)

        if paths:
            # Generate color and label for this contour
            color = get_contour_color(level, levels)
            label = format_contour_label(level, bounds)

            contours_data.append({
                "level": float(level),
                "paths": paths,
                "color": color,
                "label": label
            })

    value_range = {
        "min": float(np.min(grid_clean[np.isfinite(grid_clean)])),
        "max": float(np.max(grid_clean[np.isfinite(grid_clean)]))
    }

    return {
        "contours": contours_data,
        "value_range": value_range,
        "levels": levels
    }


def get_contour_color(level: float, levels: List[float]) -> str:
    """
    Generate a color for a contour line based on its level position.

    Args:
        level: The contour level value
        levels: List of all contour levels

    Returns:
        Hex color string
    """
    if not levels:
        return "#3b82f6"

    # Normalize level to 0-1 range
    min_level = min(levels)
    max_level = max(levels)

    if max_level == min_level:
        t = 0.5
    else:
        t = (level - min_level) / (max_level - min_level)

    # Color scheme: blue (low) -> cyan -> green -> yellow -> orange -> red (high)
    colors = [
        (30, 64, 175),    # Deep blue
        (37, 99, 235),    # Blue
        (59, 130, 246),   # Light blue
        (6, 182, 212),    # Cyan
        (16, 185, 129),   # Green
        (132, 204, 22),   # Yellow-green
        (251, 191, 36),   # Yellow
        (251, 146, 60),   # Orange
        (239, 68, 68)     # Red
    ]

    idx = t * (len(colors) - 1)
    i = int(idx)
    f = idx - i

    c1 = colors[min(i, len(colors) - 1)]
    c2 = colors[min(i + 1, len(colors) - 1)]

    r = int(c1[0] + (c2[0] - c1[0]) * f)
    g = int(c1[1] + (c2[1] - c1[1]) * f)
    b = int(c1[2] + (c2[2] - c1[2]) * f)

    return f"#{r:02x}{g:02x}{b:02x}"


def format_contour_label(level: float, bounds: Dict, precision: int = 2) -> str:
    """
    Format a contour level label.

    Args:
        level: The contour level value
        bounds: Dictionary with min_x, max_x, min_y, max_y
        precision: Number of decimal places

    Returns:
        Formatted label string
    """
    return f"{level:.{precision}f}m"


def smooth_contour_path(path: List[List[float]], n_points: int = 200) -> List[List[float]]:
    """
    Smooth a contour path using spline interpolation for high-quality rendering.

    Args:
        path: List of [x, y] points
        n_points: Number of points in the smoothed path

    Returns:
        Smoothed path with more points for smooth rendering
    """
    if len(path) <= 2:
        return path

    path_array = np.array(path)

    # Check if path is closed (first and last points are close)
    is_closed = np.linalg.norm(path_array[0] - path_array[-1]) < 1.0

    try:
        # Use spline interpolation to smooth the path
        if is_closed:
            # For closed contours, add wrap-around point
            path_wrapped = np.vstack([path_array, path_array[0]])
            tck, u = splprep([path_wrapped[:, 0], path_wrapped[:, 1]], s=0, per=True)
            u_new = np.linspace(0, 1, n_points)
            smooth = np.column_stack(splev(tck, u_new))
        else:
            # For open contours
            tck, u = splprep([path_array[:, 0], path_array[:, 1]], s=0, k=min(3, len(path) - 1))
            u_new = np.linspace(0, 1, n_points)
            smooth = np.column_stack(splev(tck, u_new))

        return smooth.tolist()
    except Exception:
        # If spline fails, return original path
        return path


def simplify_path(path: List[List[float]], tolerance: float = 1.0) -> List[List[float]]:
    """
    Simplify a contour path using Douglas-Peucker algorithm.

    Args:
        path: List of [x, y] points
        tolerance: Simplification tolerance

    Returns:
        Simplified path
    """
    if len(path) <= 2:
        return path

    # Simple distance-based simplification
    # For production, use proper Douglas-Peucker
    simplified = [path[0]]

    for point in path[1:]:
        last = simplified[-1]
        dist = np.sqrt((point[0] - last[0])**2 + (point[1] - last[1])**2)
        if dist > tolerance:
            simplified.append(point)

    # Always include the last point
    if simplified[-1] != path[-1]:
        simplified.append(path[-1])

    return simplified


def generate_contours_simplified(
    grid: np.ndarray,
    bounds: Dict,
    levels: Optional[List[float]] = None,
    num_levels: int = 10,
    level_method: str = "equal",
    simplify_tolerance: float = 2.0
) -> Dict:
    """
    Generate simplified contour line data for better frontend rendering.

    This version simplifies the contour paths to reduce data size and improve rendering performance.

    Args:
        grid: 2D array of interpolated values
        bounds: Dictionary with min_x, max_x, min_y, max_y
        levels: Optional list of contour levels
        num_levels: Number of contour levels if levels is None
        level_method: Method for calculating levels
        simplify_tolerance: Tolerance for path simplification

    Returns:
        Dictionary with simplified contour data
    """
    result = generate_contours(grid, bounds, levels, num_levels, level_method)

    if "error" in result or "contours" not in result:
        return result

    # Simplify each contour path
    for contour in result["contours"]:
        simplified_paths = []
        for path in contour["paths"]:
            simplified = simplify_path(path, simplify_tolerance)
            if len(simplified) > 1:
                simplified_paths.append(simplified)
        contour["paths"] = simplified_paths

    # Remove contours with no valid paths
    result["contours"] = [c for c in result["contours"] if len(c["paths"]) > 0]

    return result


def create_filled_contours(
    grid: np.ndarray,
    bounds: Dict,
    levels: Optional[List[float]] = None,
    num_levels: int = 10
) -> Dict:
    """
    Create filled contour regions for choropleth-style visualization.

    This generates polygon data for filled contour areas.

    Args:
        grid: 2D array of interpolated values
        bounds: Dictionary with min_x, max_x, min_y, max_y
        levels: Optional list of contour levels
        num_levels: Number of contour levels

    Returns:
        Dictionary with filled contour data
    """
    try:
        from skimage import measure
    except ImportError:
        return {"regions": [], "error": "scikit-image not available"}

    if levels is None:
        levels = calculate_optimal_levels(grid, "equal", num_levels)

    regions = []
    rows, cols = grid.shape
    min_x, max_x = bounds["min_x"], bounds["max_x"]
    min_y, max_y = bounds["min_y"], bounds["max_y"]

    for i, level in enumerate(levels):
        # Find contours
        contours = measure.find_contours(grid, level)

        for contour in contours:
            # Convert to polygon
            polygon = []
            for point in contour:
                row, col = point[0], point[1]
                x = min_x + (col / (cols - 1)) * (max_x - min_x)
                y = max_y - (row / (rows - 1)) * (max_y - min_y)
                polygon.append([float(x), float(y)])

            if len(polygon) > 2:
                regions.append({
                    "level": float(level),
                    "polygon": polygon,
                    "color": get_contour_color(level, levels),
                    "label": format_contour_label(level, bounds)
                })

    return {"regions": regions}


def generate_matplotlib_contour_image(
    grid: np.ndarray,
    bounds: Dict,
    title: str = "",
    property_name: str = "Thickness",
    levels: Optional[List[float]] = None,
    num_levels: int = 12,
    dpi: int = 300,
    smooth_sigma: float = 1.0,
    colormap: str | List[str] = "YlOrBr"
) -> Dict:
    """
    Generate high-quality matplotlib contour image following Nature/Science publication style.

    This function creates a contour plot with:
    - Gaussian filtered data for smooth contours
    - Filled contours (contourf) with specified colormap
    - Thin black contour lines
    - Inline contour labels
    - Professional colorbar
    - Publication-quality formatting

    Args:
        grid: 2D array of interpolated values
        bounds: Dictionary with min_x, max_x, min_y, max_y
        title: Plot title
        property_name: Name of the property (for labels)
        levels: Optional list of contour levels
        num_levels: Number of contour levels if auto-calculated
        dpi: Image DPI for high-quality output
        smooth_sigma: Gaussian smoothing sigma (higher = smoother)
        colormap: Matplotlib colormap name or custom hex color list

    Returns:
        Dictionary with:
        {
            "image": "base64_encoded_png",
            "format": "png",
            "levels": [1.0, 2.0, ...],
            "value_range": {"min": 1.5, "max": 18.86}
        }
    """
    try:
        import matplotlib
        matplotlib.use('Agg')  # Non-interactive backend
        import matplotlib.pyplot as plt
        from matplotlib.colors import LinearSegmentedColormap
    except ImportError:
        return {"error": "matplotlib not available"}

    # Clean grid data
    grid_clean = np.copy(grid)
    grid_clean[~np.isfinite(grid_clean)] = np.nanmean(grid_clean[np.isfinite(grid_clean)])

    # Calculate levels if not provided
    if levels is None:
        levels = calculate_optimal_levels(grid_clean, "equal", num_levels)

    # Extend levels to include range for filled contours
    levels_array = np.array(levels)
    min_val = float(np.min(grid_clean[np.isfinite(grid_clean)]))
    max_val = float(np.max(grid_clean[np.isfinite(grid_clean)]))

    # Create extended levels for filled contours
    level_step = (max_val - min_val) / num_levels if max_val > min_val else 1.0
    fill_levels = np.arange(
        min_val - level_step,
        max_val + level_step * 2,
        level_step
    )

    # Apply Gaussian smoothing for smoother contours
    if smooth_sigma > 0:
        grid_smooth = gaussian_filter(grid_clean, sigma=smooth_sigma)
    else:
        grid_smooth = grid_clean

    # Create coordinate grid
    rows, cols = grid_clean.shape
    min_x = bounds["min_x"]
    max_x = bounds["max_x"]
    min_y = bounds["min_y"]
    max_y = bounds["max_y"]

    x = np.linspace(min_x, max_x, cols)
    y = np.linspace(min_y, max_y, rows)
    X, Y = np.meshgrid(x, y)

    # Set up publication-style figure
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'Arial Unicode MS', 'DejaVu Sans', 'Arial']
    plt.rcParams['font.size'] = 10
    plt.rcParams['axes.linewidth'] = 1.0
    plt.rcParams['axes.unicode_minus'] = False  # Fix minus sign display

    # Create figure with explicit subplot parameters for consistent padding
    # fig, ax = plt.subplots(figsize=(8, 6), dpi=dpi)
    fig = plt.figure(figsize=(8, 6), dpi=dpi)
    # Use specific subplot position to match frontend expectations
    # [left, bottom, width, height] - matches ~8% padding on all sides
    ax = fig.add_axes([0.10, 0.10, 0.85, 0.80])

    # A. Draw filled contours
    if isinstance(colormap, (list, tuple)):
        cmap = LinearSegmentedColormap.from_list("custom", list(colormap))
    else:
        cmap = colormap

    contour_filled = ax.contourf(
        X, Y, grid_smooth,
        levels=fill_levels,
        cmap=cmap,
        extend='both'
    )

    # B. Draw contour lines
    contour_lines = ax.contour(
        X, Y, grid_smooth,
        levels=levels_array,
        colors='k',
        linewidths=0.6,
        alpha=0.6
    )

    # C. Add inline labels
    ax.clabel(
        contour_lines,
        inline=True,
        fontsize=8,
        fmt='%1.1f米',
        colors='k'
    )

    # Labels and title
    ax.set_xlabel('东向距离 (米)', fontsize=12, weight='bold')
    ax.set_ylabel('北向距离 (米)', fontsize=12, weight='bold')
    ax.set_title(title, fontsize=14, weight='bold', pad=15)

    # Colorbar
    cbar = fig.colorbar(contour_filled, ax=ax, pad=0.03, aspect=30)
    cbar.set_label(
        property_name + ' (米)',
        rotation=270,
        labelpad=20,
        fontsize=12,
        weight='bold'
    )
    cbar.ax.tick_params(labelsize=10)

    # Professional tick styling
    ax.minorticks_on()
    ax.tick_params(which='major', length=6, width=1.0, direction='in')
    ax.tick_params(which='minor', length=3, width=0.5, direction='in', top=True, right=True)
    ax.tick_params(which='major', top=True, right=True)

    # Don't use tight_layout or bbox_inches='tight' to maintain fixed subplot position
    # plt.tight_layout()

    # Save to base64 string with NO bbox_inches cropping
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=dpi, bbox_inches=None, pad_inches=0)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)

    return {
        "image": image_base64,
        "format": "png",
        "levels": levels,
        "value_range": {"min": min_val, "max": max_val}
    }


def generate_dual_contour_images(
    thickness_grid: np.ndarray,
    depth_grid: np.ndarray,
    bounds: Dict,
    seam_name: str,
    levels: Optional[List[float]] = None,
    num_levels: int = 12,
    dpi: int = 300,
    smooth_sigma: float = 1.0
) -> Dict:
    """
    Generate both thickness and burial depth contour images.

    Args:
        thickness_grid: 2D array of thickness values
        depth_grid: 2D array of burial depth values
        bounds: Dictionary with min_x, max_x, min_y, max_y
        seam_name: Name of the coal seam
        levels: Optional list of contour levels
        num_levels: Number of contour levels if auto-calculated
        dpi: Image DPI
        smooth_sigma: Gaussian smoothing sigma

    Returns:
        Dictionary with both images:
        {
            "thickness": {"image": "...", "format": "png", "value_range": {...}},
            "depth": {"image": "...", "format": "png", "value_range": {...}}
        }
    """
    # Generate thickness contour
    thickness_result = generate_matplotlib_contour_image(
        thickness_grid,
        bounds,
        title=f'{seam_name} - 厚度分布',
        property_name='厚度',
        levels=levels,
        num_levels=num_levels,
        dpi=dpi,
        smooth_sigma=smooth_sigma,
        colormap='YlOrBr'
    )

    # Generate burial depth contour (using different colormap)
    depth_result = generate_matplotlib_contour_image(
        depth_grid,
        bounds,
        title=f'{seam_name} - 埋藏深度分布',
        property_name='埋藏深度',
        levels=levels,
        num_levels=num_levels,
        dpi=dpi,
        smooth_sigma=smooth_sigma,
        colormap='viridis'
    )

    return {
        "thickness": thickness_result,
        "depth": depth_result
    }
