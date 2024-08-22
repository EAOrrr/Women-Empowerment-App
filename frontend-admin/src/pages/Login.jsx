import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { useField } from '../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../reducers/userReducer'
import { useNavigate } from 'react-router-dom'
import { createNotification } from '../reducers/notification'
import { Alert } from '@mui/material'


const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const notification = useSelector(state => state.notification)

  const username = useField('用户名')
  const password = useField('密码', 'password')

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(username.value, password.value)
    console.log('submit')
    try {
      const credentials = {
        username: username.value,
        password: password.value
      }
      await dispatch(login(credentials))
      dispatch(createNotification('登录成功', 'success'))
      navigate('/')
    }
    catch (exception) {
      console.log('wrong credentials')
      dispatch(createNotification('用户名或密码错误', 'error'))
    }
  }

  return (
    <div>
      <Container maxWidth='xs' component='main'>
        <CssBaseline />
        <Box sx={{
          marginTop: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {notification.message &&
           <Alert
             severity={notification.type}
             sx={{ width: 300, position:'absolute' }}
           >
             {notification.message}
           </Alert>
          }

        </Box>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* {notification.message &&
           <Alert
             severity={notification.type}
             sx={{ width: 300, position:'absolute' }}
           >
             {notification.message}
           </Alert>
          } */}
          <h2> 此处应有LOGO </h2>
          <Typography component='h1' variant='h4' fontFamily='Noto Serif SC'>
          欢迎回来
          </Typography>
          <Box component='form' onSubmit={handleLogin} sx={{ mt: 1 }} width={250}>
            <div>
              <TextField {...username} fullWidth required margin='none'/>
            </div>
            <div>
              <TextField {...password} fullWidth required margin='dense'/>
            </div>
            <div>
              <Button type='submit' variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                <Typography variant='button' fontFamily='Noto Serif SC'>登录</Typography>
              </Button>
            </div>
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default Login