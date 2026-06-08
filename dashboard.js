// ================================================
// PlantAI - Dashboard Logic
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

let trendChart = null;
let distChart = null;

function initDashboard() {
  const clearBtn = document.getElementById('btnClearHistory');
  
  // Set User Greeting if logged in
  const user = getUser();
  const dbGreeting = document.getElementById('dbGreeting');
  if (dbGreeting && user) {
    dbGreeting.textContent = `Welcome Back, ${user.name}!`;
  }

  // Pre-populate mock history if empty to show outstanding charts on demo load
  ensureMockHistory();

  // Load stats & lists
  loadDashboardData();

  clearBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all diagnostic history?')) {
      localStorage.removeItem(HISTORY_KEY);
      loadDashboardData();
      showToast('Diagnostic history cleared.', 'info');
    }
  });
}

function ensureMockHistory() {
  const history = getHistory();
  if (history.length === 0) {
    // Generate 5 mock reports spread out in time
    const mockReports = [
      {
        primary: { disease: PLANT_DISEASES[0], confidence: 91 }, // Tomato Early Blight
        top3: [
          { disease: PLANT_DISEASES[0], confidence: 91 },
          { disease: PLANT_DISEASES[1], confidence: 7 },
          { disease: PLANT_DISEASES[3], confidence: 2 }
        ],
        severity: 72,
        riskLevel: 'High',
        yieldLoss: 32,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        primary: { disease: PLANT_DISEASES[4], confidence: 88 }, // Potato Late Blight
        top3: [
          { disease: PLANT_DISEASES[4], confidence: 88 },
          { disease: PLANT_DISEASES[5], confidence: 9 },
          { disease: PLANT_DISEASES[6], confidence: 3 }
        ],
        severity: 85,
        riskLevel: 'Critical',
        yieldLoss: 60,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      },
      {
        primary: { disease: PLANT_DISEASES[9], confidence: 94 }, // Wheat Rust
        top3: [
          { disease: PLANT_DISEASES[9], confidence: 94 },
          { disease: PLANT_DISEASES[0], confidence: 4 },
          { disease: PLANT_DISEASES[3], confidence: 2 }
        ],
        severity: 45,
        riskLevel: 'Medium',
        yieldLoss: 22,
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
      },
      {
        primary: { disease: PLANT_DISEASES[10], confidence: 90 }, // Pepper Bacterial Spot
        top3: [
          { disease: PLANT_DISEASES[10], confidence: 90 },
          { disease: PLANT_DISEASES[0], confidence: 8 },
          { disease: PLANT_DISEASES[3], confidence: 2 }
        ],
        severity: 28,
        riskLevel: 'Low',
        yieldLoss: 14,
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() // 20 days ago
      },
      {
        primary: { disease: PLANT_DISEASES[3], confidence: 98 }, // Tomato Healthy Leaf
        top3: [
          { disease: PLANT_DISEASES[3], confidence: 98 },
          { disease: PLANT_DISEASES[0], confidence: 1 },
          { disease: PLANT_DISEASES[1], confidence: 1 }
        ],
        severity: 2,
        riskLevel: 'Low',
        yieldLoss: 0,
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() // 25 days ago
      }
    ];
    
    mockReports.forEach(r => saveToHistory(r));
  }
}

function loadDashboardData() {
  const history = getHistory();
  const listEl = document.getElementById('historyList');
  const emptyEl = document.getElementById('historyEmpty');
  
  if (history.length === 0) {
    listEl.innerHTML = '';
    listEl.appendChild(emptyEl);
    document.getElementById('statTotalScans').textContent = '0';
    document.getElementById('statAvgSeverity').textContent = '0%';
    document.getElementById('statCriticalIssues').textContent = '0';
    renderCharts([]);
    return;
  }

  emptyEl.classList.add('hidden');
  
  // Calculate quick stats
  const totalScans = history.length;
  const avgSeverity = Math.round(history.reduce((acc, h) => acc + h.severity, 0) / totalScans);
  const criticalCount = history.filter(h => h.riskLevel === 'Critical' || h.riskLevel === 'High').length;
  
  document.getElementById('statTotalScans').textContent = totalScans;
  document.getElementById('statAvgSeverity').textContent = `${avgSeverity}%`;
  document.getElementById('statCriticalIssues').textContent = criticalCount;

  // Render lists
  listEl.innerHTML = history.map(item => {
    const disease = item.primary.disease;
    return `
      <div class="history-card">
        <div class="hc-left">
          <div class="hc-icon">${disease.cropEmoji}</div>
          <div class="hc-info">
            <h4>${disease.name}</h4>
            <p>${formatDate(item.timestamp)} • Crop: ${disease.crop.toUpperCase()}</p>
          </div>
        </div>
        <div class="hc-right">
          <div class="hc-metric">
            <span class="hc-metric-val ${item.riskLevel.toLowerCase()}">${item.severity}%</span>
            <span class="hc-metric-lbl">Severity</span>
          </div>
          <div class="hc-metric">
            <span class="hc-metric-val color-danger">${item.yieldLoss}%</span>
            <span class="hc-metric-lbl">Est Loss</span>
          </div>
          <button class="btn-view-report" onclick="window.location.href='detect.html?disease=${disease.id}'">
            View Analysis
          </button>
        </div>
      </div>
    `;
  }).join('');

  renderCharts(history);
}

function renderCharts(history) {
  // Group by disease names
  const diseaseCounts = {};
  history.forEach(h => {
    const name = h.primary.disease.name;
    diseaseCounts[name] = (diseaseCounts[name] || 0) + 1;
  });

  // Group scans by date (past 7 days or weeks)
  const dateCounts = {
    'Week 1': 0,
    'Week 2': 0,
    'Week 3': 0,
    'Week 4': 0
  };
  
  history.forEach(h => {
    const diffDays = Math.floor((Date.now() - new Date(h.timestamp).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) dateCounts['Week 4']++;
    else if (diffDays <= 14) dateCounts['Week 3']++;
    else if (diffDays <= 21) dateCounts['Week 2']++;
    else dateCounts['Week 1']++;
  });

  // Trend Chart (Line Chart)
  const ctxTrend = document.getElementById('trendChart')?.getContext('2d');
  if (ctxTrend) {
    if (trendChart) trendChart.destroy();
    trendChart = new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: Object.keys(dateCounts),
        datasets: [{
          label: 'Total Diagnostic Scans',
          data: Object.values(dateCounts),
          borderColor: '#52b788',
          backgroundColor: 'rgba(82, 183, 136, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8892b0' } },
          x: { grid: { display: false }, ticks: { color: '#8892b0' } }
        }
      }
    });
  }

  // Distribution Chart (Doughnut Chart)
  const ctxDist = document.getElementById('distributionChart')?.getContext('2d');
  if (ctxDist) {
    if (distChart) distChart.destroy();
    distChart = new Chart(ctxDist, {
      type: 'doughnut',
      data: {
        labels: Object.keys(diseaseCounts),
        datasets: [{
          data: Object.values(diseaseCounts),
          backgroundColor: ['#e63946', '#f4a261', '#ffd700', '#52b788', '#4fc3f7', '#ce93d8', '#ffab91']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#8892b0', font: { size: 10 } }
          }
        }
      }
    });
  }
}
