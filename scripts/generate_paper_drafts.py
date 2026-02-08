from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path
from typing import Dict, List, Optional

from docx import Document
from docx.enum.section import WD_SECTION_START
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Cm, Pt


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "papers"
OUT_DIR.mkdir(parents=True, exist_ok=True)

EN_OUT = OUT_DIR / "MPI_Science_Style_Draft_EN.docx"
ZH_OUT = OUT_DIR / "MPI_煤炭学报格式_中文初稿.docx"

FIGURES = [
    {
        "path": ROOT / "frontend" / "public" / "mpi-algorithm" / "flow_overview.png",
        "en": "Figure 1. End-to-end workflow of the current MPI prototype.",
        "zh": "图1 当前MPI原型系统流程总览。",
    },
    {
        "path": ROOT / "frontend" / "public" / "mpi-algorithm" / "rsi_stability.png",
        "en": "Figure 2. RSI stability response under roof-mechanical scenarios.",
        "zh": "图2 RSI顶板稳定性响应曲线。",
    },
    {
        "path": ROOT / "frontend" / "public" / "mpi-algorithm" / "bri_depth_curve.png",
        "en": "Figure 3. BRI trend with mining depth and energy accumulation factors.",
        "zh": "图3 BRI随埋深与能量因子变化曲线。",
    },
    {
        "path": ROOT / "frontend" / "public" / "mpi-algorithm" / "asi_stress_profile.png",
        "en": "Figure 4. ASI-UST stress distribution profile.",
        "zh": "图4 ASI-UST应力分布剖面。",
    },
    {
        "path": ROOT / "frontend" / "public" / "mpi-algorithm" / "mpi_panels.png",
        "en": "Figure 5. Multi-indicator panels (RSI/BRI/ASI/MPI).",
        "zh": "图5 多指标综合面板（RSI/BRI/ASI/MPI）。",
    },
]


def _set_style_font(style, ascii_font: str, east_asia_font: str, size_pt: int, bold: bool = False) -> None:
    style.font.name = ascii_font
    style.font.size = Pt(size_pt)
    style.font.bold = bold
    style._element.rPr.rFonts.set(qn("w:eastAsia"), east_asia_font)


def _setup_page(doc: Document, *, a4: bool = True) -> None:
    for section in doc.sections:
        section.top_margin = Cm(2.5)
        section.bottom_margin = Cm(2.5)
        section.left_margin = Cm(2.5)
        section.right_margin = Cm(2.5)
        if a4:
            section.page_width = Cm(21.0)
            section.page_height = Cm(29.7)


def _configure_en_styles(doc: Document) -> None:
    _set_style_font(doc.styles["Normal"], "Times New Roman", "Times New Roman", 12)
    _set_style_font(doc.styles["Heading 1"], "Times New Roman", "Times New Roman", 14, bold=True)
    _set_style_font(doc.styles["Heading 2"], "Times New Roman", "Times New Roman", 12, bold=True)
    for style_name in ("Normal", "Heading 1", "Heading 2"):
        p = doc.styles[style_name].paragraph_format
        p.line_spacing = 2.0
        p.space_before = Pt(0)
        p.space_after = Pt(6)


def _configure_zh_styles(doc: Document) -> None:
    _set_style_font(doc.styles["Normal"], "Times New Roman", "宋体", 12)
    _set_style_font(doc.styles["Heading 1"], "Times New Roman", "黑体", 14, bold=True)
    _set_style_font(doc.styles["Heading 2"], "Times New Roman", "黑体", 12, bold=True)
    for style_name in ("Normal", "Heading 1", "Heading 2"):
        p = doc.styles[style_name].paragraph_format
        p.line_spacing = 1.5
        p.space_before = Pt(0)
        p.space_after = Pt(6)


def _add_center_paragraph(doc: Document, text: str, size: int = 12, bold: bool = False, east_asia_font: str = "宋体") -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.name = "Times New Roman"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), east_asia_font)


