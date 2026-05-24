import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { config } from '../config';
import { baseQueryWithReauth } from './baseQuery';

const url = config.BACKEND_URL;

export const authApi = createApi({
    reducerPath: 'authApi',

    baseQuery : baseQueryWithReauth,

    tagTypes : ['Profile'],

    endpoints : (builder) => ({

        registerUser : builder.mutation({
            query : (user) => ({
                url : "/auth/register",
                method : "POST",
                body : user
            })
        }),

        loginUser : builder.mutation({
            query : (user) => ({
                url : "/auth/login",
                method : "POST",
                body : user
            })
        }),

        googleLogin : builder.mutation({
            query : (token) => ({
                url : "/auth/google-login",
                method : "POST",
                body : {token},

                credentials : 'include'
            })
        }),

        refreshToken : builder.mutation({
            query : ()=> ({
                url : '/auth/refresh-token',
                method : "POST",
                credentials : 'include',
            })
        }),

        verifyEmail : builder.mutation({
            query : (otp) => ({
                url  : '/auth/verify-email',
                method : "POST",
                body : otp
            })
        }),

        resendOTP : builder.mutation({
            query : (email) => ({
                url : '/auth/resend-otp',
                method : "POST",
                body : email
            })    
        }),

        forgotPassword : builder.mutation({
            query : (email) => ({
                url : '/auth/forgot-password',
                method : "POST",
                body : email
            })
        }),

        verifyForgotPasswordOTP : builder.mutation({
            query : (data) => ({
                url : '/auth/verify-forgot-password-otp',
                method : "POST",
                body : data
            })
        }),

        resetPassword : builder.mutation({
            query : (data) => ({
            url : '/auth/reset-password',
            method : "POST",
            body : data
           })
        }),

        createCaptcha : builder.mutation({
            query : () => ({
                url : '/auth/create-captcha',
                method : "GET"
            })
        }),

        logoutUser : builder.mutation({
            query : (token) => ({
                url : '/auth/logout',
                method : "POST",
                body : token
            }),
            invalidatesTags : ['Profile']
        }),

        logoutFromAllDevices : builder.mutation({
            query : (token) => ({
                url : '/auth/logout-all-devices',
                method : "POST",
                body : token
            })
        }),

        deleteAccount: builder.mutation({
            query: () => ({
                   url: "/auth/delete-account",
                   method: "DELETE",
                   credentials: 'include'
            }),
           invalidatesTags: ["Profile"],
      }),

      deleteUserByAdmin: builder.mutation({
          query: (id) => ({
             url: `/auth/delete-account/${id}`,
             method: "DELETE",
             credentials: "include"
      }), 

         invalidatesTags: ["Profile"]
      })

   })
});

export const {useRegisterUserMutation, useLoginUserMutation, useRefreshTokenMutation, useVerifyEmailMutation, useResendOTPMutation, useForgotPasswordMutation, useVerifyForgotPasswordOTPMutation, useResetPasswordMutation, useCreateCaptchaMutation, useLogoutUserMutation, useLogoutFromAllDevicesMutation, useGoogleLoginMutation, useDeleteAccountMutation, useDeleteUserByAdminMutation} = authApi;
