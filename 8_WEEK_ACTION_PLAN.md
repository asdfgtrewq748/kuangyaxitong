# 矿压系统 8 周详细行动计划

**起始日期**：2026-02-16  
**目标交付物**：① 一个稳定可交付的产品 Demo ② 一篇完整的论文初稿（地质建模混合方法）  
**管理原则**：每周五 17:00 进行里程碑验收，不合格则下周继续，不跳阶段

---

## 总览

| 维度 | 8 周起点 | 8 周终点 |
|------|----------|----------|
| **Critical Issues** | 2 | 0 |
| **代码覆盖率** | 75% | ≥ 85% |
| **E2E 测试** | 0 条 | 5 条核心链路 |
| **前端路由** | 散乱 | 6 主入口 + ≤12 总路由 |
| **后端服务** | 双端口 | 单端口统一 |
| **实验证据** | 无 | 6 组实验 + 统计检验 |
| **论文** | 零散文档 | 完整初稿 6000-8000 字 |
| **产品 Demo** | 不可演示 | 6 步完整链路可走通 |

---

## 第 1 周（02/16 - 02/22）：消除 Critical Issues + 测试基础设施

### 目标
- **Critical Issues 归零**（从 2 → 0）
- **建立端到端测试框架**
- **代码覆盖率 75% → 80%**

### 每日任务

| 日期 | 任务 | 具体内容 | 产出物 | 负责模块 |
|------|------|----------|--------|----------|
| 周一 02/16 | **定位 2 个 Critical Issues** | 运行 SonarQube 扫描，导出完整报告；在 `docs/issues/` 下记录每个 issue 的位置、原因、影响范围 | `docs/issues/critical_issue_001.md`, `critical_issue_002.md` | backend |
| 周二 02/17 | **修复 Critical Issue #1** | 根据定位结果修复第一个问题，编写对应的回归测试 | 修复 commit + 1 个回归测试用例 | backend |
| 周三 02/18 | **修复 Critical Issue #2** | 修复第二个问题，编写对应回归测试；重新跑 SonarQube 确认 critical = 0 | 修复 commit + SonarQube 报告截图 | backend |
| 周四 02/19 | **搭建 E2E 测试框架** | 安装 Playwright；配置 `playwright.config.ts`；编写第一个 smoke test（登录/首页加载） | `tests/e2e/playwright.config.ts`, `tests/e2e/smoke.spec.ts` | frontend |
| 周五 02/20 | **编写核心链路 E2E 测试骨架** | 定义 5 条核心用户路径的 test stub（暂时 skip） | `tests/e2e/core-flow/` 目录下 5 个 spec 文件 | frontend |
| 周六 02/21 | **补充后端单元测试** | 对 `backend/app/services/` 下覆盖率最低的 3 个模块补测试 | 覆盖率报告 ≥ 80% | backend |
| 周日 02/22 | **周总结 + CI 配置** | 将 SonarQube + Playwright + pytest 集成到一个 `scripts/run_all_checks.bat` | 一键检查脚本 + Week1 总结报告 | infra |

### E2E 测试文件结构

```typescript
// tests/e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './core-flow',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      command: 'cd ../../backend && python -m uvicorn app.main:app --port 8000',
      port: 8000,
      reuseExistingServer: true,
    },
    {
      command: 'cd ../../frontend && npm run dev',
      port: 5173,
      reuseExistingServer: true,
    },
  ],
});
```

```typescript
// tests/e2e/core-flow/01-data-import.spec.ts
import { test, expect } from '@playwright/test';

test.describe('数据导入流程', () => {
  test('用户可以上传 CSV 文件并看到解析结果', async ({ page }) => {
    await page.goto('/data-import');
    const fileChooser = page.locator('input[type="file"]');
    await fileChooser.setInputFiles('tests/fixtures/sample_28boreholes.csv');
    await expect(page.locator('.parse-result')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.borehole-count')).toContainText('28');
  });

  test('上传格式错误的文件应显示友好提示', async ({ page }) => {
    await page.goto('/data-import');
    const fileChooser = page.locator('input[type="file"]');
    await fileChooser.setInputFiles('tests/fixtures/invalid_format.txt');
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('格式');
  });
});
```

### 验收标准

| 检查项 | 通过条件 |
|--------|----------|
| SonarQube Critical Issues | = 0 |
| Playwright 框架可运行 | `npx playwright test --reporter=list` 无报错（skip 的可以） |
| 后端覆盖率 | `pytest --cov` 报告 ≥ 80% |
| 一键检查脚本 | `scripts\run_all_checks.bat` 返回 exit code 0 |

---

## 第 2 周（02/23 - 03/01）：E2E 测试落地 + 前端页面收敛

### 目标
- **5 条核心链路 E2E 测试全部通过**
- **前端路由从 N 个收敛到 6 个产品级入口**
- **性能评分 78 → 82**

### 每日任务

| 日期 | 任务 | 具体内容 | 产出物 |
|------|------|----------|--------|
| 周一 02/23 | **E2E: 数据导入链路** | 补全 `01-data-import.spec.ts`，确保真实上传 → 解析 → 预览全部通过 | 测试通过截图 |
| 周二 02/24 | **E2E: 插值计算链路** | `02-interpolation.spec.ts`：选择煤层 → 选择算法 → 触发计算 → 看到结果 | 测试通过 |
| 周三 02/25 | **E2E: MPI 指标查看** | `03-mpi-indicators.spec.ts`：查看 MPI 仪表盘、切换指标、数据正确性 | 测试通过 |
| 周四 02/26 | **E2E: 模拟 + 报告** | `04-simulation.spec.ts` + `05-report-export.spec.ts` | 测试通过 |
| 周五 02/27 | **前端路由审计** | 列出所有现有路由 → 标记 保留/合并/删除 → 生成清单 | `docs/frontend-route-audit.md` |
| 周六 02/28 | **执行页面收敛** | 删除/合并标记为废弃的页面；更新 `router/index.ts` | 路由数量 ≤ 12（含子路由） |
| 周日 03/01 | **性能基准测试** | 用 Lighthouse 跑首页 + 3 个核心页面，记录基线分数 | `docs/performance-baseline.md` |

### 路由收敛方案

