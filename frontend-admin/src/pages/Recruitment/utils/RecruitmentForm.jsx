import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useBlocker } from 'react-router-dom'

import { Box, Button, Grid, IconButton, TextField } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import VisuallyHiddenInput from '../../../components/VisuallyHiddenInput'

import { useField } from '../../../hooks'
import storage from '../../../services/storage'
import imagesService from '../../../services/images'
import { createNotification } from '../../../reducers/notificationReducer'

import Picture from '../../../components/Picture'

const RecruitmentForm = ({ handleSubmit , recruitment, handleUploadPic, pictures, setPictures }) => {
  const dispatch = useDispatch()
  const title = useField('标题', 'text', recruitment && recruitment.title)
  const name = useField('企业名称', 'text', recruitment && recruitment.name)
  const intro = useField('企业简介', 'text', recruitment && recruitment.intro)
  const province = useField('省份', 'text', recruitment && recruitment.province)
  const city = useField('城市', 'text', recruitment && recruitment.city)
  const district = useField('区县', 'text', recruitment && recruitment.district)
  const address = useField('企业地址', 'text', recruitment && recruitment.address)
  const street = useField('街道', 'text', recruitment && recruitment.street)
  const phone = useField('联系电话', 'text', recruitment && recruitment.phone)
  // const [pictures, setPictures] = useState((recruitment && recruitment.pictures) || [])

  // const [confirming, setConfirming] = useState(false)

  // const blocker = useBlocker(() => pictures.length > 0)
  // useEffect(() => {
  //   if (blocker.state === 'blocked' && !confirming) {
  //     const leaveConfirm = window.confirm('您有未保存的更改，确定要离开吗？')
  //     if (leaveConfirm) {
  //       setConfirming(true)  // 设置正在确认状态
  //       // const tempImageIds = editorRef.current.getTempImageIds() || []
  //       const tempImageIds = pictures
  //       imagesService.deleteBatch({ imageIds: tempImageIds })
  //         .then(() => {
  //           blocker.proceed()  // 确认后继续跳转
  //           setConfirming(false)  // 重置确认状态
  //         })
  //         .catch((error) => {
  //           console.error('删除图片失败', error)
  //           setConfirming(false)  // 如果删除失败，也要重置确认状态
  //         })
  //     } else {
  //       blocker.reset()  // 用户取消跳转，重置blocker状态
  //       console.log('reset')
  //     }
  //   }
  // }, [blocker, confirming, pictures])

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (pictures.length > 0) {
  //       event.preventDefault()
  //       event.returnValue = '您有未保存的更改，确定要离开吗？'
  //     }
  //   }

  //   const handleUnload = () => {
  //     if (pictures.length > 0) {
  //       console.log('hello')
  //       const tempImageIds = pictures
  //       console.log('unload')
  //       console.log(tempImageIds)

  //       const token = storage.getAccessToken()
  //       const payload = {
  //         imageIds: tempImageIds,
  //         token: token
  //       }
  //       navigator.sendBeacon('/api/images/beacondelete', JSON.stringify(payload))
  //     }
  //   }

  //   window.addEventListener('beforeunload', handleBeforeUnload)
  //   window.addEventListener('unload', handleUnload)

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload)
  //     window.removeEventListener('unload', handleUnload)
  //   }
  // }, [pictures])

  const handleDeletePic = async (imageId) => {
    try {
      await imagesService.remove(imageId)
      setPictures(pictures.filter((picture) => picture !== imageId))
      dispatch(createNotification('删除图片成功', 'success'))
    } catch (error) {
      // console.error(error)
      switch(error.status) {
      case 404:
        setPictures(pictures.filter(p => p === imageId))
      }
      dispatch(createNotification('删除图片失败', 'error'))
    }
  }


  // const handleUploadPic = async (event) => {
  //   if (pictures.length >= 9) {
  //     dispatch(createNotification('最多上传9张图片', 'warning'))
  //     return
  //   }
  //   const files = Array.from(event.target.files).slice(0, 9 - pictures.length) // 确保总共不超过9张图片
  //   if (files.length === 0) {
  //     console.log('没有选择图片上传')
  //     return
  //   }

  //   console.log('开始上传图片')

  //   // 创建上传请求的数组
  //   const uploadPromises = files.map((file) => {
  //     const formData = new FormData()
  //     formData.append('image', file)
  //     return imagesService.create(formData)
  //   })

  //   try {
  //     const results = await Promise.allSettled(uploadPromises)

  //     let successCount = 0
  //     let failureCount = 0
  //     const successfulImageIds = []

  //     results.forEach((result, index) => {
  //       if (result.status === 'fulfilled') {
  //         console.log(`图片上传成功: ${result.value.imageId}`)
  //         successCount++
  //         successfulImageIds.push(result.value.imageId)
  //       } else {
  //         console.error(`图片上传失败: ${files[index].name}`, result.reason)
  //         failureCount++
  //       }
  //     })

  //     if (successCount > 0) {
  //       setPictures((prevPictures) => [...prevPictures, ...successfulImageIds])
  //     }
  //     if (successCount > 0 && failureCount === 0) {
  //       dispatch(createNotification(`成功上传 ${successCount} 张图片`, 'success'))
  //     } else if (successCount > 0 && failureCount > 0) {
  //       dispatch(createNotification(`成功上传 ${successCount} 张图片，失败 ${failureCount} 张图片`, 'warning'))
  //     } else if (failureCount > 0) {
  //       dispatch(createNotification(`失败上传 ${failureCount} 张图片`, 'error'))
  //     }
  //   } catch (error) {
  //     console.error('上传图片失败', error)
  //     dispatch(createNotification('上传图片失败', 'error'))
  //   }
  // }

  const onSubmit = async (event) => {
    event.preventDefault()
    await handleSubmit({
      title: title.value,
      name: name.value,
      intro: intro.value,
      province: province.value,
      city: city.value,
      district: district.value,
      street: street.value,
      address: address.value,
      phone: phone.value,
      pictures: pictures
    })
  }

  return (
    <Box component='form' onSubmit={onSubmit} >
      <h1>企业信息注册</h1>
      <TextField {...name} fullWidth required/>
      <Grid container >
        <Grid item xs={3}>
          <TextField {...province} fullWidth required/>
        </Grid>
        <Grid item xs={3}>
          <TextField {...city} fullWidth required/>
        </Grid>
        <Grid item xs={3}>
          <TextField {...district} fullWidth required/>
        </Grid>
        <Grid item xs={3}>
          <TextField {...street} fullWidth required/>
        </Grid>
      </Grid>
      <TextField {...address} fullWidth required/>
      <TextField {...phone} fullWidth required/>
      <TextField {...title} fullWidth required/>
      <TextField {...intro} fullWidth multiline rows={8} required/>
      {pictures &&
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'flex-start'
          }}>
          {pictures.map((picture) => (
            <Picture imageId={picture} handleDelete={handleDeletePic} key={picture}/>
          ))}
        </Box>
      }
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ m: 1 }}
      >
      Upload files
        <VisuallyHiddenInput
          type="file"
          accept='image/*'
          multiple
          onChange={handleUploadPic}
        />
      </Button>
      <Button type='submit' variant='contained' color='primary' fullWidth>提交</Button>
    </Box>
  )
}

export default RecruitmentForm