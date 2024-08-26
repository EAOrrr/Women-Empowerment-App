import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../services/axios'

const baseUrl = 'http://localhost:3001/api/notifications'

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: axiosBaseQuery({ baseUrl }),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => {
        return {
          url: '',
          method: 'GET',
        }
      },
      providesTags: ['Notification'],
    }),

    updateNotification: builder.mutation({
      query: (notification) => ({
        url: `/${notification.id}`,
        method: 'PUT',
        body: notification,
      }),
      invalidatesTags: ['Notification'],
    }),

    createNotification: builder.mutation({
      query: (notification) => ({
        url: '',
        method: 'POST',
        body: notification,
      }),
      invalidatesTags: ['Notification'],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const { useGetNotificationsQuery, useUpdateNotificationMutation, useCreateNotificationMutation, useDeleteNotificationMutation } = notificationsApi