// ================================================
// PlantAI - Core Data Layer
// Disease Database, Treatments, Languages
// ================================================

const PLANT_DISEASES = [
  // TOMATO
  {
    id: 'tomato_early_blight',
    name: 'Early Blight',
    crop: 'tomato',
    cropEmoji: '🍅',
    accuracy: 99.1,
    description: 'Caused by Alternaria solani fungus. Appears as brown lesions with concentric rings and yellow halos on older leaves. One of the most common tomato diseases worldwide.',
    symptoms: ['Brown/dark spots with concentric rings', 'Yellow halo around lesions', 'Lesions on older leaves first', 'Stem cankers possible', 'Premature leaf drop'],
    severity_range: [45, 90],
    risk_factors: ['High humidity (>85%)', 'Warm temperatures (24-29°C)', 'Wet weather', 'Overcrowded plants'],
    treatments: {
      organic: [
        { name: 'Copper-based fungicide', dose: '2.5g/L water', frequency: 'Every 7-10 days', notes: 'Spray on foliage, avoid in hot weather' },
        { name: 'Neem oil solution', dose: '5ml/L water', frequency: 'Every 5-7 days', notes: 'Apply in morning or evening' },
        { name: 'Baking soda spray', dose: '1 tsp/L water + dish soap', frequency: 'Weekly', notes: 'Changes leaf pH to prevent fungal growth' }
      ],
      chemical: [
        { name: 'Mancozeb 75% WP', dose: '2.5g/L water', frequency: 'Every 10-14 days', notes: 'Pre-harvest interval: 5 days' },
        { name: 'Chlorothalonil 75% WP', dose: '2g/L water', frequency: 'Every 7-10 days', notes: 'Avoid during flowering' },
        { name: 'Azoxystrobin 23% SC', dose: '1ml/L water', frequency: 'Every 14 days', notes: 'Systemic fungicide, highly effective' }
      ]
    },
    prevention: [
      'Use certified disease-free seeds',
      'Maintain 60-75cm spacing between plants',
      'Avoid overhead irrigation, use drip irrigation',
      'Remove and destroy infected plant debris',
      'Apply mulch to prevent soil splash',
      'Rotate crops every 2-3 years'
    ],
    yield_loss: { min: 15, max: 45, unit: '%' },
    pdf_color: '#e63946'
  },
  {
    id: 'tomato_late_blight',
    name: 'Late Blight',
    crop: 'tomato',
    cropEmoji: '🍅',
    accuracy: 98.7,
    description: 'Caused by Phytophthora infestans. A devastating oomycete disease that can destroy entire crops within days. Responsible for the Irish Potato Famine of 1845.',
    symptoms: ['Water-soaked lesions on leaves', 'White mold on underside of leaves', 'Brown/black lesions on stems', 'Fruit shows dark firm lesions', 'Rapid wilting and collapse'],
    severity_range: [60, 99],
    risk_factors: ['Cool temperatures (10-25°C)', 'High humidity (>90%)', 'Prolonged leaf wetness', 'Foggy conditions'],
    treatments: {
      organic: [
        { name: 'Copper hydroxide (Kocide)', dose: '3g/L water', frequency: 'Every 5-7 days', notes: 'Most effective organic option' },
        { name: 'Potassium bicarbonate', dose: '5g/L water', frequency: 'Every 7 days', notes: 'Mix with neem oil for better results' }
      ],
      chemical: [
        { name: 'Metalaxyl + Mancozeb', dose: '2.5g/L water', frequency: 'Every 7 days', notes: 'Systemic + contact action' },
        { name: 'Cymoxanil 8% + Mancozeb 64%', dose: '3g/L water', frequency: 'Every 10 days', notes: 'CURZATE M, highly effective' },
        { name: 'Dimethomorph 50% WP', dose: '1g/L water', frequency: 'Every 14 days', notes: 'Excellent for late blight control' }
      ]
    },
    prevention: [
      'Plant resistant varieties (e.g., Mountain Merit, Iron Lady)',
      'Apply preventive fungicides before disease onset',
      'Ensure excellent air circulation in canopy',
      'Avoid evening irrigation',
      'Monitor weather forecasts for disease-favoring conditions'
    ],
    yield_loss: { min: 50, max: 100, unit: '%' },
    pdf_color: '#e63946'
  },
  {
    id: 'tomato_leaf_mold',
    name: 'Leaf Mold',
    crop: 'tomato',
    cropEmoji: '🍅',
    accuracy: 96.8,
    description: 'Caused by Passalora fulva (Fulvia fulva). A foliar disease common in greenhouses and humid outdoor environments.',
    symptoms: ['Pale yellow spots on upper leaf surface', 'Olive-green to gray mold on leaf underside', 'Leaves curl and turn yellow', 'Defoliation in severe cases'],
    severity_range: [30, 75],
    risk_factors: ['Humidity >85%', 'Poor ventilation (greenhouses)', 'Dense plant spacing'],
    treatments: {
      organic: [
        { name: 'Sulfur dust', dose: '30g/10 sq meters', frequency: 'Every 10 days', notes: 'Do not apply when temperature >32°C' }
      ],
      chemical: [
        { name: 'Difenoconazole 25% EC', dose: '0.5ml/L water', frequency: 'Every 14 days', notes: 'Very effective against leaf mold' },
        { name: 'Fluopyram + Trifloxystrobin', dose: '0.7ml/L water', frequency: 'Every 14 days', notes: 'Luna Sensation — premium fungicide' }
      ]
    },
    prevention: ['Maintain humidity below 85%', 'Space plants adequately', 'Prune lower leaves to improve airflow'],
    yield_loss: { min: 10, max: 35, unit: '%' },
    pdf_color: '#f4a261'
  },
  {
    id: 'tomato_healthy',
    name: 'Healthy Leaf',
    crop: 'tomato',
    cropEmoji: '🍅',
    accuracy: 99.5,
    description: 'Your plant appears healthy! Continue regular monitoring and preventive care to maintain optimal crop health.',
    symptoms: ['Deep green uniform color', 'No visible spots or lesions', 'Firm and turgid leaves', 'Normal growth pattern'],
    severity_range: [0, 5],
    risk_factors: [],
    treatments: { organic: [], chemical: [] },
    prevention: ['Continue regular watering schedule', 'Apply balanced NPK fertilizer monthly', 'Monitor weekly for early signs of disease'],
    yield_loss: { min: 0, max: 0, unit: '%' },
    pdf_color: '#52b788'
  },
  // POTATO
  {
    id: 'potato_late_blight',
    name: 'Late Blight',
    crop: 'potato',
    cropEmoji: '🥔',
    accuracy: 98.9,
    description: 'Same Phytophthora infestans pathogen as tomato late blight. Historically the most destructive potato disease.',
    symptoms: ['Dark water-soaked lesions on leaves', 'White mycelium on leaf undersides', 'Tuber rot (dark brown internal)', 'Rapid plant collapse in wet weather'],
    severity_range: [55, 99],
    risk_factors: ['Wet cool weather', 'Poor drainage', 'Dense foliage'],
    treatments: {
      organic: [{ name: 'Copper oxychloride', dose: '3g/L water', frequency: 'Every 7 days', notes: 'Apply before and during rain' }],
      chemical: [
        { name: 'Propamocarb + Fluopicolide', dose: '2ml/L water', frequency: 'Every 10 days', notes: 'Previcur Energy — systemic protection' },
        { name: 'Ametoctradin + Dimethomorph', dose: '2ml/L water', frequency: 'Every 10-14 days', notes: 'Excellent tuber protection' }
      ]
    },
    prevention: ['Use certified seed potatoes', 'Hill soil around plants to protect tubers', 'Destroy volunteer potato plants'],
    yield_loss: { min: 40, max: 100, unit: '%' },
    pdf_color: '#e63946'
  },
  {
    id: 'potato_early_blight',
    name: 'Early Blight',
    crop: 'potato',
    cropEmoji: '🥔',
    accuracy: 97.3,
    description: 'Alternaria solani causes similar symptoms to tomato early blight but on potato plants.',
    symptoms: ['Small dark brown spots with concentric rings', 'Yellow halo around spots', 'Affects lower older leaves first', 'Premature defoliation'],
    severity_range: [30, 75],
    risk_factors: ['Water stress', 'Nutrient deficiency', 'High temperature with dew'],
    treatments: {
      organic: [{ name: 'Neem oil + Copper spray', dose: '5ml + 2g per L', frequency: 'Every 7 days', notes: 'Preventive spray after rain' }],
      chemical: [
        { name: 'Mancozeb 75% WP', dose: '2.5g/L water', frequency: 'Every 10 days', notes: 'Standard management' },
        { name: 'Tebuconazole 25.9% EC', dose: '1ml/L water', frequency: 'Every 14 days', notes: 'Systemic — good curative activity' }
      ]
    },
    prevention: ['Maintain adequate nutrition (N, K)', 'Avoid water stress', 'Scout weekly from mid-season'],
    yield_loss: { min: 10, max: 30, unit: '%' },
    pdf_color: '#f4a261'
  },
  {
    id: 'potato_healthy',
    name: 'Healthy Potato Plant',
    crop: 'potato',
    cropEmoji: '🥔',
    accuracy: 99.2,
    description: 'Plant appears healthy. Continue standard agronomic practices.',
    symptoms: ['Lush green foliage', 'No lesions or spots', 'Normal stem color and vigor'],
    severity_range: [0, 5],
    risk_factors: [],
    treatments: { organic: [], chemical: [] },
    prevention: ['Apply prophylactic fungicide at canopy closure', 'Maintain irrigation schedule'],
    yield_loss: { min: 0, max: 0, unit: '%' },
    pdf_color: '#52b788'
  },
  // CORN
  {
    id: 'corn_northern_blight',
    name: 'Northern Leaf Blight',
    crop: 'corn',
    cropEmoji: '🌽',
    accuracy: 97.8,
    description: 'Caused by Exserohilum turcicum. Characterized by distinctive long cigar-shaped lesions.',
    symptoms: ['Gray-green to tan lesions (5-15cm long)', 'Cigar or spindle-shaped lesions', 'Lesions girdle leaves', 'Premature leaf death'],
    severity_range: [30, 80],
    risk_factors: ['Moderate temperatures (18-27°C)', 'Humid conditions', 'Susceptible hybrids'],
    treatments: {
      organic: [{ name: 'Copper fungicide', dose: '2.5g/L water', frequency: 'At VT stage', notes: 'Apply before tassel emergence' }],
      chemical: [
        { name: 'Propiconazole 25% EC', dose: '1ml/L water', frequency: 'At VT/R1 stage', notes: 'Most commonly used' },
        { name: 'Azoxystrobin + Propiconazole', dose: '1.5ml/L water', frequency: 'At VT stage', notes: 'Quilt Xcel — excellent coverage' }
      ]
    },
    prevention: ['Plant resistant hybrids', 'Rotate with non-host crops', 'Reduce crop residue through tillage'],
    yield_loss: { min: 10, max: 50, unit: '%' },
    pdf_color: '#f4a261'
  },
  {
    id: 'corn_cercospora',
    name: 'Gray Leaf Spot',
    crop: 'corn',
    cropEmoji: '🌽',
    accuracy: 96.5,
    description: 'Caused by Cercospora zeae-maydis. A major foliar disease in humid corn production areas.',
    symptoms: ['Rectangular gray to tan lesions', 'Lesions parallel to leaf veins', 'Yellow/brown discoloration', 'Severe blighting in humid conditions'],
    severity_range: [25, 75],
    risk_factors: ['High humidity', 'Minimum tillage (residue retention)', 'Susceptible hybrids', 'Late planting'],
    treatments: {
      organic: [{ name: 'Strobilurin-based organic spray', dose: 'Per label', frequency: 'At VT stage', notes: 'Preventive application critical' }],
      chemical: [
        { name: 'Trifloxystrobin + Propiconazole', dose: '0.5ml/L water', frequency: 'At VT stage', notes: 'Stratego YLD — top performer' },
        { name: 'Pyraclostrobin + Metconazole', dose: '1ml/L water', frequency: 'At R1-R3 stage', notes: 'Headline AMP' }
      ]
    },
    prevention: ['Plant resistant hybrids', 'Rotate crops 1-2 years', 'Reduce surface residue'],
    yield_loss: { min: 5, max: 35, unit: '%' },
    pdf_color: '#f4a261'
  },
  // WHEAT
  {
    id: 'wheat_rust',
    name: 'Stem Rust',
    crop: 'wheat',
    cropEmoji: '🌾',
    accuracy: 98.2,
    description: 'Caused by Puccinia graminis. One of the most feared wheat diseases globally. The Ug99 race remains a significant threat.',
    symptoms: ['Brick-red to brown pustules on stems', 'Pustules also on leaves and spikes', 'Breaks through plant epidermis', 'Severe lodging in infected fields'],
    severity_range: [40, 95],
    risk_factors: ['Warm temperatures (15-35°C)', 'High humidity', 'Susceptible varieties', 'Late planting'],
    treatments: {
      organic: [{ name: 'Sulfur dust', dose: '25 kg/ha', frequency: 'At first sign', notes: 'Early intervention critical' }],
      chemical: [
        { name: 'Tebuconazole 250g/L EW', dose: '1L/ha', frequency: 'At flag leaf stage', notes: 'Folicur — gold standard for rust' },
        { name: 'Epoxiconazole + Pyraclostrobin', dose: '1L/ha', frequency: 'At BBCH 37-55', notes: 'Opera — excellent protection' }
      ]
    },
    prevention: ['Plant rust-resistant varieties', 'Monitor crop weekly after tillering', 'Apply preventive fungicide at flag leaf stage'],
    yield_loss: { min: 20, max: 70, unit: '%' },
    pdf_color: '#e63946'
  },
  // PEPPER
  {
    id: 'pepper_bacterial_spot',
    name: 'Bacterial Spot',
    crop: 'pepper',
    cropEmoji: '🌶️',
    accuracy: 95.9,
    description: 'Caused by Xanthomonas axonopodis. A serious bacterial disease affecting both leaves and fruit quality.',
    symptoms: ['Small water-soaked spots on leaves', 'Spots turn brown with yellow halo', 'Raised scabby lesions on fruit', 'Defoliation in severe cases', 'Fruit unmarketable'],
    severity_range: [30, 80],
    risk_factors: ['Warm humid weather', 'Rain splashing bacteria', 'Mechanical injuries', 'Infected seeds'],
    treatments: {
      organic: [
        { name: 'Copper hydroxide', dose: '2.5g/L water', frequency: 'Every 7 days', notes: 'Only effective option for bacteria' },
        { name: 'Copper + Mancozeb tank mix', dose: '2g + 2g per L', frequency: 'Every 7 days during rain', notes: 'Broader coverage' }
      ],
      chemical: [
        { name: 'Copper oxychloride 50% WP', dose: '3g/L water', frequency: 'Every 7-10 days', notes: 'Best option for bacterial control' },
        { name: 'Streptomycin sulfate (if legal locally)', dose: 'Per label', frequency: 'Every 7 days', notes: 'Check local regulations' }
      ]
    },
    prevention: ['Use disease-free, certified seeds', 'Avoid overhead irrigation', 'Disinfect tools between plants', 'Remove infected plant material'],
    yield_loss: { min: 15, max: 60, unit: '%' },
    pdf_color: '#e63946'
  }
];

