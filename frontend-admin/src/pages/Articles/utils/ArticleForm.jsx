import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, TextField, FormControlLabel, Checkbox, Box,  Grid, Typography, IconButton } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ClearIcon from '@mui/icons-material/Clear'
import CloseIcon from '@mui/icons-material/Close'

import { styled } from '@mui/material/styles'

import { useField } from '../../../hooks'
import Selector from '../../../components/Selector'
import Editor from '../../../components/Editor'
import imagesService from '../../../services/images'
import { createNotification } from '../../../reducers/notificationReducer'
import { useBlocker } from 'react-router-dom'
import storage from '../../../services/storage'


const types = [
  { label: '请选择', value: 'none' },
  { label: '法律条文', value: 'law' },
  { label: '政策文件', value: 'policy' },
  { label: '活动通知', value: 'activity' },
  { label: '工作报告', value: 'report' },
  { label: '津贴领取', value: 'guide' },
]

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const ArticleForm = ({ handleSubmit, article, buttonLable, allowEditCover=true, afterSubmit=() => {} }) => {
  const dispatch = useDispatch()
  const editorRef = useRef(null)

  const title = useField('标题', 'text', (article && article.title), () => setChange(true))
  const abstract = useField('摘要', 'text', (article && article.abstract), () => setChange(true))
  const tag = useField('新标签', 'text')
  const author = useField('作者', 'text', (article && article.author), () => setChange(true))
  const [tags, setTags] = useState((article && article.tags) || [])
  const [type, setType] = useState((article && article.type) || 'none')
  const [isAnnouncement, setIsAnnouncement] = useState((article && article.isAnnouncement) ||false)
  const [cover, setCover] = useState((article && article.cover) || '')

  const [confirming, setConfirming] = useState(false)
  const [change, setChange] = useState(false)
  const blocker = useBlocker(() => change)

  useEffect(() => {
    if (blocker.state === 'blocked' && !confirming) {
      const leaveConfirm = window.confirm('您有未保存的更改，确定要离开吗？')
      if (leaveConfirm) {
        setConfirming(true)  // 设置正在确认状态
        // const tempImageIds = editorRef.current.getTempImageIds() || []
        const tempImageIds = [...(editorRef.current.getTempImageIds() || []), ...(cover ? [cover] : [])]
        imagesService.deleteBatch({ imageIds: tempImageIds })
          .then(() => {
            blocker.proceed()  // 确认后继续跳转
            setConfirming(false)  // 重置确认状态
          })
          .catch((error) => {
            console.error('删除图片失败', error)
            setConfirming(false)  // 如果删除失败，也要重置确认状态
          })
      } else {
        blocker.reset()  // 用户取消跳转，重置blocker状态
        console.log('reset')
      }
    }
  }, [blocker, confirming, cover])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (change) {
        event.preventDefault()
        event.returnValue = '您有未保存的更改，确定要离开吗？'
      }
    }

    const handleUnload = () => {
      if (change) {
        console.log('hello')
        const tempImageIds = [...(editorRef.current.getTempImageIds() || []), ...(cover ? [cover] : [])]
        console.log('unload')
        console.log(tempImageIds)

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
  }, [change, cover])


  const handleTypeChange = (event) => {
    setType(event.target.value)
    setChange(true)
  }

  const handleAddTag = () => {
    if (tag.value) {
      setTags(tags.concat(tag.value))
      tag.onReset()
      setChange(true)
    }
  }

  const handleDeleteTag = (tag) => {
    return () => {
      setTags(tags.filter(t => t !== tag))
      setChange(true)
    }
  }

  const handelIsAnnouncement = (event) => {
    setIsAnnouncement(event.target.checked)
    setChange(true)
  }

  const handleUploadCover = async (event) => {
    console.log(event.target.files)
    try {
      const formData = new FormData()
      formData.append('image', event.target.files[0])
      const data = await imagesService.create(formData)
      setCover(data.imageId)
      setChange(true)
      dispatch(createNotification('上传封面成功', 'success'))
    } catch (error) {
      console.log(error)
      dispatch(createNotification('上传封面失败', 'error'))
    }

  }

  const handleDeleteCover = async () => {
    try {
      await imagesService.remove(cover)
      setCover('')
      setChange(true)
      dispatch(createNotification('删除封面成功', 'success'))
    } catch (error) {
      console.log(error)
      dispatch(createNotification('删除封面失败', 'error'))
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    console.log('onSubmit')
    try {
      if (editorRef.current) {
        console.log('onSubmit开始')
        const content = editorRef.current.getContent()
        const images = editorRef.current.getImages()
        console.log('onSubmit结束')
        setChange(false)
        await handleSubmit({
          title: title.value,
          abstract: abstract.value,
          content,
          author: author.value,
          type,
          tags,
          isAnnouncement,
          images,
          cover,
        })
        await editorRef.current.cleanUpTempImages()
        afterSubmit()
      }
    } catch (error) {
      dispatch(createNotification('提交失败', 'error'))
    }
  }

  const handleContentChange = () => {
    setChange(true)
  }

  // window.addEventListener('beforeunload', (event) => {
  //   if (change) {
  //     event.preventDefault()
  //     event.returnValue = '您有未保存的更改，确定要离开吗？'
  //   }
  // })

  console.log(cover)

  return (
    <Box component='form'
      onSubmit={onSubmit}>
      <div>
        <div>
          <Selector
            fullWidth={true}
            id='article-form-selector'
            options={types}
            label='文章类型'
            value={type}
            handleChange={handleTypeChange}
            defaultValue={(article && article.type ) || types[0].value}
          />
        </div>
        <div>
          <TextField
            {...title}
            id='article-form-title'
            required
            fullWidth/>
        </div>
        <div>
          <TextField
            {...author}
            id='article-form-author'
            fullWidth
          />
        </div>
        <div>
          <TextField
            {...abstract}
            id='article-form-abstract'
            fullWidth
            inputProps={{ maxLength: 50 }}
          />
        </div>
        <div>
          {/* <TextField
            {...content}
            id='article-form-content'
            multiline
            rows={11}
            required
            fullWidth
          /> */}
          <Editor content={article?.content || ''} onContentChange={handleContentChange} ref={editorRef} />
        </div>
        <div>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={9}>
              <TextField {...tag} id="article-form-tag" fullWidth />
            </Grid>
            <Grid item xs={3}>
              <Button variant="outlined" onClick={handleAddTag} fullWidth size='large'>
          添加标签
              </Button>
            </Grid>
          </Grid>
        </div>
        <Typography variant='body1'>标签:</Typography>
        {tags.map((tag, index) => (
          <Button
            key={index}
            endIcon={<ClearIcon />}
            onClick={handleDeleteTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
      <div> 封面：
        {allowEditCover && (cover
          ? (<Box  sx={{
            width: 300, // 设置图片容器的宽度
            height: 200, // 设置图片容器的高度
            overflow: 'hidden', // 隐藏超出的部分
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
            <img
              src={`/api/images/${cover}`}
              alt='cover'
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'cover', // 适应容器，保持裁剪比例
              }} />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8, // 距离顶部 8px
                right: 8, // 距离右侧 8px
                color: 'primary', // 设置图标颜色为白色（可以根据需要调整）
                backgroundColor: 'rgba(0, 0, 0, 0)', // 半透明的背景色，增强对比度
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.3)', // 鼠标悬停时，背景色变得更加明显
                },
              }}
              onClick={handleDeleteCover} // 点击时触发删除封面的函数}
            >
              <CloseIcon /> {/* X 图标 */}
            </IconButton>
          </Box>)
          : (
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />} >
            Upload files
              <VisuallyHiddenInput
                type="file"
                accept='image/*'
                onChange={handleUploadCover}
              />
            </Button>
          )
        )
        }
        {!allowEditCover && <Box  sx={{
          width: 300, // 设置图片容器的宽度
          height: 200, // 设置图片容器的高度
          overflow: 'hidden', // 隐藏超出的部分
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
          <img
            src={`/api/images/${cover}`}
            alt='cover'
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'cover', // 适应容器，保持裁剪比例
            }} />
        </Box>}
      </div>
      <div>
        <FormControlLabel control={<Checkbox checked={isAnnouncement} onChange={handelIsAnnouncement}/>} label="设为公告" />
      </div>
      <Button
        variant='contained'
        type='submit'
        size='large'>
        {buttonLable}
      </Button>
    </Box>
  )
}

export default ArticleForm