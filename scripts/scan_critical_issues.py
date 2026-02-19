#!/usr/bin/env python
"""
Critical Issues Scanner
扫描并识别项目中的 Critical Issues
"""
import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
REPORTS_DIR = PROJECT_ROOT / "docs" / "issues"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)


def run_pylint_scan():
    """运行 Pylint 扫描"""
    print("\n" + "="*60)
    print("运行 Pylint 扫描...")
    print("="*60)

    result = subprocess.run(
        ["python", "-m", "pylint", "app", "--output-format=json",
         "--disable=C,R", "--enable=E,F"],
        cwd=BACKEND_DIR,
        capture_output=True,
        text=True
    )

    if result.stdout:
        try:
            issues = json.loads(result.stdout)
            return issues
        except json.JSONDecodeError:
            print(f"Pylint 输出解析失败: {result.stdout[:200]}")
            return []

    return []


def run_bandit_scan():
    """运行 Bandit 安全扫描"""
    print("\n" + "="*60)
    print("运行 Bandit 安全扫描...")
    print("="*60)

    result = subprocess.run(
        ["python", "-m", "bandit", "-r", "app", "-f", "json"],
        cwd=BACKEND_DIR,
        capture_output=True,
        text=True
    )

    if result.stdout:
        try:
            data = json.loads(result.stdout)
            return data.get("results", [])
        except json.JSONDecodeError:
            print(f"Bandit 输出解析失败")
            return []

    return []


def run_flake8_scan():
    """运行 Flake8 扫描"""
    print("\n" + "="*60)
    print("运行 Flake8 扫描...")
    print("="*60)

    result = subprocess.run(
        ["python", "-m", "flake8", "app", "--select=E9,F63,F7,F82",
         "--show-source", "--statistics"],
        cwd=BACKEND_DIR,
        capture_output=True,
        text=True
    )

    issues = []
    if result.stdout:
        for line in result.stdout.split('\n'):
            if line.strip():
                issues.append({
                    "type": "flake8",
                    "message": line
                })

    return issues


def identify_critical_issues(pylint_issues, bandit_issues, flake8_issues):
    """识别并排序 Critical Issues"""
    critical = []

    # 1. 从 Bandit 中提取高危安全问题
    for issue in bandit_issues:
        if issue.get("issue_confidence") == "HIGH" and issue.get("issue_severity") in ["HIGH", "MEDIUM"]:
            critical.append({
                "id": f"SEC-{len(critical)+1}",
                "source": "Bandit (Security)",
                "severity": "CRITICAL" if issue["issue_severity"] == "HIGH" else "HIGH",
                "file": issue.get("filename", ""),
                "line": issue.get("line_number", 0),
                "message": issue.get("issue_text", ""),
                "code": issue.get("test_id", ""),
                "details": issue.get("more_info", "")
            })

    # 2. 从 Pylint 中提取 Fatal 和 Error 级别问题
    for issue in pylint_issues:
        if issue.get("type") in ["error", "fatal"]:
            critical.append({
                "id": f"PY-{len(critical)+1}",
                "source": "Pylint",
                "severity": "CRITICAL" if issue["type"] == "fatal" else "HIGH",
                "file": issue.get("path", ""),
                "line": issue.get("line", 0),
                "message": issue.get("message", ""),
                "code": issue.get("symbol", ""),
                "details": issue.get("message-id", "")
            })

    # 3. 从 Flake8 中提取语法和关键错误
    for issue in flake8_issues:
        msg = issue.get("message", "")
        if any(code in msg for code in ["E9", "F63", "F7", "F82"]):
            critical.append({
                "id": f"F8-{len(critical)+1}",
                "source": "Flake8",
                "severity": "CRITICAL",
                "file": "backend/app",
                "line": 0,
                "message": msg,
                "code": "Syntax/Logic Error",
                "details": "Potential runtime error"
            })

    # 按严重程度排序
    critical.sort(key=lambda x: (x["severity"] == "CRITICAL", x["severity"]), reverse=True)

    return critical[:5]  # 返回前5个最严重的问题


