import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { config } from "../config";

const url = config.BACKEND_URL;

export const profileApi = createApi({
    reducerPath : "profileApi",

    baseQuery : fetchBaseQuery({
        baseUrl : `${url}/api/`,
        credentials : 'include'
    }),

    endpoints : (builder) => ({

        getProfile : builder.query({
            query : () => ({
                url : "/profile",
                method : "GET"
            })
        }),

        getAllUsers : builder.query({
            query : () => ({
                url : "/admin/users",
                method : "GET"
            })
        })
    })
});

export const { useGetProfileQuery, useGetAllUsersQuery } = profileApi;