import { createApi, } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axios'

const baseUrl = '/api/recruitments'

export const recruitmentsApi = createApi({
  reducerPath: 'recruitmentsApi',
  baseQuery: axiosBaseQuery({ baseUrl }),
  tagTypes: ['Recruitment'],
  endpoints: (builder) => ({
    getRecruitments: builder.query({
      query: ({
        offset = 0,
        ordering = 'created-at',
        keyword='',
        limit = 12,
        total = true,
      }) => ({
        url: `?offset=${offset}&ordering=${ordering}&keyword=${keyword}&limit=${limit}&total=${total}`,
        method: 'GET',
      }),
      providesTags: ['Recruitment'],
    }),

    getRecruitment: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: ['Recruitment'],
    }),

    updateRecruitment: builder.mutation({
      query: (recruitment) => ({
        url: `/${recruitment.id}`,
        method: 'PUT',
        body: recruitment,
      }),
      invalidatesTags: ['Recruitment'],
    }),

    createRecruitment: builder.mutation({
      query: (recruitment) => ({
        url: '',
        method: 'POST',
        body: recruitment,
      }),
      invalidatesTags: ['Recruitment'],
    }),

    deleteRecruitment: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Recruitment'],
    }),

    createRecruitmentJob: builder.mutation({
      query: ({ id, job }) => ({
        url: `/${id}/jobs`,
        method: 'POST',
        body: job,
      }),
      invalidatesTags: ['Recruitment'],
    }),

    updateRecruitmentJob: builder.mutation({
      query: ({ id, job }) => ({
        url: `/${id}/jobs/${job.id}`,
        method: 'PUT',
        body: job,
      }),
      invalidatesTags: ['Recruitment'],
    }),

    deleteRecruitmentJob: builder.mutation({
      query: ({ id, jobId }) => ({
        url: `/${id}/jobs/${jobId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Recruitment'],
    }),

    getRecruitmentJob: builder.query({
      query: (id) => ({
        url: `/${id}/jobs`,
        method: 'GET',
      }),
      providesTags: ['Recruitment'],
    }),

    getRecruitmentComments: builder.query({
      query: (id) => ({
        url: `/${id}/comments`,
        method: 'GET',
      }),
      providesTags: ['Recruitment'],
    }),

    createRecruitmentComment: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/${id}/comments`,
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: ['Recruitment'],
    }),

    updateRecruitmentComment: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/${id}/comments/${comment.id}`,
        method: 'PUT',
        body: comment,
      }),
      invalidatesTags: ['Recruitment'],
    }),

    deleteRecruitmentComment: builder.mutation({
      query: ({ id, commentId }) => ({
        url: `/${id}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Recruitment'],
    }),
  }),
})

export const {
  useGetRecruitmentsQuery,
  useGetRecruitmentQuery,
  useUpdateRecruitmentMutation,
  useCreateRecruitmentMutation,
  useDeleteRecruitmentMutation,
  useCreateRecruitmentJobMutation,
  useUpdateRecruitmentJobMutation,
  useDeleteRecruitmentJobMutation,
  useGetRecruitmentJobQuery,
  useGetRecruitmentCommentsQuery,
  useCreateRecruitmentCommentMutation,
  useUpdateRecruitmentCommentMutation,
  useDeleteRecruitmentCommentMutation,
} = recruitmentsApi

