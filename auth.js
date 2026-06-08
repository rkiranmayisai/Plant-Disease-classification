// ================================================
// PlantAI - Authentication Logic
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initAuthPage();
});

function initAuthPage() {
  const loginBlock = document.getElementById('loginBlock');
  const registerBlock = document.getElementById('registerBlock');
  const logoutBlock = document.getElementById('logoutBlock');

  const toRegister = document.getElementById('toRegister');
  const toLogin = document.getElementById('toLogin');
  
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const btnLogout = document.getElementById('btnLogout');

  // Toggle form blocks
  toRegister?.addEventListener('click', () => {
    loginBlock.classList.add('hidden');
    registerBlock.classList.remove('hidden');
  });

  toLogin?.addEventListener('click', () => {
    registerBlock.classList.add('hidden');
    loginBlock.classList.remove('hidden');
  });

  // Handle forms
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    // Create mock user
    const mockUser = {
      name: 'Farmer Friend',
      email: email,
      farmSize: 8,
      state: 'Karnataka'
    };
    
    saveUser(mockUser);
    showToast('Logged in successfully!', 'success');
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  });

  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const size = document.getElementById('regFarmSize').value || 5;
    const state = document.getElementById('regState').value;
    
    const newUser = {
      name: name,
      email: email,
      farmSize: size,
      state: state
    };
    
    saveUser(newUser);
    showToast('Registration complete & logged in!', 'success');
    
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  });

  btnLogout?.addEventListener('click', () => {
    logout();
    showToast('Logged out of session.', 'info');
    checkAuthState();
  });

  // Initial check
  checkAuthState();

  function checkAuthState() {
    const user = getUser();
    if (user) {
      loginBlock?.classList.add('hidden');
      registerBlock?.classList.add('hidden');
      logoutBlock?.classList.remove('hidden');
      if (document.getElementById('loggedInLabel')) {
        document.getElementById('loggedInLabel').textContent = `You are currently logged in as: ${user.name} (${user.email})`;
      }
    } else {
      logoutBlock?.classList.add('hidden');
      registerBlock?.classList.add('hidden');
      loginBlock?.classList.remove('hidden');
    }
  }
}