// ── Language Translations ──
const TRANSLATIONS = {
  en: {
    navHome: 'Home',
    navDetect: 'Detect Disease',
    navDashboard: 'Dashboard',
    navMap: 'Disease Map',
    navChatbot: 'AI Assistant',
    navLogin: 'Login',
    heroTitle: 'Detect Plant Diseases',
    heroTitleAccent: 'Before They Spread',
    heroSubtitle: 'Upload a leaf photo and our advanced AI instantly identifies diseases, estimates severity, recommends treatments, and generates a professional PDF report in seconds.',
    heroCta: 'Analyze Leaf Now',
    featuresTitle: 'Everything a Farmer Needs',
    uploadTitle: 'Upload Plant Leaf Image',
    uploadSubtitle: 'Drag & drop or click to browse. Supports JPG, PNG, WebP up to 10MB.',
    analyzeBtn: 'Analyze Disease',
    downloadPdf: 'Download PDF Report',
    diseaseName: 'Disease Detected',
    severity: 'Severity',
    treatment: 'Treatment Recommendations',
    chatGreeting: 'Hi! I\'m PlantAI Assistant 🌱 Ask me anything about plant diseases, treatments, or farming!',
  },
  hi: {
    navHome: 'होम',
    navDetect: 'रोग पहचानें',
    navDashboard: 'डैशबोर्ड',
    navMap: 'रोग मानचित्र',
    navChatbot: 'AI सहायक',
    navLogin: 'लॉगिन',
    heroTitle: 'पौधों के रोग पहचानें',
    heroTitleAccent: 'फैलने से पहले',
    heroSubtitle: 'पत्ती की फोटो अपलोड करें और हमारी AI तुरंत रोग की पहचान करेगी, गंभीरता का अनुमान लगाएगी और उपचार सुझाएगी।',
    heroCta: 'अभी पत्ती जांचें',
    featuresTitle: 'किसान की हर जरूरत',
    uploadTitle: 'पौधे की पत्ती की तस्वीर अपलोड करें',
    uploadSubtitle: 'खींचें और छोड़ें या ब्राउज़ करें। JPG, PNG, WebP समर्थित (10MB तक)',
    analyzeBtn: 'रोग विश्लेषण करें',
    downloadPdf: 'PDF रिपोर्ट डाउनलोड करें',
    diseaseName: 'पहचाना गया रोग',
    severity: 'गंभीरता',
    treatment: 'उपचार अनुशंसाएं',
    chatGreeting: 'नमस्ते! मैं PlantAI सहायक हूं 🌱 पौधों के रोग, उपचार या खेती के बारे में पूछें!',
  },
  kn: {
    navHome: 'ಮುಖಪುಟ',
    navDetect: 'ರೋಗ ಪತ್ತೆ',
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navMap: 'ರೋಗ ನಕ್ಷೆ',
    navChatbot: 'AI ಸಹಾಯಕ',
    navLogin: 'ಲಾಗಿನ್',
    heroTitle: 'ಸಸ್ಯ ರೋಗಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ',
    heroTitleAccent: 'ಹರಡುವ ಮೊದಲೇ',
    heroSubtitle: 'ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ನಮ್ಮ AI ತಕ್ಷಣ ರೋಗ ಗುರುತಿಸಿ ಚಿಕಿತ್ಸೆ ಸೂಚಿಸುತ್ತದೆ.',
    heroCta: 'ಎಲೆ ವಿಶ್ಲೇಷಿಸಿ',
    featuresTitle: 'ರೈತರಿಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ',
    uploadTitle: 'ಸಸ್ಯದ ಎಲೆ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    uploadSubtitle: 'ಎಳೆದು ಬಿಡಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಿ. JPG, PNG, WebP (10MB ವರೆಗೆ)',
    analyzeBtn: 'ರೋಗ ವಿಶ್ಲೇಷಿಸಿ',
    downloadPdf: 'PDF ವರದಿ ಡೌನ್‌ಲೋಡ್',
    diseaseName: 'ಪತ್ತೆಯಾದ ರೋಗ',
    severity: 'ತೀವ್ರತೆ',
    treatment: 'ಚಿಕಿತ್ಸಾ ಶಿಫಾರಸು',
    chatGreeting: 'ನಮಸ್ಕಾರ! ನಾನು PlantAI ಸಹಾಯಕ 🌱 ಸಸ್ಯ ರೋಗ ಅಥವಾ ಕೃಷಿ ಬಗ್ಗೆ ಕೇಳಿ!',
  },
  te: {
    navHome: 'హోమ్',
    navDetect: 'వ్యాధి గుర్తించు',
    navDashboard: 'డాష్‌బోర్డ్',
    navMap: 'వ్యాధి మ్యాప్',
    navChatbot: 'AI సహాయకుడు',
    navLogin: 'లాగిన్',
    heroTitle: 'మొక్కల వ్యాధులను గుర్తించండి',
    heroTitleAccent: 'వ్యాపించే ముందే',
    heroSubtitle: 'ఆకు ఫోటో అప్‌లోడ్ చేయండి మరియు మా AI వెంటనే వ్యాధిని గుర్తించి చికిత్స సూచిస్తుంది.',
    heroCta: 'ఆకు విశ్లేషించు',
    featuresTitle: 'రైతుకు కావలసినవన్నీ',
    uploadTitle: 'మొక్క ఆకు చిత్రం అప్‌లోడ్ చేయండి',
    uploadSubtitle: 'లాగి వదలండి లేదా బ్రౌజ్ చేయండి. JPG, PNG, WebP (10MB వరకు)',
    analyzeBtn: 'వ్యాధి విశ్లేషించు',
    downloadPdf: 'PDF నివేదిక డౌన్‌లోడ్',
    diseaseName: 'గుర్తించిన వ్యాధి',
    severity: 'తీవ్రత',
    treatment: 'చికిత్స సిఫారసులు',
    chatGreeting: 'నమస్కారం! నేను PlantAI సహాయకుడు 🌱 మొక్కల వ్యాధులు లేదా వ్యవసాయం గురించి అడగండి!',
  }
};