def generate_report(critical_issues):
    """生成 Critical Issues 报告"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    report_lines = [
        f"# Critical Issues 报告",
        f"",
        f"**扫描时间**: {timestamp}",
        f"**项目**: 矿压系统",
        f"**扫描范围**: backend/app",
        f"",
        f"## 概览",
        f"",
        f"- **Critical Issues 总数**: {len(critical_issues)}",
        f"- **高危安全问题**: {sum(1 for i in critical_issues if 'SEC' in i['id'])}",
        f"- **语法/逻辑错误**: {sum(1 for i in critical_issues if 'PY' in i['id'] or 'F8' in i['id'])}",
        f"",
        f"---",
        f"",
    ]

    if not critical_issues:
        report_lines.extend([
            f"## ✅ 未发现 Critical Issues",
            f"",
            f"扫描结果：未发现 Critical 级别的问题。",
            f"",
        ])
    else:
        for idx, issue in enumerate(critical_issues, 1):
            report_lines.extend([
                f"## Critical Issue #{idx}: {issue['id']}",
                f"",
                f"- **来源**: {issue['source']}",
                f"- **严重程度**: {issue['severity']}",
                f"- **文件**: `{issue['file']}`",
                f"- **行号**: {issue['line'] if issue['line'] > 0 else 'N/A'}",
                f"- **错误代码**: `{issue['code']}`",
                f"",
                f"### 问题描述",
                f"",
                f"{issue['message']}",
                f"",
                f"### 详细信息",
                f"",
                f"{issue['details']}",
                f"",
                f"### 影响范围",
                f"",
                f"- **功能影响**: 待评估",
                f"- **安全风险**: {'是' if 'SEC' in issue['id'] else '否'}",
                f"- **优先级**: P0 (立即修复)",
                f"",
                f"---",
                f"",
            ])

    # 保存报告
    report_path = REPORTS_DIR / "critical_issues_report.md"
    report_path.write_text("\n".join(report_lines), encoding="utf-8")
    print(f"\n[OK] 报告已保存至: {report_path}")

    # 保存 JSON 格式
    json_path = REPORTS_DIR / "critical_issues.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": timestamp,
            "total_issues": len(critical_issues),
            "issues": critical_issues
        }, f, indent=2, ensure_ascii=False)
    print(f"[OK] JSON 报告已保存至: {json_path}")

    return critical_issues


def main():
    """主函数"""
    print("="*60)
    print("Critical Issues Scanner - 矿压系统")
    print("="*60)

    # 运行各种扫描
    pylint_issues = run_pylint_scan()
    bandit_issues = run_bandit_scan()
    flake8_issues = run_flake8_scan()

    print(f"\n扫描结果:")
    print(f"  - Pylint 问题: {len(pylint_issues)}")
    print(f"  - Bandit 问题: {len(bandit_issues)}")
    print(f"  - Flake8 问题: {len(flake8_issues)}")

    # 识别 Critical Issues
    critical_issues = identify_critical_issues(pylint_issues, bandit_issues, flake8_issues)

    print(f"\n[!] 识别到 {len(critical_issues)} 个 Critical Issues")

    # 生成报告
    generate_report(critical_issues)

    # 打印摘要
    if critical_issues:
        print("\n" + "="*60)
        print("TOP 2 Critical Issues 摘要:")
        print("="*60)
        for idx, issue in enumerate(critical_issues[:2], 1):
            print(f"\n#{idx} [{issue['id']}] {issue['severity']}")
            print(f"  文件: {issue['file']}")
            if issue['line'] > 0:
                print(f"  行号: {issue['line']}")
            print(f"  描述: {issue['message'][:100]}")

    print("\n" + "="*60)
    print("扫描完成！")
    print("="*60)

    return critical_issues


if __name__ == "__main__":
    main()
