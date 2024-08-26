import { useSearchParams } from 'react-router-dom'
import { useGetArticlesQuery } from '../services/articlesApi'
import ArticleCard from './ArticleCard'
import { Stack, Pagination } from '@mui/material'

const articlePerPage = 7

const TestList = () => {
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
    return <> error.data </>
  }
  if (isLoading || isFetching) {
    return <> loading </>
  }
  console.log(data)
  const { articles, count } = data
  console.log(articles)
  console.log(count)
  return (
    <div>
      <h2>Articles List</h2>
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

export default TestList