import { useSearchParams } from 'react-router-dom'
import { useGetArticlesQuery } from '../reducers/articlesApi'
import ArticleCard from './ArticleCard'
import { Stack, Pagination, Box, CircularProgress, Typography } from '@mui/material'

const articlePerPage = 7

const ArticleList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const ordering = searchParams.get('ordering') || ''
  const type = searchParams.get('type') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const keyword = searchParams.get('search') || ''
  let offset = (page - 1) * articlePerPage
  console.log('offset', offset)
  const {
    data,
    isFetching,
    isLoading,
    isError,
    error,
  } = useGetArticlesQuery({
    limit: articlePerPage,
    offset,
    ordering,
    type,
    keyword,
  })

  const handlePageChange = (event, value) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', value)
    setSearchParams(newParams)
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

  if (isLoading || isFetching) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
        <Typography variant="h6">加载文章中</Typography>
      </Box>
    )
  }
  const { articles, count } = data

  return (
    <div>
      {articles.map(article =>
        <ArticleCard key={article.id} article={article} />
      )}
      <Stack spacing={2}>
        <Pagination
          color='primary'
          count={(parseInt((count - 1) / articlePerPage) + 1) }
          page={page}
          onChange={handlePageChange}
        />
      </Stack>
    </div>
  )
}

export default ArticleList