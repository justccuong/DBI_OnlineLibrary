import { Navigate, useLocation } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loadingUser } = useAuth()
  const location = useLocation()

  if (loadingUser) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500" />
      </div>
    )
  }

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate replace to="/" />
  }

  return children
}

export default ProtectedRoute
