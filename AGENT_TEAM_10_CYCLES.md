# Agent Team 10 周期优化 - 监控指南

## 📊 当前状态

**✅ Agent Team 正在运行 10 个优化周期！**

- **开始时间**: 2026-02-16 08:11:56
- **当前进度**: 1/10 周期完成
- **剩余周期**: 9 个
- **预计完成时间**: 约 5 小时（每个周期 30 分钟）

**第一个周期结果** (20260216_081156):
```
分析指标:
  - 代码覆盖率: 75%
  - 关键问题: 2 个
  - 性能分数: 78
  - 技术债务: 12%

任务执行:
  ✅ Bug Hunter - 修复关键 SonarQube 违规
  ✅ Frontend Agent - 优化 Vue 3 组件
  ⚠️ QA Agent - 增加测试覆盖率 (action映射问题，已修复)

验证:
  ✅ Playwright 浏览器测试完成
  ✅ 无新问题发现
```

---

## 📈 实时监控

### 方式 1: 使用实时监控器（推荐）

```bash
python monitor_progress.py
```

**功能**:
- ✅ 实时进度条显示
- ✅ 完成百分比
- ✅ 最新周期摘要
- ✅ 每 30 秒自动更新

按 `Ctrl+C` 停止监控（不影响 Agent Team 运行）

### 方式 2: 快速状态检查

```bash
python check_status.py
```

**功能**:
- ✅ 快速查看当前进度
- ✅ 显示最新报告摘要
- ✅ 显示监控命令

### 方式 3: 查看实时日志

```bash
tail -f agent_team/agent_team_10cycles.log
```

**功能**:
- ✅ 实时日志输出
- ✅ 详细的任务执行信息
- ✅ Agent 活动追踪

---

## 📁 查看生成的报告

### 查看所有周期报告

```bash
# 列出所有报告
ls -lt agent_team/optimization_reports/cycle_*.md

# 查看最新报告
cat agent_team/optimization_reports/cycle_*.md | tail -100

# 查看特定周期
cat agent_team/optimization_reports/cycle_20260216_081156.md
```

### 查看测试产物

```bash
# Playwright 测试脚本
ls -lh test_artifacts/scripts/

# 浏览器截图
ls -lh test_artifacts/screenshots/
```

---

## 🔄 预期完成时间

- **当前**: 周期 1/10
- **完成时间**: 约 5 小时后
- **预计**: 2026-02-16 13:11 左右

每个周期：
- **分析**: 5 分钟
- **规划**: 5 分钟
- **执行**: 15 分钟
- **验证**: 3 分钟
- **报告**: 2 分钟
- **等待**: 30 分钟

---

## 🛑 停止和恢复

### 停止优化

```bash
# 找到进程
ps aux | grep "run_n_cycles.py"

# 停止进程
kill <PID>

# 或者如果使用 nohup，找到并停止
pkill -f "run_n_cycles.py"
```

### 重新启动

```bash
cd agent_team
python run_n_cycles.py 10
```

---

## 📊 周期报告内容

每个周期报告包含:

1. **分析结果**
   - 代码覆盖率
   - 关键问题数量
   - 性能分数
   - 技术债务比率

2. **执行摘要**
   - 总任务数
   - 完成数量
   - 失败数量
   - 每个任务的详细结果

3. **验证结果**
   - 是否批准
   - 发现的问题
   - 使用的验证方法

4. **焦点领域**
   - 基于时间和星期的优化重点

---

## 🎯 智能调度策略

**基于时间的重点**:
- **00-06**: 稳定性 + Bug 修复 + 安全
- **06-12**: 性能 + 测试 + 优化
- **12-18**: 功能 + 架构 + 重构
- **18-24**: 审查 + 文档 + 清理

**每周主题**:
- **周一**: 性能优化
- **周二**: 测试覆盖
- **周三**: 架构改进
- **周四**: 安全加固
- **周五**: 文档完善
- **周六**: Bug 大扫除
- **周日**: 技术债务清理

当前时间: **周日上午 08:11** - 重点是 **测试、优化、性能**

---

## 📈 预期成果

10 个周期后，预期看到:

✅ **代码质量提升**
- SonarQube 违规减少
- 代码覆盖率提高（目标 ≥80%）
- 技术债务降低

✅ **性能改进**
- Lighthouse 分数提升（目标 ≥85）
- API 响应时间优化
- 前端渲染速度加快

✅ **测试完善**
- 单元测试增加
- 集成测试覆盖
- E2E 测试强化

✅ **文档更新**
- API 文档完善
- 代码注释增加
- README 更新

---

## 🔍 故障排查

### 如果进程停止了

```bash
# 检查日志
tail -50 agent_team/agent_team_10cycles.log

# 重新启动
cd agent_team
python run_n_cycles.py 10
```

### 如果没有生成报告

```bash
# 检查报告目录
ls -la agent_team/optimization_reports/

# 如果目录不存在，创建它
mkdir -p agent_team/optimization_reports/
```

### 查看错误

```bash
# 查看完整日志
cat agent_team/agent_team_10cycles.log | grep ERROR

# 查看警告
cat agent_team/agent_team_10cycles.log | grep WARNING
```

---

## 📝 常用命令速查

```bash
# 查看当前进度
python check_status.py

# 启动实时监控
python monitor_progress.py

# 查看实时日志
tail -f agent_team/agent_team_10cycles.log

# 查看最新报告
cat agent_team/optimization_reports/cycle_*.md | tail -100

# 查看测试产物
ls -lh test_artifacts/screenshots/
ls -lh test_artifacts/scripts/

# 检查进程状态
ps aux | grep "run_n_cycles.py"

# 停止优化
pkill -f "run_n_cycles.py"

# 恢复优化
cd agent_team && python run_n_cycles.py 10
```

---

## 🎉 完成后检查

10 个周期完成后，你可以:

1. **查看所有报告**
   ```bash
   ls -lh agent_team/optimization_reports/cycle_*.md
   ```

2. **总结优化效果**
   ```bash
   # 对比第一个和最后一个周期
   cat agent_team/optimization_reports/cycle_*.md | grep -E "(Total Tasks|Completed|Failed)"
   ```

3. **检查改进的文件**
   ```bash
   git diff HEAD~10 HEAD --stat
   ```

4. **运行测试**
   ```bash
   cd backend && python -m pytest
   cd frontend && npm test
   ```

---

## 🚀 下一步

10 个周期完成后，你可以:

1. **评估结果** - 查看报告，评估改进效果
2. **继续优化** - 运行更多周期或启动 24/7 无限循环
3. **调整配置** - 修改 `schedule_config.json` 调整优化策略
4. **手动验证** - 测试前端、后端功能
5. **代码审查** - 查看 Agent Team 的代码更改

---

**祝优化顺利！** 🎯

有任何问题，查看日志或使用 `check_status.py` 检查状态。