```typescript
// frontend/src/router/index.ts - 产品级路由（6 个主入口 + 子路由）
const productRoutes = [
  {
    path: '/data-import',
    name: 'DataImport',
    component: () => import('@/views/DataImport/index.vue'),
    meta: { title: '数据导入', icon: 'upload', order: 1 }
  },
  {
    path: '/interpolation',
    name: 'Interpolation',
    component: () => import('@/views/Interpolation/index.vue'),
    meta: { title: '插值分析', icon: 'chart', order: 2 },
    children: [
      { path: 'config', component: () => import('@/views/Interpolation/Config.vue') },
      { path: 'result', component: () => import('@/views/Interpolation/Result.vue') },
    ]
  },
  {
    path: '/mpi-dashboard',
    name: 'MPIDashboard',
    component: () => import('@/views/MPI/Dashboard.vue'),
    meta: { title: '矿压指标', icon: 'dashboard', order: 3 }
  },
  {
    path: '/simulation',
    name: 'Simulation',
    component: () => import('@/views/Simulation/index.vue'),
    meta: { title: '模拟预测', icon: 'experiment', order: 4 }
  },
  {
    path: '/validation',
    name: 'Validation',
    component: () => import('@/views/Validation/index.vue'),
    meta: { title: '实证分析', icon: 'check-circle', order: 5 }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('@/views/Report/index.vue'),
    meta: { title: '报告导出', icon: 'file-text', order: 6 }
  },
];

// 开发/调试路由（仅在 dev 模式下加载）
const devRoutes = import.meta.env.DEV ? [
  { path: '/dev/component-preview', component: () => import('@/views/Dev/ComponentPreview.vue') },
  { path: '/dev/api-test', component: () => import('@/views/Dev/ApiTest.vue') },
] : [];
```

### 验收标准

| 检查项 | 通过条件 |
|--------|----------|
| E2E 测试 | 5/5 spec 文件全部 pass |
| 前端路由 | 主路由 ≤ 6，总路由（含子路由）≤ 12 |
| Lighthouse 首页 | Performance ≥ 75，Accessibility ≥ 80 |
| 废弃页面 | 已移至 `frontend/src/views/_archived/` 或删除 |

---

## 第 3 周（03/02 - 03/08）：实验数据准备 + 对比实验框架

### 目标
- **28 个钻孔数据完成清洗和标准化**
- **实验框架可一键运行**
- **Baseline（标准克里金）实验完成**

### 每日任务

| 日期 | 任务 | 具体内容 | 产出物 |
|------|------|----------|--------|
| 周一 03/02 | **数据清洗脚本** | 编写 `scripts/prepare_experiment_data.py`：读取原始 CSV → 缺失值处理 → 异常值检测 → 输出标准格式 | 清洗后数据 + 数据质量报告 |
| 周二 03/03 | **数据集切分** | 实现 K-fold（K=5）+ 留一法切分；按空间分布分层抽样；固定随机种子 | `data/experiments/splits/` 目录 |
| 周三 03/04 | **实验 Runner 重构** | 重构 `backend/app/services/experiment_runner.py`：支持配置化实验定义（YAML） | 实验配置模板 |
| 周四 03/05 | **添加统计检验** | 在 Runner 中集成 Wilcoxon + paired t-test + 效应量（Cohen's d） | 统计检验模块 |
| 周五 03/06 | **运行 Baseline 实验** | 标准克里金 5-fold 交叉验证，记录 RMSE/MAE/R² | `data/experiments/results/baseline_kriging/` |
| 周六 03/07 | **实验可视化** | 编写 `scripts/plot_experiment_results.py`：自动生成箱线图、误差分布图 | 实验图表 |
| 周日 03/08 | **Baseline 报告** | 整理 Baseline 完整结果，确认数据无问题 | `docs/experiments/baseline_report.md` |

### 实验配置模板

```yaml
# data/experiments/configs/exp001_baseline_kriging.yaml
experiment:
  id: "exp001_baseline_kriging"
  name: "Baseline - 标准克里金插值"
  description: "使用普通克里金法对 28 个钻孔煤层厚度进行交叉验证"
  
data:
  source: "data/experiments/cleaned/boreholes_28.csv"
  target_column: "coal_thickness"
  coordinate_columns: ["x", "y"]
  auxiliary_columns: []  # baseline 不使用辅助变量

method:
  name: "ordinary_kriging"
  parameters:
    variogram_model: "spherical"
    nlags: 15
    weight: true
  
validation:
  strategy: "kfold"
  k: 5
  random_seed: 42
  spatial_stratified: true  # 空间分层抽样

metrics:
  - name: "RMSE"
    function: "sklearn.metrics.mean_squared_error"
    kwargs: { squared: false }
  - name: "MAE"
    function: "sklearn.metrics.mean_absolute_error"
  - name: "R2"
    function: "sklearn.metrics.r2_score"

statistical_tests:
  - "wilcoxon_signed_rank"
  - "paired_ttest"
  - "cohens_d"

output:
  directory: "data/experiments/results/exp001_baseline_kriging"
  save_predictions: true
  save_variogram: true
  save_figures: true
  figure_dpi: 300
  figure_font: "Times New Roman"
```

### 实验 Runner 核心逻辑

```python
# backend/app/services/experiment_runner.py
import yaml
import json
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime
from scipy import stats
from typing import Dict, List, Any


class ExperimentRunner:
    """配置化实验运行器"""
    
    def __init__(self, config_path: str):
        with open(config_path, 'r', encoding='utf-8') as f:
            self.config = yaml.safe_load(f)
        
        self.experiment_id = self.config['experiment']['id']
        self.output_dir = Path(self.config['output']['directory'])
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.results: Dict[str, Any] = {}
    
    def load_data(self) -> pd.DataFrame:
        """加载并验证数据"""
        data_config = self.config['data']
        df = pd.read_csv(data_config['source'])
        
        required_cols = data_config['coordinate_columns'] + [data_config['target_column']]
        missing = [c for c in required_cols if c not in df.columns]
        if missing:
            raise ValueError(f"数据缺少必要列: {missing}")
        
        print(f"[{self.experiment_id}] 加载数据: {len(df)} 条记录, {len(df.columns)} 列")
        return df
    
    def create_splits(self, df: pd.DataFrame) -> List[Dict]:
        """创建交叉验证切分"""
        val_config = self.config['validation']
        k = val_config['k']
        seed = val_config['random_seed']
        
        np.random.seed(seed)
        indices = np.arange(len(df))
        np.random.shuffle(indices)
        
        folds = np.array_split(indices, k)
        splits = []
        
        for i in range(k):
            test_idx = folds[i].tolist()
            train_idx = [idx for j, fold in enumerate(folds) if j != i for idx in fold]
            splits.append({'fold': i + 1, 'train': train_idx, 'test': test_idx})
        
        return splits
    
    def run_fold(self, df: pd.DataFrame, split: Dict) -> Dict:
        """运行单个 fold"""
        train_df = df.iloc[split['train']]
        test_df = df.iloc[split['test']]
        
        method_name = self.config['method']['name']
        params = self.config['method']['parameters']
        
        predictions = self._run_interpolation(method_name, params, train_df, test_df)
        
        target_col = self.config['data']['target_column']
        actual = test_df[target_col].values
        
        fold_metrics = {}
        for metric_config in self.config['metrics']:
            metric_name = metric_config['name']
            fold_metrics[metric_name] = self._compute_metric(
                actual, predictions, metric_config
            )
        
        return {
            'fold': split['fold'],
            'n_train': len(split['train']),
            'n_test': len(split['test']),
            'metrics': fold_metrics,
            'predictions': predictions.tolist(),
            'actual': actual.tolist(),
        }
    
    def run_statistical_tests(self, fold_results: List[Dict], 
                               baseline_results: List[Dict] = None) -> Dict:
        """运行统计检验"""
        results = {}
        
        if baseline_results is None:
            return results
        
        for metric in self.config['metrics']:
            metric_name = metric['name']
            proposed = [f['metrics'][metric_name] for f in fold_results]
            baseline = [f['metrics'][metric_name] for f in baseline_results]
            
            for test_name in self.config.get('statistical_tests', []):
                if test_name == 'wilcoxon_signed_rank':
                    stat, p_value = stats.wilcoxon(proposed, baseline)
                    results[f"{metric_name}_{test_name}"] = {
                        'statistic': float(stat),
                        'p_value': float(p_value),
                        'significant': p_value < 0.05,
                    }
                elif test_name == 'paired_ttest':
                    stat, p_value = stats.ttest_rel(proposed, baseline)
                    results[f"{metric_name}_{test_name}"] = {
                        'statistic': float(stat),
                        'p_value': float(p_value),
                        'significant': p_value < 0.05,
                    }
                elif test_name == 'cohens_d':
                    diff = np.array(proposed) - np.array(baseline)
                    d = np.mean(diff) / np.std(diff, ddof=1) if np.std(diff, ddof=1) > 0 else 0
                    results[f"{metric_name}_{test_name}"] = {
                        'effect_size': float(d),
                        'interpretation': self._interpret_cohens_d(abs(d)),
                    }
        
        return results
    
    def _interpret_cohens_d(self, d: float) -> str:
        if d < 0.2: return "negligible"
        elif d < 0.5: return "small"
        elif d < 0.8: return "medium"
        else: return "large"
    
    def run(self) -> Dict:
        """运行完整实验"""
        start_time = datetime.now()
        print(f"\n{'='*60}")
        print(f"开始实验: {self.config['experiment']['name']}")
        print(f"{'='*60}\n")
        
        df = self.load_data()
        splits = self.create_splits(df)
        
        fold_results = []
        for split in splits:
            print(f"  运行 Fold {split['fold']}/{len(splits)}...")
            result = self.run_fold(df, split)
            fold_results.append(result)
            print(f"    RMSE={result['metrics'].get('RMSE', 'N/A'):.4f}, "
                  f"MAE={result['metrics'].get('MAE', 'N/A'):.4f}, "
                  f"R²={result['metrics'].get('R2', 'N/A'):.4f}")
        
        summary = self._summarize(fold_results)
        elapsed = (datetime.now() - start_time).total_seconds()
        
        full_result = {
            'experiment': self.config['experiment'],
            'timestamp': datetime.now().isoformat(),
            'elapsed_seconds': elapsed,
            'fold_results': fold_results,
            'summary': summary,
        }
        
        self._save_results(full_result)
        
        print(f"\n实验完成，耗时 {elapsed:.1f}s")
        print(f"结果保存至: {self.output_dir}")
        
        return full_result
    
    def _summarize(self, fold_results: List[Dict]) -> Dict:
        """汇总所有 fold 的指标"""
        summary = {}
        for metric in self.config['metrics']:
            name = metric['name']
            values = [f['metrics'][name] for f in fold_results]
            summary[name] = {
                'mean': float(np.mean(values)),
                'std': float(np.std(values)),
                'min': float(np.min(values)),
                'max': float(np.max(values)),
                'values': [float(v) for v in values],
            }
        return summary
    
    def _save_results(self, results: Dict):
        """保存三件套：result.json + metrics.csv + summary.md"""
        # 1. result.json
        with open(self.output_dir / 'result.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        # 2. metrics.csv
        rows = []
        for fold in results['fold_results']:
            row = {'fold': fold['fold']}
            row.update(fold['metrics'])
            rows.append(row)
        pd.DataFrame(rows).to_csv(self.output_dir / 'metrics.csv', index=False)
        
        # 3. summary.md
        self._generate_summary_md(results)
    
    def _generate_summary_md(self, results: Dict):
        """生成 Markdown 格式的实验总结"""
        lines = [
            f"# 实验报告: {results['experiment']['name']}",
            f"",
            f"**实验 ID**: {results['experiment']['id']}",
            f"**运行时间**: {results['timestamp']}",
            f"**耗时**: {results['elapsed_seconds']:.1f}s",
            f"",
            f"## 汇总指标",
            f"",
            f"| 指标 | 均值 | 标准差 | 最小值 | 最大值 |",
            f"|------|------|--------|--------|--------|",
        ]
        
        for name, stats_dict in results['summary'].items():
            lines.append(
                f"| {name} | {stats_dict['mean']:.4f} | {stats_dict['std']:.4f} | "
                f"{stats_dict['min']:.4f} | {stats_dict['max']:.4f} |"
            )
        
        lines.extend(["", "## 各 Fold 详情", ""])
        for fold in results['fold_results']:
            metrics_str = ", ".join(f"{k}={v:.4f}" for k, v in fold['metrics'].items())
            lines.append(f"- **Fold {fold['fold']}** (train={fold['n_train']}, test={fold['n_test']}): {metrics_str}")
        
        with open(self.output_dir / 'summary.md', 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
    
    def _run_interpolation(self, method_name, params, train_df, test_df):
        """调用具体的插值方法 - 需要根据实际算法实现"""
        raise NotImplementedError(f"请实现 {method_name} 插值方法")
```

