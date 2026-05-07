import { useState, useEffect } from 'react'
import { fetchApi } from '../api'
import { Schemas, type BulletRead, type CourseRead, type ExperienceRead } from '../types.ts'
import { useAuth } from '../auth/AuthContext.tsx'


interface HighlightsProps {
  profileId: string | null
  profileName: string | null
}

async function createHighlight(profile_id: string, experience_id: string, body: string, sortOrder: string, token: string) {
    const bulletPayload = Schemas.BulletCreateSchema.parse({
        body: body.trim(),
        sort_order: sortOrder.trim() === "" ? undefined : Number(sortOrder.trim()),
      })
    
    const data = await fetchApi(`profiles/${profile_id}/experiences/${experience_id}/bullets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bulletPayload),
      token: token
    })
    return data
}
  
async function createCourse(profile_id: string, experience_id: string, name: string, code: string, sortOrder: string, token: string) {
    const coursePayload = Schemas.CourseCreateSchema.parse({
        name: name.trim(),
        code: code.trim() || undefined,
        sort_order: sortOrder.trim() === "" ? undefined : Number(sortOrder.trim()),
      })

    const data = await fetchApi(`profiles/${profile_id}/experiences/${experience_id}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coursePayload),
      token: token
    })
    return data
}

function experienceOptionLabel(
    e: ExperienceRead,
    schoolDegreeById: Record<number, string>,
  ): string {
    if (e.kind === 'work') {
      return `${e.title ?? ''} - ${e.organization ?? ''}`.replace(/\s*-\s*$/, '').trim()
    }
    if (e.kind === 'school') {
      const deg = schoolDegreeById[e.id] ?? ''
      return `${e.organization ?? ''} - ${deg}`.replace(/\s*-\s*$/, '').trim()
    }
    return (e.title ?? '').trim()
}

