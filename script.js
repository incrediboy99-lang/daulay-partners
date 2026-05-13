// ====== Data Putusan ======
const decisions = [
    { id:1, category:"perdata", number:"No. 245/Pdt.G/2025/PN.Jkt.Sel", title:"Sengketa Perjanjian Kerjasama Bisnis", parties:"PT Maju Bersama vs CV Karya Mandiri", date:"12 Mei 2026", status:"won", statusLabel:"Dikabulkan", judge:"Dr. H. Ahmad Fauzi, S.H., M.H.", court:"PN Jakarta Selatan", summary:"Majelis hakim mengabulkan gugatan penggugat terkait wanprestasi perjanjian kerjasama bisnis. Tergugat diwajibkan membayar ganti rugi materiil sebesar Rp 2.5 miliar beserta bunga keterlambatan sebesar 6% per tahun." },
    { id:2, category:"pidana", number:"No. 112/Pid.B/2025/PN.Jkt.Pst", title:"Tindak Pidana Penipuan Investasi", parties:"JPU vs Hendra Wijaya", date:"8 Mei 2026", status:"won", statusLabel:"Terbukti Bersalah", judge:"Hj. Siti Nurhaliza, S.H., M.Hum.", court:"PN Jakarta Pusat", summary:"Terdakwa terbukti melakukan tindak pidana penipuan investasi bodong yang merugikan 150 nasabah. Dijatuhi hukuman penjara 8 tahun dan denda Rp 1 miliar subsider 6 bulan kurungan." },
    { id:3, category:"tun", number:"No. 78/G/2025/PTUN.Jkt", title:"Pembatalan Izin Mendirikan Bangunan", parties:"PT Graha Sentosa vs Kepala Dinas PTSP DKI Jakarta", date:"5 Mei 2026", status:"won", statusLabel:"Dikabulkan", judge:"Dr. Bambang Sutrisno, S.H., M.H.", court:"PTUN Jakarta", summary:"Majelis hakim membatalkan keputusan pencabutan IMB. Keputusan dinyatakan cacat prosedur karena tidak memenuhi asas-asas umum pemerintahan yang baik." },
    { id:4, category:"niaga", number:"No. 35/Pdt.Sus-PKPU/2025/PN.Niaga.Jkt.Pst", title:"Permohonan PKPU PT Sejahtera Abadi", parties:"BNI vs PT Sejahtera Abadi", date:"1 Mei 2026", status:"ongoing", statusLabel:"Dalam Proses", judge:"Dr. Ir. Wahyu Prakoso, S.H., M.Kn.", court:"PN Niaga Jakarta Pusat", summary:"Majelis hakim mengabulkan permohonan PKPU Sementara selama 45 hari. Sidang voting rencana perdamaian dijadwalkan 15 Juni 2026." },
    { id:5, category:"perdata", number:"No. 189/Pdt.G/2025/PN.Bdg", title:"Sengketa Kepemilikan Tanah dan Bangunan", parties:"Keluarga Suryadi vs PT Bumi Properti Indonesia", date:"28 Apr 2026", status:"won", statusLabel:"Dikabulkan Sebagian", judge:"H. Ridwan Mansur, S.H., M.H.", court:"PN Bandung", summary:"Gugatan dikabulkan sebagian. Tanah seluas 5.000 m2 dinyatakan sah milik penggugat. Tergugat dihukum menyerahkan tanah dan membayar ganti rugi." },
    { id:6, category:"pidana", number:"No. 67/Pid.Sus-TPK/2025/PN.Jkt.Pst", title:"Tindak Pidana Korupsi Dana Infrastruktur", parties:"KPK vs Ir. Budi Santoso, M.M.", date:"22 Apr 2026", status:"won", statusLabel:"Terbukti Bersalah", judge:"Prof. Dr. Maria Theresia, S.H., LL.M.", court:"Pengadilan Tipikor Jakarta", summary:"Terdakwa terbukti melakukan korupsi proyek infrastruktur senilai Rp 45 miliar. Dijatuhi 12 tahun penjara, denda Rp 500 juta, dan uang pengganti Rp 30 miliar." },
    { id:7, category:"niaga", number:"No. 22/Pdt.Sus-HKI/2025/PN.Niaga.Jkt.Pst", title:"Pelanggaran Merek Dagang Terdaftar", parties:"PT Kopi Nusantara vs CV Kopi Nusantara Jaya", date:"15 Apr 2026", status:"won", statusLabel:"Dikabulkan", judge:"Dr. Lestari Wulandari, S.H., M.H.", court:"PN Niaga Jakarta Pusat", summary:"Tergugat terbukti menggunakan merek dagang dengan persamaan pada pokoknya. Dihukum menghentikan penggunaan merek dan membayar ganti rugi Rp 800 juta." },
    { id:8, category:"tun", number:"No. 55/G/2025/PTUN.Sby", title:"Gugatan Pembatalan SK Pemberhentian PNS", parties:"Drs. Agus Setiawan vs BKD Prov. Jawa Timur", date:"10 Apr 2026", status:"lost", statusLabel:"Ditolak", judge:"H. Supriyanto, S.H., M.H.", court:"PTUN Surabaya", summary:"Majelis hakim menolak gugatan. SK Pemberhentian Tidak Dengan Hormat dinyatakan sah dan sesuai prosedur berdasarkan PP No. 94 Tahun 2021." },
    { id:9, category:"perdata", number:"No. 301/Pdt.G/2025/PN.Jkt.Bar", title:"Sengketa Hak Waris atas Aset Perusahaan", parties:"Keluarga Hartono vs PT Hartono Group", date:"3 Apr 2026", status:"ongoing", statusLabel:"Dalam Proses", judge:"Dr. Dewi Kartika, S.H., M.Kn.", court:"PN Jakarta Barat", summary:"Gugatan waris atas kepemilikan 40% saham PT Hartono Group. Sidang pembuktian masih berlangsung. Sidang berikutnya 20 Juni 2026." }
];