### 验收标准

| 检查项 | 通过条件 |
|--------|----------|
| 数据清洗 | 28 个钻孔 0 缺失值，异常值处理有记录 |
| 切分数据 | 5-fold 文件存在，每 fold 的空间分布合理 |
| Baseline 实验 | `result.json` + `metrics.csv` + `summary.md` 三件套齐全 |
| 统计检验模块 | 单元测试覆盖 Wilcoxon/t-test/Cohen's d |

---

## 第 4 周（03/09 - 03/15）：对比实验矩阵 + 消融实验

### 目标
- **完成 3 组对比实验**
- **完成 2 组消融实验**
- **所有实验结果含统计检验**

### 实验矩阵

```
实验编号    方法                        对比基线        预期结论
────────────────────────────────────────────────────────────────
exp001      标准克里金（Baseline）        -              基线
exp002      协同克里金                   exp001         辅助变量是否有用
exp003      混合建模（无数据增强）        exp001         混合方法是否优于单一方法
exp004      混合建模 + 数据增强          exp001,exp003  数据增强的增量效果
exp005      消融：去掉尖灭模式识别      exp004         尖灭模式的贡献
exp006      消融：去掉空间分区          exp004         空间分区的贡献
```

### 每日任务

| 日期 | 任务 | 具体内容 | 产出物 |
|------|------|----------|--------|
| 周一 03/09 | **exp002 协同克里金** | 配置 + 运行 + 保存三件套 | `data/experiments/results/exp002/` |
| 周二 03/10 | **exp003 混合建模** | 无数据增强的混合方法，确保算法接口完整 | `data/experiments/results/exp003/` |
| 周三 03/11 | **exp004 混合建模+增强** | 完整 proposed 方法 | `data/experiments/results/exp004/` |
| 周四 03/12 | **exp005 消融实验 1** | 去掉尖灭模式识别模块 | `data/experiments/results/exp005/` |
| 周五 03/13 | **exp006 消融实验 2** | 去掉空间分区模块 | `data/experiments/results/exp006/` |
| 周六 03/14 | **统计检验 + 对比表** | 对所有实验对跑统计检验，生成综合对比表 | `docs/experiments/comparison_table.md` |
| 周日 03/15 | **实验图表生成** | 生成 6 张论文级图表（300 DPI, Times New Roman） | `data/experiments/figures/` |

### 实验对比脚本

```python
# scripts/compare_experiments.py
"""
实验对比分析脚本
生成综合对比表 + 统计检验结果 + 论文级图表
"""
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
from pathlib import Path
from scipy import stats

matplotlib.rcParams['font.family'] = 'Times New Roman'
matplotlib.rcParams['font.size'] = 12
matplotlib.rcParams['figure.dpi'] = 300

RESULTS_DIR = Path('data/experiments/results')
FIGURES_DIR = Path('data/experiments/figures')
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

EXPERIMENTS = {
    'exp001': 'Ordinary Kriging (Baseline)',
    'exp002': 'Co-Kriging',
    'exp003': 'Hybrid (w/o augmentation)',
    'exp004': 'Hybrid + Augmentation (Proposed)',
    'exp005': 'Ablation: w/o pinch-out',
    'exp006': 'Ablation: w/o spatial zoning',
}


def load_all_results():
    """加载所有实验结果"""
    results = {}
    for exp_id, name in EXPERIMENTS.items():
        result_path = RESULTS_DIR / exp_id / 'result.json'
        if result_path.exists():
            with open(result_path, 'r') as f:
                results[exp_id] = json.load(f)
            print(f"✓ 已加载 {exp_id}: {name}")
        else:
            print(f"✗ 未找到 {exp_id}: {result_path}")
    return results


def generate_comparison_table(results):
    """生成综合对比表"""
    rows = []
    for exp_id, data in results.items():
        row = {'实验': EXPERIMENTS[exp_id]}
        for metric, values in data['summary'].items():
            row[f'{metric} (mean±std)'] = f"{values['mean']:.4f}±{values['std']:.4f}"
        rows.append(row)
    
    df = pd.DataFrame(rows)
    md_lines = ["# 实验对比综合表\n", df.to_markdown(index=False)]
    
    md_lines.append("\n\n# 统计检验结果\n")
    baseline_id = 'exp001'
    if baseline_id in results:
        for exp_id in ['exp003', 'exp004']:
            if exp_id not in results:
                continue
            md_lines.append(f"\n## {EXPERIMENTS[exp_id]} vs Baseline\n")
            for metric in ['RMSE', 'MAE', 'R2']:
                baseline_vals = results[baseline_id]['summary'][metric]['values']
                exp_vals = results[exp_id]['summary'][metric]['values']
                
                stat, p = stats.wilcoxon(exp_vals, baseline_vals)
                diff = np.array(exp_vals) - np.array(baseline_vals)
                d = np.mean(diff) / np.std(diff, ddof=1) if np.std(diff, ddof=1) > 0 else 0
                
                md_lines.append(f"- **{metric}**: Wilcoxon p={p:.4f} "
                              f"{'(显著)' if p < 0.05 else '(不显著)'}, "
                              f"Cohen's d={d:.3f}")
    
    output_path = Path('docs/experiments/comparison_table.md')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(md_lines))
    print(f"\n对比表已保存至: {output_path}")


def plot_boxplot_comparison(results):
    """生成箱线图对比"""
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    metrics = ['RMSE', 'MAE', 'R2']
    
    for ax, metric in zip(axes, metrics):
        data_to_plot = []
        labels = []
        for exp_id in ['exp001', 'exp002', 'exp003', 'exp004']:
            if exp_id in results:
                data_to_plot.append(results[exp_id]['summary'][metric]['values'])
                labels.append(exp_id.upper())
        
        bp = ax.boxplot(data_to_plot, labels=labels, patch_artist=True)
        colors = ['#B0C4DE', '#87CEEB', '#FFA07A', '#90EE90']
        for patch, color in zip(bp['boxes'], colors[:len(bp['boxes'])]):
            patch.set_facecolor(color)
        
        ax.set_title(metric, fontsize=14, fontweight='bold')
        ax.set_ylabel(metric)
        ax.grid(axis='y', alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / 'comparison_boxplot.png', dpi=300, bbox_inches='tight')
    plt.savefig(FIGURES_DIR / 'comparison_boxplot.pdf', bbox_inches='tight')
    print(f"箱线图已保存")


def plot_ablation_bar(results):
    """生成消融实验柱状图"""
    if not all(k in results for k in ['exp004', 'exp005', 'exp006']):
        print("消融实验数据不完整，跳过")
        return
    
    fig, ax = plt.subplots(figsize=(8, 5))
    
    methods = ['Proposed\n(Full)', 'w/o\nPinch-out', 'w/o\nSpatial Zoning']
    rmse_values = [
        results['exp004']['summary']['RMSE']['mean'],
        results['exp005']['summary']['RMSE']['mean'],
        results['exp006']['summary']['RMSE']['mean'],
    ]
    rmse_stds = [
        results['exp004']['summary']['RMSE']['std'],
        results['exp005']['summary']['RMSE']['std'],
        results['exp006']['summary']['RMSE']['std'],
    ]
    
    colors = ['#2ecc71', '#e74c3c', '#e74c3c']
    bars = ax.bar(methods, rmse_values, yerr=rmse_stds, capsize=5, color=colors, alpha=0.8)
    
    ax.set_ylabel('RMSE (m)', fontsize=12)
    ax.set_title('Ablation Study', fontsize=14, fontweight='bold')
    ax.grid(axis='y', alpha=0.3)
    
    for bar, val in zip(bars, rmse_values):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
                f'{val:.4f}', ha='center', va='bottom', fontsize=10)
    
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / 'ablation_study.png', dpi=300, bbox_inches='tight')
    plt.savefig(FIGURES_DIR / 'ablation_study.pdf', bbox_inches='tight')
    print("消融实验图已保存")


if __name__ == '__main__':
    results = load_all_results()
    if results:
        generate_comparison_table(results)
        plot_boxplot_comparison(results)
        plot_ablation_bar(results)
        print("\n✓ 所有对比分析完成")
```