def _add_figure(doc: Document, image_path: Path, caption: str) -> None:
    if not image_path.exists():
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.add_picture(str(image_path), width=Cm(15.8))
    cap = doc.add_paragraph(caption)
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER


def _run_demo_experiments() -> Optional[Dict]:
    """
    Build a tiny reproducible demo split and collect current pipeline metrics.
    This is for draft-table scaffolding only, not publication-grade claims.
    """
    try:
        sys.path.insert(0, str(ROOT / "backend"))
        from app.services.research_manager import (
            create_split_manifest,
            register_dataset_manifest,
            run_experiment,
        )

        base = Path(tempfile.mkdtemp(prefix="mpi_paper_demo_"))
        os.environ["DATA_DIR"] = str(base)
        dataset_id = "paper_demo"
        csv_path = base / f"{dataset_id}.csv"
        csv_path.write_text(
            "sample_id,borehole_name,event_time,elastic_modulus,friction_angle,cohesion,thickness,label\n"
            "1,BH01,2025-01-01,18,28,2.5,8,1\n"
            "2,BH01,2025-01-02,17,29,2.3,7,0\n"
            "3,BH02,2025-01-03,23,33,3.0,10,1\n"
            "4,BH02,2025-01-04,22,32,3.1,9,1\n"
            "5,BH03,2025-01-05,14,26,1.8,6,0\n"
            "6,BH03,2025-01-06,13,25,1.7,5,0\n"
            "7,BH04,2025-01-07,21,31,2.9,9,1\n"
            "8,BH04,2025-01-08,20,30,2.8,8,0\n",
            encoding="utf-8",
        )

        manifest = register_dataset_manifest(
            dataset_id=dataset_id,
            label_schema={
                "label_column": "label",
                "positive_values": [1],
                "event_definition": "roof_pressure_event",
                "time_window_hours": 24,
            },
            description="draft table demo only",
        )
        split = create_split_manifest(
            dataset_id=dataset_id,
            strategy="borehole_block",
            train_ratio=0.5,
            val_ratio=0.25,
            test_ratio=0.25,
            seed=11,
            time_column="event_time",
            borehole_column="borehole_name",
        )

        def _exp(model_type: str, name: str) -> Dict:
            return run_experiment(
                {
                    "dataset_id": dataset_id,
                    "dataset_version": manifest["dataset_version"],
                    "split_id": split["split_id"],
                    "experiment_name": name,
                    "model_type": model_type,
                    "target_label_column": "label",
                    "seed": 123,
                }
            )

        baseline = _exp("baseline", "baseline_v1")
        rsi = _exp("rsi_phase_field", "rsi_phasefield_v1")
        asi = _exp("asi_ust", "asi_ust_v1")
        return {
            "dataset_note": f"demo split with {manifest['row_count']} samples",
            "rows": [
                ("Baseline", baseline["metrics"]),
                ("RSI-PhaseField", rsi["metrics"]),
                ("ASI-UST", asi["metrics"]),
            ],
        }
    except Exception:
        return None


def _add_metrics_table(doc: Document, title: str, metrics_data: Optional[Dict], zh: bool = False) -> None:
    doc.add_heading(title, level=2)
    headers = ["Model", "AUC", "PR-AUC", "Brier", "F1", "MAE", "RMSE", "p"]
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    for idx, h in enumerate(headers):
        table.rows[0].cells[idx].text = h if not zh else {
            "Model": "模型",
            "AUC": "AUC",
            "PR-AUC": "PR-AUC",
            "Brier": "Brier",
            "F1": "F1",
            "MAE": "MAE",
            "RMSE": "RMSE",
            "p": "显著性p",
        }[h]

    if metrics_data:
        for model_name, m in metrics_data["rows"]:
            row = table.add_row().cells
            row[0].text = model_name
            row[1].text = f"{m.get('auc', 0):.4f}"
            row[2].text = f"{m.get('pr_auc', 0):.4f}"
            row[3].text = f"{m.get('brier', 0):.4f}"
            row[4].text = f"{m.get('f1', 0):.4f}"
            row[5].text = f"{m.get('mae', 0):.4f}"
            row[6].text = f"{m.get('rmse', 0):.4f}"
            p_val = m.get("paired_significance_p")
            row[7].text = "-" if p_val is None or str(p_val) == "nan" else f"{float(p_val):.4g}"
        note = (
            f"Note: The table reports preliminary reproducibility results ({metrics_data['dataset_note']}) for draft structure only."
            if not zh
            else f"注：该表为当前可复现实验流水线的演示结果（{metrics_data['dataset_note']}），仅用于初稿结构展示。"
        )
        doc.add_paragraph(note)
    else:
        fallback = (
            "Preliminary metric table placeholder. Replace with strict real-label runs before submission."
            if not zh
            else "预留结果表：投稿前请替换为真实标签严格实验结果。"
        )
        doc.add_paragraph(fallback)


