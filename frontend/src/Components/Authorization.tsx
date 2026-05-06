import { useState } from 'react'
import { Schemas, type UserRegister } from '../types'
import { useAuth } from '../auth/AuthContext'
import { buildUrl } from '../api'


async function registerUser(payload: UserRegister) {
  try {
    const response = await fetch(buildUrl("auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      throw new Error("Failed to register user - fetch error")
    }
    
    return response.json()
  } catch (e) {
    throw new Error("Failed to register user - unknown error")
  }
  
}

function Authorization() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()
  
    async function handleLogin() {
      try {
        const userPayload = Schemas.UserLoginSchema.parse({
            email: email.trim(),
            password: password.trim()
        })

        const response = await login(userPayload)
        console.log(response)

        setEmail("")
        setPassword("")
      } catch (e) {
        // set error state if you want
      }
    }

    async function handleRegister() {
      try {
        const userPayload = Schemas.UserRegisterSchema.parse({
            email: email.trim(),
            password: password.trim()
        })

        const data = await registerUser(userPayload)
        const parsed = Schemas.TokenResponseSchema.safeParse(data)
        if (!parsed.success) {
          throw new Error("Failed to register user - parse error: " + parsed.error.message)
        }
        console.log(parsed.data)

        // after registering, login the user
        handleLogin()
        
      } catch (e) {
        // set error state if you want
      }
    }
  
    return (
      <>
        <section id="enter-credentials" className="m-4 flex flex-col gap-4">
          <div id="login-register-form" className="m-4 flex flex-col gap-2">
            <h2>Login/Register</h2>
            <input 
              type="text" 
              placeholder="Enter email..." 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <input 
              type="text" 
              placeholder="Enter password..." 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <div id="authorization-buttons" className="flex justify-between gap-2 w-full">
                <button onClick={() => void handleLogin()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500 w-full">Login</button>
                <button onClick={() => void handleRegister()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500 w-full">Register</button>
            </div>
          </div>
        </section>
      </>
    )
}

export { Authorization };