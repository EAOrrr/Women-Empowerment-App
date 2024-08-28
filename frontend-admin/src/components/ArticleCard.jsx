import { Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Typography,
  Box,
  Divider,
  IconButton } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { useDispatch } from 'react-redux'
import { useDeleteArticleMutation } from '../services/articlesApi'
import { createNotification } from '../reducers/notificationReducer'

const typeName = {
  law: '法律条文',
  policy: '政策文件',
  activity: '活动通知',
  guide: '津贴领取',
  report: '工作报告',
}

const ArticleCard = ({ article }) => {
  const dispatch = useDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteArticle] = useDeleteArticleMutation()
  const createdDate = new Date(article.createdAt)
  const updatedDate = new Date(article.updatedAt)

  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleConfirm = () => {
    // dispatch(deleteArticleById(article.id))
    deleteArticle(article.id)
      .unwrap()
      .then(() => {
        // dispatch(deleteArticleById(article.id))
        dispatch(createNotification(`删除文章${article.title}成功`, 'success'))
        setDialogOpen(false)
      })
      .catch((error) => {
        dispatch(createNotification('删除文章失败', 'error'))
        console.error(error)
      })
    setDialogOpen(false)
  }

  const handleDelete = () => {
    setDialogOpen(true)
  }

  const ConfirmDialog = () => (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          确认删除文章 {article.title}？
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleConfirm} autoFocus>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
      <Card className="article-card" sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, cursor: 'pointer' }} fontFamily='Noto Serif SC'>
          <CardActionArea component={Link} to={`/articles/${article.id}`}>
            <CardContent>
              <Typography variant="h5" component="h2" fontFamily='Noto Serif SC'>
                {article.title}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexDirection: 'column' }}>
                <Typography
                  variant="body2"
                  component="p"
                  fontFamily='Noto Serif SC'
                >
                  {typeName[article.type]}
                </Typography>
              </Box>
              <Typography variant="body2"  color="textSecondary" component="p" fontFamily='Noto Serif SC'>
                {article.author}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" fontFamily='Noto Serif SC'>
                {article.abstract}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexDirection: 'column' }}>
                <Typography variant="caption" color="textSecondary" component="p" fontFamily='Noto Serif SC'>
                  创建时间: {createdDate.toLocaleDateString()}
                  <br></br>
                  最后更新时间: {updatedDate.toLocaleDateString()}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'colomn', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center ' }}>
                    <VisibilityIcon fontSize='small' />
                    <Typography variant="caption" color="textSecondary" component="p" fontFamily='Noto Serif SC' sx={{ alignItems: 'center' }}>
                      {article.views}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <ThumbUpIcon fontSize='small'/>
                    <Typography variant="caption" color="textSecondary" component="p" fontFamily='Noto Serif SC' sx={{ alignItems: 'center' }}>
                      {article.likes}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ ml: 10 }}>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant='body2' color='textSecondary' component='p'>
            删除文章
            </Typography>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>
      <ConfirmDialog />
    </>
  )
}

export default ArticleCard