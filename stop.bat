@echo off
chcp 65001 >nul
echo 正在停止所有服务...

taskkill /FI "WindowTitle eq 矿压系统-后端*" /T /F 2>nul
taskkill /FI "WindowTitle eq 矿压系统-前端*" /T /F 2>nul

echo.
echo ✓ 服务已停止
timeout /t 2 /nobreak >nul
