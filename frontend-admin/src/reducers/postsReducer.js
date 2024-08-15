/**
 * @description: This file contains the reducer for the posts.
 * The posts reducer is responsible for handling the posts state in the redux store.
 * 1. SET_POSTS: This action is dispatched when the posts are fetched from the server and stored in the redux store.
 * 2. DELETE_POST: This action is dispatched when a post is deleted from the redux store.
 */

import { createSlice } from '@reduxjs/toolkit'

const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    setPosts(state, action) {
      return action.payload
    },
    deletePost(state, action) {
      return state.filter(post =>
        post.id !== action.payload.id
      )
    }
  }
})

export const { setPosts, deletePost } = postsSlice.actions
export default postsSlice.reducer