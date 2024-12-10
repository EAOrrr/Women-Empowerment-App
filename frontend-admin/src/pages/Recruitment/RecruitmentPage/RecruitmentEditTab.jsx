import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

import { useUpdateRecruitmentMutation } from '../../../services/recruitmentsApi'
import { createNotification } from '../../../reducers/notificationReducer'
import imagesService from '../../../services/images'

import RecruitmentForm from '../utils/RecruitmentForm'
import { useBlocker } from 'react-router-dom'
import storage from '../../../services/storage'

const EditRecruitmentTab = ({ recruitment }) => {
  const dispatch = useDispatch()
  const [updateRecruitment, ] = useUpdateRecruitmentMutation()
  const [pictures, setPictures] = useState((recruitment && recruitment.pictures) || [])
  const [tempPictures, setTempPictures] = useState([])
  // const [confirming, setConfirming] = useState(false)
  const blocker = useBlocker(() => tempPictures.length > 0)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      imagesService.deleteBatch({ imageIds: tempPictures })
        .then(() => {
          blocker.proceed()
        })
        .catch((error) => {
          console.error('删除图片失败', error)
        })
    }
  }, [blocker, tempPictures])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (tempPictures.length > 0) {
        event.preventDefault()
        event.returnValue = '您有未保存的更改，确定要离开吗？'
        const token = storage.getAccessToken()
        // navigator.sendBeacon('/api/images/beacondelete', JSON.stringify({ imageIds: tempPictures,  token: token }))
        imagesService.deleteBatch({ imageIds: tempPictures })
          .then(() => {
            console.log('删除图片成功')
          })
          .catch((error) => {
            console.error('删除图片失败', error)
          })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [tempPictures])

  const handleSubmit = (newRecruitment) => {
    updateRecruitment(
      { ...newRecruitment,
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
    const uploadPromises = files.map(file => {

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
        const updatedPictures = [...pictures, ...successfulImageIds]
        setPictures(updatedPictures)
        setTempPictures([...tempPictures, ...successfulImageIds])

        // await updateRecruitment({
        //   id: recruitment.id,
        //   pictures: updatedPictures
        // })
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

  const handleDeletePic = async (imageId) => {
    const updatedPictures = pictures.filter((id) => id !== imageId)
    setPictures(updatedPictures)
  }
  return (
    <div>
      <RecruitmentForm
        recruitment={recruitment}
        handleSubmit={handleSubmit}
        pictures={pictures}
        setPictures={setPictures}
        handleUploadPic={handleUploadPic}
        handleDeletePic={handleDeletePic}
      />
    </div>
  )
}

export default EditRecruitmentTab