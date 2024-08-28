import { useDispatch } from 'react-redux'
import { useUpdateRecruitmentMutation } from '../services/recruitmentsApi'
import RecruitmentForm from './RecruitmentForm'
import { createNotification } from '../reducers/notificationReducer'

const EditRecruitmentTab = ({ recruitment }) => {
  const dispatch = useDispatch()
  const [updateRecruitment, ] = useUpdateRecruitmentMutation()
  const handleSubmit = (newRecruitment) => {
    updateRecruitment(
      {...newRecruitment,
        id: recruitment.id
      })
      .unwrap()
      .then(() => {
        dispatch(createNotification('更新招聘信息成功', 'success'))
      })
      .catch((error) => {
        switch (error.status) {
        case 401:
          dispatch(createNotification('请登录', 'error'))
          break
        case 403:
          dispatch(createNotification('无更新招聘信息权限', 'error'))
          break
        case 500:
          dispatch(createNotification('服务器错误', 'error'))
          break
        default:
          dispatch(createNotification('更新招聘信息失败', 'error'))
        }
      })
  }
  return (
    <div>
      <RecruitmentForm recruitment={recruitment} handleSubmit={handleSubmit}/>
    </div>
  )
}

export default EditRecruitmentTab