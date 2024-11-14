import { useDispatch } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { Box, Typography, Fab, IconButton } from '@mui/material'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { createNotification } from '../../../reducers/notificationReducer'
import { useGetArticleQuery, useUpdateArticleMutation } from '../../../services/articlesApi'
import Loading from '../../../components/Loading'

const typeName = {
  law: '法律条文',
  policy: '政策文件',
  activity: '活动通知',
  guide: '津贴领取',
  report: '工作报告',
}

const ArticlePage = () => {
  const dispatch = useDispatch()
  const actionRef = useRef(null)

  const articleId = useParams().id
  const [updatedArticle, setUpdatedArticle] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const onEntered = () => actionRef?.current?.focusVisible()


  const {
    data: article,
    isLoading,
    isFetching,
    isError,
  } = useGetArticleQuery(articleId)

  const [updateArticle] = useUpdateArticleMutation()

  const handleSubmit = (event) => {
    event.preventDefault()
    updateArticle({
      id: articleId,
      ...updatedArticle
    }).unwrap()
      .then((result) => {
        dispatch(createNotification('更新文章成功', 'success'))
      }).catch((error) => {

        switch (error.status) {
        case 401:
          dispatch(createNotification('请登录', 'error'))
          break
        case 403:
          dispatch(createNotification('无修改该数据权限', 'error'))
          break
        case 404:
          dispatch(createNotification('文章不存在', 'error'))
          break
        case 500:
          dispatch(createNotification('服务器错误', 'error'))
          break
        default:
          dispatch(createNotification('更新文章失败', 'error'))
          console.error(error.data)
        }
      })

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

  if (isLoading || isFetching) {
    return <Loading message={`加载文章${articleId}中`} />
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h6">获取文章失败</Typography>
      </Box>
    )
  }

  return (
    <Box fontFamily='Noto Serif SC'>
      <h1>{article.title}</h1>
      <Typography variant="body2" fontFamily='Noto Serif SC'>{typeName[article.type]}</Typography>
      {article.author && <div><Typography variant="body2" fontFamily='Noto Serif SC'>{article.author}</Typography></div>}
      <Typography variant="body2" fontFamily='Noto Serif SC'>{(new Date(article.createdAt)).toLocaleDateString()}</Typography>
      <Typography variant="body1" fontFamily='Noto Serif SC'>
        {article.content.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </Typography>
      <Fab color="primary" aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}>
        <IconButton component={Link} to={`/articles/${article.id}/edit`} color='inherit'>
          <EditIcon />
        </IconButton>
      </Fab>
    </Box>
  )
}

export default ArticlePage