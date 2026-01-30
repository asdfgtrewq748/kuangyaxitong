@echo off
chcp 65001 >nul
echo ========================================
echo 矿压系统启动脚本 (需在Anaconda Prompt中运行)
echo ========================================

cd /d "%~dp0"

echo.
echo [1/5] 检查conda命令...
where conda >nul 2>nul
if errorlevel 1 (
    echo ❌ 请在Anaconda Prompt中运行此脚本！
    echo.
    echo 操作步骤：
    echo 1. 打开开始菜单，搜索 "Anaconda Prompt"
    echo 2. 进入项目目录: cd /d %~dp0
    echo 3. 运行: start_anaconda.bat
    echo.
    pause
    exit /b 1
)
echo ✓ conda已找到

echo.
echo [2/5] 检查kuangya环境...
conda env list | findstr /C:"kuangya" >nul
if errorlevel 1 (
    echo 创建kuangya环境...
    conda create -n kuangya python=3.11 -y
    echo ✓ 环境创建完成
) else (
    echo ✓ kuangya环境已存在
)

echo.
echo [3/5] 激活环境并安装依赖...
call conda activate kuangya
cd backend
echo 安装Python依赖包...
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt 2>nul
if errorlevel 1 pip install -r requirements.txt
echo ✓ 依赖安装完成

echo.
echo [4/5] 启动后端服务...
cd %~dp0
start "矿压系统-后端" cmd /k "conda activate kuangya && cd /d %~dp0backend && uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

timeout /t 5 /nobreak >nul

echo.
echo [5/5] 启动前端服务...
cd frontend
if not exist node_modules (
    echo 安装Node依赖...
    npm install
)
start "矿压系统-前端" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo ✓ 启动完成！
echo ========================================
echo.
echo 后端: http://localhost:8001
echo 前端: http://localhost:5173
echo.
pause
