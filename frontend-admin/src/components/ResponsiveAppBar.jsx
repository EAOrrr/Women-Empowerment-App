import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import MoreIcon from '@mui/icons-material/MoreVert'
import AccountCircle from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Badge } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const pages = ['留言板', '文章管理', '招聘信息', '关于我们']
const pageLinks = ['/', '/articles', '/recruitment', '/about']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

function ResponsiveAppBar() {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [anchorElMore, setAnchorElMore] = React.useState(null)


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleOpenMoreMenu = (event) => {
    setAnchorElMore(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null)
  }

  const handleClickPage = (index) => {
    setAnchorElNav(null)
    navigate(pageLinks[index])
  }


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
         

          {/* xs: 超小屏幕， md：中等屏幕，此box显示在超小屏幕 */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>


          </Box>

          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography> */}
                        {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}> */}
              {/* <Box sx={{ flexGrow: 1 }} /> */}
              <IconButton
              size="large"
              aria-label="show more"
              // aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleOpenMoreMenu}
              color="inherit"
            >
              <MoreIcon />
              </IconButton>
            
            {/* </Box> */}

         
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
