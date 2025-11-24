# Quick Start Guide

## System Requirements
- Node.js 18+ 
- Python 3.8+
- npm or yarn
- pip

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
# Root dependencies (API Server)
npm install

# Frontend dependencies
cd Frontend
npm install
cd ..

# Python dependencies
cd python_agent
pip install -r requirements.txt
cd ..

# Agent dependencies
cd Agent
npm install
cd ..
```

### Step 2: Configure Environment Variables

Create `.env` file in root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
AGENT_URL=http://localhost:8001
PORT=3000
```

### Step 3: Start All Services

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Manual (3 terminals):**

Terminal 1:
```bash
cd python_agent
python app.py
```

Terminal 2:
```bash
node api-server.js
```

Terminal 3:
```bash
cd Frontend
npm run dev
```

### Step 4: Access the Dashboard

Open your browser and go to:
```
http://localhost:5173
```

## Testing the System

1. **Default Dataset**: The app comes with the Iris dataset pre-loaded
2. **Custom Dataset**: Paste any public CSV URL
3. **Try these datasets**:
   - Iris: `https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv`
   - Titanic: `https://raw.githubusercontent.com/mwaskom/seaborn-data/master/titanic.csv`
   - Tips: `https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv`

## Troubleshooting

### Port Already in Use
If a port is already in use, you can change it:
- **Frontend**: Edit `Frontend/vite.config.js`
- **API Server**: Set `PORT=3001` in `.env`
- **Flask Backend**: Set `FLASK_PORT=8002` in `python_agent/.env`

### Missing Dependencies
```bash
# Reinstall everything
npm install
cd Frontend && npm install && cd ..
cd python_agent && pip install -r requirements.txt && cd ..
cd Agent && npm install && cd ..
```

### Services Not Connecting
1. Make sure all services are running
2. Check that ports are not blocked by firewall
3. Verify environment variables are set correctly
4. Check logs for errors

### Python Version Issues
Make sure you're using Python 3.8+:
```bash
python --version
# or
python3 --version
```

## Architecture Overview

```
User Browser (Port 5173)
         ↓
React Frontend (Vite)
         ↓
API Server (Port 3000)
         ↓
    ┌────┴────┐
    ↓         ↓
Flask App  Gemini Agent
(Port 8001) (Node.js)
    ↓
Data Tools
(Summary, Metrics, Chart, Chat)
```

## Next Steps

1. **Customize the Dashboard**: Edit components in `Frontend/src/components/`
2. **Add More Tools**: Create new tools in `python_agent/tools/`
3. **Configure Database**: Set up MongoDB in `.env`
4. **Deploy**: See `DEPLOYMENT.md` for production setup

## Performance Tips

- Use modern browsers (Chrome, Firefox, Edge)
- Ensure stable internet connection
- For large datasets (>100MB), increase timeout in `api-server.js`
- Monitor CPU/Memory usage in task manager

## Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` or `pip install -r requirements.txt` |
| "Port already in use" | Change port in `.env` or kill process using that port |
| "API not responding" | Check if API server is running on port 3000 |
| "Dataset analysis fails" | Verify CSV URL is publicly accessible |
| "Gemini API error" | Check GEMINI_API_KEY is valid and set in `.env` |

## Getting Help

1. Check the main `README.md`
2. Review error messages in browser console
3. Check terminal output for detailed logs
4. Open an issue with error details

## Environment Variables Quick Reference

```env
# Root (.env)
GEMINI_API_KEY=abc123...    # Your Gemini API key
AGENT_URL=http://localhost:8001  # Flask backend URL
PORT=3000                    # API server port

# python_agent/.env
GEMINI_API_KEY=abc123...
FLASK_HOST=0.0.0.0
FLASK_PORT=8001
MONGO_URI=mongodb://localhost:27017
```

Happy analyzing! 🚀
