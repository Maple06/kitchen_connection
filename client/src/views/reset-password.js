export const renderResetPassword = (container, query) => {
  const urlParams = new URLSearchParams(query);
  const token = urlParams.get('token');

  if (!token) {
    container.innerHTML = `
      <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <i class="fa-solid fa-circle-xmark text-red-500 text-6xl mb-6"></i>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
        <p class="text-gray-600 mb-6">Token reset kata sandi tidak ditemukan atau tidak valid.</p>
        <a href="#login" class="bg-maroon text-white px-6 py-2 rounded-lg font-bold">Kembali ke Login</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
        <div>
          <h2 class="text-center text-3xl font-extrabold text-gray-900">Atur Ulang Sandi</h2>
          <p class="mt-2 text-center text-sm text-gray-600">Masukkan kata sandi baru Anda di bawah ini.</p>
        </div>
        <div id="rp-alert" class="hidden p-3 rounded-lg text-sm text-center"></div>
        <form class="mt-8 space-y-6" id="rp-form">
          <input type="hidden" id="rp-token" value="${token}">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sandi Baru</label>
              <input id="rp-pass" type="password" required class="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-maroon focus:border-maroon sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Sandi Baru</label>
              <input id="rp-confirm" type="password" required class="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-maroon focus:border-maroon sm:text-sm">
            </div>
          </div>
          <div>
            <button type="submit" id="rp-btn" class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-maroon hover:bg-maroon-dark transition-colors shadow-md">
              Simpan Sandi Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = document.getElementById('rp-form');
  const alertBox = document.getElementById('rp-alert');

  if(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('rp-btn');
      
      const pass = document.getElementById('rp-pass').value;
      const confirm = document.getElementById('rp-confirm').value;
      const tokenVal = document.getElementById('rp-token').value;

      if (pass !== confirm) {
        alertBox.className = 'p-3 mb-4 rounded-lg bg-red-100 text-red-800';
        alertBox.textContent = 'Kata sandi tidak cocok.';
        alertBox.classList.remove('hidden');
        return;
      }

      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
      btn.disabled = true;

      try {
        const res = await fetch('http://localhost:5000/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenVal, newPassword: pass })
        });
        const data = await res.json();
        
        if (res.ok) {
          form.innerHTML = `
            <div class="text-center">
              <i class="fa-solid fa-check-circle text-green-500 text-5xl mb-4"></i>
              <p class="text-green-800 font-medium mb-6">Kata sandi berhasil diubah!</p>
              <a href="#login" class="bg-maroon text-white px-6 py-2 rounded-lg font-bold hover:bg-maroon-dark">Masuk Sekarang</a>
            </div>
          `;
          alertBox.classList.add('hidden');
        } else {
          alertBox.className = 'p-3 mb-4 rounded-lg bg-red-100 text-red-800';
          alertBox.textContent = data.message;
          alertBox.classList.remove('hidden');
          btn.innerHTML = 'Simpan Sandi Baru';
          btn.disabled = false;
        }
      } catch (error) {
        alertBox.className = 'p-3 mb-4 rounded-lg bg-red-100 text-red-800';
        alertBox.textContent = 'Gagal menghubungi server.';
        alertBox.classList.remove('hidden');
        btn.innerHTML = 'Simpan Sandi Baru';
        btn.disabled = false;
      }
    });
  }
};
