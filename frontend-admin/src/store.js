import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import articlesReducer from './reducers/articlesReducer'
import notificationsReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    articles: articlesReducer,
    notification: notificationsReducer,
  }
})

export default store