export const renderHome = (container) => {
  container.innerHTML = `
    <!-- Hero Section -->
    <div class="relative bg-maroon text-white overflow-hidden group">
      <div class="absolute inset-0 bg-black opacity-40 transition-opacity duration-700 group-hover:opacity-50"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px; opacity: 0.1;"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center animate-fade-in-up">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-pulse-slow">
          One Stop F&B Consultant
        </h1>
        <p class="text-lg md:text-xl max-w-2xl mb-2 text-gray-300 font-medium">Konsultan F&amp;B Profesional di Bandung</p>
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
            <h2 class="text-3xl md:text-4xl font-bold text-maroon mb-4">Tentang Kitchen Connection — Konsultan F&amp;B di Bandung</h2>
            <div class="w-20 h-1 bg-maroon mb-6"></div>
            <p class="text-lg text-gray-700 leading-relaxed mb-6">
              Kitchen Connection didirikan oleh <strong>Chef Sara Rabasari, SM.PAR MM.PAR</strong> pada tahun 2018 sebagai solusi <em>"one stop consultant service"</em> di industri F&B. Berbekal visi menjadi mitra utama kesuksesan bisnis kuliner, beliau menghadirkan layanan konsultasi menyeluruh dari konseptualisasi hingga operasional.
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <i class="fa-solid fa-circle-check text-maroon mt-1.5 mr-3 text-lg"></i>
                <p class="text-gray-700"><strong>Akademisi & Praktisi Ahli:</strong> Menjabat sebagai <em>Head of Diploma Program</em> di Akpar NHI Bandung dengan latar belakang S2 Tourism Management.</p>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-circle-check text-maroon mt-1.5 mr-3 text-lg"></i>
                <p class="text-gray-700"><strong>Pengalaman Global:</strong> Rekam jejak ekstensif di perhotelan internasional (Hilton, Mercure) dan kapal pesiar (Carnival Cruise Lines - USA).</p>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-circle-check text-maroon mt-1.5 mr-3 text-lg"></i>
                <p class="text-gray-700"><strong>Asesor & Auditor Tersertifikasi:</strong> Asesor kompetensi BNSP aktif dan auditor bersertifikat HACCP dari TÜV Rheinland.</p>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-circle-check text-maroon mt-1.5 mr-3 text-lg"></i>
                <p class="text-gray-700"><strong>Dedikasi Industri:</strong> Berperan strategis sebagai Sekretaris Jenderal Indonesian Chef Association (ICA) BPD Jawa Barat.</p>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-circle-check text-maroon mt-1.5 mr-3 text-lg"></i>
                <p class="text-gray-700"><strong>Konsultan Berpengalaman:</strong> Telah menangani puluhan proyek mulai dari <em>menu engineering</em>, pembuatan SOP, desain <em>layout</em>, hingga pelatihan SDM.</p>
              </li>
            </ul>
          </div>
          <div class="relative reveal-on-scroll flex justify-center items-center" style="animation-delay: 0.3s; animation-fill-mode: both;">
            <div class="relative w-full max-w-sm">
              <div class="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group bg-gray-100 w-full">
                <img src="/sara.jpg" alt="Chef Sara Rabasari" class="object-cover object-center w-full h-full absolute inset-0 z-10 transition-transform duration-500 group-hover:scale-105" onerror="this.style.display='none'; document.getElementById('placeholder-icon').style.display='flex';">
                <div id="placeholder-icon" class="absolute inset-0 bg-gradient-to-tr from-maroon-dark to-maroon flex flex-col items-center justify-center z-0" style="display: none;">
                  <i class="fa-solid fa-user-tie text-white opacity-20 text-7xl mb-4"></i>
                  <span class="text-white opacity-50 text-sm">Foto Profil Belum Tersedia</span>
                </div>
              </div>
              <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300 z-20">
                <p class="text-maroon font-bold text-xl mb-1">Sejak 2018</p>
                <p class="text-gray-500 text-sm font-medium">Berpengalaman di Industri F&B</p>
              </div>
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
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solusi Komprehensif untuk Bisnis Kuliner Anda</h2>
          <div class="w-24 h-1 bg-maroon mx-auto mb-6"></div>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Kami menyediakan konsultasi menyeluruh mulai dari konseptualisasi, desain dapur komersial, hingga pengadaan peralatan untuk restoran dan kafe di Bandung dan seluruh Indonesia.</p>
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
            <a href="#checklist" class="text-maroon font-semibold hover:underline">Mulai Konsultasi Awal <i class="fa-solid fa-arrow-right text-sm ml-1"></i></a>
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
        <div class="text-center mt-10 mb-8 reveal-on-scroll" style="animation-delay: 0.4s; animation-fill-mode: both;">
          <h3 class="text-sm font-bold text-gray-500 tracking-widest uppercase">Layanan Lainnya</h3>
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
    <div id="our-clients" class="py-20 bg-gray-50 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 reveal-on-scroll">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Klien &amp; Proyek Unggulan</h2>
          <div class="w-24 h-1 bg-maroon mx-auto mb-6"></div>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Sebagian dari klien yang telah mempercayakan pengembangan bisnisnya kepada kami.</p>
        </div>

        <!-- Project Tabs -->
        <div class="flex flex-wrap justify-center gap-3 mb-10 reveal-on-scroll" id="client-tabs">
          <button data-tab="tigre" class="client-tab-btn active px-5 py-2 rounded-full text-sm font-semibold border-2 border-maroon bg-maroon text-white transition-all duration-200">Tigre Coffee</button>
          <button data-tab="karyakarsa" class="client-tab-btn px-5 py-2 rounded-full text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:border-maroon hover:text-maroon transition-all duration-200">Kopi Karya Karsa</button>
          <button data-tab="madamesari" class="client-tab-btn px-5 py-2 rounded-full text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:border-maroon hover:text-maroon transition-all duration-200">Madame Sari</button>
          <button data-tab="serasee" class="client-tab-btn px-5 py-2 rounded-full text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:border-maroon hover:text-maroon transition-all duration-200">Serasee Coffee</button>
        </div>

        <!-- Project Cards -->
        <div id="client-panels">

          <!-- Tigre -->
          <div id="panel-tigre" class="client-panel reveal-on-scroll">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="flex flex-col lg:flex-row h-full">
                <!-- Left: Logo + Info -->
                <div class="lg:w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col justify-between">
                  <div>
                    <div class="w-28 h-28 rounded-2xl overflow-hidden shadow-md bg-white flex items-center justify-center mb-6">
                      <img src="/projects/Tigre Coffee and Eatery/tigre.jpg" alt="Tigre Coffee and Eatery Logo" class="w-full h-full object-contain p-1">
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-1">Tigre Coffee and Eatery</h3>
                    <a href="https://www.instagram.com/tigrecoffeeandeatery/" target="_blank" rel="noopener noreferrer" class="text-maroon hover:underline text-sm inline-flex items-center gap-1 mb-6">
                      <i class="fa-brands fa-instagram text-base"></i> @tigrecoffeeandeatery
                    </a>
                    <h4 class="font-semibold text-gray-500 mb-3 text-xs uppercase tracking-widest">Layanan yang diberikan</h4>
                    <ul class="space-y-2">
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Pengembangan Merek dan Logo</li>
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Segmentasi Pasar</li>
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Analisis Kompetitor</li>
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Pengembangan Menu</li>
                    </ul>
                  </div>
                </div>
                <!-- Right: Image Carousel -->
                <div class="lg:w-3/5 relative overflow-hidden bg-black h-[260px] lg:h-full">
                  <div class="project-carousel h-full" id="carousel-tigre" data-current="0">
                    <div class="carousel-track flex h-full transition-transform duration-500 ease-in-out">
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Tigre Coffee and Eatery/images/image_01.jpg" alt="Tigre project 1" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Tigre Coffee and Eatery/images/image_02.jpg" alt="Tigre project 2" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Tigre Coffee and Eatery/images/image_03.jpg" alt="Tigre project 3" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Tigre Coffee and Eatery/images/image_04.jpg" alt="Tigre project 4" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Tigre Coffee and Eatery/images/image_05.jpg" alt="Tigre project 5" class="w-full h-full object-cover"></div>
                    </div>
                    <!-- Controls -->
                    <button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm">
                      <i class="fa-solid fa-chevron-left text-sm"></i>
                    </button>
                    <button class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm">
                      <i class="fa-solid fa-chevron-right text-sm"></i>
                    </button>
                    <!-- Dots -->
                    <div class="carousel-dots absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-100 transition-opacity cursor-pointer" data-index="0"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 transition-opacity cursor-pointer" data-index="1"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 transition-opacity cursor-pointer" data-index="2"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 transition-opacity cursor-pointer" data-index="3"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 transition-opacity cursor-pointer" data-index="4"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Kopi Karya Karsa -->
          <div id="panel-karyakarsa" class="client-panel hidden">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="flex flex-col lg:flex-row h-full">
                <div class="lg:w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col justify-between">
                  <div>
                    <div class="w-28 h-28 rounded-2xl overflow-hidden shadow-md bg-white flex items-center justify-center mb-6">
                      <img src="/projects/Kopi Karya Karsa/karya_karsa.jpg" alt="Kopi Karya Karsa Logo" class="w-full h-full object-contain p-2">
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-1">Kopi Karya Karsa</h3>
                    <a href="https://www.instagram.com/kopikaryakarsa/" target="_blank" rel="noopener noreferrer" class="text-maroon hover:underline text-sm inline-flex items-center gap-1 mb-6">
                      <i class="fa-brands fa-instagram text-base"></i> @kopikaryakarsa
                    </a>
                    <h4 class="font-semibold text-gray-500 mb-3 text-xs uppercase tracking-widest">Layanan yang diberikan</h4>
                    <ul class="space-y-2">
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Layouting Tata Letak Ruang</li>
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Pembuatan Menu</li>
                    </ul>
                  </div>
                </div>
                <div class="lg:w-3/5 relative overflow-hidden bg-black h-[260px] lg:h-full">
                  <div class="project-carousel h-full" id="carousel-karyakarsa" data-current="0">
                    <div class="carousel-track flex h-full transition-transform duration-500 ease-in-out">
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Kopi Karya Karsa/images/image_01.jpg" alt="Karya Karsa 1" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Kopi Karya Karsa/images/image_02.jpg" alt="Karya Karsa 2" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Kopi Karya Karsa/images/image_03.jpg" alt="Karya Karsa 3" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Kopi Karya Karsa/images/image_04.jpg" alt="Karya Karsa 4" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Kopi Karya Karsa/images/image_05.jpg" alt="Karya Karsa 5" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Kopi Karya Karsa/images/image_06.jpg" alt="Karya Karsa 6" class="w-full h-full object-cover"></div>
                    </div>
                    <button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm">
                      <i class="fa-solid fa-chevron-left text-sm"></i>
                    </button>
                    <button class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm">
                      <i class="fa-solid fa-chevron-right text-sm"></i>
                    </button>
                    <div class="carousel-dots absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-100 cursor-pointer" data-index="0"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="1"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="2"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="3"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="4"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="5"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Madame Sari -->
          <div id="panel-madamesari" class="client-panel hidden">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="flex flex-col lg:flex-row h-full">
                <div class="lg:w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col justify-between">
                  <div>
                    <div class="w-28 h-28 rounded-2xl overflow-hidden shadow-md bg-white flex items-center justify-center mb-6">
                      <img src="/projects/MadameSari/madamesari.jpg" alt="Madame Sari Resto Logo" class="w-full h-full object-contain p-1">
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-1">Madame Sari Resto</h3>
                    <a href="https://www.instagram.com/madamesariresto/" target="_blank" rel="noopener noreferrer" class="text-maroon hover:underline text-sm inline-flex items-center gap-1 mb-6">
                      <i class="fa-brands fa-instagram text-base"></i> @madamesariresto
                    </a>
                    <h4 class="font-semibold text-gray-500 mb-3 text-xs uppercase tracking-widest">Layanan yang diberikan</h4>
                    <ul class="space-y-2">
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Pelatihan Staf</li>
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Rekrutmen SDM</li>
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Pembuatan Menu Makanan</li>
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Penetapan Harga</li>
                    </ul>
                  </div>
                </div>
                <div class="lg:w-3/5 relative overflow-hidden bg-black h-[260px] lg:h-full">
                  <div class="project-carousel h-full" id="carousel-madamesari" data-current="0">
                    <div class="carousel-track flex h-full transition-transform duration-500 ease-in-out">
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/MadameSari/images/image_01.jpg" alt="Madame Sari 1" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/MadameSari/images/image_02.jpg" alt="Madame Sari 2" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/MadameSari/images/image_03.jpg" alt="Madame Sari 3" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/MadameSari/images/image_04.jpg" alt="Madame Sari 4" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/MadameSari/images/image_05.jpg" alt="Madame Sari 5" class="w-full h-full object-cover"></div>
                    </div>
                    <button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm">
                      <i class="fa-solid fa-chevron-left text-sm"></i>
                    </button>
                    <button class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm">
                      <i class="fa-solid fa-chevron-right text-sm"></i>
                    </button>
                    <div class="carousel-dots absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-100 cursor-pointer" data-index="0"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="1"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="2"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="3"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="4"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Serasee Coffee -->
          <div id="panel-serasee" class="client-panel hidden">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="flex flex-col lg:flex-row h-full">
                <div class="lg:w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col justify-between">
                  <div>
                    <div class="w-28 h-28 rounded-2xl overflow-hidden shadow-md bg-white flex items-center justify-center mb-6">
                      <img src="/projects/Serasee Coffee/serasee.jpg" alt="Serasee Coffee Logo" class="w-full h-full object-contain p-2">
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-1">Serasee Coffee</h3>
                    <a href="https://www.instagram.com/serasee.coffee/" target="_blank" rel="noopener noreferrer" class="text-maroon hover:underline text-sm inline-flex items-center gap-1 mb-6">
                      <i class="fa-brands fa-instagram text-base"></i> @serasee.coffee
                    </a>
                    <h4 class="font-semibold text-gray-500 mb-3 text-xs uppercase tracking-widest">Layanan yang diberikan</h4>
                    <ul class="space-y-2">
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Layouting Dapur</li>
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Pengadaan Peralatan Dapur</li>
                      <li class="flex items-center gap-2 text-gray-700 text-sm"><i class="fa-solid fa-circle-check text-maroon text-xs"></i> Rekrutmen SDM</li>
                    </ul>
                  </div>
                </div>
                <div class="lg:w-3/5 relative overflow-hidden bg-black h-[260px] lg:h-full">
                  <div class="project-carousel h-full" id="carousel-serasee" data-current="0">
                    <div class="carousel-track flex h-full transition-transform duration-500 ease-in-out">
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Serasee Coffee/images/image_01.jpg" alt="Serasee 1" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Serasee Coffee/images/image_02.jpg" alt="Serasee 2" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Serasee Coffee/images/image_03.jpg" alt="Serasee 3" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Serasee Coffee/images/image_04.jpg" alt="Serasee 4" class="w-full h-full object-cover"></div>
                      <div class="carousel-slide flex-shrink-0 w-full h-full"><img src="/projects/Serasee Coffee/images/image_05.jpg" alt="Serasee 5" class="w-full h-full object-cover"></div>
                    </div>
                    <button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm">
                      <i class="fa-solid fa-chevron-left text-sm"></i>
                    </button>
                    <button class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm">
                      <i class="fa-solid fa-chevron-right text-sm"></i>
                    </button>
                    <div class="carousel-dots absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-100 cursor-pointer" data-index="0"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="1"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="2"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="3"></span>
                      <span class="dot w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer" data-index="4"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div><!-- end #client-panels -->
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

  // ── Clients: Tab switching ────────────────────────────────────────────
  const tabs = container.querySelectorAll('.client-tab-btn');
  const panels = container.querySelectorAll('.client-panel');

  const switchTab = (targetTab) => {
    tabs.forEach(btn => {
      const isActive = btn.dataset.tab === targetTab;
      btn.classList.toggle('active', isActive);
      btn.classList.toggle('bg-maroon', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('border-maroon', isActive);
      btn.classList.toggle('border-gray-200', !isActive);
      btn.classList.toggle('text-gray-600', !isActive);
    });
    panels.forEach(panel => {
      panel.classList.toggle('hidden', panel.id !== `panel-${targetTab}`);
    });
  };

  tabs.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // ── Clients: Per-carousel init ────────────────────────────────────────
  const initCarousel = (carouselEl) => {
    const track = carouselEl.querySelector('.carousel-track');
    const slides = carouselEl.querySelectorAll('.carousel-slide');
    const dots = carouselEl.querySelectorAll('.dot');
    const prevBtn = carouselEl.querySelector('.carousel-prev');
    const nextBtn = carouselEl.querySelector('.carousel-next');
    const total = slides.length;
    let current = 0;
    let autoTimer = null;

    const goTo = (index) => {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => {
        dot.style.opacity = i === current ? '1' : '0.4';
      });
    };

    const startAuto = () => {
      stopAuto();
      // 5 seconds between slides — comfortable, not rushing
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    };

    const stopAuto = () => {
      if (autoTimer) clearInterval(autoTimer);
    };

    prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    dots.forEach(dot => {
      dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); startAuto(); });
    });

    // Pause on hover
    carouselEl.addEventListener('mouseenter', stopAuto);
    carouselEl.addEventListener('mouseleave', startAuto);

    // Touch/swipe support
    let touchStartX = 0;
    carouselEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carouselEl.addEventListener('touchend', e => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) { goTo(delta > 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });

    startAuto();
  };

  container.querySelectorAll('.project-carousel').forEach(initCarousel);
};
