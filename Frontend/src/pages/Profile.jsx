import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../api/profileApi";
import { useRefreshTokenMutation, useLogoutUserMutation} from "../api/authApi";
import MessageBox from "../components/MessageBox";

export const Profile = () => {

   const navigate = useNavigate();

   const { data, isLoading, error,refetch } = useGetProfileQuery();

   const [message, setMessage] = useState(null);

   const [refreshToken] = useRefreshTokenMutation();

   const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

   useEffect(() => {

      const refreshAccessToken = async () => {

         if (error?.status === 401) {

            try {
                 await refreshToken().unwrap();
                 refetch();
            } catch (err) {
              setMessage({ type: "error", text: err.message});
              console.log(err);
               navigate("/login");
            }
         }
      };

      refreshAccessToken();
   }, [ error, refreshToken,refetch, navigate]);

   const handleLogout =
      async () => {
      try {
         await logoutUser().unwrap();
         navigate("/login");
      } catch (error) {
         console.log(error);
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

      <div className="min-h-screen bg-gray-100 py-10 px-4">

         <div className="max-w-4xl mx-auto">

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-xl text-white">

               <div className="flex flex-col md:flex-row items-center gap-6">

                  <div className="w-28 h-28 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg">

                     {data?.data?.username
                        ?.charAt(0)
                        ?.toUpperCase()}

                  </div>

                  <div className="flex-1">
                     <h1 className="text-3xl font-bold">
                        {data?.data?.username}
                     </h1>
                     <p className="text-blue-100 mt-1">
                        {data?.data?.email}
                     </p>

                     <div className="mt-4 flex gap-3 flex-wrap">
                        <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                           Active Account
                        </span>

                        <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                           Verified User
                        </span>
                     </div>
                  </div>

                  <button
                     onClick={handleLogout}
                     disabled={isLoggingOut}
                     className="bg-white text-red-600 px-5 py-3 rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
                  >
                     {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

               <div className="bg-white rounded-2xl shadow-lg p-6">

                  <h2 className="text-xl font-bold text-gray-800 mb-5"> Account Information </h2>

                  <div className="space-y-5">
                     <div>
                        <p className="text-sm text-gray-500"> Username </p>
                        <p className="text-lg font-semibold text-gray-800">{data?.data?.username}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-500">
                           Email Address
                        </p>
                        <p className="text-lg font-semibold text-gray-800">
                           {data?.data?.email}
                        </p>
                     </div>
                  </div>
               </div>

              <div className="border rounded-xl p-4">

                    <h3 className="font-semibold text-gray-800"> Password Recovery</h3>

                    <p className="text-sm text-gray-500 mt-1"> Reset your password securely through email verification and OTP authentication..</p>

                    <button onClick={() => navigate("/forgot-password")}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">  Reset Password
                     </button>

                </div>

            </div>

         </div>

      </div>
   );
};

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { useGetProfileQuery }
// from "../api/profileApi";

// import { useRefreshTokenMutation }
// from "../api/authApi";

// export const Profile = () => {

//    const navigate = useNavigate();

//    const { data, isLoading, error, refetch } = useGetProfileQuery();

//    const [refreshToken] =  useRefreshTokenMutation();

//    useEffect(() => {

//       const refreshAccessToken = async () => {

//          if (error?.status === 401) {

//             try {
//                  await refreshToken().unwrap();
//                  refetch();

//             } catch (err) {
//                console.log(err);
//                navigate("/login");
//             }
//          }
//       };

//       refreshAccessToken();

//    }, [
//       error,
//       refreshToken,
//       refetch,
//       navigate,
//    ]);

//    // LOADING

//    if (isLoading) {
//       return <div>Loading...</div>;
//    }

//    // OTHER ERRORS

//    if (
//       error &&
//       error?.status !== 401
//    ) {
//       return (
//          <div>
//             Failed to fetch profile
//          </div>
//       );
//    }

//    return (
//       <div>

//          <h1>Profile</h1>

//          <p>
//             Name:
//             {" "}
//             {data?.data?.username}
//          </p>

//          <p>
//             Email:
//             {" "}
//             {data?.data?.email}
//          </p>

//       </div>
//    );
// };