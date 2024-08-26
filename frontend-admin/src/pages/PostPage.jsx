import { useParams } from "react-router-dom";
import { useGetPostQuery } from "../reducers/postsApi";
import { Box, CircularProgress, Typography } from "@mui/material";

const PostPage = () => {
  const postId = useParams().id
  const {
    data: post,
    isLoading,
    isFetching,
    isError,
    error
  } = useGetPostQuery(postId)

  if (isLoading || isFetching) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
        <Typography variant="h6">获取文章中</Typography>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box>
        <Typography variant="h6">获取文章失败</Typography>
        <Typography variant="body1">{error.message}</Typography>
      </Box>
    )
  }
  console.log('post', post)

  return (
    <div>
      <h1>留言回复</h1>

    </div>
  )
}

export default PostPage;