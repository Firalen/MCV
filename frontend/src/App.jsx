import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Nav from './pages/nav'
import Home from './pages/home'
import Players from './pages/players'
import Fixtures from './pages/fixtures'
import News from './pages/news'
import Store from './pages/store'
import Fans from './pages/fans'
import Login from './pages/login'
import Register from './pages/register'
import Admin from './pages/admin'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div>
        <Router>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<Players />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/news" element={<News />} />
            <Route path="/store" element={<Store />} />
            <Route path="/fans" element={<Fans />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  )
}

export default App
