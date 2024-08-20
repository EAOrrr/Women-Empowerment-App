import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Selector from '../components/Selector'
import { fetchFirstPage } from '../reducers/articlesReducer'
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const articlePerPage = 3
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

const ArticlesPage = () => {
  const dispatch = useDispatch()

  const [page, setPage] = useState(1)
  const [ordering, setOrdering] = useState('')
  const [type, setType] = useState('')

  const articles = useSelector(state => state.articles.articles[page])
  const count = useSelector(state => state.articles.totalPages)

  const handleOrderingChange = (event) => {
    setOrdering(event.target.value)
  }
  const handleTypeChange = (event) => {
    setType(event.target.value)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  useEffect(() => {
    console.log('Fetching articles')
    dispatch(fetchFirstPage(articlePerPage, ordering, type))
  }, [dispatch, ordering, type])

  return (
    <div>
      <h1>Articles Page</h1>
      <Selector label="排序方式" value={ordering} options={orderings} handleChange={handleOrderingChange} />
      <Selector label="文章类型" value={type} options={types} handleChange={handleTypeChange} />

      {articles
        ? articles.map(article => (
          <li key={article.id}>
            {article.title} {article.type}<br></br>
            {article.abstract}<br></br>
            {article.views} views {article.likes} likes
          </li>))
        : <p>Loading...</p>
      }
      <Stack spacing={2}>
        <Typography>Page: {page}</Typography>
        <Pagination count={count} page={page} onChange={handlePageChange} />
      </Stack>
    </div>
  )
}

export default ArticlesPage