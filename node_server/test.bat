@echo off
REM Test/Demo Script for Data Insights Agent

echo.
echo ========================================
echo Data Insights Agent - Test
echo ========================================
echo.

REM Check services are running
echo Checking services...
echo.

REM Check Frontend (simple check)
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:5173' -ErrorAction Stop; Write-Host '✓ Frontend is running on http://localhost:5173' } catch { Write-Host '✗ Frontend is NOT running' }"

REM Check API Server
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:3000/health' -ErrorAction Stop; Write-Host '✓ API Server is running on http://localhost:3000' } catch { Write-Host '✗ API Server is NOT running' }"

REM Check Flask Backend
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:8001' -ErrorAction Stop; Write-Host '✓ Flask Backend is running on http://localhost:8001' } catch { Write-Host '✗ Flask Backend is NOT running' }"

echo.
echo ========================================
echo Testing API Endpoint
echo ========================================
echo.

echo Testing POST /api/analyze with Iris dataset...
echo.

powershell -Command "
try {
  $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/analyze' `
    -Method POST `
    -Headers @{'Content-Type'='application/json'} `
    -Body '{""datasetUrl"": ""https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv""}' `
    -ErrorAction Stop
  
  Write-Host 'Response:'
  Write-Host $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
  Write-Host 'Error: ' $_.Exception.Message
}
"

echo.
echo ========================================
echo Test Summary
echo ========================================
echo.
echo If you see results above, the API is working!
echo.
echo Next steps:
echo 1. Open http://localhost:5173 in your browser
echo 2. Try analyzing the default Iris dataset
echo 3. Or paste your own CSV dataset URL
echo.
echo Demo datasets to try:
echo   - Iris: https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv
echo   - Titanic: https://raw.githubusercontent.com/mwaskom/seaborn-data/master/titanic.csv
echo   - Tips: https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv
echo.

pause
