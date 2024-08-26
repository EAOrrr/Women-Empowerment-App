import {
  BrowserRouter as Router,
  Routes, Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import Login from './pages/Login'
import ArticlesPage from './pages/ArticlesPage'
// import NavigationBar from './components/NavigationBar'
import AppBar from './components/AppBar'
import { useDispatch, useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtecedRoute'
import { useEffect } from 'react'
import { initializeUser } from './reducers/userReducer'
import ArticlesCreatePage from './pages/ArticleCreatePage'
import HomePage from './pages/HomePage'
import PostsPage from './pages/PostsPage'
import ArticlePage from './pages/ArticlePage'
// import ArticlesSearchPage from './pages/ArticleSearchPage'
import Test from './pages/Test'


function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  return (
    <div>
      <div>
        <Routes>
          <Route path='/login' element={!user.loading && user.info ? <Navigate to='/'/> : <Login />} />
          <Route path='/articles' element={<ProtectedRoute><ArticlesPage/></ProtectedRoute>} />
          <Route path='/articles/create' element={<ProtectedRoute><ArticlesCreatePage /></ProtectedRoute>} />
          <Route path='/articles/:id' element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
          {/* <Route path='/articles/search' element={<ProtectedRoute><ArticlesSearchPage/></ProtectedRoute>} /> */}
          <Route path='/recruitment' element={<ProtectedRoute><h1>Jobs</h1></ProtectedRoute>} />
          <Route path='/about' element={<ProtectedRoute><h1>About</h1></ProtectedRoute>} />
          <Route path='/messages' element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
          <Route path='/notifications' element={<ProtectedRoute><h1>Notifications</h1></ProtectedRoute>} />
          <Route path='test' element={<ProtectedRoute><Test /></ProtectedRoute>} />
          <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}

export default App

