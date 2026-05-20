import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',

    baseQuery : fetchBaseQuery({
        baseUrl : "http://localhost:3000/api/auth"
    }),

    endpoints : (builder) => ({

        registerUser : builder.mutation({
            query : (user) => ({
                url : "/register",
                method : "POST",
                body : user
            })
        }),

        loginUser : builder.mutation({
            query : (user) => ({
                url : "/login",
                method : "POST",
                body : user
            })
        }),

        refreshToken : builder.mutation({
            query : (token)=> ({
                url : '/refresh-token',
                method : "POST",
                body : token
            })
        }),

        verifyEmail : builder.mutation({
            query : (otp) => ({
                url  : '/verify-email',
                method : "POST",
                body : otp
            })
        }),

        resendOTP : builder.mutation({
            query : (email) => ({
                url : '/resend-otp',
                method : "POST",
                body : email
            })    
        }),

        forgetPassword : builder.mutation({
            query : (email) => ({
                url : '/forget-password',
                method : "POST",
                body : email
            })
        }),

        verifyForgetPasswordOTP : builder.mutation({
            query : (data) => ({
                url : '/verify-forget-password-otp',
                method : "POST",
                body : data
            })
        }),

        resetPassword : builder.mutation({
            query : (data) => ({
            url : '/reset-password',
            method : "POST",
            body : data
           })
        }),

        createCaptcha : builder.mutation({
            query : () => ({
                url : '/create-captcha',
                method : "GET"
            })
        }),

        logoutUser : builder.mutation({
            query : (token) => ({
                url : '/logout',
                method : "POST",
                body : token
            })
        }),

        logoutFromAllDevices : builder.mutation({
            query : (token) => ({
                url : '/logout-all-devices',
                method : "POST",
                body : token
            })
        })
    })
});

export const {useRegisterUserMutation, useLoginUserMutation, useRefreshTokenMutation, useVerifyEmailMutation, useResendOTPMutation, useForgetPasswordMutation, useVerifyForgetPasswordOTPMutation, useResetPasswordMutation, useCreateCaptchaMutation, useLogoutUserMutation, useLogoutFromAllDevicesMutation} = api;
