import { useGetPostsQuery } from '../reducers/postsApi'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  CircularProgress,
  Typography ,
  Stack,
  Pagination
} from '@mui/material'
import PostCard from './PostCard'

const PostPerPage = 7

const PostList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || ''
  const ordering = searchParams.get('ordering') || 'created-at'
  const page= parseInt(searchParams.get('page')) || 1
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error
  } = useGetPostsQuery({
    status: status,
    ordering: ordering,
  })

  const handlePageChange = (event, value) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', value)
    setSearchParams(newParams)
  }

  if (isLoading || isFetching) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
        <Typography variant="h6">加载文章中</Typography>
      </Box>
    )
  }

  if (isError) {
    switch (error.status) {
    case 404:
      return <> 404 Not Found </>
    case 500:
      return <> 500 服务器错误 </>
    default:
      return <> 未知错误</>
    }
  }

  console.log(data)
  const { posts, count } = data

  return (
    <div>
      {posts.map(post => (
        <PostCard post={post} key={post.id} />
      )
      )}
      <Stack spacing={2}>
        <Pagination
          color='primary'
          count={(parseInt((count - 1) / PostPerPage) + 1) }
          page={page}
          onChange={handlePageChange}
        />
      </Stack>
    </div>
  )
}

export default PostList