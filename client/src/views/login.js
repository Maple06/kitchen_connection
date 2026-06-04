import { API_URL } from '../config.js';
export const renderLogin = (container, query) => {
  if (window.currentUser) {
    if(window.currentUser.role === 'admin' || window.currentUser.role === 'superadmin') {
      window.location.hash = '#admin';
    } else {
      window.location.hash = '#dashboard';
    }
    return;
  }

  // Parse tab from query, e.g., 'tab=register'
  const urlParams = new URLSearchParams(query);
  const initialTab = urlParams.get('tab') || 'login';

  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full bg-white p-10 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
        
        <!-- Logo and Header -->
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center mb-4">
            <img src="/kitchen_connection.png" alt="Kitchen Connection Logo" class="h-20 w-auto drop-shadow-md">
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900" id="form-title">
            Selamat Datang
          </h2>
          <p class="mt-2 text-sm text-gray-600" id="form-subtitle">
            Masuk untuk melanjutkan
          </p>
        </div>

        <!-- Toggle Tabs -->
        <div class="flex mb-8 border-b border-gray-200">
          <button id="tab-login" class="flex-1 pb-3 text-center font-bold text-maroon border-b-2 border-maroon transition-all">Masuk</button>
          <button id="tab-register" class="flex-1 pb-3 text-center font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent transition-all">Daftar</button>
        </div>

        <div id="auth-alert" class="hidden p-3 mb-4 rounded-lg text-sm text-center"></div>

        <!-- Google Sign-In button (rendered by GSI) -->
        <div id="google-signin-btn" class="flex justify-center mb-4"></div>

        <!-- Divider -->
        <div class="flex items-center gap-3 mb-6" id="auth-divider">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-xs text-gray-400 font-medium uppercase tracking-wider">atau dengan email</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <div class="grid grid-cols-1">
          <!-- Login Form -->
          <form class="col-start-1 row-start-1 space-y-6 transition-all duration-300 transform" id="login-form">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
                <input id="email-address" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon sm:text-sm">
              </div>
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="block text-sm font-medium text-gray-700">Kata Sandi <span class="text-red-500">*</span></label>
                  <button type="button" id="btn-forgot-password" class="text-sm font-medium text-maroon hover:underline focus:outline-none">Lupa Sandi?</button>
                </div>
                <div class="relative">
                  <input id="password" type="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon sm:text-sm pr-10">
                  <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-maroon focus:outline-none toggle-password" data-target="password">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" id="login-btn" class="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-maroon hover:bg-maroon-dark transition-colors shadow-md mt-6">
              Masuk ke Portal
            </button>
          </form>

          <!-- Register Form -->
          <form class="col-start-1 row-start-1 space-y-6 transition-all duration-300 transform opacity-0 translate-x-12 pointer-events-none" id="register-form">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
                <input id="reg-name" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
                <input id="reg-email" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kata Sandi <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input id="reg-pass" type="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon sm:text-sm pr-10">
                  <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-maroon focus:outline-none toggle-password" data-target="reg-pass">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input id="reg-pass-confirm" type="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon sm:text-sm pr-10">
                  <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-maroon focus:outline-none toggle-password" data-target="reg-pass-confirm">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" id="register-btn" class="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-maroon hover:bg-maroon-dark transition-colors shadow-md mt-6">
              Buat Akun Baru
            </button>
          </form>

          <!-- Forgot Password Form -->
          <form class="col-start-1 row-start-1 space-y-6 transition-all duration-300 transform opacity-0 translate-x-12 pointer-events-none bg-white z-10" id="forgot-form">
            <div class="text-center mb-4 mt-2">
              <p class="text-sm text-gray-500">Masukkan email Anda untuk menerima tautan reset.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
              <input id="forgot-email" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon sm:text-sm">
            </div>
            <div class="space-y-3">
              <button type="submit" id="forgot-btn" class="w-full py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-maroon hover:bg-maroon-dark transition-colors">Kirim Tautan</button>
              <button type="button" id="btn-back-login" class="w-full py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // UI Elements
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const forgotForm = document.getElementById('forgot-form');
  const alertBox = document.getElementById('auth-alert');
  
  const btnForgot = document.getElementById('btn-forgot-password');
  const btnBackLogin = document.getElementById('btn-back-login');

  const showAlert = (msg, isError = true) => {
    alertBox.className = `p-3 mb-4 rounded-lg text-sm text-center ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`;
    alertBox.innerHTML = msg;
    alertBox.classList.remove('hidden');
  };

  // Toggle Password Logic
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // Tab switching logic with animation classes
  const switchTab = (showFormStr) => {
    alertBox.classList.add('hidden');
    
    // Reset all to hidden/inactive states
    loginForm.classList.replace('opacity-100', 'opacity-0');
    loginForm.classList.add('pointer-events-none', '-translate-x-12');
    loginForm.classList.remove('translate-x-0');

    registerForm.classList.replace('opacity-100', 'opacity-0');
    registerForm.classList.add('pointer-events-none', 'translate-x-12');
    registerForm.classList.remove('translate-x-0');

    forgotForm.classList.replace('opacity-100', 'opacity-0');
    forgotForm.classList.add('pointer-events-none', 'translate-x-12');
    forgotForm.classList.remove('translate-x-0');
    
    if (showFormStr === 'login') {
      tabLogin.className = "flex-1 pb-3 text-center font-bold text-maroon border-b-2 border-maroon transition-all";
      tabRegister.className = "flex-1 pb-3 text-center font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent transition-all";
      
      formTitle.textContent = "Selamat Datang";
      formSubtitle.textContent = "Masuk untuk melanjutkan";
      
      setTimeout(() => {
        loginForm.classList.replace('opacity-0', 'opacity-100');
        loginForm.classList.remove('pointer-events-none', '-translate-x-12', 'translate-x-12');
        loginForm.classList.add('translate-x-0');
      }, 50);

    } else if (showFormStr === 'register') {
      tabRegister.className = "flex-1 pb-3 text-center font-bold text-maroon border-b-2 border-maroon transition-all";
      tabLogin.className = "flex-1 pb-3 text-center font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent transition-all";
      
      formTitle.textContent = "Buat Akun Baru";
      formSubtitle.textContent = "Bergabung bersama kami sekarang";

      setTimeout(() => {
        registerForm.classList.replace('opacity-0', 'opacity-100');
        registerForm.classList.remove('pointer-events-none', '-translate-x-12', 'translate-x-12');
        registerForm.classList.add('translate-x-0');
      }, 50);

    } else if (showFormStr === 'forgot') {
      tabLogin.className = "flex-1 pb-3 text-center font-bold text-gray-400 border-b-2 border-transparent transition-all";
      tabRegister.className = "flex-1 pb-3 text-center font-bold text-gray-400 border-b-2 border-transparent transition-all";
      
      formTitle.textContent = "Atur Ulang Sandi";
      formSubtitle.textContent = "";

      setTimeout(() => {
        forgotForm.classList.replace('opacity-0', 'opacity-100');
        forgotForm.classList.remove('pointer-events-none', '-translate-x-12', 'translate-x-12');
        forgotForm.classList.add('translate-x-0');
      }, 50);
    }
  };

  // Ensure initial states have the right classes
  loginForm.classList.add('opacity-0');
  registerForm.classList.add('opacity-0');
  forgotForm.classList.add('opacity-0');

  // Load initial tab
  switchTab(initialTab);

  if(tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
  if(tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));
  if(btnForgot) btnForgot.addEventListener('click', () => switchTab('forgot'));
  if(btnBackLogin) btnBackLogin.addEventListener('click', () => switchTab('login'));

  // Quick switch links at the bottom
  const linkToRegister = document.getElementById('link-to-register');
  const linkToLogin = document.getElementById('link-to-login');
  if(linkToRegister) linkToRegister.addEventListener('click', () => switchTab('register'));
  if(linkToLogin) linkToLogin.addEventListener('click', () => switchTab('login'));

  // --- LOGIN ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('login-btn');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Memproses...';
      btn.disabled = true;

      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('email-address').value,
            password: document.getElementById('password').value
          }),
          credentials: 'include'
        });

        const data = await res.json();

        if (res.ok) {
          window.currentUser = data.user;
          window.dispatchEvent(new Event('hashchange'));
          window.location.hash = (data.user.role === 'admin' || data.user.role === 'superadmin') ? '#admin' : '#dashboard';
        } else {
          showAlert(data.message);
        }
      } catch (error) {
        showAlert('Server tidak dapat dihubungi.');
      } finally {
        btn.innerHTML = 'Masuk ke Portal';
        btn.disabled = false;
      }
    });
  }

  // --- REGISTER ---
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const pass = document.getElementById('reg-pass').value;
      const passConfirm = document.getElementById('reg-pass-confirm').value;

      if (pass !== passConfirm) {
        showAlert('Konfirmasi kata sandi tidak cocok.');
        return;
      }

      const btn = document.getElementById('register-btn');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Memproses...';
      btn.disabled = true;

      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            password: pass
          })
        });

        const data = await res.json();
        
        if (res.ok) {
          showAlert(data.message, false);
          registerForm.reset();
        } else {
          showAlert(data.message);
        }
      } catch (error) {
        showAlert('Server tidak dapat dihubungi.');
      } finally {
        btn.innerHTML = 'Buat Akun Baru';
        btn.disabled = false;
      }
    });
  }

  // --- FORGOT PASSWORD ---
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('forgot-btn');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
      btn.disabled = true;

      try {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: document.getElementById('forgot-email').value })
        });

        const data = await res.json();
        
        if (res.ok) {
          showAlert(data.message, false);
          forgotForm.reset();
        } else {
          showAlert(data.message);
        }
      } catch (error) {
        showAlert('Server tidak dapat dihubungi.');
      } finally {
        btn.innerHTML = 'Kirim Tautan';
        btn.disabled = false;
      }
    });
  }

  // --- GOOGLE SIGN-IN ---
  const handleGoogleCredential = async (response) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        window.currentUser = data.user;
        window.dispatchEvent(new Event('hashchange'));
        window.location.hash = (data.user.role === 'admin' || data.user.role === 'superadmin') ? '#admin' : '#dashboard';
      } else {
        showAlert(data.message || 'Masuk dengan Google gagal.');
      }
    } catch (err) {
      showAlert('Server tidak dapat dihubungi.');
    }
  };

  const renderGoogleButton = () => {
    const btnContainer = document.getElementById('google-signin-btn');
    if (!btnContainer || !window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: '244439459583-o237jdkh8jucm9j22u11b64upnkajvgr.apps.googleusercontent.com',
      callback: handleGoogleCredential,
    });

    window.google.accounts.id.renderButton(btnContainer, {
      theme: 'outline',
      size: 'large',
      width: 320,
      text: 'signin_with',
      locale: 'id_ID',
    });
  };

  if (window.google?.accounts?.id) {
    renderGoogleButton();
  } else {
    const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (script) {
      script.addEventListener('load', renderGoogleButton);
    }
  }
};
