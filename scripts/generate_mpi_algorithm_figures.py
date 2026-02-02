import os
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from matplotlib import patheffects as pe
from matplotlib.lines import Line2D
import matplotlib.gridspec as gridspec

OUTPUT_DIR = os.path.join("frontend", "public", "mpi-algorithm")

ODI_COLORS = ["#3b82f6", "#facc15", "#fb923c", "#f87171", "#dc2626"]

# Science-style palette (colorblind-friendly, Nature/Science-like)
SCI_COLORS = [
    "#4C72B0",  # blue
    "#55A868",  # green
    "#C44E52",  # red
    "#8172B3",  # purple
    "#CCB974"   # yellow-brown
]
COLOR_ACCENT = SCI_COLORS[0]
COLOR_ACCENT_2 = SCI_COLORS[2]
COLOR_ACCENT_3 = SCI_COLORS[1]
COLOR_GRAY = "#4b5563"
COLOR_LIGHT = "#e5e7eb"


def setup_mpl():
    plt.rcParams.update({
        "figure.dpi": 600,
        "savefig.dpi": 600,
        "font.family": "sans-serif",
        "font.sans-serif": ["Microsoft YaHei", "SimHei", "PingFang SC", "Arial", "DejaVu Sans"],
        "axes.unicode_minus": False,
        "svg.fonttype": "none",
        "pdf.fonttype": 42,
        "font.size": 9.5,
        "axes.linewidth": 1.0,
        "axes.titlesize": 11,
        "axes.labelsize": 10,
        "xtick.labelsize": 8.5,
        "ytick.labelsize": 8.5,
        "xtick.direction": "out",
        "ytick.direction": "out",
        "xtick.major.size": 3.5,
        "ytick.major.size": 3.5,
        "xtick.minor.size": 2.0,
        "ytick.minor.size": 2.0,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "figure.constrained_layout.use": False,
        "axes.grid": False
    })


