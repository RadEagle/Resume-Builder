import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { buildUrl } from './api.ts'
import './App.css'
import { HARDCODED_PROFILE_ID } from './config.ts'

async function createProfile(name: string) {
  const response = await fetch(buildUrl("profiles"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  })
  if (!response.ok) {
    throw new Error("Failed to create profile")
  }
  return response.json()
}

function App() {
  const [count, setCount] = useState(0)
  const [profiles, setProfiles] = useState([])
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newProfileName, setNewProfileName] = useState("")

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

  useEffect(() => {
    const experiencesPath = buildUrl(`profiles/${HARDCODED_PROFILE_ID}/experiences`)

    fetch(buildUrl(experiencesPath))
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch experiences")
        }
        return response.json()
      })
      .then(data => setExperiences(data))
      .catch(err => setError(err instanceof Error ? err.message : "An unknown error occurred"))
      .finally(() => setLoading(false))
  }, []);

  async function handleCreateProfile() {
    try {
      const created = await createProfile(newProfileName.trim())
      setProfiles((prev) => [...prev, created]) // or [...prev, created].sort((a,b)=>a.id-b.id)
      setNewProfileName('')
    } catch (e) {
      // set error state if you want
    }
  }

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
        <h2 className="text-3xl font-bold">
          Hello world!!
        </h2>
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

      <section id="profiles">
        <h2>Profiles</h2>
        <input 
          type="text" 
          placeholder="Create new profile" 
          value={newProfileName}
          onChange={e => setNewProfileName(e.target.value)}
        />
        <button onClick={void handleCreateProfile()} className="cursor-pointer bg-blue-300 rounded-2xl px-4 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500">Create</button>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
export { buildUrl }