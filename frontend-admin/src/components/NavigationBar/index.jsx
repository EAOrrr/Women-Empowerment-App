import {
  useTheme,
  useMediaQuery,
} from '@mui/material'
import NavigateBarSmallScreen from './NavigationBarSmallScreen'
import NavigateBarLargeScreen from './NavitaionBarLargeScreen'


const NavigateBar = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

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