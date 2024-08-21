import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Selector from '../components/Selector'
import { initializeArticles } from '../reducers/articlesReducer'

import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useSearchParams } from 'react-router-dom';
// import { useArticle } from '../hooks';

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

const sortArticles = (articles, ordering) => {
  if (ordering === 'views') {
    return articles.sort((a, b) => b.views - a.views )
  } else if (ordering === 'likes') {
    return articles.sort((a, b) => b.likes - a.likes )
  } else {
    return articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) )
  }
}

const filterArticles = (articles, type) => {
  if (type === '') {
    return articles.slice()
  } else {
    return articles.filter(article => article.type === type)
  }
}

const ArticlesPage = () => {
  const dispatch = useDispatch()

  const [page, setPage] = useState(1)
  const [ordering, setOrdering] = useState('')
  const [type, setType] = useState('')
  // const [searchParams, setSearchParams] = useSearchParams

  const articles = useSelector(state => state.articles.datas)
  console.log('articles', articles)

  useEffect(() => {
    console.log('Fetching articles')
    dispatch(initializeArticles())
    console.log('Fetched articles')
  }, [dispatch])

  const handleOrderingChange = (event) => {
    setOrdering(event.target.value)
  }
  const handleTypeChange = (event) => {
    setType(event.target.value)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const processedArticle =  articles === undefined
    ? null
    : sortArticles(filterArticles(articles, type), ordering)
  const pagedArticles = processedArticle
    ? processedArticle.slice((page - 1) * articlePerPage, page * articlePerPage)
    : null

  return (
    <div>
      <h1>Articles Page</h1>
      <Selector label="排序方式" value={ordering} options={orderings} handleChange={handleOrderingChange} />
      <Selector label="文章类型" value={type} options={types} handleChange={handleTypeChange} />

      {pagedArticles
        ? pagedArticles.map(article => (
          <li key={article.id}>
            {article.title} {article.type}<br></br>
            {article.abstract}<br></br>
            {article.views} views {article.likes} likes
          </li>))
        : <p>Loading...</p>
      }
      <Stack spacing={2}>
        <Pagination count={parseInt((processedArticle.length + 1) / articlePerPage)} page={page} onChange={handlePageChange} />
      </Stack>
    </div>
  )
}

export default ArticlesPage