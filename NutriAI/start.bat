@echo off
title NutriAI Launcher
color 0B

set ROOT=%~dp0

echo ==========================================
echo        Starting NutriAI
echo ==========================================

start "Backend" cmd /k "cd /d %ROOT%\backend && call venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload --port 8001"

timeout /t 5 >nul

start "Frontend" cmd /k "cd /d %ROOT%\frontend && npm run dev"

timeout /t 5 >nul

start http://127.0.0.1:8001/docs
start http://localhost:5173

echo.
echo Backend  : http://127.0.0.1:8001
echo Swagger : http://127.0.0.1:8001/docs
echo Frontend: http://localhost:5173
echo.

pause