import React, { useState } from "react";
import { useGetProfileQuery } from "../api/profileApi";
import { useGetUserFilesQuery } from "../api/fileApi";
import { useSessionChecker } from "../hook/useSessionChecker";
import MessageBox from "../components/MessageBox";

import ProfileHeader from "../components/profile/ProfileHeader";
import AccountInfo from "../components/profile/AccountInfo";
import PasswordRecovery from "../components/profile/PasswordRecovery";
import FileSection from "../components/profile/FileSection";
import FileViewerModal from "../components/profile/FileViewerModal";

import { useProfileActions } from "../hook/useProfileActions.js";

const UserProfile = () => {
  useSessionChecker();

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: filesData,
    isLoading: isFilesLoading,
  } = useGetUserFilesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    handleLogout,
    handleDeleteAccount,
    handleFileUpload,
    handleDeleteFile,
    handleDashboardNavigation,
    isLoggingOut,
    isDeleting,
  } = useProfileActions(setMessage, data);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {message.text && (
          <MessageBox
            type={message.type}
            text={message.text}
            onClose={() => setMessage({ type: "", text: "" })}
          />
        )}

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && error?.status !== 401) {
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

      {message.text && (
        <MessageBox
          type={message.type}
          text={message.text}
          onClose={() =>
            setMessage({
              type: "",
              text: "",
            })
          }
        />
      )}

      <div className="max-w-4xl mx-auto w-full">

        <ProfileHeader
          user={data?.data}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onDashboard={handleDashboardNavigation}
          isLoggingOut={isLoggingOut}
          isDeleting={isDeleting}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">

          <AccountInfo user={data?.data} />

          <PasswordRecovery />

        </div>

        <FileSection
          files={filesData?.files}
          loading={isFilesLoading}
          onUpload={handleFileUpload}
          onDelete={handleDeleteFile}
          onView={setSelectedFile}
        />

      </div>

      <FileViewerModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
      />

    </div>
  );
};

export default React.memo(UserProfile);


// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { profileApi } from "../api/profileApi";
// import { useGetProfileQuery} from "../api/profileApi";
// import { useRefreshTokenMutation, useLogoutUserMutation, useDeleteAccountMutation} from "../api/authApi";
// import {store} from "../store/store";
// import  MessageBox  from "../components/MessageBox";
// import { logout } from "../features/authSlice";
// import { useSessionChecker } from "../hook/useSessionChecker";
// import { useUploadFileMutation, useGetUserFilesQuery,  useDeleteFileMutation,} from "../api/fileApi";

// const UserProfile = () => {

//    useSessionChecker();

//    // console.log(store.getState().profileApi.queries);

//    const navigate = useNavigate();
//    const dispatch = useDispatch();
//    const user = useSelector((state) => state.auth.user)

//    const { data, isLoading, error, refetch} = useGetProfileQuery(undefined, {
//         refetchOnMountOrArgChange: true,
//      }
//    );

//    const [message, setMessage] = useState({type: "", text:""});

//    const [refreshToken] = useRefreshTokenMutation();

//    const { data: filesData, isLoading: isFilesLoading} = useGetUserFilesQuery(undefined, {
//         refetchOnMountOrArgChange: true,
//      }
//    );

//    const [uploadFile] = useUploadFileMutation();

//    const [deleteFile] = useDeleteFileMutation();

//    const [logoutUser, { isLoading: isLoggingOut } ] = useLogoutUserMutation();

//    const [ deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

//    const [selectedFile, setSelectedFile] = useState(null);


//    const handleLogout = useCallback(async () => {

//       try {

//          const res = await logoutUser().unwrap();

//          dispatch(logout());

//          dispatch( profileApi.util.resetApiState());
//          dispatch(fileApi.util.resetApiState());
//          // console.log(store.getState().profileApi.queries);

//           setMessage({  type: "success",  text: res.message })

//          navigate("/login");

//       } catch (error) {

//          setMessage({  type: "error",  text: error.message });
//       }
//    });

