/* scanner.js - Scanner Web Component */
export class ScannerApp extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

  render() {
    this.innerHTML = `
      <div id="camera-section" class="bg-slate-900" style="flex:1; position:relative; min-height:0;">
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
      <div id="info-section" style="flex-shrink:0; background:white; border-top:1px solid #e5e7eb; border-top-left-radius:2.5rem; border-top-right-radius:2.5rem; box-shadow:0 -15px 30px rgba(0,0,0,0.4); padding:1rem; padding-bottom:calc(env(safe-area-inset-bottom) + 1rem); display:flex; flex-direction:column;">
        <div id="update-toast-container" class="h-4 w-full px-6 flex items-center justify-center mt-2">
          <div id="update-toast" class="hidden w-full max-w-xs bg-gray-900 text-white text-center text-xs font-bold py-2 px-4 rounded-full shadow-lg cursor-pointer active:scale-95 transition-transform">
            🚀 Phiên bản mới! Chạm để cập nhật
          </div>
        </div>
        <div class="p-3">
          <div class="flex items-center gap-5 mb-4">
            <div class="flex-grow">
              <h2 class="text-2xl font-extrabold text-gray-900 leading-tight">QUÝ ĐỨC</h2>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs font-bold text-gray-400 uppercase">Mã: 11001</span>
                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span class="text-xs font-bold text-emerald-600 uppercase">Thành công</span>
              </div>
            </div>
          </div>
          <div class="space-y-2 mb-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400 font-medium">Phụ huynh:</span>
              <span class="text-gray-800 font-bold">Nguyễn Đăng Thu Hà</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400 font-medium">Thời gian ra:</span>
              <span class="text-emerald-600 font-black text-lg">14:21:38</span>
            </div>
          </div>
        </div>
        <div class="flex gap-3 px-3 pb-3 mt-auto">
          <button class="stop-btn flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl text-xs tracking-widest active:scale-95 transition-transform">STOP</button>
          <button class="continue-btn flex-[2.5] py-4 bg-[#A11B4B] text-white font-black rounded-2xl text-xs tracking-[0.15em] uppercase btn-shadow active:scale-95 transition-all">QUÉT TIẾP</button>
        </div>
      </div>
    `;
  }

  setupEvents() {
    this.querySelector('.stop-btn')?.addEventListener('click', () => {
      console.log('Stop scan');
    });

    this.querySelector('.continue-btn')?.addEventListener('click', () => {
      console.log('Continue scan');
    });
  }
}

export default ScannerApp;
customElements.define('app-scanner', ScannerApp);
