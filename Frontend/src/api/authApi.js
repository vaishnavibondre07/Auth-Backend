import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath: 'authApi',

    baseQuery : fetchBaseQuery({
        baseUrl : "http://localhost:3000/api/auth",
        credentials : 'include'
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

        googleLogin : builder.mutation({
            query : (token) => ({
                url : "/google-login",
                method : "POST",
                body : {token},

                credentials : 'include'
            })
        }),

        refreshToken : builder.mutation({
            query : ()=> ({
                url : '/refresh-token',
                method : "POST",
                credentials : 'include',
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

        forgotPassword : builder.mutation({
            query : (email) => ({
                url : '/forgot-password',
                method : "POST",
                body : email
            })
        }),

        verifyForgotPasswordOTP : builder.mutation({
            query : (data) => ({
                url : '/verify-forgot-password-otp',
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

export const {useRegisterUserMutation, useLoginUserMutation, useRefreshTokenMutation, useVerifyEmailMutation, useResendOTPMutation, useForgotPasswordMutation, useVerifyForgotPasswordOTPMutation, useResetPasswordMutation, useCreateCaptchaMutation, useLogoutUserMutation, useLogoutFromAllDevicesMutation, useGoogleLoginMutation} = authApi;