//    const handleDeleteAccount = useCallback(async () => {
//       if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
//          try {
//             const res = await deleteAccount().unwrap();
//             setMessage({
//                type: "success",
//                text: res.message,
//             });
//             setTimeout(() => {
//                navigate("/");
//             }, 4000);
//          }
//             catch (error) {
//                setMessage({
//                   type: "error",
//                   text: error.message,
//                });
//             }
//       }
//    });

//    const handleDashboardNavigation = useCallback(() => {

//       if (data?.data?.role === "admin") {

//          navigate("/admin");

//       } else {

//          navigate("/profile");
//       }
//    });

//    const handleFileUpload = useCallback(async (e) => {

//       console.log("File upload started ");

//    const file = e.target.files[0];

//    if (!file) return;

//    const formData = new FormData();

//    formData.append("files", file);

//    try {

//       const res = await uploadFile(formData).unwrap();

//       setMessage({
//          type: "success",
//          text: "File uploaded successfully",
//       });

//    } catch (error) {

//       setMessage({
//          type: "error",
//          text: error?.data?.message || "Upload failed",
//       });
//    }
// });

// const handleDeleteFile = useCallback(async (id) => {

//    try {

//       await deleteFile(id).unwrap();

//       setMessage({
//          type: "success",
//          text: "File deleted successfully",
//       });

//    } catch (error) {

//       setMessage({
//          type: "error",
//          text: error?.data?.message || "Delete failed",
//       });
//    }
// });

//    if (isLoading) {

//       return (
//          <div className="min-h-screen flex items-center justify-center bg-gray-100">

//             {message.text && (
//                <MessageBox
//                   type={message.type}
//                   text={message.text}
//                   onClose={() => setMessage({ type: "", text: "" })}
//               />
//             )}

//             <div className="bg-white p-8 rounded-2xl shadow-lg">

//                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

//                <p className="mt-4 text-gray-600">
//                   Loading profile...
//                </p>

//             </div>

//          </div>
//       );
//    }

//    if (
//       error &&
//       error?.status !== 401
//    ) {

//       return (

//          <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

//             <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full">

//                <div className="text-5xl">
//                   ⚠️
//                </div>

//                <h2 className="text-2xl font-bold text-gray-800 mt-4">
//                   Something went wrong
//                </h2>

//                <p className="text-gray-500 mt-2">
//                   Failed to fetch profile data.
//                </p>

//                <button
//                   onClick={() => refetch()}
//                   className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
//                >
//                   Try Again
//                </button>

//             </div>

//          </div>
//       );
//    }

//    return (

//       <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-4">

//          {message && (
//             <MessageBox
//                type={message.type}
//                text={message.text}
//                onClose={() => setMessage(null)}
//             />
//          )}

//          <div className="max-w-4xl mx-auto w-full">

//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl text-white">

//                <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-6">

//                   <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg shrink-0">

//                      {data?.data?.username
//                         ?.charAt(0)
//                         ?.toUpperCase()}

//                   </div>

//                   {/* USER INFO */}

//                   <div className="flex-1 text-center md:text-left w-full min-w-0">

//                      <h1 className="text-2xl sm:text-3xl font-bold break-words">
//                         {data?.data?.username}
//                      </h1>

//                      <p className="text-blue-100 mt-1 text-sm sm:text-base break-all">
//                         {data?.data?.email}
//                      </p>

//                      <div className="mt-4 flex gap-3 flex-wrap">

//                         <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
//                            {data?.data?.role?.toUpperCase()}
//                         </span>

//                         <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
//                            {data?.data?.verified
//                               ? "Verified User"
//                               : "Not Verified"}
//                         </span>

//                      </div>

//                   </div>

//                   {/* ACTION BUTTONS */}

//                   <div className="flex flex-col gap-2 sm:gap-3 w-full md:w-auto">

//                      {data?.data?.role === "admin" && (
//                         <button
//                            onClick={handleDashboardNavigation}
//                            className="w-full md:w-auto bg-white text-blue-600 px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-blue-50 transition"
//                         >
//                            Dashboard
//                         </button>
//                      )}

