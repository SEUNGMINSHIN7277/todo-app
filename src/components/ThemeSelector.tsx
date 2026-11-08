import React from 'react'

const THEMES = {
  nexus: {
    '--color-primary': '#002446',
    '--color-primary-container': '#1a3a5f',
    '--color-tertiary': '#89f5e7',
    '--surface': '#f7f9fb',
    '--surface-container-low': '#ffffff',
    '--on-surface': '#0f172a',
  },
  warm: {
    '--color-primary': '#3b2f2f',
    '--color-primary-container': '#5b453f',
    '--color-tertiary': '#ffd6a5',
    '--surface': '#fffaf5',
    '--surface-container-low': '#fff6ef',
    '--on-surface': '#1b1b1b',
  }
}

export default function ThemeSelector() {
  function apply(themeKey: 'nexus'|'warm') {
    const t = THEMES[themeKey]
    Object.entries(t).forEach(([k, v]) => document.documentElement.style.setProperty(k, v as string))
    localStorage.setItem('TODO_THEME', themeKey)
  }

  React.useEffect(() => {
    const saved = (localStorage.getItem('TODO_THEME') as 'nexus'|'warm'|null) || 'nexus'
    apply(saved)
  }, [])

  return (
    <div className="flex gap-2">
      <button onClick={() => apply('nexus')} className="px-2 py-1 rounded bg-slate-100">Nexus</button>
      <button onClick={() => apply('warm')} className="px-2 py-1 rounded bg-slate-100">Warm</button>
    </div>
  )
}
