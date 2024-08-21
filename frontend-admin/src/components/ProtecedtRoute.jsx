import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state.user)
  if (user.loading) {
    return <div>检查登录状态</div>
  }
  if (!user.loading && !user.info) {
    console.log('redirect to login')
    return <Navigate to='/login' />
  }

  return children
}

export default ProtectedRoute