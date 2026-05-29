const COOKIE_NAME = 'kc_konsultasi_awal';
const COOKIE_MAX_AGE_DAYS = 30;

const getCookie = (name) => {
  const parts = document.cookie.split(';').map(p => p.trim());
  const match = parts.find(p => p.startsWith(`${encodeURIComponent(name)}=`));
  if (!match) return null;
  const raw = match.substring(match.indexOf('=') + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const setCookie = (name, value, { maxAgeDays = COOKIE_MAX_AGE_DAYS } = {}) => {
  const maxAgeSeconds = Math.floor(maxAgeDays * 24 * 60 * 60);
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
};

const readState = () => {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) {
    return {
      bisnis: '',
      tahap: '',
      fokus: [],
      target: [],
      kendala: '',
    };
  }
  try {
    const parsed = JSON.parse(raw);
    const parsedTarget = parsed.target;
    const normalizedTarget = Array.isArray(parsedTarget)
      ? parsedTarget
      : (typeof parsedTarget === 'string' && parsedTarget ? [parsedTarget] : []);
    return {
      bisnis: parsed.bisnis || '',
      tahap: parsed.tahap || '',
      fokus: Array.isArray(parsed.fokus) ? parsed.fokus : [],
      target: normalizedTarget,
      kendala: parsed.kendala || '',
    };
  } catch {
    return {
      bisnis: '',
      tahap: '',
      fokus: [],
      target: [],
      kendala: '',
    };
  }
};

const writeState = (nextState) => {
  setCookie(COOKIE_NAME, JSON.stringify(nextState));
};

const computeRecommendations = (state) => {
  const fokus = new Set(state.fokus || []);
  const target = new Set(state.target || []);
  const recs = [];

  if (state.tahap === 'perencanaan') {
    recs.push('<strong>Langkah awal:</strong> Disarankan sesi <em>Concept Development</em> & <em>Market Research</em> untuk memvalidasi konsep, target pasar, dan proyeksi bisnis.');
  }

  if (fokus.has('menu_engineering') && state.kendala === 'kualitas_menu') {
    recs.push('<strong>Menu Engineering + Kualitas Menu:</strong> Disarankan layanan pengembangan menu, <em>recipe standardization</em>, dan <em>food styling</em>.');
  }

  if (fokus.has('desain_layout') && state.kendala === 'efisiensi_operasional') {
    recs.push('<strong>Desain Dapur + Efisiensi Operasional:</strong> Disarankan layanan <em>kitchen layout</em>, <em>workflow optimization</em>, dan penyusunan SOP.');
  }

  if (fokus.has('branding_marketing') && target.has('anak_muda')) {
    recs.push('<strong>Branding & Marketing + Target Anak Muda:</strong> Disarankan layanan branding, strategi social media, dan food photography.');
  }

  if (fokus.has('keuangan_profit') || state.kendala === 'profitabilitas') {
    recs.push('<strong>Keuangan & Profit:</strong> Disarankan <em>financial planning</em>, cost control, dan strategi pricing untuk meningkatkan margin.');
  }

  if (fokus.has('pelatihan_karyawan')) {
    recs.push('<strong>Pelatihan Karyawan:</strong> Disarankan program training SOP operasional, food safety dasar, dan peningkatan skill service sesuai tipe bisnis.');
  }

  if (recs.length === 0) {
    recs.push('<strong>Rekomendasi awal:</strong> Isi minimal 1 fokus kebutuhan dan 1 kendala utama untuk mendapatkan rekomendasi yang lebih spesifik.');
  }

  return recs;
};

const validateState = (state) => {
  const issues = [];
  if (!state.bisnis) issues.push('Jenis bisnis');
  if (!state.tahap) issues.push('Tahap bisnis');
  if (!state.fokus || state.fokus.length === 0) issues.push('Fokus kebutuhan');
  if (!state.target || state.target.length === 0) issues.push('Target pasar');
  if (!state.kendala) issues.push('Kendala utama');
  return issues;
};

export const renderChecklist = (container) => {
  container.innerHTML = `
    <div class="bg-maroon py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">Konsultasi Awal</h1>
        <p class="text-gray-200">Jawab beberapa pertanyaan singkat. Jawaban Anda akan tersimpan otomatis sehingga tidak hilang saat berpindah submenu.</p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-12">
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <!-- Tabs (segmented) -->
        <div class="mb-8" role="tablist" aria-label="Submenu Konsultasi">
          <div class="relative w-full rounded-xl border border-gray-200 bg-gray-50 p-1 grid grid-cols-3">
            <div id="kc-tab-indicator" class="absolute top-1 bottom-1 left-1 rounded-lg bg-maroon transition-transform duration-300 ease-out" style="width: calc((100% - 0.5rem) / 3); transform: translateX(0%);"></div>

            <button type="button" class="kc-tab relative z-10 px-3 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors" data-tab="awal" role="tab" aria-selected="true">
              Pertanyaan Awal
            </button>
            <button type="button" class="kc-tab relative z-10 px-3 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors" data-tab="fokus" role="tab" aria-selected="false">
              Fokus Kebutuhan
            </button>
            <button type="button" class="kc-tab relative z-10 px-3 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors" data-tab="target" role="tab" aria-selected="false">
              Target & Kendala
            </button>
          </div>
        </div>

        <form id="konsultasi-form" class="space-y-8" novalidate>
          <!-- Panel: Pertanyaan Awal -->
          <div class="kc-panel" data-panel="awal">
            <div class="space-y-6">
              <div>
                <label class="block text-gray-700 font-bold mb-2">Jenis bisnis kuliner <span class="text-red-500">*</span></label>
                <div class="space-y-2">
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="bisnis" value="restoran" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Restoran</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="bisnis" value="kafe" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Kafe</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="bisnis" value="bakery" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Bakery</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="bisnis" value="catering" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Catering</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="bisnis" value="hunian_premium" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Hunian Premium</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-bold mb-2">Tahap bisnis <span class="text-red-500">*</span></label>
                <div class="space-y-2">
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="tahap" value="perencanaan" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Perencanaan</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="tahap" value="baru_berjalan" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Baru berjalan</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="tahap" value="lama" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Sudah beroperasi lama</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel: Fokus Kebutuhan -->
          <div class="kc-panel hidden" data-panel="fokus">
            <div>
              <label class="block text-gray-700 font-bold mb-2">Fokus kebutuhan <span class="text-red-500">*</span></label>
              <p class="text-sm text-gray-500 mb-4">Boleh pilih lebih dari satu.</p>
              <div class="space-y-2">
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="fokus" value="desain_layout" class="text-maroon rounded focus:ring-maroon h-4 w-4">
                  <span>Desain dapur & layout</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="fokus" value="menu_engineering" class="text-maroon rounded focus:ring-maroon h-4 w-4">
                  <span>Menu engineering</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="fokus" value="pelatihan_karyawan" class="text-maroon rounded focus:ring-maroon h-4 w-4">
                  <span>Pelatihan karyawan</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="fokus" value="branding_marketing" class="text-maroon rounded focus:ring-maroon h-4 w-4">
                  <span>Branding & marketing</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="fokus" value="keuangan_profit" class="text-maroon rounded focus:ring-maroon h-4 w-4">
                  <span>Keuangan & profit</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Panel: Target Pasar & Kendala Utama -->
          <div class="kc-panel hidden" data-panel="target">
            <div class="space-y-6">
              <div>
                <label class="block text-gray-700 font-bold mb-2">Target pasar <span class="text-red-500">*</span></label>
                <p class="text-sm text-gray-500 mb-4">Boleh pilih lebih dari satu.</p>
                <div class="space-y-2">
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" name="target" value="keluarga" class="text-maroon rounded focus:ring-maroon h-4 w-4">
                    <span>Segmen keluarga</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" name="target" value="anak_muda" class="text-maroon rounded focus:ring-maroon h-4 w-4">
                    <span>Anak muda</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" name="target" value="profesional" class="text-maroon rounded focus:ring-maroon h-4 w-4">
                    <span>Profesional</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" name="target" value="premium" class="text-maroon rounded focus:ring-maroon h-4 w-4">
                    <span>Premium</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-bold mb-2">Kendala utama <span class="text-red-500">*</span></label>
                <div class="space-y-2">
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="kendala" value="efisiensi_operasional" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Efisiensi operasional</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="kendala" value="kualitas_menu" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Kualitas menu</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="kendala" value="brand_awareness" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Brand awareness</span>
                  </label>
                  <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="kendala" value="profitabilitas" class="text-maroon focus:ring-maroon h-4 w-4">
                    <span>Profitabilitas</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <div id="konsultasi-warning" class="hidden mb-4 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900"></div>
            <button type="submit" class="w-full bg-maroon text-white font-bold py-3 rounded-lg hover:bg-maroon-dark transition-colors shadow-md">
              Lihat Rekomendasi
            </button>
            <button type="button" id="konsultasi-reset" class="w-full mt-3 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Reset Jawaban
            </button>
          </div>
        </form>

        <div id="konsultasi-result" class="hidden mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <h3 class="text-xl font-bold text-green-800 mb-3"><i class="fa-solid fa-check-circle mr-2"></i> Rekomendasi Awal</h3>
          <div id="konsultasi-result-content" class="text-gray-700 space-y-4"></div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('konsultasi-form');
  const tabs = Array.from(document.querySelectorAll('.kc-tab'));
  const panels = Array.from(document.querySelectorAll('.kc-panel'));
  const indicator = document.getElementById('kc-tab-indicator');
  const warningEl = document.getElementById('konsultasi-warning');
  const resetBtn = document.getElementById('konsultasi-reset');
  const resultDiv = document.getElementById('konsultasi-result');
  const resultContent = document.getElementById('konsultasi-result-content');

  const TAB_ORDER = ['awal', 'fokus', 'target'];
  const setActiveTab = (tabKey) => {
    const idx = Math.max(0, TAB_ORDER.indexOf(tabKey));
    if (indicator) {
      indicator.style.transform = `translateX(${idx * 100}%)`;
    }
    tabs.forEach(btn => {
      const isActive = btn.dataset.tab === tabKey;
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('text-gray-700', !isActive);
      btn.classList.toggle('hover:text-gray-900', !isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach(panel => {
      panel.classList.toggle('hidden', panel.dataset.panel !== tabKey);
    });
  };

  const applyStateToForm = (state) => {
    // radio bisnis
    const bisnisRadio = form.querySelector(`input[name="bisnis"][value="${state.bisnis}"]`);
    if (bisnisRadio) bisnisRadio.checked = true;

    // radio tahap
    const tahapRadio = form.querySelector(`input[name="tahap"][value="${state.tahap}"]`);
    if (tahapRadio) tahapRadio.checked = true;

    // fokus checkboxes
    const fokusSet = new Set(state.fokus || []);
    form.querySelectorAll('input[name="fokus"]').forEach((cb) => {
      cb.checked = fokusSet.has(cb.value);
    });

    // target checkboxes
    const targetSet = new Set(state.target || []);
    form.querySelectorAll('input[name="target"]').forEach((cb) => {
      cb.checked = targetSet.has(cb.value);
    });

    // radio kendala
    const kendalaRadio = form.querySelector(`input[name="kendala"][value="${state.kendala}"]`);
    if (kendalaRadio) kendalaRadio.checked = true;
  };

  const state = readState();
  if (form) applyStateToForm(state);
  setActiveTab('awal');

  // Tab switching
  tabs.forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  const syncToCookie = () => {
    const data = new FormData(form);
    const next = {
      bisnis: data.get('bisnis') || '',
      tahap: data.get('tahap') || '',
      fokus: data.getAll('fokus'),
      target: data.getAll('target'),
      kendala: data.get('kendala') || '',
    };
    writeState(next);
    return next;
  };

  // Persist on every change so switching tab won't lose anything even if rerendered later
  form.addEventListener('change', () => {
    syncToCookie();
    if (warningEl) warningEl.classList.add('hidden');
  });

  // Submit => compute recommendations
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const next = syncToCookie();
    const issues = validateState(next);
    if (issues.length > 0) {
      warningEl.innerHTML = `<strong>Lengkapi dulu:</strong> ${issues.join(', ')}.`;
      warningEl.classList.remove('hidden');
      resultDiv.classList.add('hidden');

      // Auto switch to first incomplete tab so user can see missing inputs
      if (!next.bisnis || !next.tahap) {
        setActiveTab('awal');
      } else if (!next.fokus || next.fokus.length === 0) {
        setActiveTab('fokus');
      } else {
        setActiveTab('target');
      }

      if (warningEl && warningEl.scrollIntoView) {
        warningEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    const recs = computeRecommendations(next);
    resultContent.innerHTML = recs.map(r => `<p class="border-l-4 border-green-500 pl-4 py-1">${r}</p>`).join('');
    resultDiv.classList.remove('hidden');
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const empty = { bisnis: '', tahap: '', fokus: [], target: [], kendala: '' };
      writeState(empty);
      form.reset();
      if (warningEl) warningEl.classList.add('hidden');
      if (resultDiv) resultDiv.classList.add('hidden');
      setActiveTab('awal');
    });
  }
};
