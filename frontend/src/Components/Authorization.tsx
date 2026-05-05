import { useState, useEffect } from 'react'
import { Schemas } from '../types'
import { useAuth } from '../auth/AuthContext'


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
      } catch (e) {
        // set error state if you want
      }
    }

    async function handleRegister() {
        try {
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