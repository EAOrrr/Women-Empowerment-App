import {
  BrowserRouter as Router,
  Routes, Route,
  Navigate,
} from 'react-router-dom'
import Login from './pages/Login'
import ArticlesPage from './pages/ArticlesPage'
// import NavigationBar from './components/NavigationBar'
import AppBar from './components/AppBar'
import { useDispatch, useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtecedtRoute'
import { useEffect } from 'react'
import { initializeUser } from './reducers/userReducer'

function App() {
  const dispatch = useDispatch()
  
  const user = useSelector(state => state.user)

  console.log(user)
  useEffect(() => {
    dispatch(initializeUser()) 
  }, [dispatch])

  return (
    <Router>
      {/* <NavigationBar /> */}
      {user
        ? <AppBar />
        : null}
      <div>
        <Routes>
          <Route path='/' element={<ProtectedRoute><h1>Home</h1></ProtectedRoute>} />
          <Route path='/login' element={user ? <Navigate to='/'/> : <Login />} />
          <Route path='/articles' element={<ProtectedRoute><ArticlesPage/></ProtectedRoute>} />
          <Route path='/recruitment' element={<ProtectedRoute><h1>Jobs</h1></ProtectedRoute>} />
          <Route path='/about' element={<ProtectedRoute><h1>About</h1></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

