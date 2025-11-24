#!/bin/bash
# Demo/Test Script for Data Insights Agent

echo "========================================"
echo "Data Insights Agent - Demo"
echo "========================================"
echo ""

# Check services are running
echo "Checking services..."
echo ""

# Check Frontend
if curl -s http://localhost:5173 > /dev/null; then
  echo "✓ Frontend is running on http://localhost:5173"
else
  echo "✗ Frontend is NOT running"
fi

# Check API Server
if curl -s http://localhost:3000/health > /dev/null; then
  echo "✓ API Server is running on http://localhost:3000"
else
  echo "✗ API Server is NOT running"
fi

# Check Flask Backend
if curl -s http://localhost:8001 > /dev/null; then
  echo "✓ Flask Backend is running on http://localhost:8001"
else
  echo "✗ Flask Backend is NOT running"
fi

echo ""
echo "========================================"
echo "Testing API Endpoint"
echo "========================================"
echo ""

# Test the API endpoint
echo "Testing POST /api/analyze with Iris dataset..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "datasetUrl": "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
  }')

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo "========================================"
echo "Test Summary"
echo "========================================"
echo ""
echo "If you see results above, the API is working!"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Try analyzing the default Iris dataset"
echo "3. Or paste your own CSV dataset URL"
echo ""
echo "Demo datasets to try:"
echo "  - Iris: https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
echo "  - Titanic: https://raw.githubusercontent.com/mwaskom/seaborn-data/master/titanic.csv"
echo "  - Tips: https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv"
echo ""
