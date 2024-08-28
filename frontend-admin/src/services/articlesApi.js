import { createApi, } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axios'

const baseUrl = '/api/articles'

export const articlesApi = createApi({
  reducerPath: 'articlesApi',
  baseQuery: axiosBaseQuery({ baseUrl }),
  tagTypes: ['Article'],
  endpoints: (builder) => ({

    getArticles: builder.query({
      query: ({
        offset = 0,
        ordering = 'created-at',
        type = '',
        keyword = '',
        limit = 12,
        total = false,
      }) => {
        return ({
          url: `?offset=${offset}&ordering=${ordering}&type=${type}&keyword=${keyword}&limit=${limit}&total=${total}`,
          method: 'GET',
        })
      },
      providesTags: ['Article'],
    }),

    getArticle: builder.query({
      query: (id) => ({
        url: id,
        method: 'GET',
      }),
      providesTags: ['Article'],
    }),

    updateArticle: builder.mutation({
      query: (article) => ({
        url: `/${article.id}`,
        method: 'PUT',
        body: article,
      }),
      invalidatesTags: ['Article'],
    }),

    createArticle: builder.mutation({
      query: (article) => ({
        url: '',
        method: 'POST',
        body: article,
      }),
      invalidatesTags: ['Article'],
    }),

    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Article'],
    }),
  }),
})

export const {
  useGetArticleQuery,
  useGetArticlesQuery,
  useUpdateArticleMutation,
  useCreateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi
