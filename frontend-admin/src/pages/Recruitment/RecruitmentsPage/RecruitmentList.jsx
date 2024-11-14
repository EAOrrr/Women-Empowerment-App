import { useSearchParams } from 'react-router-dom'
import { useGetRecruitmentsQuery } from '../../../services/recruitmentsApi'
import Loading from '../../../components/Loading'
import RecruitmentCard from './RecruitmentCard'
import {
  Stack,
  Pagination
} from '@mui/material'

const recruitmentPerPage = 7
const RecruitmentList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const ordering = searchParams.get('ordering') || ''
  const page = parseInt(searchParams.get('page')) || 1
  let offset = (page - 1) * recruitmentPerPage
  const keyword = searchParams.get('search') || ''
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error
  } = useGetRecruitmentsQuery({
    keyword,
    limit: recruitmentPerPage,
    offset,
    ordering
  })

  const handlePageChange = (event, value) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', value)
    setSearchParams(newParams)
  }

  if (isLoading || isFetching) {
    return <Loading message={'加载招聘信息中'} />
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

  const { recruitments, count } = data
  if (recruitments.length === 0) {
    return <div>暂无招聘信息</div>
  }

  return (
    <div>
      {recruitments.map((recruitment) =>
        <RecruitmentCard key={recruitment.id} recruitment={recruitment} />)}
      <Stack spacing={2}>
        <Pagination
          color='primary'
          count={(parseInt((count - 1) / recruitmentPerPage) + 1) }
          page={page}
          onChange={handlePageChange}
        />
      </Stack>
    </div>
  )
}

export default RecruitmentList