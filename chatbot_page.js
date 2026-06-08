// ================================================
// PlantAI - Full Chatbot Page Logic
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initChatbotPage();
});

function initChatbotPage() {
  const input = document.getElementById('pageChatInput');
  const sendBtn = document.getElementById('pageChatSend');
  const voiceBtn = document.getElementById('pageChatVoice');
  const messagesEl = document.getElementById('pageChatMessages');
  const topicBtns = document.querySelectorAll('.topic-btn');

  let isRecording = false;
  let recognition = null;

  // Send function
  function sendMessage(text) {
    if (!text.trim()) return;
    appendMessage(text, 'user');
    input && (input.value = '');
    showTyping();
    setTimeout(() => {
      removeTyping();
      const response = getBotResponse(text);
      appendMessage(response, 'bot');
    }, 1000 + Math.random() * 800);
  }

  sendBtn?.addEventListener('click', () => sendMessage(input?.value || ''));
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });

  // Recommendations click listener
  topicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.dataset.q || btn.textContent);
    });
  });

  // Speech recognition
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
      showToast('Voice input error. Try typing instead.', 'warning');
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

  // Helpers
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
    typing.id = 'pageTypingIndicator';
    typing.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(typing);
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
  }

  function removeTyping() {
    document.getElementById('pageTypingIndicator')?.remove();
  }
}
