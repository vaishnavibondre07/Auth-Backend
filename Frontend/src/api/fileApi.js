import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Files"],

  endpoints: (builder) => ({

    uploadFile: builder.mutation({
      query: (formData) => ({
        url: "/files/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Files"],
    }),

    getUserFiles: builder.query({
      query: () => "/files/my-files",
      providesTags: ["Files"],
    }),

    deleteFile: builder.mutation({
      query: (fileId) => ({
        url: `/files/delete/${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Files"],
    }),

    getFileById: builder.query({
      query: (fileId) => `/files/${fileId}`,
    }),

  }),
});

export const { useUploadFileMutation, useGetUserFilesQuery, useDeleteFileMutation, useGetFileByIdQuery} = fileApi;