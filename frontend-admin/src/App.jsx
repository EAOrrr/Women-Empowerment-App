import './App.css'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
} from 'react-router-dom'
import Login from './pages/Login'

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<h1>Home</h1>} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

