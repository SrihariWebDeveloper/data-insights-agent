@echo off
REM Data Insights Agent - Startup Script for Windows

echo.
echo ========================================
echo Data Insights Agent - Startup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Create logs directory
if not exist logs mkdir logs

echo Starting Data Insights Agent services...
echo.

REM Start Python Flask Backend
echo [1/3] Starting Flask backend on port 8001...
start "Flask Backend" cmd /k "cd python_agent && python app.py"
timeout /t 3 /nobreak

REM Start Node API Server
echo [2/3] Starting API server on port 3000...
start "API Server" cmd /k "node api-server.js"
timeout /t 2 /nobreak

REM Start Frontend Dev Server
echo [3/3] Starting Frontend on port 5173...
start "Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo ========================================
echo Services started!
echo ========================================
echo.
echo Frontend:      http://localhost:5173
echo API Server:    http://localhost:3000
echo Flask Backend: http://localhost:8001
echo.
echo Press Ctrl+C in any window to stop that service.
echo All windows will close when you close the main terminal.
echo.

REM Keep this window open
pause
