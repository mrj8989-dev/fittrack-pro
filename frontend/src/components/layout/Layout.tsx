import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          display: 'none',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderBottom: '0.5px solid var(--border)',
          background: 'var(--bg-secondary)',
        }}
        className="mobile-header"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '4px' }}
          >
            <i className="ti ti-menu-2" style={{ fontSize: '22px' }} aria-hidden="true" />
          </button>
          <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
            Fit<span style={{ color: 'var(--accent-primary)' }}>Track</span>
          </span>
        </header>

        <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}