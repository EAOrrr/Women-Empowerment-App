import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import {
  AppBar,
  Toolbar,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Badge

} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { logout } from '../reducers/userReducer'

const pages = [
  { label: '首页', href: '/' },
  { label: '留言板', href: '/messages' },
  { label: '文章管理', href: '/articles' },
  { label: '招聘信息', href: '/recruitment' },
  { label: '关于我们', href: '/about' },
]

const NavigationBarSmallScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [anchorElNav, setAnchorElNav] = useState(null)
  const [acnhorElMore, setAnchorElMore] = useState(null)

  const notificationCount = useSelector(state => state.user.notificationCount)

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

  const handleClickPage = (event, href) => {
    setAnchorElNav(null)
    navigate(href)
  }

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box sx={{
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1 }}>
            <Box sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
            }}>
              <IconButton
                size='large'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                {pages.map(page => (
                  <MenuItem key={page.label} onClick={e => handleClickPage(e, page.href)}>
                    <Typography variant='inherit' textAlign={'center'}>{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* 小屏幕用户菜单 */}
            <Box sx={{
              display: { xs: 'flex', md: 'none' },
              mr: 1
            }} >
              <IconButton
                size='large'
                color='inherit'
                onClick={handleOpenMoreMenu}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={acnhorElMore}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(acnhorElMore)}
                onClose={handleCloseMoreMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={() => {
                  setAnchorElMore(null)
                  navigate('/notifications')
                }}>
                  <Typography variant='inherit' textAlign='center'>查看消息</Typography>
                  <Badge badgeContent={notificationCount || 0} color='primary' max={99} />
                </MenuItem>
                <MenuItem onClick={() => {
                  setAnchorElMore(null)
                  dispatch(logout())
                }}>
                  <Typography variant='inherit' textAlign='center'>退出登录</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )}

export default NavigationBarSmallScreen