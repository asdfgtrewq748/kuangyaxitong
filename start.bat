@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ================================
echo    矿压系统启动中...
echo ================================
echo.

echo [1/3] 检查依赖...
cd backend
pip install python-multipart >nul 2>nul
pip install -r requirements.txt >nul 2>nul
cd ..

echo [2/3] 后端服务...
cd backend
start "后端-8001" cmd /k python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
cd ..

timeout /t 3 /nobreak >nul

echo [3/3] 前端服务...
cd frontend
if not exist node_modules (
    echo 安装前端依赖...
    call npm install
)
start "前端-5173" cmd /k npm run dev
cd ..

timeout /t 2 /nobreak >nul

echo.
echo ================================
echo   启动完成！
echo   后端: http://localhost:8001
echo   前端: http://localhost:5173
echo ================================
echo.
pause
