@echo off
title Stop NutriAI

echo Closing Backend...
taskkill /F /IM python.exe >nul 2>&1

echo Closing Frontend...
taskkill /F /IM node.exe >nul 2>&1

echo Closing Command Windows...
taskkill /FI "WINDOWTITLE eq Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend*" /F >nul 2>&1

echo.
echo NutriAI Stopped Successfully.

pause