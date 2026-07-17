import { useMemo, useRef, useState } from 'react'
import '../styles/NpvDecisionSystem.css'

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const createProject = (name, index) => ({
  id: Date.now() + index,
  name,
  invest: 100000000,
  cashflows: [30000000, 35000000, 40000000, 45000000],
})

const getNextProjectName = (currentProjects) => {
  const nextLetter = String.fromCharCode(65 + currentProjects.length)
  return `Proyek ${nextLetter}`
}

const cn = (...classes) => classes.filter(Boolean).join(' ')

function NpvDecisionSystem() {
  const initialProject = createProject('Proyek A', 1)
  const [discountRate, setDiscountRate] = useState(10)
  const [projects, setProjects] = useState([initialProject])
  const [activeProjectId, setActiveProjectId] = useState(initialProject.id)
  const resultsSectionRef = useRef(null)

  const activeProject = projects.find((project) => project.id === activeProjectId) || projects[0]

  const results = useMemo(() => {
    return projects.map((project) => {
      const rate = discountRate / 100
      let npv = -project.invest
      let cumulativeNpv = -project.invest
      const detail = [{
        year: 0,
        cf: -project.invest,
        discountFactor: 1,
        pv: -project.invest,
        cumulativeNpv: -project.invest,
      }]

      project.cashflows.forEach((cashflow, index) => {
        const year = index + 1
        const discountFactor = 1 / Math.pow(1 + rate, year)
        // Round PV to nearest integer to eliminate floating-point noise
        const pv = Math.round(cashflow * discountFactor)
        npv += pv
        cumulativeNpv += pv
        detail.push({
          year,
          cf: cashflow,
          discountFactor,
          pv,
          cumulativeNpv,
        })
      })

      // Recalculate final NPV as sum of all PVs for consistency
      npv = detail.reduce((sum, d) => sum + d.pv, 0)

      // Profitability Index: total PV of inflows / initial investment
      const totalPvInflows = detail.slice(1).reduce((sum, d) => sum + d.pv, 0)
      const pi = project.invest > 0 ? totalPvInflows / project.invest : 0

      return {
        id: project.id,
        name: project.name,
        invest: project.invest,
        npv,
        pi,
        totalPvInflows,
        detail,
        layak: npv >= 0,
      }
    })
  }, [discountRate, projects])

  const ranking = useMemo(() => [...results].sort((a, b) => b.npv - a.npv), [results])

  const updateProjectField = (projectId, field, value) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId ? { ...project, [field]: field === 'name' ? value : Number(value) || 0 } : project
      )
    )
  }

  const updateCashflow = (projectId, index, value) => {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project
        const updatedCashflows = [...project.cashflows]
        updatedCashflows[index] = Number(value) || 0
        return { ...project, cashflows: updatedCashflows }
      })
    )
  }

  const addYear = (projectId) => {
    setProjects((current) =>
      current.map((project) => (project.id === projectId ? { ...project, cashflows: [...project.cashflows, 0] } : project))
    )
  }

  const removeYear = (projectId, index) => {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project
        if (project.cashflows.length <= 1) return project
        const filtered = project.cashflows.filter((_, itemIndex) => itemIndex !== index)
        return { ...project, cashflows: filtered }
      })
    )
  }

  const addProject = () => {
    const newProject = createProject(getNextProjectName(projects), projects.length + 1)
    setProjects((current) => [...current, newProject])
    setActiveProjectId(newProject.id)
  }

  const removeProject = (projectId) => {
    if (projects.length <= 1) return
    const nextProjects = projects.filter((project) => project.id !== projectId)
    setProjects(nextProjects)
    if (activeProjectId === projectId) {
      setActiveProjectId(nextProjects[0].id)
    }
  }

  const bestProject = ranking[0]

  const handleAnalyze = () => {
    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="npv-shell">
      {/* ── Hero Header ── */}
      <header className="npv-hero">
        <p className="npv-eyebrow">Sistem Keputusan Berbasis Model</p>
        <h1>
          Kelayakan Investasi <span>Net Present Value</span>
        </h1>
        <p className="npv-subtitle">
          Masukkan investasi awal, tingkat diskonto, dan arus kas tiap tahun. Sistem akan menghitung NPV dan menilai apakah proyek layak untuk dijalankan.
        </p>

        {/* Model info cards */}
        <div className="npv-highlights">
          <div className="npv-highlight-card">
            <span className="npv-highlight-label">Model</span>
            <strong>NPV</strong>
          </div>
          <div className="npv-highlight-card">
            <span className="npv-highlight-label">Kriteria</span>
            <strong>NPV ≥ 0</strong>
          </div>
          <div className="npv-highlight-card">
            <span className="npv-highlight-label">Output</span>
            <strong>Rekomendasi</strong>
          </div>
        </div>

        {/* Live dashboard stats */}
        <div className="npv-dashboard-summary">
          <div className="npv-summary-stat">
            <span className="npv-summary-label">Tingkat Diskonto</span>
            <strong>{discountRate}%</strong>
          </div>
          <div className="npv-summary-stat">
            <span className="npv-summary-label">Jumlah Proyek</span>
            <strong>{projects.length}</strong>
          </div>
          <div className={cn('npv-summary-stat', bestProject?.layak ? 'good' : 'warn')}>
            <span className="npv-summary-label">Status Terbaik</span>
            <strong>
              <span className={cn('npv-pulse', bestProject?.layak ? 'go' : 'no')} />
              {bestProject?.layak ? 'Layak' : 'Perlu Review'}
            </strong>
          </div>
        </div>
      </header>

      {/* ── Section 1: Parameters ── */}
      <div className="npv-card">
        <h2>1. Parameter Umum</h2>
        <div>
          <label className="npv-label" htmlFor="discount-rate">
            Tingkat Diskonto (%)
          </label>
          <input
            id="discount-rate"
            className="npv-input"
            type="number"
            min="0"
            step="0.1"
            value={discountRate}
            onChange={(event) => setDiscountRate(Number(event.target.value) || 0)}
          />
          <p className="npv-hint">Biasanya menggunakan biaya modal atau tingkat pengembalian minimum yang diharapkan.</p>
        </div>
      </div>

      {/* ── Section 2: Project Data ── */}
      <div className="npv-card">
        <div className="npv-card-header">
          <h2>2. Data Proyek</h2>
          <button type="button" className="npv-btn npv-btn-ghost" onClick={addProject}>
            + Tambah Proyek
          </button>
        </div>

        {/* Project tabs */}
        <div className="npv-tabs">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className={cn('npv-tab', activeProject?.id === project.id && 'active')}
              onClick={() => setActiveProjectId(project.id)}
            >
              <span>{project.name}</span>
              {projects.length > 1 && (
                <span
                  className="npv-tab-remove"
                  onClick={(event) => {
                    event.stopPropagation()
                    removeProject(project.id)
                  }}
                >
                  ×
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active project form */}
        {activeProject && (
          <div>
            <div className="npv-grid">
              <div className="npv-field">
                <label className="npv-label">Nama Proyek</label>
                <input
                  className="npv-input"
                  type="text"
                  value={activeProject.name}
                  onChange={(event) => updateProjectField(activeProject.id, 'name', event.target.value)}
                />
              </div>
              <div className="npv-field">
                <label className="npv-label">Investasi Awal (Rp)</label>
                <input
                  className="npv-input"
                  type="number"
                  min="0"
                  value={activeProject.invest}
                  onChange={(event) => updateProjectField(activeProject.id, 'invest', event.target.value)}
                />
              </div>
            </div>

            <div className="npv-table-wrapper" style={{ marginTop: '18px' }}>
              <table className="npv-table">
                <thead>
                  <tr>
                    <th>Tahun</th>
                    <th>Arus Kas Bersih (Rp)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {activeProject.cashflows.map((cashflow, index) => (
                    <tr key={`${activeProject.id}-${index}`}>
                      <td>Th {index + 1}</td>
                      <td>
                        <input
                          className="npv-input"
                          type="number"
                          value={cashflow}
                          onChange={(event) => updateCashflow(activeProject.id, index, event.target.value)}
                        />
                      </td>
                      <td>
                        <button type="button" className="npv-delete" onClick={() => removeYear(activeProject.id, index)}>
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" className="npv-btn npv-btn-add" style={{ marginTop: '16px' }} onClick={() => addYear(activeProject.id)}>
              + Tambah Tahun
            </button>
          </div>
        )}
      </div>

      {/* ── Analyze Button ── */}
      <div className="npv-action-row">
        <button type="button" className="npv-btn npv-btn-primary" onClick={handleAnalyze}>
          Hitung &amp; Beri Rekomendasi
        </button>
      </div>

      {/* ── Section 3: Results ── */}
      <div className="npv-card" ref={resultsSectionRef}>
        <h2>3. Hasil Analisis</h2>
        {bestProject && (
          <>
            {/* Verdict Banner */}
            <div className={cn('npv-verdict', bestProject.layak ? 'go' : 'no')}>
              <p className="npv-verdict-tag">
                <span className={cn('npv-pulse', bestProject.layak ? 'go' : 'no')} />
                {bestProject.layak ? 'Layak Dijalankan' : 'Tidak Layak'}
              </p>
              <h3>{currency.format(bestProject.npv)}</h3>
              <p>
                {bestProject.layak
                  ? 'NPV positif menunjukkan proyek memberi nilai tambah di atas biaya modal.'
                  : 'NPV negatif menunjukkan proyek belum mampu menutup biaya modal.'}
              </p>
              {/* Formula breakdown */}
              <div className="npv-formula">
                NPV = −Investasi + Σ (CF<sub>t</sub> / (1 + r)<sup>t</sup>)
                <br />
                NPV = −{currency.format(bestProject.invest)} + {currency.format(bestProject.totalPvInflows)} = <strong>{currency.format(bestProject.npv)}</strong>
                <br />
                PI = {currency.format(bestProject.totalPvInflows)} / {currency.format(bestProject.invest)} = <strong>{bestProject.pi.toFixed(2)}</strong>
              </div>
            </div>

            {/* Ranking */}
            <div className="npv-ranking">
              {ranking.map((result, index) => (
                <div key={result.id} className={cn('npv-ranking-item', index === 0 && 'best')}>
                  <div className="npv-rank">#{index + 1}</div>
                  <div className="npv-rank-info">
                    <strong>{result.name}</strong>
                    <p>{result.layak ? 'Layak untuk dipilih' : 'Tidak layak'}</p>
                  </div>
                  <div className="npv-rank-meta">
                    <div className={cn('npv-rank-value', result.layak ? 'go' : 'no')}>
                      {currency.format(result.npv)}
                    </div>
                    <div className="npv-rank-pi">PI: {result.pi.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail calculations */}
            <details className="npv-details">
              <summary>Rincian perhitungan tiap proyek</summary>
              <div className="npv-calculation-list">
                {results.map((result) => (
                  <div key={result.id} className="npv-calculation-card">
                    <div className="npv-calculation-title">
                      <h4>{result.name}</h4>
                      <span className={cn('npv-pill', result.layak ? 'go' : 'no')}>
                        {result.layak ? 'Layak' : 'Tidak Layak'}
                      </span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="npv-detail-table">
                        <thead>
                          <tr>
                            <th>Tahun</th>
                            <th>Arus Kas</th>
                            <th>Faktor Diskonto</th>
                            <th>PV</th>
                            <th>NPV Kumulatif</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.detail.map((item) => (
                            <tr key={`${result.id}-${item.year}`}>
                              <td>{item.year === 0 ? '0 (awal)' : item.year}</td>
                              <td>{currency.format(item.cf)}</td>
                              <td>{item.discountFactor.toFixed(4)}</td>
                              <td className={item.pv >= 0 ? 'positive' : 'negative'}>
                                {currency.format(item.pv)}
                              </td>
                              <td className={item.cumulativeNpv >= 0 ? 'positive' : 'negative'}>
                                {currency.format(item.cumulativeNpv)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="npv-summary">
                      <span>NPV: <strong>{currency.format(result.npv)}</strong></span>
                      <span>Total PV Arus Masuk: <strong>{currency.format(result.totalPvInflows)}</strong></span>
                      <span>PI: <strong>{result.pi.toFixed(2)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  )
}

export default NpvDecisionSystem
