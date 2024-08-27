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
import PostCreatePage from './pages/PostCreatePage'
import PostPage from './pages/PostPage'
import NotificationPage from './pages/NotificationPage'
import ConstructingPage from './pages/ConstructingPage'
import OtherPage from './pages/OtherPage'
import ArticleEditPage from './pages/ArticleEditPage'
import RecruitmentsPage from './pages/RecruitmentsPage'
import RecruitmentCreatePage from './pages/RecruitmentCreatePage'
import RecruitmentPage from './pages/RecruitmentPage'


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
          <Route path='/login' element={!user.loading && user.info ? <Navigate to='/posts'/> : <Login />} />
          <Route path='/articles' element={<ProtectedRoute><ArticlesPage/></ProtectedRoute>} />
          <Route path='/articles/create' element={<ProtectedRoute><ArticlesCreatePage /></ProtectedRoute>} />
          <Route path='/articles/:id' element={<ProtectedRoute><ArticleEditPage /></ProtectedRoute>} />
          <Route path='/recruitment' element={<ProtectedRoute><RecruitmentsPage /></ProtectedRoute>} />
          <Route path='/recruitment/create' element={<ProtectedRoute><RecruitmentCreatePage /></ProtectedRoute>} />
          <Route path='/recruitment/:id' element={<ProtectedRoute><RecruitmentPage /></ProtectedRoute>} />
          <Route path='/about' element={<ProtectedRoute><ConstructingPage /></ProtectedRoute>} />
          <Route path='/other' element={<ProtectedRoute><OtherPage /></ProtectedRoute>} />
          <Route path='/posts' element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
          <Route path='/posts/create' element={<ProtectedRoute><PostCreatePage /></ProtectedRoute>} />
          <Route path='/posts/:id' element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
          <Route path='/notifications' element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
          <Route path='test/:id' element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
          {/* <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} /> */}
          <Route path='/' element={<Navigate to='/posts' />} />
          <Route path='*' element={<ConstructingPage />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App

