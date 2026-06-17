<template>
<div class="admin-page">
  <nav class="navbar scrolled"><div class="nav-container">
    <router-link to="/" class="nav-logo"><div class="logo-icon"><svg viewBox="0 0 40 40" width="28" height="28" fill="none"><path d="M20 4L4 12v4l16 8 16-8v-4L20 4z" fill="url(#ga)" opacity=".9"/><path d="M4 20v4l16 8 16-8v-4L20 28 4 20z" fill="url(#ga)" opacity=".5"/><defs><linearGradient id="ga" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#3ec97a"/><stop offset="1" stop-color="#165c38"/></linearGradient></defs></svg></div><div class="logo-text"><span class="logo-name">ILHAM</span><span class="logo-sub">PARTNERSHIP</span></div></router-link>
    <div style="display:flex;gap:8px"><router-link to="/" class="btn btn-outline" style="padding:8px 16px;font-size:13px">← Beranda</router-link></div>
  </div></nav>

  <div class="container" style="padding-top:100px;padding-bottom:60px">
    <div class="section-header left"><div class="section-tag">Panel Admin</div><h2 class="section-title">Kelola <span class="gold-text">Putusan</span></h2></div>

    <!-- Form -->
    <div class="search-bar" style="margin-bottom:32px">
      <h3 style="font-family:var(--font-d);color:var(--gold-light);margin-bottom:16px">{{ editId ? 'Edit Putusan' : 'Tambah Putusan Baru' }}</h3>
      <form @submit.prevent="submit" enctype="multipart/form-data">
        <div class="form-grid">
          <div class="form-group"><label>Kategori</label>
            <select v-model="form.category" required><option value="">Pilih</option><option value="perdata">Perdata</option><option value="pidana">Pidana</option><option value="tun">TUN</option><option value="niaga">Niaga</option></select></div>
          <div class="form-group"><label>No. Putusan</label><input v-model="form.number" required placeholder="No. xxx/Pdt.G/2025/PN..."></div>
          <div class="form-group"><label>Status</label>
            <select v-model="form.status" required><option value="">Pilih</option><option value="won">Dikabulkan</option><option value="lost">Ditolak</option><option value="ongoing">Dalam Proses</option></select></div>
          <div class="form-group"><label>Label Status</label><input v-model="form.status_label" required placeholder="Dikabulkan / Ditolak / Dalam Proses"></div>
          <div class="form-group full"><label>Judul Perkara</label><input v-model="form.title" required placeholder="Judul perkara..."></div>
          <div class="form-group full"><label>Pihak Terlibat</label><input v-model="form.parties" required placeholder="Penggugat vs Tergugat"></div>
          <div class="form-group"><label>Tanggal Putusan</label><input v-model="form.date" required placeholder="12 Mei 2026"></div>
          <div class="form-group"><label>Hakim Ketua</label><input v-model="form.judge" placeholder="Nama hakim..."></div>
          <div class="form-group"><label>Pengadilan</label><input v-model="form.court" placeholder="PN Jakarta Selatan"></div>
          <div class="form-group"><label>Upload PDF</label><input type="file" accept=".pdf" @change="onFile" ref="fileInput"></div>
          <div class="form-group full"><label>Ringkasan</label><textarea v-model="form.summary" rows="3" placeholder="Ringkasan putusan..."></textarea></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button type="submit" class="btn btn-primary">{{ editId ? 'Update' : 'Simpan' }}</button>
          <button v-if="editId" type="button" class="btn btn-outline" @click="resetForm">Batal</button>
        </div>
        <div v-if="msg" class="form-msg">{{ msg }}</div>
      </form>
    </div>

    <!-- Table -->
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>No. Putusan</th><th>Judul</th><th>Kategori</th><th>Status</th><th>PDF</th><th>Aksi</th></tr></thead>
        <tbody>
          <tr v-for="d in decisions" :key="d.id">
            <td class="mono">{{ d.number }}</td>
            <td>{{ d.title }}</td>
            <td><span class="card-badge" :class="'badge-'+d.category">{{ d.category.toUpperCase() }}</span></td>
            <td><span class="card-status" :class="'status-'+d.status"><span class="status-dot"></span>{{ d.status_label }}</span></td>
            <td><a v-if="d.pdf_path" :href="'http://localhost:8080'+d.pdf_path" target="_blank" class="card-link">📄</a><span v-else style="opacity:.3">—</span></td>
            <td><div style="display:flex;gap:6px"><button class="btn-sm edit" @click="editRow(d)">Edit</button><button class="btn-sm del" @click="deleteRow(d.id)">Hapus</button></div></td>
          </tr>
        </tbody>
      </table>
      <div v-if="decisions.length===0" class="empty-state"><p>Belum ada putusan</p></div>
    </div>
  </div>
