import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const loc = useLocation()
  return (
    <header className="shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold"><h1>AnalytIQ</h1></Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className={`text-xl font-bold ${loc.pathname === '/' ? 'text-indigo-600' : 'text-slate-600'}`}>Home</Link>
          <Link to="/dashboard" className={`text-xl font-bold ${loc.pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-600'}`}>Dashboard</Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
