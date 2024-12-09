import { useDispatch } from 'react-redux'
import { useNavigate, useBlocker } from 'react-router-dom'
import { useState, useEffect } from 'react'
import storage from '../../../services/storage'
import imagesService from '../../../services/images'
import { useCreateRecruitmentMutation } from '../../../services/recruitmentsApi'
import { createNotification } from '../../../reducers/notificationReducer'

import RecruitmentForm from '../utils/RecruitmentForm'

const RecruitmentCreatePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [createRecruitment] = useCreateRecruitmentMutation()
  const [pictures, setPictures] = useState([])
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const blocker = useBlocker(() => pictures.length > 0 && !submitting)

  useEffect(() => {
    if (blocker.state === 'blocked' && !confirming) {
      const leaveConfirm = window.confirm('您有未保存的更改，确定要离开吗？')
      if (leaveConfirm) {
        setConfirming(true)
        const tempImageIds = pictures
        imagesService.deleteBatch({ imageIds: tempImageIds })
          .then(() => {
            blocker.proceed()
            setConfirming(false)
          })
          .catch((error) => {
            console.error('删除图片失败', error)
            setConfirming(false)
          })
      } else {
        blocker.reset()
      }
    }
  }, [blocker, confirming, pictures])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (pictures.length > 0) {
        event.preventDefault()
        event.returnValue = '您有未保存的更改，确定要离开吗？'
      }
    }

    const handleUnload = () => {
      if (pictures.length > 0) {
        const tempImageIds = pictures
        const token = storage.getAccessToken()
        const payload = {
          imageIds: tempImageIds,
          token: token
        }
        navigator.sendBeacon('/api/images/beacondelete', JSON.stringify(payload))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
    }
  }, [pictures])

  const handleUploadPic = async (event) => {
    if (pictures.length >= 9) {
      dispatch(createNotification('最多上传9张图片', 'warning'))
      return
    }
    const files = Array.from(event.target.files).slice(0, 9 - pictures.length) // 确保总共不超过9张图片
    if (files.length === 0) {
      console.log('没有选择图片上传')
      return
    }

    console.log('开始上传图片')

    // 创建上传请求的数组
    const uploadPromises = files.map((file) => {
      const formData = new FormData()
      formData.append('image', file)
      return imagesService.create(formData)
    })

    try {
      const results = await Promise.allSettled(uploadPromises)

      let successCount = 0
      let failureCount = 0
      const successfulImageIds = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`图片上传成功: ${result.value.imageId}`)
          successCount++
          successfulImageIds.push(result.value.imageId)
        } else {
          console.error(`图片上传失败: ${files[index].name}`, result.reason)
          failureCount++
        }
      })

      if (successCount > 0) {
        setPictures((prevPictures) => [...prevPictures, ...successfulImageIds])
      }
      if (successCount > 0 && failureCount === 0) {
        dispatch(createNotification(`成功上传 ${successCount} 张图片`, 'success'))
      } else if (successCount > 0 && failureCount > 0) {
        dispatch(createNotification(`成功上传 ${successCount} 张图片，失败 ${failureCount} 张图片`, 'warning'))
      } else if (failureCount > 0) {
        dispatch(createNotification(`失败上传 ${failureCount} 张图片`, 'error'))
      }
    } catch (error) {
      console.error('上传图片失败', error)
      dispatch(createNotification('上传图片失败', 'error'))
    }
  }

  // const handleDeletePic = async (imageId) => {
  //   // ...existing logic from RecruitmentForm.jsx...
  // }

  const handleSubmit = (newRecruitment) => {
    setSubmitting(true)
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
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <RecruitmentForm
      handleSubmit={handleSubmit}
      pictures={pictures}
      setPictures={setPictures}
      handleUploadPic={handleUploadPic}
      // handleDeletePic={handleDeletePic}
    />
  )
}

export default RecruitmentCreatePage