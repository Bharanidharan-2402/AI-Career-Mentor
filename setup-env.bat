@echo off
REM AI Career Mentor - Environment Setup Wizard for Windows
REM This script helps you configure your environment variables

setlocal enabledelayedexpansion

cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║    AI STUDENT CAREER MENTOR - SETUP WIZARD               ║
echo ║    Environment Configuration Helper                      ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo Before you begin, make sure you have:
echo [1] MongoDB Atlas connection string
echo [2] Google Gemini API key
echo.
echo You can get these from:
echo - MongoDB Atlas: https://www.mongodb.com/cloud/atlas
echo - Gemini API: https://makersuite.google.com/app/apikey
echo.

set /p proceed="Do you have both credentials ready? (y/n): "
if /i not "%proceed%"=="y" (
    echo.
    echo Please get your credentials first, then run this script again.
    echo.
    pause
    exit /b
)

echo.
echo ═══════════════════════════════════════════════════════════
echo Step 1: MongoDB Atlas Connection String
echo ═══════════════════════════════════════════════════════════
echo.
echo Your connection string should look like:
echo mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true^&w=majority
echo.
set /p mongo_uri="Enter your MongoDB URI: "

if "%mongo_uri%"=="" (
    echo ERROR: MongoDB URI cannot be empty!
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo Step 2: Google Gemini API Key
echo ═══════════════════════════════════════════════════════════
echo.
echo Your API key should be a long string of letters and numbers
echo.
set /p gemini_key="Enter your Gemini API Key: "

if "%gemini_key%"=="" (
    echo ERROR: Gemini API Key cannot be empty!
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo Step 3: Optional Settings
echo ═══════════════════════════════════════════════════════════
echo.

set /p port="Enter backend port (default 5000): "
if "%port%"=="" set port=5000

set /p jwt_secret="Enter JWT Secret (or press Enter for random): "
if "%jwt_secret%"=="" (
    REM Generate a random JWT secret
    for /f "tokens=2-4 delims=/ " %%%%a in ('date /t') do set mydate=%%%%c%%%%a%%%%b
    for /f "tokens=1-2 delims=/:" %%%%a in ('time /t') do set mytime=%%%%a%%%%b
    set jwt_secret=!mydate!!mytime!_secret_key_!random!
    echo Generated JWT Secret: !jwt_secret!
)

echo.
echo ═══════════════════════════════════════════════════════════
echo Creating .env file...
echo ═══════════════════════════════════════════════════════════
echo.

REM Create the .env file
(
    echo PORT=%port%
    echo MONGO_URI=%mongo_uri%
    echo JWT_SECRET=%jwt_secret%
    echo GEMINI_API_KEY=%gemini_key%
    echo CLIENT_URL=http://localhost:5173
    echo LOG_LEVEL=debug
    echo NODE_ENV=development
) > server\.env

echo ✓ .env file created successfully!
echo.
echo ═══════════════════════════════════════════════════════════
echo Configuration Summary
echo ═══════════════════════════════════════════════════════════
echo.
echo Backend Port: %port%
echo MongoDB: Configured
echo Gemini API: Configured
echo Frontend URL: http://localhost:5173
echo.
echo ✓ Setup complete!
echo.
echo Next steps:
echo 1. Restart backend: npm --prefix server run dev
echo 2. Run tests: node server/tests/integration.test.js
echo 3. Open browser: http://localhost:5173
echo.
pause