### 验收标准

| 检查项 | 通过条件 |
|--------|----------|
| 实验结果 | 6 个实验目录均包含三件套 |
| 统计检验 | exp004 vs exp001 的 Wilcoxon p-value 已计算 |
| 图表 | 箱线图 + 消融图 300 DPI，字体 Times New Roman |
| 对比表 | `comparison_table.md` 包含所有方法的均值±标准差 |

---

## 第 5 周（03/16 - 03/22）：统一后端 + 组件库 P0

### 目标
- **后端统一到单一端口 :8000**
- **P0 组件库完成 4 个核心组件**
- **技术债务比 12% → 9%**

### 每日任务

| 日期 | 任务 | 具体内容 | 产出物 |
|------|------|----------|--------|
| 周一 03/16 | **后端路由合并方案** | 分析 :8000 和 :8001 的所有路由；设计统一路由前缀；记录不兼容点 | `docs/backend-unification-plan.md` |
| 周二 03/17 | **实现路由合并** | 将 geomodel 服务以 Router 形式挂载到主 FastAPI app，前缀 `/api/geomodel/` | 代码改动 + 路由列表 |
| 周三 03/18 | **前端 API 层适配** | 更新前端所有 API 调用，从 `:8001` 改为 `:8000/api/geomodel/` | 前端改动 + E2E 回归测试通过 |
| 周四 03/19 | **P0 组件：DataTable** | 可排序、可筛选、支持虚拟滚动的通用表格组件 | `frontend/src/components/base/DataTable.vue` |
| 周五 03/20 | **P0 组件：ChartContainer** | 统一的图表容器（loading/error/empty 状态管理） | `frontend/src/components/base/ChartContainer.vue` |
| 周六 03/21 | **P0 组件：ConfirmDialog + FormPanel** | 确认对话框 + 通用表单面板 | 2 个组件文件 |
| 周日 03/22 | **组件文档 + Storybook** | 为 4 个 P0 组件编写使用文档和示例 | `docs/components/` 或 Storybook 页面 |

### 后端统一路由结构

```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="矿压 MPI 系统",
    version="2.0.0",
    description="统一后端服务"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === 核心业务路由 ===
from app.routers import data_import, interpolation, mpi, simulation, report

app.include_router(data_import.router,    prefix="/api/data",          tags=["数据管理"])
app.include_router(interpolation.router,  prefix="/api/interpolation", tags=["插值分析"])
app.include_router(mpi.router,            prefix="/api/mpi",           tags=["矿压指标"])
app.include_router(simulation.router,     prefix="/api/simulation",    tags=["模拟预测"])
app.include_router(report.router,         prefix="/api/report",        tags=["报告导出"])

# === 地质建模路由（原 :8001 服务）===
from app.routers import geomodel

app.include_router(geomodel.router,       prefix="/api/geomodel",      tags=["地质建模"])

# === 科研实验路由 ===
from app.routers import research

app.include_router(research.router,       prefix="/api/research",      tags=["科研实验"])

# === 健康检查 ===
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "services": {
            "core": True,
            "geomodel": True,
            "research": True,
        }
    }
```

### P0 组件：ChartContainer

```vue
<!-- frontend/src/components/base/ChartContainer.vue -->
<template>
  <div class="chart-container" :style="{ height: height }">
    <!-- 标题栏 -->
    <div class="chart-header" v-if="title || $slots.actions">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Loading 状态 -->
    <div v-if="loading" class="chart-state chart-loading">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- Error 状态 -->
    <div v-else-if="error" class="chart-state chart-error">
      <el-empty description="数据加载失败">
        <template #image>
          <el-icon :size="48" color="#F56C6C"><WarningFilled /></el-icon>
        </template>
        <el-button type="primary" @click="$emit('retry')">重试</el-button>
      </el-empty>
    </div>

    <!-- Empty 状态 -->
    <div v-else-if="empty" class="chart-state chart-empty">
      <el-empty :description="emptyText" />
    </div>

    <!-- 正常内容 -->
    <div v-else class="chart-content" ref="chartRef">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';

interface Props {
  title?: string;
  height?: string;
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  emptyText?: string;
}

withDefaults(defineProps<Props>(), {
  height: '400px',
  loading: false,
  error: false,
  empty: false,
  emptyText: '暂无数据',
});

defineEmits<{
  retry: [];
}>();

const chartRef = ref<HTMLElement>();

defineExpose({ chartRef });
</script>

<style scoped>
.chart-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.chart-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-content {
  flex: 1;
  padding: 12px;
  min-height: 0;
}
</style>
```

