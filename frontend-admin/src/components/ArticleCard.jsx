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
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
// import { deleteArticleById } from '../reducers/articlesReducer'
import { useDispatch } from 'react-redux'
import { useDeleteArticleMutation } from '../reducers/articlesApi'
import { create } from 'lodash'
import { createNotification } from '../reducers/notificationReducer'

const typeName = {
  law: '法律条文',
  policy: '政策文件',
  activity: '活动通知',
}

const ArticleCard = ({ article }) => {
  const navigate = useNavigate()
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

  const handleClickCard = () => {
    console.log('click card', article.title)
    navigate(`/articles/${article.id}`)
  }

  const handleDelete = () => {
    console.log('delete article', article.id)
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
          <CardActionArea onClick={handleClickCard}>
            {/* <CardHeader  title={article.title} subheader={article.abstra}  /> */}
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
                <Typography variant="body2" color="textSecondary" component="p" fontFamily='Noto Serif SC'>
                  创建时间: {createdDate.getFullYear().toString()}年
                  {createdDate.getMonth().toString()}月
                  {createdDate.getDate().toString()}日 <br></br>
                  {/* 创建时间: {createdDate.getFullYear().toString()} */}
                  {/* 最后更新时间: {updatedDate} */}
                  最后更新时间: {updatedDate.getFullYear().toString()}年
                  {updatedDate.getMonth().toString()}月
                  {updatedDate.getDate().toString()}日
                </Typography>
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