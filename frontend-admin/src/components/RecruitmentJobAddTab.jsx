import { useDispatch } from "react-redux"
import { createNotification } from "../reducers/notificationReducer"
import JobForm from './JobForm'
import { useCreateRecruitmentJobMutation } from "../services/recruitmentsApi"
import { Card } from "@mui/material"

const RecruitmentJobAddTab = ({ recruitmentId }) => {
  const dispatch = useDispatch()
  const [createJob, ] = useCreateRecruitmentJobMutation()
  const handleSubmit = (job) => {
    createJob({
      id: recruitmentId,
      job
  })
      .unwrap()
      .then(() => {
        console.log('job success')
        dispatch(createNotification('职位添加成功', 'success'))
      })
      .catch((error) => {
        switch(error)
        {
        case 401:
          dispatch(createNotification('请登录', 'error'))
          break
        case 403:
          dispatch(createNotification('无添加职位权限', 'error'))
          break
        case 500:
          dispatch(createNotification('服务器错误', 'error'))
          break
        default:
          dispatch(createNotification('添加职位失败', 'error'))
        }
      })
  }
  return (
      <JobForm handleSubmit={handleSubmit} />
  )
}

export default RecruitmentJobAddTab