def ensure_output_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def save_fig(fig, name):
    png_path = os.path.join(OUTPUT_DIR, f"{name}.png")
    svg_path = os.path.join(OUTPUT_DIR, f"{name}.svg")
    fig.savefig(png_path, bbox_inches="tight", facecolor="white")
    fig.savefig(svg_path, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def save_fig_bw(fig, name):
    png_path = os.path.join(OUTPUT_DIR, f"{name}_bw.png")
    svg_path = os.path.join(OUTPUT_DIR, f"{name}_bw.svg")
    fig.savefig(png_path, bbox_inches="tight", facecolor="white")
    fig.savefig(svg_path, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def plot_flow(ax, bw=False):
    ax.axis("off")
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    title_color = "#111827" if bw else COLOR_GRAY
    edge_color = "#111827" if bw else COLOR_ACCENT
    # Use a sharper blue for nodes if colored
    node_stroke = "#1e3a8a" if not bw else "#111827" 
    text_color = "#111827" if bw else "#1e1b4b"
    fill_color = "#ffffff" if bw else "#f8fafc"
    arrow_color = "#4b5563" if bw else "#64748b"

    ax.text(0.01, 0.96, "Figure 1 | MPI 计算流程", fontsize=11, fontweight="bold", color=title_color)
    ax.text(0.01, 0.92, "Sequential Data Flow & Risk Evaluation Pipeline", fontsize=9, color="#6b7280", style='italic')

    # Swimlane vertical distribution
    # We have taller figure now, so we can use y-space more liberally.
    # Lanes y-centers: Input=0.82, Indicators=0.58, Fusion=0.34, Output=0.10
    
    y_centers = [0.82, 0.58, 0.34, 0.10]
    labels = ["I. Input Data", "II. Sub-Indices", "III. Fusion & Grading", "IV. Output"]
    lane_height = 0.22

    # Draw clear swimlane separators or backgrounds
    for y, label in zip(y_centers, labels):
        # Optional: Light background for every other lane or just a label
        # Let's use a very subtle left-side bar or text
        ax.text(0.02, y, label, fontsize=9, fontweight="bold", color="#64748b", ha="left", va="center", rotation=0)
        # Horizontal delimiter line
        if y > 0.15:
             line = Line2D([0.02, 0.98], [y - lane_height/2, y - lane_height/2], 
                          color="#e5e7eb", lw=0.8, linestyle="--")
             ax.add_line(line)

    # Node positions
    input_row = [
        ("钻孔数据", "岩性/厚度"),
        ("煤层参数", "埋深/厚度"),
        ("地质信息", "结构/关键层")
    ]
    x_input = np.linspace(0.25, 0.85, len(input_row))
    y_input = y_centers[0]

    indicator_row = [
        ("RSI", "顶板稳定性"),
        ("BRI", "冲击风险"),
        ("ASI", "支承压力")
    ]
    x_indicator = np.linspace(0.25, 0.85, len(indicator_row))
    y_indicator = y_centers[1]

    fusion_row = [
        ("权重融合", "0.40/0.35/0.25"),
        ("MPI", "综合评分"),
        ("风险等级", "低/中/高")
    ]
    x_fusion = np.linspace(0.25, 0.85, len(fusion_row))
    y_fusion = y_centers[2]

    output_row = [
        ("热力图", "色带/等值线"),
        ("施工建议", "支护/监测")
    ]
    x_output = np.linspace(0.4, 0.7, len(output_row))
    y_output = y_centers[3]

    # Adjusted box size for taller aspect ratio
    box_w, box_h = 0.16, 0.12

    def draw_node(x, y, title, subtitle, index=None):
        # Shadow
        shadow = FancyBboxPatch(
            (x - box_w / 2 + 0.002, y - box_h / 2 - 0.004), box_w, box_h,
            boxstyle="round,pad=0.01,rounding_size=0.03",
            linewidth=0,
            facecolor="#9ca3af",
            alpha=0.2
        )
        ax.add_patch(shadow)

        # Main box
        box = FancyBboxPatch(
            (x - box_w / 2, y - box_h / 2), box_w, box_h,
            boxstyle="round,pad=0.01,rounding_size=0.03",
            linewidth=1.2,
            edgecolor=node_stroke,
            facecolor=fill_color,
            mutation_scale=20
        )
        ax.add_patch(box)

        # Number badge (top-left corner)
        if index is not None:
             # small accent rect
             if not bw:
                 ax.add_patch(FancyBboxPatch(
                     (x - box_w/2, y + box_h/2 - 0.04), 0.04, 0.04,
                     boxstyle="round,pad=0,rounding_size=0.01",
                     facecolor=COLOR_ACCENT, edgecolor="none", zorder=3
                 ))
                 ax.text(x - box_w/2 + 0.02, y + box_h/2 - 0.02, f"{index}", 
                         color="white", fontsize=8, fontweight="bold", ha="center", va="center", zorder=4)
             else:
                 ax.text(x - box_w/2 + 0.02, y + box_h/2 - 0.02, f"{index}", 
                         color="black", fontsize=8, fontweight="bold", ha="center", va="center", zorder=4)

        # Text
        ax.text(x, y + 0.015, title, ha="center", va="center", fontsize=10, 
                color=text_color, fontweight="bold")
        ax.text(x, y - 0.025, subtitle, ha="center", va="center", fontsize=8, 
                color="#4b5563")

    step_index = 1
    for x, (title, subtitle) in zip(x_input, input_row):
        draw_node(x, y_input, title, subtitle, index=step_index)
        step_index += 1
    for x, (title, subtitle) in zip(x_indicator, indicator_row):
        draw_node(x, y_indicator, title, subtitle, index=step_index)
        step_index += 1
    for x, (title, subtitle) in zip(x_fusion, fusion_row):
        draw_node(x, y_fusion, title, subtitle, index=step_index)
        step_index += 1
    for x, (title, subtitle) in zip(x_output, output_row):
        draw_node(x, y_output, title, subtitle, index=step_index)
        step_index += 1

    # Connections - Orthogonal style usually preferred in Science
    # From Input to Indicators
    for x_i, x_next in zip(x_input, x_indicator):
        # Always use straight lines for stability
        conn_style = "arc3,rad=0"
             
        arrow = FancyArrowPatch(
            (x_i, y_input - box_h/2 - 0.005), 
            (x_next, y_indicator + box_h/2 + 0.005),
            arrowstyle="-|>,head_width=3,head_length=5", 
            color=arrow_color, lw=1.2, 
            connectionstyle=conn_style
        )
        ax.add_patch(arrow)

    # From Indicators to Fusion
    for x_i, x_next in zip(x_indicator, x_fusion):
         conn_style = "arc3,rad=0"

         arrow = FancyArrowPatch(
            (x_i, y_indicator - box_h/2 - 0.005), 
            (x_next, y_fusion + box_h/2 + 0.005),
            arrowstyle="-|>,head_width=3,head_length=5", 
            color=arrow_color, lw=1.2,
            connectionstyle=conn_style
        )
         ax.add_patch(arrow)

    # From Fusion to Output
    # Fusion items map to Output items differently.
    # We can connect "Weights" + "MPI" -> "Heatmap"
    # "Risk Level" -> "Construction"
    # But let's keep it simple: 1->1 mostly or converging.
    
    # Connect MPI (center fusion) to Heatmap (left output)
    arrow1 = FancyArrowPatch(
        (x_fusion[1], y_fusion - box_h/2 - 0.005), 
        (x_output[0], y_output + box_h/2 + 0.005),
        arrowstyle="-|>,head_width=3,head_length=5", 
        color=arrow_color, lw=1.2,
        connectionstyle="bar,fraction=0.5"
    )
    ax.add_patch(arrow1)
    
    # Connect Risk Level (right fusion) to Suggestions (right output)
    arrow2 = FancyArrowPatch(
        (x_fusion[2], y_fusion - box_h/2 - 0.005), 
        (x_output[1], y_output + box_h/2 + 0.005),
        arrowstyle="-|>,head_width=3,head_length=5", 
        color=arrow_color, lw=1.2,
        connectionstyle="bar,fraction=-0.5"
    )
    ax.add_patch(arrow2)
    
    # Horizontal flow in Output: Heatmap -> Suggestions (Optional but logical)
    arrow3 = FancyArrowPatch(
        (x_output[0] + box_w/2 + 0.005, y_output), 
        (x_output[1] - box_w/2 - 0.005, y_output),
        arrowstyle="-|>,head_width=3,head_length=5", 
        color=arrow_color, lw=1.2,
    )
    ax.add_patch(arrow3)


def draw_flow_overview():
    # 5:4 Aspect Ratio (Portrait-ish Landscape)
    fig, ax = plt.subplots(figsize=(10.0, 8.0))
    plot_flow(ax, bw=False)
    save_fig(fig, "flow_overview")

    fig, ax = plt.subplots(figsize=(10.0, 8.0))
    plot_flow(ax, bw=True)
    save_fig_bw(fig, "flow_overview")


def plot_rsi(ax, bw=False):
    ax.set_title("RSI 顶板稳定性", loc="left", pad=6, fontweight="bold")
    ax.text(-0.18, 1.04, "A", transform=ax.transAxes, fontsize=10, fontweight="bold")
    components = ["抗拉强度", "关键层", "岩层结构"]
    scores = [40, 25, 30]
    if bw:
        colors = ["#111827", "#6b7280", "#d1d5db"]
    else:
        colors = [COLOR_ACCENT, COLOR_ACCENT_3, COLOR_ACCENT_2]
    bars = ax.barh(components, scores, color=colors, edgecolor="#ffffff", linewidth=0.6)
    ax.set_xlim(0, 60)
    ax.set_xlabel("贡献分值")
    ax.grid(axis="x", linestyle="--", alpha=0.25)
    ax.minorticks_on()
    for bar in bars:
        ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height() / 2,
                f"{bar.get_width():.0f}", va="center", fontsize=8)
    ax.set_axisbelow(True)
    ax.legend(handles=[
        Line2D([0], [0], color=colors[0], lw=6, label="抗拉强度贡献"),
        Line2D([0], [0], color=colors[1], lw=6, label="关键层贡献"),
        Line2D([0], [0], color=colors[2], lw=6, label="结构贡献")
    ], frameon=False, loc="lower right", fontsize=7)


def draw_rsi_stability():
    fig, ax = plt.subplots(figsize=(3.8, 2.6))
    plot_rsi(ax, bw=False)
    save_fig(fig, "rsi_stability")

    fig, ax = plt.subplots(figsize=(3.8, 2.6))
    plot_rsi(ax, bw=True)
    save_fig_bw(fig, "rsi_stability")


def plot_bri(ax, bw=False):
    depth = np.linspace(300, 700, 200)
    critical = 400
    penalty = np.maximum((depth - critical) / 200, 0)
    penalty = np.minimum(penalty, 1) * 40
    bri = 100 - penalty
    band = 3 + 2 * np.sin((depth - 300) / 400 * np.pi)
    band_color = "#e5e7eb" if bw else COLOR_LIGHT
    line_color = "#111827" if bw else COLOR_ACCENT
    ax.fill_between(depth, bri - band, bri + band, color=band_color, alpha=0.85, linewidth=0)
    ax.plot(depth, bri, color=line_color, linewidth=2.0)
    ax.scatter([critical], [100], color="#111827" if bw else "#ef4444", zorder=3, s=25)
    ax.text(critical + 5, 98, "临界深度", fontsize=8, color="#ef4444")
    ax.set_title("BRI 采深影响", loc="left", pad=6, fontweight="bold")
    ax.text(-0.18, 1.04, "B", transform=ax.transAxes, fontsize=10, fontweight="bold")
    ax.set_xlabel("埋深 (m)")
    ax.set_ylabel("BRI 得分")
    ax.set_ylim(50, 102)
    ax.grid(True, linestyle="--", alpha=0.25)
    ax.minorticks_on()
    ax.set_axisbelow(True)
    ax.legend(handles=[
        Line2D([0], [0], color=line_color, lw=2, label="平均趋势"),
        Line2D([0], [0], color=band_color, lw=6, label="不确定度区间")
    ], frameon=False, loc="lower left", fontsize=7)


def draw_bri_curve():
    fig, ax = plt.subplots(figsize=(3.8, 2.6))
    plot_bri(ax, bw=False)
    save_fig(fig, "bri_depth_curve")

    fig, ax = plt.subplots(figsize=(3.8, 2.6))
    plot_bri(ax, bw=True)
    save_fig_bw(fig, "bri_depth_curve")


def plot_asi(ax, bw=False):
    x = np.linspace(0, 1, 200)
    stress = 0.6 + 0.25 * np.exp(-((x - 0.3) ** 2) / 0.02) + 0.15 * np.exp(-((x - 0.7) ** 2) / 0.03)
    fill_color = "#e5e7eb" if bw else "#edf2f7"
    line_color = "#111827" if bw else COLOR_ACCENT
    peak_color = "#4b5563" if bw else COLOR_ACCENT_2
    ax.fill_between(x, stress, color=fill_color, alpha=0.9)
    ax.plot(x, stress, color=line_color, linewidth=2.0)
    ax.scatter([0.3, 0.7], [stress[np.argmin(abs(x-0.3))], stress[np.argmin(abs(x-0.7))]],
               color=peak_color, s=18, zorder=3)
    ax.set_title("ASI 应力传递示意", loc="left", pad=6, fontweight="bold")
    ax.text(-0.18, 1.04, "C", transform=ax.transAxes, fontsize=10, fontweight="bold")
    ax.set_xlabel("推进距离")
    ax.set_ylabel("应力强度")
    ax.set_ylim(0.4, 1.1)
    ax.grid(True, linestyle="--", alpha=0.25)
    ax.minorticks_on()
    ax.set_axisbelow(True)
    ax.legend(handles=[
        Line2D([0], [0], color=line_color, lw=2, label="应力分布"),
        Line2D([0], [0], color=peak_color, marker='o', lw=0, label="峰值点")
    ], frameon=False, loc="upper right", fontsize=7)


def draw_asi_profile():
    fig, ax = plt.subplots(figsize=(3.8, 2.6))
    plot_asi(ax, bw=False)
    save_fig(fig, "asi_stress_profile")

    fig, ax = plt.subplots(figsize=(3.8, 2.6))
    plot_asi(ax, bw=True)
    save_fig_bw(fig, "asi_stress_profile")


def draw_output_colorbar():
    fig, ax = plt.subplots(figsize=(6.6, 1.6))
    ax.axis("off")
    gradient = np.linspace(0, 1, 256).reshape(1, -1)
    ax.imshow(gradient, aspect="auto", cmap=plt.colormaps.get_cmap("RdYlBu_r"), extent=[0, 1, 0, 0.25])
    for i, color in enumerate(ODI_COLORS):
        ax.add_patch(FancyBboxPatch((0.05 + i * 0.18, 0.35), 0.12, 0.18,
                                    boxstyle="round,pad=0.02,rounding_size=0.02",
                                    facecolor=color, edgecolor="none"))
    ax.text(0.0, 0.64, "高风险", fontsize=9.5, color="#ef4444")
    ax.text(0.82, 0.64, "低风险", fontsize=9.5, color="#16a34a")
    ax.text(0.0, -0.05, "MPI 风险色带（ODI）", fontsize=9.5, color="#475569")
    save_fig(fig, "mpi_colorbar")

    # black & white version
    fig, ax = plt.subplots(figsize=(6.6, 1.6))
    ax.axis("off")
    gradient = np.linspace(0, 1, 256).reshape(1, -1)
    ax.imshow(gradient, aspect="auto", cmap="Greys", extent=[0, 1, 0, 0.25])
    for i, color in enumerate(["#111827", "#4b5563", "#9ca3af", "#d1d5db", "#e5e7eb"]):
        ax.add_patch(FancyBboxPatch((0.05 + i * 0.18, 0.35), 0.12, 0.18,
                                    boxstyle="round,pad=0.02,rounding_size=0.02",
                                    facecolor=color, edgecolor="none"))
    ax.text(0.0, 0.64, "高风险", fontsize=9.5, color="#111827")
    ax.text(0.82, 0.64, "低风险", fontsize=9.5, color="#111827")
    ax.text(0.0, -0.05, "MPI 风险色带（黑白版）", fontsize=9.5, color="#111827")
    save_fig_bw(fig, "mpi_colorbar")


def draw_panel_figure():
    fig = plt.figure(figsize=(10.5, 7.0))
    gs = gridspec.GridSpec(2, 3, figure=fig, height_ratios=[1, 1], width_ratios=[1, 1, 1.1])

    ax1 = fig.add_subplot(gs[0, 0])
    ax2 = fig.add_subplot(gs[0, 1])
    ax3 = fig.add_subplot(gs[0, 2])
    ax4 = fig.add_subplot(gs[1, 0:2])
    ax5 = fig.add_subplot(gs[1, 2])

    plot_rsi(ax1, bw=False)
    plot_bri(ax2, bw=False)
    plot_asi(ax3, bw=False)

    ax4.axis("off")
    ax4.text(0.0, 1.02, "D", fontsize=10, fontweight="bold")
    ax4.text(0.02, 0.9, "MPI 计算流程（简图）", fontsize=9.5, fontweight="bold")
    labels = ["输入", "RSI/BRI/ASI", "融合", "MPI", "风险图"]
    x_positions = np.linspace(0.05, 0.95, len(labels))
    for i, (x, label) in enumerate(zip(x_positions, labels)):
        box = FancyBboxPatch((x - 0.06, 0.52), 0.12, 0.25,
                             boxstyle="round,pad=0.02,rounding_size=0.03",
                             linewidth=0.8, edgecolor=COLOR_ACCENT, facecolor="#f9fafb")
        ax4.add_patch(box)
        ax4.text(x, 0.64, label, ha="center", va="center", fontsize=8.5)
        if i < len(labels) - 1:
            ax4.annotate("", xy=(x + 0.07, 0.64), xytext=(x_positions[i + 1] - 0.07, 0.64),
                         arrowprops=dict(arrowstyle="-|>", color="#9ca3af", lw=0.8))

    ax5.axis("off")
    ax5.text(-0.05, 1.02, "E", fontsize=10, fontweight="bold")
    gradient = np.linspace(0, 1, 256).reshape(1, -1)
    ax5.imshow(gradient, aspect="auto", cmap=plt.colormaps.get_cmap("RdYlBu_r"), extent=[0, 1, 0.35, 0.55])
    ax5.text(0.0, 0.62, "高风险", fontsize=8.5, color="#ef4444")
    ax5.text(0.72, 0.62, "低风险", fontsize=8.5, color="#16a34a")
    ax5.text(0.0, 0.2, "MPI 色带", fontsize=8.5, color="#475569")

    fig.suptitle("Figure 2 | MPI 算法原理多面板概览", x=0.02, ha="left", fontsize=10, fontweight="bold")
    fig.tight_layout(rect=[0, 0, 1, 0.96])
    save_fig(fig, "mpi_panels")

    # black & white panel
    fig = plt.figure(figsize=(10.5, 7.0))
    gs = gridspec.GridSpec(2, 3, figure=fig, height_ratios=[1, 1], width_ratios=[1, 1, 1.1])
    ax1 = fig.add_subplot(gs[0, 0])
    ax2 = fig.add_subplot(gs[0, 1])
    ax3 = fig.add_subplot(gs[0, 2])
    ax4 = fig.add_subplot(gs[1, 0:2])
    ax5 = fig.add_subplot(gs[1, 2])

    plot_rsi(ax1, bw=True)
    plot_bri(ax2, bw=True)
    plot_asi(ax3, bw=True)

    ax4.axis("off")
    ax4.text(0.0, 1.02, "D", fontsize=10, fontweight="bold")
    ax4.text(0.02, 0.9, "MPI 计算流程（黑白）", fontsize=9.5, fontweight="bold")
    labels = ["输入", "RSI/BRI/ASI", "融合", "MPI", "风险图"]
    x_positions = np.linspace(0.05, 0.95, len(labels))
    for i, (x, label) in enumerate(zip(x_positions, labels)):
        box = FancyBboxPatch((x - 0.06, 0.52), 0.12, 0.25,
                             boxstyle="round,pad=0.02,rounding_size=0.03",
                             linewidth=0.8, edgecolor="#111827", facecolor="#f9fafb")
        ax4.add_patch(box)
        ax4.text(x, 0.64, label, ha="center", va="center", fontsize=8.5)
        if i < len(labels) - 1:
            ax4.annotate("", xy=(x + 0.07, 0.64), xytext=(x_positions[i + 1] - 0.07, 0.64),
                         arrowprops=dict(arrowstyle="-|>", color="#6b7280", lw=0.8))

    ax5.axis("off")
    ax5.text(-0.05, 1.02, "E", fontsize=10, fontweight="bold")
    gradient = np.linspace(0, 1, 256).reshape(1, -1)
    ax5.imshow(gradient, aspect="auto", cmap="Greys", extent=[0, 1, 0.35, 0.55])
    ax5.text(0.0, 0.62, "高风险", fontsize=8.5, color="#111827")
    ax5.text(0.72, 0.62, "低风险", fontsize=8.5, color="#111827")
    ax5.text(0.0, 0.2, "MPI 色带", fontsize=8.5, color="#111827")

    fig.suptitle("Figure 2 | MPI 算法原理多面板概览（黑白版）", x=0.02, ha="left", fontsize=10, fontweight="bold")
    fig.tight_layout(rect=[0, 0, 1, 0.96])
    save_fig_bw(fig, "mpi_panels")


def main():
    setup_mpl()
    ensure_output_dir()
    draw_flow_overview()
    draw_rsi_stability()
    draw_bri_curve()
    draw_asi_profile()
    # draw_output_colorbar() # Removed per user request
    draw_panel_figure()


if __name__ == "__main__":
    main()
