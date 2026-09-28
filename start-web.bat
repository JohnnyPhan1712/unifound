@echo off
title UniFound Web Server
echo ========================================================
echo          Dang khoi dong UniFound Web Server...
echo ========================================================

set NODE_PATH=C:\Users\ADMIN\AppData\Local\ms-playwright-go\1.57.0\node.exe

if exist "%NODE_PATH%" (
    echo [1/2] Dang khoi dong Next.js Server tai cong 3000...
    start "" "http://localhost:3000"
    "%NODE_PATH%" .\node_modules\next\dist\bin\next start -p 3000
) else (
    echo [1/2] Dang chay bang npm dev...
    start "" "http://localhost:3000"
    npm run dev
)

pause
