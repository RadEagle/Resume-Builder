import { useState, useEffect } from 'react'
import { fetchApi } from '../api'
import { Schemas } from '../types'
import { useAuth } from '../auth/AuthContext'


interface ProfileProps {
  onProfileChange: (profileId: string, profileName: string) => void
}


async function createProfile(name: string, token: string) {
    const profilePayload = Schemas.ProfileCreateSchema.parse({
        name: name.trim()
    })

    const data = await fetchApi("profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profilePayload),
      token: token
    })

    return data
}

function Profiles({ onProfileChange }: ProfileProps) {
    const [profiles, setProfiles] = useState([])
    const [profileId, setProfileId] = useState("")
    const [newProfileName, setNewProfileName] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { user, token } = useAuth()

    useEffect(() => {
      if (user) {
        setProfileId("")
        onProfileChange("", "")
      }
    }, [user])
  
    useEffect(() => {
      setLoading(true)
      setError(null)

      if (!token) {
        setLoading(false)
        return
      }

      fetchApi("profiles", {
        headers: {
          "Content-Type": "application/json",
        },
        token: token
      })
        .then(data => {
          const parsed = Schemas.ProfileReadSchema.array().safeParse(data)
          setProfiles(parsed.success ? parsed.data : [])
        })
        .catch(err => setError(err instanceof Error ? err.message : "Failed to fetch profiles"))
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

    async function handleSelectProfile(profileId: string) {
      setProfileId(profileId)
      if (!profileId) {
        onProfileChange("", "")
        return
      }

      const profile = profiles.find(p => p.id.toString() === profileId)
      if (!profile) {
        setError("Profile not found")
        return
      }

      onProfileChange(profile.id.toString(), profile.name)
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

              <div id="profile-selection" className="m-4 flex flex-col gap-2">
                <h2>Select Profile</h2>
                <select 
                name="profile-specific" 
                value={profileId}
                onChange={e => handleSelectProfile(e.target.value)}
                className="text-slate-800 dark:bg-gray-50 rounded-2xl pl-4 pr-12 py-0.5"
              >
                <option value="">Select a profile</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
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