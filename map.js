// ================================================
// PlantAI - Outbreak Map & Weather Risk Predictor
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initMapPage();
});

function initMapPage() {
  const cropFilter = document.getElementById('mapCropFilter');
  const severityFilter = document.getElementById('mapSeverityFilter');
  const alertFeed = document.getElementById('alertFeed');
  const plotArea = document.getElementById('mapPlotArea');
  const popup = document.getElementById('mapPopup');
  
  const btnPredictRisk = document.getElementById('btnPredictRisk');
  const riskResultBox = document.getElementById('riskResultBox');

  // Filter events
  cropFilter?.addEventListener('change', updateOutbreaks);
  severityFilter?.addEventListener('change', updateOutbreaks);

  // Weather Risk calculator events
  btnPredictRisk?.addEventListener('click', calculateWeatherVulnerability);

  // Initialize
  updateOutbreaks();

  // ── Outbreak Hotspot Rendering ──
  function updateOutbreaks() {
    const selectedCrop = cropFilter.value;
    const selectedSeverity = severityFilter.value;

    // Filter locations
    const filtered = OUTBREAK_DATA.filter(item => {
      // Crop match
      let cropMatch = false;
      if (selectedCrop === 'all') cropMatch = true;
      else {
        // Match disease name with crop
        const diseaseObj = PLANT_DISEASES.find(d => d.name === item.disease);
        if (diseaseObj && diseaseObj.crop === selectedCrop) cropMatch = true;
      }

      // Severity match
      let severityMatch = false;
      if (selectedSeverity === 'all') severityMatch = true;
      else if (selectedSeverity === 'critical' && item.severity === 'critical') severityMatch = true;
      else if (selectedSeverity === 'high' && (item.severity === 'critical' || item.severity === 'high')) severityMatch = true;
      else if (selectedSeverity === 'medium' && (item.severity === 'critical' || item.severity === 'high' || item.severity === 'medium')) severityMatch = true;

      return cropMatch && severityMatch;
    });

    // Populate alert feed list
    if (filtered.length === 0) {
      alertFeed.innerHTML = '<p class="text-center font-bold" style="padding: 2rem; color: var(--text-muted)">No outbreaks match filters</p>';
    } else {
      alertFeed.innerHTML = filtered.map(item => `
        <div class="alert-card" data-loc="${item.location}">
          <div class="ac-left">
            <h5>${item.disease}</h5>
            <p>📍 ${item.location}</p>
          </div>
          <div class="ac-right">
            <span class="ac-badge ${item.severity}">${item.severity.toUpperCase()}</span>
            <span class="ac-rep-lbl">${item.reports} reports</span>
          </div>
        </div>
      `).join('');
    }

    // Plot marker points inside the map visual canvas
    plotArea.innerHTML = ''; // clear markers
    
    // Scale mapping coordinates to fit the 100% container
    // We map latitude (approx 8°N to 37°N) and longitude (68°E to 97°E) onto relative percentages
    filtered.forEach((item, idx) => {
      const marker = document.createElement('div');
      marker.className = `map-marker ${item.severity}`;
      
      // Calculate relative X & Y positions based on approx coordinates of India map bounds
      // longitude mapping: 68 to 97 -> 0% to 100%
      const x = ((item.lng - 68) / (97 - 68)) * 100;
      // latitude mapping: 8 to 37 -> 100% to 0% (invert Y axis)
      const y = 100 - (((item.lat - 8) / (37 - 8)) * 100);
      
      marker.style.left = `${Math.max(5, Math.min(95, x))}%`;
      marker.style.top = `${Math.max(5, Math.min(95, y))}%`;
      
      // Hover event
      marker.addEventListener('mouseenter', (e) => showPopup(item, e));
      marker.addEventListener('mouseleave', hidePopup);
      
      plotArea.appendChild(marker);
    });

    // Click on feed card highlights marker
    document.querySelectorAll('.alert-card').forEach(card => {
      card.addEventListener('click', () => {
        const loc = card.dataset.loc;
        const match = filtered.find(f => f.location === loc);
        if (match) {
          showToast(`Focusing outbreak alert in ${match.location}`, 'info');
          // highlight corresponding index
        }
      });
    });
  }

  function showPopup(item, event) {
    popup.classList.remove('hidden');
    
    document.getElementById('popupLocation').textContent = item.location;
    document.getElementById('popupDisease').textContent = item.disease;
    
    const badge = document.getElementById('popupSeverity');
    badge.textContent = item.severity.toUpperCase();
    badge.className = `popup-badge ${item.severity}`;
    
    document.getElementById('popupReports').textContent = `${item.reports} Reports`;

    // Position popup
    const rect = event.target.getBoundingClientRect();
    const parentRect = plotArea.getBoundingClientRect();
    
    const left = rect.left - parentRect.left + (rect.width / 2);
    const top = rect.top - parentRect.top;
    
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }

  function hidePopup() {
    popup.classList.add('hidden');
  }

  // ── Weather Vulnerability Calculator ──
  function calculateWeatherVulnerability() {
    const temp = parseFloat(document.getElementById('wTemp').value);
    const humid = parseFloat(document.getElementById('wHumid').value);
    const rain = parseFloat(document.getElementById('wRain').value);

    let riskLevel = 'Low';
    let riskClass = 'low';
    let text = 'Weather conditions present low incubation risk for major plant diseases. Continue standard preventive monitoring.';

    // Check Tomato Late Blight risk conditions
    // Cool damp: temp 10-22°C, humidity > 90%
    if (temp >= 10 && temp <= 22 && humid >= 90) {
      riskLevel = 'Critical';
      riskClass = 'critical';
      text = '🚨 CRITICAL Outbreak Risk! Cool temperatures combined with high humidity match ideal Phytophthora infestans (Late Blight) incubation conditions. Spray metalaxyl preventive treatments immediately.';
    }
    // Check Tomato Early Blight risk conditions
    // Warm damp: temp 24-29°C, humidity > 85%, rain > 10mm
    else if (temp >= 24 && temp <= 30 && humid >= 82) {
      riskLevel = 'High';
      riskClass = 'high';
      text = '⚠️ HIGH Vulnerability Alert! High relative humidity and warm temperatures represent premium incubation metrics for Early Blight and Bacterial Spots. Drip irrigation recommended to keep leaf surfaces dry.';
    }
    // Moderate risk conditions
    else if (humid >= 75) {
      riskLevel = 'Medium';
      riskClass = 'medium';
      text = 'Moderate Risk. Humidity is elevated. Check crop canopy weekly for signs of leaf mold or mildews.';
    }

    // Display result box
    const badge = document.getElementById('rrbRiskBadge');
    badge.textContent = `${riskLevel} Risk`;
    badge.className = `rrb-badge ${riskClass}`;
    
    document.getElementById('rrbRiskExplanation').textContent = text;
    riskResultBox.classList.remove('hidden');

    showToast('Crop vulnerability index updated!', 'success');
  }
}
