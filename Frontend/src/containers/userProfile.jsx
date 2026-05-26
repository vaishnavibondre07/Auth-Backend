import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { profileApi } from "../api/profileApi";
import { useGetProfileQuery } from "../api/profileApi";
import { useRefreshTokenMutation, useLogoutUserMutation, useDeleteAccountMutation} from "../api/authApi";
import {store} from "../store/store";
import MessageBox from "../components/MessageBox";


const UserProfile = () => {

   // console.log(store.getState().profileApi.queries);

   const navigate = useNavigate();
   const dispatch = useDispatch();

   const { data, isLoading, error, refetch} = useGetProfileQuery();

   const [message, setMessage] = useState(null);

   const [refreshToken] =
      useRefreshTokenMutation();

   const [logoutUser,
      { isLoading: isLoggingOut }
   ] = useLogoutUserMutation();

   const [
   deleteAccount,
   { isLoading: isDeleting }
] = useDeleteAccountMutation();


   const handleLogout = async () => {

      try {

         const res = await logoutUser().unwrap();

         dispatch(clearUser());

         dispatch( profileApi.util.resetApiState());
         console.log(store.getState().profileApi.queries);

          setMessage({
            type: "success",
            text: res.message
         })

         navigate("/login");

      } catch (error) {

         setMessage({
            type: "error",
            text: error.message,
         });
      }
   };

   const handleDeleteAccount = async () => {
      if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
         try {
            const res = await deleteAccount().unwrap();
            setMessage({
               type: "success",
               text: res.message,
            });
            setTimeout(() => {
               navigate("/");
            }, 4000);
         }
            catch (error) {
               setMessage({
                  type: "error",
                  text: error.message,
               });
            }
      }
   }

   const handleDashboardNavigation = () => {

      if (data?.data?.role === "admin") {

         navigate("/admin");

      } else {

         navigate("/profile");
      }
   };



   if (isLoading) {

      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-2xl shadow-lg">

               <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

               <p className="mt-4 text-gray-600">
                  Loading profile...
               </p>

            </div>

         </div>
      );
   }

   if (
      error &&
      error?.status !== 401
   ) {

      return (

         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full">

               <div className="text-5xl">
                  ⚠️
               </div>

               <h2 className="text-2xl font-bold text-gray-800 mt-4">
                  Something went wrong
               </h2>

               <p className="text-gray-500 mt-2">
                  Failed to fetch profile data.
               </p>

               <button
                  onClick={() => refetch()}
                  className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
               >
                  Try Again
               </button>

            </div>

         </div>
      );
   }

   return (

      <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-4">

         {message && (
            <MessageBox
               type={message.type}
               text={message.text}
               onClose={() => setMessage(null)}
            />
         )}

         <div className="max-w-4xl mx-auto w-full">

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl text-white">

               <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-6">

                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg shrink-0">

                     {data?.data?.username
                        ?.charAt(0)
                        ?.toUpperCase()}

                  </div>

                  {/* USER INFO */}

                  <div className="flex-1 text-center md:text-left w-full min-w-0">

                     <h1 className="text-2xl sm:text-3xl font-bold break-words">
                        {data?.data?.username}
                     </h1>

                     <p className="text-blue-100 mt-1 text-sm sm:text-base break-all">
                        {data?.data?.email}
                     </p>

                     <div className="mt-4 flex gap-3 flex-wrap">

                        <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                           {data?.data?.role?.toUpperCase()}
                        </span>

                        <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                           {data?.data?.verified
                              ? "Verified User"
                              : "Not Verified"}
                        </span>

                     </div>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="flex flex-col gap-2 sm:gap-3 w-full md:w-auto">

                     {data?.data?.role === "admin" && (
                        <button
                           onClick={handleDashboardNavigation}
                           className="w-full md:w-auto bg-white text-blue-600 px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-blue-50 transition"
                        >
                           Dashboard
                        </button>
                     )}

                     <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full md:w-auto bg-white text-red-600 px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
                     >
                        {isLoggingOut
                           ? "Logging out..."
                           : "Logout"}
                     </button>

                     <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="w-full md:w-auto bg-red-600 text-white px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
                     >
                        {isDeleting
                           ? "Deleting..."
                           : "Delete Account"}
                     </button>

                  </div>

               </div>

            </div>

            {/* INFO GRID */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">

               {/* ACCOUNT INFO */}

               <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">

                  <h2 className="text-xl font-bold text-gray-800 mb-5">
                     Account Information
                  </h2>

                  <div className="space-y-5">

                     <div>

                        <p className="text-sm text-gray-500">
                           Username
                        </p>

                        <p className="text-lg font-semibold text-gray-800">
                           {data?.data?.username}
                        </p>

                     </div>

                     <div>

                        <p className="text-sm text-gray-500">
                           Email Address
                        </p>

                        <p className="text-lg font-semibold text-gray-800">
                           {data?.data?.email}
                        </p>

                     </div>

                     <div>

                        <p className="text-sm text-gray-500">
                           Role
                        </p>

                        <p className="text-lg font-semibold text-gray-800">
                           {data?.data?.role}
                        </p>

                     </div>

                  </div>

               </div>

               {/* PASSWORD RESET */}

               <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">

                  <h3 className="text-xl font-bold text-gray-800">
                     Password Recovery
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                     Reset your password securely using email verification and OTP authentication.
                  </p>

                  <button
                     onClick={() => navigate("/forgot-password")}
                     className="mt-5 w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 min-h-[44px] rounded-lg hover:bg-blue-700 transition"
                  >
                     Reset Password
                  </button>

               </div>

            </div>

         </div>

      </div>
   );
};

export default UserProfile;


