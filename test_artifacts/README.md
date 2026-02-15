# Test Artifacts 测试产物

此目录存放所有测试相关的产物。

## 📁 目录结构

```
test_artifacts/
├── screenshots/        # 截图文件
├── scripts/           # 测试脚本
└── reports/           # 测试报告
```

## 📸 Screenshots (screenshots/)

存放所有浏览器测试截图：

- `debug-blank.png` - 调试空白页面
- `inspect-geomodel.png` - 检查地质建模页面
- `test-geomodel.png` - 测试地质建模可视化
- `test-mpi.png` - 测试 MPI 热力图
- `test-research.png` - 测试科研工作台
- `verify-fixed.png` - 验证修复后的页面

## 📜 Scripts (scripts/)

存放所有测试脚本：

- `test-components.ts` - 组件测试脚本
- `test-optimization.ts` - 优化测试脚本
- `debug-page.ts` - 页面调试脚本
- `inspect-page.ts` - 页面检查脚本
- `verify-fix.ts` - 修复验证脚本

## 📊 Reports (reports/)

存放测试报告（由 Agent Team 自动生成）。

---

## 🤖 Agent Team 集成

Agent Team 的所有测试产物都会自动存放到此目录：

- **Playwright 截图** → `screenshots/`
- **测试脚本** → `scripts/`
- **优化报告** → `reports/`
- **周期报告** → `../agent_team/optimization_reports/`

## 📝 说明

- 此目录由 Agent Team 自动维护
- 历史产物会保留，用于追踪优化进度
- 可定期清理旧文件以节省空间
- 所有产物都带有时间戳便于识别
