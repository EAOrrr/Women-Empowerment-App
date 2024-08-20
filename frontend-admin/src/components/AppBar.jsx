import { useDispatch } from 'react-redux'
import { logout } from '../reducers/userReducer'
import { Link, useNavigate } from 'react-router-dom'

const AppBar = () => {
  const padding = {
    paddingRight: 5.,
    display: 'inline-block',
    marginRight: '10px'
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }
  return (
    <div>
      <Link to='/' style={padding}>Home</Link>
      <Link to='/articles' style={padding}>Articles</Link>
      <Link to='/recruitment' style={padding}>Jobs</Link>
      <Link to='/about' style={padding}>About</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default AppBar