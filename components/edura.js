/* edura.js - Edura Web Component */
export class EduraApp extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

  render() {
    this.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Edura Debug</h2>
        <div class="bg-gray-50 p-4 rounded-2xl">
          <p class="text-sm text-gray-600 mb-4">Debug tools cho hệ thống Edura</p>
          <div class="space-y-3">
            <button id="btn-open-eruda" class="w-full py-3 bg-purple-500 text-white font-bold rounded-xl text-sm active:scale-95 transition-transform">
              Mở Eruda Console
            </button>
            <button id="btn-close-eruda" class="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-xl text-sm active:scale-95 transition-transform">
              Đóng Eruda
            </button>
          </div>
        </div>
      </div>
    `;
  }

  setupEvents() {
    this.querySelector('#btn-open-eruda')?.addEventListener('click', () => {
      if (window.eruda) eruda.show();
    });

    this.querySelector('#btn-close-eruda')?.addEventListener('click', () => {
      if (window.eruda) eruda.hide();
    });
  }
}

export default EduraApp;
customElements.define('app-edura', EduraApp);
