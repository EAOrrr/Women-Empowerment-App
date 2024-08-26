import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
// import articlesReducer from './reducers/articlesReducer'
import notificationsReducer from './reducers/notificationReducer'
import { articlesApi } from './reducers/articlesApi'
import { setupListeners } from '@reduxjs/toolkit/query'

const store = configureStore({
  reducer: {
    user: userReducer,
    // articles: articlesReducer,
    notification: notificationsReducer,
    [ articlesApi.reducerPath]: articlesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(articlesApi.middleware),
})

setupListeners(store.dispatch)
export default store