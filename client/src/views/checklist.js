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

const readJsonCookie = (cookieName, fallback) => {
  const raw = getCookie(cookieName);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJsonCookie = (cookieName, value) => {
  setCookie(cookieName, JSON.stringify(value));
};

const ensureArray = (value) => (Array.isArray(value) ? value : (value ? [value] : []));

const renderRecommendationList = (targetEl, recs) => {
  targetEl.innerHTML = recs.map(r => `<p class="border-l-4 border-green-500 pl-4 py-1">${r}</p>`).join('');
};

const renderWarning = (warningEl, issues) => {
  warningEl.innerHTML = `<strong>Lengkapi dulu:</strong> ${issues.join(', ')}.`;
  warningEl.classList.remove('hidden');
  if (warningEl.scrollIntoView) warningEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ───────────────────────────────────────────────────────────────
// Quiz 1: Jenis Bisnis
// ───────────────────────────────────────────────────────────────
const COOKIE_CONSULT = 'kc_quiz_consultasi_interaktif';

const readConsultState = () => {
  const fallback = {
    bisnis: '',
    tahap: '',
    fokus: [],
    target: [],
    kendala: '',
  };
  const parsed = readJsonCookie(COOKIE_CONSULT, fallback);
  return {
    ...fallback,
    ...parsed,
    fokus: ensureArray(parsed?.fokus),
    target: ensureArray(parsed?.target),
  };
};

const validateConsult = (s) => {
  const issues = [];
  if (!s.bisnis) issues.push('Jenis bisnis');
  if (!s.tahap) issues.push('Tahap bisnis');
  if (!s.fokus || s.fokus.length === 0) issues.push('Fokus kebutuhan');
  if (!s.target || s.target.length === 0) issues.push('Target pasar');
  if (!s.kendala) issues.push('Kendala utama');
  return issues;
};

const computeConsultRecs = (s) => {
  const fokus = new Set(s.fokus || []);
  const target = new Set(s.target || []);
  const recs = [];

  if (fokus.has('menu_engineering') && s.kendala === 'kualitas_menu') {
    recs.push('<strong>Menu Engineering + Kualitas Menu:</strong> Disarankan layanan pengembangan menu, <em>recipe standardization</em>, dan <em>food styling</em>.');
  }

  if (fokus.has('desain_layout') && s.kendala === 'efisiensi_operasional') {
    recs.push('<strong>Desain Dapur + Efisiensi Operasional:</strong> Disarankan layanan <em>kitchen layout</em>, <em>workflow optimization</em>, dan SOP.');
  }

  if (fokus.has('branding_marketing') && target.has('anak_muda')) {
    recs.push('<strong>Branding & Marketing + Target Anak Muda:</strong> Disarankan layanan branding, social media strategy, dan food photography.');
  }

  if (fokus.has('keuangan_profit') || s.kendala === 'profitabilitas') {
    recs.push('<strong>Keuangan & Profitabilitas:</strong> Disarankan <em>financial planning</em>, cost control, dan strategi pricing.');
  }

  if (fokus.has('pelatihan_karyawan')) {
    recs.push('<strong>Pelatihan karyawan:</strong> Disarankan training SOP operasional, peningkatan skill service, dan standard kualitas.');
  }

  if (recs.length === 0) {
    recs.push('<strong>Rekomendasi awal:</strong> Disarankan sesi pemetaan kebutuhan detail agar rekomendasi layanan bisa lebih spesifik dan tepat sasaran.');
  }

  return recs;
};

const renderConsultQuiz = (hostEl) => {
  const state = readConsultState();
  hostEl.innerHTML = `
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Jenis Bisnis</h2>
        <p class="text-gray-600">Jawab ceklist singkat untuk mendapatkan rekomendasi layanan secara otomatis.</p>
      </div>

      <form data-form class="space-y-8" novalidate>
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Pertanyaan Awal</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Jenis bisnis kuliner <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="bisnis" value="restoran" class="text-maroon focus:ring-maroon h-4 w-4"><span>Restoran</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="bisnis" value="kafe" class="text-maroon focus:ring-maroon h-4 w-4"><span>Kafe</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="bisnis" value="bakery" class="text-maroon focus:ring-maroon h-4 w-4"><span>Bakery</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="bisnis" value="catering" class="text-maroon focus:ring-maroon h-4 w-4"><span>Catering</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="bisnis" value="hunian_premium" class="text-maroon focus:ring-maroon h-4 w-4"><span>Hunian Premium</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Tahap bisnis <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="tahap" value="perencanaan" class="text-maroon focus:ring-maroon h-4 w-4"><span>Perencanaan</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="tahap" value="baru_berjalan" class="text-maroon focus:ring-maroon h-4 w-4"><span>Baru berjalan</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="tahap" value="lama" class="text-maroon focus:ring-maroon h-4 w-4"><span>Sudah beroperasi lama</span></label>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Fokus Kebutuhan</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Fokus kebutuhan <span class="text-red-500">*</span></label>
            <p class="text-sm text-gray-500 mb-4">Boleh pilih lebih dari satu.</p>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="fokus" value="desain_layout" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Desain dapur & layout</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="fokus" value="menu_engineering" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Menu engineering</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="fokus" value="pelatihan_karyawan" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Pelatihan karyawan</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="fokus" value="branding_marketing" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Branding & marketing</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="fokus" value="keuangan_profit" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Keuangan & profit</span></label>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Target Pasar</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Target pasar <span class="text-red-500">*</span></label>
            <p class="text-sm text-gray-500 mb-4">Boleh pilih lebih dari satu.</p>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="target" value="keluarga" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Segmen keluarga</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="target" value="anak_muda" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Anak muda</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="target" value="profesional" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Profesional</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="target" value="premium" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Premium</span></label>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Kendala Utama</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Kendala utama <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="kendala" value="efisiensi_operasional" class="text-maroon focus:ring-maroon h-4 w-4"><span>Efisiensi operasional</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="kendala" value="kualitas_menu" class="text-maroon focus:ring-maroon h-4 w-4"><span>Kualitas menu</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="kendala" value="brand_awareness" class="text-maroon focus:ring-maroon h-4 w-4"><span>Brand awareness</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="kendala" value="profitabilitas" class="text-maroon focus:ring-maroon h-4 w-4"><span>Profitabilitas</span></label>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <div data-warning class="hidden mb-4 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900"></div>
          <button type="submit" class="w-full bg-maroon text-white font-bold py-3 rounded-lg hover:bg-maroon-dark transition-colors shadow-md">Lihat Rekomendasi</button>
          <button type="button" data-reset class="w-full mt-3 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">Reset Jawaban</button>
        </div>
      </form>

      <div data-result class="hidden mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
        <h3 class="text-xl font-bold text-green-800 mb-3"><i class="fa-solid fa-check-circle mr-2"></i> Rekomendasi</h3>
        <div data-result-content class="text-gray-700 space-y-4"></div>
      </div>
    </div>
  `;

  const form = hostEl.querySelector('[data-form]');
  const warningEl = hostEl.querySelector('[data-warning]');
  const resetBtn = hostEl.querySelector('[data-reset]');
  const resultDiv = hostEl.querySelector('[data-result]');
  const resultContent = hostEl.querySelector('[data-result-content]');

  const applyState = (s) => {
    const setRadio = (name, value) => {
      if (!value) return;
      const el = form.querySelector(`input[name="${name}"][value="${value}"]`);
      if (el) el.checked = true;
    };
    setRadio('bisnis', s.bisnis);
    setRadio('tahap', s.tahap);
    setRadio('kendala', s.kendala);

    const fokusSet = new Set(s.fokus || []);
    form.querySelectorAll('input[name="fokus"]').forEach(cb => (cb.checked = fokusSet.has(cb.value)));
    const targetSet = new Set(s.target || []);
    form.querySelectorAll('input[name="target"]').forEach(cb => (cb.checked = targetSet.has(cb.value)));
  };

  applyState(state);

  const sync = () => {
    const data = new FormData(form);
    const next = {
      bisnis: data.get('bisnis') || '',
      tahap: data.get('tahap') || '',
      fokus: data.getAll('fokus'),
      target: data.getAll('target'),
      kendala: data.get('kendala') || '',
    };
    writeJsonCookie(COOKIE_CONSULT, next);
    return next;
  };

  form.addEventListener('change', () => {
    sync();
    warningEl.classList.add('hidden');
    resultDiv.classList.add('hidden');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const next = sync();
    const issues = validateConsult(next);
    if (issues.length > 0) {
      renderWarning(warningEl, issues);
      resultDiv.classList.add('hidden');
      return;
    }
    const recs = computeConsultRecs(next);
    renderRecommendationList(resultContent, recs);
    resultDiv.classList.remove('hidden');
  });

  resetBtn.addEventListener('click', () => {
    const empty = {
      bisnis: '',
      tahap: '',
      fokus: [],
      target: [],
      kendala: '',
    };
    writeJsonCookie(COOKIE_CONSULT, empty);
    form.reset();
    warningEl.classList.add('hidden');
    resultDiv.classList.add('hidden');
  });
};

// ───────────────────────────────────────────────────────────────
// Quiz 2: Alur Kerja & Ventilasi
// ───────────────────────────────────────────────────────────────
const COOKIE_WORKFLOW = 'kc_quiz_workflow_ventilasi';

const readWorkflowState = () => {
  const fallback = {
    jenis_dapur: '',
    workflow_ada: '',
    efisiensi_ruang: '',
    zoning: '',
    sop: '',
    ventilasi_jenis: '',
    ventilasi_kapasitas: '',
    sirkulasi: '',
    suhu: '',
    perawatan: '',
  };
  return { ...fallback, ...readJsonCookie(COOKIE_WORKFLOW, fallback) };
};

const validateWorkflow = (s) => {
  const issues = [];
  if (!s.jenis_dapur) issues.push('Jenis dapur');
  if (!s.workflow_ada) issues.push('Alur produksi');
  if (!s.efisiensi_ruang) issues.push('Efisiensi ruang');
  if (!s.zoning) issues.push('Zoning area');
  if (!s.sop) issues.push('SOP operasional');
  if (!s.ventilasi_jenis) issues.push('Jenis ventilasi');
  if (!s.ventilasi_kapasitas) issues.push('Kapasitas ventilasi');
  if (!s.sirkulasi) issues.push('Sirkulasi udara');
  if (!s.suhu) issues.push('Pengendalian suhu');
  if (!s.perawatan) issues.push('Filter & perawatan');
  return issues;
};

const computeWorkflowRecs = (s) => {
  const recs = [];
  const isNo = (v) => v === 'tidak';

  if (isNo(s.workflow_ada) || isNo(s.efisiensi_ruang) || isNo(s.zoning)) {
    recs.push('<strong>Workflow belum efisien:</strong> Disarankan layanan <em>kitchen layout</em> & <em>workflow optimization</em>.');
  }

  if (s.ventilasi_jenis === 'alami' || isNo(s.ventilasi_kapasitas) || isNo(s.sirkulasi) || isNo(s.suhu)) {
    recs.push('<strong>Ventilasi perlu ditingkatkan:</strong> Disarankan instalasi exhaust hood & ducting dengan kapasitas sesuai kebutuhan.');
  }

  if (isNo(s.sop)) {
    recs.push('<strong>SOP belum ada:</strong> Disarankan penyusunan SOP operasional & training staf.');
  }

  if (isNo(s.perawatan)) {
    recs.push('<strong>Filter & perawatan:</strong> Disarankan jadwal rutin pembersihan filter dan pemeliharaan berkala untuk menjaga performa ventilasi.');
  }

  if (recs.length === 0) {
    recs.push('<strong>Kondisi awal terlihat baik:</strong> Tetap lakukan audit detail untuk memastikan kapasitas, zoning, dan SOP sesuai kebutuhan operasi.');
  }

  return recs;
};

const renderWorkflowQuiz = (hostEl) => {
  const state = readWorkflowState();
  hostEl.innerHTML = `
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Alur Kerja & Ventilasi</h2>
        <p class="text-gray-600">Cek cepat untuk melihat kebutuhan layout, workflow, dan sistem udara dapur.</p>
      </div>

      <form data-form class="space-y-8" novalidate>
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Alur Kerja Dapur</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Jenis dapur <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="jenis_dapur" value="komersial" class="text-maroon focus:ring-maroon h-4 w-4"><span>Dapur komersial (restoran/kafe)</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="jenis_dapur" value="hunian_premium" class="text-maroon focus:ring-maroon h-4 w-4"><span>Dapur hunian premium</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Alur produksi sudah ada? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="workflow_ada" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="workflow_ada" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Efisiensi ruang sudah mendukung pergerakan staf? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="efisiensi_ruang" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="efisiensi_ruang" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Zoning area sudah dipisahkan? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="zoning" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya (prep / cooking / plating / dishwashing)</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="zoning" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">SOP operasional sudah ada? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="sop" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="sop" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Ventilasi & Sistem Udara</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Jenis ventilasi <span class="text-red-500">*</span></label>
            <select name="ventilasi_jenis" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon bg-white">
              <option value="">Pilih...</option>
              <option value="hood_ducting">Exhaust hood + ducting</option>
              <option value="exhaust">Exhaust fan (tanpa hood)</option>
              <option value="alami">Ventilasi alami</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Kapasitas ventilasi memadai? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="ventilasi_kapasitas" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="ventilasi_kapasitas" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Sirkulasi udara masuk & keluar seimbang? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="sirkulasi" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="sirkulasi" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Ventilasi membantu menjaga suhu dapur? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="suhu" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="suhu" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Filter & perawatan rutin sudah ada? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="perawatan" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya (ada jadwal rutin)</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="perawatan" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <div data-warning class="hidden mb-4 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900"></div>
          <button type="submit" class="w-full bg-maroon text-white font-bold py-3 rounded-lg hover:bg-maroon-dark transition-colors shadow-md">Lihat Rekomendasi</button>
          <button type="button" data-reset class="w-full mt-3 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">Reset Jawaban</button>
        </div>
      </form>

      <div data-result class="hidden mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
        <h3 class="text-xl font-bold text-green-800 mb-3"><i class="fa-solid fa-check-circle mr-2"></i> Rekomendasi</h3>
        <div data-result-content class="text-gray-700 space-y-4"></div>
      </div>
    </div>
  `;

  const form = hostEl.querySelector('[data-form]');
  const warningEl = hostEl.querySelector('[data-warning]');
  const resetBtn = hostEl.querySelector('[data-reset]');
  const resultDiv = hostEl.querySelector('[data-result]');
  const resultContent = hostEl.querySelector('[data-result-content]');

  const applyState = (s) => {
    const setRadio = (name, value) => {
      if (!value) return;
      const el = form.querySelector(`input[name="${name}"][value="${value}"]`);
      if (el) el.checked = true;
    };
    setRadio('jenis_dapur', s.jenis_dapur);
    setRadio('workflow_ada', s.workflow_ada);
    setRadio('efisiensi_ruang', s.efisiensi_ruang);
    setRadio('zoning', s.zoning);
    setRadio('sop', s.sop);
    if (s.ventilasi_jenis) {
      const sel = form.querySelector('select[name="ventilasi_jenis"]');
      if (sel) sel.value = s.ventilasi_jenis;
    }
    setRadio('ventilasi_kapasitas', s.ventilasi_kapasitas);
    setRadio('sirkulasi', s.sirkulasi);
    setRadio('suhu', s.suhu);
    setRadio('perawatan', s.perawatan);
  };
  applyState(state);

  const sync = () => {
    const data = new FormData(form);
    const next = {
      jenis_dapur: data.get('jenis_dapur') || '',
      workflow_ada: data.get('workflow_ada') || '',
      efisiensi_ruang: data.get('efisiensi_ruang') || '',
      zoning: data.get('zoning') || '',
      sop: data.get('sop') || '',
      ventilasi_jenis: data.get('ventilasi_jenis') || '',
      ventilasi_kapasitas: data.get('ventilasi_kapasitas') || '',
      sirkulasi: data.get('sirkulasi') || '',
      suhu: data.get('suhu') || '',
      perawatan: data.get('perawatan') || '',
    };
    writeJsonCookie(COOKIE_WORKFLOW, next);
    return next;
  };

  form.addEventListener('change', () => {
    sync();
    warningEl.classList.add('hidden');
    resultDiv.classList.add('hidden');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const next = sync();
    const issues = validateWorkflow(next);
    if (issues.length > 0) {
      renderWarning(warningEl, issues);
      resultDiv.classList.add('hidden');
      return;
    }
    const recs = computeWorkflowRecs(next);
    renderRecommendationList(resultContent, recs);
    resultDiv.classList.remove('hidden');
  });

  resetBtn.addEventListener('click', () => {
    // Clear explicitly
    writeJsonCookie(COOKIE_WORKFLOW, {
      jenis_dapur: '',
      workflow_ada: '',
      efisiensi_ruang: '',
      zoning: '',
      sop: '',
      ventilasi_jenis: '',
      ventilasi_kapasitas: '',
      sirkulasi: '',
      suhu: '',
      perawatan: '',
    });
    form.reset();
    warningEl.classList.add('hidden');
    resultDiv.classList.add('hidden');
  });
};

// ───────────────────────────────────────────────────────────────
// Quiz 3: Operasional
// ───────────────────────────────────────────────────────────────
const COOKIE_INTERAKSI = 'kc_quiz_interaksi_awal';

const readInteraksiState = () => {
  const fallback = {
    konsep: '',
    jenis_usaha: '',
    luas_area: '',
    jumlah_kursi: '',
    anggaran: '',
    prioritas: [],
    workflow_ada: '',
    ventilasi_ok: '',
    peralatan_ada: '',
    jumlah_staf: '',
    pelatihan_butuh: '',
    target: [],
    tantangan: '',
    timeline: '',
  };
  const parsed = readJsonCookie(COOKIE_INTERAKSI, fallback);
  return {
    ...fallback,
    ...parsed,
    prioritas: ensureArray(parsed?.prioritas),
    target: ensureArray(parsed?.target),
  };
};

const validateInteraksi = (s) => {
  const issues = [];
  if (!s.konsep) issues.push('Konsep bisnis');
  if (!s.jenis_usaha) issues.push('Jenis usaha');
  if (!s.luas_area) issues.push('Luas area');
  if (!s.jumlah_kursi) issues.push('Jumlah kursi');
  if (!s.anggaran) issues.push('Kisaran anggaran');
  if (!s.prioritas || s.prioritas.length === 0) issues.push('Prioritas investasi');
  if (!s.workflow_ada) issues.push('Alur kerja dapur');
  if (!s.ventilasi_ok) issues.push('Ventilasi & suhu');
  if (!s.peralatan_ada) issues.push('Daftar peralatan utama');
  if (!s.jumlah_staf) issues.push('Jumlah staf');
  if (!s.pelatihan_butuh) issues.push('Pelatihan karyawan');
  if (!s.target || s.target.length === 0) issues.push('Target pasar');
  if (!s.tantangan) issues.push('Tantangan utama');
  if (!s.timeline) issues.push('Timeline peluncuran');
  return issues;
};

const computeInteraksiRecs = (s) => {
  const recs = [];
  const target = new Set(s.target || []);
  const luas = Number(s.luas_area);

  if (s.konsep === 'ide') {
    recs.push('<strong>Konsep belum ada:</strong> Disarankan layanan <em>Concept Development</em> & <em>Market Research</em>.');
  }

  if (!Number.isNaN(luas) && luas >= 50 && s.workflow_ada === 'tidak') {
    recs.push('<strong>Area luas + workflow belum jelas:</strong> Disarankan <em>Kitchen Layout</em> & <em>Workflow Optimization</em>.');
  }

  if (s.anggaran === 'lt_10' || s.anggaran === '10_25') {
    recs.push('<strong>Budget terbatas:</strong> Disarankan paket konsultasi dasar + menu engineering (prioritaskan yang paling berdampak).');
  }

  if (target.has('premium')) {
    recs.push('<strong>Target premium:</strong> Disarankan branding, interior premium, dan strategi digital marketing.');
  }

  if (s.ventilasi_ok === 'tidak') {
    recs.push('<strong>Ventilasi belum memadai:</strong> Disarankan review kapasitas hood/exhaust dan perbaikan sirkulasi udara demi kenyamanan staf.');
  }

  if (s.pelatihan_butuh === 'butuh') {
    recs.push('<strong>Penguatan tim:</strong> Disarankan program training SOP operasional & service untuk menyamakan standar kerja.');
  }

  if (s.peralatan_ada === 'tidak') {
    recs.push('<strong>Peralatan utama:</strong> Disarankan penyusunan daftar equipment prioritas sesuai menu dan kapasitas produksi.');
  }

  if (recs.length === 0) {
    recs.push('<strong>Rekomendasi awal:</strong> Disarankan sesi pemetaan kebutuhan untuk menyusun scope pekerjaan dan prioritas investasi.');
  }

  return recs;
};

const renderInteraksiQuiz = (hostEl) => {
  const state = readInteraksiState();
  hostEl.innerHTML = `
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Operasional</h2>
        <p class="text-gray-600">Jawab pertanyaan berikut untuk menyusun saran awal dan prioritas kerja.</p>
      </div>

      <form data-form class="space-y-8" novalidate>
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Konsep & Area</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Konsep bisnis <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="konsep" value="sudah_ada" class="text-maroon focus:ring-maroon h-4 w-4"><span>Sudah ada konsep</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="konsep" value="ide" class="text-maroon focus:ring-maroon h-4 w-4"><span>Masih tahap ide</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Jenis usaha <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="jenis_usaha" value="restoran" class="text-maroon focus:ring-maroon h-4 w-4"><span>Restoran</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="jenis_usaha" value="kafe" class="text-maroon focus:ring-maroon h-4 w-4"><span>Kafe</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="jenis_usaha" value="bakery" class="text-maroon focus:ring-maroon h-4 w-4"><span>Bakery</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="jenis_usaha" value="catering" class="text-maroon focus:ring-maroon h-4 w-4"><span>Catering</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="jenis_usaha" value="hunian_premium" class="text-maroon focus:ring-maroon h-4 w-4"><span>Hunian Premium</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Luas area (m²) <span class="text-red-500">*</span></label>
            <input type="number" min="1" name="luas_area" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon bg-white" placeholder="Contoh: 60">
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Jumlah kursi <span class="text-red-500">*</span></label>
            <input type="number" min="1" name="jumlah_kursi" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon bg-white" placeholder="Contoh: 40">
          </div>
        </div>

        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Budget & Investasi</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Kisaran anggaran <span class="text-red-500">*</span></label>
            <select name="anggaran" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon bg-white">
              <option value="">Pilih...</option>
              <option value="lt_10">&lt; Rp 10 juta</option>
              <option value="10_25">Rp 10–25 juta</option>
              <option value="25_50">Rp 25–50 juta</option>
              <option value="50_100">Rp 50–100 juta</option>
              <option value="gt_100">&gt; Rp 100 juta</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Prioritas investasi <span class="text-red-500">*</span></label>
            <p class="text-sm text-gray-500 mb-4">Boleh pilih lebih dari satu.</p>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="prioritas" value="dapur" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Dapur</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="prioritas" value="interior" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Interior</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="prioritas" value="menu" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Menu</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="prioritas" value="sdm" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>SDM</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="prioritas" value="branding" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Branding & Marketing</span></label>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Operasional & Workflow</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Alur kerja dapur sudah ada? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="workflow_ada" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="workflow_ada" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Ventilasi & suhu sudah memadai? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="ventilasi_ok" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="ventilasi_ok" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Daftar peralatan utama sudah ada? <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="peralatan_ada" value="ya" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ya</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="peralatan_ada" value="tidak" class="text-maroon focus:ring-maroon h-4 w-4"><span>Belum</span></label>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Tim & SDM</h3>
          <div>
            <label class="block text-gray-700 font-bold mb-2">Jumlah staf (dapur + pelayanan) <span class="text-red-500">*</span></label>
            <input type="number" min="1" name="jumlah_staf" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon bg-white" placeholder="Contoh: 8">
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Pelatihan karyawan <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="pelatihan_butuh" value="sudah_ada" class="text-maroon focus:ring-maroon h-4 w-4"><span>Sudah ada program training</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="pelatihan_butuh" value="butuh" class="text-maroon focus:ring-maroon h-4 w-4"><span>Membutuhkan pelatihan dari kami</span></label>
            </div>
          </div>

        </div>

        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Strategi Bisnis</h3>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Target pasar <span class="text-red-500">*</span></label>
            <p class="text-sm text-gray-500 mb-4">Boleh pilih lebih dari satu.</p>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="target" value="keluarga" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Keluarga</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="target" value="anak_muda" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Anak muda</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="target" value="profesional" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Profesional</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" name="target" value="premium" class="text-maroon rounded focus:ring-maroon h-4 w-4"><span>Premium</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Tantangan utama <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="tantangan" value="efisiensi_operasional" class="text-maroon focus:ring-maroon h-4 w-4"><span>Efisiensi operasional</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="tantangan" value="kualitas_menu" class="text-maroon focus:ring-maroon h-4 w-4"><span>Kualitas menu</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="tantangan" value="branding" class="text-maroon focus:ring-maroon h-4 w-4"><span>Branding</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="tantangan" value="profitabilitas" class="text-maroon focus:ring-maroon h-4 w-4"><span>Profitabilitas</span></label>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">Timeline peluncuran <span class="text-red-500">*</span></label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="timeline" value="segera" class="text-maroon focus:ring-maroon h-4 w-4"><span>Ingin segera launching</span></label>
              <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"><input type="radio" name="timeline" value="jangka_panjang" class="text-maroon focus:ring-maroon h-4 w-4"><span>Fokus strategi jangka panjang</span></label>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <div data-warning class="hidden mb-4 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900"></div>
          <button type="submit" class="w-full bg-maroon text-white font-bold py-3 rounded-lg hover:bg-maroon-dark transition-colors shadow-md">Lihat Rekomendasi</button>
          <button type="button" data-reset class="w-full mt-3 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">Reset Jawaban</button>
        </div>
      </form>

      <div data-result class="hidden mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
        <h3 class="text-xl font-bold text-green-800 mb-3"><i class="fa-solid fa-check-circle mr-2"></i> Rekomendasi</h3>
        <div data-result-content class="text-gray-700 space-y-4"></div>
      </div>
    </div>
  `;

  const form = hostEl.querySelector('[data-form]');
  const warningEl = hostEl.querySelector('[data-warning]');
  const resetBtn = hostEl.querySelector('[data-reset]');
  const resultDiv = hostEl.querySelector('[data-result]');
  const resultContent = hostEl.querySelector('[data-result-content]');

  const applyState = (s) => {
    const setRadio = (name, value) => {
      if (!value) return;
      const el = form.querySelector(`input[name="${name}"][value="${value}"]`);
      if (el) el.checked = true;
    };

    setRadio('konsep', s.konsep);
    setRadio('jenis_usaha', s.jenis_usaha);
    if (s.luas_area) form.querySelector('input[name="luas_area"]').value = s.luas_area;
    if (s.jumlah_kursi) form.querySelector('input[name="jumlah_kursi"]').value = s.jumlah_kursi;
    if (s.anggaran) form.querySelector('select[name="anggaran"]').value = s.anggaran;

    const priorSet = new Set(s.prioritas || []);
    form.querySelectorAll('input[name="prioritas"]').forEach(cb => (cb.checked = priorSet.has(cb.value)));

    setRadio('workflow_ada', s.workflow_ada);
    setRadio('ventilasi_ok', s.ventilasi_ok);
    setRadio('peralatan_ada', s.peralatan_ada);
    if (s.jumlah_staf) form.querySelector('input[name="jumlah_staf"]').value = s.jumlah_staf;
    setRadio('pelatihan_butuh', s.pelatihan_butuh);

    const targetSet = new Set(s.target || []);
    form.querySelectorAll('input[name="target"]').forEach(cb => (cb.checked = targetSet.has(cb.value)));

    setRadio('tantangan', s.tantangan);
    setRadio('timeline', s.timeline);
  };
  applyState(state);

  const sync = () => {
    const data = new FormData(form);
    const next = {
      konsep: data.get('konsep') || '',
      jenis_usaha: data.get('jenis_usaha') || '',
      luas_area: data.get('luas_area') || '',
      jumlah_kursi: data.get('jumlah_kursi') || '',
      anggaran: data.get('anggaran') || '',
      prioritas: data.getAll('prioritas'),
      workflow_ada: data.get('workflow_ada') || '',
      ventilasi_ok: data.get('ventilasi_ok') || '',
      peralatan_ada: data.get('peralatan_ada') || '',
      jumlah_staf: data.get('jumlah_staf') || '',
      pelatihan_butuh: data.get('pelatihan_butuh') || '',
      target: data.getAll('target'),
      tantangan: data.get('tantangan') || '',
      timeline: data.get('timeline') || '',
    };
    writeJsonCookie(COOKIE_INTERAKSI, next);
    return next;
  };

  form.addEventListener('change', () => {
    sync();
    warningEl.classList.add('hidden');
    resultDiv.classList.add('hidden');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const next = sync();
    const issues = validateInteraksi(next);
    if (issues.length > 0) {
      renderWarning(warningEl, issues);
      resultDiv.classList.add('hidden');
      return;
    }
    const recs = computeInteraksiRecs(next);
    renderRecommendationList(resultContent, recs);
    resultDiv.classList.remove('hidden');
  });

  resetBtn.addEventListener('click', () => {
    const empty = {
      konsep: '',
      jenis_usaha: '',
      luas_area: '',
      jumlah_kursi: '',
      anggaran: '',
      prioritas: [],
      workflow_ada: '',
      ventilasi_ok: '',
      peralatan_ada: '',
      jumlah_staf: '',
      pelatihan_butuh: '',
      target: [],
      tantangan: '',
      timeline: '',
    };
    writeJsonCookie(COOKIE_INTERAKSI, empty);
    form.reset();
    warningEl.classList.add('hidden');
    resultDiv.classList.add('hidden');
  });
};

// ───────────────────────────────────────────────────────────────
// Page wrapper: choose quiz (separate)
// ───────────────────────────────────────────────────────────────
const COOKIE_ACTIVE_QUIZ = 'kc_quiz_active';
const QUIZ_ORDER = ['consultasi', 'workflow', 'interaksi'];

const readActiveQuiz = () => {
  const q = getCookie(COOKIE_ACTIVE_QUIZ);
  if (q && QUIZ_ORDER.includes(q)) return q;
  return 'consultasi';
};

const writeActiveQuiz = (quizId) => setCookie(COOKIE_ACTIVE_QUIZ, quizId);

export const renderChecklist = (container) => {
  container.innerHTML = `
    <div class="bg-maroon py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">Konsultasi Awal</h1>
        <p class="text-gray-200">Pilih topik yang ingin Anda konsultasikan. Setiap topik terpisah dan jawaban tersimpan otomatis.</p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-12">
      <!-- Quiz Selector (separate quizzes) -->
      <div class="mb-8" role="tablist" aria-label="Pilih Topik">
        <div class="relative w-full rounded-xl border border-gray-200 bg-gray-50 p-1 grid grid-cols-3">
          <div id="kc-quiz-indicator" class="absolute top-1 bottom-1 left-1 rounded-lg bg-maroon transition-transform duration-300 ease-out" style="width: calc((100% - 0.5rem) / 3); transform: translateX(0%);"></div>
          <button type="button" class="kc-quiz-tab relative z-10 px-3 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors" data-quiz="consultasi" role="tab" aria-selected="true">Jenis Bisnis</button>
          <button type="button" class="kc-quiz-tab relative z-10 px-3 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors" data-quiz="workflow" role="tab" aria-selected="false">Alur Kerja & Ventilasi</button>
          <button type="button" class="kc-quiz-tab relative z-10 px-3 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors" data-quiz="interaksi" role="tab" aria-selected="false">Operasional</button>
        </div>
      </div>

      <div id="kc-quiz-host" class="space-y-8"></div>
    </div>
  `;

  const host = document.getElementById('kc-quiz-host');
  const quizTabs = Array.from(document.querySelectorAll('.kc-quiz-tab'));
  const quizIndicator = document.getElementById('kc-quiz-indicator');

  const setActiveQuiz = (quizId) => {
    const normalizedQuizId = QUIZ_ORDER.includes(quizId) ? quizId : QUIZ_ORDER[0];
    const idx = Math.max(0, QUIZ_ORDER.indexOf(normalizedQuizId));
    if (quizIndicator) quizIndicator.style.transform = `translateX(${idx * 100}%)`;

    quizTabs.forEach((btn) => {
      const isActive = btn.dataset.quiz === normalizedQuizId;
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('text-gray-700', !isActive);
      btn.classList.toggle('hover:text-gray-900', !isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    writeActiveQuiz(normalizedQuizId);
    host.innerHTML = '';
    if (normalizedQuizId === 'consultasi') renderConsultQuiz(host);
    else if (normalizedQuizId === 'workflow') renderWorkflowQuiz(host);
    else renderInteraksiQuiz(host);
  };

  quizTabs.forEach(btn => btn.addEventListener('click', () => setActiveQuiz(btn.dataset.quiz)));
  setActiveQuiz(readActiveQuiz());
};
