import { Button, TextField } from "@mui/material"
import { useField } from "../hooks"
// import { useDispatch } from "react-redux"
// import login from "../services/login"
import loginService from "../services/login"
import storage from "../services/storage"

const Login = () => {
  // const dispatch = useDispatch()
  const username = useField('username')
  const password = useField('password', 'password')
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(username.value, password.value)
    // console.log('submit')
    try {
      const credentials = {
        username: username.value,
        password: password.value
      }
      // await dispatch(login(credentials))
      await loginService.login(credentials)
      storage.saveUser(credentials)
    }
    catch (exception) {
      console.log('wrong credentials')
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          {/* <TextField label='username' /> */}
          <TextField {...username} />
        </div>
        <div>
          {/* <TextField label='password' type='password' /> */}
          <TextField {...password} />
        </div>
        <div>
          <Button type='submit' variant="contained">Login</Button>
        </div>
      </form>
    </div>
  )
}

export default Login