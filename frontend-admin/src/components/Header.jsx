import { Container, Alert } from "@mui/material";
import AppBar from "./AppBar";
import { useSelector } from 'react-redux'

const Header = () => {
  const notification = useSelector(state => state.notification)
  return (
    <div>
      <AppBar />
      <Container>
        {notification.message
          ? <Alert severity={notification.type}>{notification.message}</Alert>
          : null
        }
      </Container>
      
    </div>
  );
}

export default Header;