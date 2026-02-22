@echo off

REM Install backend dependencies (silent, closes when done)
start /B cmd /c "cd backend && npm install"

REM Start backend server (keeps terminal open)
start cmd /k "cd backend && npm start"

REM Install frontend dependencies (silent, closes when done)
start /B cmd /c "cd frontend && npm install"

REM Start frontend dev server (keeps terminal open)
start cmd /k "cd frontend && npm run dev"