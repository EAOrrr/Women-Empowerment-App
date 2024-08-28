import { useState } from "react";
import { useGetNotificationsQuery } from "../services/messagesApi";
import Loading from "./Loading";
import Selector from "./Selector";
import NotificationCard from "./NotificationCard";

const ReadOrNot = [
  { value: 'all', label: '全部' },
  { value: 'read', label: '已读' },
  { value: 'unread', label: '未读' },
]

const types = [
  { value: 'all', label: '全部' },
  { value: 'global', label: '全局消息' },
  { value: 'post_createed', label: '新建留言通知' },
  { value: 'comment_reply', label: '留言回复通知' },
]

const filterRead = (notifications, read) => {
  if (read === 'all') return notifications.slice()
  return notifications.filter(notification => notification.read === (read === 'read'))
}

const filterType = (notifications, type) => {
  if (type === 'all') return notifications.slice()
  return notifications.filter(notification => notification.type === type)
}

const NotificationList = () => {
  const {
    data: notifications,
    error,
    isLoading,
    isError,
    isFetching,
  } = useGetNotificationsQuery()
  const [read, setRead] = useState('all')
  const [type, setType] = useState('all')

  const handleReadChange = (event) => {
    setRead(event.target.value)
  }

  const handleTypeChange = (event) => {
    setType(event.target.value)
  }
  
  if (isLoading || isFetching) 
    return <Loading message='消息列表加载中' />

  if (isError) {
    return (
      <div>
        <h2>加载消息列表失败</h2>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div>
        <h2>无消息</h2>
      </div>
    )
  }

  const processedNotifications = filterType(filterRead(notifications, read), type)
  return (
    <div>
      <div>
        <Selector 
          label='已读/未读'
          options={ReadOrNot}
          value={read}
          handleChange={handleReadChange}
          defaultValue={ReadOrNot[0].value}
          sx={{ width: '150px', margin: '10px' }}
        />
        <Selector 
          label='消息类型'
          options={types}
          value={type}
          handleChange={handleTypeChange}
          defaultValue={types[0].value}
          sx={{ width: '150px', margin: '10px' }}
        />
      </div>
      {processedNotifications.map(notification => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

export default NotificationList;