### 验收标准

| 检查项 | 通过条件 |
|--------|----------|
| 后端端口 | 只有 :8000 在运行，:8001 已废弃 |
| API 调用 | 前端所有接口使用 `/api/` 前缀，E2E 全通过 |
| P0 组件 | 4 个组件有使用文档 + 至少 1 个页面已接入 |
| 技术债务 | SonarQube 技术债务比 ≤ 9% |

---

## 第 6 周（03/23 - 03/29）：论文 Methods + Results 章节

### 目标
- **完成论文 Methods 章节初稿（~3000 字英文）**
- **完成论文 Results 章节初稿（~2500 字英文）**
- **完成所有论文图表（~10 张）**

### 每日任务

| 日期 | 任务 | 具体内容 | 字数/图目标 |
|------|------|----------|-------------|
| 周一 03/23 | **Methods 2.1: Study Area** | 研究区概况、地质背景、数据来源描述 | ~500 字 + 1 张位置图 |
| 周二 03/24 | **Methods 2.2: Data Preprocessing** | 数据清洗、异常值处理、描述性统计 | ~400 字 + 1 张数据分布图 |
| 周三 03/25 | **Methods 2.3: Proposed Method** | 混合建模方法的完整技术描述，含公式推导 | ~1200 字 + 1 张方法框架图 |
| 周四 03/26 | **Methods 2.4: Experimental Design** | 交叉验证方案、评价指标、对比方法说明 | ~500 字 |
| 周五 03/27 | **Methods 2.5: Implementation** | 实现细节、超参数选择、计算环境 | ~400 字 |
| 周六 03/28 | **Results 3.1-3.2** | 3.1 基线对比结果 + 3.2 方法对比分析 | ~1500 字 + 3 张图表 |
| 周日 03/29 | **Results 3.3-3.4** | 3.3 消融实验 + 3.4 可视化案例 | ~1000 字 + 3 张图表 |

### 论文图表清单

| 图号 | 内容 | 类型 | 尺寸 | 文件名 |
|------|------|------|------|--------|
| Fig.1 | 研究区位置及钻孔分布 | 地图 | 单栏 | `fig01_study_area.pdf` |
| Fig.2 | 原始数据特征分析 | 直方图+散点图 | 双栏 | `fig02_data_analysis.pdf` |
| Fig.3 | 混合建模方法框架 | 流程图 | 双栏 | `fig03_method_framework.pdf` |
| Fig.4 | 变异函数拟合 | 折线图 | 单栏 | `fig04_variogram.pdf` |
| Fig.5 | 交叉验证箱线图 | 箱线图 | 双栏 | `fig05_cv_boxplot.pdf` |
| Fig.6 | 预测 vs 实测散点图 | 散点图 | 单栏 | `fig06_pred_vs_actual.pdf` |
| Fig.7 | 各方法空间预测对比 | 热力图×4 | 双栏 | `fig07_spatial_comparison.pdf` |
| Fig.8 | 消融实验结果 | 柱状图 | 单栏 | `fig08_ablation.pdf` |
| Fig.9 | 误差空间分布 | 热力图 | 单栏 | `fig09_error_distribution.pdf` |
| Fig.10 | 尖灭区域识别效果 | 对比图 | 双栏 | `fig10_pinchout_detection.pdf` |

### 论文结构模板

```markdown
# A Hybrid Geological Modeling Approach for Coal Seam Thickness Prediction:
# Integrating Geostatistical Methods with Intelligent Pinch-out Detection

## Abstract
(Week 7 完成)

## 1. Introduction
(Week 7 完成)

## 2. Methods

### 2.1 Study Area and Data
The study area is located in [矿区名称], [省份], China. A total of 28 
exploration boreholes were drilled across the study area, covering an 
approximate extent of [X] km × [Y] km. The target variable is the 
thickness of the [煤层名称] coal seam, which ranges from [min] m to 
[max] m with a mean of [mean] m and standard deviation of [std] m.

(Fig. 1: Study area map)
(Table 1: Descriptive statistics of borehole data)

### 2.2 Data Preprocessing
[数据清洗流程描述]

### 2.3 Proposed Hybrid Modeling Method

#### 2.3.1 Spatial Zoning Based on Geological Structure
[空间分区算法描述 + 公式]

#### 2.3.2 Intelligent Pinch-out Pattern Recognition  
[尖灭模式识别算法 + 公式]

#### 2.3.3 Adaptive Interpolation Strategy
[自适应插值 + 公式]

#### 2.3.4 Data Augmentation for Sparse Regions
[数据增强方法 + 公式]

(Fig. 3: Method framework diagram)

### 2.4 Experimental Design
- Cross-validation: 5-fold spatially stratified
- Comparison methods: OK, Co-Kriging, Hybrid (w/o augmentation)
- Metrics: RMSE, MAE, R²
- Statistical tests: Wilcoxon signed-rank test (α=0.05), Cohen's d

### 2.5 Implementation Details
- Python 3.11, PyKrige, scikit-learn, SciPy
- Hardware: [具体配置]
- Random seed: 42

## 3. Results

### 3.1 Baseline Comparison
(Table 2: Cross-validation results)
(Fig. 5: Boxplot comparison)

### 3.2 Method Comparison Analysis  
(Fig. 6: Predicted vs. Actual)
(Fig. 7: Spatial prediction maps)
(Table 3: Statistical test results)

### 3.3 Ablation Study
(Fig. 8: Ablation bar chart)
(Table 4: Contribution of each component)

### 3.4 Case Study: Pinch-out Zone
(Fig. 9, 10: Error distribution and pinch-out detection)

## 4. Discussion
(Week 7 完成)

## 5. Conclusions
(Week 7 完成)

## References
(持续积累)
```

### 验收标准

| 检查项 | 通过条件 |
|--------|----------|
| Methods 章节 | ≥ 3000 字英文，公式编号完整，无 TODO 占位符 |
| Results 章节 | ≥ 2500 字英文，所有数据来自真实实验结果 |
| 图表 | 10 张图全部完成，统一 300 DPI + Times New Roman |
| 表格 | 至少 4 张表，数值与 `metrics.csv` 一致 |