// ── Chatbot Knowledge Base ──
const CHATBOT_KB = {
  'early blight': {
    answer: '🍅 <strong>Early Blight</strong> is caused by <em>Alternaria solani</em>. Look for brown spots with concentric rings and yellow halos on older leaves.\n\n<strong>Quick Treatment:</strong>\n• Spray Mancozeb 75% WP (2.5g/L) every 10 days\n• Or Copper fungicide for organic options\n• Remove and destroy infected leaves\n\nWould you like the full treatment protocol?',
    tags: ['early blight', 'alternaria', 'brown spots', 'tomato spots']
  },
  'late blight': {
    answer: '⚠️ <strong>Late Blight</strong> is an emergency! Caused by <em>Phytophthora infestans</em>, it can destroy crops in days.\n\n<strong>Immediate Action:</strong>\n• Apply Cymoxanil + Mancozeb (3g/L) immediately\n• Remove all visibly infected plants\n• Avoid any overhead watering\n• Spray every 5-7 days during wet weather\n\n🚨 This disease spreads very fast — act NOW!',
    tags: ['late blight', 'phytophthora', 'water soaked', 'rapid death']
  },
  'powdery mildew': {
    answer: '🌿 <strong>Powdery Mildew</strong> appears as white powdery coating on leaves.\n\n<strong>Treatment:</strong>\n• Sulfur-based fungicide (2g/L) every 10 days\n• Potassium bicarbonate spray\n• Improve air circulation\n• Avoid excess nitrogen fertilizer\n\nIt thrives in warm dry conditions with humidity extremes.',
    tags: ['powdery mildew', 'white powder', 'white coating']
  },
  'fertilizer': {
    answer: '🌱 <strong>Fertilizer Guide for Common Crops:</strong>\n\n<strong>Tomatoes:</strong> NPK 10-10-10 at planting, then switch to low-N high-K at fruiting\n<strong>Potatoes:</strong> High potassium (K) for tuber development\n<strong>Corn:</strong> Nitrogen split application — 1/3 at planting, 2/3 at V6 stage\n\n💡 Always do a soil test before fertilizing!',
    tags: ['fertilizer', 'npk', 'nutrition', 'nutrient']
  },
  'irrigation': {
    answer: '💧 <strong>Irrigation Best Practices:</strong>\n\n• Use <strong>drip irrigation</strong> to keep leaves dry (reduces fungal diseases by 60%)\n• Water in the morning so leaves dry during day\n• Tomatoes need 25-50mm/week\n• Potatoes need consistent moisture to prevent hollow heart\n• Never water wilted plants in hot afternoon sun\n\nDrip irrigation also saves 40-50% water vs overhead!',
    tags: ['irrigation', 'water', 'watering', 'drip']
  },
  'pesticide': {
    answer: '🧪 <strong>Safe Pesticide Use:</strong>\n\n1. Always wear PPE (gloves, mask, goggles)\n2. Read and follow label directions exactly\n3. Observe pre-harvest intervals (PHI)\n4. Spray in early morning or evening\n5. Never mix unknown pesticides\n6. Store in original containers, out of reach of children\n\n🌿 Consider IPM (Integrated Pest Management) to reduce chemical use.',
    tags: ['pesticide', 'insecticide', 'chemical', 'spray', 'fungicide']
  },
  'rust': {
    answer: '🌾 <strong>Wheat Rust</strong> is one of the most destructive wheat diseases.\n\n<strong>Identification:</strong> Look for brick-red/brown pustules on stems and leaves that break through the skin.\n\n<strong>Treatment:</strong>\n• Apply Tebuconazole (1L/ha) at flag leaf stage\n• Monitor weekly after tillering\n\n⚠️ If you see rust, act within 48 hours — it spreads rapidly through wind!',
    tags: ['rust', 'wheat rust', 'stem rust', 'pustules']
  },
  'healthy': {
    answer: '✅ <strong>Great news!</strong> If your plant appears healthy:\n\n<strong>Maintain health with:</strong>\n• Regular visual inspection (twice weekly)\n• Consistent watering and drainage\n• Balanced fertilization\n• Preventive fungicide spray during high-risk weather\n• Good air circulation\n\nWould you like a seasonal crop calendar to plan your preventive measures?',
    tags: ['healthy', 'no disease', 'green', 'normal']
  },
  'default': {
    answer: '🌱 I\'m here to help with plant diseases and farming! You can ask me about:\n\n• Specific diseases (Early Blight, Late Blight, Rust, etc.)\n• Treatment recommendations\n• Fertilizer guidance\n• Irrigation best practices\n• Pesticide safety\n\nOr try <strong>uploading a leaf photo</strong> on the Detection page for AI-powered diagnosis!',
    tags: []
  }
};

