/**
 * @description: This file contains the articles reducer
 * which is responsible for handling the articles state in the redux store.
 * The articles reducer is responsible for handling the following actions:
 * 1. SET_ARTICLES: This action is dispatched when the articles are fetched from the server
 * and stored in the redux store.
 * 2. APPEND_ARTICLE: This action is dispatched when a new article is created and added to the redux store.
 * 3. UPDATE_ARTICLE: This action is dispatched when an article is updated in the redux store.
 * 4. DELETE_ARTICLE: This action is dispatched when an article is deleted from the redux store.
 * 5. CONCAT_ARTICLES: This action is dispatched when multiple articles are fetched from the server
 */

import { createSlice } from '@reduxjs/toolkit'

const articlesSlice = createSlice({
  name: 'articles',
  initialState: [],
  reducers: {
    setArticles(state, action) {
      return action.payload
    },
    appendArticle(state, action) {
      return state.concat(action.payload)
    },
    updateArticle(state, action) {
      const id = action.payload.id
      return state.map(article =>
        article.id === id
          ? action.payload
          : article
      )
    },
    deleteArticle(state, action) {
      return state.filter(article =>
        article.id !== action.payload.id
      )
    },
    concatArticles(state, action) {
      return state.concat(action.payload)
    }
  }
})

export const { setArticles, appendArticle, updateArticle, deleteArticle, concatArticles  } = articlesSlice.actions
export default articlesSlice.reducer