---

## 第 7 周（03/30 - 04/05）：论文补全 + 内部审阅

### 目标
- **完成 Abstract / Introduction / Discussion / Conclusions**
- **完成参考文献（≥30 篇）**
- **内部自审 1 轮**

### 每日任务

| 日期 | 任务 | 具体内容 | 字数目标 |
|------|------|----------|----------|
| 周一 03/30 | **Introduction 1.1** | 研究背景：煤层厚度预测的重要性，传统方法的局限 | ~600 字 |
| 周二 03/31 | **Introduction 1.2** | 文献综述：地统计学、机器学习、混合方法的进展 | ~800 字 + 梳理 20 篇核心文献 |
| 周三 04/01 | **Introduction 1.3** | 研究空白 + 本文贡献（3 点） + 论文结构 | ~400 字 |
| 周四 04/02 | **Discussion** | 结果讨论、与已有方法对比、局限性、未来工作 | ~1500 字 |
| 周五 04/03 | **Conclusions** | 3-4 条主要结论 | ~500 字 |
| 周六 04/04 | **Abstract + References** | 写 Abstract（250 字以内）；整理参考文献（≥30 篇） | Abstract 250 字 |
| 周日 04/05 | **第一轮自审** | 通读全文，检查逻辑、图文一致性、语法；标注需修改处 | 自审报告 `docs/paper/review_notes_v1.md` |

### 自审检查清单

```markdown
# 论文自审检查清单

## 结构完整性
- [ ] Abstract 包含：背景、方法、结果、结论
- [ ] Introduction 明确指出 research gap
- [ ] Introduction 结尾明确列出 contributions (3 点)
- [ ] Methods 各节逻辑连贯，无跳跃
- [ ] Results 每个子节都有对应的 Methods 描述
- [ ] Discussion 不重复 Results，而是解读和分析
- [ ] Conclusions 不引入新信息

## 数据一致性
- [ ] Abstract 中的数字与 Results 一致
- [ ] 表格中的数字与 metrics.csv 一致（逐一核对）
- [ ] 图表引用编号连续且正确（Fig.1 → Fig.10）
- [ ] 表格引用编号连续且正确（Table 1 → Table 4）

## 图表质量
- [ ] 所有图 300 DPI
- [ ] 字体统一为 Times New Roman
- [ ] 坐标轴标签完整（含单位）
- [ ] 图例清晰无遮挡
- [ ] 双栏图宽度 ≤ 190mm，单栏 ≤ 90mm

## 学术规范
- [ ] 所有公式编号
- [ ] 首次出现的缩写有全称
- [ ] 参考文献格式统一（建议用 Zotero/EndNote 管理）
- [ ] 无自引过多（自引 ≤ 3 篇）
- [ ] 核心参考文献中包含目标期刊的近 3 年论文

## 语言
- [ ] 无中式英语
- [ ] 时态一致（Methods 用过去时，普遍规律用现在时）
- [ ] 段落首句为 topic sentence
- [ ] 无超长句子（单句 ≤ 35 词）

## 目标期刊适配
- [ ] 字数符合期刊要求（Computers & Geosciences: 通常 6000-8000 字）
- [ ] 图表数量合理（通常 ≤ 12 张图 + 6 张表）
- [ ] 投稿须知中的格式要求已满足
```

### 参考文献管理脚本

```python
# scripts/check_references.py
"""
参考文献完整性检查脚本
检查论文正文中引用的文献是否都在参考文献列表中
"""
import re
from pathlib import Path


def extract_citations(text: str) -> set:
    """提取正文中的所有引用标记"""
    patterns = [
        r'\(([A-Z][a-z]+(?:\s+(?:et\s+al\.|and\s+[A-Z][a-z]+))?),?\s*(\d{4})\)',
        r'\[(\d+)\]',
    ]
    citations = set()
    for pattern in patterns:
        matches = re.findall(pattern, text)
        for m in matches:
            citations.add(m if isinstance(m, str) else ' '.join(m))
    return citations


def check_references():
    draft_path = Path('docs/paper/draft_v1.md')
    if not draft_path.exists():
        print("论文草稿不存在")
        return
    
    text = draft_path.read_text(encoding='utf-8')
    
    parts = text.split('## References')
    if len(parts) < 2:
        print("未找到 References 章节")
        return
    
    body_citations = extract_citations(parts[0])
    ref_text = parts[1]
    
    print(f"正文中引用数量: {len(body_citations)}")
    print(f"引用列表: {sorted(body_citations)}")
    
    ref_lines = [l.strip() for l in ref_text.split('\n') if l.strip().startswith('[') or l.strip().startswith('-')]
    print(f"参考文献条目数: {len(ref_lines)}")
    
    if len(ref_lines) < 30:
        print(f"⚠️ 参考文献不足 30 篇（当前 {len(ref_lines)}）")


if __name__ == '__main__':
    check_references()
```

### 验收标准

| 检查项 | 通过条件 |
|--------|----------|
| 全文字数 | 6000-8000 英文单词 |
| 参考文献 | ≥ 30 篇，含目标期刊近 3 年论文 ≥ 5 篇 |
| 自审 | 检查清单全部打勾或有明确的修改计划 |
| 图文一致性 | 正文数字与实验数据完全一致 |

---

## 第 8 周（04/06 - 04/12）：收尾 + 交付

### 目标
- **论文初稿提交导师审阅**
- **产品 Demo 可演示**
- **项目文档齐全**

### 每日任务

| 日期 | 任务 | 具体内容 | 产出物 |
|------|------|----------|--------|
| 周一 04/06 | **论文修改 Round 2** | 根据自审报告修改论文，重点修语言和逻辑 | 论文 v2 |
| 周二 04/07 | **论文排版** | 转为 LaTeX / Word 模板（按目标期刊格式） | `docs/paper/manuscript_v1.docx` 或 `.tex` |
| 周三 04/08 | **Cover Letter + Highlights** | 撰写投稿信和研究亮点（3-5 条） | `docs/paper/cover_letter.md` |
| 周四 04/09 | **产品 Demo 准备** | 准备演示数据；确保 6 个主入口全部可走通；录制演示视频 | 演示视频 3-5 分钟 |
| 周五 04/10 | **最终质量检查** | 跑全量测试（E2E + 单元 + SonarQube）；确认所有指标达标 | 最终质量报告 |
| 周六 04/11 | **文档收尾** | 更新 README.md、CHANGELOG.md、部署文档 | 项目文档 |
| 周日 04/12 | **提交 + 回顾** | 论文发导师；产品 Demo 发团队；写 8 周回顾总结 | 提交确认 + 回顾文档 |

