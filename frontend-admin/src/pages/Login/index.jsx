import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Alert,
  IconButton } from '@mui/material'

import { useField } from '../../hooks'
import { login } from '../../reducers/userReducer'
import { createNotification } from '../../reducers/notificationReducer'


const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.user)
  if (user.info && !user.loading) {
    navigate('/posts')
  }

  const notification = useSelector(state => state.notification)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // const password = useField('密码', showPassword ? 'text' : 'password')

  const username = useField('用户名')
  // const password = useField('密码', showPassword ? 'text' : 'password')
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    // console.log(username.value, password.value)
    try {
      const credentials = {
        username: username.value,
        password
      }
      await dispatch(login(credentials))
      dispatch(createNotification('登录成功', 'success'))
      // navigate('/')
      navigate('/posts')
    }
    catch (exception) {
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
          <h2>江村女性之声</h2>
          <Typography component='h1' variant='h4' fontFamily='Noto Serif SC'>
          欢迎回来
          </Typography>
          <Box component='form' onSubmit={handleLogin} sx={{ mt: 1 }} width={250}>
            <div>
              <TextField {...username} fullWidth required margin='none'/>
            </div>
            <div>
              <FormControl margin='dense' variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  value={password}
                  onChange={handlePasswordChange}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              {/* <TextField {...password} fullWidth required margin='dense'/> */}
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