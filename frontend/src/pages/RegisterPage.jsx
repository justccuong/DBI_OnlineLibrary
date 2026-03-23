import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

function RegisterPage() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ userName: "", email: "", password: "" })
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
      await register(form)
      navigate("/login", { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-container grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-soft lg:grid-cols-[0.95fr,1.05fr]">
        <div className="bg-brand-500 p-8 text-white sm:p-10">
          <img
            alt="Online Library logo"
            className="h-14 w-14 rounded-2xl bg-white p-2 shadow-soft"
            src="/online-library-logo.svg"
          />
          <div className="mt-8 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">
              User Registration
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Create a new library account
            </h1>
            <p className="text-sm leading-7 text-orange-50">
              Registering creates a new row in the `[User]` table and unlocks profile access, reading history, downloads, and book reviews.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-5 text-sm leading-7 text-orange-50">
            Keep the form simple for the class project: user name, email, and password. The backend handles the role assignment and password hashing.
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950">Register</h2>
            <p className="mt-2 text-sm text-slate-500">Create an account, then log in and start reading.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="userName">
                User Name
              </label>
              <input
                className="input-base"
                id="userName"
                onChange={(event) => setForm((current) => ({ ...current, userName: event.target.value }))}
                placeholder="Enter your user name"
                value={form.userName}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="register-email">
                Email
              </label>
              <input
                className="input-base"
                id="register-email"
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="Enter your email"
                type="email"
                value={form.email}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="register-password">
                Password
              </label>
              <input
                className="input-base"
                id="register-password"
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Create a password"
                type="password"
                value={form.password}
              />
            </div>

            <button className="button-accent w-full justify-center" disabled={submitting} type="submit">
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already registered?{" "}
            <Link className="font-semibold text-brand-600" to="/login">
              Login here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
