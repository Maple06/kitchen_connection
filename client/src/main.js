import { API_URL } from './config.js';
import './style.css';
import { renderHome } from './views/home.js';
import { renderServices } from './views/services.js';
import { renderCatalog } from './views/catalog.js';
import { renderChecklist } from './views/checklist.js';
import { renderReservation } from './views/reservation.js';
import { renderLogin } from './views/login.js';
import { renderDashboard } from './views/dashboard.js';
import { renderAdmin } from './views/admin.js';
import { renderVerify } from './views/verify.js';
import { renderResetPassword } from './views/reset-password.js';
import { renderAccount } from './views/account.js';

const app = document.getElementById('app-content');

// Global Auth State
window.currentUser = null;

// Fetch current user from cookie
const fetchAuth = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      window.currentUser = data.user;
      updateNav(data.user);
    } else {
      window.currentUser = null;
      updateNav(null);
    }
  } catch (error) {
    window.currentUser = null;
    updateNav(null);
  }
};

window.logout = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    window.currentUser = null;
    updateNav(null);
    window.location.hash = '#/';
  } catch (error) {
    console.error('Gagal logout', error);
  }
};

const updateNav = (user) => {
  const authLinks = document.getElementById('nav-auth-links');
  const authLinksMobile = document.getElementById('nav-auth-links-mobile');
  const navHome = document.getElementById('nav-home');
  const navPortal = document.getElementById('nav-portal-link');
  const navPortalMobile = document.getElementById('nav-portal-link-mobile');

  if (navHome) {
    if (user) {
      navHome.href = (user.role === 'admin' || user.role === 'superadmin') ? '#admin' : '#dashboard';
    } else {
      navHome.href = '#/';
    }
  }

  if (navPortal) {
    // Always reset modifier classes first
    navPortal.classList.remove('nav-portal-link--admin', 'nav-portal-link--client');

    if (!user) {
      navPortal.href = '#/';
      navPortal.textContent = 'Beranda';
    } else if (user.role === 'admin' || user.role === 'superadmin') {
      navPortal.href = '#admin';
      navPortal.textContent = 'Dashboard';
      navPortal.classList.add('nav-portal-link--admin');
    } else {
      navPortal.href = '#dashboard';
      navPortal.textContent = 'Dashboard';
      navPortal.classList.add('nav-portal-link--client');
    }
  }

  if (navPortalMobile) {
    navPortalMobile.classList.remove('nav-portal-link--admin', 'nav-portal-link--client');

    if (!user) {
      navPortalMobile.href = '#/';
      navPortalMobile.textContent = 'Beranda';
    } else if (user.role === 'admin' || user.role === 'superadmin') {
      navPortalMobile.href = '#admin';
      navPortalMobile.textContent = 'Dashboard';
      navPortalMobile.classList.add('nav-portal-link--admin');
    } else {
      navPortalMobile.href = '#dashboard';
      navPortalMobile.textContent = 'Dashboard';
      navPortalMobile.classList.add('nav-portal-link--client');
    }
  }

  const renderAuthLinks = (targetEl, isMobile = false) => {
    if (!targetEl) return;

    const menuButtonId = `profile-menu-button-${targetEl.id || 'auth'}`;

    if (user) {
      const getInitials = (name) => {
        const names = name.split(' ');
        return names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
      };

      if (isMobile) {
        targetEl.innerHTML = `
          <div class="mt-2 pt-4 border-t border-gray-100">
            <div class="flex items-center gap-3 mb-4 px-2">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-maroon text-white font-bold text-lg shadow-sm">
                ${getInitials(user.name)}
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">${user.name}</p>
                <p class="text-xs text-gray-500 capitalize">${user.role}</p>
              </div>
            </div>
            <div class="flex flex-col space-y-2 px-2">
              <a href="#account" class="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-maroon transition-colors" data-link>
                <i class="fa-solid fa-user-gear w-5 text-center"></i> Manajemen Akun
              </a>
              <button onclick="window.logout()" class="flex items-center gap-2 text-left py-2 text-sm text-red-600 hover:text-red-800 transition-colors">
                <i class="fa-solid fa-right-from-bracket w-5 text-center"></i> Keluar
              </button>
            </div>
          </div>
        `;
      } else {
        targetEl.innerHTML = `
          <div class="relative inline-block text-left group">
            <button type="button" class="flex items-center justify-center w-10 h-10 rounded-full bg-maroon text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon transition-transform transform hover:scale-105" id="${menuButtonId}">
              ${getInitials(user.name)}
            </button>
            
            <!-- Dropdown menu -->
            <div class="origin-top-left lg:origin-top-right absolute left-0 lg:left-auto lg:right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
              <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="${menuButtonId}">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900 truncate">${user.name}</p>
                  <p class="text-xs text-gray-500 capitalize">${user.role}</p>
                </div>
                <a href="#account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-maroon transition-colors" role="menuitem">
                  <i class="fa-solid fa-user-gear w-5"></i> Manajemen Akun
                </a>
                <button onclick="window.logout()" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" role="menuitem">
                  <i class="fa-solid fa-right-from-bracket w-5"></i> Keluar
                </button>
              </div>
            </div>
          </div>
        `;
      }
    } else {
      if (isMobile) {
        targetEl.innerHTML = `
          <a href="#login?tab=login" class="text-gray-600 hover:text-maroon font-medium transition-colors px-2" data-link>Masuk</a>
          <a href="#login?tab=register" class="bg-maroon hover:bg-maroon-dark text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center justify-center mt-2" data-link>
            Mulai Disini <i class="fa-solid fa-arrow-right ml-2"></i>
          </a>
        `;
      } else {
        targetEl.innerHTML = `
          <a href="#login?tab=login" class="text-gray-600 hover:text-maroon font-medium transition-colors" data-link>Masuk</a>
          <a href="#login?tab=register" class="bg-maroon hover:bg-maroon-dark text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm" data-link>
            Mulai Disini <i class="fa-solid fa-arrow-right ml-1"></i>
          </a>
        `;
      }
    }
  };

  renderAuthLinks(authLinks, false);
  renderAuthLinks(authLinksMobile, true);
};

