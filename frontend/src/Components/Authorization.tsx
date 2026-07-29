import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Schemas, type ForgotPasswordRequest, type ResetPasswordRequest, type UserRegister } from '../types'
import { useAuth } from '../auth/AuthContext'
import { buildUrl } from '../api'
import { InputField, PasswordField } from '../Library/InputField'


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

async function sendEmail(payload: ForgotPasswordRequest) {
  try {
    const response = await fetch(buildUrl("auth/forgot-password"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      throw new Error("Failed to send email - fetch error")
    }
    
    return response.json()
  } catch (e) {
    throw new Error("Failed to send email - unknown error")
  }
}

async function resetPassword(payload: ResetPasswordRequest) {
  try {
    const response = await fetch(buildUrl("auth/reset-password"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      throw new Error("Failed to reset password - fetch error")
    }
    
    return response.json()
  } catch (e) {
    throw new Error("Failed to reset password - unknown error")
  }
}

function Authorization() {
    const [identifier, setIdentifier] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [authMode, setAuthMode] = useState("login")
    const { error, login, setUser, setToken, setError } = useAuth()
  
    async function handleLogin() {
      try {
        const userPayload = Schemas.UserLoginSchema.parse({
            identifier: identifier.trim(),
            password: password.trim()
        })

        const response = await login(userPayload)
        console.log(response)

        setIdentifier("")
        setPassword("")
      } catch (e) {
        // set error state if you want
      }
    }

    async function handleRegister() {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      try {
        const userPayload = Schemas.UserRegisterSchema.parse({
            username: username.trim(),
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
        setUser(parsed.data.user)
        setToken(parsed.data.access_token)
        
      } catch (e) {
        // set error state if you want
      }
    }

    function handleForgotPassword() {
      setAuthMode("forgot")

      setIdentifier("")
      setUsername("")
      setPassword("")
    }

    function handleBackToLogin() {
      setAuthMode("login")

      setEmail("")
    }

    async function handleSendEmail() {
      try {
        const forgotPasswordPayload = Schemas.ForgotPasswordRequestSchema.parse({
            email: email.trim()
        })

        const response = await sendEmail(forgotPasswordPayload)
        console.log(response)

        setEmail("")
      } catch (e) {
        // set error state if you want
      }
    }

    async function handleResetPassword() {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      const token = new URLSearchParams(window.location.search).get("reset_token")
      try {
        const resetPasswordPayload = Schemas.ResetPasswordRequestSchema.parse({
          token: token?.trim(),
          password: password.trim()
        })

        const response = await resetPassword(resetPasswordPayload)
        console.log(response)

        setPassword("")
        setConfirmPassword("")
      } catch (e) {
        // set error state if you want
      }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
      if (e.key !== "Enter") return
      e.preventDefault()

      // if not on last field, focus on next field
      const form = e.currentTarget
      const fieldIndex = Array.prototype.indexOf.call(form.elements, e.target)
      const nextElement = form.elements[fieldIndex + 1]
      if (nextElement) {
        (nextElement as HTMLElement).focus()
      }
      else {
        switch(authMode) {
          case 'login': 
            handleLogin()
            break
          case 'register':
            handleRegister()
            break
          case 'forgot':
            handleSendEmail()
            break
          case 'reset':
            handleResetPassword()
            break
        }
      }
    }

    function handleSwitchToLogin() {
      if (authMode === "login") return

      setAuthMode("login")

      setUsername("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setError(null)
    }

    function handleSwitchToRegister() {
      if (authMode === "register") return

      setAuthMode("register")

      setIdentifier("")
      setPassword("")
      setError(null)
    }
  
    return (
      <>
        <section id="enter-credentials" className="m-4 flex flex-col gap-4 min-w-lg min-h-64">
          {
            authMode === "login" || authMode === "register" ?
            <div id="auth-tab-section" className="grid grid-cols-2 gap-x-2 justify-evenly items-center relative">
              <h2 onClick={handleSwitchToLogin} className="hover:cursor-pointer">Login</h2>
              <h2 onClick={handleSwitchToRegister} className="hover:cursor-pointer">Register</h2>
              <div className={`h-0.5 bg-blue-300 w-1/2 absolute left-0 -bottom-1 transition duration-300 ease-out ${authMode === 'register' ? "translate-x-full" : "translate-x-0"} `}></div>
            </div> : null
          }

          {
            authMode === "forgot" ?
            <h2 className="col-span-2">Forgot Password?</h2> : null
          }

          {
            authMode === "reset" ?
            <h2 className="col-span-2">Reset Password</h2> : null
          }

          {
            error ?
            <div id="error-message" className="col-span-2 text-start text-sm text-red-500">
              {error}
            </div> : null
          } 

          <div id="authorization-form" className="m-4 grid grid-cols gap-x-5 gap-y-2 items-center">
            <form className="col-span-2 grid grid-cols-subgrid gap-y-2 items-center" onKeyDown={(e) => handleKeyDown(e)}>
              {
                authMode === "login" ?
                <InputField 
                  label="Email or Username:"
                  placeholder="Enter..." 
                  value={identifier}
                  onChange={setIdentifier}
                /> : null
              }

              {
                authMode === "register" ?
                <InputField 
                  required
                  label="Username:"
                  placeholder="Enter username..." 
                  value={username}
                  onChange={setUsername}
                /> : null
              }

              {
                authMode === "register" || authMode === "forgot" ?
                <InputField 
                  required={authMode === "register"}
                  label="Email:"
                  placeholder="Enter email..." 
                  value={email}
                  onChange={setEmail}
                /> : null
              }
              
              {
                authMode === "login" || authMode === "register" || authMode === "reset" ?
                <PasswordField 
                  required={authMode === "register" || authMode === "reset"}
                  label="Password:"
                  placeholder="Enter password..." 
                  value={password}
                  onChange={setPassword}
                /> : null
              }

              {
                authMode === "register" ?
                <PasswordField 
                  required={authMode === "register" || authMode === "reset"}
                  label="Confirm Password:"
                  placeholder="Enter password again..." 
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                /> : null
              }
              
            </form>

            {
              authMode === "register" ?
              <div id="password-reqs" className="col-span-2 text-start text-sm">
                <p>At least 6 characters long</p>
                <p>Contains at least one uppercase letter (e.g., A-Z)</p>
                <p>Contains at least one lowercase letter (e.g., a-z)</p>
                <p>Contains at least one number (e.g., 0-9)</p>
                <p>Contains at least one special character (e.g., !@#$%^&*)</p>
              </div> : null
            }

            <div id="authorization-buttons" className="col-span-2 flex justify-between gap-2 w-full">
                {
                  authMode === "login" ?
                  <>
                    <button onClick={() => void handleLogin()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500 w-full">Login</button>
                    <button onClick={() => void handleForgotPassword()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500 w-full">Forgot Password?</button> 
                  </> : null
                }
                
                {
                  authMode === "register" ?
                  <button onClick={() => void handleRegister()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500 w-full">Register</button> : null
                }

                {
                  authMode === "forgot" ?
                  <>
                    <button onClick={() => void handleBackToLogin()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500 w-full">Back to Login</button>
                    <button onClick={() => void handleSendEmail()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500 w-full">Submit</button> 
                  </> : null
                }

                {
                  authMode === "reset" ?
                  <button onClick={() => void handleResetPassword()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500 w-full">Reset Password</button> : null
                }
            </div>
          </div>
        </section>
      </>
    )
}

export { Authorization };