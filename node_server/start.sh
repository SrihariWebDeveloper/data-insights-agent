#!/bin/bash

echo ""
echo "========================================"
echo "Data Insights Agent - Startup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed"
    exit 1
fi

# Create logs directory
mkdir -p logs

echo "Starting Data Insights Agent services..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID $API_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $API_PID $FRONTEND_PID 2>/dev/null
    echo "All services stopped."
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Start Python Flask Backend
echo "[1/3] Starting Flask backend on port 8001..."
(cd python_agent && python3 app.py) > logs/backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

# Start Node API Server
echo "[2/3] Starting API server on port 3000..."
node api-server.js > logs/api.log 2>&1 &
API_PID=$!
sleep 2

# Start Frontend Dev Server
echo "[3/3] Starting Frontend on port 5173..."
(cd Frontend && npm run dev) > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Services started!"
echo "========================================"
echo ""
echo "Frontend:      http://localhost:5173"
echo "API Server:    http://localhost:3000"
echo "Flask Backend: http://localhost:8001"
echo ""
echo "Logs:"
echo "  Backend:  ./logs/backend.log"
echo "  API:      ./logs/api.log"
echo "  Frontend: ./logs/frontend.log"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

# Wait for all background processes
wait
