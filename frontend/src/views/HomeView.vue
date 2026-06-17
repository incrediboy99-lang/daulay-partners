<template>
<div>
  <div class="scroll-progress" :style="{width: scrollPct+'%'}"></div>
  <nav class="navbar" :class="{scrolled: scrollY>50}">
    <div class="nav-container">
      <router-link to="/" class="nav-logo">
        <div class="logo-icon"><svg viewBox="0 0 40 40" width="32" height="32" fill="none"><path d="M20 4L4 12v4l16 8 16-8v-4L20 4z" fill="url(#g1)" opacity=".9"/><path d="M4 20v4l16 8 16-8v-4L20 28 4 20z" fill="url(#g1)" opacity=".6"/><path d="M4 28v4l16 8 16-8v-4L20 36 4 28z" fill="url(#g1)" opacity=".3"/><defs><linearGradient id="g1" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#3ec97a"/><stop offset="1" stop-color="#165c38"/></linearGradient></defs></svg></div>
        <div class="logo-text"><span class="logo-name">ILHAM</span><span class="logo-sub">PARTNERSHIP</span></div>
      </router-link>
      <ul class="nav-links" :class="{open: menuOpen}">
        <li><a href="#beranda" @click="menuOpen=false">Beranda</a></li>
        <li><a href="#putusan" @click="menuOpen=false">Putusan</a></li>
        <li><a href="#kategori" @click="menuOpen=false">Kategori</a></li>
        <li><a href="#tentang" @click="menuOpen=false">Tentang</a></li>
        <li><a href="#kontak" @click="menuOpen=false">Kontak</a></li>
        <li><router-link to="/admin" class="nav-admin-btn" @click="menuOpen=false">⚙ Admin</router-link></li>
      </ul>
      <button class="nav-toggle" :class="{active: menuOpen}" @click="menuOpen=!menuOpen"><span></span><span></span><span></span></button>
    </div>
  </nav>

  <header class="hero" id="beranda">
    <canvas class="hero-particles" ref="canvas"></canvas>
    <div class="hero-glow hero-glow-1"></div>
    <div class="hero-glow hero-glow-2"></div>
    <div class="hero-grid-bg"></div>
    <div class="hero-content">
      <div class="hero-badge"><span class="badge-dot"></span> Pengumuman Resmi 2026</div>
      <h1 class="hero-title"><span class="title-line">Putusan Hukum</span><span class="title-line gold-text">ILHAM PARTNERSHIP</span></h1>
      <p class="hero-subtitle">Portal resmi pengumuman putusan-putusan hukum terbaru. Transparansi dan keadilan adalah fondasi kami.</p>
      <div class="hero-actions">
        <a href="#putusan" class="btn btn-primary">Lihat Putusan Terbaru</a>
        <a href="#tentang" class="btn btn-outline">Tentang Kami</a>
      </div>
      <div class="hero-stats">
        <div class="stat-item"><span class="stat-number">{{ stats.total }}</span><span class="stat-label">Total Putusan</span><div class="stat-bar"><div class="stat-bar-fill" style="width:85%"></div></div></div>
        <div class="stat-divider"></div>
        <div class="stat-item"><span class="stat-number">{{ stats.win_rate }}</span><span class="stat-label">% Kemenangan</span><div class="stat-bar"><div class="stat-bar-fill" style="width:98%"></div></div></div>
        <div class="stat-divider"></div>
        <div class="stat-item"><span class="stat-number">{{ stats.years }}</span><span class="stat-label">Tahun Pengalaman</span><div class="stat-bar"><div class="stat-bar-fill" style="width:60%"></div></div></div>
      </div>
    </div>
  </header>

  <div class="ticker-bar"><div class="ticker-content"><span class="ticker-item" v-for="(t,i) in tickerItems" :key="i">{{ t }}</span></div></div>

  <section class="search-section" id="putusan">
    <div class="container">
      <div class="section-header"><div class="section-tag">Database Putusan</div><h2 class="section-title">Putusan <span class="gold-text">Terbaru</span></h2><p class="section-desc">Telusuri putusan-putusan hukum yang telah diumumkan secara resmi</p></div>
      <div class="search-bar">
        <div class="search-input-wrap">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" v-model="search" @input="fetchDecisions" placeholder="Cari nomor putusan, pihak, atau kata kunci...">
        </div>
        <div class="filter-tabs">
          <button v-for="f in filters" :key="f.val" class="filter-tab" :class="{active: filter===f.val}" @click="filter=f.val; fetchDecisions()">
            <span class="filter-dot" :class="f.dot"></span> {{ f.label }}
          </button>
        </div>
        <div class="search-results-count">Menampilkan {{ decisions.length }} putusan</div>
      </div>
    </div>
  </section>

  <section class="decisions-section">
    <div class="container">
      <div class="decisions-grid">
        <div class="decision-card" v-for="d in decisions" :key="d.id" @click="openModal(d)">
          <div class="card-header"><span class="card-badge" :class="'badge-'+d.category">{{ d.category.toUpperCase() }}</span><span class="card-date">{{ d.date }}</span></div>
          <div class="card-number">{{ d.number }}</div>
          <div class="card-title">{{ d.title }}</div>
          <div class="card-parties">{{ d.parties }}</div>
          <div class="card-footer">
            <div class="card-status" :class="'status-'+d.status"><span class="status-dot"></span>{{ d.status_label }}</div>
            <span class="card-link">Detail →</span>
          </div>
        </div>
      </div>
      <div v-if="decisions.length===0" class="empty-state"><p>Tidak ada putusan ditemukan</p></div>
    </div>
  </section>

  <section class="categories-section" id="kategori">
    <div class="container">
      <div class="section-header"><div class="section-tag">Bidang Hukum</div><h2 class="section-title">Kategori <span class="gold-text">Hukum</span></h2></div>
      <div class="categories-grid">
        <div class="category-card" v-for="c in categories" :key="c.key" @click="filter=c.key; fetchDecisions(); scrollTo('putusan')">
          <div class="cat-glow" :class="c.glow"></div>
          <div class="cat-icon-wrap" :class="c.color"><span style="font-size:28px">{{ c.icon }}</span></div>
          <h3>{{ c.name }}</h3><p>{{ c.desc }}</p>
          <div class="cat-footer"><span class="cat-count">{{ c.count }} Putusan</span><span class="cat-arrow">→</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="about-section" id="tentang">
    <div class="container"><div class="about-grid">
      <div class="about-content">
        <div class="section-header left"><div class="section-tag">Profil Firma</div><h2 class="section-title">Tentang <span class="gold-text">ILHAM PARTNERSHIP</span></h2></div>
        <p class="about-text">Firma Hukum <strong>ILHAM PARTNERSHIP</strong> telah berdiri sejak 2011 dan berkomitmen memberikan layanan hukum terbaik dengan integritas tinggi.</p>
        <p class="about-text">Portal ini didedikasikan untuk menginformasikan putusan-putusan hukum secara terbuka kepada publik.</p>
      </div>
      <div class="about-visual"><div class="about-card glass"><div class="about-card-glow"></div><div class="about-card-icon">⚖</div><h3>Keadilan untuk Semua</h3><p>Setiap putusan mencerminkan komitmen kami terhadap keadilan</p></div></div>
    </div></div>
  </section>

  <section class="contact-section" id="kontak">
    <div class="container">
      <div class="section-header"><div class="section-tag">Hubungi Kami</div><h2 class="section-title">Butuh <span class="gold-text">Informasi</span>?</h2></div>
      <div class="contact-grid">
        <a href="https://maps.app.goo.gl/zf3dK9DvnfWmCTyA9" target="_blank" class="contact-card" style="display:block; color:inherit;"><div class="contact-icon-wrap">📍</div><h3>Alamat</h3><p>Ciputra Citra Towers (North Tower), lt. 3, Unit 03/A1<br>Jl. Benyamin Suaeb, Kav. 06, Kemayoran, DKI Jakarta, Jakarta Pusat</p></a>
        <div class="contact-card"><div class="contact-icon-wrap">📞</div><h3>Telepon</h3><p>(021) 5555-1234<br>+62 812-3456-7890</p></div>
        <div class="contact-card"><div class="contact-icon-wrap">✉</div><h3>Email</h3><p>info@ilham-partnership.com<br>putusan@ilham-partnership.com</p></div>
      </div>
    </div>
  </section>

  <footer class="footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 ILHAM PARTNERSHIP. All rights reserved.</p></div></div></footer>

  <!-- Modal -->
  <div class="modal-overlay" :class="{active: modal}" @click.self="modal=null">
    <div class="modal" v-if="modal">
      <button class="modal-close" @click="modal=null">✕</button>
      <div class="modal-content">
        <div class="modal-badge"><span class="card-badge" :class="'badge-'+modal.category">{{ modal.category.toUpperCase() }}</span></div>
        <div class="modal-number">{{ modal.number }}</div>
        <div class="modal-title">{{ modal.title }}</div>
        <div class="modal-meta">
          <div class="meta-item"><span class="meta-label">Pihak</span><span class="meta-value">{{ modal.parties }}</span></div>
          <div class="meta-item"><span class="meta-label">Tanggal</span><span class="meta-value">{{ modal.date }}</span></div>
          <div class="meta-item"><span class="meta-label">Hakim</span><span class="meta-value">{{ modal.judge }}</span></div>
          <div class="meta-item"><span class="meta-label">Pengadilan</span><span class="meta-value">{{ modal.court }}</span></div>
        </div>
        <div class="card-status" :class="'status-'+modal.status" style="margin-bottom:20px"><span class="status-dot"></span>{{ modal.status_label }}</div>
        <hr class="modal-divider">
        <div class="modal-summary"><h4>Ringkasan Putusan</h4><p>{{ modal.summary }}</p></div>
        <a v-if="modal.pdf_path" :href="'http://localhost:8080'+modal.pdf_path" target="_blank" class="btn btn-primary" style="margin-top:16px">📄 Download PDF</a>
      </div>
    </div>
  </div>

  <button class="back-to-top" :class="{visible: scrollY>600}" @click="window.scrollTo({top:0,behavior:'smooth'})">↑</button>
