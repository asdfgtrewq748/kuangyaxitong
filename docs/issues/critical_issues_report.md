# Critical Issues 报告

**扫描时间**: 2026-02-19 22:21:08
**项目**: 矿压系统
**扫描范围**: backend/app

## 概览

- **Critical Issues 总数**: 5
- **高危安全问题**: 0
- **语法/逻辑错误**: 5

---

## Critical Issue #1: F8-6

- **来源**: Flake8
- **严重程度**: CRITICAL
- **文件**: `backend/app`
- **行号**: N/A
- **错误代码**: `Syntax/Logic Error`

### 问题描述

app\routes\scene3d.py:191:9: E999 IndentationError: unexpected indent

### 详细信息

Potential runtime error

### 影响范围

- **功能影响**: 待评估
- **安全风险**: 否
- **优先级**: P0 (立即修复)

---

## Critical Issue #2: F8-7

- **来源**: Flake8
- **严重程度**: CRITICAL
- **文件**: `backend/app`
- **行号**: N/A
- **错误代码**: `Syntax/Logic Error`

### 问题描述

1     E999 IndentationError: unexpected indent

### 详细信息

Potential runtime error

### 影响范围

- **功能影响**: 待评估
- **安全风险**: 否
- **优先级**: P0 (立即修复)

---

## Critical Issue #3: PY-1

- **来源**: Pylint
- **严重程度**: HIGH
- **文件**: `app\routes\scene3d.py`
- **行号**: 191
- **错误代码**: `syntax-error`

### 问题描述

Parsing failed: 'unexpected indent (app.routes.scene3d, line 191)'

### 详细信息

E0001

### 影响范围

- **功能影响**: 待评估
- **安全风险**: 否
- **优先级**: P0 (立即修复)

---

## Critical Issue #4: PY-2

- **来源**: Pylint
- **严重程度**: HIGH
- **文件**: `app\services\mpi_new_algorithm.py`
- **行号**: 19
- **错误代码**: `import-error`

### 问题描述

Unable to import 'mpi_advanced.core.data_models'

### 详细信息

E0401

### 影响范围

- **功能影响**: 待评估
- **安全风险**: 否
- **优先级**: P0 (立即修复)

---

## Critical Issue #5: PY-3

- **来源**: Pylint
- **严重程度**: HIGH
- **文件**: `app\services\mpi_new_algorithm.py`
- **行号**: 28
- **错误代码**: `import-error`

### 问题描述

Unable to import 'mpi_advanced.indicators.asi_indicator_ust'

### 详细信息

E0401

### 影响范围

- **功能影响**: 待评估
- **安全风险**: 否
- **优先级**: P0 (立即修复)

---
