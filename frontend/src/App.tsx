import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { buildUrl } from './api.ts'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(buildUrl("profiles"))
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch profiles")
        }
        return response.json()
      })
      .then(data => setProfiles(data))
      .catch(err => setError(err instanceof Error ? err.message : "An unknown error occurred"))
      .finally(() => setLoading(false))
  }, []);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        <h1 className="text-3xl font-bold underline text-black">
          Hello world!!
        </h1>
        <h1 className="text-3xl font-bold underline text-black">
          console.log(buildUrl("profiles"))
        </h1>
        <p>
          {loading ? "Loading..." : error ? "Error: " + error : "No error"}
          {profiles.map(profile => (
            <div key={profile.id}>
              <h2>{profile.name}</h2>
            </div>
          ))}
        </p>
      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
export { buildUrl }