function Highlights({ profileId, profileName }: HighlightsProps) {
    const [highlights, setHighlights] = useState<(BulletRead | CourseRead)[]>([])
    const [experiences, setExperiences] = useState([])
    const [experienceId, setExperienceId] = useState("")
    const [experienceKind, setExperienceKind] = useState("")
    const [schoolDegreeById, setSchoolDegreeById] = useState({})
    const [newExperienceBody, setNewExperienceBody] = useState("")
    const [newCourseName, setNewCourseName] = useState("")
    const [newCourseCode, setNewCourseCode] = useState("")
    const [newSortOrder, setNewSortOrder] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { token } = useAuth()
  
    useEffect(() => {
      setLoading(true)
      setError(null)
      if (!token || !profileId)
      {
        setLoading(false)
        return
      }

      if (experienceId === "") {
        setLoading(false)
        return
      }

      const selectedExperienceKind = experiences.find(experience => experience.id === Number(experienceId))?.kind

      let highlightsPath = null
      if (selectedExperienceKind === "work" || selectedExperienceKind === "side_project") {
        highlightsPath = `profiles/${profileId}/experiences/${experienceId}/bullets`
      } else if (selectedExperienceKind === "school") {
        highlightsPath = `profiles/${profileId}/experiences/${experienceId}/courses`
      }

      setExperienceKind(selectedExperienceKind)
      if (highlightsPath === null) {
        setLoading(false)
        return
      }
  
      fetchApi(highlightsPath, {
        headers: {
          "Content-Type": "application/json",
        },
        token: token
      })
        .then(data => {
            let parsed = null
            if (selectedExperienceKind === "school") {
                parsed = Schemas.CourseReadSchema.array().safeParse(data)
            } else {
                parsed = Schemas.BulletReadSchema.array().safeParse(data)
            }
            if (parsed !== null) {
                setHighlights(parsed.success ? parsed.data : [])
            }
        })
        .catch(err => setError(err instanceof Error ? err.message : "Failed to fetch highlights"))
        .finally(() => setLoading(false))
    }, [experienceId, experiences, token, profileId]);

    useEffect(() => {
        setLoading(true)
        setError(null)
        if (!token || !profileId)
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

    useEffect(() => {
        if (!token || !profileId)
        {
          setLoading(false)
          return
        }

        if (!experiences.length) {
          setSchoolDegreeById({})
          return
        }

        let cancelled = false
        const schools = experiences.filter((e) => e.kind === 'school')
        void Promise.all(
          schools.map(async (e) => {
            const data = await fetchApi(
              `profiles/${profileId}/experiences/${e.id}/edu-details`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                token: token
              }
            )

            const parsed = Schemas.EduDetailReadSchema.array().safeParse(data)
            const deg =
              parsed.success && parsed.data[0] ? parsed.data[0].degree : ''
            return [e.id, deg] as const
          }),
        ).then((pairs) => {
          if (!cancelled) setSchoolDegreeById(Object.fromEntries(pairs))
        })
        return () => {
          cancelled = true
        }
      }, [experiences, token, profileId]);
  
    async function handleCreateHighlight() {
      try {
        let newHighlight = null
        if (experienceKind === "work" || experienceKind === "side_project") {
          newHighlight = await createHighlight(profileId, experienceId.toString(), newExperienceBody.trim(), newSortOrder, token)
        } else if (experienceKind === "school") {
          newHighlight = await createCourse(profileId, experienceId.toString(), newCourseName.trim(), newCourseCode.trim(), newSortOrder, token)
        }
  
        setHighlights((prev) => [...prev, newHighlight])
        setNewExperienceBody('')
        setNewCourseName('')
        setNewCourseCode('')
        setNewSortOrder('')
      } catch (e) {
        // set error state if you want
      }
    }
  
    return (
      <>
      {
        profileId ? (
          <section id="highlights" className="m-4">
            <div id="center" className="m-4">
              <h2 className="font-bold">
                Highlights List for {profileName}
              </h2>
              <div>
                {loading ? "Loading..." : error ? "Error: " + error : "No error"}
                {experienceKind === "school" ? highlights.map((highlight: CourseRead) => (
                  <div key={highlight.id}>
                      <h2>{highlight.name}</h2>
                      <p>{highlight.code}</p>
                  </div>
                )) : highlights.map((highlight: BulletRead) => (
                  <div key={highlight.id}>
                      <h2>{highlight.body}</h2>
                  </div>
                ))}
              </div>
            </div>
      
            <div id="create-highlight" className="m-4 flex flex-col gap-2">
              <h2>Create Highlight</h2>
              <select 
                name="experience-specific" 
                value={experienceId}
                onChange={e => setExperienceId(e.target.value)}
                className="text-slate-800 dark:bg-gray-50 rounded-2xl pl-4 pr-12 py-0.5"
              >
                <option value="">Select an experience</option>
                {experiences.map(e => (
                  <option key={e.id} value={e.id}>{experienceOptionLabel(e, schoolDegreeById)}</option>
                ))}
              </select>
              {
                  experienceKind === "work" || experienceKind === "side_project" ? 
                  <textarea 
                    rows={4}
                    required
                    placeholder="Enter experience body..." 
                    value={newExperienceBody}
                    onChange={e => setNewExperienceBody(e.target.value)}
                    className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                  />
                  : null
              }
              {
                  experienceKind === "school" ? 
                  <input 
                    type="text" 
                    required
                    placeholder="Enter course name..." 
                    value={newCourseName}
                    onChange={e => setNewCourseName(e.target.value)}
                    className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                  />
                  : null
              }
              {
                  experienceKind === "school" ? 
                  <input 
                    type="text" 
                    placeholder="Enter course code..." 
                    value={newCourseCode}
                    onChange={e => setNewCourseCode(e.target.value)}
                    className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
                  />
                  : null
              }
              <input 
                type="text" 
                placeholder="Enter sort order..." 
                value={newSortOrder}
                onChange={e => setNewSortOrder(e.target.value)}
                className="text-slate-800 dark:bg-gray-50 rounded-2xl px-4 py-0.5"
              />
              <button onClick={() => void handleCreateHighlight()} className="cursor-pointer text-white bg-blue-300 rounded-2xl px-4 py-0.5 hover:bg-blue-400 hover:opacity-80 active:scale-95 active:bg-blue-500">Create</button>
            </div>
          </section>
        ) : (
          <section id="highlights-offline" className="m-4 flex flex-col gap-4">
            <div className="m-4">
              <h2 className="font-bold">Highlights</h2>
              <p>Please login and select an experience to view your highlights.</p>
            </div>
          </section>
        )
      }  
      </>
    )
}

export { Highlights };