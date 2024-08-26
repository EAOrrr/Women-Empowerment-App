import {
  TextField,
  Box,
  Button,
  Typography,
  Paper,
} from '@mui/material'
import { useField } from '../hooks'
import { useCreateNotificationMutation } from '../services/messagesApi'
import { useDispatch } from 'react-redux'
import { createNotification } from '../reducers/notificationReducer'

const NotificationCreate = () => {
  const message = useField('消息')
  const dispatch = useDispatch()
  const [createGlobalNotification, ] = useCreateNotificationMutation()

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('submit')
    console.log(message.value)
    createGlobalNotification({ message: message.value })
      .unwrap()
      .then(() => {
        console.log('success')
        dispatch(createNotification(`发送消息成功`, 'success'))
        message.onReset()
      })
      .catch(() => {
        dispatch(createNotification('发送失败', 'error' ))
      })
  }

  return (
    <Paper elevation={4}>
      <Box p={1}>
        <h2>发送全局消息</h2>
        <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={handleSubmit}>
          <TextField {...message} />
          <Button variant='contained' color='primary' type='submit'>发送</Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default NotificationCreate