import { API_URL } from '../config.js';

const renderCalendarSection = (calendarUrl) => {
  if (calendarUrl) {
    return `
    <!-- Google Calendar Embed -->
    <div class="rounded-xl overflow-hidden" style="height: 600px;">
      <iframe src="${calendarUrl}" style="border:0;width:100%;height:100%;" frameborder="0" scrolling="no"></iframe>
    </div>
    <div class="px-8 pt-4 pb-2 text-center">
      <button id="show-custom-form" class="text-maroon font-semibold hover:underline text-sm">Atau gunakan formulir pemesanan manual</button>
    </div>`;
  }
  return `
  <!-- Placeholder when no calendar URL is set -->
  <div id="calendar-view" class="bg-gray-50 flex flex-col items-center justify-center py-20 px-4 text-center rounded-xl border-2 border-dashed border-gray-300">
    <i class="fa-regular fa-calendar-check text-5xl text-maroon mb-4"></i>
    <h3 class="text-2xl font-bold mb-2">Jadwal Konsultasi</h3>
    <p class="text-gray-600 mb-6 max-w-md">Gunakan formulir di bawah untuk mengajukan jadwal konsultasi dengan tim kami.</p>
    <button id="show-custom-form" class="text-maroon font-semibold hover:underline">Buka Formulir Pemesanan</button>
  </div>`;
};

export const renderReservation = async (container) => {
  // Show loading state first
  container.innerHTML = `
    <div class="bg-maroon py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">Pesan Konsultasi</h1>
        <p class="text-gray-200">Pilih waktu yang paling sesuai bagi Anda untuk mendiskusikan proyek dapur Anda.</p>
      </div>
    </div>
    <div class="flex justify-center py-20"><i class="fa-solid fa-spinner fa-spin-pulse text-maroon text-4xl"></i></div>
  `;

  // Fetch calendar setting from API
  let calendarUrl = '';
  try {
    const res = await fetch(`${API_URL}/settings/calendar`);
    if (res.ok) {
      const data = await res.json();
      calendarUrl = data.calendar_embed_url || '';
    }
  } catch (_) { /* silently ignore — fallback to no embed */ }

  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const projectParam = urlParams.get('project');
  const initialNotes = projectParam ? `Proyek: ${projectParam}\n\nKebutuhan detail: ` : '';
  const initialCount = initialNotes.length;

  container.innerHTML = `
    <div class="bg-maroon py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">Pesan Konsultasi</h1>
        <p class="text-gray-200">Pilih waktu yang paling sesuai bagi Anda untuk mendiskusikan proyek dapur Anda.</p>
      </div>
    </div>
    
    <div class="max-w-5xl mx-auto px-4 py-12">
      <div class="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        ${renderCalendarSection(calendarUrl)}

        <!-- Custom Form -->
        <div id="custom-booking-form" class="${calendarUrl ? 'hidden' : ''} p-8">
          <h3 class="text-2xl font-bold mb-6 border-b pb-4">Formulir Reservasi Manual</h3>
          <div id="reservation-alert" class="hidden p-4 mb-4 rounded-lg"></div>
          <form id="res-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">Nama <span class="text-red-500">*</span></label>
                <input type="text" name="client_name" value="${window.currentUser ? window.currentUser.name : ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon">
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">Email <span class="text-red-500">*</span></label>
                <input type="email" name="client_email" value="${(window.currentUser && window.currentUser.email) ? window.currentUser.email : ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">Tanggal <span class="text-red-500">*</span></label>
                <input type="date" name="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon">
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">Slot Waktu <span class="text-red-500">*</span></label>
                <select name="time_slot" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon bg-white">
                  <option value="" disabled selected>-- Pilih Jam --</option>
                  <option value="09:00 - 10:00">09:00 - 10:00</option>
                  <option value="10:00 - 11:00">10:00 - 11:00</option>
                  <option value="13:00 - 14:00">13:00 - 14:00</option>
                  <option value="15:00 - 16:00">15:00 - 16:00</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-1">Detail Proyek / Catatan <span class="text-red-500">*</span></label>
              <textarea id="res-notes" name="notes" required minlength="50" placeholder="Jelaskan kebutuhan dapur impian Anda secara detail..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon h-32">${initialNotes}</textarea>
              <p class="text-xs text-gray-500 mt-1 text-right"><span id="notes-counter" class="${initialCount >= 50 ? 'text-green-600' : 'text-red-500'} font-bold">${initialCount}</span> / Minimal 50 karakter</p>
            </div>
            <button type="submit" id="res-btn" class="bg-maroon text-white px-6 py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors">Kirim Permintaan</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const showCustomBtn = document.getElementById('show-custom-form');
  const customForm = document.getElementById('custom-booking-form');
  const calendarView = document.getElementById('calendar-view');

  if (showCustomBtn && customForm) {
    showCustomBtn.addEventListener('click', () => {
      customForm.classList.remove('hidden');
      if (calendarView) calendarView.classList.add('hidden');
    });
  }

  // Notes Counter Logic
  const notesArea = document.getElementById('res-notes');
  const counter = document.getElementById('notes-counter');
  if (notesArea && counter) {
    notesArea.addEventListener('input', (e) => {
      const len = e.target.value.length;
      counter.textContent = len;
      if (len >= 50) {
        counter.classList.remove('text-red-500');
        counter.classList.add('text-green-600');
      } else {
        counter.classList.add('text-red-500');
        counter.classList.remove('text-green-600');
      }
    });
  }

  const form = document.getElementById('res-form');
  const alertBox = document.getElementById('reservation-alert');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('res-btn');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Memproses...';
      btn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      try {
        const res = await fetch(`${API_URL}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        
        if (res.ok) {
          alertBox.className = 'p-4 mb-4 rounded-lg bg-green-100 text-green-800';
          alertBox.textContent = result.message;
          alertBox.classList.remove('hidden');
          form.reset();
        } else {
          alertBox.className = 'p-4 mb-4 rounded-lg bg-red-100 text-red-800';
          alertBox.textContent = result.message || 'Gagal mengirim permintaan';
          alertBox.classList.remove('hidden');
        }
      } catch (error) {
        alertBox.className = 'p-4 mb-4 rounded-lg bg-red-100 text-red-800';
        alertBox.textContent = 'Tidak dapat menghubungi server.';
        alertBox.classList.remove('hidden');
      } finally {
        btn.innerHTML = 'Kirim Permintaan';
        btn.disabled = false;
      }
    });
  }
};
