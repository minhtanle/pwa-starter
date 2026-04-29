/* app.v1.0.0.js */

// Đăng ký Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.v1.0.0.js')
      .then((reg) => {
        console.log('[SW] Registered:', reg.scope);
        // Khi có version mới, kích hoạt ngay
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Có bản mới — reload để lấy code mới nhất
              window.location.reload();
            }
          });
        });
      })
      .catch((err) => console.error('[SW] Registration failed:', err));
  });
}

// Nút Back
document.getElementById('btn-back')?.addEventListener('click', () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    console.log('[Nav] No history to go back');
  }
});

// Nút Settings
document.getElementById('btn-settings')?.addEventListener('click', () => {
  console.log('[Nav] Open settings');
  // TODO: mở settings panel hoặc navigate tới trang settings
});
