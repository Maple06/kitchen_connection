export const renderReservation = (container) => {
  container.innerHTML = `
    <div class="bg-maroon py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">Pesan Konsultasi</h1>
        <p class="text-gray-200">Pilih waktu yang paling sesuai bagi Anda untuk mendiskusikan proyek dapur Anda.</p>
      </div>
    </div>
    
    <div class="max-w-5xl mx-auto px-4 py-12">
      <div class="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Google Calendar Integration -->
        <div id="calendar-view" class="bg-gray-50 flex flex-col items-center justify-center py-20 px-4 text-center rounded-xl border-2 border-dashed border-gray-300">
          <i class="fa-regular fa-calendar-check text-5xl text-maroon mb-4"></i>
          <h3 class="text-2xl font-bold mb-2">Integrasi Google Calendar</h3>
          <p class="text-gray-600 mb-6 max-w-md">Klien dapat memilih slot yang tersedia langsung dari kalender kami untuk menghindari pemesanan ganda.</p>
          
          <button id="show-custom-form" class="text-maroon font-semibold hover:underline">Atau gunakan formulir pemesanan manual</button>
        </div>

        <!-- Custom Form -->
        <div id="custom-booking-form" class="hidden p-8">
          <h3 class="text-2xl font-bold mb-6 border-b pb-4">Formulir Reservasi Manual</h3>
          <div id="reservation-alert" class="hidden p-4 mb-4 rounded-lg"></div>
          <form id="res-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">Nama</label>
                <input type="text" name="client_name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon">
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">Email</label>
                <input type="email" name="client_email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">Tanggal</label>
                <input type="date" name="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon">
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">Slot Waktu</label>
                <select name="time_slot" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon bg-white">
                  <option value="09:00 - 10:00">09:00 - 10:00</option>
                  <option value="10:00 - 11:00">10:00 - 11:00</option>
                  <option value="13:00 - 14:00">13:00 - 14:00</option>
                  <option value="15:00 - 16:00">15:00 - 16:00</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-1">Detail Proyek / Catatan</label>
              <textarea name="notes" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon h-32"></textarea>
            </div>
            <button type="submit" id="res-btn" class="bg-maroon text-white px-6 py-2 rounded-lg font-bold hover:bg-maroon-dark transition-colors">Kirim Permintaan</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const showCustomBtn = document.getElementById('show-custom-form');
  const customForm = document.getElementById('custom-booking-form');
  const form = document.getElementById('res-form');
  const alertBox = document.getElementById('reservation-alert');

  if(showCustomBtn && customForm) {
    showCustomBtn.addEventListener('click', () => {
      customForm.classList.remove('hidden');
      document.getElementById('calendar-view').classList.add('hidden');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('res-btn');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Memproses...';
      btn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      try {
        const res = await fetch('http://localhost:5000/api/reservations', {
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
