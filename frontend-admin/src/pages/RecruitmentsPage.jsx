import {
  Box,
  Fab,
  IconButton

} from '@mui/material'
import { Link } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import RecruitmentList from '../components/RecruitmentList'
import { useGetRecruitmentsQuery } from '../services/recruitmentsApi'
import Loading from '../components/Loading'

const RecruitmentsPage = () => {


  return (
    <Box>
      <h1>招聘启事</h1>
      <RecruitmentList />
      <Fab color="primary" aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}>
        <IconButton component={Link} to='/recruitment/create' color='inherit'>
          <AddIcon />
        </IconButton>
      </Fab>
    </Box>
  )
}

export default RecruitmentsPage