export const renderHome = (container) => {
  container.innerHTML = `
    <!-- Hero Section -->
    <div class="relative bg-maroon text-white overflow-hidden group">
      <div class="absolute inset-0 bg-black opacity-40 transition-opacity duration-700 group-hover:opacity-50"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px; opacity: 0.1;"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center animate-fade-in-up">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-pulse-slow">
          One Stop F&B Consultant
        </h1>
        <p class="text-xl md:text-2xl max-w-3xl mb-10 text-gray-200 font-medium">
          From Concept to Culinary Excellence
        </p>
        <div class="flex gap-4 mt-4 animate-fade-in-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
          <a href="#reservation" class="bg-white text-maroon hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
            Mulai Proyek
          </a>
          <a href="#services" class="border-2 border-white text-white hover:bg-white hover:text-maroon px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105">
            Layanan Kami
          </a>
        </div>
      </div>
    </div>

    <!-- About Us Section -->
    <div id="about-us" class="py-20 bg-gray-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="reveal-on-scroll">
            <h2 class="text-3xl md:text-4xl font-bold text-maroon mb-4">Tentang Kitchen Connection</h2>
            <div class="w-20 h-1 bg-maroon mb-6"></div>
            <p class="text-lg text-gray-700 leading-relaxed mb-6">
              Kitchen Connection didirikan oleh <strong>Chef Sara Rabasari</strong> pada tahun 2018 di Bandung dengan visi menjadi mitra utama dalam membangun kesuksesan bisnis di industri <em>food & beverage</em>. Berbekal pengalaman panjang sebagai praktisi dan akademisi di berbagai bidang, mulai dari hotel, restoran, kapal pesiar, hingga menjadi dosen di industri ini, Chef Sara yang juga aktif sebagai Sekjen di Indonesian Chef Association Jawa Barat mendirikan Kitchen Connection untuk memenuhi kebutuhan pasar akan layanan konsultasi menyeluruh di sektor <em>food & beverage</em>.
            </p>
            <p class="text-lg text-gray-700 leading-relaxed">
              Kitchen Connection hadir sebagai solusi <strong>"one stop consultant service,"</strong> menawarkan berbagai layanan yang dirancang untuk memaksimalkan potensi bisnis Anda. Layanan kami mencakup <em>menu engineering</em>, pelatihan karyawan, hingga desain interior kafe dan restoran yang disesuaikan dengan konsep dan menu yang unik. Dalam setiap proyek, kami berkomitmen memberikan konsultasi yang komprehensif, mulai dari perancangan layout, jasa desain interior, <em>menu engineering</em>, pembuatan <em>cost card</em> dan <em>mastering recipe</em>, hingga perekrutan dan pelatihan karyawan serta penyusunan SOP.
            </p>
          </div>
          <div class="relative reveal-on-scroll" style="animation-delay: 0.3s; animation-fill-mode: both;">
            <div class="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden shadow-2xl h-80 lg:h-96 w-full relative">
              <div class="absolute inset-0 bg-gradient-to-tr from-maroon-dark to-maroon flex items-center justify-center">
                <i class="fa-solid fa-utensils text-white opacity-20 text-9xl"></i>
              </div>
            </div>
            <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
              <p class="text-maroon font-bold text-xl mb-1">Sejak 2018</p>
              <p class="text-gray-500 text-sm font-medium">Berpengalaman di Industri F&B</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Why Choose Us Section -->
    <div class="py-20 bg-maroon text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 reveal-on-scroll">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Mengapa Memilih Kami?</h2>
          <div class="w-24 h-1 bg-white/30 mx-auto mb-6"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div class="reveal-on-scroll" style="animation-delay: 0.1s; animation-fill-mode: both;">
            <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Pendekatan Praktisi</h3>
            <p class="text-gray-200 opacity-90">Solusi nyata dari kacamata Chef dan praktisi berpengalaman di industri.</p>
          </div>
          <div class="reveal-on-scroll" style="animation-delay: 0.2s; animation-fill-mode: both;">
            <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Efisiensi Maksimal</h3>
            <p class="text-gray-200 opacity-90">Memangkas biaya operasional dan setup tanpa mengorbankan kualitas akhir.</p>
          </div>
          <div class="reveal-on-scroll" style="animation-delay: 0.3s; animation-fill-mode: both;">
            <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <i class="fa-solid fa-globe"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Standar Global</h3>
            <p class="text-gray-200 opacity-90">Mengadaptasi standar kebersihan, keamanan, dan alur kerja internasional.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div id="services-overview" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 reveal-on-scroll">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solusi Komprehensif</h2>
          <div class="w-24 h-1 bg-maroon mx-auto mb-6"></div>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Kami menyediakan konsultasi menyeluruh mulai dari konseptualisasi hingga pengadaan peralatan.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Service 1 -->
          <div class="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group reveal-on-scroll" style="animation-delay: 0.1s; animation-fill-mode: both;">
            <div class="w-14 h-14 bg-maroon-light/10 text-maroon rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-maroon group-hover:text-white transition-colors">
              <i class="fa-solid fa-pen-ruler"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Desain & Tata Letak Dapur</h3>
            <p class="text-gray-600 mb-4">Denah lantai yang ergonomis dan efisien, disesuaikan dengan menu dan operasi Anda.</p>
            <a href="#reservation" class="text-maroon font-semibold hover:underline">Pelajari lebih lanjut <i class="fa-solid fa-arrow-right text-sm ml-1"></i></a>
          </div>
          
          <!-- Service 2 -->
          <div class="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group reveal-on-scroll" style="animation-delay: 0.2s; animation-fill-mode: both;">
            <div class="w-14 h-14 bg-maroon-light/10 text-maroon rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-maroon group-hover:text-white transition-colors">
              <i class="fa-solid fa-clipboard-check"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Keamanan & Kepatuhan</h3>
            <p class="text-gray-600 mb-4">Memastikan dapur Anda memenuhi standar kesehatan lokal dan keselamatan internasional.</p>
            <a href="#checklist" class="text-maroon font-semibold hover:underline">Coba Checklist Kami <i class="fa-solid fa-arrow-right text-sm ml-1"></i></a>
          </div>
          
          <!-- Service 3 -->
          <div class="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group reveal-on-scroll" style="animation-delay: 0.3s; animation-fill-mode: both;">
            <div class="w-14 h-14 bg-maroon-light/10 text-maroon rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-maroon group-hover:text-white transition-colors">
              <i class="fa-solid fa-blender"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Pengadaan Peralatan</h3>
            <p class="text-gray-600 mb-4">Rekomendasi objektif dan pengadaan peralatan komersial kualitas terbaik.</p>
            <a href="#catalog" class="text-maroon font-semibold hover:underline">Lihat Katalog <i class="fa-solid fa-arrow-right text-sm ml-1"></i></a>
          </div>
        </div>

        <!-- Layanan Lainnya Section -->
        <div class="text-center mt-20 mb-8 reveal-on-scroll" style="animation-delay: 0.4s; animation-fill-mode: both;">
          <h3 class="text-xl font-bold text-gray-500 tracking-wider uppercase">Layanan Lainnya</h3>
        </div>
        
        <div class="flex flex-wrap justify-center gap-4 md:gap-5 reveal-on-scroll max-w-4xl mx-auto" style="animation-delay: 0.5s; animation-fill-mode: both;">
          
          <!-- Pill 1 -->
          <div class="relative group bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-maroon transition-all cursor-default text-gray-700 font-medium">
            <span>Digital Marketing & Social Media</span>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center shadow-xl">
              Strategi promosi online, manajemen media sosial, hingga kampanye digital untuk meningkatkan awareness dan engagement.
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          <!-- Pill 2 -->
          <div class="relative group bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-maroon transition-all cursor-default text-gray-700 font-medium">
            <span>Food Photography & Styling</span>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center shadow-xl">
              Menyediakan foto profesional untuk menu, katalog, dan konten promosi agar lebih menarik pelanggan.
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          <!-- Pill 3 -->
          <div class="relative group bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-maroon transition-all cursor-default text-gray-700 font-medium">
            <span>Market Research & Feasibility Study</span>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center shadow-xl">
              Analisis pasar, tren kuliner, dan studi kelayakan untuk membantu klien menentukan konsep bisnis yang tepat.
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          <!-- Pill 4 (Highlight) -->
          <div class="relative group bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-maroon transition-all cursor-default text-gray-700 font-medium">
            <span>Supply Chain & Vendor Management</span>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center shadow-xl">
              Membantu memilih supplier bahan baku, negosiasi harga, dan memastikan kualitas serta konsistensi pasokan.
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          <!-- Pill 5 -->
          <div class="relative group bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-maroon transition-all cursor-default text-gray-700 font-medium">
            <span>Food Safety & Hygiene Training</span>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center shadow-xl">
              Pelatihan standar kebersihan dan keamanan pangan sesuai regulasi agar operasional lebih profesional.
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          <!-- Pill 6 -->
          <div class="relative group bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-maroon transition-all cursor-default text-gray-700 font-medium">
            <span>Event & Catering Consultation</span>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center shadow-xl">
              Membantu restoran/kafe memperluas layanan ke arah event atau catering dengan konsep yang terstruktur.
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- Our Clients Section -->
    <div class="py-20 bg-gray-50 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 reveal-on-scroll">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Klien & Proyek Unggulan</h2>
          <div class="w-24 h-1 bg-maroon mx-auto mb-6"></div>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Sebagian dari klien yang telah mempercayakan pengembangan bisnisnya kepada kami.</p>
        </div>
        
        <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden reveal-on-scroll">
          <div class="flex flex-col md:flex-row">
            <div class="md:w-2/5 bg-gray-100 flex items-center justify-center p-8">
              <img src="/tigre.jpg" alt="Tigre Coffee and Eatery Logo" class="w-40 h-40 rounded-full shadow-md object-cover">
            </div>
            <div class="md:w-3/5 p-8 flex flex-col justify-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Tigre Coffee and Eatery</h3>
              <a href="https://www.instagram.com/tigrecoffeeandeatery/" target="_blank" rel="noopener noreferrer" class="text-maroon hover:underline mb-6 text-sm inline-flex items-center">
                <i class="fa-brands fa-instagram mr-1 text-lg"></i> @tigrecoffeeandeatery
              </a>
              <h4 class="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Layanan yang diberikan:</h4>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <i class="fa-solid fa-check text-green-500 mt-1 mr-2"></i>
                  <span class="text-gray-600">Pengembangan Merek dan Logo</span>
                </li>
                <li class="flex items-start">
                  <i class="fa-solid fa-check text-green-500 mt-1 mr-2"></i>
                  <span class="text-gray-600">Segmentasi Pasar</span>
                </li>
                <li class="flex items-start">
                  <i class="fa-solid fa-check text-green-500 mt-1 mr-2"></i>
                  <span class="text-gray-600">Analisis Kompetitor</span>
                </li>
                <li class="flex items-start">
                  <i class="fa-solid fa-check text-green-500 mt-1 mr-2"></i>
                  <span class="text-gray-600">Pengembangan Menu</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-maroon py-16 border-t border-maroon-light relative overflow-hidden">
      <div class="absolute inset-0" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px; opacity: 0.05;"></div>
      <div class="max-w-4xl mx-auto px-4 text-center relative reveal-on-scroll">
        <h2 class="text-3xl font-bold mb-6 text-white">Siap meningkatkan standar dapur Anda?</h2>
        <p class="text-lg text-gray-200 mb-8">Jadwalkan konsultasi gratis 30 menit dengan pakar kami untuk membahas kebutuhan proyek Anda.</p>
        <a href="#reservation" class="inline-block bg-white text-maroon px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
          Pesan Sesi Sekarang
        </a>
      </div>
    </div>
  `;
};
