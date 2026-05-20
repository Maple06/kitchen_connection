import { API_URL } from '../config.js';
export const renderAdmin = async (container) => {
  // Check auth for admin or superadmin
  if (!window.currentUser || (window.currentUser.role !== 'admin' && window.currentUser.role !== 'superadmin')) {
    container.innerHTML = `
      <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <i class="fa-solid fa-lock text-6xl text-gray-300 mb-6"></i>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
        <p class="text-gray-600 mb-6">Anda membutuhkan hak akses administrator untuk melihat halaman ini.</p>
        <a href="#/" class="bg-maroon text-white px-6 py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors">Kembali ke Beranda</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="bg-gray-50 min-h-screen pb-12">
      <!-- Admin Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 flex items-center">
              <i class="fa-solid fa-screwdriver-wrench text-maroon mr-3"></i> Panel Kontrol Admin
            </h1>
            <p class="text-sm text-gray-500 mt-1">Mengelola proyek, pengguna, dan pengaturan sistem.</p>
          </div>
        </div>
      </div>
      
      <div id="admin-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div class="flex justify-center py-20"><i class="fa-solid fa-spinner fa-spin-pulse text-maroon text-4xl"></i></div>
      </div>
    </div>

    <!-- Modals -->
    <div id="project-modal" class="hidden fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900" id="pm-title">Tambah Proyek</h3>
          <button onclick="document.getElementById('project-modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div class="p-6">
          <div id="pm-alert" class="hidden p-3 mb-4 rounded-lg text-sm text-center"></div>
          <form id="pm-form" class="space-y-4">
            <input type="hidden" id="pm-id">
            <div id="pm-client-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">Klien <span class="text-red-500">*</span></label>
              <select id="pm-client" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
                <option value="">Pilih Klien...</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Proyek <span class="text-red-500">*</span></label>
              <input id="pm-project-title" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status (Fase) <span class="text-red-500">*</span></label>
              <select id="pm-status" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
                <option value="Konsultasi">Konsultasi (10%)</option>
                <option value="Desain">Desain (30%)</option>
                <option value="Pengadaan">Pengadaan (60%)</option>
                <option value="Pemasangan">Pemasangan (90%)</option>
                <option value="Selesai">Selesai (100%)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Person In Charge (PIC) <span class="text-red-500">*</span></label>
              <select id="pm-pic" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
                <option value="">Pilih Admin/Superadmin...</option>
              </select>
            </div>
            <div class="pt-4">
              <button type="submit" id="pm-btn" class="w-full bg-maroon text-white py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors">Simpan Proyek</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div id="doc-modal" class="hidden fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900 truncate" id="doc-modal-title">Unggah Dokumen Proyek</h3>
          <button onclick="document.getElementById('doc-modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div class="p-6">
          <div id="doc-alert" class="hidden p-3 mb-4 rounded-lg text-sm text-center"></div>
          
          <form id="doc-form" class="space-y-4">
            <input type="hidden" id="doc-project-id">
            <input type="hidden" id="doc-project-title">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Dokumen <span class="text-red-500">*</span></label>
              <input id="doc-title" type="text" placeholder="Contoh: Blueprint 2D" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sumber Dokumen</label>
              <div class="flex gap-4 mb-2">
                <label class="flex items-center text-sm">
                  <input type="radio" name="doc-source" value="file" checked class="mr-2 text-maroon focus:ring-maroon"> Unggah Berkas
                </label>
                <label class="flex items-center text-sm">
                  <input type="radio" name="doc-source" value="gdrive" class="mr-2 text-maroon focus:ring-maroon"> Tautan Google Drive
                </label>
              </div>
            </div>

            <div id="doc-file-container">
              <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Berkas (Max 10MB) <span class="text-red-500">*</span></label>
              <input id="doc-file" type="file" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>

            <div id="doc-link-container" class="hidden">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tautan Google Drive</label>
              <input id="doc-link" type="url" placeholder="https://drive.google.com/..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
              <p class="text-xs text-gray-500 mt-1">Pastikan akses diatur ke "Anyone with the link".</p>
            </div>

            <div class="pt-4">
              <button type="submit" id="doc-btn" class="w-full bg-maroon text-white py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors shadow-sm">Simpan Dokumen</button>
            </div>
          </form>

          <hr class="my-6 border-gray-200">
          <h4 class="text-md font-bold text-gray-900 mb-3">Dokumen Tersimpan</h4>
          <div id="doc-list-container" class="space-y-2 max-h-40 overflow-y-auto">
            <div class="text-sm text-gray-500 text-center py-4">Memuat dokumen...</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Equipments Modal -->
    <div id="equip-modal" class="hidden fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900" id="equip-modal-title">Tambah Peralatan</h3>
          <button onclick="document.getElementById('equip-modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <div id="equip-alert" class="hidden p-3 mb-4 rounded-lg text-sm text-center"></div>
          <form id="equip-form" class="space-y-4">
            <input type="hidden" id="eq-id">
            
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Alat <span class="text-red-500">*</span></label>
                <input id="eq-name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input id="eq-category" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                <input id="eq-type" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dimensi</label>
                <input id="eq-dimensions" type="text" placeholder="P x L x T" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Daya / Power</label>
                <input id="eq-power" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                <input id="eq-capacity" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar (Opsional)</label>
                <input id="eq-image" type="url" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
              </div>
              
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tambahan</label>
                <textarea id="eq-desc" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm"></textarea>
              </div>
            </div>

            <div class="pt-4">
              <button type="submit" id="equip-btn" class="w-full bg-maroon text-white py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors shadow-sm">Simpan Peralatan</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Create Client Modal -->
    <div id="create-client-modal" class="hidden fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900">Buat Akun Klien Baru</h3>
          <button onclick="document.getElementById('create-client-modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div class="p-6">
          <div id="cc-alert" class="hidden p-3 mb-4 rounded-lg text-sm text-center"></div>
          <form id="cc-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
              <input id="cc-name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
              <input id="cc-email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. Handphone (WhatsApp)</label>
              <input id="cc-phone" type="text" placeholder="628..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kata Sandi <span class="text-red-500">*</span></label>
              <input id="cc-pass" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div class="pt-2">
              <button type="submit" id="cc-btn" class="w-full bg-maroon text-white py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors">Buat Akun Klien</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Document Preview Modal -->
    <div id="preview-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] px-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900" id="preview-title">Pratinjau Dokumen</h3>
          <div class="flex items-center gap-4">
            <a id="preview-download-link" href="#" target="_blank" class="flex items-center text-white bg-maroon hover:bg-maroon-dark font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition-colors">
              <i class="fa-solid fa-download mr-2"></i> Unduh
            </a>
            <button onclick="document.getElementById('preview-modal').classList.add('hidden'); document.getElementById('preview-container').innerHTML='';" class="text-gray-400 hover:text-gray-600 ml-2">
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
        </div>
        <div class="flex-1 bg-gray-100 p-4 overflow-hidden relative" id="preview-container">
          <!-- Content injected here -->
        </div>
      </div>
    </div>
  `;


  try {
    const [resDash, resClients, resDelReq, resAdmins, resEq, resCalendar] = await Promise.all([
      fetch(`${API_URL}/dashboard/admin`, { credentials: 'include' }),
      fetch(`${API_URL}/users/clients`, { credentials: 'include' }),
      fetch(`${API_URL}/account/delete-requests`, { credentials: 'include' }),
      fetch(`${API_URL}/users/admins`, { credentials: 'include' }),
      fetch(`${API_URL}/equipments`, { credentials: 'include' }),
      fetch(`${API_URL}/settings/calendar`)
    ]);

    const data = await resDash.json();
    const clients = resClients.ok ? await resClients.json() : [];
    const deleteRequests = resDelReq.ok ? await resDelReq.json() : [];
    const admins = resAdmins.ok ? await resAdmins.json() : [];
    const equipments = resEq.ok ? await resEq.json() : [];
    const calendarSettings = resCalendar.ok ? await resCalendar.json() : { calendar_embed_url: '' };
    const currentCalendarUrl = calendarSettings.calendar_embed_url || '';

    // Setup modal client options
    const pmClientSelect = document.getElementById('pm-client');
    if (pmClientSelect && clients.length > 0) {
      clients.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.email})`;
        pmClientSelect.appendChild(opt);
      });
    }

    const pmPicSelect = document.getElementById('pm-pic');
    if (pmPicSelect && admins.length > 0) {
      admins.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = `${a.name} (${a.role.toUpperCase()})`;
        pmPicSelect.appendChild(opt);
      });
    }

    const content = document.getElementById('admin-content');
    if (!content) return;

    if (!resDash.ok) {
      content.innerHTML = `<div class="bg-red-50 border border-red-200 p-6 rounded-xl text-center"><p class="text-red-600">${data.message}</p></div>`;
      return;
    }

    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Overview -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-gray-500 font-medium text-sm mb-2">Total Proyek Aktif</h3>
            <p class="text-3xl font-bold text-gray-900">${data.stats.totalProjects}</p>
          </div>
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-gray-500 font-medium text-sm mb-2">Reservasi Menunggu</h3>
            <p class="text-3xl font-bold text-yellow-600">${data.stats.pendingReservations}</p>
          </div>
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-gray-500 font-medium text-sm mb-2">Total Katalog Alat</h3>
            <p class="text-3xl font-bold text-gray-900">${data.stats.totalEquipments}</p>
          </div>
        </div>

        ${window.currentUser.role === 'superadmin' ? `
        <div class="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 class="text-xl font-bold mb-4 flex items-center text-gray-900">
            <i class="fa-solid fa-user-shield text-maroon mr-3"></i> Tambah Akun Admin Baru
          </h2>
          <div id="ca-alert" class="hidden p-3 mb-4 rounded-lg text-sm text-center"></div>
          <form id="ca-form" class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
              <input id="ca-name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. Handphone <span class="text-red-500">*</span></label>
              <input id="ca-phone" type="text" required placeholder="628..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
              <input id="ca-email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kata Sandi <span class="text-red-500">*</span></label>
              <input id="ca-pass" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <button type="submit" id="ca-btn" class="w-full bg-maroon text-white py-2 rounded-lg font-medium hover:bg-maroon-dark transition-colors">Buat Admin</button>
            </div>
          </form>
        </div>
        ` : ''}

        ${deleteRequests.length > 0 ? `
        <div class="mt-8 bg-red-50 rounded-xl border border-red-200 p-6 shadow-sm">
          <h2 class="text-xl font-bold mb-4 flex items-center text-red-900">
            <i class="fa-solid fa-triangle-exclamation text-red-600 mr-3"></i> Permintaan Hapus Akun (${deleteRequests.length})
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-red-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Nama</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Peran</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-red-200">
                ${deleteRequests.map(req => `
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${req.name}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${req.email}</td>
                  <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 uppercase">${req.role}</span></td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded shadow-sm text-xs approve-del-btn" data-id="${req.id}" data-name="${req.name}">
                      Setujui & Hapus
                    </button>
                  </td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}

        <!-- Google Calendar Settings -->
        <div class="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 class="text-xl font-bold mb-1 flex items-center text-gray-900">
            <i class="fa-regular fa-calendar text-maroon mr-3"></i> Pengaturan Google Calendar
          </h2>
          <p class="text-sm text-gray-500 mb-4">Tautan embed ini akan ditampilkan pada halaman reservasi untuk semua pengguna.</p>
          <div id="cal-alert" class="hidden p-3 mb-4 rounded-lg text-sm"></div>
          <div class="flex gap-3 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">URL Embed Google Calendar</label>
              <input id="cal-url-input" type="url" value="${currentCalendarUrl}" placeholder="https://calendar.google.com/calendar/embed?src=..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
              <p class="text-xs text-gray-400 mt-1">Dapatkan dari: Google Calendar → Settings → Integrate calendar → salin nilai <code>src</code> dari kode embed.</p>
            </div>
            <button id="cal-save-btn" class="bg-maroon text-white px-5 py-2 rounded-lg font-medium hover:bg-maroon-dark transition-colors shadow-sm whitespace-nowrap">Simpan</button>
          </div>
        </div>

        <div class="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Daftar Proyek Klien</h2>
            <div class="flex gap-2">
              <button id="add-client-btn" class="bg-white border border-maroon text-maroon hover:bg-maroon hover:text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm font-medium">
                <i class="fa-solid fa-user-plus mr-1"></i> Buat Klien
              </button>
              <button id="add-project-btn" class="bg-maroon hover:bg-maroon-dark text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm font-medium">
                <i class="fa-solid fa-plus mr-1"></i> Proyek Baru
              </button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Proyek</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progres</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                ${data.projects.length === 0 ? '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">Belum ada proyek</td></tr>' : ''}
                ${data.projects.map(p => `
                <tr class="hover:bg-gray-50 transition-colors ${p.archived_at ? 'opacity-40 grayscale' : ''}">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${p.client_name}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${p.title}
                    <div class="text-xs text-gray-400 mt-1"><i class="fa-solid fa-user-tie mr-1"></i> ${p.pic_name || 'Belum ada PIC'}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">${p.status}</span>
                    ${p.archived_at ? '<span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-600">Diarsipkan</span>' : ''}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="text-xs font-medium text-gray-700 mr-2">${p.progress_percentage}%</span>
                      <div class="w-full bg-gray-200 rounded-full h-1.5 w-24">
                        <div class="bg-maroon h-1.5 rounded-full" style="width: ${p.progress_percentage}%"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-4 edit-project-btn" 
                      data-id="${p.id}" 
                      data-title="${p.title}" 
                      data-status="${p.status}" 
                      data-pic="${p.pic_id || ''}"
                      data-calendar="${p.calendar_link || ''}">Edit</button>
                    <button class="text-green-600 hover:text-green-900 mr-4 upload-doc-btn" data-id="${p.id}" data-title="${p.title}"><i class="fa-solid fa-paperclip"></i> Dokumen</button>
                    ${!p.archived_at ? `<button class="text-red-600 hover:text-red-900 delete-project-btn" data-id="${p.id}">Arsipkan</button>` : ''}
                  </td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Katalog Peralatan Dapur</h2>
            <button id="add-equip-btn" class="bg-maroon hover:bg-maroon-dark text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm font-medium">
              <i class="fa-solid fa-plus mr-1"></i> Tambah Alat
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Alat</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                ${equipments.length === 0 ? '<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">Belum ada peralatan di katalog</td></tr>' : ''}
                ${equipments.map(eq => `
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                    ${eq.image_url ? `<img src="${eq.image_url}" class="h-10 w-10 rounded-lg object-cover mr-3 border border-gray-200">` : '<div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 border border-gray-200 text-gray-400"><i class="fa-solid fa-image"></i></div>'}
                    ${eq.name}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${eq.category || '-'}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${eq.type || '-'}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-4 edit-equip-btn" 
                      data-eq='${JSON.stringify(eq).replace(/'/g, "&apos;")}'>Edit</button>
                    <button class="text-red-600 hover:text-red-900 delete-equip-btn" data-id="${eq.id}">Hapus</button>
                  </td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
    `;

    // Add Admin Form Logic (Superadmin only)
    const caForm = document.getElementById('ca-form');
    if (caForm) {
      caForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('ca-btn');
        const alertBox = document.getElementById('ca-alert');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;

        try {
          const res = await fetch(`${API_URL}/admin/create-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              name: document.getElementById('ca-name').value,
              email: document.getElementById('ca-email').value,
              password: document.getElementById('ca-pass').value,
              phone_number: document.getElementById('ca-phone').value.replace(/[^0-9]/g, '').replace(/^0/, '62')
            })
          });
          const data = await res.json();
          if (res.ok) {
            alertBox.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-green-50 border border-green-200 text-green-800';
            alertBox.textContent = data.message;
            caForm.reset();
          } else {
            alertBox.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
            alertBox.textContent = data.message;
          }
          alertBox.classList.remove('hidden');
        } catch (err) {
          alertBox.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
          alertBox.textContent = 'Gagal menghubungi server.';
          alertBox.classList.remove('hidden');
        } finally {
          btn.innerHTML = 'Buat Admin';
          btn.disabled = false;
        }
      });
    }

    // Calendar Settings Logic
    const calSaveBtn = document.getElementById('cal-save-btn');
    if (calSaveBtn) {
      calSaveBtn.addEventListener('click', async () => {
        const urlInput = document.getElementById('cal-url-input');
        const alertBox = document.getElementById('cal-alert');
        calSaveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        calSaveBtn.disabled = true;

        try {
          const res = await fetch(`${API_URL}/settings/calendar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ calendar_embed_url: urlInput.value.trim() })
          });
          const data = await res.json();
          alertBox.className = `p-3 mb-4 rounded-lg text-sm ${res.ok ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`;
          alertBox.textContent = data.message;
          alertBox.classList.remove('hidden');
        } catch (err) {
          alertBox.className = 'p-3 mb-4 rounded-lg text-sm bg-red-50 border border-red-200 text-red-800';
          alertBox.textContent = 'Gagal menghubungi server.';
          alertBox.classList.remove('hidden');
        } finally {
          calSaveBtn.innerHTML = 'Simpan';
          calSaveBtn.disabled = false;
        }
      });
    }

    // Create Client Modal Logic
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) {
      addClientBtn.addEventListener('click', () => {
        document.getElementById('cc-form').reset();
        document.getElementById('cc-alert').classList.add('hidden');
        document.getElementById('create-client-modal').classList.remove('hidden');
      });
    }

    const ccForm = document.getElementById('cc-form');
    if (ccForm) {
      ccForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('cc-btn');
        const alertBox = document.getElementById('cc-alert');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
        btn.disabled = true;

        try {
          const rawPhone = document.getElementById('cc-phone').value;
          const cleanPhone = rawPhone.replace(/[^0-9]/g, '').replace(/^0/, '62') || null;

          const res = await fetch(`${API_URL}/admin/create-client`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              name: document.getElementById('cc-name').value,
              email: document.getElementById('cc-email').value,
              password: document.getElementById('cc-pass').value,
              phone_number: cleanPhone
            })
          });
          const data = await res.json();
          if (res.ok) {
            alertBox.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-green-50 border border-green-200 text-green-800';
            alertBox.textContent = data.message;
            ccForm.reset();
          } else {
            alertBox.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
            alertBox.textContent = data.message;
          }
          alertBox.classList.remove('hidden');
        } catch (err) {
          alertBox.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
          alertBox.textContent = 'Gagal menghubungi server.';
          alertBox.classList.remove('hidden');
        } finally {
          btn.innerHTML = 'Buat Akun Klien';
          btn.disabled = false;
        }
      });
    }

    // Approve Delete Requests
    document.querySelectorAll('.approve-del-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        const name = e.target.getAttribute('data-name');

        if (!confirm(`PERINGATAN: Apakah Anda yakin ingin MENGHAPUS PERMANEN akun ${name} beserta seluruh datanya?`)) return;

        e.target.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        e.target.disabled = true;

        try {
          const res = await fetch(`${API_URL}/account/${id}`, {
            method: `DELETE`,
            credentials: 'include'
          });
          if (res.ok) {
            alert('Akun berhasil dihapus.');
            renderAdmin(document.getElementById('app-content'));
          } else {
            const data = await res.json();
            alert('Gagal: ' + data.message);
            e.target.innerHTML = 'Setujui & Hapus';
            e.target.disabled = false;
          }
        } catch (error) {
          alert('Terjadi kesalahan server.');
          e.target.innerHTML = 'Setujui & Hapus';
          e.target.disabled = false;
        }
      });
    });

    // Project Modal Logic
    const pmModal = document.getElementById('project-modal');
    const pmForm = document.getElementById('pm-form');
    const pmAlert = document.getElementById('pm-alert');
    const pmTitleLabel = document.getElementById('pm-title');
    const pmClientGroup = document.getElementById('pm-client-group');
    const btnAddProject = document.getElementById('add-project-btn');

    if (btnAddProject) {
      btnAddProject.addEventListener('click', () => {
        pmForm.reset();
        document.getElementById('pm-id').value = '';
        pmTitleLabel.textContent = 'Tambah Proyek Baru';
        pmClientGroup.classList.remove('hidden');
        document.getElementById('pm-client').required = true;
        pmAlert.classList.add('hidden');
        pmModal.classList.remove('hidden');
      });
    }

    document.querySelectorAll('.edit-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const title = e.target.getAttribute('data-title');
        const status = e.target.getAttribute('data-status');
        const pic = e.target.getAttribute('data-pic');

        pmForm.reset();
        document.getElementById('pm-id').value = id;
        document.getElementById('pm-project-title').value = title;
        document.getElementById('pm-status').value = status;
        document.getElementById('pm-pic').value = pic;

        pmTitleLabel.textContent = 'Edit Proyek';
        pmClientGroup.classList.add('hidden');
        document.getElementById('pm-client').required = false;

        pmAlert.classList.add('hidden');
        pmModal.classList.remove('hidden');
      });
    });

    document.querySelectorAll('.delete-project-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (!confirm('Arsipkan proyek ini? Proyek akan disembunyikan dari status aktif.')) return;

        try {
          const res = await fetch(`${API_URL}/projects/${id}`, {
            method: `DELETE`,
            credentials: 'include'
          });
          if (res.ok) {
            renderAdmin(document.getElementById('app-content'));
          } else {
            const data = await res.json();
            alert('Gagal: ' + data.message);
          }
        } catch (error) {
          alert('Terjadi kesalahan server.');
        }
      });
    });

    if (pmForm) {
      pmForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('pm-btn');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const id = document.getElementById('pm-id').value;
        const isEdit = id !== '';

        const payload = {
          title: document.getElementById('pm-project-title').value,
          status: document.getElementById('pm-status').value,
          pic_id: document.getElementById('pm-pic').value || null
        };

        if (!isEdit) {
          payload.client_id = document.getElementById('pm-client').value;
        }

        try {
          const res = await fetch(`${API_URL}/projects${isEdit ? '/' + id : ''}`, {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (res.ok) {
            pmModal.classList.add('hidden');
            renderAdmin(document.getElementById('app-content'));
          } else {
            pmAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
            pmAlert.textContent = data.message;
            pmAlert.classList.remove('hidden');
          }
        } catch (error) {
          pmAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
          pmAlert.textContent = 'Gagal menghubungi server.';
          pmAlert.classList.remove('hidden');
        } finally {
          btn.innerHTML = 'Simpan Proyek';
          btn.disabled = false;
        }
      });
    }

    // Document Modal Logic
    const docModal = document.getElementById('doc-modal');
    const docForm = document.getElementById('doc-form');
    const docAlert = document.getElementById('doc-alert');

    const loadProjectDocuments = async (projectId) => {
      const container = document.getElementById('doc-list-container');
      container.innerHTML = '<div class="text-sm text-gray-500 text-center py-4"><i class="fa-solid fa-spinner fa-spin"></i> Memuat...</div>';
      try {
        const res = await fetch(`${API_URL}/projects/${projectId}/documents`, { credentials: 'include' });
        const docs = await res.json();
        
        if (docs.length === 0) {
          container.innerHTML = '<div class="text-sm text-gray-500 text-center py-4">Belum ada dokumen tersimpan.</div>';
          return;
        }

        container.innerHTML = docs.map(d => `
          <div class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-3 overflow-hidden">
              <i class="fa-solid ${d.type === 'gdrive' ? 'fa-brands fa-google-drive text-green-600' : (d.type === 'image' ? 'fa-image text-blue-500' : 'fa-file-pdf text-red-500')} text-lg"></i>
              <div class="text-sm font-medium text-gray-900 truncate">${d.title}</div>
            </div>
            <div class="flex items-center gap-3 ml-4">
              <button class="text-gray-400 hover:text-maroon preview-doc-btn" data-url="${d.file_path}" data-title="${d.title}" data-type="${d.type}" title="Pratinjau">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="text-gray-400 hover:text-blue-600 dl-doc-btn" data-id="${d.id}" data-title="${d.title}" data-type="${d.type}" data-url="${d.file_path}" title="Unduh">
                <i class="fa-solid fa-download"></i>
              </button>
              <button class="text-red-400 hover:text-red-700 del-doc-btn" data-id="${d.id}" data-pid="${projectId}" title="Hapus">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('');

        document.querySelectorAll('.preview-doc-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            const title = btn.getAttribute('data-title');
            const type = btn.getAttribute('data-type');
            document.getElementById('preview-title').textContent = title;
            document.getElementById('preview-download-link').href = url;
            const container = document.getElementById('preview-container');
            if (type === 'gdrive') {
              container.innerHTML = `<iframe src="${url}" class="w-full h-full border-0"></iframe>`;
            } else if (type === 'other' || url.endsWith('.pdf')) {
              container.innerHTML = `<iframe src="${url}" class="w-full h-full border-0"></iframe>`;
            } else {
              container.innerHTML = `<img src="${url}" class="max-h-full mx-auto object-contain" alt="${title}">`;
            }
            document.getElementById('preview-modal').classList.remove('hidden');
          });
        });

        document.querySelectorAll('.dl-doc-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const docId = btn.getAttribute('data-id');
            const title = btn.getAttribute('data-title');
            const type = btn.getAttribute('data-type');
            const url = btn.getAttribute('data-url');
            if (type === 'gdrive') { window.open(url, '_blank'); return; }
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            try {
              const res = await fetch(`${API_URL}/documents/${docId}/download`, { credentials: 'include' });
              if (!res.ok) throw new Error('Gagal mengunduh.');
              const blob = await res.blob();
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = title || 'dokumen';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(a.href);
            } catch (err) {
              alert('Gagal mengunduh berkas: ' + err.message);
            } finally {
              btn.innerHTML = '<i class="fa-solid fa-download"></i>';
            }
          });
        });

        document.querySelectorAll('.del-doc-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            if(!confirm('Hapus dokumen ini? File juga akan dihapus dari penyimpanan.')) return;
            const docId = e.currentTarget.getAttribute('data-id');
            const pId = e.currentTarget.getAttribute('data-pid');
            try {
              const dRes = await fetch(`${API_URL}/documents/${docId}`, { method: 'DELETE', credentials: 'include' });
              if(dRes.ok) loadProjectDocuments(pId);
              else alert('Gagal menghapus dokumen.');
            } catch(err) {
              alert('Terjadi kesalahan.');
            }
          });
        });
      } catch (error) {
        container.innerHTML = '<div class="text-sm text-red-500 text-center py-4">Gagal memuat dokumen.</div>';
      }
    };

    document.querySelectorAll('.upload-doc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('button').getAttribute('data-id');
        const title = e.target.closest('button').getAttribute('data-title');
        
        document.getElementById('doc-modal-title').textContent = `Dokumen: ${title}`;
        
        docForm.reset();
        document.getElementById('doc-project-id').value = id;
        document.getElementById('doc-project-title').value = title;
        docAlert.classList.add('hidden');
        docModal.classList.remove('hidden');
        
        loadProjectDocuments(id);
      });
    });

    
    // Document Source Toggle
    document.querySelectorAll('input[name="doc-source"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'file') {
          document.getElementById('doc-file-container').classList.remove('hidden');
          document.getElementById('doc-file').required = true;
          document.getElementById('doc-link-container').classList.add('hidden');
          document.getElementById('doc-link').required = false;
        } else {
          document.getElementById('doc-file-container').classList.add('hidden');
          document.getElementById('doc-file').required = false;
          document.getElementById('doc-link-container').classList.remove('hidden');
          document.getElementById('doc-link').required = true;
        }
      });
    });

    if (docForm) {
      docForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('doc-btn');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;
        docAlert.classList.add('hidden');

        const source = document.querySelector('input[name="doc-source"]:checked').value;
        const fileInput = document.getElementById('doc-file');
        const linkInput = document.getElementById('doc-link');

        // Validation
        if (source === 'file' && fileInput.files[0]) {
          if (fileInput.files[0].size > 10 * 1024 * 1024) { // 10MB
            docAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
            docAlert.innerHTML = 'Ukuran berkas melebihi batas 10MB. Harap kompres atau gunakan tautan Google Drive.';
            docAlert.classList.remove('hidden');
            btn.innerHTML = 'Simpan Dokumen';
            btn.disabled = false;
            return;
          }
        }

        if (source === 'gdrive') {
          // Validate Drive Link before proceeding
          try {
            const valRes = await fetch(`${API_URL}/documents/validate-drive`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ link: linkInput.value })
            });
            const valData = await valRes.json();
            if (!valRes.ok) {
              docAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
              docAlert.innerHTML = '<i class="fa-solid fa-lock mb-2 text-2xl"></i><br/>' + valData.message;
              docAlert.classList.remove('hidden');
              btn.innerHTML = 'Simpan Dokumen';
              btn.disabled = false;
              return;
            }
          } catch (err) {
             // network error, ignore validation or show error
          }
        }

        const formData = new FormData();
        formData.append('project_id', document.getElementById('doc-project-id').value);
        formData.append('project_title', document.getElementById('doc-project-title').value);
        formData.append('document_title', document.getElementById('doc-title').value);
        
        if (source === 'file') {
          formData.append('document', fileInput.files[0]);
        } else {
          formData.append('drive_link', linkInput.value);
        }

        try {
          const res = await fetch(`${API_URL}/documents`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });
          const data = await res.json();
          if (res.ok) {
            docForm.reset();
            const projectId = document.getElementById('doc-project-id').value;
            loadProjectDocuments(projectId);
            docAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-green-50 border border-green-200 text-green-800';
            docAlert.textContent = 'Dokumen berhasil diunggah.';
            docAlert.classList.remove('hidden');
          } else {
            docAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
            docAlert.textContent = data.message;
            docAlert.classList.remove('hidden');
          }
        } catch (error) {
          docAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
          docAlert.textContent = 'Gagal menghubungi server.';
          docAlert.classList.remove('hidden');
        } finally {
          btn.innerHTML = 'Simpan Dokumen';
          btn.disabled = false;
        }
      });
    }

    // Equipments Logic
    const equipModal = document.getElementById('equip-modal');
    const equipForm = document.getElementById('equip-form');
    const equipAlert = document.getElementById('equip-alert');
    const equipTitle = document.getElementById('equip-modal-title');

    document.getElementById('add-equip-btn')?.addEventListener('click', () => {
      equipForm.reset();
      document.getElementById('eq-id').value = '';
      equipTitle.textContent = 'Tambah Peralatan';
      equipAlert.classList.add('hidden');
      equipModal.classList.remove('hidden');
    });

    document.querySelectorAll('.edit-equip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const eqStr = e.target.getAttribute('data-eq');
        if (!eqStr) return;
        const eq = JSON.parse(eqStr.replace(/&apos;/g, "'"));
        
        equipForm.reset();
        document.getElementById('eq-id').value = eq.id;
        document.getElementById('eq-name').value = eq.name;
        document.getElementById('eq-category').value = eq.category || '';
        document.getElementById('eq-type').value = eq.type || '';
        document.getElementById('eq-dimensions').value = eq.dimensions || '';
        document.getElementById('eq-power').value = eq.power || '';
        document.getElementById('eq-capacity').value = eq.capacity || '';
        document.getElementById('eq-image').value = eq.image_url || '';
        document.getElementById('eq-desc').value = eq.description || '';
        
        equipTitle.textContent = 'Edit Peralatan';
        equipAlert.classList.add('hidden');
        equipModal.classList.remove('hidden');
      });
    });

    document.querySelectorAll('.delete-equip-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (!confirm('Hapus peralatan ini dari katalog?')) return;
        
        try {
          const res = await fetch(`${API_URL}/equipments/${id}`, { method: 'DELETE', credentials: 'include' });
          if(res.ok) renderAdmin(document.getElementById('app-content'));
          else alert('Gagal menghapus peralatan.');
        } catch(err) {
          alert('Terjadi kesalahan server.');
        }
      });
    });

    if (equipForm) {
      equipForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('equip-btn');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const id = document.getElementById('eq-id').value;
        const isEdit = id !== '';
        
        const payload = {
          name: document.getElementById('eq-name').value,
          category: document.getElementById('eq-category').value,
          type: document.getElementById('eq-type').value,
          dimensions: document.getElementById('eq-dimensions').value,
          power: document.getElementById('eq-power').value,
          capacity: document.getElementById('eq-capacity').value,
          image_url: document.getElementById('eq-image').value,
          description: document.getElementById('eq-desc').value
        };

        try {
          const res = await fetch(`${API_URL}/equipments${isEdit ? '/' + id : ''}`, {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok) {
            equipModal.classList.add('hidden');
            renderAdmin(document.getElementById('app-content'));
          } else {
            equipAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
            equipAlert.textContent = data.message;
            equipAlert.classList.remove('hidden');
          }
        } catch (error) {
          equipAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 border border-red-200 text-red-800';
          equipAlert.textContent = 'Gagal menghubungi server.';
          equipAlert.classList.remove('hidden');
        } finally {
          btn.innerHTML = 'Simpan Peralatan';
          btn.disabled = false;
        }
      });
    }

  } catch (error) {
    const content = document.getElementById('admin-content');
    if (content) content.innerHTML = '<div class="bg-red-50 border border-red-200 p-6 rounded-xl text-center"><p class="text-red-600">Gagal terhubung ke server.</p></div>';
  }
};
