export const renderHome = (container) => {
  container.innerHTML = `
    <!-- Hero Section -->
    <div class="relative bg-maroon text-white overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-40"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px; opacity: 0.1;"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Mendesain Jantung Bisnis Anda
        </h1>
        <p class="text-xl md:text-2xl max-w-3xl mb-10 text-gray-200">
          Konsultan F&B dan desain dapur ahli untuk mengoptimalkan alur kerja, memaksimalkan efisiensi, dan memastikan standar keselamatan tanpa kompromi.
        </p>
        <div class="flex gap-4">
          <a href="#reservation" class="bg-white text-maroon hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg">
            Mulai Proyek
          </a>
          <a href="#services" class="border-2 border-white text-white hover:bg-white hover:text-maroon px-8 py-3 rounded-lg font-bold text-lg transition-colors">
            Layanan Kami
          </a>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div id="services-overview" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solusi Komprehensif</h2>
          <div class="w-24 h-1 bg-maroon mx-auto mb-6"></div>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Kami menyediakan konsultasi menyeluruh mulai dari konseptualisasi hingga pengadaan peralatan.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Service 1 -->
          <div class="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-xl transition-shadow group">
            <div class="w-14 h-14 bg-maroon-light/10 text-maroon rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-maroon group-hover:text-white transition-colors">
              <i class="fa-solid fa-pen-ruler"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Desain & Tata Letak Dapur</h3>
            <p class="text-gray-600 mb-4">Denah lantai yang ergonomis dan efisien, disesuaikan dengan menu dan operasi Anda.</p>
            <a href="#reservation" class="text-maroon font-semibold hover:underline">Pelajari lebih lanjut <i class="fa-solid fa-arrow-right text-sm ml-1"></i></a>
          </div>
          
          <!-- Service 2 -->
          <div class="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-xl transition-shadow group">
            <div class="w-14 h-14 bg-maroon-light/10 text-maroon rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-maroon group-hover:text-white transition-colors">
              <i class="fa-solid fa-clipboard-check"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Keamanan & Kepatuhan</h3>
            <p class="text-gray-600 mb-4">Memastikan dapur Anda memenuhi standar kesehatan lokal dan keselamatan internasional.</p>
            <a href="#checklist" class="text-maroon font-semibold hover:underline">Coba Checklist Kami <i class="fa-solid fa-arrow-right text-sm ml-1"></i></a>
          </div>
          
          <!-- Service 3 -->
          <div class="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-xl transition-shadow group">
            <div class="w-14 h-14 bg-maroon-light/10 text-maroon rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-maroon group-hover:text-white transition-colors">
              <i class="fa-solid fa-blender"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Pengadaan Peralatan</h3>
            <p class="text-gray-600 mb-4">Rekomendasi objektif dan pengadaan peralatan komersial kualitas terbaik.</p>
            <a href="#catalog" class="text-maroon font-semibold hover:underline">Lihat Katalog <i class="fa-solid fa-arrow-right text-sm ml-1"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gray-50 py-16 border-t border-gray-200">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Siap meningkatkan standar dapur Anda?</h2>
        <p class="text-lg text-gray-600 mb-8">Jadwalkan konsultasi gratis 30 menit dengan pakar kami untuk membahas kebutuhan proyek Anda.</p>
        <a href="#reservation" class="inline-block bg-maroon text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-maroon-dark transition-colors shadow-md">
          Pesan Sesi Sekarang
        </a>
      </div>
    </div>
  `;
};
