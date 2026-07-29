import { createContext, useContext, useState, type PropsWithChildren } from "react"
import type { UserRead, UserLogin } from "../types"
import { buildUrl } from "../api"
import { Schemas } from "../types"


type AuthValue = {
    user: UserRead | null
    token: string | null
    login: (payload: UserLogin) => Promise<void>
    logout: () => void
    error: string | null

    setUser: (user: UserRead | null) => void
    setToken: (token: string | null) => void
    setError: (error: string | null) => void
}


// Create Auth Context to hold undefined values
const AuthContext = createContext<AuthValue | undefined>(undefined)


// Create Auth Provider
const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<UserRead | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const login = async (payload: UserLogin) => {
        const response = await fetch(buildUrl("auth/login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            let message = "Login failed"
            try {
                const body = await response.json()
                const detail = body.detail
                if (typeof(detail) === "string") {
                    message = detail
                }
                else if (Array.isArray(detail)) {
                    message = ""
                    for (const item of detail) {
                        const line = item.msg ? item.msg : String(item)
                        message = message ? `${message}, ${line}` : line
                    }
                }
                setError(message)
            }
            catch (e) {
                setError(e instanceof Error ? e.message : "Something went wrong")
            }

            console.error(message, response.statusText)
            throw new Error(message)
        }

        const data = await response.json()
        const parsed = Schemas.TokenResponseSchema.safeParse(data)
        if (!parsed.success) {
            // this shouldn't be a user-facing error
            console.error("Invalid response format", parsed.error)
            throw new Error("Invalid response format")
        }

        setUser(parsed.data.user)
        setToken(parsed.data.access_token)
        setError(null)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        setError(null)
    }
    
    return (
        <AuthContext.Provider value={{ user, token, login, logout, error, setUser, setToken, setError }}>
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