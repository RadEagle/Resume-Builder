import './App.css'
import { useState } from 'react'
import { ViteStarter, ViteNextSteps } from './Components/Vite.tsx'
import { Profiles } from './Components/Profiles.tsx'
import { Experiences } from './Components/Experiences.tsx'
import { Skills } from './Components/Skills.tsx'
import { Highlights } from './Components/Highlights.tsx'
import { Authorization } from './Components/Authorization.tsx'


function App() {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [profileName, setProfileName] = useState<string | null>(null)

  const handleProfileChange = (profileId: string, profileName: string) => {
    setProfileId(profileId)
    setProfileName(profileName)
  }

  return (
    <>
      <ViteStarter />
      <div className="ticks"></div>

      <section id="authorization" className="flex justify-center">
        <Authorization />
      </section>

      <section id="main-content" className="flex gap-4 justify-center">
        <Profiles onProfileChange={handleProfileChange}/>
        <Experiences profileId={profileId} profileName={profileName}/>
      </section>

      <div className="ticks"></div>

      <section id="secondary-content" className="flex gap-4 justify-center">
        <Skills profileId={profileId} profileName={profileName}/>
        <Highlights profileId={profileId} profileName={profileName}/>
      </section>

      <div className="ticks"></div>

      <ViteNextSteps />
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App