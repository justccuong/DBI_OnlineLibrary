import { useEffect, useState } from "react"

import ProfileHistoryTable from "../components/ProfileHistoryTable"
import { useAuth } from "../context/AuthContext"
import { libraryApi } from "../services/libraryApi"

function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false

    const load = async () => {
      try {
        setLoading(true)
        const data = await libraryApi.getUserProfile(user?.id)

        if (!ignore) {
          setProfile(data)
          setError("")
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Failed to load profile")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
        {error || "Profile not found"}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="panel p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-xl font-bold text-white">
              {profile.user.fullname?.slice(0, 1) || profile.user.user_name?.slice(0, 1)}
            </div>
            <div className="space-y-1">
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950">
                {profile.user.fullname || profile.user.user_name}
              </h1>
              <p className="text-sm text-slate-500">{profile.user.email}</p>
              <p className="text-sm text-slate-500">
                User Code: {profile.user.user_code} • Role: {profile.user.role_name}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Phone Number</p>
              <p className="mt-2 text-sm font-medium text-slate-800">
                {profile.user.phone_number || "Not provided"}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Role Permission</p>
              <p className="mt-2 text-sm font-medium text-slate-800">
                Download limits are determined by the assigned role.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="panel p-5">
            <p className="text-sm text-slate-500">Total Access Logs</p>
            <p className="mt-3 font-display text-3xl font-bold text-slate-950">{profile.summary.total_logs}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-slate-500">Downloads</p>
            <p className="mt-3 font-display text-3xl font-bold text-slate-950">{profile.summary.total_downloads}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-slate-500">Reads / Previews</p>
            <p className="mt-3 font-display text-3xl font-bold text-slate-950">{profile.summary.total_reads}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="section-title">Reading & Download History</h2>
          <p className="section-copy">
            Joined from `Access_log`, `Book`, and your current user profile.
          </p>
        </div>
        <ProfileHistoryTable rows={profile.history} />
      </section>
    </div>
  )
}

export default ProfilePage
