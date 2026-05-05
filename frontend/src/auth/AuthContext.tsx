import { createContext, useContext, useState } from "react"
import type { UserRead, UserLogin } from "../types"
import { buildUrl } from "../api"
import { Schemas } from "../types"


type AuthValue = {
    user: UserRead | null
    token: string | null
    login: (payload: UserLogin) => Promise<void>
    logout: () => void
}


// Create Auth Context to hold undefined values
const AuthContext = createContext<AuthValue | undefined>(undefined)


// Create Auth Provider
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<UserRead | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const login = async (payload: UserLogin) => {
        const response = await fetch(buildUrl("auth/login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            console.error("Login failed", response.statusText)
            throw new Error("Login failed")
        }

        const data = await response.json()
        const parsed = Schemas.TokenResponseSchema.safeParse(data)
        if (!parsed.success) {
            console.error("Invalid response format", parsed.error)
            throw new Error("Invalid response format")
        }

        setUser(parsed.data.user)
        setToken(parsed.data.access_token)
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
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export { AuthProvider, useAuth }