// ================================================
// PlantAI - AI Chatbot System
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
});

function initChatbot() {
  const bubble = document.getElementById('chatbotBubble');
  const panel = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('chatbotClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const voiceBtn = document.getElementById('chatVoice');
  const messagesEl = document.getElementById('chatbotMessages');
  const suggestions = document.querySelectorAll('.chat-suggest');

  if (!bubble) return;

  let isOpen = false;
  let isRecording = false;
  let recognition = null;

  // Toggle panel
  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    panel?.classList.toggle('open', isOpen);
    if (isOpen) input?.focus();
  });
  closeBtn?.addEventListener('click', () => {
    isOpen = false;
    panel?.classList.remove('open');
  });

  // Send message
  function sendMessage(text) {
    if (!text.trim()) return;
    appendMessage(text, 'user');
    input && (input.value = '');
    showTyping();
    setTimeout(() => {
      removeTyping();
      const response = getBotResponse(text);
      appendMessage(response, 'bot');
      messagesEl?.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
    }, 1000 + Math.random() * 800);
  }

  sendBtn?.addEventListener('click', () => sendMessage(input?.value || ''));
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });

  // Suggestions
  suggestions.forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.dataset.q || btn.textContent));
  });

  // Voice Input
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'kn' ? 'kn-IN' : currentLang === 'te' ? 'te-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (input) input.value = transcript;
      sendMessage(transcript);
    };
    recognition.onend = () => {
      isRecording = false;
      voiceBtn?.classList.remove('recording');
    };
    recognition.onerror = () => {
      isRecording = false;
      voiceBtn?.classList.remove('recording');
      showToast('Voice input unavailable. Try typing instead.', 'warning');
    };

    voiceBtn?.addEventListener('click', () => {
      if (!isRecording) {
        isRecording = true;
        voiceBtn.classList.add('recording');
        recognition.start();
        showToast('Listening... speak now 🎙️', 'info');
      } else {
        isRecording = false;
        voiceBtn.classList.remove('recording');
        recognition.stop();
      }
    });
  } else {
    voiceBtn?.setAttribute('title', 'Voice input not supported in this browser');
    voiceBtn && (voiceBtn.style.opacity = '0.4');
  }

  // Helper functions
  function appendMessage(text, from) {
    if (!messagesEl) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${from}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    msgDiv.appendChild(bubble);
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
  }

  function showTyping() {
    if (!messagesEl) return;
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(typing);
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
  }

  function removeTyping() {
    document.getElementById('typingIndicator')?.remove();
  }
}

function getBotResponse(userText) {
  const text = userText.toLowerCase();
  
  // Find matching knowledge base entry
  for (const [key, entry] of Object.entries(CHATBOT_KB)) {
    if (key === 'default') continue;
    if (entry.tags.some(tag => text.includes(tag)) || text.includes(key)) {
      return entry.answer;
    }
  }

  // Context-aware responses
  if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('namaste') || text.includes('नमस्ते')) {
    return `${t('chatGreeting')}`;
  }
  if (text.includes('thank')) {
    return '😊 You\'re welcome! Feel free to ask anything else about your crops. For detailed analysis, try uploading a leaf image on the <a href="detect.html" style="color:var(--primary)">Detection page</a>!';
  }
  if (text.includes('detect') || text.includes('diagnose') || text.includes('identify')) {
    return '🔬 For plant disease detection, head to our <a href="detect.html" style="color:var(--primary)">Detection page</a>! Upload a clear photo of the affected leaf and our AI will analyze it in seconds with 99% accuracy.';
  }
  if (text.includes('pdf') || text.includes('report') || text.includes('download')) {
    return '📄 After running a disease detection, you can download a <strong>professional PDF report</strong> that includes:\n• Disease identification with confidence scores\n• Severity analysis with visual chart\n• Complete treatment protocol\n• Prevention guidelines\n• Expected yield impact\n\nRun a detection first, then click "Download PDF Report"!';
  }
  if (text.includes('weather') || text.includes('rain') || text.includes('humidity')) {
    return '🌤️ <strong>Weather & Disease Risk:</strong>\n\n• High humidity (>85%) → Risk of fungal diseases (blight, mildew)\n• Hot + wet → Early Blight risk for tomatoes\n• Cool + foggy → Late Blight emergency conditions\n• Dry hot wind → Rust spread for wheat\n\nCheck our <a href="map.html" style="color:var(--primary)">Disease Map</a> for current outbreak alerts in your region!';
  }
  if (text.includes('organic') || text.includes('natural') || text.includes('eco')) {
    return '🌿 <strong>Organic Disease Control Options:</strong>\n\n• <strong>Copper fungicide</strong> — effective against most fungal/bacterial diseases\n• <strong>Neem oil</strong> (5ml/L) — broad spectrum pest & disease control\n• <strong>Baking soda</strong> (1 tsp/L) — prevents fungal growth\n• <strong>Garlic extract</strong> — natural antifungal properties\n• <strong>Sulfur dust</strong> — for powdery mildew\n\nOrganic options work best as preventive measures!';
  }
  if (text.includes('yield') || text.includes('loss') || text.includes('production')) {
    return '📊 <strong>Disease Impact on Yield:</strong>\n\nTypical yield losses if untreated:\n• Early Blight: 15-45% loss\n• Late Blight: 50-100% loss 🚨\n• Wheat Rust: 20-70% loss\n• Bacterial Spot: 15-60% loss\n\n💡 Early detection reduces losses by 60-80%. Upload a leaf photo now for early diagnosis!';
  }
  if (text.includes('season') || text.includes('calendar') || text.includes('when')) {
    return '📅 <strong>Disease Risk by Season (India):</strong>\n\n• <strong>Kharif (Jun-Oct)</strong>: High humidity → Blight, Bacterial diseases\n• <strong>Rabi (Nov-Mar)</strong>: Rust risk for wheat; Mildew for vegetables\n• <strong>Zaid (Apr-Jun)</strong>: Hot dry → Viral diseases, spider mites\n\nPlan preventive spraying 2 weeks before peak risk periods!';
  }

  // Default
  return CHATBOT_KB.default.answer;
}