// ── Outbreak Map Data (simulated) ──
const OUTBREAK_DATA = [
  { lat: 13.0827, lng: 80.2707, disease: 'Tomato Early Blight', severity: 'high', location: 'Chennai, TN', reports: 47 },
  { lat: 12.9716, lng: 77.5946, disease: 'Tomato Late Blight', severity: 'critical', location: 'Bangalore, KA', reports: 89 },
  { lat: 17.3850, lng: 78.4867, disease: 'Pepper Bacterial Spot', severity: 'medium', location: 'Hyderabad, TS', reports: 31 },
  { lat: 18.5204, lng: 73.8567, disease: 'Potato Late Blight', severity: 'high', location: 'Pune, MH', reports: 62 },
  { lat: 19.0760, lng: 72.8777, disease: 'Corn Northern Blight', severity: 'medium', location: 'Mumbai, MH', reports: 28 },
  { lat: 22.5726, lng: 88.3639, disease: 'Wheat Rust', severity: 'critical', location: 'Kolkata, WB', reports: 115 },
  { lat: 26.8467, lng: 80.9462, disease: 'Tomato Leaf Mold', severity: 'low', location: 'Lucknow, UP', reports: 15 },
  { lat: 28.7041, lng: 77.1025, disease: 'Wheat Rust', severity: 'high', location: 'Delhi, DL', reports: 73 },
  { lat: 23.0225, lng: 72.5714, disease: 'Cotton Bollworm', severity: 'high', location: 'Ahmedabad, GJ', reports: 54 },
  { lat: 15.8497, lng: 74.4977, disease: 'Corn Gray Leaf Spot', severity: 'medium', location: 'Dharwad, KA', reports: 22 },
  { lat: 11.0168, lng: 76.9558, disease: 'Tomato Early Blight', severity: 'medium', location: 'Coimbatore, TN', reports: 38 },
  { lat: 16.3067, lng: 80.4365, disease: 'Pepper Bacterial Spot', severity: 'low', location: 'Guntur, AP', reports: 19 }
];

