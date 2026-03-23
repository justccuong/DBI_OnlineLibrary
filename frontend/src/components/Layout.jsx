import { useState } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="app-container flex h-20 items-center justify-between gap-4">
          <Link className="flex items-center gap-3" to="/">
            <img
              alt="Online Library logo"
              className="h-12 w-12 rounded-2xl shadow-soft"
              src="/online-library-logo.svg"
            />
            <div>
              <p className="font-display text-lg font-bold text-slate-950">Online Library</p>
              <p className="text-xs text-slate-500">React UI mapped to your SQL schema</p>
            </div>
          </Link>

          <button
            className="inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            Menu
          </button>

          <div className="hidden items-center gap-3 lg:flex">
            <NavLink className={navLinkClass} to="/">
              Home
            </NavLink>
            <NavLink className={navLinkClass} to="/catalog">
              Catalog
            </NavLink>
            <NavLink className={navLinkClass} to="/about">
              About
            </NavLink>
            {user && (
              <NavLink className={navLinkClass} to="/profile">
                Profile
              </NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink className={navLinkClass} to="/admin">
                Admin
              </NavLink>
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
                  <span className="font-semibold text-slate-900">{user.userName}</span>
                  <span className="ml-2 text-slate-500">({user.role})</span>
                </div>
                <button className="button-secondary" onClick={logout} type="button">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link className="button-secondary" to="/login">
                  Login
                </Link>
                <Link className="button-accent" to="/register">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="app-container flex flex-col gap-3 py-4">
              <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/">
                Home
              </NavLink>
              <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/catalog">
                Catalog
              </NavLink>
              <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/about">
                About
              </NavLink>
              {user && (
                <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/profile">
                  Profile
                </NavLink>
              )}
              {user?.role === "admin" && (
                <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/admin">
                  Admin
                </NavLink>
              )}
              <div className="pt-2">
                {user ? (
                  <button className="button-secondary w-full" onClick={logout} type="button">
                    Sign out
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link className="button-secondary justify-center" to="/login">
                      Login
                    </Link>
                    <Link className="button-accent justify-center" to="/register">
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="app-container py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="app-container flex flex-col gap-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              alt="Online Library logo"
              className="h-10 w-10 rounded-2xl shadow-card"
              src="/online-library-logo.svg"
            />
            <div>
              <p className="font-semibold text-slate-800">Online Library Management System</p>
              <p>Frontend showcase for Books, Authors, Categories, Roles, and Access Logs.</p>
            </div>
          </div>
          <p>Built with React Router, TailwindCSS, and schema-based mock API stubs.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
