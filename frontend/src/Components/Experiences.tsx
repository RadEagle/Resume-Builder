import { useState, useEffect } from 'react'
import { buildUrl } from '../api'
import { HARDCODED_PROFILE_ID } from '../config.ts'


async function createExperience(profile_id: string, title: string, organization: string, location: string, kind: string) {
    const response = await fetch(buildUrl(`profiles/${profile_id}/experiences`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        title: title,
        organization: organization,
        location: location,
        kind: kind,
        start_date: "2025-04-29"
      })
    })
    if (!response.ok) {
      throw new Error("Failed to create experience")
    }
    return response.json()
}
  
async function createEducationDetail(profile_id: string, experience_id: string, degree: string, major: string, gpa: number) {
    const response = await fetch(buildUrl(`profiles/${profile_id}/experiences/${experience_id}/edu-details`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        degree: degree,
        major: major,
        gpa: gpa
      })
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
    const [newGPA, setNewGPA] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
    useEffect(() => {
      setLoading(true)
      setError(null)
      const experiencesPath = buildUrl(`profiles/${HARDCODED_PROFILE_ID}/experiences`)
  
      fetch(experiencesPath)
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
  
    async function handleCreateExperience() {
      try {
        const newExperience = await createExperience(HARDCODED_PROFILE_ID.toString(), newExperienceTitle.trim(), newExperienceOrganization.trim(), newExperienceLocation.trim(), newExperienceKind)
  
        if (newExperienceKind === 'school') {
          await createEducationDetail(HARDCODED_PROFILE_ID.toString(), newExperience.id.toString(), newDegree.trim(), newMajor.trim(), newGPA)
        }
  
        setExperiences((prev) => [...prev, newExperience])
        setNewExperienceTitle('')
        setNewExperienceOrganization('')
        setNewExperienceLocation('')
        setNewExperienceKind('work')
        setNewDegree('')
        setNewMajor('')
        setNewGPA('')
      } catch (e) {
        // set error state if you want
      }
    }
  
    return (
      <>
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
    
          <div id="create-experience" className="m-4 flex flex-col gap-2">
            <h2>Create Experience</h2>
            <input 
              type="text" 
              placeholder="Enter experience title..." 
              value={newExperienceTitle}
              onChange={e => setNewExperienceTitle(e.target.value)}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <input 
              type="text" 
              placeholder="Enter experience organization..." 
              value={newExperienceOrganization}
              onChange={e => setNewExperienceOrganization(e.target.value)}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <input 
              type="text" 
              placeholder="Enter experience location..." 
              value={newExperienceLocation}
              onChange={e => setNewExperienceLocation(e.target.value)}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
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
            <input 
              type="text" 
              placeholder="Enter degree..." 
              value={newDegree}
              onChange={e => setNewDegree(e.target.value)}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <input 
              type="text" 
              placeholder="Enter major..." 
              value={newMajor}
              onChange={e => setNewMajor(e.target.value)}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <input 
              type="text" 
              placeholder="Enter GPA..." 
              value={newGPA}
              onChange={e => setNewGPA(Number(e.target.value))}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <button onClick={() => void handleCreateExperience()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500">Create</button>
          </div>
        </section>
        
      </>
    )
}

export { Experiences };