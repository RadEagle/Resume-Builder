import { useState, useEffect } from 'react'
import { buildUrl } from '../api'

async function createProfile(name: string) {
    const response = await fetch(buildUrl("profiles"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        name: name 
      })
    })
    if (!response.ok) {
      throw new Error("Failed to create profile")
    }
    return response.json()
}

function Profiles() {
    const [profiles, setProfiles] = useState([])
    const [newProfileName, setNewProfileName] = useState("")
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
  
    async function handleCreateProfile() {
      try {
        const created = await createProfile(newProfileName.trim())
        setProfiles((current) => current.concat(created))
        setNewProfileName('')
      } catch (e) {
        // set error state if you want
      }
    }
  
    return (
      <>
        <section id="profiles" className="m-4 flex flex-col gap-4">
          <div className="m-4">
            <h2 className="font-bold">
              Profiles List
            </h2>
            <p>
              {loading ? "Loading..." : error ? "Error: " + error : "No error"}
            </p>
    
            {profiles.map(profile => (
              <div key={profile.id}>
                <p>{profile.name}</p>
              </div>
            ))}
          </div>
    
          <div id="profile-creation" className="m-4">
            <h2>Create Profile</h2>
            <input 
              type="text" 
              placeholder="Enter profile name..." 
              value={newProfileName}
              onChange={e => setNewProfileName(e.target.value)}
              className="dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <button onClick={() => void handleCreateProfile()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500">Create</button>
          </div>
        </section>
      </>
    )
}

export { Profiles };