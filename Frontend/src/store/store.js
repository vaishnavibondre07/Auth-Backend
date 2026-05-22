import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { profileApi } from "../api/profileApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/authSlice";

export const store = configureStore({
    reducer : {
        auth : authReducer,
        [authApi.reducerPath] : authApi.reducer,
        [profileApi.reducerPath] : profileApi.reducer

    },

    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, profileApi.middleware)
});

setupListeners(store.dispatch)