### 最终质量报告模板

```markdown
# 最终质量报告

**日期**: 2026-04-10
**检查人**: [姓名]

## 代码质量

| 指标 | 起始值 (02/16) | 目标值 | 当前值 | 状态 |
|------|----------------|--------|--------|------|
| 代码覆盖率 | 75% | ≥ 85% | __% | ☐ |
| Critical Issues | 2 | 0 | __ | ☐ |
| 性能评分 | 78 | ≥ 85 | __ | ☐ |
| 技术债务比 | 12% | < 8% | __% | ☐ |

## 测试覆盖

| 测试类型 | 用例数 | 通过数 | 通过率 |
|----------|--------|--------|--------|
| 后端单元测试 | __ | __ | __% |
| E2E 测试 | 5 | __ | __% |
| 实验回归测试 | __ | __ | __% |

## 产品交付

| 功能 | 状态 | 备注 |
|------|------|------|
| 数据导入 | ☐ | |
| 插值分析 | ☐ | |
| 矿压指标 | ☐ | |
| 模拟预测 | ☐ | |
| 实证分析 | ☐ | |
| 报告导出 | ☐ | |

## 论文交付

| 项目 | 状态 | 备注 |
|------|------|------|
| 全文初稿 | ☐ | __字 |
| 图表 (10张) | ☐ | |
| 参考文献 (≥30) | ☐ | __篇 |
| 排版 | ☐ | |
| Cover Letter | ☐ | |
```

### 验收标准

| 检查项 | 通过条件 |
|--------|----------|
| 论文 | 完整初稿已发送导师邮箱 |
| 产品 Demo | 6 步主链路可走通 + 录屏视频 |
| 代码质量 | 全部 4 项指标达标 |
| 文档 | README 更新，CHANGELOG 记录 8 周变更 |

---

## 风险管理表

| 风险 | 概率 | 影响 | 触发条件 | 应对措施 |
|------|------|------|----------|----------|
| 实验结果不显著 | 中 | 高 | exp004 vs exp001 p > 0.1 | 增加钻孔数据（合并邻近矿区）或调整方法参数 |
| 后端合并引入回归 | 中 | 中 | E2E 测试 fail ≥ 2 | 回滚到分离模式，用 API Gateway 代替 |
| 数据质量问题 | 低 | 高 | 清洗后有效数据 < 20 | 联系地质队获取补充钻孔 |
| 论文写作进度滞后 | 中 | 中 | Week 6 结束时 Methods 未完成 | 压缩 Discussion，先提交 Short Communication |
| Agent Team CI 不稳定 | 低 | 低 | 连续 3 个 cycle 有 unknown task | 暂停 Agent Team，手动管理任务 |

---

## 进度跟踪看板

### Week 1 (02/16-02/22): 消除 Critical + 测试基础
- [ ] 定位 2 个 Critical Issues
- [ ] 修复 Critical Issue #1 + 回归测试
- [ ] 修复 Critical Issue #2 + SonarQube 确认
- [ ] 搭建 Playwright E2E 框架
- [ ] 编写 5 条 E2E 测试骨架
- [ ] 补充后端单元测试 → 覆盖率 80%
- [ ] CI 一键检查脚本

### Week 2 (02/23-03/01): E2E 落地 + 前端收敛
- [ ] E2E: 数据导入链路通过
- [ ] E2E: 插值计算链路通过
- [ ] E2E: MPI 指标查看通过
- [ ] E2E: 模拟 + 报告通过
- [ ] 前端路由审计文档
- [ ] 路由收敛 ≤ 12
- [ ] Lighthouse 基准报告

### Week 3 (03/02-03/08): 实验数据 + Baseline
- [x] 数据清洗脚本 + 质量报告
- [x] K-fold 切分（空间分层）
- [x] 实验 Runner 重构（YAML 配置化）
- [x] 统计检验模块集成
- [x] Baseline 克里金实验完成（三件套）
- [x] 实验可视化脚本
- [x] Baseline 报告

### Week 4 (03/09-03/15): 对比 + 消融实验
- [x] exp002 协同克里金
- [x] exp003 混合建模（无增强）
- [x] exp004 混合建模 + 增强
- [x] exp005 消融：去掉尖灭模式
- [x] exp006 消融：去掉空间分区
- [x] 统计检验 + 对比表
- [x] 论文级图表 6 张

### Week 5 (03/16-03/22): 后端统一 + 组件库
- [ ] 后端路由合并方案
- [ ] 路由合并实现
- [ ] 前端 API 层适配
- [ ] P0 组件：DataTable
- [ ] P0 组件：ChartContainer
- [ ] P0 组件：ConfirmDialog + FormPanel
- [ ] 组件文档

### Week 6 (03/23-03/29): 论文 Methods + Results
- [ ] 2.1 Study Area (500 字)
- [ ] 2.2 Data Preprocessing (400 字)
- [ ] 2.3 Proposed Method (1200 字)
- [ ] 2.4 Experimental Design (500 字)
- [ ] 2.5 Implementation (400 字)
- [ ] 3.1-3.2 Baseline + 对比 (1500 字)
- [ ] 3.3-3.4 消融 + 案例 (1000 字)

### Week 7 (03/30-04/05): 论文补全 + 自审
- [ ] Introduction 1.1 背景 (600 字)
- [ ] Introduction 1.2 文献综述 (800 字)
- [ ] Introduction 1.3 贡献 (400 字)
- [ ] Discussion (1500 字)
- [ ] Conclusions (500 字)
- [ ] Abstract (250 字) + References (≥30)
- [ ] 第一轮自审

### Week 8 (04/06-04/12): 收尾交付
- [ ] 论文修改 Round 2
- [ ] 论文排版
- [ ] Cover Letter + Highlights
- [ ] 产品 Demo + 演示视频
- [ ] 最终质量检查
- [ ] 文档收尾
- [ ] 提交导师 + 回顾总结

---

**核心原则**：做减法，先闭环，再扩展。每周五验收，不达标不跳阶段。
