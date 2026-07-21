@echo off
title NutriAI Reset
color 0C

set ROOT=%~dp0

echo ==========================================
echo Resetting NutriAI
echo ==========================================

cd /d "%ROOT%\backend"

if exist venv (
    rd /s /q venv
)

python -m venv venv

call venv\Scripts\activate.bat

python -m pip install --upgrade pip

pip install -r requirements.txt

cd /d "%ROOT%\frontend"

if exist node_modules (
    rd /s /q node_modules
)

if exist package-lock.json (
    del package-lock.json
)

npm install

echo.
echo ==========================================
echo Reset Completed Successfully
echo ==========================================

pause