// Simple Hash Router
const router = async () => {
  window.scrollTo(0, 0);
  const hashObj = new URL(window.location.href);
  const hashPath = hashObj.hash.split('?')[0] || '#/';
  const hashQuery = hashObj.hash.split('?')[1] || '';
  
  app.innerHTML = '<div class="flex justify-center items-center min-h-[60vh]"><i class="fa-solid fa-spinner fa-spin-pulse text-maroon text-4xl"></i></div>';
  
  // Wait for auth check before rendering protected routes
  if (hashPath === '#dashboard' || hashPath === '#admin' || hashPath === '#account') {
      await fetchAuth();
  }

  app.innerHTML = ''; // Clear loading

  switch(hashPath) {
    case '#/':
    case '':
      renderHome(app);
      break;
    case '#services':
      renderServices(app);
      break;
    case '#catalog':
      renderCatalog(app);
      break;
    case '#checklist':
      renderChecklist(app);
      break;
    case '#reservation':
      renderReservation(app);
      break;
    case '#login':
      renderLogin(app, hashQuery);
      break;
    case '#dashboard':
      renderDashboard(app);
      break;
    case '#admin':
      renderAdmin(app);
      break;
    case '#account':
      renderAccount(app);
      break;
    case '#verify':
      renderVerify(app, hashQuery);
      break;
    case '#reset-password':
      renderResetPassword(app, hashQuery);
      break;
    default:
      app.innerHTML = `<div class="p-20 text-center"><h1 class="text-4xl font-bold">404 - Halaman Tidak Ditemukan</h1></div>`;
  }
  
  // Re-initialize IntersectionObserver for scroll animations after route render
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        entry.target.classList.remove('opacity-0');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  setTimeout(() => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => {
      // Ensure elements start hidden if JS is active
      el.classList.add('opacity-0');
      observer.observe(el);
    });
  }, 100);
};

// Listen to hash changes
window.addEventListener('hashchange', router);

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await fetchAuth();

  const mobileMenu = document.getElementById('nav-mobile-menu');
  const mobileMenuButton = document.getElementById('nav-menu-button');

  const setMobileMenuOpen = (open) => {
    if (!mobileMenu || !mobileMenuButton) return;
    mobileMenu.classList.toggle('hidden', !open);
    mobileMenuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      const isOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
      setMobileMenuOpen(!isOpen);
    });
  }

  // Close mobile menu when navigating
  window.addEventListener('hashchange', () => setMobileMenuOpen(false));
  
  // Close mobile menu on click outside or on a link
  document.addEventListener('click', (e) => {
    const target = e.target;
    const isOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
    
    if (isOpen) {
      const clickedInsideMenu = mobileMenu.contains(target);
      const clickedMenuButton = mobileMenuButton && mobileMenuButton.contains(target);
      const clickedLink = target && target.closest && target.closest('a');
      
      if ((!clickedInsideMenu && !clickedMenuButton) || clickedLink) {
        setMobileMenuOpen(false);
      }
    }
  });
  
  const links = document.querySelectorAll('[data-link]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        // Just let the default anchor behavior change the hash
      }
    });
  });
  
  router();
});
