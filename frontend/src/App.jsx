import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Results from './pages/Results'
import Tips from './pages/Tips'
import Charts from './pages/Charts'
import About from './pages/About'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white w-full m-0 p-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <WhatsAppButton />
      </div>
    </Router>
  )
}

export default App
