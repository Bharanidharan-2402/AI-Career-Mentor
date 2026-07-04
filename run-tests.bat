@echo off
REM AI Career Mentor - Quick Test Script for Windows

echo.
echo ╔════════════════════════════════════════════════╗
echo ║  AI Career Mentor - Integration Tests          ║
echo ╚════════════════════════════════════════════════╝
echo.

echo Checking prerequisites...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    exit /b 1
)
echo [OK] Node.js is installed

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed.
    exit /b 1
)
echo [OK] npm is installed

REM Check if backend is running
timeout /t 2 /nobreak >nul
netstat -ano | findstr ":5000" >nul
if errorlevel 1 (
    echo [WARNING] Backend server not running on port 5000
    echo Please start backend first: npm --prefix server run dev
    echo.
)

REM Check if frontend is running
netstat -ano | findstr ":5173" >nul
if errorlevel 1 (
    echo [WARNING] Frontend server not running on port 5173
    echo Please start frontend first: npm --prefix client run dev
    echo.
)

echo.
echo Running integration tests...
echo.

REM Run the test file
node server/tests/integration.test.js

pause
