import { Box, Button, TextField } from '@mui/material'
import { useField } from '../hooks'
import { useCreatePostMutation } from '../services/postsApi'
import { useDispatch } from 'react-redux'
import { createNotification } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'
const PostCreatePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const title = useField('标题', 'text')
  const content = useField('内容', 'text')
  const [createPost, ] = useCreatePostMutation()

  const handleSubmit = (e) => {
    e.preventDefault()
    createPost({
      title: title.value,
      content: content.value
    })
      .unwrap()
      .then(() => {
        title.onReset()
        content.onReset()
        dispatch(createNotification('创建新留言成功', 'success'))
        navigate('/posts')
      })
      .catch((error) => {
        dispatch(createNotification('创建新留言失败', 'error'))
      })
  }

  return (
    <div>
      <h2> 创建新留言 </h2>
      <Box component='form'
        onSubmit={handleSubmit}>
        <TextField
          {...title}
          id='post-form-title'
          required
          fullWidth />
        <TextField
          {...content}
          id='post-form-content'
          required
          fullWidth
          multiline
          rows={10} />
        <Button
          type='submit'
          variant='contained'
          color='primary'>
            创建新留言
        </Button>
      </Box>
    </div>
  )

}

export default PostCreatePage