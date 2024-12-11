import { useNavigate, useParams } from 'react-router-dom'
import { useGetRecruitmentQuery } from '../../../services/recruitmentsApi'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useState } from 'react'
import  JobsTab  from './RecruitmentTab'
import EditRecruitmentTab from './RecruitmentEditTab'
import CommentsTab from './RecruitmentCommentTab'
import RecruitmentJobAddTab from './RecruitmentJobAddTab'
const validValues = ['jobs', 'comments', 'edit', 'add']

const RecruitmentPage = () => {
  // const [value, setValue] = useState('jobs')
  const value = useParams().value
  const recruitmentId = useParams().id
  const navigate = useNavigate()
  const handleChange = (event, newValue) => {
    // setValue(newValue)
    navigate(`/recruitment/${recruitmentId}/${newValue}`)
  }

  if (!validValues.includes(value)) {
    navigate(`/recruitment/${recruitmentId}/jobs`)
  }

  const {
    data: recruitment,
    error,
    isLoading,
    isError,
    isFetching,
  } = useGetRecruitmentQuery(recruitmentId)

  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error</div>
  }
  return (
    <div>
      <h1>{recruitment.name}</h1>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="secondary tabs example"
        >
          <Tab value="jobs" label="企业介绍" />
          <Tab value="comments" label="企业评论" />
          <Tab value="edit" label="编辑企业信息" />
          <Tab value='add' label='添加岗位' />
        </Tabs>

        {value === 'jobs' && (<JobsTab recruitment={recruitment} />)}
        {value === 'comments' && (<CommentsTab recruitmentId={recruitmentId} />)}
        {value === 'edit' && (<EditRecruitmentTab recruitment={recruitment} />)}
        {value === 'add' && (<RecruitmentJobAddTab recruitmentId={recruitmentId} />)}
      </Box>

    </div>
  )
}

export default RecruitmentPage