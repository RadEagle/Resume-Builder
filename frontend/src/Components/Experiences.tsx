import { useState, useEffect } from 'react'
import { buildUrl } from '../api'
import { HARDCODED_PROFILE_ID } from '../config.ts'
import { Schemas, type ExperienceCreate } from '../types.ts'
import { useAuth } from '../auth/AuthContext.tsx'


async function createExperience(profile_id: string, experiencePayload: ExperienceCreate, token: string) {
    const response = await fetch(buildUrl(`profiles/${profile_id}/experiences`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(experiencePayload)
    })
    if (!response.ok) {
      throw new Error("Failed to create experience")
    }
    return response.json()
}
  
async function createEducationDetail(profile_id: string, experience_id: string, degree: string, major: string, gpa: string, token: string) {
    const educationDetailPayload = Schemas.EduDetailCreateSchema.parse({
        degree: degree.trim(),
        major: major.trim() || undefined,
        gpa: gpa.trim() === "" ? undefined : Number(gpa.trim())
    })

    const response = await fetch(buildUrl(`profiles/${profile_id}/experiences/${experience_id}/edu-details`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(educationDetailPayload)
    })
    if (!response.ok) {
      throw new Error("Failed to create education detail")
    }
    return response.json()
}

function Experiences() {
    const [experiences, setExperiences] = useState([])
    const [newExperienceTitle, setNewExperienceTitle] = useState("")
    const [newExperienceOrganization, setNewExperienceOrganization] = useState("")
    const [newExperienceLocation, setNewExperienceLocation] = useState("")
    const [newExperienceKind, setNewExperienceKind] = useState("work")
    const [newDegree, setNewDegree] = useState("")
    const [newMajor, setNewMajor] = useState("")
    const [newGPA, setNewGPA] = useState("")
    const [newStartDate, setNewStartDate] = useState("")
    const [newEndDate, setNewEndDate] = useState("")
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

      const experiencesPath = buildUrl(`profiles/${HARDCODED_PROFILE_ID}/experiences`)
  
      fetch(experiencesPath, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch experiences")
          }
          return response.json()
        })
        .then(data => {
          const parsed = Schemas.ExperienceReadSchema.array().safeParse(data)
          setExperiences(parsed.success ? parsed.data : [])
        })
        .catch(err => setError(err instanceof Error ? err.message : "An unknown error occurred"))
        .finally(() => setLoading(false))
    }, [token]);
  
    async function handleCreateExperience() {
      if (!token) {
        setError("You are offline. Please login to see experiences.")
        return
      }

      try {
        let safeExperienceTitle = newExperienceKind === "work" || newExperienceKind === "side_project" ? newExperienceTitle.trim() : undefined
        let safeExperienceOrganization = newExperienceKind === "work" || newExperienceKind === "school" ? newExperienceOrganization.trim() : undefined
        let safeExperienceLocation = newExperienceKind === "work" || newExperienceKind === "school" ? newExperienceLocation.trim() : undefined
        
        const experiencePayload = Schemas.ExperienceCreateSchema.parse({
          title: safeExperienceTitle,
          organization: safeExperienceOrganization,
          location: safeExperienceLocation,
          kind: newExperienceKind,
          start_date: newStartDate,
          end_date: newEndDate === "" ? undefined : newEndDate
      })
  
        const newExperience = await createExperience(HARDCODED_PROFILE_ID.toString(), experiencePayload, token)
  
        if (newExperienceKind === 'school') {
          await createEducationDetail(HARDCODED_PROFILE_ID.toString(), newExperience.id.toString(), newDegree.trim(), newMajor.trim(), newGPA.trim(), token)
        }
  
        setExperiences((prev) => [...prev, newExperience])
        setNewExperienceTitle('')
        setNewExperienceOrganization('')
        setNewExperienceLocation('')
        setNewExperienceKind('work')
        setNewDegree('')
        setNewMajor('')
        setNewGPA('')
        setNewStartDate("")
        setNewEndDate("")
      } catch (e) {
        // set error state if you want
      }
    }
  
    return (
      <>
        {
          token ? (
            <section id="experiences" className="m-4">
              <div id="center" className="m-4">
                <h2 className="font-bold">
                  Experiences List for Profile {HARDCODED_PROFILE_ID}
                </h2>
                <div>
                  {loading ? "Loading..." : error ? "Error: " + error : "No error"}
                  {experiences.map(experience => (
                    <div key={experience.id}>
                      <h2>{experience.title}</h2>
                      <p>{experience.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
        
              <div id="create-experience">
                <h2>Create Experience</h2>
                <form
                  className="m-4 flex flex-col gap-2"
                  onSubmit={e => {
                    e.preventDefault()
                    void handleCreateExperience()
                  }}
                >
                  <select 
                    name="experience-kind" 
                    id="experience-kind"
                    value={newExperienceKind}
                    onChange={e => setNewExperienceKind(e.target.value)}
                    className="text-slate-800 dark:bg-gray-50 rounded-2xl pl-4 pr-12 py-0.5"
                  >
                    <option value="work">Work</option>
                    <option value="school">School</option>
                    <option value="side_project">Side Project</option>
                  </select>
                  {
                    newExperienceKind === "work" || newExperienceKind === "side_project" ? 
                    <input 
                      type="text" 
                      required
                      placeholder="Enter experience title..." 
                      value={newExperienceTitle}
                      onChange={e => setNewExperienceTitle(e.target.value)}
                      className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                    />
                    : null
                  }
                  {
                    newExperienceKind === "work" || newExperienceKind === "school" ? 
                    <input 
                      type="text" 
                      required
                      placeholder="Enter experience organization..." 
                      value={newExperienceOrganization}
                      onChange={e => setNewExperienceOrganization(e.target.value)}
                      className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                    />
                    : null
                  }
                  {
                    newExperienceKind === "work" || newExperienceKind === "school" ? 
                    <input 
                      type="text" 
                      required
                      placeholder="Enter experience location..." 
                      value={newExperienceLocation}
                      onChange={e => setNewExperienceLocation(e.target.value)}
                      className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                    />
                    : null
                  }
                  {
                    newExperienceKind === "school" ? 
                    <input 
                      type="text" 
                      required
                      placeholder="Enter degree..." 
                      value={newDegree}
                      onChange={e => setNewDegree(e.target.value)}
                      className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                    />
                    : null
                  }
                  {
                    newExperienceKind === "school" ? 
                    <input 
                      type="text" 
                      placeholder="Enter major..." 
                      value={newMajor}
                      onChange={e => setNewMajor(e.target.value)}
                      className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                    />
                    : null
                  }
                  {
                    newExperienceKind === "school" ? 
                    <input 
                      type="text" 
                      placeholder="Enter GPA..." 
                      value={newGPA}
                      onChange={e => setNewGPA(e.target.value)}
                      className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                    />
                    : null
                  }
                  <input 
                    type="date"
                    required
                    placeholder="Enter start date..." 
                    value={newStartDate}
                    onChange={e => setNewStartDate(e.target.value)}
                    className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                  />
                  <input 
                    type="date" 
                    placeholder="Enter end date..." 
                    value={newEndDate}
                    onChange={e => setNewEndDate(e.target.value)}
                    className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                  />
                  <button type="submit" className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500">Create</button>
                </form>
              </div>
            </section>
          ) : (
            <>
              <section id="experiences-offline" className="m-4 flex flex-col gap-4">
                <div className="m-4">
                  <h2 className="font-bold">Experiences</h2>
                  <p>You are offline. Please login to view your experiences.</p>
                </div>
              </section>
            </>
          )
        }
        
        
      </>
    )
}

export { Experiences };