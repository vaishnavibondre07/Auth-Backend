import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {config} from "../config";

const url = config.BACKEND_URL;

const baseQuery = fetchBaseQuery({
   baseUrl: `${url}/api`,
   credentials: "include",
});

export const baseQueryWithReauth =
   async (args, api, extraOptions) => {

      let result =
         await baseQuery(
            args,
            api,
            extraOptions
         );

      // if access token expired
      if (result?.error?.status === 401) {

         console.log(
            "Access token expired. Refreshing..."
         );

         // call refresh token API
         const refreshResult =
            await baseQuery(
               {
                  url: "/auth/refresh-token",
                  method: "POST",
               },
               api,
               extraOptions
            );

         // if refresh successful
         if (refreshResult?.data) {

            console.log(
               "New access token generated"
            );

            // retry original request
            result = await baseQuery(
               args,
               api,
               extraOptions
            );

         } else {

            // refresh token also expired
            window.location.href = "/login";
         }
      }

      return result;
   };