def build_en_doc(metrics_data: Optional[Dict]) -> None:
    doc = Document()
    _setup_page(doc, a4=False)
    _configure_en_styles(doc)

    _add_center_paragraph(
        doc,
        "Physics-Informed Multi-Indicator Framework for Mine Pressure Assessment: "
        "A Reproducible RSI-PhaseField and ASI-UST Prototype",
        size=16,
        bold=True,
        east_asia_font="Times New Roman",
    )
    _add_center_paragraph(doc, "Author A1, Author B2, Author C1,*", size=12, east_asia_font="Times New Roman")
    _add_center_paragraph(doc, "1 School/Institute Name; 2 Industry Partner; *Corresponding author", size=11, east_asia_font="Times New Roman")
    _add_center_paragraph(doc, "One-sentence Summary: A reproducible prototype links roof, burst, and abutment mechanics into a unified MPI workflow.", size=11, east_asia_font="Times New Roman")

    doc.add_heading("Abstract", level=1)
    doc.add_paragraph(
        "This draft presents a reproducible mine-pressure assessment prototype that integrates roof stability "
        "(RSI), burst risk (BRI), and abutment stress (ASI) into a weighted MPI framework. The current implementation "
        "combines a finite-difference phase-field module for RSI and a unified-strength-theory (UST) analytical module "
        "for ASI, while preserving a transparent baseline engine for comparison. A dedicated research API fixes "
        "dataset versions, split manifests, leakage audits, experiment specs, and artifact archiving, enabling "
        "traceable evidence chains for manuscript preparation. We summarize the present algorithmic basis, reproducibility "
        "protocol, and preliminary demonstration results on a development split. Although the present data scale is not "
        "sufficient for publication claims, the system-level architecture and evaluation contract establish a practical "
        "foundation for strict real-label validation and near-term SCI submissions."
    )
    doc.add_paragraph("Keywords: mine pressure; phase-field fracture; unified strength theory; reproducibility; risk assessment")

    doc.add_heading("Main Text", level=1)
    doc.add_heading("1. Introduction", level=2)
    doc.add_paragraph(
        "Conventional mine-pressure assessment pipelines often mix empirical formulas with undocumented assumptions, "
        "which limits repeatability and weakens scientific claims. The current work targets a reproducible intermediate "
        "stage: preserving engineering usability while progressively upgrading physical consistency and experiment traceability."
    )

    doc.add_heading("2. Algorithmic Basis of the Current Prototype", level=2)
    doc.add_paragraph("The baseline MPI engine computes sub-indicators in [0,100] and combines them using weighted summation:")
    doc.add_paragraph("MPI = w_RSI * RSI + w_BRI * BRI + w_ASI * ASI, with default weights (0.40, 0.35, 0.25).")
    doc.add_paragraph("RSI baseline combines immediate-roof tensile score, key-layer count score, and soft-rock proportion score.")
    doc.add_paragraph("BRI baseline follows depth penalty, hard-thick energy accumulation, and seam-thickness terms.")
    doc.add_paragraph("ASI baseline combines stiffness and friction-angle scores; ASI-UST extends this with UST parameter b and analytical stress fields.")
    doc.add_paragraph("The RSI advanced track uses a 2D finite-difference phase-field solver with explicit boundary conditions, convergence tolerance, and solver metadata.")
    doc.add_paragraph("The ASI advanced track includes calibrate_b_parameter(...) to estimate b and 95% CI from labeled samples.")

    doc.add_heading("3. Reproducibility Protocol and Evidence Contract", level=2)
    doc.add_paragraph(
        "The research API standardizes dataset registration, split generation, experiment execution, and artifact retrieval. "
        "Mandatory metrics include AUC, PR-AUC, F1, Brier, ECE, MAE, RMSE, with bootstrap 95% CI and paired significance tests."
    )
    doc.add_paragraph(
        "Every run is bound to dataset_id, dataset_version (hash), split_id, and seed. Leakage audits explicitly report "
        "borehole overlap and time ranges across train/validation/test."
    )

    _add_metrics_table(doc, "4. Preliminary Demonstration Results", metrics_data, zh=False)

    doc.add_heading("5. Current Figures from the Prototype", level=2)
    for fig in FIGURES:
        _add_figure(doc, fig["path"], fig["en"])

    doc.add_heading("6. Limitations and Near-Term Submission Plan", level=2)
    doc.add_paragraph(
        "The present quantitative table is generated from a small development split and should not be interpreted as final efficacy. "
        "Primary claims in manuscript submission must rely on strict real-label runs and larger field-scale validation. "
        "The next step is to freeze dataset manifests and complete RSI-phase-field and ASI-UST core experiment suites on production data."
    )

    doc.add_heading("References", level=1)
    refs = [
        "Francfort, G. A., & Marigo, J.-J. (1998). Revisiting brittle fracture as an energy minimization problem.",
        "Miehe, C., Hofacker, M., & Welschinger, F. (2010). A phase field model for rate-independent crack propagation.",
        "Yu, M. H. (1998). Twin-shear theory and its applications.",
        "Project codebase: backend/app/services/mpi_calculator.py",
        "Project codebase: mpi_advanced/indicators/rsi_phase_field.py",
        "Project codebase: mpi_advanced/indicators/asi_indicator_ust.py",
        "Project protocol: docs/research_evaluation_protocol.md",
    ]
    for idx, ref in enumerate(refs, 1):
        doc.add_paragraph(f"{idx}. {ref}")

    doc.save(str(EN_OUT))