//                      <button
//                         onClick={handleLogout}
//                         disabled={isLoggingOut}
//                         className="w-full md:w-auto bg-white text-red-600 px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
//                      >
//                         {isLoggingOut
//                            ? "Logging out..."
//                            : "Logout"}
//                      </button>

//                      <button
//                         onClick={handleDeleteAccount}
//                         disabled={isDeleting}
//                         className="w-full md:w-auto bg-red-600 text-white px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
//                      >
//                         {isDeleting
//                            ? "Deleting..."
//                            : "Delete Account"}
//                      </button>

//                   </div>

//                </div>

//             </div>

//             {/* INFO GRID */}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">

//                {/* ACCOUNT INFO */}

//                <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">

//                   <h2 className="text-xl font-bold text-gray-800 mb-5">
//                      Account Information
//                   </h2>

//                   <div className="space-y-5">

//                      <div>

//                         <p className="text-sm text-gray-500">
//                            Username
//                         </p>

//                         <p className="text-lg font-semibold text-gray-800">
//                            {data?.data?.username}
//                         </p>

//                      </div>

//                      <div>

//                         <p className="text-sm text-gray-500">
//                            Email Address
//                         </p>

//                         <p className="text-lg font-semibold text-gray-800">
//                            {data?.data?.email}
//                         </p>

//                      </div>

//                      <div>

//                         <p className="text-sm text-gray-500">
//                            Role
//                         </p>

//                         <p className="text-lg font-semibold text-gray-800">
//                            {data?.data?.role}
//                         </p>

//                      </div>

//                   </div>

//                </div>

//                {/* PASSWORD RESET */}

//                <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">

//                   <h3 className="text-xl font-bold text-gray-800">
//                      Password Recovery
//                   </h3>

//                   <p className="text-sm text-gray-500 mt-2">
//                      Reset your password securely using email verification and OTP authentication.
//                   </p>

//                   <button
//                      onClick={() => navigate("/forgot-password")}
//                      className="mt-5 w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 min-h-[44px] rounded-lg hover:bg-blue-700 transition"
//                   >
//                      Reset Password
//                   </button>

//                </div>

//             </div>

//             {/* FILE SECTION */}

//             <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mt-6 sm:mt-8">

//                {/* HEADER */}

//                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

//                  <div>
//                     <h2 className="text-2xl font-bold text-gray-800">
//                          My Files
//                     </h2>

//                     <p className="text-sm text-gray-500 mt-1">
//                        Upload and manage your files. You can view or delete your files anytime.
//                     </p>
//                  </div>

//                  {/* UPLOAD BUTTON */}

//                  <div>

//                     <input
//                        type="file"
//                        id="fileUpload"
//                        className="hidden"
//                        onChange={handleFileUpload}
//                     />

//                     <label
//                        htmlFor="fileUpload"
//                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl cursor-pointer hover:bg-blue-700 transition font-medium min-h-[44px]"
//                      >

//                      <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="w-5 h-5"
//                        fill="none"
//                        viewBox="0 0 24 24"
//                        stroke="currentColor"
//                      >
//                          <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0-12l-4 4m4-4l4 4"
//                          />
//                      </svg>

//                            Upload File

//                      </label>
//                   </div>
//             </div>

//             {/* FILE LIST */}

//             <div className="mt-6 overflow-x-auto">

//                {isFilesLoading ? (

//                  <div className="flex justify-center py-10">

//                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

//                  </div>

//                )  : filesData?.files?.length === 0 ? (

//                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center">

//                   <div className="text-5xl">  📁  </div>

//                   <h3 className="mt-4 text-lg font-semibold text-gray-700">
//                       No files uploaded yet
//                   </h3>

//                   <p className="text-sm text-gray-500 mt-2">
//                         Upload your first file to manage it here.
//                   </p>

//                </div>

//                ) : (

//                <table className="w-full min-w-[700px]">

//                   <thead>

//                      <tr className="bg-gray-50 border border-gray-200">

//                       <th className="text-left px-4 py-3 text-gray-700 font-semibold">
//                         File
//                       </th>

//                       <th className="text-left px-4 py-3 text-gray-700 font-semibold">
//                           Type
//                       </th>

