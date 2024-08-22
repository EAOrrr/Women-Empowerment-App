import {
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/userReducer'
import NavigateBarSmallScreen from './NavigationBarSmallScreen'
import NavigateBarLargeScreen from './NavitaionBarLargeScreen'
const pages = [
  { label: '首页', href: '/' },
  { label: '留言板', href: '/messages' },
  { label: '文章管理', href: '/articles' },
  { label: '招聘信息', href: '/recruitment' },
  { label: '关于我们', href: '/about' },
]

const settings = [
  '消息',
  '退出登录'
]

const NavigateBar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  console.log('issmall', isSmallScreen)

  const [anchorElNav, setAnchorElNav] = useState(null)
  const [acnhorElMore, setAnchorElMore] = useState(null)

  const notificationCount = useSelector(state => state.user.notificationCount)

  const settings = [
    { label: '查看消息', action: () => navigate('/notifications') },
    { label: '退出登录', action: () => dispatch(logout()) }
  ]

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleOpenMoreMenu = (event) => {
    setAnchorElMore(event.currentTarget)
  }

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null)
  }

  return (
    <div>
      {isSmallScreen
        ? <NavigateBarSmallScreen />
        : <NavigateBarLargeScreen />
      }
    </div>


  )
}

export default NavigateBar