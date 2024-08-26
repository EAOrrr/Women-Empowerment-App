import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
// import articlesReducer from './reducers/articlesReducer'
import notificationsReducer from './reducers/notificationReducer'
import { articlesApi } from './reducers/articlesApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import { postsApi } from './reducers/postsApi'

const store = configureStore({
  reducer: {
    user: userReducer,
    // articles: articlesReducer,
    notification: notificationsReducer,
    [ articlesApi.reducerPath]: articlesApi.reducer,
    [ postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(articlesApi.middleware)
      .concat(postsApi.middleware),
})

setupListeners(store.dispatch)
export default store