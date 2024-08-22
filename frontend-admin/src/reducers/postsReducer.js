/**
 * @description: This file contains the reducer for the posts.
 * The posts reducer is responsible for handling the posts state in the redux store.
 * 1. SET_POSTS: This action is dispatched when the posts are fetched from the server and stored in the redux store.
 * 2. UPDATE_POST: This action is dispatched when a post is updated in the redux store.
 */

import { createSlice } from '@reduxjs/toolkit'
import postsService from '../services/posts'

const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    setPosts(state, action) {
      return action.payload
    },
    updatePosts(state, action) {
      const updatedPost = action.payload
      return state.map(post => post.id === updatedPost.id ? updatedPost : post)
    },
    deletePost(state, action) {
      const postId = action.payload
      return state.filter(post => post.id !== postId)
    },
  }
})

export const initalizePosts = () => {
  return async dispatch => {
    const posts = await postsService.getAll()
    dispatch(setPosts(posts))
  }
}

export const { setPosts, deletePost } = postsSlice.actions
export default postsSlice.reducer