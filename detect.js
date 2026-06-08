// ================================================
// PlantAI - Detection & Diagnostics Engine
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initDetectPage();
});

function initDetectPage() {
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const btnAnalyze = document.getElementById('btnAnalyze');
  const btnRemoveImg = document.getElementById('btnRemoveImg');
  const previewContainer = document.getElementById('previewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const uploadIdle = document.getElementById('uploadIdle');
  
  const analysisOverlay = document.getElementById('analysisOverlay');
  const scanningImage = document.getElementById('scanningImage');
  const progressBarFill = document.getElementById('progressBarFill');
  const scanningStep = document.getElementById('scanningStep');
  
  const resultsEmpty = document.getElementById('resultsEmpty');
  const resultsContent = document.getElementById('resultsContent');
  const resultsTabs = document.querySelectorAll('.res-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  const btnDownloadPDF = document.getElementById('btnDownloadPDF');
  const btnShareReport = document.getElementById('btnShareReport');
  
  let currentFile = null;
  let activeDiagnosis = null;

  // ── Drag & Drop Event Listeners ──
  uploadZone?.addEventListener('click', () => fileInput?.click());
  
  uploadZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone?.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer?.files.length) {
      handleImageSelection(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleImageSelection(e.target.files[0]);
    }
  });

  // Remove image
  btnRemoveImg?.addEventListener('click', (e) => {
    e.stopPropagation();
    resetUpload();
  });

  // Trigger Diagnostic Scan
  btnAnalyze?.addEventListener('click', () => {
    if (currentFile) {
      startAnalysis();
    }
  });

  // Tab switching
  resultsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      resultsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetTab = tab.dataset.tab;
      tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `pane${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)}`);
      });

      // If severity tab, animate the gauge
      if (targetTab === 'severity' && activeDiagnosis) {
        animateGauge(activeDiagnosis.severity);
      }
    });
  });

  // PDF Download
  btnDownloadPDF?.addEventListener('click', () => {
    if (activeDiagnosis) {
      generateDiagnosticPDF(activeDiagnosis);
    }
  });

  // Share Link
  btnShareReport?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Diagnostic report link copied to clipboard!', 'success');
  });

  // Check URL query parameters (Optional automatic load for demo/cards)
  const urlParams = new URLSearchParams(window.location.search);
  const preloadedDiseaseId = urlParams.get('disease');
  if (preloadedDiseaseId) {
    const found = PLANT_DISEASES.find(d => d.id === preloadedDiseaseId);
    if (found) {
      // Simulate loading standard image from library
      showToast(`Loading template for ${found.name}...`, 'info');
      // Set a mock template image
      imagePreview.src = 'hero_leaf_ai'; // placeholder or similar
      uploadIdle.classList.add('hidden');
      previewContainer.classList.remove('hidden');
      btnAnalyze.removeAttribute('disabled');
      // Set file data structure
      currentFile = { name: `${found.id}.jpg` };
    }
  }

  // ── Core Functions ──
  
  function handleImageSelection(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG, PNG, WebP).', 'error');
      return;
    }
    
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      imagePreview.src = src;
      scanningImage.src = src;
      uploadIdle.classList.add('hidden');
      previewContainer.classList.remove('hidden');
      btnAnalyze.removeAttribute('disabled');
      
      // Perform automated Image Quality check
      setTimeout(() => performQualityCheck(src), 200);
    };
    reader.readAsDataURL(file);
  }

  function resetUpload() {
    currentFile = null;
    fileInput.value = '';
    imagePreview.src = '';
    scanningImage.src = '';
    uploadIdle.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    btnAnalyze.setAttribute('disabled', 'true');
    document.getElementById('qualityPanel').classList.add('hidden');
    resultsContent.classList.add('hidden');
    resultsEmpty.classList.remove('hidden');
    activeDiagnosis = null;
  }

  function performQualityCheck(imageSrc) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.getElementById('analysisCanvas');
      const ctx = canvas.getContext('2d');
      // Scale down image for fast pixel checking
      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0, 150, 150);
      
      const assessment = assessImageQuality(canvas);
      
      const qPanel = document.getElementById('qualityPanel');
      const valBrightness = document.getElementById('valBrightness');
      const valCoverage = document.getElementById('valCoverage');
      const valStatus = document.getElementById('valStatus');
      const warnings = document.getElementById('qualityWarnings');
      
      qPanel.classList.remove('hidden');
      valBrightness.textContent = `${assessment.brightness} (Normal range: 50-200)`;
      valCoverage.textContent = `${assessment.greenRatio}% Leaf Area`;
      
      if (assessment.pass) {
        valStatus.textContent = 'Passed (Ready to Scan)';
        valStatus.className = 'm-value pass';
        warnings.classList.add('hidden');
      } else {
        valStatus.textContent = 'Caution / Low Quality';
        valStatus.className = 'm-value fail';
        warnings.innerHTML = assessment.issues.map(issue => `• ${issue}`).join('<br>');
        warnings.classList.remove('hidden');
        showToast('Image quality warning: Scan accuracy might be affected.', 'warning');
      }
    };
    img.src = imageSrc;
  }

  function startAnalysis() {
    analysisOverlay.classList.remove('hidden');
    
    // Simulate steps of progress
    const steps = [
      'Segmenting leaf boundaries...',
      'Normalizing color distribution...',
      'Running convolution networks...',
      'Matching pathogen features...',
      'Calculating severity index...'
    ];
    
    let currentStepIdx = 0;
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Complete prediction logic
        runAIDetection().then(result => {
          activeDiagnosis = result;
          // If we manually selected crop, override
          const cropVal = document.getElementById('cropSelect').value;
          if (cropVal !== 'auto') {
            activeDiagnosis.primary.disease.crop = cropVal;
          }
          
          analysisOverlay.classList.add('hidden');
          displayResults(activeDiagnosis);
          saveToHistory(activeDiagnosis);
        });
      }
      
      progressBarFill.style.width = `${progress}%`;
      
      const stepIdx = Math.floor((progress / 100) * steps.length);
      if (stepIdx !== currentStepIdx && stepIdx < steps.length) {
        currentStepIdx = stepIdx;
        scanningStep.textContent = steps[currentStepIdx];
      }
    }, 120);
  }

  function displayResults(data) {
    resultsEmpty.classList.add('hidden');
    resultsContent.classList.remove('hidden');
    
    // Switch to first tab (diagnosis)
    resultsTabs[0].click();

    const primary = data.primary.disease;
    
    document.getElementById('resCropBadge').textContent = `${primary.cropEmoji} ${primary.crop.toUpperCase()}`;
    document.getElementById('resDiseaseName').textContent = primary.name;
    document.getElementById('resConfidence').textContent = `${data.primary.confidence}% Confidence`;
    
    const riskBadge = document.getElementById('resRiskLevel');
    riskBadge.textContent = `${data.riskLevel} Risk`;
    riskBadge.className = `risk-badge ${data.riskLevel.toLowerCase()}`;
    
    document.getElementById('resDescription').textContent = primary.description;

    // Render confidence bars distribution
    const confBars = document.getElementById('confidenceBars');
    confBars.innerHTML = data.top3.map(item => `
      <div class="conf-bar-item">
        <div class="conf-name">${item.disease.name}</div>
        <div class="conf-progress-wrap">
          <div class="conf-progress-fill" style="width: ${item.confidence}%; background: ${item.disease.pdf_color}"></div>
        </div>
        <div class="conf-val">${item.confidence}%</div>
      </div>
    `).join('');

    // Symptoms
    const symptomsList = document.getElementById('symptomsList');
    symptomsList.innerHTML = primary.symptoms.map(s => `<li>${s}</li>`).join('');

    // Organic Treatments
    const organicTreatments = document.getElementById('organicTreatments');
    if (primary.treatments.organic.length === 0) {
      organicTreatments.innerHTML = '<p class="t-card-note">No active disease. No organic treatments required.</p>';
    } else {
      organicTreatments.innerHTML = primary.treatments.organic.map(t => `
        <div class="t-card">
          <div class="t-card-name">${t.name}</div>
          <div class="t-card-meta">
            <span>Dosage: ${t.dose}</span>
            <span>Frequency: ${t.frequency}</span>
          </div>
          <div class="t-card-note">${t.notes}</div>
        </div>
      `).join('');
    }

    // Chemical Treatments
    const chemicalTreatments = document.getElementById('chemicalTreatments');
    if (primary.treatments.chemical.length === 0) {
      chemicalTreatments.innerHTML = '<p class="t-card-note">No active disease. No chemical treatments required.</p>';
    } else {
      chemicalTreatments.innerHTML = primary.treatments.chemical.map(t => `
        <div class="t-card">
          <div class="t-card-name">${t.name}</div>
          <div class="t-card-meta">
            <span>Dosage: ${t.dose}</span>
            <span>Frequency: ${t.frequency}</span>
          </div>
          <div class="t-card-note">${t.notes}</div>
        </div>
      `).join('');
    }

    // Severity & Loss tab
    document.getElementById('gaugeValText').textContent = `${data.severity}%`;
    document.getElementById('severityStatus').textContent = `Infection: ${data.riskLevel}`;
    document.getElementById('yieldLossVal').textContent = `${data.yieldLoss}%`;
    document.getElementById('yieldLossProgress').style.width = `${data.yieldLoss}%`;
  }

  function animateGauge(val) {
    const gaugeFill = document.getElementById('gaugeFill');
    if (!gaugeFill) return;
    
    // SVG stroke-dasharray is 126. We need to set stroke-dashoffset to:
    // 126 - (val / 100) * 126
    const strokeLen = 126;
    const offset = strokeLen - (val / 100) * strokeLen;
    
    gaugeFill.style.transition = 'stroke-dashoffset 1s ease-out';
    gaugeFill.style.strokeDashoffset = offset;
  }

  // ── jsPDF Report Generation ──
  function generateDiagnosticPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const primary = data.primary.disease;
    
    // PDF Styling
    doc.setFillColor(6, 13, 26);
    doc.rect(0, 0, 210, 297, 'F'); // Dark background
    
    // Accent Top border
    doc.setFillColor(82, 183, 136);
    doc.rect(0, 0, 210, 10, 'F');
    
    // Header Logo & Branding
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('PlantAI Diagnostic Report', 15, 25);
    
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(136, 146, 176);
    doc.text(`Generated: ${formatDate(data.timestamp)}`, 15, 30);
    doc.text(`Diagnostic Model: ${data.modelVersion}`, 15, 35);
    
    // Line separator
    doc.setDrawColor(82, 183, 136);
    doc.setLineWidth(0.5);
    doc.line(15, 42, 195, 42);
    
    // Disease Info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('Helvetica', 'bold');
    doc.text(`${primary.name}`, 15, 52);
    
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(170, 180, 200);
    doc.text(`Crop: ${primary.cropEmoji} ${primary.crop.toUpperCase()}`, 15, 58);
    doc.text(`AI Confidence: ${data.primary.confidence}%`, 15, 63);
    doc.text(`Severity Score: ${data.severity}%`, 15, 68);
    doc.text(`Risk Category: ${data.riskLevel}`, 15, 73);
    doc.text(`Projected Yield Loss: ${data.yieldLoss}%`, 15, 78);
    
    // Add leaf image placeholder box or render actual image if possible
    doc.setDrawColor(82, 183, 136);
    doc.rect(130, 48, 65, 40);
    doc.setTextColor(136, 146, 176);
    doc.setFontSize(8);
    doc.text('[ Scan Image Attached ]', 145, 68);

    // Description block
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('Pathogen Description', 15, 92);
    
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(136, 146, 176);
    const splitDesc = doc.splitTextToSize(primary.description, 180);
    doc.text(splitDesc, 15, 98);
    
    // Treatment Options
    doc.setTextColor(82, 183, 136);
    doc.setFontSize(13);
    doc.setFont('Helvetica', 'bold');
    doc.text('Organic Treatment Schedule', 15, 120);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    let y = 126;
    
    if (primary.treatments.organic.length === 0) {
      doc.text('No treatment needed. Keep plant monitored.', 15, y);
      y += 8;
    } else {
      primary.treatments.organic.forEach(t => {
        doc.setFont('Helvetica', 'bold');
        doc.text(`• ${t.name}`, 15, y);
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(136, 146, 176);
        doc.text(`   Dose: ${t.dose} | Freq: ${t.frequency}`, 15, y + 4);
        doc.text(`   Note: ${t.notes}`, 15, y + 8);
        doc.setTextColor(255, 255, 255);
        y += 14;
      });
    }
    
    y += 4;
    doc.setTextColor(244, 162, 97);
    doc.setFontSize(13);
    doc.setFont('Helvetica', 'bold');
    doc.text('Chemical Control Guidelines', 15, y);
    y += 6;
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    
    if (primary.treatments.chemical.length === 0) {
      doc.text('No chemical treatments required.', 15, y);
      y += 8;
    } else {
      primary.treatments.chemical.forEach(t => {
        doc.setFont('Helvetica', 'bold');
        doc.text(`• ${t.name}`, 15, y);
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(136, 146, 176);
        doc.text(`   Dose: ${t.dose} | Freq: ${t.frequency}`, 15, y + 4);
        doc.text(`   Note: ${t.notes}`, 15, y + 8);
        doc.setTextColor(255, 255, 255);
        y += 14;
      });
    }

    // Prevention Strategies
    y += 4;
    doc.setTextColor(82, 183, 136);
    doc.setFontSize(13);
    doc.setFont('Helvetica', 'bold');
    doc.text('Proactive Prevention Strategies', 15, y);
    y += 6;
    
    doc.setTextColor(136, 146, 176);
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    primary.prevention.forEach(p => {
      doc.text(`- ${p}`, 15, y);
      y += 5;
    });
    
    // Footer watermark
    doc.setFillColor(12, 26, 46);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(82, 183, 136);
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'italic');
    doc.text('Provided by PlantAI Platform - Agricultural AI Research Group 2026', 15, 290);
    
    doc.save(`PlantAI_Report_${primary.crop}_${primary.name.replace(/\s+/g, '_')}.pdf`);
    showToast('Diagnostic Report downloaded!', 'success');
  }
}
