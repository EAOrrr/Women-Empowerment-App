import { useDispatch } from 'react-redux'
import ArticleForm from '../components/ArticleForm'
import { createArticle } from '../reducers/articlesReducer'
import { useNavigate } from 'react-router-dom'
import { createNotification } from '../reducers/notificationReducer'

const ArticlesCreatePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (newArticle) => {
    return (event) => {
      event.preventDefault()
      if (newArticle === 'none') {
        console.log('请选择文章类型')
        dispatch(createNotification(
          '请输入文章类型',
          'error'
        ))
      } else {
        console.log('创建新文章')
        dispatch(createArticle(newArticle)
        )
        navigate('/articles')
      }
    }
  }
  return (
    <div>
      <h1>创建新文章</h1>
      <ArticleForm handleSubmit={handleSubmit} buttonLable={'创建新文章'}/>
    </div>
  )
}

export default ArticlesCreatePage