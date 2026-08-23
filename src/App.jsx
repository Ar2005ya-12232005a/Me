import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Work from './pages/Work'
import AboutMe from './pages/AboutMe'
import Experience from './pages/Experience'
import Contact from './pages/Contact'
import ProjectDetail from './pages/ProjectDetail'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<ProjectDetail />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}