// ── Weather Risk Data ──
const WEATHER_DISEASE_RISK = {
  tomato_early_blight: {
    high_temp_range: [24, 29],
    high_humidity: 85,
    high_rain: 10
  },
  tomato_late_blight: {
    high_temp_range: [10, 25],
    high_humidity: 90,
    high_rain: 20
  },
  wheat_rust: {
    high_temp_range: [15, 35],
    high_humidity: 75,
    high_rain: 5
  }
};

// ── History Data Store ──
const HISTORY_KEY = 'plantai_history';
function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}
function saveToHistory(entry) {
  const history = getHistory();
  history.unshift({ ...entry, id: Date.now(), date: new Date().toISOString() });
  if (history.length > 50) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ── Mock AI Engine ──
function runAIDetection(imageData) {
  return new Promise((resolve) => {
    // Simulate AI processing time (1.5-3 seconds)
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      // Pick a random disease (weighted toward common ones)
      const diseases = PLANT_DISEASES.filter(d => d.id !== 'tomato_healthy' && d.id !== 'potato_healthy');
      const weights = [0.25, 0.2, 0.1, 0.1, 0.08, 0.07, 0.07, 0.06, 0.04, 0.03];
      let rand = Math.random();
      let cumulative = 0;
      let selectedIdx = 0;
      for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (rand <= cumulative) { selectedIdx = i; break; }
      }
      const primary = diseases[selectedIdx] || diseases[0];
      const severity = primary.severity_range[0] + 
        Math.floor(Math.random() * (primary.severity_range[1] - primary.severity_range[0]));

      // Generate top-3
      const others = diseases.filter(d => d.id !== primary.id);
      const shuffled = [...others].sort(() => Math.random() - 0.5);
      const top3 = [
        { disease: primary, confidence: Math.floor(75 + Math.random() * 20) },
        { disease: shuffled[0], confidence: Math.floor(5 + Math.random() * 15) },
        { disease: shuffled[1], confidence: Math.floor(1 + Math.random() * 8) }
      ];
      // Normalize to sum ~100
      const total = top3.reduce((s, t) => s + t.confidence, 0);
      top3.forEach(t => t.confidence = Math.round(t.confidence / total * 100));
      top3[0].confidence = 100 - top3[1].confidence - top3[2].confidence;

      resolve({
        primary: top3[0],
        top3,
        severity,
        riskLevel: severity >= 80 ? 'Critical' : severity >= 60 ? 'High' : severity >= 35 ? 'Medium' : 'Low',
        yieldLoss: Math.round(primary.yield_loss.min + (severity / 100) * (primary.yield_loss.max - primary.yield_loss.min)),
        analysisTime: (delay / 1000).toFixed(1),
        modelVersion: 'PlantAI-EfficientNet-v3.2',
        timestamp: new Date().toISOString()
      });
    }, delay);
  });
}

