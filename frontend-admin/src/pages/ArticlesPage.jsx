import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Selector from '../components/Selector'
import SearchIcon from '@mui/icons-material/Search'
import { initializeArticles } from '../reducers/articlesReducer'

import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { FormControl, InputLabel, Input, InputAdornment, IconButton, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { useField } from '../hooks'
import { TextField } from '@mui/material'
// import { useArticle } from '../hooks';
import ArticleList from '../components/ArticleList'
import ArticleSearchBar from '../components/ArticleSearchBar'

const articlePerPage = 7
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
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const ordering = searchParams.get('ordering') || ''
  const type = searchParams.get('type') || ''
  const page = parseInt(searchParams.get('page')) || 1

  const articles = useSelector(state => state.articles.datas)
  console.log('articles', articles)

  useEffect(() => {
    dispatch(initializeArticles())
  }, [dispatch])

  const handleOrderingChange = (event) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('ordering', event.target.value)
    setSearchParams(newParams)
  }
  const handleTypeChange = (event) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('type', event.target.value)
    setSearchParams(newParams)
  }

  const handlePageChange = (event, value) => {
    // setPage(value)
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', value)
    setSearchParams(newParams)
  }

  const handleClick = (event) => {
    event.preventDefault()
    navigate('/articles/create')
  }


  const processedArticle =  articles === undefined
    ? null
    : sortArticles(filterArticles(articles, type), ordering)
  const pagedArticles = processedArticle
    ? processedArticle.slice((page - 1) * articlePerPage, page * articlePerPage)
    : null

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
      <ArticleList articles={pagedArticles} />
      <Stack spacing={2}>
        <Pagination color='primary' count={parseInt((processedArticle.length - 1) / articlePerPage) + 1} page={page} onChange={handlePageChange} />
      </Stack>
    </div>
  )
}

export default ArticlesPage