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
import { createNotification } from './notificationReducer'

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
    console.log('Fetched articles')
    console.log(response.articles)
    console.log(response.count)
  }
}

export const createArticle = (newArticle) => {
  return async dispatch => {
    try {
      const article = await articleService.create(newArticle)
      console.log(article)
      dispatch(appendArticle(article))
      dispatch(createNotification(`创建文章${article.title}成功`, 'success'))
    } catch (error) {
      console.error(error)
      dispatch(createNotification('创建文章失败', 'error'))
    }
  }
}

export const updateAndPutArticle = (id, updatedArticle) => {
  return async dispatch => {
    try {
      // console.log('in updatedAndPut', id, updatedArticle)
      const updated = await articleService.update(id, updatedArticle)
      dispatch(updateArticle(updated))
      dispatch(createNotification(`更新文章${updated.title}成功`, 'success'))
    } catch (error) {
      // console.error(error)
      switch (error.response.status) {
      case 401:
        dispatch(createNotification('请登录', 'error'))
        break
      case 403:
        dispatch(createNotification('无修改该数据权限', 'error'))
        break
      case 404:
        dispatch(createNotification('文章不存在', 'error'))
        break
      case 500:
        dispatch(createNotification('服务器错误', 'error'))
        break
      default:
        dispatch(createNotification('更新文章失败', 'error'))
        console.error(error.response.data)
      }
    }
  }
}

export const deleteArticleById = (id) => {
  return async dispatch => {
    try {
      await articleService.remove(id)
      dispatch(deleteArticle(id))
      dispatch(createNotification('删除文章成功', 'success'))
    } catch (error) {
      switch (error.response.status) {
      case 401:
        dispatch(createNotification('请登录', 'error'))
        break
      case 403:
        dispatch(createNotification('无删除该数据权限', 'error'))
        break
      case 404:
        dispatch(createNotification('文章不存在', 'error'))
        break
      case 500:
        dispatch(createNotification('服务器错误', 'error'))
        break
      default:
        dispatch(createNotification('删除文章失败', 'error'))
        console.error(error.response.data)
      }
    }
  }
}


export const { setArticles, updateArticle, deleteArticle, clearArticles, appendArticle } = articlesSlice.actions
export default articlesSlice.reducer