def build_zh_doc(metrics_data: Optional[Dict]) -> None:
    doc = Document()
    _setup_page(doc, a4=True)
    _configure_zh_styles(doc)

    _add_center_paragraph(doc, "基于当前基础算法的矿压影响指标（MPI）科研化初稿", size=18, bold=True, east_asia_font="黑体")
    _add_center_paragraph(doc, "作者1，作者2，作者3", size=12, east_asia_font="宋体")
    _add_center_paragraph(doc, "（单位名称，城市 邮编）", size=11, east_asia_font="宋体")

    doc.add_paragraph("摘  要：")
    doc.add_paragraph(
        "针对现阶段矿压评估系统在“可复现证据链”与“物理机制可解释性”方面的提升需求，本文基于当前代码库的基础算法与新近升级模块，"
        "构建了一个面向论文产出的科研化原型。方法上，在保留RSI/BRI/ASI传统可解释框架的基础上，引入RSI相场有限差分求解器与ASI统一强度理论（UST）解析模型，"
        "并通过研究接口实现数据版本固化、切分防泄漏审计、实验归档与产物追溯。系统统一输出AUC、PR-AUC、F1、Brier、ECE、MAE、RMSE及95%置信区间，"
        "支持与基线方法进行配对显著性检验。给出了基于当前开发数据切分的演示性结果与图件，用于验证流程闭环与投稿材料组织能力。"
        "结果表明：现有系统已具备“方法-数据-实验-图表”一体化初稿支撑能力，为后续真实矿压标签条件下的严格实证与SCI投稿奠定了工程基础。"
    )
    doc.add_paragraph("关键词：矿压影响指标；相场断裂；统一强度理论；可复现性；风险评估")

    doc.add_heading("1 引言", level=1)
    doc.add_paragraph(
        "煤矿矿压风险评估长期存在模型离散、数据治理薄弱与实验复现困难等问题。当前项目目标并非直接给出最终投稿结论，"
        "而是先建立符合学术审稿要求的“可追溯实证平台”，并在该平台上推进RSI相场与ASI-UST两条创新主线。"
    )

    doc.add_heading("2 当前基础算法与升级路径", level=1)
    doc.add_heading("2.1 基础MPI加权框架", level=2)
    doc.add_paragraph("MPI = w_RSI×RSI + w_BRI×BRI + w_ASI×ASI，默认权重分别为0.40、0.35、0.25。")
    doc.add_paragraph("RSI由直接顶抗拉强度、关键层数量与软岩比例综合得到；BRI由埋深、硬厚岩层能量与煤层厚度项构成；ASI由刚度与摩擦角项构成。")

    doc.add_heading("2.2 RSI相场模块（当前实现）", level=2)
    doc.add_paragraph(
        "在现有版本中，RSI高级模块已具备二维有限差分求解能力，支持边界条件、迭代收敛判据与求解器信息输出，"
        "可用于裂纹损伤指标与风险评分的耦合验证。"
    )

    doc.add_heading("2.3 ASI-UST模块（当前实现）", level=2)
    doc.add_paragraph(
        "ASI高级模块采用统一强度理论解析解，显式考虑中间主应力影响，并提供参数b校准函数（含Bootstrap置信区间）。"
    )

    doc.add_heading("3 科研评估协议与可复现性设计", level=1)
    doc.add_paragraph(
        "系统通过 /api/research/* 接口完成数据注册、版本哈希绑定、切分审计、实验运行与产物下载。"
        "评估指标统一为AUC、PR-AUC、F1、Brier、ECE、MAE、RMSE，并输出95%CI与配对显著性检验结果。"
    )
    doc.add_paragraph(
        "切分策略优先采用time_borehole_block或borehole_block，要求训练/验证/测试在钻孔维度无交叉，"
        "并记录时间窗信息，避免信息泄漏导致的结果高估。"
    )

    _add_metrics_table(doc, "4 演示性实验结果（流程验证）", metrics_data, zh=True)

    doc.add_heading("5 当前基础图件", level=1)
    for fig in FIGURES:
        _add_figure(doc, fig["path"], fig["zh"])

    doc.add_heading("6 讨论与后续工作", level=1)
    doc.add_paragraph(
        "本文结果定位于“初稿与流程验证”阶段：当前表格指标来自小样本开发切分，不构成最终工程结论。"
        "后续将基于真实矿压标签开展严格实证，形成RSI相场与ASI-UST两篇英文SCI所需的主实验、消融、敏感性与稳健性证据。"
    )

    doc.add_heading("参考文献", level=1)
    refs = [
        "[1] Francfort G A, Marigo J J. Revisiting brittle fracture as an energy minimization problem.",
        "[2] Miehe C, Hofacker M, Welschinger F. A phase field model for rate-independent crack propagation.",
        "[3] 俞茂宏. 双剪理论及其应用. 科学出版社, 1998.",
        "[4] 项目代码: backend/app/services/mpi_calculator.py.",
        "[5] 项目代码: mpi_advanced/indicators/rsi_phase_field.py.",
        "[6] 项目代码: mpi_advanced/indicators/asi_indicator_ust.py.",
        "[7] 项目文档: docs/research_evaluation_protocol.md.",
    ]
    for ref in refs:
        doc.add_paragraph(ref)

    doc.save(str(ZH_OUT))


def main() -> None:
    metrics_data = _run_demo_experiments()
    build_en_doc(metrics_data)
    build_zh_doc(metrics_data)
    print(f"Generated: {EN_OUT}")
    print(f"Generated: {ZH_OUT}")


if __name__ == "__main__":
    main()
