import { CircularProgress, Typography, Box, Container } from "@mui/material"
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import Header from "./Header"

const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state.user)
  const location = useLocation()
  console.log('user in ProtectedRoute', user)
  if (user.loading) {
    // return <div>检查登录状态</div>
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
        <Typography variant="h6">检查登录状态</Typography>
      </Box>
    );
  }
  if (!user.loading && !user.info) {
    console.log('redirect to login')
    return <Navigate to='/login' />
  }

  return (
    <div>
      <Header />
      <Container>
        {children}
      </Container>
    </div>
  )
}

export default ProtectedRoute