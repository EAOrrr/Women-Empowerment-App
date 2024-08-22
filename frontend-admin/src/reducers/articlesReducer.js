/**
 * @description: This file contains the articles reducer
 * which is responsible for handling the articles state in the redux store.
 * version: 1.0
 * TODO: 预计网站初建立时数据库较小，直接抓取所有文章数据，
 * 数据在前端进行处理
 * 后续会分页抓取重新设计数据结构，用稀疏数组储存分页
 *
 * The articles reducer is responsible for handling the following actions:
 * 1. setArticles: This action is dispatched when the articles are fetched from the server
 * and stored in the redux store.
 * 2. updateArticle: This action is dispatched when an article is updated.
 * 3. deleteArticle: This action is dispatched when an article is deleted.
 * 4. clearArticles: This action is dispatched when all articles are removed from the redux store.
 * 5. appendArticle: This action is dispatched when a new article is created.
 */

import { createSlice } from '@reduxjs/toolkit'
// import array from 'lodash/array'
import articleService from '../services/articles'

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    datas: [],
    count: 0
  },
  reducers: {
    setArticles(state, action) {
      state.datas = action.payload.data
      state.count = action.payload.count
    },
    updateArticle(state, action) {
      const updatedArticle = action.payload
      state.datas = state.datas.map(article => article.id === updatedArticle.id ? updatedArticle : article)
    },
    deleteArticle(state, action) {
      const id = action.payload
      state.datas = state.datas.filter(article => article.id !== id)
    },
    clearArticles(state) {
      return []
    },
    appendArticle(state, action) {
      const newArticle = action.payload
      state.datas.push(newArticle)
    }
  }
})

export const initializeArticles = () => {
  return async dispatch => {
    console.log('Fetching articles')
    const response = await articleService.getAll('total=true')
    dispatch(setArticles({
      data: response.articles,
      count: response.count
    }))
  }
}

export const createArticle = (newArticle) => {
  return async dispatch => {
    const article = await articleService.create(newArticle)
    console.log(article)
    dispatch(appendArticle(article))
  }
}

export const { setArticles, updateArticle, deleteArticle, clearArticles, appendArticle } = articlesSlice.actions
export default articlesSlice.reducer