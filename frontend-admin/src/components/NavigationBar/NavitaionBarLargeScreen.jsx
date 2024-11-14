import {
  Box,
  IconButton,
  Typography,
  Button,
  Badge,
  AppBar,
  Container,
  Toolbar

} from '@mui/material'
import { Link } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../reducers/userReducer'

const pages = [
  // { label: '首页', href: '/' },
  { label: '留言板', href: '/posts' },
  { label: '文章管理', href: '/articles' },
  { label: '招聘信息', href: '/recruitment' },
  // { label: '关于我们', href: '/about' },
  { label: '其他功能', href: '/other' }
]


const NavigationBarLargeScreen = () => {
  const dispatch = useDispatch()

  const notificationCount = useSelector(state => state.user.info.notificationCount)

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          {/* 中等屏幕导航菜单 */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' }
          }}>
            {pages.map(page => (
              <Button
                key={page.label}
                // onClick={() => handleClickPage(page.href)}
                component={Link}
                to={page.href}
                sx={{ mx: 1, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {/* 中等屏幕用户菜单 */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' }
          }}>
            <IconButton
              size='large'
              color='inherit'
              component={Link}
              to='/notifications'
            >
              <Badge badgeContent={notificationCount || 0} color='error' max={99}>
                <NotificationsIcon />
              </Badge>
              <Typography variant='body2' textAlign='center'>消息</Typography>
            </IconButton>
            <Button onClick={() => dispatch(logout())}>
              <Typography variant='inherit' textAlign='center' color='white'>退出登录</Typography>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavigationBarLargeScreen