import Selector from '../components/Selector'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import TestList from '../components/TestList'
import ArticleSearchBar from '../components/SearchBar'

const orderings = [
  { label: '最新发布', value: 'created-at' },
  { label: '最多浏览', value: 'views' },
  { label: '最多喜欢', value: 'likes' },
]

const types = [
  { label: '全部', value: '' },
  { label: '法律条文', value: 'law' },
  { label: '政策文件', value: 'policy' },
  { label: '活动通知', value: 'activity' },
]


const Test = () => {
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const ordering = searchParams.get('ordering') || ''
  const type = searchParams.get('type') || ''

  const handleOrderingChange = (event) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('ordering', event.target.value)
    newParams.set('page', 1)
    setSearchParams(newParams)
  }
  const handleTypeChange = (event) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('type', event.target.value)
    newParams.set('page', 1)
    setSearchParams(newParams)
  }


  const handleClick = (event) => {
    event.preventDefault()
    navigate('/articles/create')
  }



  return (
    <div>
      <h1>文章管理</h1>
      <Button variant="outlined" onClick={handleClick} startIcon={<AddIcon />} size='large'>
        创建新文章
      </Button>
      <ArticleSearchBar />

      <div>
        <Selector
          label="排序方式"
          value={ordering}
          options={orderings}
          defaultValue={orderings[0].value}
          handleChange={handleOrderingChange}
          sx={{ width: '150px', margin: '10px' }}
        />
        {/* <Box sx={{ width: '10px' }} /> */}
        <Selector
          label="文章类型"
          value={type}
          options={types}
          defaultValue={types[0].value}
          handleChange={handleTypeChange}
          sx={{ width: '150px', margin: '10px' }}
        />
      </div>
      <TestList />

    </div>
  )
}


export default Test