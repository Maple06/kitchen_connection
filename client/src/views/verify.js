import { API_URL } from '../config.js';
export const renderVerify = async (container, query) => {
  container.innerHTML = `
    <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <i class="fa-solid fa-spinner fa-spin text-maroon text-6xl mb-6" id="verify-icon"></i>
      <h1 class="text-3xl font-bold text-gray-900 mb-2" id="verify-title">Memverifikasi Akun...</h1>
      <p class="text-gray-600 mb-6" id="verify-msg">Mohon tunggu sebentar.</p>
      <a href="#login" class="bg-maroon text-white px-6 py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors hidden" id="verify-btn">Masuk Sekarang</a>
    </div>
  `;

  const urlParams = new URLSearchParams(query);
  const token = urlParams.get('token');

  const icon = document.getElementById('verify-icon');
  const title = document.getElementById('verify-title');
  const msg = document.getElementById('verify-msg');
  const btn = document.getElementById('verify-btn');

  if (!token) {
    icon.className = "fa-solid fa-circle-xmark text-red-500 text-6xl mb-6";
    title.textContent = "Verifikasi Gagal";
    msg.textContent = "Tautan tidak valid atau tidak lengkap.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    const data = await res.json();

    if (res.ok) {
      icon.className = "fa-solid fa-circle-check text-green-500 text-6xl mb-6";
      title.textContent = "Berhasil";
      msg.textContent = "Akun Anda telah berhasil diverifikasi!";
      btn.classList.remove('hidden');
    } else {
      icon.className = "fa-solid fa-circle-xmark text-red-500 text-6xl mb-6";
      title.textContent = "Verifikasi Gagal";
      msg.textContent = data.message;
    }
  } catch (error) {
    icon.className = "fa-solid fa-circle-xmark text-red-500 text-6xl mb-6";
    title.textContent = "Error";
    msg.textContent = "Gagal terhubung ke server.";
  }
};
