import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
    reducerPath : "profileApi",

    baseQuery : fetchBaseQuery({
        baseUrl : "http://localhost:3000/api/",
        credentials : 'include'
    }),

    endpoints : (builder) => ({

        getProfile : builder.query({
            query : () => ({
                url : "/profile",
                method : "GET"
            })
        })
    })
});

export const { useGetProfileQuery } = profileApi;