import { API_URL } from '../config.js';
export const renderDashboard = async (container) => {
  // Check global auth
  if (!window.currentUser || window.currentUser.role !== 'client') {
    window.location.hash = '#login';
    return;
  }


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
    const res = await fetch(`${API_URL}/dashboard/client`, { credentials: 'include' });
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Proyek Impian <span class="text-red-500">*</span></label>
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
                <div class="flex-shrink-0 w-8 h-8 rounded-full ${project.status === 'Selesai' || ['Desain','Pengadaan','Pemasangan'].includes(project.status) || project.progress_percentage >= 10 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center mt-1">
                  <i class="fa-solid fa-check"></i>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-bold ${project.status === 'Konsultasi' ? 'text-maroon' : 'text-gray-900'}">Konsultasi Awal ${project.status === 'Konsultasi' ? '<span class="ml-2 text-xs font-normal text-maroon">● Fase Saat Ini</span>' : ''}</h4>
                  <p class="text-sm text-gray-500">Kebutuhan dikumpulkan dan kontrak ditandatangani.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full ${['Desain','Pengadaan','Pemasangan','Selesai'].includes(project.status) ? 'bg-green-100 text-green-600' : (project.status === 'Konsultasi' ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-400')} flex items-center justify-center mt-1">
                  <i class="fa-solid ${['Desain','Pengadaan','Pemasangan','Selesai'].includes(project.status) ? 'fa-check' : 'fa-clock'}"></i>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-bold ${project.status === 'Desain' ? 'text-maroon' : 'text-gray-900'}">Desain &amp; Tata Letak Dapur ${project.status === 'Desain' ? '<span class="ml-2 text-xs font-normal text-maroon">● Fase Saat Ini</span>' : ''}</h4>
                  <p class="text-sm text-gray-500">Denah 2D dan mockup 3D disetujui.</p>
                </div>
              </div>
              <div class="flex items-start relative">
                ${project.status === 'Pengadaan' ? '<div class="absolute top-2 left-2 w-4 h-4 bg-maroon rounded-full animate-ping opacity-75"></div>' : ''}
                <div class="flex-shrink-0 w-8 h-8 rounded-full ${['Pengadaan','Pemasangan','Selesai'].includes(project.status) ? (project.status === 'Pengadaan' ? 'bg-maroon/20 text-maroon' : 'bg-green-100 text-green-600') : 'bg-gray-100 text-gray-400'} flex items-center justify-center mt-1 relative z-10">
                  <i class="fa-solid ${project.status === 'Pengadaan' ? 'fa-spinner fa-spin-pulse' : (['Pemasangan','Selesai'].includes(project.status) ? 'fa-check' : 'fa-clock')}"></i>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-bold ${project.status === 'Pengadaan' ? 'text-maroon' : 'text-gray-900'}">Pengadaan Peralatan ${project.status === 'Pengadaan' ? '<span class="ml-2 text-xs font-normal text-maroon">● Fase Saat Ini</span>' : ''}</h4>
                  <p class="text-sm text-gray-600">Memesan dan menunggu kedatangan alat.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full ${['Pemasangan','Selesai'].includes(project.status) ? (project.status === 'Pemasangan' ? 'bg-maroon/20 text-maroon' : 'bg-green-100 text-green-600') : 'bg-gray-100 text-gray-400'} flex items-center justify-center mt-1">
                  <i class="fa-solid ${project.status === 'Pemasangan' ? 'fa-spinner fa-spin-pulse' : (project.status === 'Selesai' ? 'fa-check' : 'fa-clock')}"></i>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-bold ${project.status === 'Pemasangan' ? 'text-maroon' : 'text-gray-500'}">Pemasangan &amp; Instalasi ${project.status === 'Pemasangan' ? '<span class="ml-2 text-xs font-normal text-maroon">● Fase Saat Ini</span>' : ''}</h4>
                  <p class="text-sm text-gray-400">Pemasangan alat di lokasi.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full ${project.status === 'Selesai' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center mt-1">
                  <i class="fa-solid ${project.status === 'Selesai' ? 'fa-trophy' : 'fa-clock'}"></i>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-bold ${project.status === 'Selesai' ? 'text-green-700' : 'text-gray-400'}">Selesai &amp; Serah Terima</h4>
                  <p class="text-sm text-gray-400">Proyek selesai dan diterima klien.</p>
                </div>
              </div>
            </div>
          </div>

          ${project.calendar_link ? `
          <!-- Google Calendar Embed -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-4 flex items-center"><i class="fa-regular fa-calendar text-maroon mr-3"></i> Jadwal Konsultasi</h2>
            <div class="rounded-lg overflow-hidden border border-gray-200" style="height: 400px;">
              <iframe src="${project.calendar_link}" style="border:0;width:100%;height:100%;" frameborder="0" scrolling="no"></iframe>
            </div>
          </div>
          ` : ''}
        </div>

        <!-- Sidebar Area -->
        <div class="space-y-8">
          
          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 font-medium">Dokumen</p>
                <p class="text-2xl font-bold text-gray-900">${data.documents.length}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <i class="fa-solid fa-file-lines text-lg"></i>
              </div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 font-medium">Progres</p>
                <p class="text-2xl font-bold text-gray-900">${project.progress_percentage}%</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <i class="fa-solid fa-chart-line text-lg"></i>
              </div>
            </div>
          </div>

          <!-- Documents Card -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-6 flex items-center"><i class="fa-solid fa-folder-open text-maroon mr-3"></i> Dokumen Proyek</h2>
            
            <ul class="space-y-4">
              ${data.documents.length === 0 ? '<li class="text-gray-500 text-sm">Tidak ada dokumen</li>' : 
                data.documents.map(doc => {
                  const fileName = doc.file_path.split('/').pop();
                  return `
                  
                  <li class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-maroon transition-colors group cursor-pointer preview-doc-btn" data-url="${doc.file_path}" data-type="${doc.type}" data-title="${doc.title}">
                    <div class="flex items-center flex-1 min-w-0 mr-4 pointer-events-none">
                      <i class="fa-solid ${doc.type === 'gdrive' ? 'fa-brands fa-google-drive text-green-600' : (doc.type === 'image' ? 'fa-image text-blue-500' : 'fa-file-pdf text-red-500')} text-2xl mr-3 flex-shrink-0"></i>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900 truncate" title="${doc.title}">${doc.title}</p>
                        <p class="text-xs text-gray-500 truncate" title="${doc.type === 'gdrive' ? 'Google Drive' : 'Cloud Storage'}">${doc.type === 'gdrive' ? 'Google Drive' : 'Cloud Storage'}</p>
                      </div>
                    </div>
                    <div class="flex space-x-3 items-center">
                      <button class="text-gray-400 hover:text-maroon flex-shrink-0" title="Pratinjau"><i class="fa-solid fa-eye"></i></button>
                      <button class="dl-btn text-gray-400 hover:text-blue-600 flex-shrink-0" data-id="${doc.id}" data-title="${doc.title}" data-type="${doc.type}" data-url="${doc.file_path}" title="Unduh"><i class="fa-solid fa-download"></i></button>
                    </div>
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
                <p class="font-bold">${project.pic_name || 'Tim Kitchen Connection'}</p>
                <p class="text-xs text-gray-300">Manajer Proyek</p>
              </div>
            </div>
            <a href="https://wa.me/${project.pic_phone ? project.pic_phone.replace(/[^0-9]/g, '') : '6281808193399'}?text=${encodeURIComponent(`Halo ${project.pic_name || 'Tim'}, saya ${window.currentUser.name} dari proyek "${project.title}". Saya butuh bantuan mengenai...`)}" target="_blank" class="block w-full bg-white text-maroon py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center shadow-sm">
              <i class="fa-brands fa-whatsapp mr-2"></i> Chat di WhatsApp
            </a>
          </div>

        </div>
      </div>
    `;
    } // End of else project

    
  // Global Preview Logic
  window.openPreview = (url, type, title) => {
    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-download-link').href = url;
    const container = document.getElementById('preview-container');
    
    if (type === 'image') {
      container.innerHTML = `<img src="${url}" class="w-full h-full object-contain" />`;
    } else if (type === 'gdrive') {
      // Convert standard drive link to preview link if possible
      let embedUrl = url;
      if (url.includes('/view')) {
         embedUrl = url.replace('/view', '/preview');
      } else if (!url.includes('preview')) {
         // rough fallback
         embedUrl = url + (url.includes('?') ? '&' : '?') + 'rm=minimal';
      }
      container.innerHTML = `<iframe src="${embedUrl}" class="w-full h-full border-0 rounded"></iframe>`;
    } else {
      container.innerHTML = `<iframe src="${url}" class="w-full h-full border-0 rounded"></iframe>`;
    }
    document.getElementById('preview-modal').classList.remove('hidden');
  };

  document.querySelectorAll('.preview-doc-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = e.currentTarget.getAttribute('data-url');
      const type = e.currentTarget.getAttribute('data-type');
      const title = e.currentTarget.getAttribute('data-title');
      window.openPreview(url, type, title);
    });
  });

  document.querySelectorAll('.dl-btn').forEach(btn => {
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
        alert('Gagal mengunduh: ' + err.message);
      } finally {
        btn.innerHTML = '<i class="fa-solid fa-download"></i>';
      }
    });
  });

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
          const res = await fetch(`${API_URL}/projects`, {
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
