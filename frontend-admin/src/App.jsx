import {
  Routes, Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { initializeUser } from './reducers/userReducer'

import ProtectedRoute from './components/ProtecedRoute'

import Login from './pages/Login'
import ArticlePage from './pages/Articles/ArticlePage'
import ArticlesPage from './pages/Articles/ArticlesPage'
import ArticlesCreatePage from './pages/Articles/ArticleCreatePage'
import ArticleEditPage from './pages/Articles/ArticleEditPage'
import PostsPage from './pages/Posts/PostsPage'
import PostCreatePage from './pages/Posts/PostCreatePage'
import PostPage from './pages/Posts/PostPage'
import RecruitmentsPage from './pages/Recruitment/RecruitmentsPage'
import RecruitmentCreatePage from './pages/Recruitment/RecriutmentCreatetPage'
import RecruitmentPage from './pages/Recruitment/RecruitmentPage'
import NotificationPage from './pages/NotificationPage'
import ConstructingPage from './pages/ConstructingPage'
import OtherPage from './pages/OtherPage'
// import Test from './pages/Test'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={ <Login />} />
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
      <Route path='/test/:id' element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
      <Route path='/' element={<Navigate to='/posts' />} />
      <Route path='*' element={<ConstructingPage />}/>
    </>
  )
)

function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])



  return (
    <RouterProvider router={router}/>
  )
  // return (
  //   <Routes>
  //     <Route path='/login' element={!user.loading && user.info ? <Navigate to='/posts'/> : <Login />} />
  //     <Route path='/articles' element={<ProtectedRoute><ArticlesPage/></ProtectedRoute>} />
  //     <Route path='/articles/create' element={<ProtectedRoute><ArticlesCreatePage /></ProtectedRoute>} />
  //     <Route path='/articles/:id' element={<ProtectedRoute><ArticleEditPage /></ProtectedRoute>} />
  //     <Route path='/recruitment' element={<ProtectedRoute><RecruitmentsPage /></ProtectedRoute>} />
  //     <Route path='/recruitment/create' element={<ProtectedRoute><RecruitmentCreatePage /></ProtectedRoute>} />
  //     <Route path='/recruitment/:id' element={<ProtectedRoute><RecruitmentPage /></ProtectedRoute>} />
  //     <Route path='/about' element={<ProtectedRoute><ConstructingPage /></ProtectedRoute>} />
  //     <Route path='/other' element={<ProtectedRoute><OtherPage /></ProtectedRoute>} />
  //     <Route path='/posts' element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
  //     <Route path='/posts/create' element={<ProtectedRoute><PostCreatePage /></ProtectedRoute>} />
  //     <Route path='/posts/:id' element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
  //     <Route path='/notifications' element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
  //     <Route path='/test/:id' element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
  //     {/* <Route path='/test' element={<ProtectedRoute><Test /></ProtectedRoute>} /> */}
  //     {/* <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} /> */}
  //     <Route path='/' element={<Navigate to='/posts' />} />
  //     {/* <Route path='/test' element={<Test />} /> */}
  //     <Route path='*' element={<ConstructingPage />}/>
  //   </Routes>
  // )
}

export default App

