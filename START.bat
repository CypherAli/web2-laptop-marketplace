@echo off
echo ============================================
echo   LAPTOP MARKETPLACE - STARTUP SCRIPT
echo ============================================
echo.

REM Kill existing node processes
echo [1/4] Stopping existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Start MongoDB (if not running)
echo [2/4] Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo Starting MongoDB service...
    net start MongoDB 2>nul
) else (
    echo MongoDB is already running
)

REM Start Backend Server
echo [3/4] Starting Backend Server (Port 5000)...
cd /d "%~dp0server"
start "Backend Server" cmd /k "node server.js"
timeout /t 3 /nobreak >nul

REM Start Frontend Client
echo [4/4] Starting Frontend Client (Port 3000)...
cd /d "%~dp0client"
start "Frontend Client" cmd /k "npm start"

echo.
echo ============================================
echo   ALL SERVICES STARTED!
echo ============================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo   Admin:    http://localhost:3000/dashboard/admin
echo ============================================
echo.
echo Press any key to exit this window...
pause >nul
