import { API_URL } from '../config.js';
export const renderAccount = async (container) => {
  if (!window.currentUser) {
    window.location.hash = '#login';
    return;
  }

  const { name, email, role } = window.currentUser;

  container.innerHTML = `
    <div class="bg-gray-50 min-h-[80vh] py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900 flex items-center">
            <i class="fa-solid fa-user-gear text-maroon mr-3"></i> Manajemen Akun
          </h1>
          <a href="${role === 'client' ? '#dashboard' : '#admin'}" class="text-gray-600 hover:text-maroon font-medium">
            <i class="fa-solid fa-arrow-left mr-1"></i> Kembali ke Dasbor
          </a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Profile Card -->
          <div class="col-span-1">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-center p-6">
              <div class="w-24 h-24 mx-auto bg-maroon rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                ${name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <h2 class="text-xl font-bold text-gray-900">${name}</h2>
              <p class="text-gray-500 mb-2">${email}</p>
              <span class="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                ${role}
              </span>
            </div>

            ${role !== 'superadmin' ? `
            <div class="mt-6 bg-red-50 rounded-2xl border border-red-100 p-6 text-center">
              <h3 class="text-red-800 font-bold mb-2">Zona Berbahaya</h3>
              <p class="text-sm text-red-600 mb-4">Ingin menghapus akun Anda dan semua data terkait?</p>
              <button id="req-delete-btn" class="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg font-medium transition-colors text-sm shadow-md">
                Ajukan Hapus Akun
              </button>
              <div id="delete-alert" class="hidden mt-3 p-2 rounded text-xs text-center"></div>
            </div>
            ` : ''}
          </div>

          <!-- Settings -->
          <div class="col-span-1 md:col-span-2 space-y-6">
            
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-bold mb-6 flex items-center text-gray-800">
                <i class="fa-solid fa-key text-gray-400 mr-3"></i> Ubah Kata Sandi
              </h2>
              <div id="cp-alert" class="hidden p-3 mb-4 rounded-lg text-sm text-center"></div>
              
              <form id="cp-form" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Sandi Lama <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <input id="cp-old" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon sm:text-sm">
                    <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-maroon toggle-password" data-target="cp-old">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Sandi Baru <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <input id="cp-new" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon sm:text-sm">
                    <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-maroon toggle-password" data-target="cp-new">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div class="pt-2">
                  <button type="submit" id="cp-btn" class="bg-maroon text-white px-6 py-2 rounded-lg font-medium hover:bg-maroon-dark transition-colors shadow-sm">
                    Simpan Kata Sandi
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  `;

  // Toggle Password Logic
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });

  // Change Password Logic
  const cpForm = document.getElementById('cp-form');
  const cpAlert = document.getElementById('cp-alert');
  if (cpForm) {
    cpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('cp-btn');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
      btn.disabled = true;

      try {
        const res = await fetch(`${API_URL}/auth/change-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            oldPassword: document.getElementById('cp-old').value,
            newPassword: document.getElementById('cp-new').value
          })
        });
        const data = await res.json();
        
        if (res.ok) {
          cpAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-green-50 text-green-800 border border-green-200';
          cpAlert.textContent = data.message;
          cpForm.reset();
        } else {
          cpAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 text-red-800 border border-red-200';
          cpAlert.textContent = data.message;
        }
        cpAlert.classList.remove('hidden');
      } catch (err) {
        cpAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 text-red-800 border border-red-200';
        cpAlert.textContent = 'Gagal menghubungi server.';
        cpAlert.classList.remove('hidden');
      } finally {
        btn.innerHTML = 'Simpan Kata Sandi';
        btn.disabled = false;
      }
    });
  }

  // Request Delete Account Logic
  const reqDeleteBtn = document.getElementById('req-delete-btn');
  const deleteAlert = document.getElementById('delete-alert');
  if (reqDeleteBtn) {
    reqDeleteBtn.addEventListener('click', async () => {
      if (!confirm('Apakah Anda yakin ingin mengajukan penghapusan akun? Proses ini tidak dapat dibatalkan.')) return;
      
      reqDeleteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      reqDeleteBtn.disabled = true;

      try {
        const res = await fetch(`${API_URL}/account/request-delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        const data = await res.json();
        
        if (res.ok) {
          deleteAlert.className = 'mt-3 p-2 rounded text-xs text-center bg-green-100 text-green-800';
          deleteAlert.textContent = data.message;
          reqDeleteBtn.classList.add('hidden');
        } else {
          deleteAlert.className = 'mt-3 p-2 rounded text-xs text-center bg-red-100 text-red-800';
          deleteAlert.textContent = data.message;
          reqDeleteBtn.innerHTML = 'Ajukan Hapus Akun';
          reqDeleteBtn.disabled = false;
        }
        deleteAlert.classList.remove('hidden');
      } catch (err) {
        deleteAlert.className = 'mt-3 p-2 rounded text-xs text-center bg-red-100 text-red-800';
        deleteAlert.textContent = 'Gagal menghubungi server.';
        deleteAlert.classList.remove('hidden');
        reqDeleteBtn.innerHTML = 'Ajukan Hapus Akun';
        reqDeleteBtn.disabled = false;
      }
    });
  }
};
