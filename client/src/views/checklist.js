export const renderChecklist = (container) => {
  container.innerHTML = `
    <div class="bg-maroon py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">Checklist Interaktif</h1>
        <p class="text-gray-200">Dapur Sehat & Aman - Dapatkan saran otomatis mengenai alur kerja dan ventilasi berdasarkan kebutuhan Anda.</p>
      </div>
    </div>
    
    <div class="max-w-3xl mx-auto px-4 py-12">
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form id="checklist-form" class="space-y-6">
          <!-- Question 1 -->
          <div>
            <label class="block text-gray-700 font-bold mb-2">1. Apa fokus utama dapur Anda?</label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="focus" value="commercial" class="text-maroon focus:ring-maroon h-4 w-4" required>
                <span>Restoran Komersial (Volume Tinggi)</span>
              </label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="focus" value="cafe" class="text-maroon focus:ring-maroon h-4 w-4">
                <span>Kafe / Toko Roti (Volume Menengah)</span>
              </label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="focus" value="home" class="text-maroon focus:ring-maroon h-4 w-4">
                <span>Hunian Mewah (Volume Rendah)</span>
              </label>
            </div>
          </div>

          <!-- Question 2 -->
          <div>
            <label class="block text-gray-700 font-bold mb-2">2. Berapa perkiraan ukuran area dapur Anda?</label>
            <select name="size" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon bg-white" required>
              <option value="">Pilih ukuran...</option>
              <option value="small">Di bawah 20 m²</option>
              <option value="medium">20 - 50 m²</option>
              <option value="large">Lebih dari 50 m²</option>
            </select>
          </div>

          <!-- Question 3 -->
          <div>
            <label class="block text-gray-700 font-bold mb-2">3. Metode memasak apa yang akan paling sering digunakan?</label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3"><input type="checkbox" name="methods" value="frying" class="text-maroon rounded focus:ring-maroon h-4 w-4"> <span>Menggoreng / Wok</span></label>
              <label class="flex items-center space-x-3"><input type="checkbox" name="methods" value="baking" class="text-maroon rounded focus:ring-maroon h-4 w-4"> <span>Memanggang / Pastry</span></label>
              <label class="flex items-center space-x-3"><input type="checkbox" name="methods" value="grilling" class="text-maroon rounded focus:ring-maroon h-4 w-4"> <span>Membakar / Api Terbuka</span></label>
            </div>
          </div>

          <button type="submit" class="w-full bg-maroon text-white font-bold py-3 rounded-lg hover:bg-maroon-dark transition-colors shadow-md mt-8">
            Dapatkan Saran
          </button>
        </form>
        
        <div id="checklist-result" class="hidden mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <h3 class="text-xl font-bold text-green-800 mb-3"><i class="fa-solid fa-check-circle mr-2"></i> Rekomendasi Kami</h3>
          <div id="result-content" class="text-gray-700 space-y-4"></div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('checklist-form');
  const resultDiv = document.getElementById('checklist-result');
  const resultContent = document.getElementById('result-content');

  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const focus = formData.get('focus');
      const size = formData.get('size');
      const methods = formData.getAll('methods');

      let recommendations = [];

      // Logic
      if (focus === 'commercial') {
        recommendations.push(`<strong>Alur Kerja (Workflow):</strong> Terapkan tata letak jalur perakitan yang jelas (Persiapan -> Memasak -> Penyajian -> Cuci) untuk menghindari kontaminasi silang dan tabrakan antar staf selama jam sibuk.`);
      } else {
        recommendations.push(`<strong>Alur Kerja (Workflow):</strong> Tata letak bergaya pulau (Island) atau zona akan berfungsi paling baik untuk operasi Anda.`);
      }

      if (methods.includes('frying') || methods.includes('grilling')) {
        recommendations.push(`<strong>Ventilasi:</strong> Tudung hisap (Hood) komersial Tipe 1 berkapasitas tinggi dengan sistem pemadaman api adalah WAJIB untuk memasak dengan api terbuka dan yang menghasilkan minyak.`);
      } else {
        recommendations.push(`<strong>Ventilasi:</strong> Tudung hisap Tipe 2 untuk ekstraksi panas dan kelembapan sudah cukup.`);
      }

      if (size === 'small') {
        recommendations.push(`<strong>Efisiensi:</strong> Manfaatkan pendingin di bawah meja (under-counter) dan penyimpanan vertikal untuk memaksimalkan ruang terbatas Anda.`);
      } else if (size === 'large') {
        recommendations.push(`<strong>Efisiensi:</strong> Dengan ruang yang luas, pertimbangkan walk-in chiller dan area persiapan kering terpisah.`);
      }

      resultContent.innerHTML = recommendations.map(r => `<p class="border-l-4 border-green-500 pl-4 py-1">${r}</p>`).join('');
      resultDiv.classList.remove('hidden');
    });
  }
};