// ====== DOM ======
const grid = document.getElementById('decisionsGrid');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.querySelectorAll('.filter-tab');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const emptyState = document.getElementById('emptyState');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const backToTop = document.getElementById('backToTop');
const scrollProgress = document.getElementById('scrollProgress');
const resultsCount = document.getElementById('resultsCount');

let currentFilter = 'all';
let visibleCount = 6;

// ====== Particles ======
(function initParticles() {
    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize(); window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
            r: Math.random() * 1.5 + .5, a: Math.random() * .4 + .1
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(199,172,120,${p.a})`;
            ctx.fill();
        });
        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(199,172,120,${.06 * (1 - dist / 120)})`;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

// ====== Render Cards ======
function getFiltered() {
    const q = searchInput.value.toLowerCase();
    return decisions.filter(d => {
        const mf = currentFilter === 'all' || d.category === currentFilter;
        const ms = !q || d.number.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || d.parties.toLowerCase().includes(q);
        return mf && ms;
    });
}

function renderCards() {
    const filtered = getFiltered();
    const toShow = filtered.slice(0, visibleCount);
    grid.innerHTML = toShow.map((d, i) => `
        <div class="decision-card" data-id="${d.id}" style="animation-delay:${i * .07}s">
            <div class="card-header">
                <span class="card-badge badge-${d.category}">${d.category.toUpperCase()}</span>
                <span class="card-date">${d.date}</span>
            </div>
            <div class="card-number">${d.number}</div>
            <div class="card-title">${d.title}</div>
            <div class="card-parties">${d.parties}</div>
            <div class="card-footer">
                <div class="card-status status-${d.status}">
                    <span class="status-dot"></span>${d.statusLabel}
                </div>
                <span class="card-link">Detail →</span>
            </div>
        </div>
    `).join('');
    emptyState.style.display = toShow.length === 0 ? 'block' : 'none';
    loadMoreBtn.style.display = filtered.length > visibleCount ? 'block' : 'none';
    resultsCount.textContent = `Menampilkan ${toShow.length} dari ${filtered.length} putusan`;
    document.querySelectorAll('.decision-card').forEach(c => {
        c.addEventListener('click', () => openModal(decisions.find(x => x.id === +c.dataset.id)));
    });
}

// ====== Modal ======
function openModal(d) {
    modalContent.innerHTML = `
        <div class="modal-badge"><span class="card-badge badge-${d.category}">${d.category.toUpperCase()}</span></div>
        <div class="modal-number">${d.number}</div>
        <div class="modal-title">${d.title}</div>
        <div class="modal-meta">
            <div class="meta-item"><span class="meta-label">Pihak</span><span class="meta-value">${d.parties}</span></div>
            <div class="meta-item"><span class="meta-label">Tanggal</span><span class="meta-value">${d.date}</span></div>
            <div class="meta-item"><span class="meta-label">Hakim Ketua</span><span class="meta-value">${d.judge}</span></div>
            <div class="meta-item"><span class="meta-label">Pengadilan</span><span class="meta-value">${d.court}</span></div>
        </div>
        <div class="card-status status-${d.status}" style="margin-bottom:20px;font-size:14px">
            <span class="status-dot"></span>Status: ${d.statusLabel}
        </div>
        <hr class="modal-divider">
        <div class="modal-summary"><h4>Ringkasan Putusan</h4><p>${d.summary}</p></div>
    `;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() { modalOverlay.classList.remove('active'); document.body.style.overflow = ''; }
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ====== Filters ======
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        visibleCount = 6;
        renderCards();
    });
});
searchInput.addEventListener('input', () => { visibleCount = 6; renderCards(); });
loadMoreBtn.addEventListener('click', () => { visibleCount += 6; renderCards(); });

// Category cards
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const cat = card.dataset.category;
        filterTabs.forEach(t => t.classList.toggle('active', t.dataset.filter === cat));
        currentFilter = cat; visibleCount = 6; renderCards();
        document.getElementById('putusan').scrollIntoView({ behavior: 'smooth' });
    });
});

// ====== Scroll events ======
window.addEventListener('scroll', () => {
    const st = window.scrollY;
    navbar.classList.toggle('scrolled', st > 50);
    backToTop.classList.toggle('visible', st > 600);
    // Progress bar
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = h > 0 ? (st / h * 100) + '%' : '0%';
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ====== Mobile nav ======
navToggle.addEventListener('click', () => { navToggle.classList.toggle('active'); navLinks.classList.toggle('open'); });
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { navToggle.classList.remove('active'); navLinks.classList.remove('open'); }));

// ====== Active link ======
const sections = document.querySelectorAll('section[id], header[id]');
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
    navLinks.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

// ====== Counter ======
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = +el.dataset.count; let cur = 0;
        const step = Math.ceil(target / 50);
        const t = setInterval(() => { cur += step; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = cur; }, 30);
    });
}

// ====== Reveal ======
function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: .1 });
    document.querySelectorAll('.category-card, .contact-card, .about-grid, .search-bar').forEach(el => { el.classList.add('reveal'); obs.observe(el); });
}

// ====== Init ======
document.addEventListener('DOMContentLoaded', () => { renderCards(); animateCounters(); initReveal(); });
