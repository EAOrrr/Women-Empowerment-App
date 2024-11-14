import { useSearchParams } from 'react-router-dom'

import SearchBar from '../../../components/SearchBar'
import Selector from '../../../components/Selector'
import PostsList from './PostsList'

const statuses = [
  { label: '全部', value: '' },
  { label: '进行中', value: 'in-progress' },
  { label: '已结束', value: 'done' },
  { label: '已回答', value: 'answered' },
]

const orderings = [
  { label: '最新发布', value: 'created-at' },
  { label: '最新回复', value: 'updated-at' },
  { label: '最多喜爱', value: 'likes' },
  { label: '最多评论', value: 'comments' },
]

const PostsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const status = searchParams.get('status') || ''
  const ordering = searchParams.get('ordering') || 'created-at'

  const handleStatusChange = (event) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('status', event.target.value)
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handleOrderingChange = (event) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('ordering', event.target.value)
    newParams.set('page', '1')
    setSearchParams(newParams)
  }


  return (
    <div>
      <h1>留言板</h1>
      <SearchBar />
      <div>
       
        <Selector
          label="排序方式"
          value={ordering}
          options={orderings}
          defaultValue={orderings[0].value}
          handleChange={handleOrderingChange}
          sx={{ width: '150px', margin: '10px' }}
        />
        <Selector
          label="状态"
          value={status}
          options={statuses}
          defaultValue={statuses[0].value}
          handleChange={handleStatusChange}
          sx={{ width: '150px', margin: '10px' }}
        />
      </div>


      <PostsList />
    </div>
  )
}

export default PostsPage