/**
 * @description: This file contains the articles reducer
 * which is responsible for handling the articles state in the redux store.
 * The articles reducer is responsible for handling the following actions:
 * 1. updateArticle: Updates an article in the store.
 * 2. setArticle: Sets the articles in the store.
 * 3. truncateArticles: Truncates the articles in the store.
 * 4. clearArticles: Clears the articles in the store.
 */

import { createSlice } from '@reduxjs/toolkit'
import array from 'lodash/array'
import articleService from '../services/articles'

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    totalPages: 0
  },
  reducers: {
    updateArticle(state, action) {
      const { page, id } = action.payload
      state.articles[page] = state.articles[page].map(article => {
        article.id === id ? action.payload : article
      })
    },

    setArticles(state, action) {
      const { page, articles, totalPages } = action.payload
      console.log('in setArticles', articles, page)
      state.articles[page] = articles
      if (totalPages) state.totalPages = totalPages
    },

    truncateArticles(state, action) {
      const { page } = action.payload
      return array.take(state.articles, page)
    },

    clearArticles(state) {
      return []
    }
  }
})

export const fetchFirstPage = (limit, ordering, type) => {
  return async dispatch => {
    const query = `limit=${limit}&ordering=${ordering}&type=${type}&total=true`
    const response = await articleService.getAll(query)
    console.log('in fectch page', response.articles)
    dispatch(setArticles({
      page: 1,
      articles: response.articles,
      totalPages: parseInt((response.count + 1) / limit)
    }))
    console.log('dispatched')
  }
}

// export const { setArticles, appendArticle, updateArticle, deleteArticle, concatArticles  } = articlesSlice.actions
export const { updateArticle, setArticles, truncateArticles, clearArticles } = articlesSlice.actions
export default articlesSlice.reducer