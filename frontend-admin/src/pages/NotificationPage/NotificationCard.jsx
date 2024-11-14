import {
  Paper,
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  Checkbox,
  IconButton
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import { useDeleteNotificationMutation, useUpdateNotificationMutation } from '../../services/messagesApi'
import { useDispatch } from 'react-redux'
import { createNotification } from '../../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'
import { readMessage, unReadMessage } from '../../reducers/userReducer'
const types = {
  'comment_reply': '评论回复',
  'post_created': '新文章',
  'global': '全局',
}

const parseCommentReplyUrl = (jumpTo) => {
  const url = `/posts/${jumpTo.split('/')[2]}` // 获取 postId
  const commentId = jumpTo.split('/')[4] // 获取 commentId
  return { url, state: { commentId } }
}

const parsePostCreatedUrl = (jumpTo) => {
  const url = `/posts/${jumpTo.split('/')[2]}` // 获取 postId
  return { url }
}

const parseUrl = {
  'comment_reply': parseCommentReplyUrl,
  'post_created': parsePostCreatedUrl,
}

const NotificationCard = ({ notification }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [deleteNotification, ] = useDeleteNotificationMutation()
  const [updateNotification, ] = useUpdateNotificationMutation()

  const handleDelete = () => {
    deleteNotification(notification.id)
      .unwrap()
      .then(() => {
        dispatch(createNotification(`删除消息${notification.message}成功`, 'success'))
      }).catch((error) => {
        dispatch(createNotification('删除消息失败', 'error'))
        console.error(error)
      })
  }

  const handleRead = (event) => {
    updateNotification({
      id: notification.id,
      read: event.target.checked
    }).unwrap()
      .then((result) => {
        dispatch(createNotification(`标记消息${notification.message}成功`, 'success'))
        console.log(result)
        if (result.read) {
          dispatch(readMessage())
        } else {
          dispatch(unReadMessage())
        }

      }).catch((error) => {
        dispatch(createNotification('标记消息失败', 'error'))
        console.error(error)
      })
  }

  const { url, state } = notification.jumpTo? parseUrl[notification.type](notification.jumpTo) : { url: '', state: {} }

  return (
    <Card
      onClick={notification.jumpTo
        ? () => navigate(url, { state })
        : undefined}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6">
              {notification.message}
            </Typography>
            <Typography variant="body2">
              {types[notification.type]}
            </Typography>

          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color='textSecondary'>
                {notification.read
                  ? '标记为未读'
                  : '标记为已读'}
              </Typography>
              <Checkbox onChange={handleRead} checked={notification.read}/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color='textSecondary'>
              删除消息
              </Typography>
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default NotificationCard