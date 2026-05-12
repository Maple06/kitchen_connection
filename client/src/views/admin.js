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
    <div id="project-modal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 px-4">
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Klien</label>
              <select id="pm-client" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
                <option value="">Pilih Klien...</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Proyek</label>
              <input id="pm-project-title" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status (Fase)</label>
              <input id="pm-status" type="text" required placeholder="Contoh: Desain Tata Letak" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Progres (%)</label>
              <input id="pm-progress" type="number" min="0" max="100" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div class="pt-4">
              <button type="submit" id="pm-btn" class="w-full bg-maroon text-white py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors">Simpan Proyek</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div id="doc-modal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900">Unggah Dokumen Proyek</h3>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Dokumen</label>
              <input id="doc-title" type="text" placeholder="Contoh: Blueprint 2D" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Berkas</label>
              <input id="doc-file" type="file" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div class="pt-4">
              <button type="submit" id="doc-btn" class="w-full bg-maroon text-white py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors shadow-sm">Unggah</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  try {
    const [resDash, resClients, resDelReq] = await Promise.all([
      fetch('http://localhost:5000/api/dashboard/admin', { credentials: 'include' }),
      fetch('http://localhost:5000/api/users/clients', { credentials: 'include' }),
      fetch('http://localhost:5000/api/account/delete-requests', { credentials: 'include' })
    ]);

    const data = await resDash.json();
    const clients = resClients.ok ? await resClients.json() : [];
    const deleteRequests = resDelReq.ok ? await resDelReq.json() : [];

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
          <form id="ca-form" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input id="ca-name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="ca-email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
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

        <div class="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Daftar Proyek Klien</h2>
            <button id="add-project-btn" class="bg-maroon hover:bg-maroon-dark text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm font-medium">
              <i class="fa-solid fa-plus mr-1"></i> Proyek Baru
            </button>
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
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${p.client_name}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${p.title}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">${p.status}</span>
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
                      data-progress="${p.progress_percentage}">Edit</button>
                    <button class="text-green-600 hover:text-green-900 mr-4 upload-doc-btn" data-id="${p.id}" data-title="${p.title}"><i class="fa-solid fa-paperclip"></i> Dokumen</button>
                    <button class="text-red-600 hover:text-red-900 delete-project-btn" data-id="${p.id}">Hapus</button>
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
          const res = await fetch('http://localhost:5000/api/admin/create-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              name: document.getElementById('ca-name').value,
              email: document.getElementById('ca-email').value,
              password: document.getElementById('ca-pass').value
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

    // Approve Delete Requests
    document.querySelectorAll('.approve-del-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        const name = e.target.getAttribute('data-name');

        if (!confirm(`PERINGATAN: Apakah Anda yakin ingin MENGHAPUS PERMANEN akun ${name} beserta seluruh datanya?`)) return;

        e.target.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        e.target.disabled = true;

        try {
          const res = await fetch(`http://localhost:5000/api/account/${id}`, {
            method: 'DELETE',
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
        const progress = e.target.getAttribute('data-progress');

        pmForm.reset();
        document.getElementById('pm-id').value = id;
        document.getElementById('pm-project-title').value = title;
        document.getElementById('pm-status').value = status;
        document.getElementById('pm-progress').value = progress;

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
        if (!confirm('Hapus proyek ini secara permanen?')) return;

        try {
          const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
            method: 'DELETE',
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
          progress_percentage: parseInt(document.getElementById('pm-progress').value)
        };

        if (!isEdit) {
          payload.client_id = document.getElementById('pm-client').value;
        }

        try {
          const res = await fetch(`http://localhost:5000/api/projects${isEdit ? '/' + id : ''}`, {
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

    document.querySelectorAll('.upload-doc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('button').getAttribute('data-id');
        const title = e.target.closest('button').getAttribute('data-title');
        
        docForm.reset();
        document.getElementById('doc-project-id').value = id;
        document.getElementById('doc-project-title').value = title;
        docAlert.classList.add('hidden');
        docModal.classList.remove('hidden');
      });
    });

    if (docForm) {
      docForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('doc-btn');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const formData = new FormData();
        formData.append('project_id', document.getElementById('doc-project-id').value);
        formData.append('project_title', document.getElementById('doc-project-title').value);
        formData.append('document_title', document.getElementById('doc-title').value);
        formData.append('document', document.getElementById('doc-file').files[0]);

        try {
          const res = await fetch('http://localhost:5000/api/documents', {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });
          const data = await res.json();
          if (res.ok) {
            docModal.classList.add('hidden');
            renderAdmin(document.getElementById('app-content'));
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
          btn.innerHTML = 'Unggah';
          btn.disabled = false;
        }
      });
    }

  } catch (error) {
    const content = document.getElementById('admin-content');
    if (content) content.innerHTML = '<div class="bg-red-50 border border-red-200 p-6 rounded-xl text-center"><p class="text-red-600">Gagal terhubung ke server.</p></div>';
  }
};
