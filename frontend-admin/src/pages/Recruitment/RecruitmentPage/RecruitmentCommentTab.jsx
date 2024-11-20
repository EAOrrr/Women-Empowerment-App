import { useDispatch } from 'react-redux'

import { Box, Card, CardContent, Typography } from '@mui/material'
import { useCreateRecruitmentCommentMutation, useGetRecruitmentCommentsQuery } from '../../../services/recruitmentsApi'

import { createNotification } from '../../../reducers/notificationReducer'
import ExpandableTextField from '../../../components/ExpandableTextField'

const CommentCard = ({ comment }) => {
  return (
    <Card>
      <CardContent>
        <div> {comment.content} </div>
        <Typography align='right' variant='body2' color='textSecondary'> {(new Date(comment.createdAt)).toLocaleDateString()} </Typography>
      </CardContent>
    </Card>
  )
}

const CommentsTab = ({ recruitmentId }) => {
  const dispatch = useDispatch()
  const [createComment, ] = useCreateRecruitmentCommentMutation()
  const handleSubmit = (content) => {
    const comment = { content }
    createComment({
      id: recruitmentId,
      comment
    })
      .unwrap()
      .then(() => {
        dispatch(createNotification('评论成功', 'success'))
      })
      .catch((error) => {
        switch(error)
        {
        case 401:
          dispatch(createNotification('请登录', 'error'))
          break
        case 403:
          dispatch(createNotification('无评论权限', 'error'))
          break
        case 500:
          dispatch(createNotification('服务器错误', 'error'))
          break
        default:
          dispatch(createNotification('评论失败', 'error'))
        }
      })
  }
  const {
    data: comments,
    error,
    isLoading,
    isError,
    isFetching,
  }
  = useGetRecruitmentCommentsQuery(recruitmentId)
  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error</div>
  }
  const Comment = () => comments.length > 0
    ? (<div>
      {comments.map((comment, index) => (
        <Box key={index} mb={1}>
          <CommentCard comment={comment} />
        </Box>
      ))}
    </div>)
    : (<div>暂无评论</div>)
  return (
    <div>
      <Comment />
      <ExpandableTextField label={'评论'} handleSubmit={handleSubmit}/>
    </div>
  )
}

export default CommentsTab