//                       <th className="text-left px-4 py-3 text-gray-700 font-semibold">
//                           Uploaded
//                       </th>

//                       <th className="text-left px-4 py-3 text-gray-700 font-semibold">
//                           Actions
//                       </th>

//                      </tr>

//                   </thead>

//                   <tbody>

//                      {filesData?.files?.map((file) => (

//                      <tr
//                         key={file._id}
//                         className="border-b border-gray-200 hover:bg-gray-50 transition"
//                      >

//                      {/* FILE NAME */}

//                      <td className="px-4 py-4">

//                         <div className="flex items-center gap-3">

//                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">

//                               {file.fileType?.startsWith("image")
//                                  ? "🖼️"
//                                  : file.fileType?.includes("pdf")
//                                  ? "📄"
//                                  : "📁"}

//                            </div>

//                            <div className="max-w-[200px]">

//                               <p className="font-medium text-gray-800 truncate">
//                                  {file.public_id?.split("/").pop()}
//                               </p>

//                               <p className="text-xs text-gray-500 truncate">
//                                  {file.fileType}
//                               </p>

//                            </div>

//                         </div>

//                      </td>

//                      {/* TYPE */}

//                      <td className="px-4 py-4">

//                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">

//                            {file.fileType?.split("/")[0]}

//                         </span>

//                      </td>

//                      {/* DATE */}

//                      <td className="px-4 py-4 text-sm text-gray-600">

//                         {new Date(file.createdAt).toLocaleDateString()}

//                      </td>

//                      {/* ACTIONS */}

//                      <td className="px-4 py-4">

//                         <div className="flex items-center gap-3">

//                            {/* VIEW */}

//                           <button
//                               onClick={() => setSelectedFile(file)}
//                               className="flex-1 text-center bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
//                            >
//                              View
//                           </button>

//                            {/* DELETE */}

//                            <button
//                               onClick={() => handleDeleteFile(file._id)}
//                               className="px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition text-sm font-medium"
//                            >
//                               Delete
//                            </button>

//                         </div>

//                      </td>

//                      </tr>
//                  ))}

//                  </tbody>
//                 </table>
//                )}

//          </div>

//       </div>

//       {/* FILE VIEWER MODAL */}

//        {selectedFile && (

//             <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">

//                  <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative">

//                    {/* HEADER */}

//                    <div className="flex items-center justify-between border-b px-5 py-4">

//                       <h2 className="font-semibold text-gray-800 truncate">

//                            {selectedFile.public_id?.split("/").pop()}

//                       </h2>

//                       <button
//                            onClick={() => setSelectedFile(null)}
//                            className="text-2xl text-gray-500 hover:text-black"
//                        >
//                            ✕
//                        </button>

//                      </div>

//                      {/* CONTENT */}

//                      <div className="h-[80vh] overflow-auto bg-gray-100 flex items-center justify-center">

//                      {/* IMAGE */}

//                      {selectedFile.fileType?.startsWith("image") && (

//                         <img
//                          src={selectedFile.url}
//                          alt=""
//                          className="max-w-full max-h-full object-contain"
//                         />

//                      )}

//                      {/* PDF */}

//                      {selectedFile.fileType?.includes("pdf") && (

//                          <iframe
//                             src={selectedFile.url}
//                             title="PDF Viewer"
//                             className="w-full h-full"
//                           />

//                      )}

//                      {/* OTHER FILES */}

//                          {!selectedFile.fileType?.startsWith("image") &&
//                            !selectedFile.fileType?.includes("pdf") && (

//                         <div className="text-center p-10">

//                             <div className="text-6xl">
//                                  📁
//                             </div>

//                             <p className="mt-4 text-gray-600">
//                                Preview not available for this file type
//                              </p>

//                              <a
//                                href={selectedFile.url}
//                                target="_blank"
//                                rel="noreferrer"
//                                className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl"
//                              >
//                                 Open File
//                               </a>
//                         </div>
//                      )}
//                </div>
//             </div>
//          </div>
//       )}
//    </div>
//    </div>
//  );
// };

// export default React.memo(UserProfile);


