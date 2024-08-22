import { Container, Alert } from '@mui/material'
import AppBar from './AppBar'
import { useSelector } from 'react-redux'
import NavigateBar from './NavigationBar'

const Header = () => {
  const notification = useSelector(state => state.notification)
  return (
    <div>
      <NavigateBar />
      {/* <AppBar /> */}
      <Container>
        {notification.message
          ? <Alert severity={notification.type}>{notification.message}</Alert>
          : null
        }
      </Container>

    </div>
  )
}

export default Header