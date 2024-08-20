import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import articlesReducer from './reducers/articlesReducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    articles: articlesReducer
  }
})

export default store