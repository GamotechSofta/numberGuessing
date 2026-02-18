import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Results from './pages/Results'
import Tips from './pages/Tips'
import Charts from './pages/Charts'
import About from './pages/About'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 w-full m-0 p-0">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
