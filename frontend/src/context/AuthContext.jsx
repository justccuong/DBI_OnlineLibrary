/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    startTransition,
    useContext,
    useEffect,
    useEffectEvent,
    useState,
} from "react"

import { api } from "../utils/api"

const AuthContext = createContext(null)
const TOKEN_KEY = "online-library-token"

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) || "")
    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))

    const setToken = (nextToken) => {
        if (nextToken) {
            localStorage.setItem(TOKEN_KEY, nextToken)
        } else {
            localStorage.removeItem(TOKEN_KEY)
        }

        setTokenState(nextToken || "")
    }

    const loadCurrentUser = useEffectEvent(async () => {
        if (!token) {
            startTransition(() => {
                setUser(null)
                setLoadingUser(false)
            })
            return
        }

        try {
            startTransition(() => {
                setLoadingUser(true)
            })
            const data = await api.get("/api/auth/me", { token })
            startTransition(() => {
                setUser(data.user)
                setLoadingUser(false)
            })
        } catch {
            startTransition(() => {
                setUser(null)
                setLoadingUser(false)
            })
            setToken("")
        }
    })

    useEffect(() => {
        loadCurrentUser()
    }, [token])

    const login = async (credentials) => {
        const data = await api.post("/api/auth/login", credentials)
        startTransition(() => {
            setUser(data.user)
        })
        setToken(data.token)
        return data
    }

    const register = async (payload) => {
        const data = await api.post("/api/auth/register", payload)
        return data
    }

    const logout = () => {
        startTransition(() => {
            setUser(null)
        })
        setToken("")
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                loadingUser,
                isAuthenticated: Boolean(token),
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context
}