// ── Image Quality Assessment ──
function assessImageQuality(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let totalBrightness = 0;
  let greenPixels = 0;
  const totalPixels = data.length / 4;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    totalBrightness += (r + g + b) / 3;
    if (g > r * 1.1 && g > b * 1.1) greenPixels++;
  }
  
  const avgBrightness = totalBrightness / totalPixels;
  const greenRatio = greenPixels / totalPixels;
  
  const issues = [];
  let score = 100;
  
  if (avgBrightness < 40) { issues.push('Image is too dark'); score -= 30; }
  if (avgBrightness > 220) { issues.push('Image is overexposed'); score -= 20; }
  if (greenRatio < 0.05) { issues.push('No plant leaf detected — ensure the leaf fills the frame'); score -= 40; }
  if (canvas.width < 150 || canvas.height < 150) { issues.push('Image resolution too low'); score -= 25; }
  
  return {
    score: Math.max(0, score),
    pass: score >= 60,
    issues,
    brightness: Math.round(avgBrightness),
    greenRatio: Math.round(greenRatio * 100),
    resolution: `${canvas.width}×${canvas.height}`
  };
}

// ── Utility Functions ──
function getRiskColor(level) {
  const map = { 'Critical': '#e63946', 'High': '#f4a261', 'Medium': '#ffd700', 'Low': '#52b788' };
  return map[level] || '#52b788';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || (() => {
    const el = document.createElement('div');
    el.id = 'toastContainer';
    el.className = 'toast-container';
    document.body.appendChild(el);
    return el;
  })();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Current language
let currentLang = localStorage.getItem('plantai_lang') || 'en';
function t(key) { return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key; }
