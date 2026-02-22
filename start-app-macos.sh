#!/bin/zsh

# Install backend dependencies (silent, auto-close)
(cd backend && npm install &)

# Start backend server in new Terminal tab
osascript -e 'tell app "Terminal" to do script "cd backend && npm start"'

# Install frontend dependencies (silent, auto-close)
(cd frontend && npm install &)

# Start frontend dev server in new Terminal tab
osascript -e 'tell app "Terminal" to do script "cd frontend && npm run dev"'
