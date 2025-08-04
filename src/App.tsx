import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router'

import { ThemeProvider } from "@/components/theme-provider"

import Dashboard from './pages/dashboard'
import Creation from './pages/creation'
import Roadmap from './pages/roadmap'
import Progress from './pages/progress'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/creation" element={<Creation />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<Progress />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