</div>
</template>

<script>
import api from '../services/api.js'
export default {
  data() {
    return {
      decisions: [], stats: { total: 0, win_rate: 0, years: 15 },
      search: '', filter: 'all', modal: null, menuOpen: false,
      scrollY: 0, scrollPct: 0,
      filters: [
        { val: 'all', label: 'Semua', dot: '' },
        { val: 'perdata', label: 'Perdata', dot: 'dot-perdata' },
        { val: 'pidana', label: 'Pidana', dot: 'dot-pidana' },
        { val: 'tun', label: 'TUN', dot: 'dot-tun' },
        { val: 'niaga', label: 'Niaga', dot: 'dot-niaga' }
      ],
      categories: [
        { key: 'perdata', name: 'Hukum Perdata', desc: 'Sengketa kontrak, wanprestasi', icon: '📜', count: 89, glow: 'cat-glow-blue', color: 'blue' },
        { key: 'pidana', name: 'Hukum Pidana', desc: 'Perkara pidana umum & korupsi', icon: '⚔', count: 64, glow: 'cat-glow-red', color: 'red' },
        { key: 'tun', name: 'Tata Usaha Negara', desc: 'Sengketa administrasi pemerintahan', icon: '🏛', count: 42, glow: 'cat-glow-yellow', color: 'yellow' },
        { key: 'niaga', name: 'Hukum Niaga', desc: 'Kepailitan, PKPU, HKI', icon: '💼', count: 52, glow: 'cat-glow-green', color: 'green' }
      ],
      tickerItems: [
        '📢 Putusan Baru: No. 245/Pdt.G/2025/PN.Jkt.Sel — Dikabulkan',
        '⚖ Sidang PKPU PT Sejahtera Abadi dijadwalkan 15 Juni 2026',
        '🏛 Pembatalan IMB oleh PTUN Jakarta — Cacat Prosedur',
        '📢 Putusan Baru: No. 245/Pdt.G/2025/PN.Jkt.Sel — Dikabulkan',
        '⚖ Sidang PKPU PT Sejahtera Abadi dijadwalkan 15 Juni 2026',
        '🏛 Pembatalan IMB oleh PTUN Jakarta — Cacat Prosedur'
      ]
    }
  },
  methods: {
    async fetchDecisions() {
      const params = {}
      if (this.filter !== 'all') params.category = this.filter
      if (this.search) params.search = this.search
      const { data } = await api.getDecisions(params)
      this.decisions = data.data || []
    },
    async fetchStats() {
      const { data } = await api.getStats()
      this.stats = data
    },
    openModal(d) { this.modal = d; document.body.style.overflow = 'hidden' },
    scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) },
    onScroll() {
      this.scrollY = window.scrollY
      const h = document.documentElement.scrollHeight - window.innerHeight
      this.scrollPct = h > 0 ? (this.scrollY / h * 100) : 0
    },
    initParticles() {
      const c = this.$refs.canvas; if (!c) return
      const ctx = c.getContext('2d'); let ps = []
      const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight }
      resize(); window.addEventListener('resize', resize)
      for (let i = 0; i < 50; i++) ps.push({ x: Math.random()*c.width, y: Math.random()*c.height, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, r:Math.random()*1.5+.5, a:Math.random()*.3+.1 })
      const draw = () => {
        ctx.clearRect(0,0,c.width,c.height)
        ps.forEach(p => { p.x+=p.vx;p.y+=p.vy; if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0; ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(34,139,84,${p.a})`;ctx.fill() })
        requestAnimationFrame(draw)
      }
      draw()
    }
  },
  watch: { modal(v) { if (!v) document.body.style.overflow = '' } },
  mounted() {
    this.fetchDecisions(); this.fetchStats(); this.initParticles()
    window.addEventListener('scroll', this.onScroll)
  },
  unmounted() { window.removeEventListener('scroll', this.onScroll) }
}
</script>
