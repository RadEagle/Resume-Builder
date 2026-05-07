import { useState, useEffect } from 'react'
import { fetchApi } from '../api'
import { Schemas, type ExperienceCreate } from '../types.ts'
import { useAuth } from '../auth/AuthContext.tsx'


interface ExperiencesProps {
  profileId: string | null
  profileName: string | null
  onExperienceChange: () => void
}

async function createExperience(profile_id: string, experiencePayload: ExperienceCreate, token: string) {
    const data = await fetchApi(`profiles/${profile_id}/experiences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(experiencePayload),
      token: token
    })
    return data
}
  
async function createEducationDetail(profile_id: string, experience_id: string, degree: string, major: string, gpa: string, token: string) {
    const educationDetailPayload = Schemas.EduDetailCreateSchema.parse({
        degree: degree.trim(),
        major: major.trim() || undefined,
        gpa: gpa.trim() === "" ? undefined : Number(gpa.trim())
    })

    const data = await fetchApi(`profiles/${profile_id}/experiences/${experience_id}/edu-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(educationDetailPayload),
      token: token
    })
    return data
}

function Experiences({ profileId, profileName, onExperienceChange }: ExperiencesProps) {
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

      if (!token || !/^\d+$/.test(profileId))
      {
        setLoading(false)
        return
      }

      const experiencesPath = `profiles/${profileId}/experiences`
  
      fetchApi(experiencesPath, {
        headers: {
          "Content-Type": "application/json",
        },
        token: token
      })
        .then(data => {
          const parsed = Schemas.ExperienceReadSchema.array().safeParse(data)
          setExperiences(parsed.success ? parsed.data : [])
        })
        .catch(err => setError(err instanceof Error ? err.message : "Failed to fetch experiences"))
        .finally(() => setLoading(false))
    }, [token, profileId]);
  
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
  
        const newExperience = await createExperience(profileId, experiencePayload, token)
  
        if (newExperienceKind === 'school') {
          await createEducationDetail(profileId, newExperience.id.toString(), newDegree.trim(), newMajor.trim(), newGPA.trim(), token)
        }

        onExperienceChange()
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
          profileId ? (
            <section id="experiences" className="m-4">
              <div id="center" className="m-4">
                <h2 className="font-bold">
                  Experiences List for {profileName}
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
                  <p>Please login select a profile to view your experiences.</p>
                </div>
              </section>
            </>
          )
        }
        
        
      </>
    )
}

export { Experiences };