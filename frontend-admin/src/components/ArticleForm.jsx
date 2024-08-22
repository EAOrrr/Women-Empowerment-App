import { Button, TextField, FormControlLabel, Checkbox } from '@mui/material'
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

  const title = useField('title', 'text')
  const content = useField('content', 'text')
  const tag = useField('tag', 'text')
  const author = useField('author', 'text')

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

  const handleDeleteTag = (event) => {
    const tag = event.target.textContent
    setTags(tags.filter(t => t !== tag))
  }

  const handelIsAnnouncement = (event) => {
    setIsAnnouncement(event.target.checked)
  }

  console.log('type:', type)
  console.log('isAnnouncement:', isAnnouncement)
  return (
    <form>
      <div>
        <div>
          文章类型
          <Selector
            id='article-form-selector'
            options={types}
            label='文章类型'
            value={type}
            handleChange={handleTypeChange}
          />
        </div>
        <div>
          标题
          <TextField {...title} id='article-form-title' required/></div>
        <div> 
          作者
          <TextField {...author} id='article-form-author' />
        </div>
        <div>
          内容
          <TextField
            {...content}
            id='article-form-content'
            multiline
            rows={12}
            required
          />
        </div>
        <div>
          <TextField {...tag} id='article-form-tag' />
          <Button variant='outlined' onClick={handleAddTag}>添加标签</Button>
        </div>
        <div>
          标签：{tags.map((tag, index) => (
            <Button key={index} endIcon={<ClearIcon />} onClick={handleDeleteTag}>{tag}</Button>
          ))}
        </div>
        <FormControlLabel control={<Checkbox checked={isAnnouncement} onChange={handelIsAnnouncement}/>} label="设为公告" />
      </div>
      <Button variant='contained' type='submit' onClick={handleSubmit}>创建新文章</Button>
    </form>
  )
}

export default ArticleForm