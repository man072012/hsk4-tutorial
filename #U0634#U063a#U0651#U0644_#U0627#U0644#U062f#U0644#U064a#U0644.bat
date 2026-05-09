@echo off
chcp 65001 >nul
title HSK4 Tutorial - Local HTTP Server

echo ========================================
echo   HSK4 Mock Test 6 - Tutorial Server
echo ========================================
echo.

cd /d "%~dp0"

echo Starting local HTTP server...
echo.
echo The browser will open automatically in 2 seconds.
echo.
echo IMPORTANT: Keep this window open while using the tutorial!
echo To stop the server, close this window.
echo.

timeout /t 2 /nobreak >nul

start "" "http://localhost:8000/HSK4_Mock6_Arabic_Tutorial.html"

REM Try Python 3 first
where python >nul 2>nul
if %errorlevel% == 0 (
    python -m http.server 8000
    goto :end
)

REM Try py launcher
where py >nul 2>nul
if %errorlevel% == 0 (
    py -m http.server 8000
    goto :end
)

REM Try Node
where npx >nul 2>nul
if %errorlevel% == 0 (
    npx --yes http-server -p 8000
    goto :end
)

echo.
echo ERROR: Python or Node.js is not installed.
echo Please install Python from https://www.python.org/downloads/
echo Then run this file again.
echo.
pause

:end
