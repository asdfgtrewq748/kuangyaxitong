#!/bin/bash
# Week 1 CI 检查脚本
# 用于验证 Week 1 任务完成情况

set -e

echo "========================================="
echo "Week 1 CI 检查脚本"
echo "========================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

check_pass() {
    echo -e "${GREEN}[✓]${NC} $1"
    PASSED=$((PASSED + 1))
}

check_fail() {
    echo -e "${RED}[✗]${NC} $1"
    FAILED=$((FAILED + 1))
}

check_warn() {
    echo -e "${YELLOW}[!]${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

echo "1. 检查 Critical Issues 修复"
echo "-----------------------------------------"

if grep -q "router = APIRouter" backend/app/routes/health.py 2>/dev/null; then
    check_pass "Issue #001: health.py router 定义已添加"
else
    check_fail "Issue #001: health.py router 定义未找到"
fi

if grep -A 10 "async def api_health" backend/app/routes/health.py | grep -q "return HealthResponse"; then
    check_pass "Issue #001: health.py try-except 已修复"
else
    check_fail "Issue #001: health.py try-except 修复未完成"
fi

if [ -f "docs/issues/critical_issue_002.md" ]; then
    check_pass "Issue #002: 已创建分析文档并延期到 Week 5"
else
    check_warn "Issue #002: 分析文档未找到"
fi

echo ""
echo "2. 检查后端测试与覆盖率"
echo "-----------------------------------------"

cd backend
if python -m pytest tests/ --cov=app --cov-report=term --cov-fail-under=80; then
    check_pass "后端测试通过且覆盖率 >= 80%"
else
    check_fail "后端测试失败或覆盖率低于 80%"
fi
cd ..

echo ""
echo "3. 检查 E2E 测试框架"
echo "-----------------------------------------"

if [ -f "tests/e2e/playwright.config.ts" ]; then
    check_pass "Playwright 配置文件存在"
else
    check_fail "Playwright 配置文件不存在"
fi

if [ -f "tests/e2e/smoke.spec.ts" ]; then
    check_pass "Smoke 测试文件存在"
else
    check_fail "Smoke 测试文件不存在"
fi

CORE_TESTS=(
    "tests/e2e/core-flow/01-data-import.spec.ts"
    "tests/e2e/core-flow/02-interpolation.spec.ts"
    "tests/e2e/core-flow/03-mpi-indicators.spec.ts"
    "tests/e2e/core-flow/04-simulation.spec.ts"
    "tests/e2e/core-flow/05-report-export.spec.ts"
)

CORE_TEST_COUNT=0
for test_file in "${CORE_TESTS[@]}"; do
    if [ -f "$test_file" ]; then
        CORE_TEST_COUNT=$((CORE_TEST_COUNT + 1))
    fi
done

if [ "$CORE_TEST_COUNT" -eq 5 ]; then
    check_pass "核心流程测试骨架: 5/5 文件存在"
else
    check_fail "核心流程测试骨架: ${CORE_TEST_COUNT}/5 文件存在"
fi

if [ -f "tests/e2e/README.md" ]; then
    check_pass "E2E 测试文档存在"
else
    check_warn "E2E 测试文档不存在"
fi

echo ""
echo "4. 检查单元测试文件"
echo "-----------------------------------------"

TEST_FILES=(
    "backend/tests/test_pressure_index.py"
    "backend/tests/test_interpolation_eval.py"
    "backend/tests/test_interpolate.py"
    "backend/tests/test_csv_loader.py"
    "backend/tests/test_borehole_parser.py"
    "backend/tests/test_lithology_stats.py"
    "backend/tests/test_grid_export.py"
    "backend/tests/test_pipeline.py"
    "backend/tests/test_summary.py"
    "backend/tests/test_geomodel_features.py"
)

TEST_FILE_COUNT=0
for test_file in "${TEST_FILES[@]}"; do
    if [ -f "$test_file" ]; then
        TEST_FILE_COUNT=$((TEST_FILE_COUNT + 1))
    fi
done

if [ "$TEST_FILE_COUNT" -ge 9 ]; then
    check_pass "新增测试文件: ${TEST_FILE_COUNT}/10"
else
    check_warn "新增测试文件: ${TEST_FILE_COUNT}/10 (部分缺失)"
fi

echo ""
echo "5. 检查文档"
echo "-----------------------------------------"

if [ -f "docs/week1_progress_summary.md" ]; then
    check_pass "Week 1 进度总结文档存在"
else
    check_fail "Week 1 进度总结文档不存在"
fi

if [ -f "docs/issues/critical_issue_001.md" ]; then
    check_pass "Critical Issue #001 文档存在"
else
    check_warn "Critical Issue #001 文档不存在"
fi

echo ""
echo "6. 检查代码质量"
echo "-----------------------------------------"

cd backend
HEALTH_TEST_OUTPUT=$(python -m pytest tests/test_health_api.py -q 2>&1 || true)
HEALTH_PASSED=$(echo "$HEALTH_TEST_OUTPUT" | grep -o "[0-9]* passed" | awk '{print $1}')
HEALTH_FAILED=$(echo "$HEALTH_TEST_OUTPUT" | grep -o "[0-9]* failed" | awk '{print $1}')

if [ -n "$HEALTH_PASSED" ] && [ "${HEALTH_FAILED:-0}" -eq 0 ] && [ "$HEALTH_PASSED" -ge 7 ]; then
    check_pass "Health API 测试: ${HEALTH_PASSED} passed (7/7)"
else
    check_fail "Health API 测试未通过: passed=${HEALTH_PASSED:-0}, failed=${HEALTH_FAILED:-0}"
fi
cd ..

echo ""
echo "========================================="
echo "检查结果汇总"
echo "========================================="
echo -e "${GREEN}通过: ${PASSED}${NC}"
echo -e "${RED}失败: ${FAILED}${NC}"
echo -e "${YELLOW}警告: ${WARNINGS}${NC}"
echo ""

TOTAL=$((PASSED + FAILED + WARNINGS))
if [ $TOTAL -gt 0 ]; then
    SUCCESS_RATE=$((PASSED * 100 / TOTAL))
    echo "成功率: ${SUCCESS_RATE}%"
fi

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}"
    echo "✓ Week 1 CI 检查通过！"
    echo -e "${NC}"
    exit 0
else
    echo -e "${RED}"
    echo "✗ Week 1 CI 检查失败"
    echo -e "${NC}"
    exit 1
fi
