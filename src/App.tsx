import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { SheetProvider } from './sheet/SheetProvider'
import { Home } from './pages/Home'
import { Spelers } from './pages/Spelers'
import { Trainingen } from './pages/Trainingen'
import { Matchen } from './pages/Matchen'
import { Evenementen } from './pages/Evenementen'
import { Gedragscodes } from './pages/Gedragscodes'
import { GedragscodeDetail } from './pages/GedragscodeDetail'
import { Info } from './pages/Info'
import { Kalender } from './pages/Kalender'
import { IdleFunProvider } from './fun/IdleFunContext'
import { IdleBallEasterEgg } from './components/IdleBallEasterEgg'
import { AudioUnlock } from './components/AudioUnlock'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <BrowserRouter>
      <SheetProvider>
        <IdleFunProvider>
          <AudioUnlock />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/spelers" element={<Spelers />} />
                <Route path="/trainingen" element={<Trainingen />} />
                <Route path="/matchen" element={<Matchen />} />
                <Route path="/kalender" element={<Kalender />} />
                <Route path="/evenementen" element={<Evenementen />} />
                <Route path="/gedragscodes" element={<Gedragscodes />} />
                <Route path="/gedragscodes/:slug" element={<GedragscodeDetail />} />
                <Route path="/info" element={<Info />} />
              </Routes>
            </main>
            <Footer />
            <IdleBallEasterEgg />
          </div>
          <Analytics />
        </IdleFunProvider>
      </SheetProvider>
    </BrowserRouter>
  )
}
