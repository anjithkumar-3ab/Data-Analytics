@echo off
title NutriAI Setup
color 0A

set ROOT=%~dp0

echo ==========================================
echo        NutriAI Initial Setup
echo ==========================================

cd /d "%ROOT%\backend"

if not exist venv (
    echo.
    echo Creating Python Virtual Environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo.
echo Upgrading pip...
python -m pip install --upgrade pip

if exist requirements.txt (
    echo.
    echo Installing Backend Packages...
    pip install -r requirements.txt
)

if not exist .env (
    echo.
    echo *********************************************
    echo backend\.env NOT FOUND
    echo Create .env before starting project.
    echo *********************************************
)

echo.
echo Installing Frontend Packages...

cd /d "%ROOT%\frontend"

if not exist node_modules (
    npm install
)

echo.
echo ==========================================
echo      Setup Completed Successfully
echo ==========================================

pause