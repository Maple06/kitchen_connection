export const renderDashboard = async (container) => {
  // Check global auth
  if (!window.currentUser || window.currentUser.role !== 'client') {
    window.location.hash = '#login';
    return;
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
      window.currentUser = null;
      window.dispatchEvent(new Event('hashchange')); // trigger router to re-check
    } catch (error) {
      console.error(error);
    }
  };

  window.logout = handleLogout;

  container.innerHTML = `
    <div class="bg-gray-50 min-h-screen pb-12">
      <!-- Dashboard Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Selamat datang kembali, ${window.currentUser.name}</h1>
            <p class="text-sm text-gray-500">Dasbor Klien</p>
          </div>
          <button onclick="window.logout()" class="text-gray-600 hover:text-maroon font-medium border border-gray-300 rounded-lg px-4 py-2 hover:border-maroon transition-colors">
            <i class="fa-solid fa-right-from-bracket mr-2"></i>Keluar
          </button>
        </div>
      </div>

      <div id="dashboard-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        <div class="flex justify-center py-20"><i class="fa-solid fa-spinner fa-spin-pulse text-maroon text-4xl"></i></div>
      </div>
    </div>
  `;

  try {
    const res = await fetch('http://localhost:5000/api/dashboard/client', { credentials: 'include' });
    const data = await res.json();
    
    const content = document.getElementById('dashboard-content');
    if (!content) return;

    if (!res.ok) {
      content.innerHTML = `<div class="bg-red-50 p-6 rounded-xl text-center"><p class="text-red-500">${data.message}</p></div>`;
      return;
    }

    const project = data.projects && data.projects.length > 0 ? data.projects[0] : null;

    if (!project) {
      content.innerHTML = `
        <div class="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
          <i class="fa-solid fa-folder-plus text-maroon text-6xl mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Mulai Proyek Pertama Anda</h2>
          <p class="text-gray-600 mb-6">Ajukan konsultasi dan buat proyek dapur impian Anda bersama kami.</p>
          <form id="req-project-form" class="max-w-md mx-auto space-y-4 text-left">
            <div id="rp-alert" class="hidden p-3 rounded-lg text-sm text-center"></div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Proyek Impian</label>
              <input id="rp-title" type="text" placeholder="Contoh: Renovasi Dapur Utama" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
            </div>
            <button type="submit" id="rp-btn" class="w-full bg-maroon text-white py-3 rounded-lg font-bold hover:bg-maroon-dark transition-colors shadow-sm">
              Ajukan Proyek & Jadwalkan Konsultasi
            </button>
          </form>
        </div>
      `;
    } else {
      content.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content Area -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Progress Card -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-6 flex items-center"><i class="fa-solid fa-bars-progress text-maroon mr-3"></i> Status Proyek: ${project.title}</h2>
            
            <div class="mb-4 flex justify-between text-sm font-medium">
              <span class="text-maroon">Fase Saat Ini: ${project.status}</span>
              <span class="text-gray-600">${project.progress_percentage}% Selesai</span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div class="bg-maroon h-3 rounded-full" style="width: ${project.progress_percentage}%"></div>
            </div>

            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-1">
                  <i class="fa-solid fa-check"></i>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-bold text-gray-900">Konsultasi Awal</h4>
                  <p class="text-sm text-gray-500">Kebutuhan dikumpulkan dan kontrak ditandatangani.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full ${project.progress_percentage >= 30 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center mt-1">
                  <i class="fa-solid ${project.progress_percentage >= 30 ? 'fa-check' : 'fa-clock'}"></i>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-bold text-gray-900">Desain & Tata Letak Dapur</h4>
                  <p class="text-sm text-gray-500">Denah 2D dan mockup 3D disetujui.</p>
                </div>
              </div>
              <div class="flex items-start relative">
                ${project.progress_percentage === 65 ? '<div class="absolute top-2 left-2 w-4 h-4 bg-maroon rounded-full animate-ping opacity-75"></div>' : ''}
                <div class="flex-shrink-0 w-8 h-8 rounded-full ${project.progress_percentage >= 65 ? (project.progress_percentage === 65 ? 'bg-maroon-light/20 text-maroon' : 'bg-green-100 text-green-600') : 'bg-gray-100 text-gray-400'} flex items-center justify-center mt-1 relative z-10">
                  <i class="fa-solid ${project.progress_percentage >= 65 ? (project.progress_percentage === 65 ? 'fa-spinner fa-spin-pulse' : 'fa-check') : 'fa-clock'}"></i>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-bold ${project.progress_percentage === 65 ? 'text-maroon' : 'text-gray-900'}">Pengadaan Peralatan</h4>
                  <p class="text-sm text-gray-600">Memesan dan menunggu kedatangan alat.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full ${project.progress_percentage >= 100 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center mt-1">
                  <i class="fa-solid ${project.progress_percentage >= 100 ? 'fa-check' : 'fa-clock'}"></i>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-bold text-gray-500">Instalasi & Serah Terima</h4>
                  <p class="text-sm text-gray-400">Pemasangan alat di lokasi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Area -->
        <div class="space-y-8">
          
          <!-- Documents Card -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-6 flex items-center"><i class="fa-solid fa-folder-open text-maroon mr-3"></i> Dokumen Proyek</h2>
            
            <ul class="space-y-4">
              ${data.documents.length === 0 ? '<li class="text-gray-500 text-sm">Tidak ada dokumen</li>' : 
                data.documents.map(doc => {
                  const fileName = doc.file_path.split('/').pop();
                  return `
                  <li class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-maroon transition-colors group cursor-pointer">
                    <div class="flex items-center flex-1 min-w-0 mr-4">
                      <i class="fa-solid ${doc.type === 'blueprint' ? 'fa-file-pdf text-red-500' : (doc.type === 'invoice' ? 'fa-file-invoice-dollar text-green-500' : 'fa-file text-blue-500')} text-2xl mr-3 flex-shrink-0"></i>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900 truncate" title="${doc.title}">${doc.title}</p>
                        <p class="text-xs text-gray-500 truncate" title="${fileName}">${fileName}</p>
                      </div>
                    </div>
                    <a href="http://localhost:5000${doc.file_path}" target="_blank" class="text-gray-400 group-hover:text-maroon flex-shrink-0" title="Unduh Berkas"><i class="fa-solid fa-download"></i></a>
                  </li>
                  `;
                }).join('')
              }
            </ul>
          </div>

          <!-- Contact Team Card -->
          <div class="bg-maroon text-white p-6 rounded-xl shadow-md">
            <h2 class="text-xl font-bold mb-4">Butuh Bantuan?</h2>
            <p class="text-sm text-gray-200 mb-6">Hubungi manajer proyek Anda untuk pertanyaan seputar progres.</p>
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-maroon text-xl mr-4">
                <i class="fa-solid fa-user-tie"></i>
              </div>
              <div>
                <p class="font-bold">Budi Santoso</p>
                <p class="text-xs text-gray-300">Manajer Proyek</p>
              </div>
            </div>
            <button class="w-full bg-white text-maroon py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              <i class="fa-brands fa-whatsapp mr-2"></i> Chat di WhatsApp
            </button>
          </div>

        </div>
      </div>
    `;
    } // End of else project

    // Request Project Logic
    const rpForm = document.getElementById('req-project-form');
    const rpAlert = document.getElementById('rp-alert');
    if (rpForm) {
      rpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('rp-btn');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
        btn.disabled = true;

        try {
          const res = await fetch('http://localhost:5000/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              title: document.getElementById('rp-title').value
            })
          });
          const data = await res.json();
          if (res.ok) {
            rpAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-green-50 text-green-800 border border-green-200';
            rpAlert.textContent = data.message;
            rpForm.reset();
            // Redirect to reservation
            setTimeout(() => {
              window.location.hash = '#reservation';
            }, 1500);
          } else {
            rpAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 text-red-800 border border-red-200';
            rpAlert.textContent = data.message;
            rpAlert.classList.remove('hidden');
          }
        } catch (err) {
          rpAlert.className = 'p-3 mb-4 rounded-lg text-sm text-center bg-red-50 text-red-800 border border-red-200';
          rpAlert.textContent = 'Gagal menghubungi server.';
          rpAlert.classList.remove('hidden');
        } finally {
          btn.innerHTML = 'Ajukan Proyek & Jadwalkan Konsultasi';
          btn.disabled = false;
        }
      });
    }

  } catch (error) {
    const content = document.getElementById('dashboard-content');
    if (content) content.innerHTML = '<div class="bg-red-50 p-6 rounded-xl text-center"><p class="text-red-500">Gagal memuat dasbor. Silakan coba lagi nanti.</p></div>';
  }
};
