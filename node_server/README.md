---
noteId: "0b5cb930c88f11f0931777e45d829474"
tags: []

---

# Data Insights Agent - Full Stack

A professional AI-powered data analysis system with React + Vite frontend, Python Flask backend, and Node.js API server.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│         React + Vite + Tailwind CSS Dashboard           │
│              (Frontend - Port 5173)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Node.js Express API Server                       │
│              (API - Port 3000)                            │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Python Flask App    │  │  Gemini Agent        │
│  (Backend - 8001)    │  │  (Node.js)           │
│  - Data Analysis     │  │  - Tool Orchestration│
│  - Metrics/Summary   │  │                      │
│  - Chart Generation  │  │                      │
└──────────────────────┘  └──────────────────────┘
```

## Installation

### 1. Frontend
```bash
cd Frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

### 2. Python Backend
```bash
cd python_agent
pip install -r requirements.txt
python app.py  # Starts on http://localhost:8001
```

### 3. Node Agent & API Server
```bash
# In root directory
npm install

# Terminal 1: Run Gemini Agent
cd Agent
node agent.js

# Terminal 2: Run API Server
node ../api-server.js  # Starts on http://localhost:3000
```

## Features

### Frontend Dashboard
- 🎨 **Modern UI**: Glassmorphism design with gradient animations
- 📊 **Real-time Analytics**: Summary, metrics, and visualizations
- ✨ **Smooth Animations**: Framer Motion transitions
- 📱 **Responsive Design**: Mobile-friendly layout
- 🎯 **Dark Theme**: Professional dark mode interface

### Data Analysis
- 📈 Dataset Summary (rows, columns, null counts)
- 📊 Statistical Metrics (mean, std dev, unique values)
- 🔍 AI-powered Insights from Gemini
- 📉 Interactive Charts and Visualizations

### API Endpoints

#### POST /api/analyze
Analyze a CSV dataset and return comprehensive insights.

**Request:**
```json
{
  "datasetUrl": "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
}
```

**Response:**
```json
{
  "summary": {
    "rows": 150,
    "columns": 5,
    "null_counts": {...},
    "column_types": {...}
  },
  "metrics": {
    "numeric": {...},
    "categorical": {...}
  },
  "chat": "AI-generated insights about the dataset...",
  "chart": "base64_encoded_image"
}
```

## Configuration

### .env (Root)
```env
GEMINI_API_KEY=your_api_key_here
AGENT_URL=http://localhost:8001
PORT=3000
```

### .env (python_agent/)
```env
GEMINI_API_KEY=your_api_key_here
FLASK_HOST=0.0.0.0
FLASK_PORT=8001
MONGO_URI=mongodb://localhost:27017
```

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Animations**: Framer Motion
- **Charting**: Recharts
- **Backend API**: Node.js + Express
- **Data Processing**: Python + Flask + Pandas
- **AI/LLM**: Google Gemini API
- **Database**: MongoDB (optional)
- **HTTP Client**: Axios

## Project Structure

```
data-insights-agent/
├── Frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Dashboard components
│   │   ├── App.jsx           # Main app component
│   │   └── index.css         # Tailwind + custom styles
│   └── package.json
│
├── python_agent/            # Flask backend
│   ├── app.py               # Flask app entry point
│   ├── config.py            # Configuration
│   ├── controllers/          # API endpoints
│   ├── tools/               # Data analysis tools
│   ├── utils/               # Helper functions
│   └── requirements.txt
│
├── Agent/                   # Gemini AI Agent
│   ├── agent.js             # Main agent logic
│   ├── package.json         # Node dependencies
│   └── .env                 # Agent configuration
│
├── api-server.js            # Express API server
└── package.json             # Root dependencies
```

## Running the Full Stack

### Option 1: Manual (3 Terminals)

**Terminal 1 - Frontend**
```bash
cd Frontend
npm run dev
```

**Terminal 2 - Python Backend**
```bash
cd python_agent
python app.py
```

**Terminal 3 - API Server & Agent**
```bash
# Start API Server
npm run api

# Or start both in series:
cd Agent && node agent.js & node ../api-server.js
```

### Option 2: Using process manager (PM2)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

## Features Showcase

### Dataset Overview
- Total rows and columns
- Data type distribution
- Missing value analysis with visual indicators
- Column-wise null counts

### Statistical Metrics
- Numeric: Mean, Std Dev, Min, Max, Quartiles
- Categorical: Unique values, value counts
- Distribution analysis

### AI Insights
- Automatic pattern detection
- Anomaly identification
- Trend analysis
- Data quality assessment

### Visualizations
- Interactive charts (line, bar, scatter)
- Customizable axes
- Real-time updates

## Performance Optimizations

- ✅ Code splitting with Vite
- ✅ Tree-shaking for unused imports
- ✅ Image lazy loading
- ✅ CSS purging with Tailwind
- ✅ Efficient re-renders with React 19
- ✅ Animation GPU acceleration

## Error Handling

- ✅ Try-catch blocks in all API calls
- ✅ User-friendly error messages
- ✅ Fallback mechanisms
- ✅ Loading states
- ✅ Network timeout handling

## Security Considerations

- ✅ CORS enabled for local development
- ✅ Input validation on all endpoints
- ✅ Environment variables for sensitive data
- ✅ No hardcoded credentials
- ✅ SQL injection prevention (Pandas/PyMongo)

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Dataset upload (instead of URL)
- [ ] Export results (PDF, CSV, JSON)
- [ ] Saved analysis history
- [ ] Collaborative features
- [ ] Advanced ML models integration
- [ ] Real-time data streaming
- [ ] Custom chart builder
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
