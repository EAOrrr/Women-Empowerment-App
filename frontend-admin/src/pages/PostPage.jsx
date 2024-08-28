import { useLocation, useParams } from 'react-router-dom'
import { useCreatePostCommentMutation, useGetPostQuery } from '../services/postsApi'
import { Avatar, Box, Card, CardContent, CardHeader, CircularProgress, Paper, Typography } from '@mui/material'
import Loading from '../components/Loading'
import { red } from '@mui/material/colors'
import RepliesList from '../components/RepliesList'
import ExpandableTextField from '../components/ExpandableTextField'
import { useDispatch } from 'react-redux'
import { createNotification } from '../reducers/notificationReducer'
import { useEffect } from 'react'

const PostPage = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const postId = useParams().id
  const {
    data: post,
    isLoading,
    isFetching,
    isError,
    error
  } = useGetPostQuery(postId)

  const commentId = location.state?.commentId

  const [createComment, ] = useCreatePostCommentMutation()

  const handleSubmit = (value) => {
    createComment({ postId, content: value })
      .unwrap()
      .then(() => {
        dispatch(createNotification('留言成功', 'success'))
      })
      .catch(error => {
        dispatch(createNotification('留言失败', 'error'))
        console.error(error)
      })
  }

  useEffect(() => {
    if (commentId) {
      const element = document.getElementById(`comment-${commentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [commentId]);

  if (isLoading || isFetching) {
    return <Loading message='留言加载中' />
  }

  if (isError) {
    return (
      <Box>
        <Typography variant="h6">获取文章失败</Typography>
        <Typography variant="body1">{error.message}</Typography>
      </Box>
    )
  }
  const username = post.poster.username

  return (
    <div>
      {/* <Typography variant="h4">留言回复</Typography> */}
      <Box sx={{ maxHeight: '620px', overflow: 'auto'  ,
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // Chrome, Safari, Opera
        } }
      }>
      <h1>留言回复</h1>
        <Paper elevation={2} sx={{ mb: 1 }}>
          <CardContent>
            <Box sx={{ mt:1, ml:1, display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent: 'flex-start' }}>
              <Avatar sx={{ width: 24, height: 24 }} aria-label="recipe">
                {username[0]}
              </Avatar>
              <Typography variant="body2" sx={{ ml: 1 }}>{username}</Typography>
            </Box>
            <Box sx={{ p: 1 }} >
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body1">{post.content}</Typography>
              <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }} variant="caption">{new Date(post.createdAt).toLocaleString()}</Typography>
              <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }} variant="caption">{new Date(post.createdAt).toLocaleString()}</Typography>
            </Box>
          </CardContent>
        </Paper>
        {/* {post.comments.map} */}
        <RepliesList postId={postId}/>
      </Box>
      <ExpandableTextField label='内容' handleSubmit={handleSubmit}/>

    </div>
  )
}

export default PostPage