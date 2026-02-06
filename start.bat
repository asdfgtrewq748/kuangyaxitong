@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ================================
echo   Mining Pressure System Startup
echo ================================
echo.

echo [1/4] Checking dependencies...
cd backend
pip install python-multipart >nul 2>nul
pip install -r requirements.txt >nul 2>nul
cd ..

echo [2/4] Starting backend services...
cd backend
start "backend-8001" cmd /k python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
start "backend-5000" cmd /k python api_server.py
cd ..

timeout /t 3 /nobreak >nul

echo [3/4] Starting frontend service...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
start "frontend-5173" cmd /k npm run dev
cd ..

timeout /t 2 /nobreak >nul

echo [4/4] Health check URLs:
echo   API-8001: http://localhost:8001/health
echo   API-5000: http://localhost:5000/api/health
echo   WEB-5173: http://localhost:5173

echo.
echo ================================
echo   Startup Complete
echo   Backend:      http://localhost:8001
echo   Academic API: http://localhost:5000
echo   Frontend:     http://localhost:5173
echo ================================
echo.
pause
