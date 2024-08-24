import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import articleService from '../services/articles'
import { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { createNotification } from '../reducers/notificationReducer'

const ArticlePage = () => {
  const dispatch = useDispatch()
  const articleId = useParams().id
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const articleToUpdate = await articleService.getOne(articleId)
        setArticle(articleToUpdate)
        setLoading(false)
      } catch (error) {
        dispatch(createNotification('无法获取对于的文章', 'error')) 
        console.error(error)
        setLoading(false)
      }
    }
    fetchData()
  }, [dispatch, articleId])

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
        <Typography variant="h6">获取文章中</Typography>
      </Box>
    )
  }
  if (!article) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h6"><CloseIcon />文章不存在</Typography>
      </Box>
    )
  }
  return (
    <div>
      <h1>Article Page</h1>
      <div>
        <h2>{article.title}</h2>
        <p>{article.content}</p>
      </div>
    </div>
  )
}

export default ArticlePage