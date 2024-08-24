import { Button, TextField, FormControlLabel, Checkbox, IconButton, Input, FormControl, Box, OutlinedInput, Grid, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useField } from '../hooks'
import Selector from './Selector'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createArticle } from '../reducers/articlesReducer'
import { Label } from '@mui/icons-material'

const types = [
  { label: '请选择', value: 'none' },
  { label: '法律条文', value: 'law' },
  { label: '政策文件', value: 'policy' },
  { label: '活动通知', value: 'activity' },
]

const ArticleForm = () => {
  const dispatch = useDispatch()

  const title = useField('标题', 'text')
  const content = useField('内容', 'text')
  const tag = useField('新标签', 'text')
  const author = useField('作者', 'text')

  const [tags, setTags] = useState([])
  const [type, setType] = useState('none')
  const [isAnnouncement, setIsAnnouncement] = useState(false)

  const handleTypeChange = (event) => {
    setType(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('type', type)
    console.log('title', title.value)
    console.log('content', content.value)
    if (type === 'none') {
      console.log('请选择文章类型')
    } else {
      console.log('创建新文章')
      dispatch(createArticle({
        title: title.value,
        content: content.value,
        type: type,
        tags: tags
      })
      )
    }
  }

  const handleAddTag = () => {
    if (tag.value) {
      setTags(tags.concat(tag.value))
      tag.onReset()
    }
  }

  const handleDeleteTag = (tag) => {
    return () => {
      setTags(tags.filter(t => t !== tag))
    }
  }

  const handelIsAnnouncement = (event) => {
    setIsAnnouncement(event.target.checked)
  }

  console.log('type:', type)
  console.log('isAnnouncement:', isAnnouncement)
  return (
    <Box component='form' sx={{}}>
      <div>
        <div>
          <Selector
            fullWidth={true}
            id='article-form-selector'
            options={types}
            label='文章类型'
            value={type}
            handleChange={handleTypeChange}
            defaultValue={types[0].value}
          />
        </div>
        <div>
          <TextField {...title} id='article-form-title' required fullWidth/>
        </div>
        <div>
          <TextField {...author} id='article-form-author' fullWidth/>
        </div>
        <div>
          <TextField
            {...content}
            id='article-form-content'
            multiline
            rows={11}
            required
            fullWidth
          />
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
      <div>
        <FormControlLabel control={<Checkbox checked={isAnnouncement} onChange={handelIsAnnouncement}/>} label="设为公告" />
      </div>
      <Button variant='contained' type='submit' onClick={handleSubmit} size='large'>创建新文章</Button>
    </Box>
  )
}

export default ArticleForm