import './App.css'
import { ViteStarter, ViteNextSteps } from './Components/Vite.tsx'
import { Profiles } from './Components/Profiles.tsx'
import { Experiences } from './Components/Experiences.tsx'
import { Skills } from './Components/Skills.tsx'
import { Highlights } from './Components/Highlights.tsx'

function App() {
  return (
    <>
      <ViteStarter />
      <div className="ticks"></div>

      <section id="main-content" className="flex gap-4 justify-center">
        <Profiles />
        <Experiences />
      </section>

      <div className="ticks"></div>

      <section id="secondary-content" className="flex gap-4 justify-center">
        <Skills />
        <Highlights />
      </section>

      <div className="ticks"></div>

      <ViteNextSteps />
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App