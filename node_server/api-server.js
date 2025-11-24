import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_SCREAT_KEY,
});

const app = express();
const PORT = process.env.PORT || 3000;
const AGENT_URL = process.env.AGENT_URL || 'https://data-insights-agent-leta.onrender.com';

// Multer setup for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use(cors({allowedHeaders: '*', origin: '*', methods: '*'}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Helper function to convert Python chart format to Chart.js format
const convertChartToChartJS = (pyChart) => {
  if (!pyChart) return null;

  const chartType = pyChart.type?.toLowerCase() || 'bar';
  const title = pyChart.title || 'Chart';

  try {
    // Handle different Python chart formats
    if (chartType === 'scatter') {
      // Scatter: datasets contain {label, data: [{x, y}, ...]}
      return {
        type: 'scatter',
        title: title,
        data: {
          datasets: (pyChart.datasets || []).map(ds => ({
            label: ds.label || 'Data',
            data: ds.data || [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            fill: false,
          })),
        },
        options: {
          responsive: true,
          scales: {
            x: { type: 'linear', title: { display: true, text: pyChart.xLabel || 'X' } },
            y: { title: { display: true, text: pyChart.yLabel || 'Y' } },
          },
        },
      };
    } else if (chartType === 'line') {
      // Line: has labels and datasets
      return {
        type: 'line',
        title: title,
        data: {
          labels: pyChart.labels || [],
          datasets: (pyChart.datasets || []).map((ds, idx) => ({
            label: ds.label || `Series ${idx + 1}`,
            data: ds.data || [],
            borderColor: ['rgb(59, 130, 246)', 'rgb(34, 197, 94)', 'rgb(249, 115, 22)'][idx % 3],
            backgroundColor: ['rgba(59, 130, 246, 0.1)', 'rgba(34, 197, 94, 0.1)', 'rgba(249, 115, 22, 0.1)'][idx % 3],
            tension: 0.1,
            fill: false,
          })),
        },
        options: { responsive: true },
      };
    } else if (chartType === 'pie') {
      // Pie: has labels and values
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      return {
        type: 'pie',
        title: title,
        data: {
          labels: pyChart.labels || [],
          datasets: [{
            data: pyChart.values || [],
            backgroundColor: colors.slice(0, (pyChart.values || []).length),
          }],
        },
        options: { responsive: true },
      };
    } else if (chartType === 'histogram' || chartType === 'bar') {
      // Bar/Histogram: has labels and values
      return {
        type: 'bar',
        title: title,
        data: {
          labels: pyChart.labels || [],
          datasets: [{
            label: pyChart.title || 'Values',
            data: pyChart.values || [],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          }],
        },
        options: { responsive: true },
      };
    }

    return null;
  } catch (err) {
    console.error('Error converting chart:', err);
    return null;
  }
};

// File upload endpoint - handles file upload to Cloudinary
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Upload file to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'data-insights-agent',
      public_id: `${Date.now()}-${req.file.originalname}`,
    });

    const fileUrl = cloudinaryResult.secure_url;

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    // Call the Flask backend endpoints with the Cloudinary URL
    const [summaryRes, metricsRes, chartRes] = await Promise.allSettled([
      axios.post(`${AGENT_URL}/agent/summary`, { file_url: fileUrl }),
      axios.post(`${AGENT_URL}/agent/metrics`, { file_url: fileUrl }),
      axios.post(`${AGENT_URL}/agent/chart`, { file_url: fileUrl }),
    ]);

    // Convert Python charts to Chart.js format
    let charts = [];
    if (chartRes.status === 'fulfilled' && chartRes.value.data.charts) {
      charts = chartRes.value.data.charts
        .map(pyChart => convertChartToChartJS(pyChart))
        .filter(chart => chart !== null);
    }

    const result = {
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      fileSize: req.file.size,
      uploadedAt: new Date().toISOString(),
      summary: summaryRes.status === 'fulfilled' ? summaryRes.value.data.summary : null,
      metrics: metricsRes.status === 'fulfilled' ? metricsRes.value.data.metrics : null,
      charts: charts,
    };
    console.log('Upload result - Charts count:', charts.length);
    res.json(result);
  } catch (error) {
    console.error('Error uploading file:', error.message);
    
    // Clean up temporary file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: error.message || 'Failed to upload and analyze file',
    });
  }
});

// Analyze dataset endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { datasetUrl } = req.body;

    if (!datasetUrl) {
      return res.status(400).json({ error: 'Dataset URL is required' });
    }

    // Call the Flask backend endpoints
    const [summaryRes, metricsRes, chartRes] = await Promise.allSettled([
      axios.post(`${AGENT_URL}/agent/summary`, { file_url: datasetUrl }),
      axios.post(`${AGENT_URL}/agent/metrics`, { file_url: datasetUrl }),
      axios.post(`${AGENT_URL}/agent/chart`, { file_url: datasetUrl }),
    ]);

    // Convert Python charts to Chart.js format
    let charts = [];
    if (chartRes.status === 'fulfilled' && chartRes.value.data.charts) {
      charts = chartRes.value.data.charts
        .map(pyChart => convertChartToChartJS(pyChart))
        .filter(chart => chart !== null);
    }

    const result = {
      summary: summaryRes.status === 'fulfilled' ? summaryRes.value.data.summary : null,
      metrics: metricsRes.status === 'fulfilled' ? metricsRes.value.data.metrics : null,
      charts: charts,
    };
    console.log('Analyze result - Charts count:', charts.length);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing dataset:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to analyze dataset',
    });
  }
});

// Chat endpoint - for conversational queries
app.post('/api/chat', async (req, res) => {
  try {
    const { file_url, question } = req.body;

    if (!file_url || !question) {
      return res.status(400).json({ error: 'file_url and question are required' });
    }

    // Call the Flask backend chat endpoint
    const response = await axios.post(`${AGENT_URL}/agent/chat`, {
      file_url: file_url,
      question: question,
    });

    // Extract response in different possible formats
    let reply = response.data?.response;
    if (typeof reply === 'object' && reply?.reply) {
      reply = reply.reply;
    }

    res.json({
      response: {
        reply: String(reply || 'No response generated'),
      },
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to process chat request',
    });
  }
});

// Health check
app.post('/', (req, res) => {
  res.send('API server is healthy');
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Agent backend at: ${AGENT_URL}`);
});
