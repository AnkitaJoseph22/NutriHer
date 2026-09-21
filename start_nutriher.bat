@echo off
title NutriHer Application Launcher
echo ========================================================
echo           Launching NutriHer Full-Stack System
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "NutriHer Backend (FastAPI)" cmd /k "cd /d G:\My Drive\NutriHer && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting React Frontend on http://localhost:5173 ...
start "NutriHer Frontend (Vite/React)" cmd /k "cd /d D:\nutriher - frontend && npm run dev"

echo.
echo ========================================================
echo  Backend:  http://127.0.0.1:8000  (API Docs: http://127.0.0.1:8000/docs)
echo  Frontend: http://localhost:5173
echo ========================================================
echo.
pause
