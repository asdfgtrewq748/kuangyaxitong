# 采区工作面矿压影响评价系统

本项目使用 Vue + FastAPI 实现采区钻孔驱动的矿压影响评价与来压步距计算，并支持插值、工作面调整与热力图展示。

## 目录结构
- backend/  后端 FastAPI
- frontend/ 前端 Vue (Vite)
- data/     原始钻孔 CSV 与坐标文件

## 数据要求
- data/zuobiao.csv 必须存在，字段：钻孔名, 坐标x, 坐标y
- data/ 下钻孔 CSV 文件名即钻孔名（如 50-14.csv）
- 钻孔 CSV 字段需包含：序号, 名称, 厚度/m（其余列可空）
- 支持自动编码修复与缺失值按岩性均值补齐

## 启动方式（Windows）
运行根目录脚本：start.ps1

## 启动指南

### 自动启动（推荐）
在项目根目录执行 PowerShell 脚本：
1) 右键“以 PowerShell 运行” start.ps1
2) 或在 PowerShell 中执行：
	- Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
	- .\start.ps1

脚本会自动创建后端虚拟环境、安装依赖，并分别启动后端与前端两个终端窗口。

### 手动启动

#### 如果你使用 Anaconda 终端
建议先创建并激活独立环境：
1) 创建环境（仅首次）
	- conda create -n kuangya python=3.11 -y
2) 激活环境
	- conda activate kuangya
之后再按下面的“启动后端/前端”步骤执行。

#### 1. 启动后端（FastAPI）
在项目根目录打开终端（PowerShell 或 Anaconda Prompt），依次执行：
1) 进入后端目录
	- cd .\backend
2) 创建虚拟环境
	- python -m venv .venv
3) 激活虚拟环境
	- .\.venv\Scripts\Activate.ps1
4) 安装依赖
	- python -m pip install --upgrade pip
	- python -m pip install -r requirements.txt
5) 启动服务
	- uvicorn app.main:app --host 0.0.0.0 --port 8001

#### 2. 启动前端（Vite）
在另一个 PowerShell 终端中：
1) 进入前端目录
	- cd .\frontend
2) 安装依赖
	- npm install
3) 启动开发服务器
	- npm run dev

#### 3. 访问地址
- 前端：http://localhost:5173
- 后端：http://localhost:8001

## 常用接口
- /boreholes/scan
- /boreholes/upload
- /boreholes/fix-encoding
- /interpolate/field
- /pressure/index/grid
- /pressure/index/workfaces
- /pressure/steps/grid
- /pressure/steps/workfaces
- /summary/index

## 前端访问
默认：http://localhost:5173
后端：http://localhost:8001
