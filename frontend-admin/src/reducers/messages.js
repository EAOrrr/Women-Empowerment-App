/**
 * @description: This file contains the messages reducer
 * which is responsible for handling the messages state in the redux store.
 * The messages reducer is responsible for handling the following actions:
 * 1. SET_MESSAGES: This action is dispatched when the messages are fetched from the server
 * and stored in the redux store.
 * 2. UPDATE_MESSAGE: This action is dispatched when a message is updated in the redux store.
 * 3. DELETE_MESSAGE: This action is dispatched when a message is deleted from the redux store.
 */

import { createSlice } from '@reduxjs/toolkit'

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    setMessages(state, action) {
      return action.payload
    },
    updateMessage(state, action) {
      const id = action.payload.id
      return state.map(message =>
        message.id === id
          ? action.payload
          : message
      )
    },
    deleteMessage(state, action) {
      return state.filter(message =>
        message.id !== action.payload.id
      )
    }
  }
})

export const { setMessages, updateMessage, deleteMessage } = messagesSlice.actions
export default messagesSlice.reducer