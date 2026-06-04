import { API_URL } from '../config.js';
export const renderCatalog = async (container) => {
  container.innerHTML = `
    <div class="bg-maroon py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">Katalog Peralatan</h1>
        <p class="text-gray-200">Jelajahi rekomendasi peralatan dapur berkualitas tinggi kami.</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Search and Filter -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div class="flex-grow">
          <input type="text" id="search-input" placeholder="Cari peralatan..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon">
        </div>
        <div class="flex gap-4">
          <select id="category-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon bg-white">
            <option value="">Semua Kategori</option>
            <option value="Cooking">Memasak</option>
            <option value="Baking">Memanggang</option>
            <option value="Cooling">Pendingin</option>
            <option value="Ventilation">Ventilasi</option>
          </select>
          <select id="type-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon bg-white">
            <option value="">Semua Tipe</option>
            <option value="commercial">Komersial</option>
            <option value="home">Rumah Tangga</option>
          </select>
          <button id="filter-btn" class="bg-maroon text-white px-6 py-2 rounded-lg hover:bg-maroon-dark transition-colors">
            Saring
          </button>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" id="catalog-grid">
        <!-- Skeleton Loading -->
        <div class="animate-pulse bg-white p-4 rounded-xl border border-gray-100">
          <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div class="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
          <div class="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
          <div class="bg-gray-200 h-10 w-full rounded"></div>
        </div>
        <div class="animate-pulse bg-white p-4 rounded-xl border border-gray-100">
          <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div class="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
          <div class="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
          <div class="bg-gray-200 h-10 w-full rounded"></div>
        </div>
      </div>
    </div>
  `;

  try {
    const res = await fetch(`${API_URL}/equipments`);
    const allEquipments = await res.json();
    
    const grid = document.getElementById('catalog-grid');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const typeFilter = document.getElementById('type-filter');
    const filterBtn = document.getElementById('filter-btn');

    const renderGrid = (equipments) => {
      if(!grid) return;
      if (equipments.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-10">Belum ada data peralatan yang sesuai filter.</p>';
        return;
      }

      grid.innerHTML = equipments.map(eq => `
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
             <i class="fa-solid ${eq.category === 'Cooling' ? 'fa-snowflake' : (eq.category === 'Ventilation' ? 'fa-fan' : 'fa-fire')} text-4xl"></i>
          </div>
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg text-gray-900">${eq.name}</h3>
            <span class="${eq.type === 'commercial' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} text-xs px-2 py-1 rounded font-semibold capitalize">${eq.type === 'commercial' ? 'Komersial' : 'Rumah'}</span>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            ${eq.dimensions ? `Dimensi: ${eq.dimensions}<br>` : ''}
            ${eq.power ? `Daya: ${eq.power}<br>` : ''}
          </p>
          <button class="w-full border border-maroon text-maroon hover:bg-maroon hover:text-white py-2 rounded-lg font-medium transition-colors" onclick="alert('Fitur detail belum diimplementasi')">
            Lihat Detail
          </button>
        </div>
      `).join('');
    };

    const applyFilters = () => {
      const searchTerm = searchInput.value.toLowerCase();
      const cat = categoryFilter.value;
      const type = typeFilter.value;

      const filtered = allEquipments.filter(eq => {
        const matchSearch = eq.name.toLowerCase().includes(searchTerm) || (eq.description && eq.description.toLowerCase().includes(searchTerm));
        const matchCat = cat ? eq.category === cat : true;
        const matchType = type ? eq.type === type : true;
        return matchSearch && matchCat && matchType;
      });

      renderGrid(filtered);
    };

    if (filterBtn) filterBtn.addEventListener('click', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);

    renderGrid(allEquipments);

  } catch (error) {
    const grid = document.getElementById('catalog-grid');
    if (grid) grid.innerHTML = '<p class="col-span-full text-center text-red-500 py-10">Gagal mengambil data dari server.</p>';
  }
};
