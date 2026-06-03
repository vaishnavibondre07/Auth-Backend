import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAllUsersQuery } from "../api/profileApi";

const UserDetailsByAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } =
    useGetAllUsersQuery({ page: 1, limit: 1000 });

  const user = data?.data?.find(
    (u) => u._id === id
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-semibold text-gray-600">
          Loading User...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-semibold text-red-500">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 md:px-10 py-8">

            <div className="flex flex-col md:flex-row items-center gap-5">

              {/* Avatar */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-3xl md:text-4xl font-bold text-blue-600 shadow-lg">

                {user.username?.charAt(0)?.toUpperCase()}

              </div>

              {/* User Info */}
              <div className="text-center md:text-left text-white">

                <h1 className="text-2xl md:text-3xl font-bold">
                  {user.username}
                </h1>

                <p className="text-blue-100 break-all">
                  {user.email}
                </p>

                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : "bg-white text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.verified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.verified
                      ? "Verified"
                      : "Not Verified"}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* Content */}
          <div className="p-5 md:p-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* User Information */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">

                <h2 className="text-lg font-bold text-gray-800 mb-5">
                  User Information
                </h2>

                <div className="space-y-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Username
                    </p>

                    <p className="font-semibold text-gray-800">
                      {user.username}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Email Address
                    </p>

                    <p className="font-semibold text-gray-800 break-all">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Role
                    </p>

                    <p className="font-semibold text-gray-800 capitalize">
                      {user.role}
                    </p>
                  </div>

                </div>

              </div>

              {/* Account Status */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">

                <h2 className="text-lg font-bold text-gray-800 mb-5">
                  Account Status
                </h2>

                <div className="space-y-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Verification Status
                    </p>

                    <p
                      className={`font-semibold ${
                        user.verified
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {user.verified
                        ? "Verified"
                        : "Not Verified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Joined On
                    </p>

                    <p className="font-semibold text-gray-800">
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      User ID
                    </p>

                    <p className="font-semibold text-gray-800 break-all text-sm">
                      {user._id}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">

              <button
                onClick={() =>
                  navigate(`/admin/user/${user._id}/files`)
                }
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                📁 View Uploaded Files
              </button>

              <button
                onClick={() => navigate("/admin")}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                ← Back To Dashboard
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default React.memo(UserDetailsByAdmin);



// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetAllUsersQuery } from "../api/profileApi";

// const UserDetailsByAdmin = () => {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { data, isLoading } =
//     useGetAllUsersQuery({ page: 1, limit: 1000 });

//   const user =
//     data?.data?.find((u) => u._id === id);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading User...
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         User not found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-6">

//       <div className="max-w-4xl mx-auto">

//         <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

//             <div className="flex flex-col sm:flex-row gap-5 items-center">

//               <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold">

//                 {user.username
//                   ?.charAt(0)
//                   ?.toUpperCase()}

//               </div>

//               <div>

//                 <h1 className="text-3xl font-bold">
//                   {user.username}
//                 </h1>

//                 <p className="text-blue-100">
//                   {user.email}
//                 </p>

//               </div>

//             </div>

//           </div>

//           <div className="p-6">

//             <div className="grid md:grid-cols-2 gap-6">

//               <div className="bg-gray-50 rounded-xl p-5">

//                 <h2 className="font-bold text-lg mb-4">
//                   User Information
//                 </h2>

//                 <div className="space-y-4">

//                   <div>
//                     <p className="text-gray-500 text-sm">
//                       Username
//                     </p>

//                     <p className="font-semibold">
//                       {user.username}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-gray-500 text-sm">
//                       Email
//                     </p>

//                     <p className="font-semibold break-all">
//                       {user.email}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-gray-500 text-sm">
//                       Role
//                     </p>

//                     <p className="font-semibold">
//                       {user.role}
//                     </p>
//                   </div>

//                 </div>

//               </div>

//               <div className="bg-gray-50 rounded-xl p-5">

//                 <h2 className="font-bold text-lg mb-4">
//                   Account Status
//                 </h2>

//                 <div className="space-y-4">

//                   <div>

//                     <p className="text-gray-500 text-sm">
//                       Verification
//                     </p>

//                     <span
//                       className={`font-semibold ${
//                         user.verified
//                           ? "text-green-600"
//                           : "text-red-500"
//                       }`}
//                     >
//                       {user.verified
//                         ? "Verified"
//                         : "Not Verified"}
//                     </span>

//                   </div>

//                   <div>

//                     <p className="text-gray-500 text-sm">
//                       Joined
//                     </p>

//                     <p className="font-semibold">
//                       {new Date(
//                         user.createdAt
//                       ).toLocaleDateString()}
//                     </p>

//                   </div>

//                 </div>

//               </div>

//             </div>

//             <div className="mt-6 flex gap-3">

//               <button
//                 onClick={() =>
//                   navigate(`/admin/user/${user._id}/files`)
//                 }
//                 className="bg-green-600 text-white px-5 py-3 rounded-xl"
//               >
//                 View Files
//               </button>

//               <button
//                 onClick={() => navigate("/admin")}
//                 className="bg-blue-600 text-white px-5 py-3 rounded-xl"
//               >
//                 Back
//               </button>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default React.memo(UserDetailsByAdmin);