@echo off
title Clean NutriAI

echo Cleaning Python Cache...

for /d /r %%d in (__pycache__) do (
    if exist "%%d" rd /s /q "%%d"
)

del /s /q *.pyc >nul 2>&1

echo.
echo Cleaning npm cache...

cd frontend

if exist node_modules (
    rd /s /q node_modules
)

echo.
echo Cleaning Completed.

pause