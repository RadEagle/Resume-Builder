import { createContext, useContext, useState } from "react"
import type { UserRead } from "../types"
import { buildUrl } from "../api"


// Create Auth Context to hold default values
const AuthContext = createContext<{
    user: UserRead | null
    token: string | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}>({
    user: null,
    token: null,
    login: async () => {},
    logout: () => {}
})


// Create Auth Provider
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<UserRead | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const login = async (email: string, password: string) => {
        const response = await fetch(buildUrl("auth/login"), {
            method: "POST",
            body: JSON.stringify({ email, password })
        })
    }

    const logout = () => {
        setUser(null)
        setToken(null)
    }
    
    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


// create custom React hook useAuth
const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export { AuthProvider, useAuth }