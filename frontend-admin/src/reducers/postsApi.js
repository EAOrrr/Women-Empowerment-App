import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../services/axios'

const baseUrl = 'http://localhost:3001/api/posts'

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: axiosBaseQuery({ baseUrl }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({
        offset = 0,
        ordering = 'created-at',
        status = 'in-progressed',
        keyword = '',
        limit = 12,
        total=true,
      }) => {
        return {
          url: `?offset=${offset}&ordering=${ordering}&status=${status}&keyword=${keyword}&limit=${limit}&total=${total}`,
          method: 'GET',
        }
      },
      providesTags: ['Post'],
    }),

    getPost: builder.query({
      query: (id) => ({
        url: `${id}?comments=true`,
        method: 'GET',
      }),
      providesTags: ['Post'],
    }),

    updatePost: builder.mutation({
      query: (post) => ({
        url: `/${post.id}`,
        method: 'PUT',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),

    createPost: builder.mutation({
      query: (post) => ({
        url: '',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useUpdatePostMutation,
  useCreatePostMutation,
  useDeletePostMutation,
} = postsApi