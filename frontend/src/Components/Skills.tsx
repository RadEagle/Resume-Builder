import { useState, useEffect } from 'react'
import { buildUrl } from '../api'
import { HARDCODED_PROFILE_ID } from '../config'
import { Schemas } from '../types'
import { useAuth } from '../auth/AuthContext'


async function createSkill(profile_id: string, name: string, category: string, token: string) {
    const skillPath = buildUrl(`profiles/${profile_id}/skills`)
    const skillPayload = Schemas.SkillCreateSchema.parse({
        name: name.trim(),
        category: category.trim()
    })

    const response = await fetch(skillPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(skillPayload)
    })
    if (!response.ok) {
      throw new Error("Failed to create skill")
    }
    return response.json()
}

function Skills() {
    const [skills, setSkills] = useState([])
    const [newSkillName, setNewSkillName] = useState("")
    const [newSkillCategory, setNewSkillCategory] = useState("technical")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { token } = useAuth()
  
    useEffect(() => {
      setLoading(true)
      setError(null)
      
      if (!token)
      {
        setLoading(false)
        return
      }

      const skillPath = buildUrl(`profiles/${HARDCODED_PROFILE_ID}/skills`)

      fetch(skillPath, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch skills`)
          }
          return response.json()
        })
        .then(data => {
          const parsed = Schemas.SkillReadSchema.array().safeParse(data)
          setSkills(parsed.success ? parsed.data : [])
        })
        .catch(err => setError(err instanceof Error ? err.message : "An unknown error occurred"))
        .finally(() => setLoading(false))
    }, [token]);
  
    async function handleCreateSkill() {
      try {
        const created = await createSkill(HARDCODED_PROFILE_ID.toString(), newSkillName.trim(), newSkillCategory, token)
        setSkills((current) => current.concat(created))
        setNewSkillName('')
        setNewSkillCategory('technical')
      } catch (e) {
        // set error state if you want
      }
    }
  
    return (
      <>
        {
          token ? (
            <section id="skills" className="m-4 flex flex-col gap-4">
              <div className="m-4">
                <h2 className="font-bold">
                  Skills List for Profile {HARDCODED_PROFILE_ID}
                </h2>
                <p>
                  {loading ? "Loading..." : error ? "Error: " + error : "No error"}
                </p>
        
                <div className="flex flex-col gap-2">
                    <h3 className="font-bold">Technical Skills</h3>
                    {skills.filter(skill => skill.category === 'technical').map(skill => (
                    <div key={skill.id}>
                        <p>{skill.name}</p>
                    </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-bold">Soft Skills</h3>
                    {skills.filter(skill => skill.category === 'soft').map(skill => (
                    <div key={skill.id}>
                        <p>{skill.name}</p>
                    </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                <h3 className="font-bold">Interests</h3>
                    {skills.filter(skill => skill.category === 'interest').map(skill => (
                    <div key={skill.id}>
                        <p>{skill.name}</p>
                    </div>
                    ))}
                </div>
              </div>
        
              <div id="skill-creation" className="m-4 flex flex-col gap-2">
                <h2>Create Skill</h2>
                <input 
                  type="text" 
                  placeholder="Enter skill name..." 
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                />
                <select
                  value={newSkillCategory}
                  onChange={e => setNewSkillCategory(e.target.value)}
                  className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                >
                    <option value="technical">Technical</option>
                    <option value="soft">Soft</option>
                    <option value="interest">Interest</option>
                </select>
                <button onClick={() => void handleCreateSkill()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500">Create</button>
              </div>
            </section>
          ) : (
            <section id="skills-offline" className="m-4 flex flex-col gap-4">
              <div className="m-4">
                <h2 className="font-bold">Skills</h2>
                <p>You are offline. Please login to view your skills.</p>
              </div>
            </section>
          )
        }
      </>
    )
}

export { Skills };