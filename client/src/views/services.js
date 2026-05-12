export const renderServices = (container) => {
  container.innerHTML = `
    <!-- Header -->
    <div class="bg-maroon py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold text-white mb-6">Layanan Kami</h1>
        <p class="text-xl text-gray-200 max-w-3xl mx-auto">Kami menyediakan solusi komprehensif untuk merancang, membangun, dan mengoptimalkan dapur komersial Anda, dari konsep awal hingga operasional sehari-hari.</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <!-- Service 1 -->
        <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10">
          <div class="md:w-1/3 flex justify-center">
            <div class="w-40 h-40 bg-maroon-light/10 rounded-full flex items-center justify-center text-maroon text-6xl shadow-inner">
              <i class="fa-solid fa-pen-ruler"></i>
            </div>
          </div>
          <div class="md:w-2/3">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Desain & Tata Letak Dapur (Kitchen Layout)</h2>
            <p class="text-gray-600 text-lg mb-6 leading-relaxed">
              Memiliki peralatan yang bagus tidak ada artinya tanpa alur kerja (workflow) yang efisien. Kami membantu Anda merancang denah lantai (floor plan) ergonomis yang meminimalkan langkah staf, mencegah kontaminasi silang, dan mempercepat proses penyajian makanan.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-3"></i> <span>Pembuatan Mockup 2D & 3D (AutoCAD / SketchUp).</span></li>
              <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-3"></i> <span>Analisis zonasi: Persiapan, Memasak, Penyajian, dan Cuci (Dishwashing).</span></li>
              <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-3"></i> <span>Penempatan titik MEP (Mechanical, Electrical, Plumbing).</span></li>
            </ul>
            <a href="#reservation" class="inline-block bg-maroon text-white px-6 py-3 rounded-lg font-bold hover:bg-maroon-dark transition-colors">Konsultasi Desain</a>
          </div>
        </div>

        <!-- Service 2 -->
        <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row-reverse items-center gap-10">
          <div class="md:w-1/3 flex justify-center">
            <div class="w-40 h-40 bg-maroon-light/10 rounded-full flex items-center justify-center text-maroon text-6xl shadow-inner">
              <i class="fa-solid fa-clipboard-check"></i>
            </div>
          </div>
          <div class="md:w-2/3">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Keamanan, Kebersihan & Kepatuhan (HACCP)</h2>
            <p class="text-gray-600 text-lg mb-6 leading-relaxed">
              Keamanan pangan adalah prioritas tertinggi dalam industri F&B. Kami membimbing staf Anda dan merancang sistem dapur yang secara natural mematuhi standar higienitas lokal maupun internasional.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-3"></i> <span>Audit dan perancangan jalur pembuangan limbah (Grease Trap).</span></li>
              <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-3"></i> <span>Desain ventilasi dan sirkulasi udara (Hood & Exhaust system).</span></li>
              <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-3"></i> <span>Pelatihan standar food safety dan penggunaan alat pemadam.</span></li>
            </ul>
            <a href="#checklist" class="inline-block border-2 border-maroon text-maroon hover:bg-maroon hover:text-white px-6 py-3 rounded-lg font-bold transition-colors">Isi Checklist Keamanan</a>
          </div>
        </div>

        <!-- Service 3 -->
        <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10">
          <div class="md:w-1/3 flex justify-center">
            <div class="w-40 h-40 bg-maroon-light/10 rounded-full flex items-center justify-center text-maroon text-6xl shadow-inner">
              <i class="fa-solid fa-blender"></i>
            </div>
          </div>
          <div class="md:w-2/3">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Pengadaan & Instalasi Peralatan</h2>
            <p class="text-gray-600 text-lg mb-6 leading-relaxed">
              Kami memberikan rekomendasi objektif mengenai peralatan komersial spesifik yang Anda butuhkan tanpa membuat Anda membayar lebih untuk fitur yang tidak perlu. Tim kami akan mengurus pembelian, pengiriman, hingga instalasi.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-3"></i> <span>Kurasi alat sesuai menu dan kapasitas target produksi.</span></li>
              <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-3"></i> <span>Suplai produk dari merk terkemuka dan bergaransi resmi.</span></li>
              <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-3"></i> <span>Instalasi, kalibrasi (Testing & Commissioning), dan training staf.</span></li>
            </ul>
            <a href="#catalog" class="inline-block bg-maroon text-white px-6 py-3 rounded-lg font-bold hover:bg-maroon-dark transition-colors">Lihat Katalog Kami</a>
          </div>
        </div>

      </div>
    </div>
    
    <!-- CTA -->
    <div class="bg-gray-900 text-white py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Mari Bangun Dapur Impian Anda Bersama</h2>
        <p class="text-gray-400 mb-8">Tim kami siap membantu Anda dari awal hingga restoran Anda beroperasi dengan lancar.</p>
        <a href="#reservation" class="inline-block bg-white text-maroon px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
          Jadwalkan Konsultasi Gratis
        </a>
      </div>
    </div>
  `;
};
