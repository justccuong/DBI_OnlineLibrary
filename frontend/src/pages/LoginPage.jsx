import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate replace to="/profile" />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError("")
      await login(form)
      navigate(location.state?.from || "/profile", { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-container grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-soft lg:grid-cols-[0.95fr,1.05fr]">
        <div className="bg-slate-950 p-8 text-white sm:p-10">
          <img
            alt="Online Library logo"
            className="h-14 w-14 rounded-2xl shadow-soft"
            src="/online-library-logo.svg"
          />
          <div className="mt-8 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-200">
              Authentication
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Welcome back to the Online Library
            </h1>
            <p className="text-sm leading-7 text-slate-300">
              Sign in to access your profile, submit reviews, and open the admin dashboard if your role is `admin`.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold">Admin Demo</p>
              <p className="mt-2 text-sm text-slate-300">admin@demo.local</p>
              <p className="text-sm text-slate-300">Admin123</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold">Member Demo</p>
              <p className="mt-2 text-sm text-slate-300">student@demo.local</p>
              <p className="text-sm text-slate-300">Member123</p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950">Login</h2>
            <p className="mt-2 text-sm text-slate-500">Use the credentials stored in your `[User]` table.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                className="input-base"
                id="email"
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="student@demo.local"
                type="email"
                value={form.email}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                className="input-base"
                id="password"
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter your password"
                type="password"
                value={form.password}
              />
            </div>

            <button className="button-primary w-full justify-center" disabled={submitting} type="submit">
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link className="font-semibold text-brand-600" to="/register">
              Register here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
