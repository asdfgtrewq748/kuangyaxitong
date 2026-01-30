@echo off
chcp 65001 >nul
echo ========================================
echo 矿压系统一键启动脚本 (Anaconda)
echo ========================================

cd /d "%~dp0"

echo.
echo [1/5] 检查Anaconda环境...

REM 尝试常见的Anaconda安装路径
set "CONDA_PATH="
where conda >nul 2>nul
if not errorlevel 1 (
    set "CONDA_PATH=conda"
    echo ✓ Anaconda已在PATH中
    goto :conda_found
)

REM 尝试用户目录
if exist "%USERPROFILE%\anaconda3\Scripts\conda.exe" (
    set "CONDA_PATH=%USERPROFILE%\anaconda3\Scripts\conda.exe"
    call "%USERPROFILE%\anaconda3\Scripts\activate.bat"
    echo ✓ 找到Anaconda: %USERPROFILE%\anaconda3
    goto :conda_found
)

if exist "%USERPROFILE%\miniconda3\Scripts\conda.exe" (
    set "CONDA_PATH=%USERPROFILE%\miniconda3\Scripts\conda.exe"
    call "%USERPROFILE%\miniconda3\Scripts\activate.bat"
    echo ✓ 找到Miniconda: %USERPROFILE%\miniconda3
    goto :conda_found
)

REM 尝试C盘根目录
if exist "C:\ProgramData\anaconda3\Scripts\conda.exe" (
    set "CONDA_PATH=C:\ProgramData\anaconda3\Scripts\conda.exe"
    call "C:\ProgramData\anaconda3\Scripts\activate.bat"
    echo ✓ 找到Anaconda: C:\ProgramData\anaconda3
    goto :conda_found
)

if exist "C:\anaconda3\Scripts\conda.exe" (
    set "CONDA_PATH=C:\anaconda3\Scripts\conda.exe"
    call "C:\anaconda3\Scripts\activate.bat"
    echo ✓ 找到Anaconda: C:\anaconda3
    goto :conda_found
)

REM 未找到Anaconda
echo ❌ 未检测到Anaconda安装
echo.
echo 请选择以下方式之一:
echo 1. 在Anaconda Prompt中运行此脚本
echo 2. 安装Anaconda: https://www.anaconda.com/download
echo 3. 手动指定Anaconda路径
pause
exit /b 1

:conda_found

echo.
echo [2/5] 检查并创建kuangya环境...
call "%CONDA_PATH%" env list | findstr /C:"kuangya" >nul 2>nul
if errorlevel 1 (
    echo 创建kuangya环境 (Python 3.11)...
    call "%CONDA_PATH%" create -n kuangya python=3.11 -y
    if errorlevel 1 (
        echo ❌ 环境创建失败
        pause
        exit /b 1
    )
    echo ✓ kuangya环境创建成功
) else (
    echo ✓ kuangya环境已存在
)

echo.
echo [3/5] 安装后端依赖...
cd backend
call "%CONDA_PATH%" activate kuangya
if errorlevel 1 (
    echo ❌ 激活环境失败
    pause
    exit /b 1
)
echo 使用清华镜像源安装依赖...
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
if errorlevel 1 (
    echo 尝试使用默认源重新安装...
    pip install -r requirements.txt
)
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✓ 依赖安装完成

echo.
echo [4/5] 启动后端服务 (端口 8001)...
start "矿压系统-后端" cmd /k "call "%CONDA_PATH%" activate kuangya && cd /d %~dp0backend && uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

timeout /t 5 /nobreak >nul

echo.
echo [5/5] 启动前端服务 (端口 5173)...
cd ..\frontend
if not exist node_modules (
    echo 安装前端依赖...
    call npm install
)
start "矿压系统-前端" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo ✓ 所有服务已启动！
echo ========================================
echo.
echo 后端服务: http://localhost:8001
echo 前端页面: http://localhost:5173
echo API文档: http://localhost:8001/docs
echo.
echo 提示: 使用Anaconda环境 kuangya
echo 按任意键退出启动脚本（服务将继续运行）...
pause >nul
