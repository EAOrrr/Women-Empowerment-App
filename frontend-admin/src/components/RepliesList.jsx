import { useDispatch } from 'react-redux'
import { useGetPostCommentsQuery } from '../services/postsApi'
import Loading from './Loading'
import ReplyCard from './ReplyCard'
import { createNotification } from '../reducers/notificationReducer'
import { Box } from '@mui/material'

const RepliesList = ({ postId }) => {
  const dispatch = useDispatch()
  const {
    data: comments,
    isLoading,
    isFetching,
    isError,
    error
  } = useGetPostCommentsQuery(postId)

  if (isLoading || isFetching) {
    return <Loading message='留言回复加载中' />
  }

  if (isError) {
    dispatch(createNotification('获取留言回复失败', 'error'))
    return (
      <div>
        <h1>获取留言回复失败</h1>
      </div>
    )
  }

  return (
    <Box>
      {comments.map(comment => {
        return (
          <ReplyCard key={comment.id} reply={comment} />
        )
      })}
    </Box>
  )
}

export default RepliesList