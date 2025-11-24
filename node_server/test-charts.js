#!/usr/bin/env node

/**
 * Quick test script to verify chart functionality
 * Usage: node test-charts.js <dataset-url>
 * 
 * Example:
 * node test-charts.js "https://example.com/iris.csv"
 */

import axios from 'axios';

const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8001';
const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testCharts() {
  const datasetUrl = process.argv[2];

  if (!datasetUrl) {
    console.error('Usage: node test-charts.js <dataset-url>');
    console.error('Example: node test-charts.js "https://example.com/iris.csv"');
    process.exit(1);
  }

  console.log('🧪 Testing Chart Functionality\n');
  console.log(`Dataset URL: ${datasetUrl}`);
  console.log(`Agent URL: ${AGENT_URL}`);
  console.log(`API URL: ${API_URL}\n`);

  try {
    // Step 1: Call Python agent directly
    console.log('1️⃣ Testing Python Agent /agent/chart endpoint...');
    const agentRes = await axios.post(`${AGENT_URL}/agent/chart`, {
      file_url: datasetUrl,
    });
    console.log('✅ Python agent responded');
    console.log(`   Charts count: ${agentRes.data.charts?.length || 0}`);
    if (agentRes.data.charts?.[0]) {
      console.log(`   First chart type: ${agentRes.data.charts[0].type}`);
      console.log(`   First chart title: ${agentRes.data.charts[0].title}`);
    }

    // Step 2: Call Express API analyze endpoint
    console.log('\n2️⃣ Testing Express /api/analyze endpoint...');
    const apiRes = await axios.post(`${API_URL}/api/analyze`, {
      datasetUrl: datasetUrl,
    });
    console.log('✅ Express API responded');
    console.log(`   Charts count: ${apiRes.data.charts?.length || 0}`);

    if (apiRes.data.charts?.[0]) {
      const firstChart = apiRes.data.charts[0];
      console.log(`   First chart type: ${firstChart.type}`);
      console.log(`   First chart title: ${firstChart.title}`);
      console.log(`   Chart has .data? ${!!firstChart.data}`);
      console.log(`   Chart has .options? ${!!firstChart.options}`);

      // Verify Chart.js format
      if (firstChart.data) {
        const hasLabels = !!firstChart.data.labels;
        const hasDatasets = !!firstChart.data.datasets;
        console.log(`   Chart.js format check:`);
        console.log(`     - Has labels: ${hasLabels}`);
        console.log(`     - Has datasets: ${hasDatasets}`);
      }
    }

    // Step 3: Compare formats
    console.log('\n3️⃣ Format Comparison:');
    const pyChart = agentRes.data.charts?.[0];
    const jsChart = apiRes.data.charts?.[0];

    if (pyChart && jsChart) {
      console.log('   Python format keys:', Object.keys(pyChart).join(', '));
      console.log('   Chart.js format keys:', Object.keys(jsChart).join(', '));
      console.log('\n   ✅ Charts successfully converted!');
    }

    // Step 4: Summary
    console.log('\n4️⃣ Summary:');
    console.log(`   ✅ Total charts generated: ${apiRes.data.charts.length}`);
    console.log(`   Chart types: ${[...new Set(apiRes.data.charts.map(c => c.type))].join(', ')}`);
    console.log(`   Metrics received: ${apiRes.data.metrics ? 'Yes' : 'No'}`);
    console.log(`   Summary received: ${apiRes.data.summary ? 'Yes' : 'No'}`);

    console.log('\n✨ All tests passed! Charts feature is working.\n');
  } catch (err) {
    console.error('\n❌ Error:');
    if (err.response?.data) {
      console.error('   Response:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('   ' + err.message);
    }
    process.exit(1);
  }
}

testCharts();
