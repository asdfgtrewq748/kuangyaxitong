# E2E 测试 - 矿压系统

这个目录包含矿压系统的端到端（E2E）测试，使用 Playwright 框架。

## 目录结构

```
tests/e2e/
├── playwright.config.ts     # Playwright 配置文件
├── smoke.spec.ts            # Smoke 测试（验证基础功能）
├── core-flow/               # 核心业务流程测试
│   ├── 01-data-import.spec.ts        # 数据导入流程
│   ├── 02-interpolation.spec.ts      # 插值计算流程
│   ├── 03-mpi-indicators.spec.ts     # MPI 指标查看
│   ├── 04-simulation.spec.ts         # 模拟预测流程
│   └── 05-report-export.spec.ts      # 报告导出流程
└── package.json             # 依赖配置
```

## 安装依赖

```bash
cd tests/e2e
npm install
```

## 运行测试

### 运行所有测试

```bash
npx playwright test
```

### 运行 Smoke 测试

```bash
npx playwright test smoke.spec.ts
```

### 运行特定测试文件

```bash
npx playwright test core-flow/01-data-import.spec.ts
```

### 运行特定测试用例

```bash
npx playwright test -g "用户可以上传 CSV 文件"
```

### 以 UI 模式运行（推荐用于调试）

```bash
npx playwright test --ui
```

### 查看测试报告

```bash
npx playwright show-report
```

## 测试说明

### Smoke 测试
- 验证前端基础功能正常
- 测试根路由重定向
- 验证侧边栏和内容区域加载

### 核心流程测试（当前为骨架）
所有核心流程测试当前都标记为 `skip`，需要后续实现：

1. **数据导入流程** (`01-data-import.spec.ts`)
   - 上传 CSV 文件
   - 数据解析和预览
   - 错误处理

2. **插值计算流程** (`02-interpolation.spec.ts`)
   - 选择煤层和算法
   - 执行插值计算
   - 查看结果图表

3. **MPI 指标查看** (`03-mpi-indicators.spec.ts`)
   - 查看 MPI 仪表盘
   - 切换不同指标
   - 热力图显示

4. **模拟预测** (`04-simulation.spec.ts`)
   - 配置模拟参数
   - 启动模拟
   - 查看预测结果

5. **报告导出** (`05-report-export.spec.ts`)
   - 生成报告
   - 自定义报告内容
   - 下载导出文件

## 自动启动服务

Playwright 配置会自动启动以下服务：
- **后端服务**: http://127.0.0.1:8001
- **前端服务**: http://127.0.0.1:5173

如果服务已经在运行，Playwright 会复用现有服务。

## 调试技巧

### 1. 使用 trace 查看

```bash
npx playwright test --trace on
```

### 2. 使用 debug 模式

```bash
npx playwright test --debug
```

### 3. 查看失败截图

失败的测试会自动保存截图到 `test-results/` 目录。

## 持续集成

在 CI/CD 中运行测试：

```bash
npx playwright test --reporter=list
```

## 注意事项

1. **测试数据**: 运行测试前确保有测试数据可用
2. **端口占用**: 确保 8001 和 5173 端口未被其他服务占用
3. **浏览器**: Playwright 会自动下载 Chromium 浏览器
4. **超时设置**: 默认超时 30 秒，可在 `playwright.config.ts` 中调整

## 下一步

根据 Week 2 计划，需要：
1. 实现所有 skip 的测试用例
2. 确保所有测试通过
3. 添加更多边界情况测试
4. 集成到 CI/CD 流程

---

**创建日期**: 2026-02-19
**状态**: Week 1 完成 - 测试骨架已创建
**下一步**: Week 2 - 实现所有测试用例
