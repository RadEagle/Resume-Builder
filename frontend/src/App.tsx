import './App.css'
import { useState } from 'react'
import { ViteStarter, ViteNextSteps } from './Components/Vite.tsx'
import { Profiles } from './Components/Profiles.tsx'
import { Experiences } from './Components/Experiences.tsx'
import { Skills } from './Components/Skills.tsx'
import { Highlights } from './Components/Highlights.tsx'
import { Authorization } from './Components/Authorization.tsx'
import { Welcome } from './Components/Welcome.tsx'
import { useAuth } from './auth/AuthContext.tsx'


function App() {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [profileName, setProfileName] = useState<string | null>(null)
  const [experienceVersion, setExperienceVersion] = useState<number>(0)
  const { token } = useAuth()

  const handleProfileChange = (profileId: string, profileName: string) => {
    setProfileId(profileId)
    setProfileName(profileName)
  }

  const handleExperienceChange = () => {
    setExperienceVersion((prev) => prev + 1)
  }

  return (
    <>
      <ViteStarter />
      <div className="ticks"></div>

      {
        token ? (
          <>
            <section id="welcome" className="flex flex-col items-center">
              <Welcome />
            </section>
            <section id="main-content" className="flex gap-4 justify-center">
              <Profiles onProfileChange={handleProfileChange}/>
              <Experiences profileId={profileId} profileName={profileName} onExperienceChange={handleExperienceChange}/>
            </section>

            <div className="ticks"></div>

            <section id="secondary-content" className="flex gap-4 justify-center">
              <Skills profileId={profileId} profileName={profileName}/>
              <Highlights profileId={profileId} profileName={profileName} experienceVersion={experienceVersion}/>
            </section>
          </>
        ) : (
          <section id="authorization" className="flex justify-center">
            <Authorization />
          </section>
        )
      }

      <div className="ticks"></div>

      <ViteNextSteps />
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App