</div>
</template>

<script>
import api from '../services/api.js'
export default {
  data() {
    return {
      decisions: [], editId: null, msg: '', pdfFile: null,
      form: { category:'', number:'', title:'', parties:'', date:'', status:'', status_label:'', judge:'', court:'', summary:'' }
    }
  },
  methods: {
    async fetch() { const { data } = await api.getDecisions(); this.decisions = data.data || [] },
    onFile(e) { this.pdfFile = e.target.files[0] },
    async submit() {
      const fd = new FormData()
      Object.entries(this.form).forEach(([k,v]) => fd.append(k, v))
      if (this.pdfFile) fd.append('pdf', this.pdfFile)
      try {
        if (this.editId) { await api.updateDecision(this.editId, fd); this.msg = 'Putusan berhasil diupdate!' }
        else { await api.createDecision(fd); this.msg = 'Putusan berhasil ditambahkan!' }
        this.resetForm(); this.fetch()
        setTimeout(() => this.msg = '', 3000)
      } catch(e) { this.msg = 'Error: ' + (e.response?.data?.error || e.message) }
    },
    editRow(d) {
      this.editId = d.id
      this.form = { category: d.category, number: d.number, title: d.title, parties: d.parties, date: d.date, status: d.status, status_label: d.status_label, judge: d.judge, court: d.court, summary: d.summary }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    async deleteRow(id) {
      if (!confirm('Hapus putusan ini?')) return
      await api.deleteDecision(id); this.fetch()
    },
    resetForm() {
      this.editId = null; this.pdfFile = null
      this.form = { category:'', number:'', title:'', parties:'', date:'', status:'', status_label:'', judge:'', court:'', summary:'' }
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
    }
  },
  mounted() { this.fetch() }
}
</script>

<style scoped>
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-group{display:flex;flex-direction:column;gap:4px}
.form-group.full{grid-column:1/-1}
.form-group label{font-size:12px;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:.5px}
.form-group input,.form-group select,.form-group textarea{padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);color:var(--text);font-size:14px;font-family:var(--font-b);transition:var(--tr)}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(199,172,120,.1)}
.form-group select{cursor:pointer}
.form-group select option{background:var(--surface);color:var(--text)}
.form-msg{margin-top:12px;padding:10px 16px;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.3);border-radius:var(--r);color:var(--success);font-size:13px;font-weight:500}
.admin-table-wrap{overflow-x:auto;border-radius:var(--r-lg);border:1px solid var(--border)}
.admin-table{width:100%;border-collapse:collapse}
.admin-table th{padding:14px 16px;font-size:12px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.5px;text-align:left;background:var(--surface);border-bottom:1px solid var(--border)}
.admin-table td{padding:12px 16px;font-size:13px;border-bottom:1px solid var(--border)}
.admin-table tr:hover td{background:rgba(199,172,120,.03)}
.mono{font-family:var(--font-m,'monospace');font-size:12px;color:var(--gold);opacity:.8}
.btn-sm{padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;border:none;cursor:pointer;transition:var(--tr)}
.btn-sm.edit{background:rgba(96,165,250,.15);color:var(--info)}
.btn-sm.edit:hover{background:rgba(96,165,250,.25)}
.btn-sm.del{background:rgba(248,113,113,.15);color:var(--danger)}
.btn-sm.del:hover{background:rgba(248,113,113,.25)}
.nav-admin-btn{background:rgba(199,172,120,.1)!important;color:var(--gold)!important;border:1px solid rgba(199,172,120,.2);border-radius:8px;padding:6px 14px!important;font-size:12px!important}
@media(max-width:768px){.form-grid{grid-template-columns:1fr}.admin-table{font-size:12px}}
</style>
