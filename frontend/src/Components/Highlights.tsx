import { useState, useEffect } from 'react'
import { buildUrl } from '../api'
import { HARDCODED_PROFILE_ID } from '../config.ts'


async function createHighlight(profile_id: string, experience_id: string, body: string, sort_order: number) {
    const response = await fetch(buildUrl(`profiles/${profile_id}/experiences/${experience_id}/bullets`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        body: body,
        sort_order: sort_order
      })
    })
    if (!response.ok) {
      throw new Error("Failed to create experience highlight")
    }
    return response.json()
}
  
async function createCourse(profile_id: string, experience_id: string, name: string, code: string, sort_order: number) {
    const response = await fetch(buildUrl(`profiles/${profile_id}/experiences/${experience_id}/courses`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        name: name,
        code: code,
        sort_order: sort_order
      })
    })
    if (!response.ok) {
      throw new Error("Failed to create course")
    }
    return response.json()
}

function Highlights() {
    const [highlights, setHighlights] = useState([])
    const [experiences, setExperiences] = useState([])
    const [experienceId, setExperienceId] = useState("")
    const [experienceKind, setExperienceKind] = useState("")
    const [newExperienceBody, setNewExperienceBody] = useState("")
    const [newCourseName, setNewCourseName] = useState("")
    const [newCourseCode, setNewCourseCode] = useState("")
    const [newSortOrder, setNewSortOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
    useEffect(() => {
      setLoading(true)
      setError(null)
      if (experienceId === "") {
        return
      }

      const selectedExperienceKind = experiences.find(experience => experience.id === Number(experienceId))?.kind

      let highlightsPath = null
      if (selectedExperienceKind === "work" || selectedExperienceKind === "side_project") {
        highlightsPath = buildUrl(`profiles/${HARDCODED_PROFILE_ID}/experiences/${experienceId}/bullets`)
      } else if (selectedExperienceKind === "school") {
        highlightsPath = buildUrl(`profiles/${HARDCODED_PROFILE_ID}/experiences/${experienceId}/courses`)
      }

      setExperienceKind(selectedExperienceKind)
      if (highlightsPath === null) {
        setLoading(false)
        return
      }
  
      fetch(highlightsPath)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch experiences")
          }
          return response.json()
        })
        .then(data => setHighlights(data))
        .catch(err => setError(err instanceof Error ? err.message : "An unknown error occurred"))
        .finally(() => setLoading(false))
    }, [experienceId]);

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
  
    async function handleCreateHighlight() {
      try {
        let newHighlight = null
        if (experienceKind === "work" || experienceKind === "side_project") {
          newHighlight = await createHighlight(HARDCODED_PROFILE_ID.toString(), experienceId.toString(), newExperienceBody.trim(), newSortOrder)
        } else if (experienceKind === "school") {
          newHighlight = await createCourse(HARDCODED_PROFILE_ID.toString(), experienceId.toString(), newCourseName.trim(), newCourseCode.trim(), newSortOrder)
        }
  
        setHighlights((prev) => [...prev, newHighlight])
        setNewExperienceBody('')
        setNewCourseName('')
        setNewCourseCode('')
        setNewSortOrder(null)
      } catch (e) {
        // set error state if you want
      }
    }
  
    return (
      <>
        <section id="experiences" className="m-4">
          <div id="center" className="m-4">
            <h2 className="font-bold">
              Highlights List
            </h2>
            <div>
              {loading ? "Loading..." : error ? "Error: " + error : "No error"}
              {highlights.map(highlight => (
                <div key={highlight.id}>
                    <h2>{highlight.name}</h2>
                    <p>{highlight.body}</p>
                    <p>{highlight.code}</p>
                </div>
              ))}
            </div>
          </div>
    
          <div id="create-experience" className="m-4 flex flex-col gap-2">
            <h2>Create Experience</h2>
            <select 
              name="experience-specific" 
              value={experienceId}
              onChange={e => setExperienceId(e.target.value)}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl pl-4 pr-12 py-0.5"
            >
              <option value="">Select an experience</option>
              {experiences.map(experience => (
                <option key={experience.id} value={experience.id}>{experience.title} - {experience.organization}</option>
              ))}
            </select>
            <textarea 
              rows={4}
              placeholder="Enter experience body..." 
              value={newExperienceBody}
              onChange={e => setNewExperienceBody(e.target.value)}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <input 
              type="text" 
              placeholder="Enter course name..." 
              value={newCourseName}
              onChange={e => setNewCourseName(e.target.value)}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <input 
              type="text" 
              placeholder="Enter course code..." 
              value={newCourseCode}
              onChange={e => setNewCourseCode(e.target.value)}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <input 
              type="text" 
              placeholder="Enter sort order..." 
              value={newSortOrder}
              onChange={e => setNewSortOrder(Number(e.target.value))}
              className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
            />
            <button onClick={() => void handleCreateHighlight()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500">Create</button>
          </div>
        </section>
        
      </>
    )
}

export { Highlights };