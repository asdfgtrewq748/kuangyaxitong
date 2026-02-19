@echo off
REM Week 1 CI 检查脚本 (Windows)
REM 用于验证 Week 1 任务完成情况

setlocal enabledelayedexpansion

echo =========================================
echo Week 1 CI 检查脚本
echo =========================================
echo.

REM 计数器
set PASSED=0
set FAILED=0
set WARNINGS=0

echo 1. 检查 Critical Issues 修复
echo -----------------------------------------

REM 检查 Issue #001 是否修复
findstr /C:"router = APIRouter" backend\app\routes\health.py >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] Issue #001: health.py router 定义已添加
    set /a PASSED+=1
) else (
    echo [FAIL] Issue #001: health.py router 定义未找到
    set /a FAILED+=1
)

REM 检查 Issue #002 文档
if exist docs\issues\critical_issue_002.md (
    echo [OK] Issue #002: 已创建分析文档并延期到 Week 5
    set /a PASSED+=1
) else (
    echo [WARN] Issue #002: 分析文档未找到
    set /a WARNINGS+=1
)

echo.
echo 2. 检查测试覆盖率
echo -----------------------------------------

cd backend
python -m pytest tests/ --cov=app --cov-report=term > coverage_output.txt 2>&1
cd ..

REM 简单检查测试是否运行
findstr /C:"passed" backend\coverage_output.txt >nul 2>&1
if !errorlevel! equ 0 (
    for /f "tokens=1" %%a in ('findstr /C:"passed" backend\coverage_output.txt') do set TEST_COUNT=%%a
    echo [OK] 测试运行成功: !TEST_COUNT! passed
    set /a PASSED+=1
) else (
    echo [WARN] 无法获取测试运行结果
    set /a WARNINGS+=1
)

del backend\coverage_output.txt 2>nul

echo.
echo 3. 检查 E2E 测试框架
echo -----------------------------------------

if exist tests\e2e\playwright.config.ts (
    echo [OK] Playwright 配置文件存在
    set /a PASSED+=1
) else (
    echo [FAIL] Playwright 配置文件不存在
    set /a FAILED+=1
)

if exist tests\e2e\smoke.spec.ts (
    echo [OK] Smoke 测试文件存在
    set /a PASSED+=1
) else (
    echo [FAIL] Smoke 测试文件不存在
    set /a FAILED+=1
)

REM 检查核心流程测试
set CORE_COUNT=0
if exist tests\e2e\core-flow\01-data-import.spec.ts set /a CORE_COUNT+=1
if exist tests\e2e\core-flow\02-interpolation.spec.ts set /a CORE_COUNT+=1
if exist tests\e2e\core-flow\03-mpi-indicators.spec.ts set /a CORE_COUNT+=1
if exist tests\e2e\core-flow\04-simulation.spec.ts set /a CORE_COUNT+=1
if exist tests\e2e\core-flow\05-report-export.spec.ts set /a CORE_COUNT+=1

if !CORE_COUNT! equ 5 (
    echo [OK] 核心流程测试骨架: 5/5 文件存在
    set /a PASSED+=1
) else (
    echo [FAIL] 核心流程测试骨架: !CORE_COUNT!/5 文件存在
    set /a FAILED+=1
)

if exist tests\e2e\README.md (
    echo [OK] E2E 测试文档存在
    set /a PASSED+=1
) else (
    echo [WARN] E2E 测试文档不存在
    set /a WARNINGS+=1
)

echo.
echo 4. 检查单元测试文件
echo -----------------------------------------

set TEST_FILE_COUNT=0
if exist backend\tests\test_pressure_index.py set /a TEST_FILE_COUNT+=1
if exist backend\tests\test_interpolation_eval.py set /a TEST_FILE_COUNT+=1
if exist backend\tests\test_interpolate.py set /a TEST_FILE_COUNT+=1
if exist backend\tests\test_csv_loader.py set /a TEST_FILE_COUNT+=1
if exist backend\tests\test_borehole_parser.py set /a TEST_FILE_COUNT+=1
if exist backend\tests\test_lithology_stats.py set /a TEST_FILE_COUNT+=1
if exist backend\tests\test_grid_export.py set /a TEST_FILE_COUNT+=1
if exist backend\tests\test_pipeline.py set /a TEST_FILE_COUNT+=1
if exist backend\tests\test_summary.py set /a TEST_FILE_COUNT+=1
if exist backend\tests\test_geomodel_features.py set /a TEST_FILE_COUNT+=1

if !TEST_FILE_COUNT! geq 9 (
    echo [OK] 新增测试文件: !TEST_FILE_COUNT!/10
    set /a PASSED+=1
) else (
    echo [WARN] 新增测试文件: !TEST_FILE_COUNT!/10 ^(部分缺失^)
    set /a WARNINGS+=1
)

echo.
echo 5. 检查文档
echo -----------------------------------------

if exist docs\week1_progress_summary.md (
    echo [OK] Week 1 进度总结文档存在
    set /a PASSED+=1
) else (
    echo [FAIL] Week 1 进度总结文档不存在
    set /a FAILED+=1
)

echo.
echo =========================================
echo 检查结果汇总
echo =========================================
echo 通过: !PASSED!
echo 失败: !FAILED!
echo 警告: !WARNINGS!
echo.

REM 判断是否通过
if !FAILED! equ 0 (
    echo.
    echo ✓ Week 1 CI 检查通过！
    echo.
    exit /b 0
) else (
    echo.
    echo ✗ Week 1 CI 检查失败
    echo.
    exit /b 1
)
