@echo off
chcp 65001 >nul

echo 停止服务...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8001"') do taskkill /PID %%a /F >nul 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do taskkill /PID %%a /F >nul 2>nul

echo 服务已停止
timeout /t 1 /nobreak >nul
