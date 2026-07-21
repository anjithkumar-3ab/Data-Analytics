@echo off
title NutriAI Update
color 0E

set ROOT=%~dp0

echo ==========================================
echo Updating NutriAI...
echo ==========================================

cd /d "%ROOT%"

git pull

cd backend

call venv\Scripts\activate.bat

pip install -r requirements.txt

cd ..\frontend

npm install

echo.
echo ==========================================
echo Update Completed Successfully
echo ==========================================

pause