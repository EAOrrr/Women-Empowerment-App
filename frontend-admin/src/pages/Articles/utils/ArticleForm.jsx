import { useRef, useState } from 'react'
import { Button, TextField, FormControlLabel, Checkbox, IconButton, Input, FormControl, Box, OutlinedInput, Grid, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

import { useField } from '../../../hooks'
import Selector from '../../../components/Selector'
import Editor from './Editor'


const types = [
  { label: '请选择', value: 'none' },
  { label: '法律条文', value: 'law' },
  { label: '政策文件', value: 'policy' },
  { label: '活动通知', value: 'activity' },
  { label: '工作报告', value: 'report' },
  { label: '津贴领取', value: 'guide' },
]

const ArticleForm = ({ handleSubmit, article, buttonLable }) => {
  // console.log(handleSubmit)
  const editorRef = useRef(null)

  const title = useField('标题', 'text', (article && article.title))
  // const content = useField('内容', 'text', (article && article.content))
  const abstract = useField('摘要', 'text', (article && article.abstract))
  const tag = useField('新标签', 'text')
  const author = useField('作者', 'text', (article && article.author))
  const [tags, setTags] = useState((article && article.tags) || [])
  const [type, setType] = useState((article && article.type) || 'none')
  const [isAnnouncement, setIsAnnouncement] = useState((article && article.isAnnouncement) ||false)

  const handleTypeChange = (event) => {
    setType(event.target.value)
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

  const onSubmit = async (event) => {
    event.preventDefault()
    console.log('onSubmit')
    if (editorRef.current) {
      console.log('onSubmit开始')
      const content = editorRef.current.getContent()
      await editorRef.current.cleanUpTempImages()
      console.log('onSubmit结束')

      handleSubmit({
        title: title.value,
        abstract: abstract.value,
        content,
        author: author.value,
        type,
        tags,
        isAnnouncement,
      })
    }
  }

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
          <Editor content={article?.content || ''} ref={editorRef} />
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