import { Box, TextField } from '@mui/material'
import { useCreateRecruitmentMutation } from '../services/recruitmentsApi'
import RecruitmentForm from '../components/RecruitmentForm'
import { useDispatch } from 'react-redux'
import { createNotification } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'

const RecruitmentCreatePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [createRecruitment, ] = useCreateRecruitmentMutation()
  const handleSubmit = (
    newRecruitment
  ) => {
    createRecruitment(newRecruitment)
      .unwrap()
      .then(() => {
        dispatch(createNotification('创建招聘信息成功', 'success'))
        navigate('/recruitment')
      })
      .catch((error) => {
        switch (error.status) {
        case 401:
          dispatch(createNotification('请登录', 'error'))
          break
        case 403:
          dispatch(createNotification('无创建招聘信息权限', 'error'))
          break
        case 500:
          dispatch(createNotification('服务器错误', 'error'))
          break
        default:
          dispatch(createNotification('创建招聘信息失败', 'error'))
        }
      })
  }
  return (
    <RecruitmentForm handleSubmit={handleSubmit}/>
  )
}

export default RecruitmentCreatePage