import { useMemo, useRef, useState } from 'react'

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
      const detail = [{ year: 0, cf: -project.invest, pv: -project.invest }]

      project.cashflows.forEach((cashflow, index) => {
        const year = index + 1
        const pv = cashflow / Math.pow(1 + rate, year)
        npv += pv
        detail.push({ year, cf: cashflow, pv })
      })

      return {
        id: project.id,
        name: project.name,
        npv,
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
    <div className="relative mx-auto my-5 max-w-7xl overflow-hidden rounded-[28px] border border-[#d8cab3] bg-[linear-gradient(135deg,_#faf7ef_0%,_#f5f0e6_100%)] p-5 shadow-soft sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-14 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />

      <header className="relative z-10 border-b border-white/70 pb-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">Sistem Keputusan Berbasis Model</p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-ink sm:text-[2rem]">
          Kelayakan Investasi <span className="italic text-accent">Net Present Value</span>
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-[15px]">
          Masukkan investasi awal, tingkat diskonto, dan arus kas tiap tahun. Sistem akan menghitung NPV dan menilai apakah proyek layak untuk dijalankan.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Model</span>
            <strong className="text-base text-ink">NPV</strong>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Kriteria</span>
            <strong className="text-base text-ink">NPV ≥ 0</strong>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Output</span>
            <strong className="text-base text-ink">Rekomendasi</strong>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Tingkat diskonto</span>
            <strong className="text-base text-ink">{discountRate}%</strong>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Jumlah proyek</span>
            <strong className="text-base text-ink">{projects.length}</strong>
          </div>
          <div className={cn('rounded-2xl border p-4 shadow-sm backdrop-blur', bestProject?.layak ? 'border-accent/30 bg-[linear-gradient(135deg,_rgba(227,241,235,0.95),_rgba(255,255,255,0.95))]' : 'border-[#e7cfa3] bg-[linear-gradient(135deg,_rgba(255,245,220,0.95),_rgba(255,255,255,0.95))]')}>
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Status terbaik</span>
            <strong className="text-base text-ink">{bestProject?.layak ? 'Layak' : 'Perlu Review'}</strong>
          </div>
        </div>
      </header>

      <section className="relative z-10 mt-6 rounded-[20px] border border-[#d8cab3] bg-white p-6 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-[0.08em] text-ink">1. Parameter Umum</h2>
        <label className="mt-4 block text-[11px] font-black uppercase tracking-[0.08em] text-slate-500" htmlFor="discount-rate">
          Tingkat Diskonto (%)
        </label>
        <input
          id="discount-rate"
          className="mt-2 h-11 w-full rounded-xl border border-[#d8cab3] bg-[#faf7ef] px-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          type="number"
          min="0"
          step="0.1"
          value={discountRate}
          onChange={(event) => setDiscountRate(Number(event.target.value) || 0)}
        />
        <p className="mt-2 text-sm leading-6 text-slate-500">Biasanya menggunakan biaya modal atau tingkat pengembalian minimum yang diharapkan.</p>
      </section>

      <section className="relative z-10 mt-6 rounded-[20px] border border-[#d8cab3] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black uppercase tracking-[0.08em] text-ink">2. Data Proyek</h2>
          <button type="button" className="inline-flex items-center justify-center rounded-xl border border-[#d8cab3] bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-ink hover:text-ink" onClick={addProject}>
            + Tambah Proyek
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className={cn('inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition', activeProject?.id === project.id ? 'border-ink bg-ink text-white' : 'border-[#d8cab3] bg-white text-slate-600 hover:border-accent hover:text-accent')}
              onClick={() => setActiveProjectId(project.id)}
            >
              <span>{project.name}</span>
              {projects.length > 1 && (
                <span
                  className="text-base font-bold"
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

        {activeProject && (
          <div className="mt-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Nama Proyek</label>
                <input
                  className="h-11 w-full rounded-xl border border-[#d8cab3] bg-[#faf7ef] px-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  type="text"
                  value={activeProject.name}
                  onChange={(event) => updateProjectField(activeProject.id, 'name', event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Investasi Awal (Rp)</label>
                <input
                  className="h-11 w-full rounded-xl border border-[#d8cab3] bg-[#faf7ef] px-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  type="number"
                  min="0"
                  value={activeProject.invest}
                  onChange={(event) => updateProjectField(activeProject.id, 'invest', event.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e8e0d1] bg-[#fcfbf8] p-2">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Tahun</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Arus Kas Bersih (Rp)</th>
                    <th className="w-12 px-3 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {activeProject.cashflows.map((cashflow, index) => (
                    <tr key={`${activeProject.id}-${index}`} className="border-t border-[#efe8db]">
                      <td className="px-3 py-3 text-sm font-semibold text-slate-500">Th {index + 1}</td>
                      <td className="px-3 py-3">
                        <input
                          className="h-11 w-full rounded-xl border border-[#d8cab3] bg-[#faf7ef] px-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                          type="number"
                          value={cashflow}
                          onChange={(event) => updateCashflow(activeProject.id, index, event.target.value)}
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button type="button" className="text-lg text-danger transition hover:opacity-70" onClick={() => removeYear(activeProject.id, index)}>
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" className="mt-4 inline-flex items-center justify-center rounded-xl border border-accent bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent hover:text-white" onClick={() => addYear(activeProject.id)}>
              + Tambah Tahun
            </button>
          </div>
        )}
      </section>

      <div className="relative z-10 mt-6 flex justify-end">
        <button type="button" className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition hover:bg-[#123244]" onClick={handleAnalyze}>
          Hitung &amp; Beri Rekomendasi
        </button>
      </div>

      <section className="relative z-10 mt-6 rounded-[20px] border border-[#d8cab3] bg-white p-6 shadow-sm" ref={resultsSectionRef}>
        <h2 className="text-sm font-black uppercase tracking-[0.08em] text-ink">3. Hasil Analisis</h2>
        {bestProject && (
          <>
            <div className={cn('mt-4 rounded-2xl border p-5', bestProject.layak ? 'border-accent bg-[linear-gradient(135deg,_#ebfdf8_0%,_#e0efe9_100%)]' : 'border-danger bg-[linear-gradient(135deg,_#fff4ef_0%,_#f6e4dd_100%)]')}>
              <p className={cn('text-[11px] font-black uppercase tracking-[0.2em]', bestProject.layak ? 'text-accent' : 'text-danger')}>
                {bestProject.layak ? 'Layak Dijalankan' : 'Tidak Layak'}
              </p>
              <h3 className="mt-2 text-2xl font-black text-ink">{currency.format(bestProject.npv)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {bestProject.layak
                  ? 'NPV positif menunjukkan proyek memberi nilai tambah di atas biaya modal.'
                  : 'NPV negatif menunjukkan proyek belum mampu menutup biaya modal.'}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {ranking.map((result, index) => (
                <div key={result.id} className={cn('flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4', index === 0 ? 'border-accent bg-[linear-gradient(90deg,_#f4fcf9_0%,_#eefcf7_100%)]' : 'border-slate-200 bg-white')}>
                  <div className="text-base font-black text-slate-500">#{index + 1}</div>
                  <div className="min-w-0 flex-1">
                    <strong className="block text-sm font-semibold text-ink">{result.name}</strong>
                    <p className="mt-1 text-sm text-slate-500">{result.layak ? 'Layak untuk dipilih' : 'Tidak layak'}</p>
                  </div>
                  <div className={cn('text-sm font-black', result.layak ? 'text-accent' : 'text-danger')}>{currency.format(result.npv)}</div>
                </div>
              ))}
            </div>

            <details className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-ink">Rincian perhitungan tiap proyek</summary>
              <div className="mt-4 grid gap-3">
                {results.map((result) => (
                  <div key={result.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-ink">{result.name}</h4>
                      <span className={cn('rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.05em]', result.layak ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger')}>
                        {result.layak ? 'Layak' : 'Tidak Layak'}
                      </span>
                    </div>
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full border-collapse text-sm">
                        <thead>
                          <tr>
                            <th className="px-2 py-2 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Tahun</th>
                            <th className="px-2 py-2 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Arus Kas</th>
                            <th className="px-2 py-2 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">PV</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.detail.map((item) => (
                            <tr key={`${result.id}-${item.year}`} className="border-t border-slate-100">
                              <td className="px-2 py-2 text-slate-600">{item.year === 0 ? '0 (awal)' : item.year}</td>
                              <td className="px-2 py-2 text-slate-600">{currency.format(item.cf)}</td>
                              <td className={cn('px-2 py-2 font-semibold', item.pv >= 0 ? 'text-accent' : 'text-danger')}>{currency.format(item.pv)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">
                      NPV akhir: <strong className="text-ink">{currency.format(result.npv)}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </>
        )}
      </section>
    </div>
  )
}

export default NpvDecisionSystem
