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
后端：http://localhost:8000
