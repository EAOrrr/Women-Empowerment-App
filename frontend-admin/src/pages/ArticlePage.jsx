import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import articleService from '../services/articles'
import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { createNotification } from '../reducers/notificationReducer'
import ArticleForm from '../components/ArticleForm'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button
} from '@mui/material'
import { updateAndPutArticle } from '../reducers/articlesReducer'

const ArticlePage = () => {
  const dispatch = useDispatch()
  const actionRef = useRef(null)

  const articleId = useParams().id
  const [article, setArticle] = useState(null)
  const [updatedArticle, setUpdatedArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const onEntered = () => actionRef?.current?.focusVisible()

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
  console.log(articleId)

  const handleSubmit = (event) => {
    event.preventDefault()
    // articleService.update(updatedArticle)
    dispatch(updateAndPutArticle(articleId, updatedArticle))
    setDialogOpen(false)
  }

  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleOpenDialog = (updatedArticle) => {
    return (event) => {
      event.preventDefault()
      setDialogOpen(true)
      setUpdatedArticle(updatedArticle)
    }
  }

  const ConfirmDialog = () => (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      TransitionProps={{ onEntered }}
      // disableRestoreFocus
    >
      <DialogContent>
        <DialogContentText>
        确认更新文章{article.title}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSubmit} action={(actions) => (actionRef.current = actions)}>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  )

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

      <ArticleForm article={article} handleSubmit={handleOpenDialog} buttonLable='更新文章'/>
      <ConfirmDialog />
    </div>
  )
}

export default ArticlePage