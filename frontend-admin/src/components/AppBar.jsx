import { useDispatch } from 'react-redux'
import { logout } from '../reducers/userReducer'
import { Link, useNavigate } from 'react-router-dom'

const pages = [
  { label: '首页', value: '' },
  { label: '留言', value: 'messages' },
  { label: '文章', value: 'articles' },
  { label: '招聘', value: 'recruitment' },
  { label: '关于', value: 'about' },
]

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
      {pages.map(page => (
        <Link key={page.value} to={`/${page.value}`} style={padding}>{page.label}</Link>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default AppBar