import {
  Box,
  Fab,
  IconButton

} from '@mui/material'
import { Link, useSearchParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import RecruitmentList from './RecruitmentList'
// import { useGetRecruitmentsQuery } from '../services/recruitmentsApi'
// import Loading from '../components/Utils/Loading'
import SearchBar from '../../../components/SearchBar'
import Selector from '../../../components/Selector'

const orderings = [
  { label: '最新发布', value: 'created-at' },
  { label: '最新更新', value: 'updated-at' },
  { label: '最多评论', value: 'comments' },
  { label: '最多喜欢', value: 'likes' },
]

const RecruitmentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const ordering = searchParams.get('ordering') || 'created-at'

  const handleOrderingChange = (event) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('ordering', event.target.value)
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  return (
    <Box>
      <h1>招聘启事</h1>
      <SearchBar />
      <div>
        <Selector
          label="排序方式"
          value={ordering}
          options={orderings}
          defaultValue={orderings[0].value}
          handleChange={handleOrderingChange}
          sx={{ width: '150px', margin: '10px' }}
        />
      </div>
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