import { useState, useEffect } from 'react'
import { buildUrl } from '../api'
import { Schemas } from '../types'
import { useAuth } from '../auth/AuthContext'

async function createProfile(name: string, token: string) {
    const profilePayload = Schemas.ProfileCreateSchema.parse({
        name: name.trim()
    })

    const response = await fetch(buildUrl("profiles"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(profilePayload)
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

    const { token } = useAuth()
  
    useEffect(() => {
      setLoading(true)
      setError(null)

      if (!token) {
        setLoading(false)
        return
      }

      fetch(buildUrl("profiles"), {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch profiles")
          }
          return response.json()
        })
        .then(data => {
          const parsed = Schemas.ProfileReadSchema.array().safeParse(data)
          setProfiles(parsed.success ? parsed.data : [])
        })
        .catch(err => setError(err instanceof Error ? err.message : "An unknown error occurred"))
        .finally(() => setLoading(false))
    }, [token]);
  
    async function handleCreateProfile() {
      if (!token) {
        setError("You are offline. Please login to create a profile.")
        return
      }
      
      try {
        const created = await createProfile(newProfileName.trim(), token)
        setProfiles((current) => current.concat(created))
        setNewProfileName('')
      } catch (e) {
        // set error state if you want
      }
    }
  
    return (
      <>
      {
        token ? (
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
        
              <div id="profile-creation" className="m-4 flex flex-col gap-2">
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
        ) : (
          <>
            <section id="profiles-offline" className="m-4 flex flex-col gap-4">
              <div className="m-4">
                <h2 className="font-bold">Profiles</h2>
                <p>You are offline. Please login to view your profiles.</p>
              </div>
            </section>
          </>
        )
      }
        
      </>
    )
}

export { Profiles };