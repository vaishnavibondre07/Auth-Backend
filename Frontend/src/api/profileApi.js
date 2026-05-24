import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { config } from "../config";
import { baseQueryWithReauth } from "./baseQuery";

const url = config.BACKEND_URL;

export const profileApi = createApi({
    reducerPath : "profileApi",

    baseQuery : baseQueryWithReauth,

    tagTypes : ['Profile'],

    endpoints : (builder) => ({

        getProfile : builder.query({
            query : () => ({
                url : "/profile",
                method : "GET"
            }),
            providesTags : ['Profile']
        }),

        getAllUsers : builder.query({
            query : () => ({
                url : "/admin/users",
                method : "GET"
            })
        }),

        providesTags: ['profile']
    })
});

export const { useGetProfileQuery, useGetAllUsersQuery } = profileApi;