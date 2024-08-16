import {
  BrowserRouter as Router,
  Routes, Route, Link,
} from 'react-router-dom'
import Login from './pages/Login'
import ArticlesPage from './pages/ArticlesPage'
import NavigationBar from './components/NavigationBar'

function App() {
  

  return (
    <Router>
      <NavigationBar />
      <div>
        <Routes>
          <Route path='/' element={<h1>Home</h1>} />
          <Route path='/login' element={<Login />} />
          <Route path='/articles' element={<ArticlesPage/>} />
          <Route path='/recruitment' element={<h1>Jobs</h1>} />
          <Route path='/about' element={<h1>About</h1>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

