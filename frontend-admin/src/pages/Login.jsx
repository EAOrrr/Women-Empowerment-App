import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { useField } from '../hooks'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { useNavigate } from 'react-router-dom'


const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
      navigate('/')
    }
    catch (exception) {
      console.log('wrong credentials')
    }
  }

  return (
    <div>
      <Container maxWidth='xs' component='main'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
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