import { useDispatch } from 'react-redux'
import ArticleForm from '../utils/ArticleForm'
import { useNavigate } from 'react-router-dom'
import { createNotification } from '../../../reducers/notificationReducer'
import { useCreateArticleMutation } from '../../../services/articlesApi'

const ArticlesCreatePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [createArticle] = useCreateArticleMutation()

  const handleSubmit = (newArticle) => {

    if (newArticle === 'none') {
      dispatch(createNotification(
        '请输入文章类型',
        'error'
      ))
    } else {
      createArticle(newArticle)
        .unwrap()
        .then((result) => {
          dispatch(createNotification(`创建文章${result.title}成功`, 'success'))
          navigate('/articles')
        }).catch((error) => {
          // console.error(error)
          switch (error.status) {
          case 401:
            dispatch(createNotification('请登录', 'error'))
            break
          case 403:
            dispatch(createNotification('无创建文章权限', 'error'))
            break
          case 500:
            dispatch(createNotification('服务器错误', 'error'))
            break
          default:
            dispatch(createNotification('创建文章失败', 'error'))
          }
        })
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