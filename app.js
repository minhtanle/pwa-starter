/* app.v1.0.0.js */

// Danh sách ứng dụng
const apps = [
  { id: 'scanner', name: 'Scanner', icon: '📷', color: 'bg-emerald-500' },
  { id: 'edura', name: 'Edura', icon: '🎓', color: 'bg-blue-500' },
  { id: 'settings', name: 'Settings', icon: '⚙️', color: 'bg-gray-500' }
];

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

// Chuyển trang
function navigateTo(page, title = 'Home') {
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
}

// Load nội dung ứng dụng
function loadApp(appId) {
  if (appId === 'scanner') {
    appView.innerHTML = `
      <div id="camera-section" class="bg-slate-900 h-full relative">
        <div class="absolute inset-0 flex items-center justify-center pb-20">
          <div class="relative w-60 h-60">
            <div class="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-3xl"></div>
            <div class="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-3xl"></div>
            <div class="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-3xl"></div>
            <div class="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-3xl"></div>
            <div class="scan-anim absolute top-2 left-4 right-4 h-1 bg-emerald-400 shadow-[0_0_20px_#10b981]"></div>
          </div>
        </div>
      </div>
      <div id="info-section" class="fixed bottom-0 w-full bg-white border-t border-gray-200 rounded-t-3xl p-4 pb-8">
        <div class="flex items-center gap-4 mb-4">
          <div class="flex-grow">
            <h2 class="text-xl font-bold">QUÝ ĐỨC</h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-400">Mã: 11001</span>
              <span class="text-xs text-emerald-600 font-bold">Thành công</span>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="flex-1 py-3 bg-gray-100 text-gray-500 font-bold rounded-2xl text-xs">STOP</button>
          <button class="flex-[2.5] py-3 bg-[#A11B4B] text-white font-black rounded-2xl text-xs uppercase">Quét tiếp</button>
        </div>
      </div>
    `;
  } else if (appId === 'edura') {
    appView.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Edura Debug</h2>
        <div class="bg-gray-50 p-4 rounded-2xl">
          <p class="text-sm text-gray-600">Debug tools cho hệ thống Edura</p>
        </div>
      </div>
    `;
  }
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
    document.getElementById('install-prompt').classList.remove('hidden');
  });

  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Kết quả: ${outcome}`);
      deferredPrompt = null;
      document.getElementById('install-prompt').classList.add('hidden');
    }
  });

  document.getElementById('close-install')?.addEventListener('click', () => {
    document.getElementById('install-prompt').classList.add('hidden');
    deferredPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    console.log('Đã cài đặt PWA');
    document.getElementById('install-prompt').classList.add('hidden');
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
    console.log('Debug CSS mode enabled');
    document.body.classList.toggle('debug-css');
    alert('Debug CSS: Toggle CSS visualization');
  });

  // Debug Edura
  document.getElementById('btn-debug-edura')?.addEventListener('click', () => {
    navigateTo('edura', 'Edura Debug');
  });

  // Install PWA button in settings
  document.getElementById('btn-install-pwa')?.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
    } else {
      alert('Ứng dụng đã được cài đặt hoặc trình duyệt không hỗ trợ');
    }
  });
}

// Khởi chạy
init();
