/* app.js - Main application logic */

// Bảo vệ layout khỏi bị thay đổi
function protectLayout() {
  const protectedElements = [document.body, document.getElementById('app'), document.getElementById('app-content')];

  protectedElements.forEach(el => {
    if (!el) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
            console.warn('Phát hiện thay đổi', mutation.attributeName, 'của', el.id || el.tagName);
          }
        }
      });
    });

    observer.observe(el, { attributes: true });
  });
}

// Danh sách ứng dụng
const apps = [
  { id: 'scanner', name: 'Scanner', icon: '📷', color: 'bg-emerald-500', component: 'app-scanner' },
  { id: 'edura', name: 'Edura', icon: '🎓', color: 'bg-blue-500', component: 'app-edura' },
  { id: 'settings', name: 'Settings', icon: '⚙️', color: 'bg-gray-500' }
];

// Lazy load component registry
const componentMap = {
  'app-scanner': async () => {
    const module = await import('./components/scanner.js');
    if (!customElements.get('app-scanner')) {
      customElements.define('app-scanner', module.default);
    }
  },
  'app-edura': async () => {
    const module = await import('./components/edura.js');
    if (!customElements.get('app-edura')) {
      customElements.define('app-edura', module.default);
    }
  }
};

// DOM elements
const homeScreen = document.getElementById('home-screen');
const appView = document.getElementById('app-view');
const settingsPage = document.getElementById('settings-page');
const btnBack = document.getElementById('btn-back');
const btnSettings = document.getElementById('btn-settings');
const headerTitle = document.querySelector('.header-title');

// Install prompt
let deferredPrompt;

// Khởi tạo ứng dụng
function init() {
  renderAppGrid();
  setupEventListeners();
  registerServiceWorker();
  setupInstallPrompt();
  loadErudaSetting();
}

// Hiển thị grid ứng dụng
function renderAppGrid() {
  const grid = homeScreen.querySelector('.grid');
  grid.innerHTML = apps.map(app => `
    <div class="app-icon flex flex-col items-center gap-2 cursor-pointer" data-app="${app.id}">
      <div class="${app.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-transform">
        ${app.icon}
      </div>
      <span class="text-xs font-medium text-gray-700">${app.name}</span>
    </div>
  `).join('');
}

// Chuyển trang với hiệu ứng fade
function navigateTo(page, title = 'Home') {
  const currentPage = homeScreen.classList.contains('hidden') ? (appView.classList.contains('hidden') ? 'settings' : 'app') : 'home';

  const activePage = currentPage === 'home' ? homeScreen : (currentPage === 'settings' ? settingsPage : appView);
  activePage.classList.add('opacity-0', 'transition-opacity', 'duration-200');

  setTimeout(() => {
    homeScreen.classList.add('hidden');
    appView.classList.add('hidden');
    settingsPage.classList.add('hidden');
    btnBack.classList.remove('hidden');

    if (page === 'home') {
      homeScreen.classList.remove('hidden');
      btnBack.classList.add('hidden');
    } else if (page === 'settings') {
      settingsPage.classList.remove('hidden');
    } else {
      appView.classList.remove('hidden');
      loadApp(page);
    }

    headerTitle.textContent = title;

    setTimeout(() => {
      const newPage = page === 'home' ? homeScreen : (page === 'settings' ? settingsPage : appView);
      newPage.classList.remove('opacity-0');
    }, 50);
  }, 200);
}

// Load Web Component
async function loadApp(appId) {
  const app = apps.find(a => a.id === appId);
  if (!app?.component) return;

  appView.classList.add('opacity-0', 'transition-opacity', 'duration-300');
  appView.innerHTML = '';

  // Lazy load component
  if (componentMap[app.component]) {
    await componentMap[app.component]();
  }

  setTimeout(() => {
    appView.innerHTML = `<${app.component}></${app.component}>`;
    appView.classList.remove('opacity-0');
  }, 150);
}

// Đăng ký Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[SW] Registered:', reg.scope);
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                window.location.reload();
              }
            });
          });
        })
        .catch((err) => console.error('[SW] Registration failed:', err));
    });
  }
}

// Install prompt
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('install-prompt')?.classList.remove('hidden');
  });

  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Kết quả: ${outcome}`);
      deferredPrompt = null;
      document.getElementById('install-prompt')?.classList.add('hidden');
    }
  });

  document.getElementById('close-install')?.addEventListener('click', () => {
    document.getElementById('install-prompt')?.classList.add('hidden');
    deferredPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    console.log('Đã cài đặt PWA');
    document.getElementById('install-prompt')?.classList.add('hidden');
  });
}

// Toggle eruda based on setting
function loadErudaSetting() {
  const toggle = document.getElementById('toggle-eruda');
  if (!toggle) return;

  const saved = localStorage.getItem('eruda-enabled') === 'true';
  toggle.checked = saved;

  if (saved) {
    const script = document.createElement('script');
    script.src = '//cdn.jsdelivr.net/npm/eruda';
    script.onload = () => eruda.init();
    document.head.appendChild(script);
  }

  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      if (window.eruda) {
        eruda.init();
      } else {
        const script = document.createElement('script');
        script.src = '//cdn.jsdelivr.net/npm/eruda';
        script.onload = () => eruda.init();
        document.head.appendChild(script);
      }
      localStorage.setItem('eruda-enabled', 'true');
    } else {
      if (window.eruda) eruda.destroy();
      localStorage.setItem('eruda-enabled', 'false');
    }
  });
}

// Event listeners
function setupEventListeners() {
  // App icons click
  homeScreen.addEventListener('click', (e) => {
    const appIcon = e.target.closest('.app-icon');
    if (appIcon) {
      const appId = appIcon.dataset.app;
      const app = apps.find(a => a.id === appId);
      if (appId === 'settings') {
        navigateTo('settings', 'Cài đặt');
      } else {
        navigateTo(appId, app?.name || 'App');
      }
    }
  });

  // Back button
  btnBack.addEventListener('click', () => {
    navigateTo('home', 'Home');
  });

  // Settings button
  btnSettings.addEventListener('click', () => {
    navigateTo('settings', 'Cài đặt');
  });

  // Debug CSS
  document.getElementById('btn-debug-css')?.addEventListener('click', () => {
    document.body.classList.toggle('debug-css');
  });
}

// Khởi chạy
protectLayout();
init();
