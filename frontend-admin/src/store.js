import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
// import articlesReducer from './reducers/articlesReducer'
import notificationsReducer from './reducers/notificationReducer'
import { articlesApi } from './services/articlesApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import { postsApi } from './services/postsApi'
import { notificationsApi } from './services/messagesApi'
import { recruitmentsApi } from './services/recruitmentsApi'

const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationsReducer,
    [ articlesApi.reducerPath]: articlesApi.reducer,
    [ postsApi.reducerPath]: postsApi.reducer,
    [ notificationsApi.reducerPath]: notificationsApi.reducer,
    [ recruitmentsApi.reducerPath]: recruitmentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(articlesApi.middleware)
      .concat(postsApi.middleware)
      .concat(notificationsApi.middleware)
      .concat(recruitmentsApi.middleware),
})

setupListeners(store.dispatch)
export default store