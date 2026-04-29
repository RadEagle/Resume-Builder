import { useState, useEffect } from 'react'
import { buildUrl } from './api.ts'
import './App.css'
import { HARDCODED_PROFILE_ID } from './config.ts'
import { ViteStarter, ViteNextSteps } from './Vite.tsx'

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
      <section id="center" className="m-4">
        <ViteStarter />
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

      <section id="profiles" className="m-4">
        <h2>Profiles</h2>
        <input 
          type="text" 
          placeholder="Create new profile" 
          value={newProfileName}
          onChange={e => setNewProfileName(e.target.value)}
          className="dark:bg-gray-50 rounded-2xl px-4 py-0.5"
        />
        <button onClick={void handleCreateProfile()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500">Create</button>
      </section>

      <ViteNextSteps />

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
export { buildUrl }